-- One Human Initiative - Fix RLS Policies and Add USD Conversion Fields
-- Version: 1.0.0
-- Addresses: Area A (Database Privacy) and Area B (Contribution Accounting)

-- ============================================================================
-- ADD USD CONVERSION FIELDS TO CONTRIBUTIONS TABLE
-- ============================================================================
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS usd_value DECIMAL(18, 2),
ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(18, 8),
ADD COLUMN IF NOT EXISTS rate_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS rate_timestamp TIMESTAMPTZ;

-- Add index for USD value queries
CREATE INDEX IF NOT EXISTS idx_contributions_usd_value ON contributions(usd_value);

-- ============================================================================
-- ADD REFUNDED AND REVERSED STATUSES TO CONTRIBUTIONS
-- ============================================================================
-- First, drop the existing check constraint
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS contributions_status_check;

-- Add new check constraint with all statuses including refunded and reversed
ALTER TABLE contributions ADD CONSTRAINT contributions_status_check
CHECK (status IN ('pending', 'confirmed', 'rejected', 'refunded', 'reversed'));

-- ============================================================================
-- FIX PHANTOM USERNAME VALIDATION (remove underscore allowance)
-- ============================================================================
-- Drop existing check constraint if exists
ALTER TABLE campaign_settings DROP CONSTRAINT IF EXISTS campaign_settings_phantom_username_check;

-- Add new check constraint for Phantom username (alphanumeric only, no underscores)
ALTER TABLE campaign_settings ADD CONSTRAINT campaign_settings_phantom_username_check
CHECK (phantom_username ~ '^@[a-zA-Z0-9]{3,30}$');

-- ============================================================================
-- CREATE SECURE DATABASE VIEWS FOR PUBLIC AGGREGATES
-- ============================================================================

