# Launch Checklist

Pre-launch verification checklist for the One Human Initiative.

## Overview

Complete all items before making the campaign public. Each item must be verified and signed off.

---

## Phase 1: Infrastructure

### Supabase Production
- [ ] Production project created (separate from dev)
- [ ] All 4 migrations applied successfully
- [ ] RLS policies verified on all tables
- [ ] Auth configured (Email provider enabled)
- [ ] MFA enforced for admin users
- [ ] Storage bucket `campaign-assets` created and public
- [ ] Storage policies configured for admin uploads
- [ ] Database types generated: `supabase gen types typescript --project-id <id> > src/lib/database.types.ts`
- [ ] Backups enabled (Supabase Pro recommended)
- [ ] Point-in-Time Recovery configured (if Pro)

### Vercel Deployment
- [ ] Repository connected to Vercel
- [ ] Build succeeds without errors
- [ ] All environment variables configured in Vercel dashboard
- [ ] `SUPABASE_SERVICE_ROLE_KEY` marked as Secret
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate provisioned
- [ ] Preview deployments working for PRs

### DNS & Domain
- [ ] Domain registered
- [ ] DNS records pointing to Vercel
- [ ] `www` redirect configured
- [ ] CAA records for SSL (if required)

---

## Phase 2: Campaign Configuration

### Campaign Settings (Admin > Campaign)
- [ ] Campaign name set
- [ ] Description written and reviewed
- [ ] Target amount: $10,000
- [ ] Maximum target: $50,000
- [ ] Start date: Future date (UTC)
- [ ] End date: Start + 30 days (UTC)
- [ ] Status: `draft` (will change to `active` at launch)
- [ ] Hero title: "ONE HUMAN. ONE OPPORTUNITY."
- [ ] Hero tagline set
- [ ] Public content reviewed (Markdown renders correctly)

### Payment Settings (Admin > Payments)
- [ ] **Bitcoin**: Real address entered (tested with small amount)
- [ ] **Solana**: Real address entered (tested with small amount)
- [ ] **Phantom Username**: Claimed and verified
- [ ] **Ko-fi**: 
  - [ ] Ko-fi Gold approved
  - [ ] Page configured
  - [ ] URL entered
  - [ ] Status set to `active`
  - [ ] Test donation completed

### Payment Verification Tests
| Method | Test Amount | Verified On Explorer | Admin Verified |
|--------|-------------|---------------------|----------------|
| Bitcoin | 0.0001 BTC | blockstream.info | ✓ |
| Solana | 0.01 SOL | solscan.io | ✓ |
| Phantom | 0.01 SOL | solscan.io | ✓ |
| Ko-fi | $1 | Ko-fi dashboard | ✓ |

---

## Phase 3: Content & Legal

### Public Pages
- [ ] **Homepage** (`/`): Loads correctly, all sections render
- [ ] **Transparency** (`/transparency`): Shows expenses, progress
- [ ] **Community** (`/community`): Loads, petition/vote UI works
- [ ] **Updates** (`/updates`): Loads, Markdown renders
- [ ] **Privacy** (`/privacy`): Complete, reviewed by legal
- [ ] **Terms** (`/terms`): Complete, reviewed by legal

### Legal Review
- [ ] Privacy Notice reviewed by legal counsel
- [ ] Terms of Service reviewed by legal counsel
- [ ] Jurisdiction identified and noted
- [ ] "Not a registered charity" disclaimer present
- [ ] "Not an investment product" disclaimer present
- [ ] Campaign closure conditions clear
- [ ] Excess funds handling defined

### Content Quality
- [ ] No placeholder text remaining
- [ ] All images optimized and loaded
- [ ] QR codes scan correctly on mobile
- [ ] Copy buttons work with toast feedback
- [ ] Countdown timer accurate
- [ ] Responsive on mobile/tablet/desktop

---

## Phase 4: Functionality Testing

### Contribution Flow
- [ ] Bitcoin: Copy address, QR scan, submit hash, admin verify
- [ ] Solana: Copy address, QR scan, submit hash, admin verify
- [ ] Phantom: Username click, send, submit hash, admin verify
- [ ] Ko-fi: Button click, donate, submit ID, admin verify
- [ ] Duplicate submission rejected
- [ ] Invalid hash rejected
- [ ] Pending → Confirmed updates campaign totals
- [ ] Pending → Rejected does not update totals

