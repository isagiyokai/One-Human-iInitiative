# Database Schema Documentation

Complete database schema for the One Human Initiative.

## Overview

PostgreSQL database hosted on Supabase with Row Level Security (RLS) enabled on all tables.

## Tables

### campaigns

Core campaign configuration. Only one active campaign at a time.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Campaign name |
| description | TEXT | NOT NULL | Public description |
| target | INTEGER | NOT NULL, CHECK (1000-50000) | Funding target in USD |
| max_target | INTEGER | NOT NULL, CHECK (10000-50000) | Maximum possible target |
| start_date | TIMESTAMPTZ | NOT NULL | Campaign start (UTC) |
| end_date | TIMESTAMPTZ | NOT NULL | Campaign end (UTC) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | Campaign status |
| hero_title | VARCHAR(200) | NOT NULL | Homepage hero title |
| hero_tagline | VARCHAR(500) | NOT NULL | Homepage hero tagline |
| public_content | TEXT | | Additional public content (Markdown) |
| confirmed_amount | DECIMAL(20,8) | NOT NULL, DEFAULT 0 | Total confirmed contributions |
| confirmed_count | INTEGER | NOT NULL, DEFAULT 0 | Number of confirmed contributions |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Status Values**: `draft`, `active`, `paused`, `target_reached`, `expired`, `completed`

**Constraints**:
- `target <= max_target`
- Only one campaign per status group typically

### campaign_settings

Payment addresses and configuration for a campaign.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| campaign_id | UUID | FK → campaigns(id), UNIQUE | Linked campaign |
| bitcoin_address | VARCHAR(100) | NOT NULL | BTC receiving address |
| solana_address | VARCHAR(100) | NOT NULL | SOL receiving address |
| phantom_username | VARCHAR(50) | NOT NULL | Phantom wallet username |
| kofi_enabled | BOOLEAN | NOT NULL, DEFAULT FALSE | Ko-fi integration enabled |
| kofi_url | VARCHAR(500) | | Ko-fi page URL |
| kofi_label | VARCHAR(100) | DEFAULT 'Support on Ko-fi' | Button label |
| kofi_status | VARCHAR(20) | NOT NULL, DEFAULT 'pending_approval' | Ko-fi status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Ko-fi Status Values**: `pending_approval`, `active`, `disabled`

### contributions

Individual contribution records with verification status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| campaign_id | UUID | FK → campaigns(id) | Linked campaign |
| payment_method | VARCHAR(20) | NOT NULL | Payment method used |
| transaction_hash | VARCHAR(200) | NOT NULL | Blockchain transaction ID |
| amount | DECIMAL(20,8) | NOT NULL, CHECK (> 0) | Contribution amount |
| currency | VARCHAR(3) | NOT NULL | Currency code (BTC, SOL, USD) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Verification status |
| submitted_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Submission timestamp |
| confirmed_at | TIMESTAMPTZ | | Admin confirmation timestamp |
| recon_notes | TEXT | | Admin reconciliation notes |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Payment Methods**: `bitcoin`, `solana`, `phantom`, `kofi`

**Status Values**: `pending`, `confirmed`, `rejected`

**Unique Constraint**: `(payment_method, transaction_hash)` - Prevents duplicate submissions

### repayment_contacts

Optional supporter contact links for potential repayment. **Never exposed publicly.**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| contribution_id | UUID | FK → contributions(id), UNIQUE | Linked contribution |
| platform | VARCHAR(20) | NOT NULL | Contact platform |
| url | VARCHAR(500) | NOT NULL | Profile URL |
| consent_given | BOOLEAN | NOT NULL, DEFAULT FALSE | Explicit consent |
| consent_at | TIMESTAMPTZ | | Consent timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| deleted_at | TIMESTAMPTZ | | Soft delete timestamp |

**Platforms**: `ko-fi`, `buy-me-a-coffee`

**RLS**: No public access - Admin only

### expenses

Campaign expenditure records with publication status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| campaign_id | UUID | FK → campaigns(id) | Linked campaign |
| category | VARCHAR(100) | NOT NULL | Expense category |
| description | TEXT | NOT NULL | Detailed description |
| amount | DECIMAL(20,2) | NOT NULL, CHECK (> 0) | Expense amount |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'USD' | Currency code |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | Publication status |
| evidence_url | VARCHAR(500) | | Receipt/evidence URL |
| published_at | TIMESTAMPTZ | | Publication timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Status Values**: `draft`, `published`

**Categories** (suggested):
- Hosting & Infrastructure
- Domain & SSL
- Payment Processing
- Legal & Compliance
- Design & Development
- Marketing & Outreach
- Transaction Fees
- Other

