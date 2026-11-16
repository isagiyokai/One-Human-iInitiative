'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Update {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
  author: string;
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Campaign Launch — We\'re Live!',
    content: `Today marks the official launch of the One Human Initiative campaign. After months of preparation, we're finally ready to share this journey with you.

**What this means:**
- The campaign is now **active** and accepting contributions
- All four contribution methods are live: Bitcoin, Solana, Phantom Username, and Ko-fi (pending approval)
- The 30-day countdown has started
- Our initial target is $10,000 with a maximum of $50,000

**How you can help:**
1. **Contribute** — Choose your preferred method and send support directly
2. **Share** — Spread the word (privately, no tracking links)
3. **Participate** — Join community governance via petitions and voting
4. **Verify** — Check our transparency page for real-time updates

**A note on privacy:** We don't track visitors, we don't require accounts, and we never share contributor information. Your generosity stays private.

Thank you for being part of this from day one. Every contribution, regardless of size, makes a difference.

— The One Human Initiative Team`,
    publishedAt: '2024-01-15T09:00:00Z',
    imageUrl: '/updates/launch.jpg',
    author: 'Campaign Admin',
  },
  {
    id: '2',
    title: 'First Medical Expense Published',
    content: `We're publishing our first verified expense today. The emergency surgery was completed successfully on January 14th.

**Expense Details:**
- **Category:** Medical
- **Amount:** $5,000
- **Date:** January 15, 2024
- **Status:** Published with evidence

The surgery addressed the immediate life-threatening condition. Recovery is underway, and follow-up appointments are scheduled.

This expense represents 50% of our initial $10,000 target. We're grateful to the 47 contributors who have already helped reach this milestone.

View the full transparency page for the evidence document (EXIF metadata stripped for privacy).`,
    publishedAt: '2024-01-20T14:30:00Z',
    author: 'Campaign Admin',
  },
  {
    id: '3',
    title: 'Community Petition: Target Increase to $35,000',
    content: `A community petition has been submitted to increase the campaign target from $10,000 to $35,000.

**Petition Summary:**
- **Requested Target:** $35,000
- **Reason:** Ongoing treatment, rehabilitation, and medication costs not covered by initial target
- **Status:** Currently in voting phase
- **Required:** 5 unique participation tokens to proceed

The recipient's medical team has outlined a 6-month treatment plan including physical therapy, follow-up surgeries, and specialized medication. The current target only covers the emergency procedure.

**How to participate:**
1. Generate a participation token (bottom of this page)
2. Vote Yes or No on the petition
3. Results will be reviewed by admin if threshold is met

Voting ends February 20, 2024. Admin will review and announce any decision publicly before implementing changes.`,
    publishedAt: '2024-01-25T10:00:00Z',
    author: 'Campaign Admin',
  },
  {
    id: '4',
    title: 'Phantom Wallet Tutorial Now Available',
    content: `We've added an interactive Phantom Wallet tutorial to help newcomers contribute via Solana or Phantom Username.

**Features:**
- 10-step animated walkthrough
- Covers wallet creation, funding, and sending transactions
- Reduced motion support for accessibility
- Mobile-responsive design
- Security warnings about recovery phrases

**Access:** Click the floating help button (bottom-right corner) or visit the Contribution Methods section on the homepage.

This tutorial was built with custom CSS/SVG animations — no heavy libraries. It respects \`prefers-reduced-motion\` for users who prefer minimal animation.

Special thanks to the community members who requested this resource!`,
    publishedAt: '2024-02-01T16:00:00Z',
    author: 'Campaign Admin',
  },
  {
    id: '5',
    title: 'Monthly Expense Report — January 2024',
    content: `January expense summary is now available on the transparency page.

**January Totals:**
- **Medical:** $5,850 (emergency surgery + follow-ups)
- **Living Expenses:** $2,700 (rent, utilities, groceries)
- **Transportation:** $170 (medical transport)
- **Total Published:** $8,720

**Remaining Balance:** $17,030 (from $25,750 confirmed raised)

All expenses are verified with evidence documents. The transparency page shows category breakdowns with progress bars.

We aim to publish expenses within 48 hours of verification. If you have questions about any expense, please reach out through our contact channels.`,
    publishedAt: '2024-02-01T09:00:00Z',
    author: 'Campaign Admin',
  },
];

export function UpdatesContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Updates
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Latest announcements, expense reports, and campaign news.
          All updates are published by the campaign admin.
        </p>
      </header>

      {/* Updates List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {mockUpdates.map((update) => (
          <article key={update.id} className="group">
            <Card variant="default" padding="lg" className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <Badge variant="info" size="sm">
                    Update
                  </Badge>
                  <time className="text-sm text-stone-500 font-mono" dateTime={update.publishedAt}>
                    {new Date(update.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <CardTitle className="text-2xl group-hover:text-earth-600 transition-colors">
                  {update.title}
                </CardTitle>
                <CardDescription className="text-stone-500">
                  By {update.author}
                </CardDescription>
              </CardHeader>

              {update.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={update.imageUrl}
                    alt=""
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <CardContent>
                <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed">
                  {update.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </article>
        ))}

        {/* Empty State */}
        {mockUpdates.length === 0 && (
          <Card variant="outlined" padding="lg" className="text-center">
            <CardContent>
              <svg className="mx-auto w-16 h-16 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">No Updates Yet</h3>
              <p className="text-stone-600">Campaign updates will appear here once published.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RSS/Subscribe Note */}
      <div className="mt-12 lg:mt-16 max-w-3xl mx-auto">
        <Card variant="outlined" padding="lg" className="text-center">
          <CardContent>
            <svg className="mx-auto w-10 h-10 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16l6-4 6 4V4H4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
            </svg>
            <h3 className="font-semibold text-charcoal-900 mb-2">Stay Updated</h3>
            <p className="text-stone-600 mb-4">
              No email list. No tracking. No notifications.
              Bookmark this page or check back for new updates.
            </p>
            <p className="text-xs text-stone-500">
              For real-time contribution tracking, visit the <a href="/transparency" className="text-earth-600 hover:underline">Transparency</a> page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}