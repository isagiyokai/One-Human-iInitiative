# Security & Privacy Documentation

Comprehensive security and privacy documentation for the One Human Initiative.

## Threat Model

### Assets to Protect

1. **Supporter Privacy** - No public donor directory, no tracking
2. **Admin Credentials** - Supabase Auth with MFA
3. **Payment Addresses** - Configurable via admin only
4. **Financial Data** - Contribution amounts, expense records
5. **Audit Trail** - Immutable admin action logs
6. **Campaign Integrity** - Manual verification prevents fraud

### Threat Actors

| Actor | Capabilities | Mitigations |
|-------|--------------|-------------|
| External Attacker | Network attacks, injection, XSS | CSP, RLS, input validation, HTTPS |
| Malicious Supporter | Fake contributions, vote manipulation | Manual verification, token hashing, rate limiting |
| Compromised Admin | Data access, config changes | MFA, audit logs, service role separation |
| Insider (Supabase) | Database access | RLS, encryption at rest, minimal privileges |
| Third-party Services | Data collection | No analytics, no tracking scripts |

### Attack Vectors Addressed

- **SQL Injection**: Parameterized queries via Supabase client
- **XSS**: React auto-escaping, CSP headers
- **CSRF**: SameSite cookies, Supabase CSRF protection
- **Vote Stuffing**: Browser token hashing, unique constraints
- **Double Spending**: Unique transaction hash constraint
- **Address Spoofing**: Admin-only configuration, validation
- **Data Leakage**: RLS policies, no public access to private tables
- **Privilege Escalation**: Service role server-only, MFA for admins

## Security Controls

### Application Security

#### Content Security Policy

```javascript
// next.config.js headers
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self'; 
  connect-src 'self' https://*.supabase.co; 
  frame-ancestors 'none';
```

#### Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-DNS-Prefetch-Control | on | Performance |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | Legacy XSS protection |
| Referrer-Policy | strict-origin-when-cross-origin | Limit referrer info |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disable unused APIs |

#### Input Validation

- All API inputs validated with Zod schemas
- Address formats validated (Bitcoin, Solana, Phantom)
- File uploads: type, size, content validation
- Rate limiting on public APIs (10 req/min/IP)

### Database Security

#### Row Level Security (RLS)

All tables have RLS enabled with policies:

```sql
-- Example: Public can only see confirmed contributions
CREATE POLICY "Public confirmed contributions" ON contributions
    FOR SELECT USING (status = 'confirmed');
```

#### Access Matrix

| Role | campaigns | campaign_settings | contributions | repayment_contacts | expenses | petitions | votes | browser_tokens | updates | audit_logs |
|------|-----------|-------------------|---------------|-------------------|----------|-----------|-------|----------------|---------|------------|
| anon | SELECT* | SELECT* | SELECT (confirmed) | NONE | SELECT (published) | SELECT* | SELECT | INSERT | SELECT (published) | NONE |
| authenticated | Same as anon | Same | Same | NONE | Same | Same | Same | Same | Same | NONE |
| service_role | ALL | ALL | ALL | ALL | ALL | ALL | ALL | ALL | ALL | ALL |

*Filtered by campaign status

#### Data Encryption

- **At Rest**: Supabase managed (AES-256)
- **In Transit**: TLS 1.3 (Supabase/Vercel)
- **Secrets**: Environment variables only, never in code
- **IP Addresses**: Hashed (SHA-256) in audit logs

#### Audit Logging

All admin actions logged with:
- Admin ID and email
- Action type and resource
- Resource ID and details (JSONB)
- Hashed IP address
- Timestamp

**Immutable**: No UPDATE/DELETE policies on audit_logs

### Authentication & Authorization

#### Admin Authentication

- **Provider**: Supabase Auth (Email/Password)
- **MFA**: Required (TOTP via authenticator app)
- **Session**: JWT with short expiry, refresh tokens
- **Middleware**: Protects all `/admin/*` routes

#### Service Role Usage

- **Only** in server-side API routes
- **Never** exposed to browser
- Used for: Admin mutations, storage uploads, audit logs
- Separate from anon key

### Privacy Controls

