-- One Human Initiative - Functions and Triggers
-- Version: 1.0.0

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_settings_updated_at
    BEFORE UPDATE ON campaign_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributions_updated_at
    BEFORE UPDATE ON contributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_petitions_updated_at
    BEFORE UPDATE ON petitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_updates_updated_at
    BEFORE UPDATE ON campaign_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CAMPAIGN STATUS COMPUTATION
-- ============================================================================
CREATE OR REPLACE FUNCTION compute_campaign_status(
    p_status VARCHAR,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ,
    p_confirmed_amount DECIMAL,
    p_target INTEGER
)
RETURNS VARCHAR AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_start TIMESTAMPTZ := p_start_date;
    v_end TIMESTAMPTZ := p_end_date;
BEGIN
    -- If manually set to paused or completed, respect that
    IF p_status IN ('paused', 'completed') THEN
        RETURN p_status;
    END IF;

    -- Not started yet
    IF v_now < v_start THEN
        RETURN 'draft';
    END IF;

    -- Expired
    IF v_now > v_end THEN
        RETURN 'expired';
    END IF;

    -- Target reached
    IF p_confirmed_amount >= p_target THEN
        RETURN 'target_reached';
    END IF;

    -- Active
    RETURN 'active';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- AUTO-UPDATE CAMPAIGN STATUS ON CONTRIBUTION CONFIRMATION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_campaign_on_contribution_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    v_campaign campaigns%ROWTYPE;
    v_new_status VARCHAR;
    v_usd_value DECIMAL(18, 2);
BEGIN
    -- Only act on status change TO confirmed
    IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
        -- Get campaign
        SELECT * INTO v_campaign FROM campaigns WHERE id = NEW.campaign_id;

        -- Use USD value for campaign totals (fallback to amount if usd_value not set)
        v_usd_value := COALESCE(NEW.usd_value, NEW.amount);

        -- Compute new status
        v_new_status := compute_campaign_status(
            v_campaign.status,
            v_campaign.start_date,
            v_campaign.end_date,
            v_campaign.confirmed_amount + v_usd_value,
            v_campaign.target
        );

        -- Update campaign
        UPDATE campaigns SET
            confirmed_amount = confirmed_amount + v_usd_value,
            confirmed_count = confirmed_count + 1,
            status = v_new_status,
            updated_at = NOW()
        WHERE id = NEW.campaign_id;
    END IF;

    -- Handle rejection (no change to campaign totals)
    IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
        -- Just log, no campaign update needed
        NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_on_contribution
    AFTER UPDATE ON contributions
    FOR EACH ROW EXECUTE FUNCTION update_campaign_on_contribution_confirmation();

-- ============================================================================
-- PETITION THRESHOLD CHECK
-- ============================================================================
CREATE OR REPLACE FUNCTION check_petition_threshold()
RETURNS TRIGGER AS $$
BEGIN
    -- When token_count reaches required_tokens, move to voting
    IF NEW.token_count >= NEW.required_tokens
       AND OLD.token_count < NEW.required_tokens
       AND NEW.status = 'collecting' THEN
        NEW.status := 'voting';
        NEW.voting_starts_at := NOW();
        NEW.voting_ends_at := NOW() + INTERVAL '7 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_petition_threshold
    BEFORE UPDATE ON petitions
    FOR EACH ROW EXECUTE FUNCTION check_petition_threshold();

-- ============================================================================
-- VOTE COUNT AGGREGATION (for public view)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_petition_vote_counts(p_petition_id UUID)
RETURNS TABLE(yes_count BIGINT, no_count BIGINT, total_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE choice = 'yes')::BIGINT,
        COUNT(*) FILTER (WHERE choice = 'no')::BIGINT,
        COUNT(*)::BIGINT
    FROM votes
    WHERE petition_id = p_petition_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- CAMPAIGN PROGRESS VIEW
-- ============================================================================
CREATE OR REPLACE VIEW campaign_progress AS
SELECT
    c.id,
    c.name,
    c.target,
    c.max_target,
    c.confirmed_amount,
    c.confirmed_count,
    c.status,
    c.start_date,
    c.end_date,
    CASE
        WHEN c.target > 0 THEN ROUND((c.confirmed_amount / c.target) * 100, 2)
        ELSE 0
    END AS percentage,
    GREATEST(c.target - c.confirmed_amount, 0) AS remaining,
    compute_campaign_status(c.status, c.start_date, c.end_date, c.confirmed_amount, c.target) AS computed_status
FROM campaigns c
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');

-- ============================================================================
-- EXPENSE SUMMARY VIEW
-- ============================================================================
CREATE OR REPLACE VIEW expense_summary AS
SELECT
    e.campaign_id,
    e.category,
    COUNT(*) as expense_count,
    SUM(e.amount) as total_amount,
    SUM(e.amount) FILTER (WHERE e.status = 'published') as published_amount,
    SUM(e.amount) FILTER (WHERE e.status = 'draft') as draft_amount
FROM expenses e
GROUP BY e.campaign_id, e.category;

-- ============================================================================
-- CLEANUP FUNCTION FOR EXPIRED CAMPAIGNS
-- ============================================================================
CREATE OR REPLACE FUNCTION expire_campaigns()
RETURNS VOID AS $$
BEGIN
    UPDATE campaigns
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active'
    AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTO-EXPIRE CAMPAIGNS (can be run via cron)
-- ============================================================================
-- SELECT cron.schedule('expire-campaigns', '0 * * * *', 'SELECT expire_campaigns();');

-- ============================================================================
-- HELPER: CHECK IF TOKEN HAS VOTED
-- ============================================================================
CREATE OR REPLACE FUNCTION token_has_voted(p_petition_id UUID, p_token_hash VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM votes
    WHERE petition_id = p_petition_id AND token_hash = p_token_hash;

    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- HELPER: INCREMENT PETITION TOKEN COUNT
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_petition_token_count(p_petition_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE petitions
    SET token_count = token_count + 1, updated_at = NOW()
    WHERE id = p_petition_id AND status = 'collecting';
END;
$$ LANGUAGE plpgsql;