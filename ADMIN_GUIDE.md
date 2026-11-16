# Admin Dashboard Guide

Complete guide for managing the One Human Initiative campaign through the admin dashboard.

## Access

1. Visit: `https://your-domain.com/admin/login`
2. Sign in with admin email/password
3. Complete MFA challenge (TOTP authenticator app)
4. Access granted to `/admin/*` routes

## Dashboard Overview

The admin dashboard provides 8 main sections accessible via the sidebar:

| Section | Path | Purpose |
|---------|------|---------|
| Overview | `/admin` | Campaign stats, quick actions, recent activity |
| Campaign Settings | `/admin/campaign` | Campaign configuration |
| Payment Settings | `/admin/payments` | Payment addresses & methods |
| Contributions | `/admin/contributions` | Verify/reject contributions |
| Repayment Contacts | `/admin/repayment-contacts` | View private supporter contacts |
| Expenses | `/admin/expenses` | Manage expenditure records |
| Community | `/admin/community` | Petitions & voting management |
| Updates | `/admin/updates` | Campaign announcements |
| Audit Log | `/admin/audit` | Read-only action history |

---

## 1. Overview (`/admin`)

### Stats Cards
- **Confirmed Amount**: Total verified contributions
- **Target**: Current campaign target
- **Progress**: Percentage toward target
- **Time Remaining**: Countdown to campaign end
- **Pending Contributions**: Awaiting verification
- **Published Expenses**: Transparency page visible

### Quick Actions
- **Verify Contributions** → Jumps to Contributions page
- **Add Expense** → Jumps to Expenses page
- **Create Update** → Jumps to Updates page
- **Campaign Settings** → Jumps to Campaign page

### Recent Activity
Shows last 10 admin audit log entries with:
- Action type
- Resource affected
- Timestamp
- Admin who performed action

---

## 2. Campaign Settings (`/admin/campaign`)

### Basic Information
| Field | Description | Validation |
|-------|-------------|------------|
| Campaign Name | Public display name | Required, 1-100 chars |
| Target Amount (USD) | Funding goal | $1,000 - $50,000 |
| Maximum Target (USD) | Absolute maximum | $10,000 - $50,000, ≥ Target |
| Status | Campaign state | Dropdown (see below) |

### Status Values
| Status | Meaning | Contributions Accepted? |
|--------|---------|------------------------|
| Draft | Not yet started | No |
| Active | Live campaign | Yes |
| Paused | Temporarily halted | No |
| Target Reached | Goal met | No (auto) |
| Expired | End date passed | No (auto) |
| Completed | Admin closed | No |

### Dates (UTC)
- **Start Date**: When campaign becomes active
- **End Date**: When campaign expires (30 days typical)

### Public Content
| Field | Description |
|-------|-------------|
| Public Description | Shown on homepage & transparency |
| Hero Title | Large headline on homepage |
| Hero Tagline | Sub-headline on homepage |
| Additional Content | Markdown, shown below progress |

### Actions
- **Preview Changes** - Opens homepage in new tab
- **Save Changes** - Persists to database, logs audit entry

---

## 3. Payment Settings (`/admin/payments`)

### Bitcoin (BTC)
- **Address**: Bech32 (bc1...) or Legacy (1.../3...)
- **Validation**: Format checked on save
- **Test**: Send small amount, verify on blockstream.info

### Solana (SOL)
- **Address**: Base58 public key (32-44 chars)
- **Validation**: Base58 format checked
- **Test**: Send small amount, verify on solscan.io

### Phantom Username
- **Username**: Must start with `@` (e.g., `@onehumaninitiative`)
- **Validation**: Format checked
- **Test**: Send via Phantom wallet, verify on explorer

### Ko-fi
| Setting | Description |
|---------|-------------|
| Enable Ko-fi | Toggle integration |
| Ko-fi URL | Your Ko-fi page URL |
| Button Label | Display text for button |
| Status | `pending_approval`, `active`, `disabled` |