#### Data Minimization

| Data Collected | Purpose | Retention |
|----------------|---------|-----------|
| Transaction hash | Verification | Permanent |
| Contribution amount | Progress tracking | Permanent |
| Browser token (hashed) | Voting | Permanent |
| Admin email | Authentication | Permanent |
| IP hash | Audit trail | Permanent |
| Supporter contact URL | Optional repayment | On request deletion |

#### No Tracking

- No Google Analytics, Mixpanel, etc.
- No cookies except Supabase auth
- No fingerprinting
- No third-party scripts

#### Supporter Rights

| Right | Implementation |
|-------|----------------|
| Access | No accounts - data tied to transaction hash only |
| Rectification | Contact admin for contribution corrections |
| Erasure | Repayment contacts deletable on request |
| Portability | Transaction data viewable on blockchain |
| Objection | No processing beyond verification |

#### International Transfers

- Supabase: US/EU regions available
- Vercel: Global edge network
- No other third-party processors
- Standard Contractual Clauses via providers

## Data Retention Policy

### Retention Periods

| Data Category | Retention | Legal Basis |
|---------------|-----------|-------------|
| Campaign config | Permanent | Legitimate interest |
| Confirmed contributions | Permanent | Financial records |
| Pending contributions | 90 days | Verification period |
| Rejected contributions | 1 year | Dispute resolution |
| Expenses | Permanent | Financial records |
| Petitions & votes | Permanent | Governance record |
| Browser tokens | Permanent | Anonymous |
| Admin audit logs | Permanent | Compliance |
| Repayment contacts | Until deletion request | Consent |

### Deletion Procedures

1. **Supporter Request**: Admin deletes repayment_contact (soft delete)
2. **Admin Action**: Audit logs never deleted
3. **Campaign End**: Data retained for transparency
4. **Legal Hold**: Preserves all data if required

### Backup & Recovery

- Supabase: Daily backups (Pro plan: Point-in-Time Recovery)
- Vercel: Immutable deployments
- Git: Full source history

## Secure Development Practices

### Code Review Requirements

- All PRs require review
- Security-focused review for auth/payment code
- Dependency audit: `npm audit` in CI

### Dependency Management

- `package-lock.json` committed
- Regular updates: `npm update`
- Audit: `npm audit` / `snyk test`
- Minimal dependencies

### Secrets Management

```bash
# Development
.env.local (gitignored)

# Production
Vercel Environment Variables (encrypted)
Supabase Dashboard (encrypted)
```

### Incident Response

1. **Detect**: Monitoring alerts, audit log review
2. **Contain**: Revoke compromised keys, disable admin
3. **Investigate**: Audit logs, Supabase logs
4. **Remediate**: Rotate keys, patch vulnerability
5. **Notify**: Affected parties if data exposed
6. **Document**: Post-incident report

## Compliance Considerations

### GDPR (If EU Supporters)

- Lawful basis: Legitimate interest / Consent
- Data minimization implemented
- Right to erasure for repayment contacts
- DPA with Supabase/Vercel

### Financial Regulations

- Not a registered charity
- Not an investment product
- No KYC/AML (manual verification only)
- Transparent about limitations

### Platform Terms

- Supabase Terms of Service
- Vercel Terms of Service
- Blockchain network terms

## Security Checklist

### Pre-Launch

- [ ] All RLS policies tested
- [ ] CSP headers verified
- [ ] MFA enabled for all admins
- [ ] Service role key only in server env
- [ ] Rate limiting configured
- [ ] File upload validation tested
- [ ] Backup strategy documented
- [ ] Incident response plan ready

### Ongoing

- [ ] Monthly dependency updates
- [ ] Quarterly security review
- [ ] Annual penetration test (if budget allows)
- [ ] Monitor Supabase/Vercel security advisories
- [ ] Review audit logs monthly
- [ ] Rotate service role key annually

## Vulnerability Reporting

Report security issues to: **security@onehuman.org** (or project maintainer)

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Contacts

- **Supabase Security**: security@supabase.com
- **Vercel Security**: security@vercel.com
- **Project Maintainer**: GitHub Issues (private)