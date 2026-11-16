# One Human Initiative

A privacy-conscious fundraising campaign website built with Next.js 14, Supabase, and Tailwind CSS.

## Overview

The One Human Initiative is a 30-day campaign to raise $10,000-$50,000 in direct financial support for an anonymous individual. The platform emphasizes privacy, transparency, and community governance.

### Key Features

- **Privacy-First**: No tracking, no public donor directory, no accounts required
- **Multiple Contribution Methods**: Bitcoin, Solana, Phantom Username, Ko-fi
- **Manual Verification**: All blockchain transactions manually verified by admins
- **Community Governance**: Browser-token-based petitions and voting for target increases
- **Full Transparency**: Public expense tracking with evidence
- **Admin Dashboard**: Complete CRUD for campaign, payments, contributions, expenses, updates
- **Animated Tutorial**: Step-by-step Phantom wallet guide with accessibility support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email/Password + MFA)
- **Validation**: Zod
- **Testing**: Jest + React Testing Library, Playwright
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account (or local Supabase CLI)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd one-human-initiative

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your .env.local with Supabase credentials

# Start development server
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run migrations: `supabase db push` (or apply migrations manually)
3. Enable Email/Password auth in Supabase dashboard
4. Enable MFA for admin users
5. Create storage bucket: `campaign-assets`

## Project Structure

```
one-human-initiative/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API routes
│   │   ├── community/          # Community page
│   │   ├── transparency/       # Transparency page
│   │   ├── updates/            # Updates page
│   │   ├── privacy/            # Privacy notice
│   │   └── terms/              # Terms of service
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   ├── campaign/           # Campaign components
│   │   ├── contributions/      # Contribution components
│   │   ├── layout/             # Layout components
│   │   ├── phantom/            # Phantom wallet tutorial
│   │   ├── transparency/       # Transparency components
│   │   └── ui/                 # Base UI components
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── validators.ts       # Zod schemas
│   │   ├── campaign.ts         # Campaign logic
│   │   ├── browser-token.ts    # Voting tokens
│   │   └── utils.ts            # Utilities
│   └── hooks/                  # React hooks
├── supabase/
│   └── migrations/             # Database migrations
├── e2e/                        # Playwright tests
└── public/                     # Static assets
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:db      # Run database tests
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [Installation Guide](INSTALLATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Security & Privacy](SECURITY_AND_PRIVACY.md)
- [Payment Setup](PAYMENT_SETUP.md)
- [Admin Guide](ADMIN_GUIDE.md)
- [Launch Checklist](LAUNCH_CHECKLIST.md)
- [Known Limitations](KNOWN_LIMITATIONS.md)

## License

MIT License - see LICENSE file for details.

## Security

This project follows security best practices:
- Row Level Security (RLS) on all database tables
- Service role key only used server-side
- CSP headers configured
- No sensitive data in browser bundles
- Audit logging for all admin actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For questions or issues, please open a GitHub issue.