**Important**: Ko-fi requires platform approval before enabling. Set status to `active` only after approval.

### Address Validation Notice
Shows validation rules for each payment method. Always test with a small transaction before going live.

---

## 4. Contributions (`/admin/contributions`)

### Overview
Lists all contribution submissions with filtering and search.

### Status Badges
| Badge | Color | Meaning |
|-------|-------|---------|
| Pending | Amber | Awaiting admin review |
| Confirmed | Emerald | Verified, counted toward target |
| Rejected | Red | Failed verification |

### Filters
- **Search**: By transaction hash or contribution ID
- **Status**: All / Pending / Confirmed / Rejected

### Actions (Pending Only)
| Action | Description |
|--------|-------------|
| **Verify** | Marks confirmed, updates campaign totals, logs audit |
| **Reject** | Marks rejected, requires reason, logs audit |

### Actions (Confirmed/Rejected)
| Action | Description |
|--------|-------------|
| **Notes** | Add/edit reconciliation notes |

### Verification Process
1. Click **Verify** on pending contribution
2. Confirm in dialog (shows method, amount, hash)
3. System:
   - Updates status to `confirmed`
   - Sets `confirmed_at` timestamp
   - Increments campaign `confirmed_amount` and `confirmed_count`
   - Recalculates campaign status (may trigger `target_reached`)
   - Logs `contribution.verified` audit entry

### Rejection Process
1. Click **Reject** on pending contribution
2. Enter reason in prompt
3. System:
   - Updates status to `rejected`
   - Sets `confirmed_at` timestamp
   - Stores reason in `recon_notes`
   - Logs `contribution.rejected` audit entry

### Duplicate Prevention
- Unique constraint on `(payment_method, transaction_hash)`
- Prevents same transaction submitted twice
- API returns 409 Conflict for duplicates

---

## 5. Repayment Contacts (`/admin/repayment-contacts`)

### Privacy Notice
**These contacts are NEVER displayed publicly.** Only admins can view.

### Information Displayed
- Contact ID
- Linked Contribution ID
- Platform (Ko-fi / Buy Me a Coffee)
- Contact URL (clickable)
- Consent status (Given/Pending)
- Submission date

### Actions
- **Delete**: Permanently removes contact (logs audit)

### Supporter Workflow
1. Supporter makes confirmed contribution
2. Supporter optionally submits contact form
3. Must explicitly consent
4. Contact stored privately
5. Admin can view/delete
6. Supporter can request deletion anytime

---

## 6. Expenses (`/admin/expenses`)

### Overview
Manage all campaign expenditures with publication control.

### Status
| Status | Visibility | Use Case |
|--------|------------|----------|
| Draft | Admin only | Work in progress |
| Published | Public (Transparency page) | Verified expenses |

### Fields
| Field | Description |
|-------|-------------|
| Category | Predefined or custom |
| Description | What was purchased |
| Amount | Cost in USD |
| Currency | Default USD |
| Evidence URL | Receipt/invoice link |
| Status | Draft / Published |

### Actions
- **Add Expense**: Create new (starts as Draft)
- **Edit**: Modify any field
- **Publish/Unpublish**: Toggle status (sets `published_at`)
- **Delete**: Remove entirely (logs audit)

### Categories (Suggested)
- Hosting & Infrastructure
- Domain & SSL
- Payment Processing
- Legal & Compliance
- Design & Development
- Marketing & Outreach
- Transaction Fees
- Other

### Transparency Page
Only `published` expenses appear on public transparency page with:
- Category breakdown
- Amount totals
- Evidence links

---

## 7. Community (`/admin/community`)

### Petitions Tab
Shows all target increase proposals.

### Petition Lifecycle
```
Collecting Signatures (5 tokens needed)
    ↓ Threshold met
Voting Active (7 days)
    ↓ Voting ends
Admin Review → Approve / Reject / Cancel
    ↓ Approve
Campaign Target Updated (max $50,000)
```