### petitions

Community proposals to increase campaign target.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| campaign_id | UUID | FK → campaigns(id) | Linked campaign |
| requested_target | INTEGER | NOT NULL, CHECK (10000-50000) | Proposed new target |
| reason | TEXT | NOT NULL | Justification |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'collecting' | Petition status |
| token_count | INTEGER | NOT NULL, DEFAULT 0 | Signatures collected |
| required_tokens | INTEGER | NOT NULL, DEFAULT 5 | Signatures needed |
| voting_starts_at | TIMESTAMPTZ | | Voting period start |
| voting_ends_at | TIMESTAMPTZ | | Voting period end |
| decided_at | TIMESTAMPTZ | | Admin decision timestamp |
| admin_notes | TEXT | | Admin decision notes |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Status Values**: `collecting`, `voting`, `approved`, `rejected`, `cancelled`

**Threshold**: 5 browser tokens required to enter voting

### votes

Individual votes on petitions (browser-token based).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| petition_id | UUID | FK → petitions(id) | Linked petition |
| token_hash | VARCHAR(64) | NOT NULL | SHA-256 hashed browser token |
| choice | VARCHAR(3) | NOT NULL | Vote choice |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Vote timestamp |

**Choices**: `yes`, `no`

**Unique Constraint**: `(petition_id, token_hash)` - One vote per token per petition

### browser_participation_tokens

Anonymous browser participation tokens for voting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| token_hash | VARCHAR(64) | NOT NULL, UNIQUE | SHA-256 hashed token |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Token creation |
| last_used_at | TIMESTAMPTZ | | Last activity |

**Token Generation**: Client-side crypto.randomUUID() → SHA-256 hash stored

### campaign_updates

Public campaign updates/announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| campaign_id | UUID | FK → campaigns(id) | Linked campaign |
| title | VARCHAR(200) | NOT NULL | Update title |
| content | TEXT | NOT NULL | Update content (Markdown) |
| image_url | VARCHAR(500) | | Optional image |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | Publication status |
| published_at | TIMESTAMPTZ | | Publication timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Status Values**: `draft`, `published`

### admin_audit_logs

Immutable audit trail of all admin actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| admin_id | UUID | NOT NULL | Admin user ID |
| admin_email | VARCHAR(255) | NOT NULL | Admin email |
| action | VARCHAR(100) | NOT NULL | Action identifier |
| resource | VARCHAR(50) | NOT NULL | Resource type |
| resource_id | UUID | | Affected resource ID |
| details | JSONB | | Action details |
| ip_hash | VARCHAR(64) | NOT NULL | Hashed IP address |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Action timestamp |

**Actions** (examples):
- `campaign.settings_updated`
- `payment.bitcoin_address_updated`
- `contribution.verified`
- `contribution.rejected`
- `expense.created`
- `expense.published`
- `petition.approved`
- `update.published`
- `asset.uploaded`

**RLS**: Admin only - No public access

## Views

### campaign_progress

Computed campaign progress for public display.

```sql
SELECT 
    c.id, c.name, c.target, c.max_target,
    c.confirmed_amount, c.confirmed_count,
    c.status, c.start_date, c.end_date,
    ROUND((c.confirmed_amount / c.target) * 100, 2) AS percentage,
    GREATEST(c.target - c.confirmed_amount, 0) AS remaining,
    compute_campaign_status(...) AS computed_status
FROM campaigns c
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');
```

### expense_summary

Aggregated expenses by category.

```sql
SELECT 
    e.campaign_id, e.category,
    COUNT(*) as expense_count,
    SUM(e.amount) as total_amount,
    SUM(e.amount) FILTER (WHERE e.status = 'published') as published_amount,
    SUM(e.amount) FILTER (WHERE e.status = 'draft') as draft_amount
FROM expenses e
GROUP BY e.campaign_id, e.category;
```

## Functions

### update_updated_at_column()

Trigger function to auto-update `updated_at` timestamp.

### compute_campaign_status()

Immutably computes campaign status from parameters.

### update_campaign_on_contribution_confirmation()

Trigger: Updates campaign totals when contribution confirmed.

### check_petition_threshold()

Trigger: Moves petition to voting when threshold met.

### get_petition_vote_counts(petition_id)

Returns yes/no/total vote counts for a petition.

### token_has_voted(petition_id, token_hash)

Checks if a token has already voted.

### increment_petition_token_count(petition_id)

Increments petition signature count.

### expire_campaigns()

Sets active campaigns to expired when end_date passed.

## Triggers

