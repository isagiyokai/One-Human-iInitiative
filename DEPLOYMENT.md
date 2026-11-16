# Deployment Guide

Production deployment instructions for the One Human Initiative.

## Overview

This application deploys to **Vercel** with **Supabase** as the backend database.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables configured
- [ ] Supabase production project created
- [ ] Database migrations applied to production
- [ ] Payment addresses configured and tested
- [ ] Ko-fi approval obtained (if using)
- [ ] Legal review of Privacy/Terms completed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate provisioned

## Supabase Production Setup

### 1. Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project (different from development)
3. Choose region closest to your users
4. Set strong database password

### 2. Apply Migrations

```bash
# Link to production project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push

# Or run manually in SQL Editor:
# 1. 001_initial_schema.sql
# 2. 002_rls_policies.sql
# 3. 003_functions_triggers.sql
# 4. 004_seed_initial_campaign.sql (update dates first!)
```

### 3. Configure Auth

1. **Authentication > Providers** - Enable Email
2. **Authentication > Settings** - Enable MFA
3. **Authentication > URL Configuration**:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

### 4. Configure Storage

1. **Storage > Buckets** - Create `campaign-assets`
2. Set to Public
3. Add policies for authenticated admin uploads

### 5. Get Production Keys

From **Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub/GitLab/Bitbucket repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (or subdirectory if monorepo)

### 2. Configure Environment Variables

In Vercel Dashboard > Settings > Environment Variables, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional
SENTRY_DSN=your-sentry-dsn
```

**Important**: Set `SUPABASE_SERVICE_ROLE_KEY` as **Secret** (not exposed to browser)

### 3. Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Verify deployment at provided Vercel URL

### 4. Custom Domain (Optional)

1. Vercel Dashboard > Settings > Domains
2. Add your domain
3. Configure DNS records as instructed
4. SSL auto-provisions

## Post-Deployment Configuration

### 1. Update Supabase Auth URLs

In Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`

### 2. Configure Campaign

1. Visit `https://your-domain.com/admin/login`
2. Sign in with admin credentials
3. Go to **Campaign Settings**:
   - Update campaign name, description
   - Set target amounts ($10,000 - $50,000)
   - Set start/end dates (UTC)
   - Update hero title/tagline
4. Go to **Payment Settings**:
   - Enter real Bitcoin address
   - Enter real Solana address
   - Enter real Phantom username
   - Configure Ko-fi (if approved)
5. Verify all settings

### 3. Test Contribution Flow

1. Visit homepage
2. Test each contribution method:
   - Copy address buttons work
   - QR codes scan correctly
   - Instructions are clear
3. Submit test contribution (small amount)
4. Verify in Admin > Contributions
5. Test verification workflow

### 4. Verify Pages

- [ ] Homepage loads correctly
- [ ] Transparency page shows data
- [ ] Community page loads
- [ ] Updates page loads
- [ ] Privacy page accessible
- [ ] Terms page accessible
- [ ] Phantom widget works
- [ ] Mobile responsive

## Environment-Specific Configurations

### Staging Environment

Create a separate Vercel preview deployment:

1. Vercel automatically creates preview deployments for PRs
2. Use separate Supabase project or branch
3. Configure staging environment variables

### Production Environment

Ensure production-only settings:

```env
# Production only
NEXT_PUBLIC_APP_URL=https://your-domain.com
# No debug flags
```

## Monitoring & Maintenance

### Health Checks

- Vercel Analytics (built-in)
- Supabase Dashboard > Logs
- Sentry (if configured) for error tracking

### Database Maintenance

- Monitor Supabase disk usage
- Set up automated backups (Supabase Pro)
- Review slow queries periodically

### Security Updates

- Keep dependencies updated: `npm update`
- Monitor security advisories
- Rotate Supabase keys periodically

## Rollback Procedure

If issues arise:

1. **Vercel**: Go to Deployments > Click "..." > "Promote to Production" on previous deployment
2. **Supabase**: Use Point-in-Time Recovery (Pro plan) or restore from backup
3. **DNS**: Update DNS to previous deployment if needed

## Troubleshooting

### Build Failures

- Check Vercel build logs
- Verify all environment variables set
- Run `npm run build` locally first

### Supabase Connection Issues

- Verify project not paused
- Check IP allowlist (if configured)
- Verify service role key correct

### Auth Redirect Issues

- Check Supabase URL Configuration
- Verify Vercel domain matches
- Clear browser cookies

### Payment Address Issues

- Verify addresses in Admin > Payments
- Test with small amounts
- Check blockchain explorers

## Support Contacts

- **Vercel Support**: vercel.com/support
- **Supabase Support**: supabase.com/support
- **Project Issues**: GitHub Issues