### Petition Statuses
| Status | Description |
|--------|-------------|
| Collecting | Gathering browser token signatures |
| Voting | Yes/No voting active |
| Approved | Target increased, campaign updated |
| Rejected | Declined with reason |
| Cancelled | Withdrawn before voting |

### Admin Actions
| Action | When Available | Effect |
|--------|----------------|--------|
| Add Notes | Any status | Internal documentation |
| Approve | Voting ended, majority Yes | Increases campaign target |
| Reject | Collecting or Voting | Closes petition |
| Cancel | Collecting or Voting | Closes petition |

### Vote Counts
Shows Yes/No/Total for each petition in voting/decided status.

### Votes Tab
Detailed vote breakdown per petition:
- Vote ID
- Choice (Yes/No)
- Token hash (truncated)
- Timestamp

---

## 8. Updates (`/admin/updates`)

### Overview
Manage campaign announcements and news posts.

### Fields
| Field | Description |
|-------|-------------|
| Title | Headline |
| Content | Markdown supported |
| Image URL | Optional hero image |
| Status | Draft / Published |

### Actions
- **Create Update**: New announcement
- **Edit**: Modify content
- **Publish/Unpublish**: Toggle visibility
- **Delete**: Remove (logs audit)

### Public Display
Published updates appear on `/updates` page in reverse chronological order.

---

## 9. Audit Log (`/admin/audit`)

### Read-Only
Complete immutable history of all admin actions.

### Columns
| Column | Description |
|--------|-------------|
| ID | Log entry ID |
| Timestamp | When action occurred |
| Admin | Email of admin |
| Action | Action identifier |
| Resource | Resource type |
| Resource ID | Affected record ID |
| Details | JSON details (expandable) |
| IP Hash | Hashed IP address |

### Filters
- **Search**: By action, resource, admin email
- **Action**: Filter by specific action type
- **Resource**: Filter by resource type

### Pagination
50 entries per page, with Previous/Next navigation.

### Key Actions Logged
- Campaign settings changes
- Payment address updates
- Contribution verification/rejection
- Expense CRUD operations
- Petition approval/rejection
- Update publishing
- Asset uploads
- Repayment contact deletions

---

## Common Workflows

### Daily Operations
1. Check **Overview** for pending contributions
2. Verify/reject new contributions
3. Review any new petitions
4. Check expenses to publish

### Weekly Operations
1. Publish transparency expenses
2. Create campaign update
3. Review audit log for anomalies
4. Monitor campaign progress

### Campaign Milestones
| Event | Admin Actions |
|-------|---------------|
| Launch | Set status to Active, verify payment addresses |
| Target Reached | Auto-pauses, review community petitions |
| Petition Approved | Verify target increase, announce |
| Campaign End | Set to Completed, final transparency report |

---

## Troubleshooting

### Can't Access Admin
1. Verify admin user exists in Supabase Auth
2. Check MFA is configured
3. Clear browser cookies/cache
4. Check middleware not blocking

### Changes Not Saving
1. Check browser console for errors
2. Verify Supabase connection
3. Check service role key configured
4. Review audit log for failed attempts

### Contribution Verification Fails
1. Ensure transaction hash correct
2. Check blockchain explorer
3. Verify campaign status is Active
4. Check for duplicate transaction

### Campaign Status Not Updating
1. Check `compute_campaign_status` function
2. Verify trigger `update_campaign_on_contribution_confirmation`
3. Check campaign dates

---

## Security Best Practices

1. **Always use MFA** for admin accounts
2. **Log out** when done (top-right menu)
3. **Verify transactions** on blockchain explorers
4. **Never share** service role key
5. **Review audit log** regularly
6. **Use strong passwords** for admin accounts
7. **Rotate service role key** annually

---

## Support

For admin dashboard issues:
1. Check browser console (F12)
2. Review Vercel function logs
3. Check Supabase dashboard logs
4. Consult audit log for error details