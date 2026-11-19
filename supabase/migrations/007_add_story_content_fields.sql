-- One Human Initiative - Add Story/Content Fields for Admin Storyboard
-- Version: 1.0.0
-- Adds story content fields to campaigns table and updates public views

-- ============================================================================
-- ADD STORY/CONTENT FIELDS TO CAMPAIGNS TABLE
-- ============================================================================

-- Add story/content fields for the CampaignExplanation tabs
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS story_title VARCHAR(200) DEFAULT 'The Person Behind the Campaign',
ADD COLUMN IF NOT EXISTS story_content TEXT DEFAULT 'Behind this campaign is one person — a human being with dreams, struggles, and a story that matters. They''ve chosen to remain anonymous to protect their privacy and dignity. This isn''t about publicity or recognition; it''s about one human helping another.',
ADD COLUMN IF NOT EXISTS privacy_title VARCHAR(200) DEFAULT 'Why Anonymity Matters',
ADD COLUMN IF NOT EXISTS privacy_content TEXT DEFAULT 'Anonymity protects the recipient from unwanted attention, harassment, and the complications that come with public fundraising. It also protects contributors — your generosity stays between you and the cause. No names, no tracking, no data harvesting. Just human kindness.',
ADD COLUMN IF NOT EXISTS process_title VARCHAR(200) DEFAULT 'How It Works',
ADD COLUMN IF NOT EXISTS process_content TEXT DEFAULT '1. Choose a contribution method (Bitcoin, Solana, Phantom Username, or Ko-fi)
2. Send your contribution directly to the provided address
3. Submit the transaction hash for verification
4. Admin manually verifies on-chain
5. Once confirmed, your contribution counts toward the target
6. 100% of confirmed funds go to the recipient',
ADD COLUMN IF NOT EXISTS custom_blocks JSONB DEFAULT '[]'::jsonb;

-- ============================================================================
-- UPDATE SEED DATA WITH NEW FIELDS
-- ============================================================================
UPDATE campaigns
SET
    story_title = 'The Person Behind the Campaign',
    story_content = 'Behind this campaign is one person — a human being with dreams, struggles, and a story that matters. They''ve chosen to remain anonymous to protect their privacy and dignity. This isn''t about publicity or recognition; it''s about one human helping another.',
    privacy_title = 'Why Anonymity Matters',
    privacy_content = 'Anonymity protects the recipient from unwanted attention, harassment, and the complications that come with public fundraising. It also protects contributors — your generosity stays between you and the cause. No names, no tracking, no data harvesting. Just human kindness.',
    process_title = 'How It Works',
    process_content = '1. Choose a contribution method (Bitcoin, Solana, Phantom Username, or Ko-fi)
2. Send your contribution directly to the provided address
3. Submit the transaction hash for verification
4. Admin manually verifies on-chain
5. Once confirmed, your contribution counts toward the target
6. 100% of confirmed funds go to the recipient',
    custom_blocks = '[]'::jsonb
WHERE name = 'One Human Initiative';

-- ============================================================================
-- UPDATE PUBLIC VIEWS TO INCLUDE STORY FIELDS
-- ============================================================================

-- Update campaign_progress_public view to include story fields
DROP VIEW IF EXISTS campaign_progress_public;
CREATE VIEW campaign_progress_public AS
SELECT
    c.id,
    c.name,
    c.description,
    c.target,
    c.max_target,
    c.confirmed_amount,
    c.confirmed_count,
    c.status,
    c.start_date,
    c.end_date,
    c.hero_title,
    c.hero_tagline,
    c.public_content,
    c.story_title,
    c.story_content,
    c.privacy_title,
    c.privacy_content,
    c.process_title,
    c.process_content,
    c.custom_blocks,
    CASE
        WHEN c.target > 0 THEN ROUND((c.confirmed_amount / c.target) * 100, 2)
        ELSE 0
    END AS percentage,
    GREATEST(c.target - c.confirmed_amount, 0) AS remaining,
    compute_campaign_status(c.status, c.start_date, c.end_date, c.confirmed_amount, c.target) AS computed_status,
    c.created_at
FROM campaigns c
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');

-- Update campaign_settings_public view to include story fields from campaigns table
-- (Note: We're keeping the view as-is for payment settings, but the API will join both views)
-- The API will now query both views and merge the data

-- ============================================================================
-- GRANT PERMISSIONS ON UPDATED VIEWS
-- ============================================================================
GRANT SELECT ON campaign_progress_public TO anon, authenticated;
GRANT SELECT ON campaign_settings_public TO anon, authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON COLUMN campaigns.story_title IS 'Title for the Story tab in CampaignExplanation';
COMMENT ON COLUMN campaigns.story_content IS 'Content for the Story tab (Markdown supported)';
COMMENT ON COLUMN campaigns.privacy_title IS 'Title for the Privacy tab in CampaignExplanation';
COMMENT ON COLUMN campaigns.privacy_content IS 'Content for the Privacy tab (Markdown supported)';
COMMENT ON COLUMN campaigns.process_title IS 'Title for the How It Works tab in CampaignExplanation';
COMMENT ON COLUMN campaigns.process_content IS 'Content for the How It Works tab (one step per line, Markdown supported)';
COMMENT ON COLUMN campaigns.custom_blocks IS 'JSONB array of custom storyboard blocks for homepage: [{id, title, content, type}]';