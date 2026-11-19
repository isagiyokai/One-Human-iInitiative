import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { verifyAdminApiAuth } from '@/lib/admin-api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const supabase = getAdminClient();

    // Get campaign with progress
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name, target, max_target, status, start_date, end_date, confirmed_amount, confirmed_count, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'No campaign found' },
        { status: 404 }
      );
    }

    // Get pending contributions count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('contributions')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaign.id)
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Pending contributions error:', pendingError);
    }

    // Get total published expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('campaign_id', campaign.id)
      .eq('status', 'published');

    let totalExpenses = 0;
    if (!expensesError && expenses) {
      totalExpenses = expenses.reduce((sum: number, e: { amount: string | number }) => sum + Number(e.amount), 0);
    }

    // Get active petitions count
    const { count: petitionsCount, error: petitionsError } = await supabase
      .from('petitions')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaign.id)
      .eq('status', 'voting');

    if (petitionsError) {
      console.error('Petitions error:', petitionsError);
    }

    // Calculate days remaining
    const endDate = new Date(campaign.end_date);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Compute status
    let computedStatus = campaign.status;
    if (campaign.status === 'active') {
      if (Number(campaign.confirmed_amount) >= Number(campaign.target)) {
        computedStatus = 'target_reached';
      } else if (now > endDate) {
        computedStatus = 'expired';
      }
    }

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        target: Number(campaign.target),
        max_target: Number(campaign.max_target),
        confirmed_amount: Number(campaign.confirmed_amount),
        confirmed_count: campaign.confirmed_count,
        status: campaign.status,
        computed_status: computedStatus,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        days_remaining: daysRemaining,
        total_expenses: totalExpenses,
        pending_contributions: pendingCount || 0,
        active_petitions: petitionsCount || 0,
      },
    });
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}