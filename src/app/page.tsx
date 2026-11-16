import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CampaignProgress } from '@/components/campaign/CampaignProgress';
import { CampaignExplanation } from '@/components/campaign/CampaignExplanation';
import { ContributionMethods } from '@/components/contributions/ContributionMethods';
import { PhantomHelpWidget } from '@/components/phantom/PhantomHelpWidget';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 lg:py-32 bg-warm-white" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-tight text-balance"
              >
                ONE HUMAN. ONE OPPORTUNITY.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto text-balance">
                A privacy-conscious campaign to provide direct financial support to an anonymous individual.
                No tracking. No accounts. No compromise.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal-100 text-charcoal-700 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" aria-hidden="true"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" aria-hidden="true"></span>
                  </span>
                  Campaign Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Progress Section */}
        <section className="py-16 sm:py-20 bg-white" aria-labelledby="progress-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CampaignProgress />
          </div>
        </section>

        {/* Campaign Explanation Section */}
        <section className="py-16 sm:py-20 bg-warm-white" aria-labelledby="explanation-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CampaignExplanation />
          </div>
        </section>

        {/* Contribution Methods Section */}
        <section className="py-16 sm:py-20 bg-white" aria-labelledby="contribute-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ContributionMethods />
          </div>
        </section>

        {/* Phantom Wallet Help Section */}
        <section className="py-16 sm:py-20 bg-warm-white" aria-labelledby="phantom-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PhantomHelpSection />
          </div>
        </section>
      </main>
      <Footer />
      <PhantomHelpWidget />
    </>
  );
}

function PhantomHelpSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 id="phantom-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
          New to Crypto?
        </h2>
        <p className="mt-4 text-lg text-stone-600">
          Learn how to use Phantom Wallet to contribute via Solana or Phantom Username
        </p>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-earth-100 text-earth-600 mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.734-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
          Interactive Tutorial Available
        </h3>
        <p className="text-stone-600 mb-6 max-w-md mx-auto">
          Click the floating help button in the bottom-right corner for a step-by-step animated guide on setting up Phantom Wallet and making your first contribution.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Look for the help button →</span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-10 p-6 rounded-xl bg-charcoal-50 border border-charcoal-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal-900 mb-2">Security Reminder</h4>
            <p className="text-sm text-charcoal-600">
              <strong>Never share your recovery phrase or private key with anyone.</strong>
              Legitimate wallets and services will never ask for these.
              <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-earth-600 hover:underline ml-1">
                Visit the official Phantom website
              </a>
              for downloads and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}