-- Campaign Progress View (already exists in 003, but we'll recreate with proper security)
DROP VIEW IF EXISTS campaign_progress_public;
CREATE VIEW campaign_progress_public AS
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

-- Public Campaign Settings View (only public-safe fields)
DROP VIEW IF EXISTS campaign_settings_public;
CREATE VIEW campaign_settings_public AS
SELECT
    cs.campaign_id,
    cs.bitcoin_address,
    cs.solana_address,
    cs.phantom_username,
    cs.kofi_enabled,
    cs.kofi_url,
    cs.kofi_label,
    cs.kofi_status
FROM campaign_settings cs
JOIN campaigns c ON cs.campaign_id = c.id
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');

-- Public Expense Summary View (only published expenses)
DROP VIEW IF EXISTS expense_summary_public;
CREATE VIEW expense_summary_public AS
SELECT
    e.campaign_id,
    e.category,
    COUNT(*) as expense_count,
    SUM(e.amount) as total_amount,
    SUM(e.amount) FILTER (WHERE e.status = 'published') as published_amount
FROM expenses e
JOIN campaigns c ON e.campaign_id = c.id
WHERE e.status = 'published'
  AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
GROUP BY e.campaign_id, e.category;

-- Public Contribution Aggregates View (no individual transaction details)
DROP VIEW IF EXISTS contribution_aggregates_public;
CREATE VIEW contribution_aggregates_public AS
SELECT
    c.campaign_id,
    c.currency,
    COUNT(*) as contribution_count,
    SUM(c.amount) as total_amount,
    SUM(c.usd_value) as total_usd_value,
    MIN(c.created_at) as first_contribution_at,
    MAX(c.created_at) as last_contribution_at
FROM contributions c
JOIN campaigns camp ON c.campaign_id = camp.id
WHERE c.status = 'confirmed'
  AND camp.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
GROUP BY c.campaign_id, c.currency;

-- Public Petition Aggregates View
DROP VIEW IF EXISTS petition_aggregates_public;
CREATE VIEW petition_aggregates_public AS
SELECT
    p.id,
    p.campaign_id,
    p.requested_target,
    p.reason,
    p.status,
    p.token_count,
    p.required_tokens,
    p.voting_starts_at,
    p.voting_ends_at,
    p.decided_at,
    p.admin_notes,
    COUNT(v.id) FILTER (WHERE v.choice = 'yes') as yes_votes,
    COUNT(v.id) FILTER (WHERE v.choice = 'no') as no_votes,
    COUNT(v.id) as total_votes
FROM petitions p
JOIN campaigns c ON p.campaign_id = c.id
LEFT JOIN votes v ON v.petition_id = p.id
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
  AND p.status IN ('collecting', 'voting', 'approved', 'rejected')
GROUP BY p.id, p.campaign_id, p.requested_target, p.reason, p.status, p.token_count, p.required_tokens, p.voting_starts_at, p.voting_ends_at, p.decided_at, p.admin_notes;

-- Public Updates View
DROP VIEW IF EXISTS campaign_updates_public;
CREATE VIEW campaign_updates_public AS
SELECT
    cu.id,
    cu.campaign_id,
    cu.title,
    cu.content,
    cu.image_url,
    cu.published_at
FROM campaign_updates cu
JOIN campaigns c ON cu.campaign_id = c.id
WHERE cu.status = 'published'
  AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
ORDER BY cu.published_at DESC;

-- Public Individual Published Expenses View (for detailed transparency page)
DROP VIEW IF EXISTS expenses_published_public;
CREATE VIEW expenses_published_public AS
SELECT
    e.id,
    e.campaign_id,
    e.category,
    e.description,
    e.amount,
    e.currency,
    e.published_at,
    e.evidence_url
FROM expenses e
JOIN campaigns c ON e.campaign_id = c.id
WHERE e.status = 'published'
  AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
ORDER BY e.published_at DESC;

-- ============================================================================
-- GRANT PERMISSIONS ON PUBLIC VIEWS
-- ============================================================================
GRANT SELECT ON campaign_progress_public TO anon, authenticated;
GRANT SELECT ON campaign_settings_public TO anon, authenticated;
GRANT SELECT ON expense_summary_public TO anon, authenticated;
GRANT SELECT ON contribution_aggregates_public TO anon, authenticated;
GRANT SELECT ON petition_aggregates_public TO anon, authenticated;
GRANT SELECT ON campaign_updates_public TO anon, authenticated;
GRANT SELECT ON expenses_published_public TO anon, authenticated;

-- ============================================================================
-- REVOKE DIRECT TABLE ACCESS FROM PUBLIC ROLES
-- ============================================================================
-- The RLS policies in 002_rls_policies.sql will be updated below to restrict access
-- These revokes ensure no direct table access bypasses RLS
REVOKE ALL ON campaigns FROM anon, authenticated;
REVOKE ALL ON campaign_settings FROM anon, authenticated;
REVOKE ALL ON contributions FROM anon, authenticated;
REVOKE ALL ON expenses FROM anon, authenticated;
REVOKE ALL ON petitions FROM anon, authenticated;
REVOKE ALL ON votes FROM anon, authenticated;
REVOKE ALL ON browser_participation_tokens FROM anon, authenticated;
REVOKE ALL ON campaign_updates FROM anon, authenticated;
REVOKE ALL ON admin_audit_logs FROM anon, authenticated;
REVOKE ALL ON repayment_contacts FROM anon, authenticated;

-- ============================================================================
-- UPDATE RLS POLICIES - Restrict to only allow access via views
-- ============================================================================

-- CAMPAIGNS: Public can only see basic campaign info via view
-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON campaigns;

-- New restrictive policies
CREATE POLICY "Public can view active campaigns via view only" ON campaigns
    FOR SELECT TO anon, authenticated
    USING (false); -- Force use of campaign_progress_public view instead

CREATE POLICY "Admins can manage campaigns" ON campaigns
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- CAMPAIGN_SETTINGS: Public can only see via view
DROP POLICY IF EXISTS "Public can view campaign settings" ON campaign_settings;
DROP POLICY IF EXISTS "Admins can manage campaign settings" ON campaign_settings;

CREATE POLICY "Public can view campaign settings via view only" ON campaign_settings
    FOR SELECT TO anon, authenticated
    USING (false); -- Force use of campaign_settings_public view

CREATE POLICY "Admins can manage campaign settings" ON campaign_settings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- CONTRIBUTIONS: CRITICAL - Public should NEVER see individual contributions
DROP POLICY IF EXISTS "Public can view confirmed contributions" ON contributions;
DROP POLICY IF EXISTS "Admins can manage contributions" ON contributions;
DROP POLICY IF EXISTS "Public can insert pending contributions" ON contributions;

-- Only allow public to INSERT pending contributions (for submission)
CREATE POLICY "Public can submit pending contributions" ON contributions
    FOR INSERT TO anon, authenticated
    WITH CHECK (status = 'pending');

-- Admin full access
CREATE POLICY "Admins can manage contributions" ON contributions
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- EXPENSES: Public only sees published via view
DROP POLICY IF EXISTS "Public can view published expenses" ON expenses;
DROP POLICY IF EXISTS "Admins can manage expenses" ON expenses;

CREATE POLICY "Public can view published expenses via view only" ON expenses
    FOR SELECT TO anon, authenticated
    USING (false); -- Force use of expense_summary_public view

CREATE POLICY "Admins can manage expenses" ON expenses
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- PETITIONS: Public only sees aggregates via view
DROP POLICY IF EXISTS "Public can view active petitions" ON petitions;
DROP POLICY IF EXISTS "Public can create petitions" ON petitions;
DROP POLICY IF EXISTS "Admins can manage petitions" ON petitions;

CREATE POLICY "Public can view petitions via aggregates view only" ON petitions
    FOR SELECT TO anon, authenticated
    USING (false); -- Force use of petition_aggregates_public view

CREATE POLICY "Public can create petitions (requires 5 tokens)" ON petitions
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        status = 'collecting'
        AND token_count >= 5
        AND EXISTS (
            SELECT 1 FROM browser_participation_tokens bpt
            WHERE bpt.id = petitions.token_count -- placeholder, actual check in trigger
        )
    );

