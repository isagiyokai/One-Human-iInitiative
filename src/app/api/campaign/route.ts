import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get active campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .in('status', ['active', 'paused', 'target_reached', 'expired', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'No active campaign found' },
        { status: 404 }
      );
    }

    // Get campaign settings
    const { data: settings, error: settingsError } = await supabase
      .from('campaign_settings')
      .select('*')
      .eq('campaign_id', campaign.id)
      .single();

    if (settingsError) {
      return NextResponse.json(
        { error: 'Campaign settings not found' },
        { status: 500 }
      );
    }

    // Get confirmed contributions count and total
    const { data: contributions, error: contribError } = await supabase
      .from('contributions')
      .select('amount, currency')
      .eq('campaign_id', campaign.id)
      .eq('status', 'confirmed');

    let confirmedAmount = 0;
    let confirmedCount = 0;

    if (!contribError && contributions) {
      confirmedCount = contributions.length;
      // Sum all amounts (assuming same currency for simplicity, or convert)
      confirmedAmount = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
    }

    // Get published expenses total
    const { data: expenses, error: expenseError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('campaign_id', campaign.id)
      .eq('status', 'published');

    let publishedExpenses = 0;
    if (!expenseError && expenses) {
      publishedExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    }

    return NextResponse.json({
      campaign: {
        ...campaign,
        confirmed_amount: confirmedAmount,
        confirmed_count: confirmedCount,
        published_expenses: publishedExpenses,
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