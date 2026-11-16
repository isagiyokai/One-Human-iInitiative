-- One Human Initiative - Seed Initial Campaign Data
-- Version: 1.0.0

-- ============================================================================
-- INSERT INITIAL CAMPAIGN
-- ============================================================================
-- Note: Update dates as needed before running
-- Start: 2024-01-15 00:00:00 UTC
-- End: 2024-02-14 23:59:59 UTC (30 days)

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
    '2024-01-15 00:00:00+00',
    '2024-02-14 23:59:59+00',
    'active',
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
-- NOTE: Replace placeholder addresses with real ones before launch!

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
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',  -- REPLACE WITH REAL ADDRESS
    '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAtU',  -- REPLACE WITH REAL ADDRESS
    '@onehumaninitiative',  -- REPLACE WITH REAL USERNAME
    FALSE,
    'https://ko-fi.com/onehumaninitiative',
    'Support on Ko-fi',
    'pending_approval'
FROM campaigns
WHERE name = 'One Human Initiative'
ON CONFLICT (campaign_id) DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE EXPENSES (for testing transparency page)
-- ============================================================================
INSERT INTO expenses (campaign_id, category, description, amount, currency, status, evidence_url, published_at)
SELECT
    c.id,
    'Hosting & Infrastructure',
    'Vercel Pro plan - 3 months',
    60.00,
    'USD',
    'published',
    'https://example.com/receipts/vercel-pro-q1.pdf',
    '2024-01-15 09:00:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (campaign_id, category, description, amount, currency, status, evidence_url, published_at)
SELECT
    c.id,
    'Domain & SSL',
    'onehumaninitiative.org domain registration (1 year)',
    12.50,
    'USD',
    'published',
    'https://example.com/receipts/domain.pdf',
    '2024-01-15 09:00:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (campaign_id, category, description, amount, currency, status, evidence_url, published_at)
SELECT
    c.id,
    'Legal & Compliance',
    'Privacy policy legal review',
    500.00,
    'USD',
    'published',
    'https://example.com/receipts/legal-review.pdf',
    '2024-01-16 10:00:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (campaign_id, category, description, amount, currency, status)
SELECT
    c.id,
    'Payment Processing',
    'Ko-fi platform setup fee (pending approval)',
    50.00,
    'USD',
    'draft'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE UPDATES
-- ============================================================================
INSERT INTO campaign_updates (campaign_id, title, content, status, published_at)
SELECT
    c.id,
    'Campaign Launched!',
    'We are excited to announce the launch of the One Human Initiative. Thank you to everyone who has already contributed.',
    'published',
    '2024-01-15 00:00:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO campaign_updates (campaign_id, title, content, status, published_at)
SELECT
    c.id,
    'First Milestone Reached',
    'We have reached $10,000 in confirmed contributions! This is an incredible start. The community petition for increasing the target is now open.',
    'published',
    '2024-01-18 15:30:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO campaign_updates (campaign_id, title, content, status, published_at)
SELECT
    c.id,
    'Transparency Report - Week 1',
    'Our first weekly transparency report is now available. View all expenses and contributions on the transparency page.',
    'published',
    '2024-01-22 10:00:00+00'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE PETITION
-- ============================================================================
INSERT INTO petitions (campaign_id, requested_target, reason, status, token_count, required_tokens, voting_starts_at, voting_ends_at, decided_at, admin_notes)
SELECT
    c.id,
    25000,
    'The initial target was reached quickly. Many supporters want to continue helping.',
    'approved',
    12,
    5,
    '2024-01-19 10:00:00+00',
    '2024-01-26 10:00:00+00',
    '2024-01-27 09:00:00+00',
    'Approved - target increased to $25,000'
FROM campaigns c WHERE c.name = 'One Human Initiative'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE VOTES
-- ============================================================================
INSERT INTO votes (petition_id, token_hash, choice)
SELECT
    p.id,
    'abc123def456789012345678901234567890abcdef12345678901234567890ab',
    'yes'
FROM petitions p
JOIN campaigns c ON p.campaign_id = c.id
WHERE c.name = 'One Human Initiative' AND p.requested_target = 25000
ON CONFLICT DO NOTHING;

INSERT INTO votes (petition_id, token_hash, choice)
SELECT
    p.id,
    'def456789012345678901234567890abcdef12345678901234567890abcdef12',
    'yes'
FROM petitions p
JOIN campaigns c ON p.campaign_id = c.id
WHERE c.name = 'One Human Initiative' AND p.requested_target = 25000
ON CONFLICT DO NOTHING;

INSERT INTO votes (petition_id, token_hash, choice)
SELECT
    p.id,
    'ghi789012345678901234567890abcdef12345678901234567890abcdef123456',
    'no'
FROM petitions p
JOIN campaigns c ON p.campaign_id = c.id
WHERE c.name = 'One Human Initiative' AND p.requested_target = 25000
ON CONFLICT DO NOTHING;