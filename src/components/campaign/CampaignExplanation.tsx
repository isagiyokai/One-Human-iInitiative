'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface CampaignExplanationProps {
  title?: string;
  description?: string;
  story?: string;
  whyAnonymous?: string;
  howItWorks?: string;
}

const principles = [
  {
    id: 'direct',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Direct Support',
    description: '100% of confirmed contributions reach the recipient. No platform fees deducted.'
  },
  {
    id: 'privacy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Privacy by Design',
    description: 'No tracking, no accounts, no public donor lists. Your privacy is paramount.'
  },
  {
    id: 'transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Verification',
    description: 'Every confirmed contribution is verifiable on-chain. Admin verification is manual and auditable.'
  },
  {
    id: 'community',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Community Governed',
    description: 'Target increases require community petition and voting. Power stays with contributors.'
  },
];

const defaultDescription =
  'I am raising funds to secure safe accommodation, cover the initial costs of getting settled, and work toward stable longer-term housing. Contributions go directly to my Bitcoin or Solana wallets and are manually verified.';

const defaultStory =
  'I am the person this campaign is for, and I am asking directly for help. I am facing an immediate housing crisis and need support securing somewhere safe to stay, covering essential costs, and getting back on my feet. I have chosen to keep my identity private, but I will share progress updates and publish verified campaign spending as it becomes available.';

const defaultWhyAnonymous =
  'I have chosen to keep my identity private to protect my personal safety and dignity while asking for help. I will not publish my name or personal details. Contributions will still be recorded, manually verified, and reflected in campaign updates and published spending.';

const defaultHowItWorks =
  '1. Choose Bitcoin (BTC) or native Solana (SOL).\n' +
  '2. If you already have crypto, send it to the matching wallet address.\n' +
  '3. If you do not already own crypto, you may be able to buy BTC or SOL inside Trust Wallet using a supported payment provider. Availability depends on your country and payment method.\n' +
  '4. The amount and transaction ID form is optional. You do not need to submit either to contribute.\n' +
  '5. If you want me to match a transfer more easily, you may optionally submit both details after sending.\n' +
  '6. Never send BTC to the Solana address or SOL to the Bitcoin address. Check the asset and network before confirming.';

export function CampaignExplanation({
  title = 'Why This Campaign Exists',
  description,
  story,
  whyAnonymous,
  howItWorks,
}: CampaignExplanationProps) {
  const [activeTab, setActiveTab] = React.useState<string>('story');

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center max-w-2xl mx-auto">
        <h2 id="explanation-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-charcoal-900 leading-[1.1] text-balance">
          {title}
        </h2>
        <p className="mt-5 text-lg sm:text-xl text-stone-600 leading-relaxed">
          {description || defaultDescription}
        </p>
      </header>

      {/* Asymmetric Layout: Principles on left (compact editorial list), Content tabs on right */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Compact Editorial List of Principles */}
        <aside className="lg:col-span-4 space-y-4" aria-labelledby="principles-heading">
          <h3 id="principles-heading" className="text-xl sm:text-2xl font-bold text-charcoal-900">
            Core Principles
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Four commitments that guide everything we do.
          </p>
          <nav className="space-y-2" aria-label="Core principles">
            {principles.map((principle) => (
              <article
                key={principle.id}
                className="group flex gap-3 p-4 rounded-xl border border-stone-200 bg-white hover:border-earth-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center text-earth-600 group-hover:bg-earth-200 transition-colors">
                  {principle.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-charcoal-900 group-hover:text-earth-600 transition-colors">
                    {principle.title}
                  </h4>
                  <p className="text-sm text-stone-600 leading-relaxed mt-0.5">
                    {principle.description}
                  </p>
                </div>
              </article>
            ))}
          </nav>
        </aside>

        {/* Right: Tabbed Content Area */}
        <div className="lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-stone-100 rounded-xl p-1 mb-6" aria-label="Campaign content sections">
              <TabsTrigger value="story" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  The Story
                </span>
              </TabsTrigger>
              <TabsTrigger value="anonymous" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Privacy
                </span>
              </TabsTrigger>
              <TabsTrigger value="process" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  How It Works
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="animate-fade-in">
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center text-earth-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </span>
                    My Story
                  </CardTitle>
                  <CardDescription>I need help securing a safe place to stay and getting back on my feet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 leading-relaxed text-base">
                    {story || defaultStory}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anonymous" className="animate-fade-in">
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-10 h-10 rounded-xl bg-charcoal-100 flex items-center justify-center text-charcoal-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Why Anonymity Matters
                  </CardTitle>
                  <CardDescription>Protecting both the recipient and contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 leading-relaxed text-base">
                    {whyAnonymous || defaultWhyAnonymous}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process" className="animate-fade-in">
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </span>
                    How It Works
                  </CardTitle>
                  <CardDescription>Simple, direct, transparent process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-stone-600 leading-relaxed text-sm">
                    {(howItWorks || defaultHowItWorks).split('\n').map((step, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-earth-100 text-earth-600 text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}