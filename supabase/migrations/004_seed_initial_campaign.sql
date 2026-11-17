-- One Human Initiative - Seed Initial Campaign Data
-- Version: 1.0.0

-- ============================================================================
-- INSERT INITIAL CAMPAIGN
-- ============================================================================
-- NOTE: Update start_date and end_date before running!
-- Campaign runs for 30 days from start_date.
-- Status should be 'draft' initially, then manually set to 'active' when ready to launch.

INSERT INTO campaigns (
    name,
    description,
    target,
    max_target,
    start_date,
    end_date,
    status,
    hero_title,
    hero_tagline,
    public_content
) VALUES (
    'One Human Initiative',
    'A privacy-conscious campaign to provide direct financial support to an anonymous individual. No tracking. No accounts. No compromise.',
    10000,
    50000,
    NOW() + INTERVAL '1 day',  -- Start tomorrow (adjust as needed)
    NOW() + INTERVAL '31 days', -- End 30 days after start
    'draft',
    'ONE HUMAN. ONE OPPORTUNITY.',
    'A privacy-conscious campaign to provide direct financial support to an anonymous individual. No tracking. No accounts. No compromise.',
    '## How It Works

This campaign runs for 30 days with a target of $10,000 and a maximum of $50,000.

**Contribution Methods:**
- **Bitcoin (BTC)** - Direct on-chain transactions
- **Solana (SOL)** - Fast, low-fee transactions
- **Phantom Username** - Send via Phantom wallet username
- **Ko-fi** - Traditional payment methods (requires platform approval)

**Verification Process:**
All blockchain transactions are manually verified by administrators before being counted toward the target. This ensures accuracy and prevents fraud.

**Privacy First:**
- No public donor directory
- No tracking or analytics
- No accounts required
- Optional repayment contact links (supporter-initiated only)

**Community Governance:**
If the target is reached early, the community can petition to increase it (up to $50,000 maximum). Petitions require 5 browser participation tokens to enter voting phase.'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT CAMPAIGN SETTINGS
-- ============================================================================
-- IMPORTANT: Replace placeholder addresses with REAL addresses before launch!
-- These are example/test addresses - DO NOT USE IN PRODUCTION

INSERT INTO campaign_settings (
    campaign_id,
    bitcoin_address,
    solana_address,
    phantom_username,
    kofi_enabled,
    kofi_url,
    kofi_label,
    kofi_status
)
SELECT
    id,
    'bc1qexample00000000000000000000000000000000000',  -- REPLACE WITH REAL BITCOIN ADDRESS
    'SolanaExample1111111111111111111111111111111111',  -- REPLACE WITH REAL SOLANA ADDRESS
    '@exampleusername',  -- REPLACE WITH REAL PHANTOM USERNAME
    FALSE,
    'https://ko-fi.com/exampleusername',
    'Support on Ko-fi',
    'pending_approval'
FROM campaigns
WHERE name = 'One Human Initiative'
ON CONFLICT (campaign_id) DO NOTHING;

-- ============================================================================
-- NO SAMPLE EXPENSES, UPDATES, PETITIONS, OR VOTES
-- ============================================================================
-- All sample/fictional data removed. Add real data manually via admin dashboard
-- after campaign launch and as needed.