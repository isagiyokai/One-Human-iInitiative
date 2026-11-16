import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { expenseSchema } from '@/lib/validators';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ expenses: [] });
    }

    let query = admin
      .from('expenses')
      .select('*')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: expenses, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ expenses: expenses || [] });
  } catch (error) {
    console.error('Admin expenses GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No campaign found' }, { status: 404 });
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
    console.error('Admin expenses POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    const admin = getAdminClient();

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }

    const validated = expenseSchema.partial().parse(updates);
    const updateData = {
      ...validated,
      published_at: validated.status === 'published' ? new Date().toISOString() :
                    validated.status === 'draft' ? null : undefined,
      updated_at: new Date().toISOString(),
    };

    const { data: expense, error } = await admin
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: validated.status === 'published' ? 'expense.published' :
            validated.status === 'draft' ? 'expense.unpublished' : 'expense.updated',
      resource: 'expenses',
      resource_id: id,
      details: validated,
    });

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error('Admin expenses PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const admin = getAdminClient();

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }

    const { error } = await admin
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'expense.deleted',
      resource: 'expenses',
      resource_id: id,
      details: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin expenses DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}