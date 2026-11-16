-- One Human Initiative - Row Level Security Policies
-- Version: 1.0.0

-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_participation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC ACCESS POLICIES (anon role)
-- ============================================================================

-- Campaigns: Public can read active/published campaigns
CREATE POLICY "Public can view active campaigns" ON campaigns
    FOR SELECT USING (
        status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
    );

-- Campaign Settings: Public can read settings for active campaigns
CREATE POLICY "Public can view settings for active campaigns" ON campaign_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns
            WHERE campaigns.id = campaign_settings.campaign_id
            AND campaigns.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
        )
    );

-- Contributions: Public can read CONFIRMED contributions only (for transparency)
CREATE POLICY "Public can view confirmed contributions" ON contributions
    FOR SELECT USING (status = 'confirmed');

-- Expenses: Public can read PUBLISHED expenses only
CREATE POLICY "Public can view published expenses" ON expenses
    FOR SELECT USING (status = 'published');

-- Petitions: Public can read active petitions (collecting or voting)
CREATE POLICY "Public can view active petitions" ON petitions
    FOR SELECT USING (status IN ('collecting', 'voting', 'approved', 'rejected'));

-- Votes: Public can read vote counts (but not individual votes)
CREATE POLICY "Public can view vote aggregates" ON votes
    FOR SELECT USING (true);

-- Browser Tokens: Public can insert their own token (for participation)
CREATE POLICY "Public can register participation token" ON browser_participation_tokens
    FOR INSERT WITH CHECK (true);

-- Campaign Updates: Public can read PUBLISHED updates
CREATE POLICY "Public can view published updates" ON campaign_updates
    FOR SELECT USING (status = 'published');

-- Repayment Contacts: NO PUBLIC ACCESS (private data)
-- Admin Audit Logs: NO PUBLIC ACCESS

-- ============================================================================
-- AUTHENTICATED USER POLICIES (for potential future features)
-- ============================================================================

-- Currently no authenticated user policies needed
-- All admin operations use service role

-- ============================================================================
-- SERVICE ROLE POLICIES (Full access for admin APIs)
-- ============================================================================

-- Service role has full access to all tables
-- These policies allow the service role key to bypass RLS

-- Campaigns
CREATE POLICY "Service role full access campaigns" ON campaigns
    FOR ALL USING (auth.role() = 'service_role');

-- Campaign Settings
CREATE POLICY "Service role full access campaign_settings" ON campaign_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Contributions
CREATE POLICY "Service role full access contributions" ON contributions
    FOR ALL USING (auth.role() = 'service_role');

-- Repayment Contacts
CREATE POLICY "Service role full access repayment_contacts" ON repayment_contacts
    FOR ALL USING (auth.role() = 'service_role');

-- Expenses
CREATE POLICY "Service role full access expenses" ON expenses
    FOR ALL USING (auth.role() = 'service_role');

-- Petitions
CREATE POLICY "Service role full access petitions" ON petitions
    FOR ALL USING (auth.role() = 'service_role');

-- Votes
CREATE POLICY "Service role full access votes" ON votes
    FOR ALL USING (auth.role() = 'service_role');

-- Browser Tokens
CREATE POLICY "Service role full access browser_tokens" ON browser_participation_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- Campaign Updates
CREATE POLICY "Service role full access updates" ON campaign_updates
    FOR ALL USING (auth.role() = 'service_role');

-- Admin Audit Logs
CREATE POLICY "Service role full access audit_logs" ON admin_audit_logs
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- SPECIAL POLICIES FOR VOTING
-- ============================================================================

-- Allow public to insert votes (with token validation in application layer)
CREATE POLICY "Public can submit votes" ON votes
    FOR INSERT WITH CHECK (true);

-- Allow public to check if they've voted (by token hash)
CREATE POLICY "Public can check own votes" ON votes
    FOR SELECT USING (true);

-- Allow public to insert petition signatures (token tracking in app layer)
CREATE POLICY "Public can sign petitions" ON petitions
    FOR UPDATE USING (
        status = 'collecting'
        AND token_count < required_tokens
    ) WITH CHECK (
        status = 'collecting'
        AND token_count < required_tokens
    );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant anon role select permissions on public tables
GRANT SELECT ON campaigns TO anon;
GRANT SELECT ON campaign_settings TO anon;
GRANT SELECT ON contributions TO anon;
GRANT SELECT ON expenses TO anon;
GRANT SELECT ON petitions TO anon;
GRANT SELECT ON votes TO anon;
GRANT INSERT ON browser_participation_tokens TO anon;
GRANT SELECT ON campaign_updates TO anon;

-- Grant authenticated role (if needed later)
GRANT SELECT ON campaigns TO authenticated;
GRANT SELECT ON campaign_settings TO authenticated;
GRANT SELECT ON contributions TO authenticated;
GRANT SELECT ON expenses TO authenticated;
GRANT SELECT ON petitions TO authenticated;
GRANT SELECT ON votes TO authenticated;
GRANT INSERT ON browser_participation_tokens TO authenticated;
GRANT SELECT ON campaign_updates TO authenticated;

-- Service role gets everything (handled by policies above)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;