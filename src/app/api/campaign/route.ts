import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get campaign progress from secure view
    const { data: campaignProgress, error: progressError } = await supabase
      .from('campaign_progress_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (progressError || !campaignProgress) {
      return NextResponse.json(
        { error: 'No active campaign found' },
        { status: 404 }
      );
    }

    // Get campaign settings from secure view
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
    const { data: contribAggregates, error: contribError } = await supabase
      .from('contribution_aggregates_public')
      .select('*')
      .eq('campaign_id', campaignProgress.id);

    let totalUsdValue = 0;
    if (!contribError && contribAggregates) {
      totalUsdValue = contribAggregates.reduce((sum, c) => sum + Number(c.total_usd_value || 0), 0);
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
    });
  } catch (error) {
    console.error('Campaign API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}