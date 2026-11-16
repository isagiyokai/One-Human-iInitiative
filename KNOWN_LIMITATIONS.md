# Known Limitations

Documented limitations, trade-offs, and areas for future improvement.

## 1. Browser Token Voting System

### Current Implementation
- Uses `localStorage` + first-party cookie for persistence
- Token hashed with SHA-256 before server storage
- One vote per token per petition (enforced by unique constraint)

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Not one-person-one-vote** | Users can clear localStorage/cookies to vote multiple times | Documented as "browser participation tokens" not "user votes" |
| **No cross-device sync** | Same user on different devices = different tokens | Acceptable for informal community governance |
| **Token loss = vote loss** | Clearing browser data loses voting history | Tokens are anonymous, no recovery needed |
| **No identity verification** | Cannot prevent coordinated manipulation | Threshold (5 tokens) + 7-day voting window raises bar |
| **Rate limiting only by IP** | Shared IPs (corporate, VPN) limited collectively | 10 req/min generous for normal use |

### Future Improvements
- Proof-of-work or CAPTCHA for token generation
- Optional email binding (with privacy trade-off)
- Time-weighted voting power

---

## 2. Manual Blockchain Verification

### Current Implementation
- Admin manually checks transaction on blockchain explorer
- No automated verification via APIs
- Contribution marked confirmed/rejected via admin dashboard

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Human error possible** | Admin might miss details | Clear verification checklist in admin guide |
| **Not real-time** | Supporters wait for manual review | Target: verify within 24 hours |
| **Scalability** | Manual process doesn't scale to high volume | Campaign limited to 30 days, expected low volume |
| **No API fallbacks** | Blockstream/Solana RPC outages block verification | Multiple explorers available as backup |
| **Subject to admin availability** | Requires active admin monitoring | Multiple admins recommended |

### Future Improvements
- Automated verification via Blockstream API (Bitcoin)
- Automated verification via Solana RPC (Solana)
- Webhook notifications for new transactions
- Verification queue with SLA tracking

---

## 3. Ko-fi Integration

### Current Implementation
- Display only (link to Ko-fi page)
- Manual verification of Ko-fi transaction IDs
- No webhook integration

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Requires Ko-fi Gold approval** | Cannot enable without platform approval | Documented as prerequisite |
| **No automated notifications** | Admin must check Ko-fi dashboard manually | Supporters submit transaction IDs |
| **Platform fees** | 5% free tier, 0% Gold + processor fees | Transparency page documents fees |
| **Chargeback risk** | Ko-fi handles disputes, not us | Ko-fi Terms of Service apply |
| **Limited customization** | Cannot embed donation form directly | Link-out approach maintains privacy |

### Future Improvements
- Ko-fi webhook integration for auto-notification
- Embedded donation widget (if privacy allows)
- Automated fee calculation for transparency

---

## 4. Campaign Closure Logic

### Current Implementation
- Status transitions: `active` → `target_reached`/`expired`/`paused` → `completed`
- No automatic deadline extension
- Admin must manually set to `completed`

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **No auto-complete** | Campaign stays in terminal state until admin acts | Documented workflow for admins |
| **Target reached = immediate pause** | Contributions stop instantly at target | By design - prevents overshoot |
| **No grace period** | Expired at exact end timestamp | UTC timezone documented |
| **Petition during target_reached** | Can still petition to increase | Max $50,000 hard cap |

### Future Improvements
- Auto-complete after 24h in terminal state
- Configurable grace period
- Scheduled cron for status transitions

---

## 5. Repayment Contact System

### Current Implementation
- Optional supporter-submitted contact links
- Platforms: Ko-fi, Buy Me a Coffee
- Explicit consent required
- Soft delete only (admin can remove)

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Only 2 platforms supported** | No Patreon, GitHub Sponsors, etc. | Covers most common use cases |
| **No verification of ownership** | Supporter could submit someone else's link | Consent checkbox + admin review |
| **No automated deletion request** | Supporter must contact admin | Email/contact form for requests |
| **Soft delete only** | Data retained in database | `deleted_at` timestamp, excluded from queries |

### Future Improvements
- Self-service deletion portal
- More platform options
- Ownership verification via OAuth

---

## 6. Anonymous Organizer Constraint

