import { Metadata } from 'next';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard Overview',
};

async function getDashboardData() {
  const supabase = await createClient();

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, name, target, max_target, status, start_date, end_date, confirmed_amount, confirmed_count, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (campaignError || !campaign) {
    return null;
  }

  const { count: pendingCount } = await supabase
    .from('contributions')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaign.id)
    .eq('status', 'pending');

  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount')
    .eq('campaign_id', campaign.id)
    .eq('status', 'published');

  let totalExpenses = 0;
  if (expenses) {
    totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  const { count: petitionsCount } = await supabase
    .from('petitions')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaign.id)
    .eq('status', 'voting');

  const endDate = new Date(campaign.end_date);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  let computedStatus = campaign.status;
  if (campaign.status === 'active') {
    if (Number(campaign.confirmed_amount) >= Number(campaign.target)) {
      computedStatus = 'target_reached';
    } else if (now > endDate) {
      computedStatus = 'expired';
    }
  }

  return {
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
  };
}

export default async function AdminDashboardPage() {
  const initialData = await getDashboardData();
  return <AdminOverview initialData={initialData || undefined} />;
}