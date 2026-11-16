import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { expenseSchema } from '@/lib/validators';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get active campaign
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id')
      .in('status', ['active', 'paused', 'target_reached', 'expired', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ expenses: [], summary: [] });
    }

    // Get published expenses summary from secure view (by category)
    const { data: summary } = await supabase
      .from('expense_summary_public')
      .select('category, expense_count, total_amount, published_amount')
      .eq('campaign_id', campaign.id);

    // Get individual published expenses from secure view
    const { data: expenses, error } = await supabase
      .from('expenses_published_public')
      .select('id, category, description, amount, currency, published_at, evidence_url')
      .eq('campaign_id', campaign.id)
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ expenses: [], summary: summary || [] });
    }

    return NextResponse.json({ expenses: expenses || [], summary: summary || [] });
  } catch (error) {
    console.error('Expenses API error:', error);
    return NextResponse.json({ expenses: [], summary: [] });
  }
}

// Admin endpoint for full expense management
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = expenseSchema.parse(body);
    const admin = getAdminClient();

    // Get active campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .in('status', ['active', 'paused', 'target_reached', 'expired', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 404 });
    }

    const { data: expense, error } = await admin
      .from('expenses')
      .insert({
        campaign_id: campaign.id,
        ...validated,
        published_at: validated.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'expense.created',
      resource: 'expenses',
      resource_id: expense.id,
      details: validated,
    });

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error('Expense POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}