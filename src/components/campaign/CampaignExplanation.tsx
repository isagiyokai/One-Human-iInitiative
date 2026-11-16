'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface CampaignExplanationProps {
  title?: string;
  description?: string;
  story?: string;
  whyAnonymous?: string;
  howItWorks?: string;
}

export function CampaignExplanation({
  title = 'Why This Campaign Exists',
  description,
  story,
  whyAnonymous,
  howItWorks,
}: CampaignExplanationProps) {
  const defaultDescription =
    'One Human Initiative is a direct, privacy-first campaign to provide financial support to an anonymous individual facing extraordinary circumstances. Every contribution goes directly to the recipient — no platform fees, no intermediaries, no public exposure.';

  const defaultStory =
    'Behind this campaign is one person — a human being with dreams, struggles, and a story that matters. They\'ve chosen to remain anonymous to protect their privacy and dignity. This isn\'t about publicity or recognition; it\'s about one human helping another.';

  const defaultWhyAnonymous =
    'Anonymity protects the recipient from unwanted attention, harassment, and the complications that come with public fundraising. It also protects contributors — your generosity stays between you and the cause. No names, no tracking, no data harvesting. Just human kindness.';

  const defaultHowItWorks =
    '1. Choose a contribution method (Bitcoin, Solana, Phantom Username, or Ko-fi)\n' +
    '2. Send your contribution directly to the provided address\n' +
    '3. Submit the transaction hash for verification\n' +
    '4. Admin manually verifies on-chain\n' +
    '5. Once confirmed, your contribution counts toward the target\n' +
    '6. 100% of confirmed funds go to the recipient';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <h2 id="explanation-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
          {title}
        </h2>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          {description || defaultDescription}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* The Story */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-earth-100 flex items-center justify-center text-earth-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              One Human
            </CardTitle>
            <CardDescription>The person behind the campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 leading-relaxed">
              {story || defaultStory}
            </p>
          </CardContent>
        </Card>

        {/* Why Anonymous */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              Privacy First
            </CardTitle>
            <CardDescription>Anonymity protects everyone</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 leading-relaxed">
              {whyAnonymous || defaultWhyAnonymous}
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </span>
              How It Works
            </CardTitle>
            <CardDescription>Simple, direct, transparent</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-stone-600 leading-relaxed font-sans whitespace-pre-wrap">
              {howItWorks || defaultHowItWorks}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Key Principles */}
      <section className="border-t border-stone-200 pt-8" aria-labelledby="principles-heading">
        <h3 id="principles-heading" className="text-2xl font-bold text-charcoal-900 text-center mb-8">
          Core Principles
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Direct Support',
              description: '100% of confirmed contributions reach the recipient. No platform fees deducted.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: 'Privacy by Design',
              description: 'No tracking, no accounts, no public donor lists. Your privacy is paramount.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Transparent Verification',
              description: 'Every confirmed contribution is verifiable on-chain. Admin verification is manual and auditable.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: 'Community Governed',
              description: 'Target increases require community petition and voting. Power stays with contributors.'
            },
          ].map((principle, index) => (
            <Card key={index} variant="outlined" padding="md" className="text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-earth-100 flex items-center justify-center text-earth-600 mb-4">
                {principle.icon}
              </div>
              <h4 className="font-semibold text-charcoal-900 mb-2">{principle.title}</h4>
              <p className="text-sm text-stone-600">{principle.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}