### Admin Dashboard
- [ ] Login with MFA works
- [ ] All 9 sections accessible
- [ ] Campaign settings save correctly
- [ ] Payment settings save correctly
- [ ] Contribution verification works
- [ ] Expense CRUD works
- [ ] Petition approve/reject works
- [ ] Update publishing works
- [ ] Image upload works
- [ ] Audit log readable and filterable

### Community Features
- [ ] Petition creation requires 5 tokens
- [ ] Voting works (Yes/No)
- [ ] One vote per token enforced
- [ ] Petition auto-advances to voting at threshold
- [ ] Admin approval updates campaign target
- [ ] Target cannot exceed $50,000

### Phantom Widget
- [ ] Widget visible bottom-right
- [ ] Opens tutorial panel
- [ ] All 10 steps navigate correctly
- [ ] Animations play
- [ ] Reduced motion respected
- [ ] Mobile responsive
- [ ] Security warnings visible
- [ ] Close/replay work

---

## Phase 5: Security & Privacy

### Security Headers
- [ ] CSP header present
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured
- [ ] HSTS enabled (Vercel default)

### Data Protection
- [ ] No analytics/tracking scripts
- [ ] No third-party cookies
- [ ] No fingerprinting
- [ ] Service role key ONLY in server env
- [ ] Admin audit logs immutable
- [ ] IP addresses hashed in logs
- [ ] Repayment contacts never public
- [ ] RLS blocks private data from anon

### Rate Limiting
- [ ] API rate limits configured (10 req/min)
- [ ] Contribution submission limited
- [ ] Vote submission limited
- [ ] Login attempts limited

---

## Phase 6: Testing

### Automated Tests
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (unit tests)
- [ ] `npm run test:e2e` passes (Playwright)
- [ ] `npm run test:db` passes (RLS tests)

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (NVDA/VoiceOver)
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion respected
- [ ] ARIA labels present
- [ ] Focus indicators visible

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Images optimized
- [ ] Bundle size reasonable

---

## Phase 7: Monitoring & Operations

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Supabase logs accessible
- [ ] Error tracking configured (Sentry optional)
- [ ] Uptime monitoring (optional)

### Operational Procedures
- [ ] Admin user accounts created (min 2)
- [ ] MFA configured for all admins
- [ ] Service role key backed up securely
- [ ] Incident response plan documented
- [ ] Backup/restore tested
- [ ] Key rotation schedule set

### Documentation
- [ ] README.md complete
- [ ] INSTALLATION.md complete
- [ ] DEPLOYMENT.md complete
- [ ] DATABASE_SCHEMA.md complete
- [ ] SECURITY_AND_PRIVACY.md complete
- [ ] PAYMENT_SETUP.md complete
- [ ] ADMIN_GUIDE.md complete
- [ ] LAUNCH_CHECKLIST.md complete
- [ ] KNOWN_LIMITATIONS.md complete

---

## Phase 8: Launch Day

### Pre-Launch (T-1 hour)
- [ ] Campaign status changed to `active` in admin
- [ ] Payment addresses final verification
- [ ] All admin users notified
- [ ] Social media announcements ready
- [ ] Community channels notified

### Launch (T=0)
- [ ] Campaign live at scheduled time
- [ ] Monitor contribution submissions
- [ ] Verify first contributions manually
- [ ] Check dashboard for errors
- [ ] Confirm transparency page updating

### Post-Launch (T+1 hour)
- [ ] Verify campaign progress calculating
- [ ] Check countdown timer accurate
- [ ] Monitor for any error spikes
- [ ] Confirm all 4 contribution methods working

### First 24 Hours
- [ ] Daily transparency update published
- [ ] Community petition monitored
- [ ] Audit log reviewed
- [ ] Supporter questions addressed

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical Lead | | | |
| Security Review | | | |
| Legal Review | | | |
| Campaign Owner | | | |

---

## Rollback Plan

If critical issues discovered post-launch:

1. **Pause Campaign**: Admin > Campaign > Set status to `paused`
2. **Communicate**: Publish update explaining pause
3. **Investigate**: Check logs, audit trail
4. **Fix**: Deploy hotfix via Vercel
5. **Resume**: Set status back to `active`

**Emergency Contacts**:
- Vercel Support: vercel.com/support
- Supabase Support: supabase.com/support
- Technical Lead: [contact]