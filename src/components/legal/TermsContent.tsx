'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const lastUpdated = 'January 15, 2024';
const effectiveDate = 'January 15, 2024';

export function TermsContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <header className="text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Last updated: {lastUpdated} · Effective: {effectiveDate}
        </p>
      </header>

      <div className="space-y-10">
        {/* Important Notice */}
        <section>
          <Card variant="outlined" padding="lg" className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Important Legal Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-amber-900">
              <p className="font-semibold">
                PLEASE READ THESE TERMS CAREFULLY BEFORE CONTRIBUTING.
              </p>
              <ul className="space-y-2 mt-4">
                <li><strong>This is not a registered charity.</strong> Contributions are not tax-deductible.</li>
                <li><strong>This is not an investment product.</strong> No financial returns, equity, or profit-sharing.</li>
                <li><strong>No contractual obligation to repay.</strong> Any repayment is purely voluntary and at the recipient's discretion.</li>
                <li><strong>No guaranteed outcome.</strong> Funds are used as described, but circumstances may change.</li>
                <li><strong>Legal review recommended.</strong> Consult your own legal/tax advisor before contributing.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 1. Voluntary Contributions */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">1</span>
            </span>
            Voluntary Contributions
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                All contributions to the One Human Initiative are <strong>entirely voluntary</strong>.
                You are under no obligation to contribute, and you may choose any amount (subject to blockchain minimums).
              </p>
              <p>
                By contributing, you acknowledge that:
              </p>
              <ul>
                <li>You are acting of your own free will without coercion or expectation of return</li>
                <li>You understand this is a personal gift/support to an anonymous individual</li>
                <li>No goods, services, or benefits are provided in exchange for your contribution</li>
                <li>You are not purchasing any product, service, or financial instrument</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 2. No Contractual Repayment */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">2</span>
            </span>
            No Contractual Repayment
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                The campaign organizer and recipient have <strong>no legal obligation to repay</strong> any contributions.
                The optional "repayment contact" feature (Ko-fi, Buy Me a Coffee) is provided solely as a convenience
                for contributors who wish to leave a way for the recipient to optionally express gratitude in the future.
              </p>
              <p>
                Any future repayment, gift, or acknowledgment is:
              </p>
              <ul>
                <li>Entirely at the recipient's sole discretion</li>
                <li>Not guaranteed, promised, or contractually required</li>
                <li>Not enforceable by any contributor</li>
                <li>Independent of these terms</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 3. Intended Use of Funds */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">3</span>
            </span>
            Intended Use of Funds
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                Contributions are intended to support the recipient with:
              </p>
              <ul>
                <li>Medical expenses (surgery, treatment, medication, rehabilitation)</li>
                <li>Essential living expenses (housing, utilities, food)</li>
                <li>Transportation related to medical care</li>
                <li>Other needs as determined by the recipient and disclosed in transparency reports</li>
              </ul>
              <p>
                The campaign admin publishes verified expenses on the <a href="/transparency" className="text-earth-600 hover:underline">Transparency</a> page.
                Fund allocation decisions are made by the recipient; the admin facilitates transparency.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 4. Campaign Target & Duration */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">4</span>
            </span>
            Campaign Target & Duration
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <ul>
                <li><strong>Initial Target:</strong> $10,000 USD</li>
                <li><strong>Maximum Target:</strong> $50,000 USD (hard cap, cannot be exceeded)</li>
                <li><strong>Duration:</strong> 30 days from launch</li>
                <li><strong>Target Increases:</strong> Require community petition (5 tokens) + voting + admin approval + public announcement</li>
                <li><strong>Deadline:</strong> Never auto-extends. Campaign ends on the original end date or when target reached.</li>
              </ul>
              <p>
                Only <strong>confirmed contributions</strong> (manually verified on-chain by admin) count toward the target.
                Pending/unverified contributions are not included in progress calculations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 5. Excess Funds Handling */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">5</span>
            </span>
            Excess Funds Handling
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                If confirmed contributions exceed the campaign target (up to the $50,000 maximum):
              </p>
              <ul>
                <li>All confirmed funds go to the recipient</li>
                <li>Excess funds are not automatically refunded</li>
                <li>Recipient may use excess for additional needs or future expenses</li>
                <li>Transparency page will reflect total received vs. target</li>
              </ul>
              <p>
                If the campaign expires without reaching the target, all confirmed funds still go to the recipient.
                No refunds are issued for campaigns that don't reach their target.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 6. Payment Provider & Blockchain Limitations */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">6</span>
            </span>
            Payment Provider & Blockchain Limitations
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                Contributions are sent directly to blockchain addresses or payment platforms. We do not custody funds.
              </p>
              <ul>
                <li><strong>Irreversibility:</strong> Blockchain transactions (Bitcoin, Solana) are generally irreversible. We cannot reverse or refund confirmed transactions.</li>
                <li><strong>Network Fees:</strong> You are responsible for all network/miner fees. These are not part of the contribution amount.</li>
                <li><strong>Confirmation Times:</strong> Verification depends on blockchain confirmations. May take minutes to hours.</li>
                <li><strong>Platform Risks:</strong> Ko-fi (if enabled) has its own terms, fees, and dispute processes.</li>
                <li><strong>Address Accuracy:</strong> Verify addresses before sending. We are not liable for funds sent to incorrect addresses.</li>
                <li><strong>Technical Failures:</strong> Network congestion, forks, or platform outages may delay or prevent verification.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 7. Refund & Reversal Handling */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">7</span>
            </span>
            Refunds & Reversals
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                <strong>We do not process refunds.</strong> Once a transaction is confirmed on-chain and verified by admin, it is final.
              </p>
              <p>
                If a contribution is <strong>rejected during verification</strong> (duplicate hash, incorrect amount, wrong network):
              </p>
              <ul>
                <li>The contribution is marked as "rejected" and does not count toward the target</li>
                <li>Funds remain at the destination address (we cannot retrieve them)</li>
                <li>Contributor is notified of the rejection reason</li>
              </ul>
              <p>
                If a payment platform (e.g., Ko-fi) processes a refund/chargeback independently:
              </p>
              <ul>
                <li>The contribution is removed from confirmed totals</li>
                <li>Progress bar adjusts accordingly</li>
                <li>Transparency page reflects the change</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 8. Campaign Closure Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">8</span>
            </span>
            Campaign Closure Conditions
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>The campaign transitions through these states:</p>
              <ul>
                <li><strong>Active → Target Reached:</strong> When confirmed ≥ target. Contributions disabled. Success message shown.</li>
                <li><strong>Active → Expired:</strong> When 30-day period ends. Contributions disabled. Final totals displayed.</li>
                <li><strong>Active → Paused:</strong> Admin action (with reason displayed). Can be resumed by admin.</li>
                <li><strong>Target Reached/Expired/Paused → Completed:</strong> Admin finalizes. No further changes possible.</li>
              </ul>
              <p>
                Upon completion, the homepage shows final totals, contribution methods are hidden,
                and the transparency page remains accessible.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 9. Not a Registered Charity */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">9</span>
            </span>
            Not a Registered Charity
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                The One Human Initiative is <strong>not a registered nonprofit, charity, or 501(c)(3) organization</strong>.
                Contributions are not tax-deductible in any jurisdiction. We do not issue donation receipts for tax purposes.
              </p>
              <p>
                If you require tax-deductible giving, please consult a qualified tax advisor and consider
                donating to registered charitable organizations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 10. Not an Investment Product */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">10</span>
            </span>
            Not an Investment Product
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                This campaign is <strong>not an investment, security, or financial product</strong>.
                There is no expectation of profit, return on investment, dividends, interest, equity, tokens,
                or any financial benefit from contributing.
              </p>
              <p>
                Contributions are personal gifts/support. Any future interaction with the recipient is
                purely personal and voluntary, not contractual.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 11. Dispute Resolution */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">11</span>
            </span>
            Dispute Resolution
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                Any disputes arising from these terms or the campaign shall be resolved through:
              </p>
              <ol>
                <li>Good-faith direct communication via privacy@onehumaninitiative.org</li>
                <li>If unresolved, binding arbitration in [JURISDICTION TO BE DETERMINED — LEGAL REVIEW REQUIRED]</li>
                <li>Governing law: [JURISDICTION TO BE DETERMINED — LEGAL REVIEW REQUIRED]</li>
              </ol>
              <p className="font-semibold text-red-700">
                ⚠️ JURISDICTION AND GOVERNING LAW REQUIRE LEGAL REVIEW BEFORE LAUNCH
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 12. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">12</span>
            </span>
            Limitation of Liability
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul>
                <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>We are not liable for blockchain network issues, payment processor failures, or technical errors</li>
                <li>We are not liable for the recipient's use of funds or personal circumstances</li>
                <li>Our total liability shall not exceed the amount you contributed</li>
                <li>You contribute at your own risk</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 13. Changes to Terms */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">13</span>
            </span>
            Changes to These Terms
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                We may update these terms to reflect changes in the campaign, legal requirements, or platform capabilities.
                The "Last updated" date will be revised. Material changes will be announced on the
                <a href="/updates" className="text-earth-600 hover:underline">Updates</a> page.
              </p>
              <p>
                Continued participation after changes constitutes acceptance. If you disagree with changes,
                you may not contribute further (prior contributions remain subject to terms at time of contribution).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 14. Severability */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">14</span>
            </span>
            Severability
          </h2>
          <Card variant="default" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700 space-y-4">
              <p>
                If any provision of these terms is found to be unenforceable or invalid,
                the remaining provisions shall continue in full force and effect.
                The invalid provision shall be modified to the minimum extent necessary to make it enforceable.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 15. Contact */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
              <span className="font-bold text-lg">15</span>
            </span>
            Contact
          </h2>
          <Card variant="outlined" padding="lg">
            <CardContent className="prose prose-sm max-w-none text-stone-700">
              <p>
                For questions about these terms:
              </p>
              <ul>
                <li><strong>Email:</strong> terms@onehumaninitiative.org</li>
                <li><strong>Response Time:</strong> Within 14 business days</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Legal Review Flag */}
        <section>
          <Card variant="outlined" padding="lg" className="border-red-200 bg-red-50">
            <CardContent className="text-center">
              <svg className="mx-auto w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Legal Review Required</h3>
              <p className="text-red-700">
                These terms contain placeholders for jurisdiction and governing law (marked with ⚠️).
                A qualified attorney must review and finalize these terms before campaign launch.
                Do not launch without legal review.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}