| Trigger | Table | Timing | Function |
|---------|-------|--------|----------|
| update_campaigns_updated_at | campaigns | BEFORE UPDATE | update_updated_at_column |
| update_campaign_settings_updated_at | campaign_settings | BEFORE UPDATE | update_updated_at_column |
| update_contributions_updated_at | contributions | BEFORE UPDATE | update_updated_at_column |
| update_expenses_updated_at | expenses | BEFORE UPDATE | update_updated_at_column |
| update_petitions_updated_at | petitions | BEFORE UPDATE | update_updated_at_column |
| update_campaign_updates_updated_at | campaign_updates | BEFORE UPDATE | update_updated_at_column |
| trigger_update_campaign_on_contribution | contributions | AFTER UPDATE | update_campaign_on_contribution_confirmation |
| trigger_check_petition_threshold | petitions | BEFORE UPDATE | check_petition_threshold |

## Row Level Security (RLS) Policies

### Public Access (anon role)

| Table | Policy | Condition |
|-------|--------|-----------|
| campaigns | SELECT | status IN ('active', 'paused', 'target_reached', 'expired', 'completed') |
| campaign_settings | SELECT | campaign has public status |
| contributions | SELECT | status = 'confirmed' |
| expenses | SELECT | status = 'published' |
| petitions | SELECT | status IN ('collecting', 'voting', 'approved', 'rejected') |
| votes | SELECT | true (aggregate counts) |
| browser_participation_tokens | INSERT | true (register token) |
| campaign_updates | SELECT | status = 'published' |

### No Public Access

- `repayment_contacts` - Private supporter data
- `admin_audit_logs` - Security audit trail

### Service Role (Full Access)

All tables: `FOR ALL USING (auth.role() = 'service_role')`

## Indexes

### Performance Indexes

```sql
-- Campaigns
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Contributions
CREATE INDEX idx_contributions_campaign ON contributions(campaign_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_payment_method ON contributions(payment_method);
CREATE INDEX idx_contributions_submitted_at ON contributions(submitted_at);

-- Repayment Contacts
CREATE INDEX idx_repayment_contacts_contribution ON repayment_contacts(contribution_id);

-- Expenses
CREATE INDEX idx_expenses_campaign ON expenses(campaign_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_published_at ON expenses(published_at);

-- Petitions
CREATE INDEX idx_petitions_campaign ON petitions(campaign_id);
CREATE INDEX idx_petitions_status ON petitions(status);

-- Votes
CREATE INDEX idx_votes_petition ON votes(petition_id);
CREATE INDEX idx_votes_token_hash ON votes(token_hash);

-- Browser Tokens
CREATE INDEX idx_browser_tokens_hash ON browser_participation_tokens(token_hash);

-- Updates
CREATE INDEX idx_updates_campaign ON campaign_updates(campaign_id);
CREATE INDEX idx_updates_status ON campaign_updates(status);
CREATE INDEX idx_updates_published_at ON campaign_updates(published_at);

-- Audit Logs
CREATE INDEX idx_audit_logs_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_resource ON admin_audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at);
```

## Relationships Diagram

```
campaigns (1) ─────< (1) campaign_settings
    │
    ├────< (N) contributions
    │              │
    │              └────< (1) repayment_contacts
    │
    ├────< (N) expenses
    │
    ├────< (N) petitions
    │              │
    │              └────< (N) votes
    │
    ├────< (N) campaign_updates
    │
    └────< (N) admin_audit_logs (via admin_id)
```

## Data Retention

| Table | Retention | Notes |
|-------|-----------|-------|
| campaigns | Permanent | Campaign history |
| campaign_settings | Permanent | Linked to campaign |
| contributions | Permanent | Financial records |
| repayment_contacts | On request | User can request deletion |
| expenses | Permanent | Financial records |
| petitions | Permanent | Governance history |
| votes | Permanent | Voting records |
| browser_participation_tokens | Permanent | Anonymous |
| campaign_updates | Permanent | Public record |
| admin_audit_logs | Permanent | Compliance |

## Migration History

| Version | File | Description |
|---------|------|-------------|
| 1.0.0 | 001_initial_schema.sql | Core tables |
| 1.0.0 | 002_rls_policies.sql | Security policies |
| 1.0.0 | 003_functions_triggers.sql | Business logic |
| 1.0.0 | 004_seed_initial_campaign.sql | Initial data |

## Querying Guidelines

### Public Reads (Anon)

- Use Supabase client with anon key
- RLS automatically filters data
- No joins across private tables

### Admin Reads (Service Role)

- Use service role client server-side only
- Full access to all tables
- Include audit logs

### Write Operations

- Public: INSERT votes, browser_tokens, contributions (pending)
- Admin: All mutations via service role
- Always log to admin_audit_logs