### Current Implementation
- No organizer identity fields in database
- Campaign settings don't include legal entity info
- Admin dashboard separate from public campaign

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Legal compliance varies** | Some jurisdictions require organizer disclosure | Legal review required per jurisdiction |
| **Banking/fiat off-ramp** | Converting crypto to fiat may require KYC | Outside scope - organizer handles privately |
| **Tax implications** | Organizer responsible for tax compliance | Documented in terms |
| **Dispute resolution** | No legal entity for supporters to pursue | Terms clarify no contractual obligation |

### Future Improvements
- Jurisdiction-specific deployment variants
- Optional legal entity fields (if organizer chooses)

---

## 7. Technical Limitations

### Frontend
| Limitation | Details |
|------------|---------|
| **No SSR for admin** | Admin pages client-side only (auth check) |
| **Bundle size** | ~200KB JS (acceptable for target audience) |
| **Animation performance** | CSS-only animations, may stutter on low-end devices |
| **IE11 not supported** | Modern browsers only |

### Backend
| Limitation | Details |
|------------|---------|
| **Supabase rate limits** | 100 req/s per project (sufficient for scale) |
| **Storage limits** | 1GB free, paid for more |
| **Function timeout** | 60s max for Edge functions |
| **Realtime not used** | Polling instead of subscriptions |

### Database
| Limitation | Details |
|------------|---------|
| **No sharding** | Single PostgreSQL instance |
| **Migration downtime** | Schema changes require brief lock |
| **JSONB query performance** | Audit log details not indexed |

---

## 8. Privacy Trade-offs

### What We Don't Collect
- ❌ No IP addresses (only hashed)
- ❌ No browser fingerprints
- ❌ No analytics cookies
- ❌ No third-party scripts
- ❌ No email addresses (supporters)
- ❌ No names/identities

### What We Do Collect (Minimal)
- ✅ Transaction hashes (public on blockchain)
- ✅ Contribution amounts
- ✅ Browser token hashes (anonymous)
- ✅ Admin emails (auth)
- ✅ Hashed admin IPs (audit)

### Residual Risks
| Risk | Likelihood | Impact |
|------|------------|--------|
| Blockchain analysis links tx to identity | Medium | Public blockchain |
| Admin credentials compromised | Low | MFA required |
| Supabase data breach | Very Low | Encrypted at rest |
| Vercel logs expose data | Very Low | No sensitive data in logs |

---

## 9. Accessibility Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Countdown timer live region updates | Minor | Announces every second |
| Phantom tutorial animations | Minor | Reduced motion disables |
| QR code alt text | Minor | Contains address |
| Color contrast on badges | Minor | Meets AA, not AAA |
| Mobile nav focus trap | Minor | Works but could improve |

---

## 10. Scalability Limits

| Metric | Current Limit | Notes |
|--------|---------------|-------|
| Concurrent users | ~10,000 | Vercel edge handles well |
| Contributions/day | ~1,000 | Manual verification bottleneck |
| Petition votes | ~10,000 | Database handles easily |
| Admin users | 10 | Supabase Auth limit (configurable) |
| Campaign duration | 30 days | Hardcoded in spec |

---

## 11. Future Enhancement Roadmap

### Phase 1 (Post-Launch)
- [ ] Automated Bitcoin verification (Blockstream API)
- [ ] Automated Solana verification (RPC)
- [ ] Ko-fi webhook integration
- [ ] Email notifications for admins

### Phase 2 (v1.1)
- [ ] Multi-language support (i18n)
- [ ] Advanced transparency charts
- [ ] Supporter dashboard (opt-in)
- [ ] Export contribution data (CSV)

### Phase 3 (v2.0)
- [ ] Smart contract escrow (optional)
- [ ] DAO-style governance
- [ ] Recurring contributions
- [ ] Mobile app (React Native)

---

## 12. Acceptance Criteria

Despite limitations, the system meets core requirements:

✅ **Privacy**: No tracking, no public donor data
✅ **Transparency**: All confirmed contributions & published expenses visible
✅ **Security**: RLS, MFA, audit logs, CSP
✅ **Manual Verification**: Admin workflow for all blockchain txs
✅ **Community Governance**: Petitions + voting with token system
✅ **Campaign Logic**: 30 days, $10K-$50K, status machine
✅ **Accessibility**: WCAG 2.2 AA, reduced motion
✅ **Deployable**: Vercel + Supabase, documented

---

## Feedback & Contributions

Limitations are documented transparently. To propose improvements:

1. Open GitHub Issue with "enhancement" label
2. Reference specific limitation section
3. Provide use case and proposed solution
4. Consider privacy/security impact

Maintainers will evaluate based on:
- Alignment with privacy-first mission
- Technical complexity
- Maintenance burden
- Community demand