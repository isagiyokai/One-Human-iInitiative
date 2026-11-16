-- One Human Initiative - Initial Database Schema
-- Version: 1.0.0

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    target INTEGER NOT NULL CHECK (target >= 1000 AND target <= 50000),
    max_target INTEGER NOT NULL CHECK (max_target >= 10000 AND max_target <= 50000),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'paused', 'target_reached', 'expired', 'completed')),
    hero_title VARCHAR(200) NOT NULL,
    hero_tagline VARCHAR(500) NOT NULL,
    public_content TEXT,
    confirmed_amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
    confirmed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT target_not_exceed_max CHECK (target <= max_target)
);

-- ============================================================================
-- CAMPAIGN SETTINGS TABLE
-- ============================================================================
CREATE TABLE campaign_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    bitcoin_address VARCHAR(100) NOT NULL,
    solana_address VARCHAR(100) NOT NULL,
    phantom_username VARCHAR(50) NOT NULL,
    kofi_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    kofi_url VARCHAR(500),
    kofi_label VARCHAR(100) DEFAULT 'Support on Ko-fi',
    kofi_status VARCHAR(20) NOT NULL DEFAULT 'pending_approval'
        CHECK (kofi_status IN ('pending_approval', 'active', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(campaign_id)
);

-- ============================================================================
-- CONTRIBUTIONS TABLE
-- ============================================================================
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    payment_method VARCHAR(20) NOT NULL
        CHECK (payment_method IN ('bitcoin', 'solana', 'phantom', 'kofi')),
    transaction_hash VARCHAR(200) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'rejected')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    recon_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate transaction hashes per payment method
    UNIQUE(payment_method, transaction_hash)
);

-- ============================================================================
-- REPAYMENT CONTACTS TABLE (Private - never exposed publicly)
-- ============================================================================
CREATE TABLE repayment_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL
        CHECK (platform IN ('ko-fi', 'buy-me-a-coffee')),
    url VARCHAR(500) NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    consent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- One contact per contribution
    UNIQUE(contribution_id)
);

-- ============================================================================
-- EXPENSES TABLE
-- ============================================================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(20, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    evidence_url VARCHAR(500),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PETITIONS TABLE
-- ============================================================================
CREATE TABLE petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    requested_target INTEGER NOT NULL
        CHECK (requested_target >= 10000 AND requested_target <= 50000),
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'collecting'
        CHECK (status IN ('collecting', 'voting', 'approved', 'rejected', 'cancelled')),
    token_count INTEGER NOT NULL DEFAULT 0,
    required_tokens INTEGER NOT NULL DEFAULT 5,
    voting_starts_at TIMESTAMPTZ,
    voting_ends_at TIMESTAMPTZ,
    decided_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- VOTES TABLE
-- ============================================================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    choice VARCHAR(3) NOT NULL CHECK (choice IN ('yes', 'no')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- One vote per token per petition
    UNIQUE(petition_id, token_hash)
);

-- ============================================================================
-- BROWSER PARTICIPATION TOKENS TABLE
-- ============================================================================
CREATE TABLE browser_participation_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- ============================================================================
-- CAMPAIGN UPDATES TABLE
-- ============================================================================
CREATE TABLE campaign_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ADMIN AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

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