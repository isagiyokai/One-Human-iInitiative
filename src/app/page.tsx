import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CampaignProgress } from '@/components/campaign/CampaignProgress';
import { CampaignExplanation } from '@/components/campaign/CampaignExplanation';
import { ContributionMethods } from '@/components/contributions/ContributionMethods';
import { WalletAddresses } from '@/components/contributions/WalletAddresses';
import { ScrollToContribute } from '@/components/campaign/ScrollToContribute';
import { createClient } from '@/lib/supabase/server';

type CampaignStatus = 'draft' | 'active' | 'paused' | 'target_reached' | 'expired' | 'completed';

async function getCampaignData() {
  const supabase = await createClient();

  // Get campaign progress from secure view
  const { data: campaignProgress } = await supabase
    .from('campaign_progress_public')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!campaignProgress) {
    return null;
  }

  // Get campaign settings from secure view
  const { data: settings } = await supabase
    .from('campaign_settings_public')
    .select('*')
    .eq('campaign_id', campaignProgress.id)
    .single();

  // Get expense summary
  const { data: expenseSummary } = await supabase
    .from('expense_summary_public')
    .select('*')
    .eq('campaign_id', campaignProgress.id);

  let publishedExpenses = 0;
  if (expenseSummary) {
    publishedExpenses = expenseSummary.reduce((sum, e) => sum + Number(e.published_amount || 0), 0);
  }

  return {
    campaign: {
      ...campaignProgress,
      confirmed_amount: Number(campaignProgress.confirmed_amount),
      confirmed_count: campaignProgress.confirmed_count,
      published_expenses: publishedExpenses,
    },
    settings: settings ? {
      bitcoin_address: settings.bitcoin_address,
      solana_address: settings.solana_address,
    } : null,
    content: {
      hero_title: campaignProgress.hero_title,
      hero_tagline: campaignProgress.hero_tagline,
      public_content: campaignProgress.public_content,
      story_title: campaignProgress.story_title,
      story_content: campaignProgress.story_content,
      privacy_title: campaignProgress.privacy_title,
      privacy_content: campaignProgress.privacy_content,
      process_title: campaignProgress.process_title,
      process_content: campaignProgress.process_content,
      custom_blocks: campaignProgress.custom_blocks || [],
    },
  };
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Campaign Active';
    case 'paused': return 'Campaign Paused';
    case 'target_reached': return 'Target Reached';
    case 'expired': return 'Campaign Ended';
    case 'completed': return 'Campaign Completed';
    default: return 'Campaign Not Yet Active';
  }
}

export default async function HomePage() {
  const campaignData = await getCampaignData();
  const campaign = campaignData?.campaign;
  const content = campaignData?.content;

  // Keep the public contribution details available even if the Supabase
  // campaign-content request temporarily returns no row.
  const walletSettings = {
    bitcoin_address: campaignData?.settings?.bitcoin_address?.trim() || 'bc1q954s898gv0rajvfau8xusaayurftezad00hm60',
    solana_address: campaignData?.settings?.solana_address?.trim() || '4gPvyTiU9SMyoVbEAXXpKe43qAZxBdQfoWjN4LJNyxC6',
  };

  const heroTitle = content?.hero_title || 'ONE HUMAN. ONE OPPORTUNITY.';
  const heroTagline = content?.hero_tagline || 'A privacy-conscious campaign to provide direct financial support to an anonymous individual. Your generosity stays private. No tracking, no accounts, no public lists.';

  // Split hero title into parts for styling
  const heroParts = heroTitle.split('ONE OPPORTUNITY.');
  const heroMain = heroParts[0]?.trim() || 'ONE HUMAN.';
  const heroAccent = heroParts[1] !== undefined ? 'ONE OPPORTUNITY.' : '';

  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="relative py-10 sm:py-24 lg:py-32 bg-warm-white" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-charcoal-900 leading-[1.05] text-balance"
              >
                <span>{heroMain}</span>
                {heroAccent && (
                  <>
                    <br />
                    <span className="text-earth-600">{heroAccent}</span>
                  </>
                )}
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl text-stone-600 leading-relaxed max-w-2xl mx-auto text-balance font-medium">
                {heroTagline}
              </p>
              <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-charcoal-100 text-charcoal-700 text-sm font-medium">
                  {campaign?.computed_status === 'active' ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" aria-hidden="true"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" aria-hidden="true"></span>
                    </span>
                  ) : (
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true"></span>
                  )}
                  {campaign ? getStatusLabel(campaign.computed_status) : 'Campaign setup in progress'}
                </span>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center gap-1.5">
                <a
                  href="#wallet-addresses"
                  className="inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-earth-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2 sm:w-auto"
                >
                  View BTC &amp; SOL contribution addresses
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7-7 7-7-7" />
                  </svg>
                </a>
                <p className="text-xs text-stone-500">Go straight to the wallet details and copy buttons</p>
                <a href="#campaign-story" className="min-h-11 inline-flex items-center justify-center px-4 text-sm font-semibold text-earth-700 underline underline-offset-4">
                  Read the story, privacy and how it works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Always-visible server-rendered wallet addresses for mobile and desktop */}
        <WalletAddresses
          bitcoinAddress={walletSettings.bitcoin_address}
          solanaAddress={walletSettings.solana_address}
          campaignActive={campaign?.computed_status === 'active'}
        />

        {/* Scroll Indicator / CTA to Wallet Addresses */}
        <ScrollToContribute targetId="wallet-addresses" />

        {/* Campaign Explanation Section */}
        <section id="campaign-story" className="scroll-mt-6 py-8 sm:py-16 bg-warm-white" aria-labelledby="explanation-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CampaignExplanation
              title={content?.story_title || undefined}
              description={content?.public_content}
              story={content?.story_content}
              whyAnonymous={content?.privacy_content}
              howItWorks={content?.process_content}
            />
          </div>
        </section>

        {/* Campaign Progress Section */}
        <section className="py-8 sm:py-16 bg-white" aria-labelledby="progress-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {campaign && (
              <CampaignProgress
                raised={campaign.confirmed_amount}
                target={campaign.target}
                contributorCount={campaign.confirmed_count}
                status={campaign.computed_status as CampaignStatus}
                endDate={campaign.end_date}
                startDate={campaign.start_date}
              />
            )}
          </div>
        </section>

        {/* Contribution Methods Section */}
        <section id="contribute" className="scroll-mt-6 py-8 sm:py-16 bg-white" aria-labelledby="contribute-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ContributionMethods
              initialSettings={walletSettings}
              initialCampaignActive={campaign?.computed_status === 'active'}
            />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
