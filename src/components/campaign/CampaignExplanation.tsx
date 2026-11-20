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

const principles = [
  {
    title: 'Direct Support',
    description: 'Contributions go directly to the recipient’s Bitcoin or Solana wallets.',
  },
  {
    title: 'Privacy by Design',
    description: 'No accounts and no public donor lists. The recipient’s identity remains private.',
  },
  {
    title: 'Transparent Verification',
    description: 'Transactions can be checked on-chain, and submitted details are reviewed manually.',
  },
];

const defaultDescription =
  'I am raising funds to secure safe accommodation, cover the initial costs of getting settled, and work toward stable longer-term housing. Contributions go directly to my Bitcoin or Solana wallets and are manually verified.';

const defaultStory =
  'I am the person this campaign is for, and I am asking directly for help. I am facing an immediate housing crisis and need support securing somewhere safe to stay, covering essential costs, and getting back on my feet. I have chosen to keep my identity private, but I will share progress updates and publish verified campaign spending as it becomes available.';

const defaultWhyAnonymous =
  'I have chosen to keep my identity private to protect my personal safety and dignity while asking for help. I will not publish my name or personal details. Contributions will still be recorded, manually verified, and reflected in campaign updates and published spending.';

const defaultHowItWorks = [
  'Choose Bitcoin (BTC) or native Solana (SOL).',
  'If you already have crypto, send it to the matching wallet address shown on this page.',
  'If you do not already own crypto, you may be able to buy BTC or SOL through a supported payment provider. Availability depends on your country and payment method.',
  'The amount and transaction ID form is optional. You do not need to submit either to contribute.',
  'If you want help matching a transfer, you may optionally submit both details after sending.',
  'Never send BTC to the Solana address or SOL to the Bitcoin address. Check the asset and network before confirming.',
].join('\n');

export function CampaignExplanation({
  title = 'Why This Campaign Exists',
  description,
  story,
  whyAnonymous,
  howItWorks,
}: CampaignExplanationProps) {
  const steps = (howItWorks || defaultHowItWorks)
    .split('\n')
    .map((step) => step.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-8">
      <header className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 sm:mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
          {description || defaultDescription}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle.title} className="rounded-xl border border-stone-200 bg-white p-4">
            <h3 className="font-semibold text-charcoal-900">{principle.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{principle.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>My Story</CardTitle>
            <CardDescription>Why I am asking for help</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base leading-relaxed text-stone-700">
              {story || defaultStory}
            </p>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Privacy and Anonymity</CardTitle>
            <CardDescription>Why the recipient’s identity is kept private</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base leading-relaxed text-stone-700">
              {whyAnonymous || defaultWhyAnonymous}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Simple steps for making a direct contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 sm:space-y-4">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-earth-100 text-sm font-semibold text-earth-800">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-stone-700 sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
