import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get campaign progress from secure view (now includes story/content fields)
    const { data: campaignProgress, error: progressError } = await supabase
      .from('campaign_progress_public')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(1)
      .single();

    if (progressError?.code === 'PGRST116' || !campaignProgress) {
      return NextResponse.json(
        { error: 'No active campaign found', code: 'NO_ACTIVE_CAMPAIGN' },
        { status: 404 }
      );
    }

    if (progressError) {
      console.error('Campaign progress view error:', progressError);
      return NextResponse.json(
        { error: 'Unable to load campaign data' },
        { status: 500 }
      );
    }

    // Get campaign settings from secure view (payment addresses)
    const { data: settings, error: settingsError } = await supabase
      .from('campaign_settings_public')
      .select('*')
      .eq('campaign_id', campaignProgress.id)
      .single();

    if (settingsError) {
      return NextResponse.json(
        { error: 'Campaign settings not found' },
        { status: 500 }
      );
    }

    // Get contribution aggregates from secure view
    const admin = getAdminClient();
    const { data: contribAggregates, error: contribError } = await admin
      .rpc('get_public_contribution_aggregates', { p_campaign_id: campaignProgress.id });

    let totalUsdValue = 0;
    if (!contribError && contribAggregates) {
      totalUsdValue = contribAggregates.reduce(
        (sum: number, item: { total_usd_value?: number | string | null }) => sum + Number(item.total_usd_value || 0),
        0
      );
    }

    // Get expense summary from secure view
    const { data: expenseSummary, error: expenseError } = await supabase
      .from('expense_summary_public')
      .select('*')
      .eq('campaign_id', campaignProgress.id);

    let publishedExpenses = 0;
    if (!expenseError && expenseSummary) {
      publishedExpenses = expenseSummary.reduce((sum, e) => sum + Number(e.published_amount || 0), 0);
    }

    return NextResponse.json({
      campaign: {
        ...campaignProgress,
        confirmed_amount: Number(campaignProgress.confirmed_amount),
        confirmed_count: campaignProgress.confirmed_count,
        published_expenses: publishedExpenses,
        total_usd_value: totalUsdValue,
      },
      settings: {
        bitcoin_address: settings.bitcoin_address,
        solana_address: settings.solana_address,
        phantom_username: settings.phantom_username,
        kofi_enabled: settings.kofi_enabled && settings.kofi_status === 'active',
        kofi_url: settings.kofi_url,
        kofi_label: settings.kofi_label,
      },
      // Story/Content fields for CampaignExplanation
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
    });
  } catch (error) {
    console.error('Campaign API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}