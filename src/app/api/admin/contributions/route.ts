import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const verifySchema = z.object({
  contributionId: z.string().uuid(),
  action: z.enum(['verify', 'reject']),
  reconNotes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // Check admin auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = admin
      .from('contributions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`transaction_hash.ilike.%${search}%,id.ilike.%${search}%`);
    }

    const { data: contributions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contributions: contributions || [] });
  } catch (error) {
    console.error('Admin contributions GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Check admin auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contributionId, action, reconNotes } = verifySchema.parse(body);
    const admin = getAdminClient();

    // Get contribution
    const { data: contribution, error: fetchError } = await admin
      .from('contributions')
      .select('*')
      .eq('id', contributionId)
      .single();

    if (fetchError || !contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    if (contribution.status !== 'pending') {
      return NextResponse.json(
        { error: 'Contribution has already been processed' },
        { status: 400 }
      );
    }

    let updateData: Record<string, unknown> = {};
    let auditAction = '';

    if (action === 'verify') {
      updateData = {
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || null,
      };
      auditAction = 'contribution.verified';
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || 'Rejected by admin',
      };
      auditAction = 'contribution.rejected';
    }

    const { data: updated, error } = await admin
      .from('contributions')
      .update(updateData)
      .eq('id', contributionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: auditAction,
      resource: 'contributions',
      resource_id: contributionId,
      details: {
        payment_method: contribution.payment_method,
        amount: contribution.amount,
        currency: contribution.currency,
        transaction_hash: contribution.transaction_hash.slice(0, 20) + '...',
        recon_notes: reconNotes,
      },
    });

    return NextResponse.json({ success: true, contribution: updated });
  } catch (error) {
    console.error('Admin contributions PATCH error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}