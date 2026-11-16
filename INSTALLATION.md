# Installation Guide

Complete setup instructions for the One Human Initiative project.

## Prerequisites

### Required Software

- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm 10+** (comes with Node.js) or **pnpm**
- **Git** - [Download](https://git-scm.com/)
- **Supabase CLI** (optional, for local development) - `npm install -g supabase`

### Supabase Account

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

## Step-by-Step Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd one-human-initiative
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

#### Option A: Local Supabase (Recommended for Development)

```bash
# Initialize Supabase (if not already done)
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/lib/database.types.ts
```

#### Option B: Remote Supabase

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_functions_triggers.sql`
   - `supabase/migrations/004_seed_initial_campaign.sql`
4. Generate types: `supabase gen types typescript --project-id <your-project-id> > src/lib/database.types.ts`

### 5. Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Go to **Authentication > Settings**
5. Enable **MFA** (recommended for admin security)

### 6. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Create new bucket: `campaign-assets`
3. Set to **Public** (for serving images)
4. Add policy for authenticated uploads (admin only)

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 8. Create Admin User

1. Visit `http://localhost:3000/admin/login`
2. Click "Sign Up" or use Supabase dashboard:
   - Go to **Authentication > Users**
   - Click **Invite User** or **Add User**
   - Enter admin email
   - User will receive magic link or can set password

## Verification Checklist

After installation, verify:

- [ ] Homepage loads with campaign data
- [ ] Countdown timer displays correctly
- [ ] All 4 contribution methods visible
- [ ] QR codes generate properly
- [ ] Admin login works
- [ ] Admin dashboard accessible at `/admin`
- [ ] All admin sections load (Campaign, Payments, Contributions, etc.)
- [ ] Transparency page shows expenses
- [ ] Community page loads
- [ ] Updates page loads
- [ ] Privacy and Terms pages accessible
- [ ] Phantom widget opens and animates

## Troubleshooting

### "Cannot find module './build'"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Errors

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is not paused
- Verify IP allowlist (if configured)

### Migration Errors

- Run migrations in order (001 → 004)
- Check for existing tables/conflicts
- Use `supabase db reset` for clean slate (local only)

### TypeScript Errors

```bash
npm run type-check
```

Regenerate types if needed:
```bash
supabase gen types typescript --local > src/lib/database.types.ts
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

## Development Tips

### Hot Reload Issues

- Restart dev server after adding new environment variables
- Check `.env.local` is in `.gitignore`

### Database Changes

After schema changes:
```bash
supabase db push
supabase gen types typescript --local > src/lib/database.types.ts
```

### Testing Supabase Locally

```bash
# View local Supabase dashboard
supabase status
# Opens Studio at http://localhost:54323
```

## Next Steps

1. Configure payment addresses in Admin > Payments
2. Customize campaign content in Admin > Campaign
3. Review Privacy and Terms pages
4. Test contribution flow
5. Deploy to production (see DEPLOYMENT.md)