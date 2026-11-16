'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const lastUpdated = 'January 15, 2024';
const effectiveDate = 'January 15, 2024';

export function PrivacyContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <header className="text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Privacy Notice
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Last updated: {lastUpdated} · Effective: {effectiveDate}
        </p>
      </header>

      <div className="space-y-10">
        {/* Introduction */}
        <section>
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                The One Human Initiative ("we", "us", "our") is committed to protecting your privacy.
                This Privacy Notice explains how we collect, use, and safeguard information when you visit our website
                or participate in the campaign.
              </p>
              <p className="font-semibold">
                Core principle: We collect the minimum data necessary. No tracking. No accounts. No compromise.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Data We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Data We Collect
          </h2>
          <div className="space-y-4">
            <DataCard
              title="Contribution Records"
              description="When you submit a transaction hash for verification, we store: transaction hash, payment method, amount, currency, timestamp, and verification status. This is required for campaign transparency and duplicate prevention."
              required={true}
            />
            <DataCard
              title="Browser Participation Tokens"
              description="For petitions and voting, we generate a random token stored in your browser's localStorage. A hashed version (SHA-256) is sent to our server. This token is not linked to your identity."
              required={false}
            />
            <DataCard
              title="Repayment Contact Links (Optional)"
              description="If you voluntarily provide a Ko-fi or Buy Me a Coffee link for potential future repayment, we store: platform, URL, consent timestamp, and link to your contribution. This is entirely optional and never public."
              required={false}
            />
            <DataCard
              title="Technical Data (Standard Web Logs)"
              description="Our hosting provider (Vercel) and database provider (Supabase) automatically collect standard web logs: IP address, browser type, access times, and requested pages. We do not access or store raw IPs. Rate limiting uses hashed IPs only."
              required={true}
            />
          </div>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-earth-100 flex items-center justify-center text-earth-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            How We Use Your Data
          </h2>
          <div className="space-y-4">
            <UsageCard
              title="Campaign Operations"
              description="Verifying contributions, preventing duplicate transactions, calculating progress toward targets, and publishing transparency reports."
            />
            <UsageCard
              title="Community Governance"
              description="Validating petition thresholds, recording votes (one per token per petition), and ensuring fair participation."
            />
            <UsageCard
              title="Security & Abuse Prevention"
              description="Rate limiting (hashed IPs), detecting automated abuse, and maintaining system integrity."
            />
            <UsageCard
              title="Legal Compliance"
              description="Responding to valid legal requests, maintaining audit trails for admin actions, and fulfilling regulatory obligations."
            />
          </div>
        </section>

        {/* What We DON'T Do */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            What We DON'T Do
          </h2>
          <div className="space-y-3">
            <DontCard text="Track you across the web or build advertising profiles" />
            <DontCard text="Use cookies for analytics, marketing, or personalization" />
            <DontCard text="Share contributor data with third parties (except payment processors)" />
            <DontCard text="Publish donor names, amounts, or identifying information" />
            <DontCard text="Require accounts, email addresses, or personal identification" />
            <DontCard text="Use fingerprinting, canvas tracking, or invasive identification" />
            <DontCard text="Sell or monetize your data in any way" />
          </div>
        </section>

        {/* Payment Processors */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            Payment Processors (Independent Data Collection)
          </h2>
          <Card variant="outlined" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                When you contribute via Bitcoin, Solana, Phantom, or Ko-fi, those payment processors
                independently collect data according to their own privacy policies. We have no control over
                their data practices.
              </p>
              <ul>
                <li><strong>Bitcoin/Solana:</strong> On-chain transactions are public by design. Addresses and amounts are visible on block explorers.</li>
                <li><strong>Phantom Wallet:</strong> Collects data per <a href="https://phantom.app/privacy" target="_blank" rel="noopener noreferrer" className="text-earth-600 hover:underline">Phantom's Privacy Policy</a>.</li>
                <li><strong>Ko-fi:</strong> Collects data per <a href="https://ko-fi.com/privacy" target="_blank" rel="noopener noreferrer" className="text-earth-600 hover:underline">Ko-fi's Privacy Policy</a> (when enabled).</li>
              </ul>
              <p className="font-semibold">
                We recommend reviewing each processor's privacy policy before contributing.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Data Retention
          </h2>
          <div className="space-y-4">
            <RetentionCard
              period="Campaign Duration + 1 Year"
              data="Contribution records, verification status, audit logs"
              reason="Transparency, accountability, legal compliance"
            />
            <RetentionCard
              period="30 Days After Campaign End"
              data="Browser participation tokens (hashed), vote records"
              reason="Petition/voting integrity, dispute resolution"
            />
            <RetentionCard
              period="Until User Deletes"
              data="Repayment contact links, localStorage tokens"
              reason="User-controlled; delete anytime via browser settings or deletion request"
            />
            <RetentionCard
              period="Per Provider Policy"
              data="Payment processor data (blockchain, Phantom, Ko-fi)"
              reason="Controlled by respective providers, not by us"
            />
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Security Measures
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SecurityCard title="Row Level Security (RLS)" description="All database tables have RLS policies. Public access is restricted to published data only. Admin access requires Supabase Auth with MFA." />
            <SecurityCard title="Service Role Isolation" description="Service role key used only in server-side admin API routes. Never exposed to browser. All admin actions logged in audit trail." />
            <SecurityCard title="HTTPS & HSTS" description="Enforced via Vercel. All connections encrypted. HSTS header prevents downgrade attacks." />
            <SecurityCard title="CSP Headers" description="Content Security Policy restricts scripts, styles, and frames. Inline scripts blocked. Nonce-based for necessary inline content." />
            <SecurityCard title="EXIF Stripping" description="Uploaded evidence images have metadata stripped server-side using sharp + exifr before storage." />
            <SecurityCard title="No Raw IP Storage" description="Rate limiting uses client-side hashed IPs. Server never stores raw IPs in database." />
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Your Rights
          </h2>
          <div className="space-y-4">
            <RightCard right="Access" description="Request a copy of data we hold about your participation (contribution records linked to your transaction hashes, votes)." />
            <RightCard right="Rectification" description="Request correction of inaccurate data (e.g., incorrect transaction amount)." />
            <RightCard right="Erasure" description="Request deletion of your repayment contact link and browser token. Contribution records cannot be deleted (audit requirement)." />
            <RightCard right="Portability" description="Receive your data in a structured, machine-readable format (JSON)." />
            <RightCard right="Object/Restrict" description="Object to processing for specific purposes (e.g., voting participation)." />
            <RightCard right="Withdraw Consent" description="Withdraw consent for optional data (repayment contact) at any time." />
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Contact Us
          </h2>
          <Card variant="outlined" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                For privacy inquiries, data subject requests, or concerns about this notice:
              </p>
              <ul>
                <li><strong>Email:</strong> privacy@onehumaninitiative.org</li>
                <li><strong>Response Time:</strong> Within 30 days (GDPR standard)</li>
                <li><strong>Verification:</strong> We may request proof of identity for data requests</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </span>
            International Data Transfers
          </h2>
          <Card variant="outlined" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                Our hosting (Vercel) and database (Supabase) providers may process data in the United States
                and other jurisdictions. Both providers offer Standard Contractual Clauses (SCCs) and adhere
                to GDPR transfer mechanisms.
              </p>
              <p>
                Blockchain transactions are inherently global and public. By contributing on-chain, you accept
                that transaction data is replicated across nodes worldwide.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Changes to This Notice */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            Changes to This Notice
          </h2>
          <Card variant="outlined" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                We may update this Privacy Notice to reflect changes in our practices or legal requirements.
                The "Last updated" date at the top will be revised. Material changes will be announced
                on the <a href="/updates" className="text-earth-600 hover:underline">Updates</a> page.
              </p>
              <p>
                Continued use of the site after changes constitutes acceptance of the updated notice.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function DataCard({ title, description, required }: { title: string; description: string; required: boolean }) {
  return (
    <Card variant="default" padding="md">
      <CardContent className="flex items-start gap-4">
        <Badge variant={required ? 'error' : 'default'} size="sm" className="flex-shrink-0 mt-0.5">
          {required ? 'Required' : 'Optional'}
        </Badge>
        <div>
          <h3 className="font-semibold text-charcoal-900 mb-1">{title}</h3>
          <p className="text-sm text-stone-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageCard({ title, description }: { title: string; description: string }) {
  return (
    <Card variant="default" padding="md">
      <CardContent>
        <h3 className="font-semibold text-charcoal-900 mb-1">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function DontCard({ text }: { text: string }) {
  return (
    <Card variant="outlined" padding="md" className="border-red-100 bg-red-50">
      <CardContent className="flex items-center gap-3">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p className="text-sm text-red-700">{text}</p>
      </CardContent>
    </Card>
  );
}

function RetentionCard({ period, data, reason }: { period: string; data: string; reason: string }) {
  return (
    <Card variant="default" padding="md">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-900 mb-1">{period}</h3>
            <p className="text-sm text-charcoal-700 mb-1"><strong>Data:</strong> {data}</p>
            <p className="text-sm text-stone-600"><strong>Reason:</strong> {reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityCard({ title, description }: { title: string; description: string }) {
  return (
    <Card variant="default" padding="md">
      <CardContent>
        <h3 className="font-semibold text-charcoal-900 mb-1">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function RightCard({ right, description }: { right: string; description: string }) {
  return (
    <Card variant="default" padding="md">
      <CardContent>
        <h3 className="font-semibold text-charcoal-900 mb-1">{right}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </CardContent>
    </Card>
  );
}