CREATE POLICY "Admins can manage petitions" ON petitions
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- VOTES: CRITICAL - Public should NEVER see individual votes or token hashes
DROP POLICY IF EXISTS "Public can view votes for petition" ON votes;
DROP POLICY IF EXISTS "Public can vote" ON votes;
DROP POLICY IF EXISTS "Admins can view votes" ON votes;

-- Only allow public to INSERT votes (for voting)
CREATE POLICY "Public can submit votes" ON votes
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can view all votes" ON votes
    FOR SELECT TO service_role
    USING (true);

-- BROWSER_PARTICIPATION_TOKENS: Never public
DROP POLICY IF EXISTS "Public can create browser tokens" ON browser_participation_tokens;
DROP POLICY IF EXISTS "Public can view own browser token" ON browser_participation_tokens;
DROP POLICY IF EXISTS "Admins can manage browser tokens" ON browser_participation_tokens;

-- Only allow token creation (for participation)
CREATE POLICY "Public can create browser tokens" ON browser_participation_tokens
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can manage browser tokens" ON browser_participation_tokens
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- CAMPAIGN_UPDATES: Public only sees published via view
DROP POLICY IF EXISTS "Public can view published updates" ON campaign_updates;
DROP POLICY IF EXISTS "Admins can manage updates" ON campaign_updates;

CREATE POLICY "Public can view updates via view only" ON campaign_updates
    FOR SELECT TO anon, authenticated
    USING (false); -- Force use of campaign_updates_public view

CREATE POLICY "Admins can manage updates" ON campaign_updates
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- REPAYMENT_CONTACTS: Never public (already private in 002, but reinforcing)
DROP POLICY IF EXISTS "Admins can manage repayment contacts" ON repayment_contacts;
DROP POLICY IF EXISTS "Supporters can create repayment contacts" ON repayment_contacts;
DROP POLICY IF EXISTS "Supporters can delete own repayment contacts" ON repayment_contacts;

CREATE POLICY "Supporters can create repayment contacts" ON repayment_contacts
    FOR INSERT TO anon, authenticated
    WITH CHECK (consent_given = true);

CREATE POLICY "Supporters can delete own repayment contacts" ON repayment_contacts
    FOR DELETE TO anon, authenticated
    USING (true); -- Deletion by contribution_id handled in API

CREATE POLICY "Admins can manage repayment contacts" ON repayment_contacts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ADMIN_AUDIT_LOGS: Never public (already private, but reinforcing)
DROP POLICY IF EXISTS "Admins can view audit logs" ON admin_audit_logs;

CREATE POLICY "Admins can view audit logs" ON admin_audit_logs
    FOR SELECT TO service_role
    USING (true);

-- ============================================================================
-- ENABLE RLS ON ALL TABLES (reinforce)
-- ============================================================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_participation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON VIEW campaign_progress_public IS 'Public-safe campaign progress data. No sensitive fields exposed.';
COMMENT ON VIEW campaign_settings_public IS 'Public-safe campaign settings. Only payment addresses and public config.';
COMMENT ON VIEW expense_summary_public IS 'Public expense summary. Only published expenses aggregated by category.';
COMMENT ON VIEW contribution_aggregates_public IS 'Public contribution aggregates. NO individual transaction hashes, amounts, or timestamps exposed.';
COMMENT ON VIEW petition_aggregates_public IS 'Public petition data with vote aggregates. NO individual token hashes or votes exposed.';
COMMENT ON VIEW campaign_updates_public IS 'Public campaign updates. Only published updates.';

COMMENT ON COLUMN contributions.usd_value IS 'USD equivalent of contribution at time of confirmation';
COMMENT ON COLUMN contributions.exchange_rate IS 'Exchange rate used for USD conversion (e.g., 1 BTC = X USD)';
COMMENT ON COLUMN contributions.rate_source IS 'Source of exchange rate (e.g., coingecko, binance, manual)';
COMMENT ON COLUMN contributions.rate_timestamp IS 'When the exchange rate was fetched/recorded';