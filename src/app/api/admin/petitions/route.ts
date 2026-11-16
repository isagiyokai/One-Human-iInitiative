import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const petitionActionSchema = z.object({
  petitionId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'cancel']),
  adminNotes: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ petitions: [] });
    }

    const { data: petitions, error } = await admin
      .from('petitions')
      .select('*')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get vote counts for each petition
    const petitionsWithVotes = await Promise.all(
      (petitions || []).map(async (p) => {
        const { data: votes } = await admin
          .from('votes')
          .select('choice')
          .eq('petition_id', p.id);

        const yes = votes?.filter(v => v.choice === 'yes').length || 0;
        const no = votes?.filter(v => v.choice === 'no').length || 0;

        return { ...p, voteCounts: { yes, no, total: yes + no } };
      })
    );

    return NextResponse.json({ petitions: petitionsWithVotes });
  } catch (error) {
    console.error('Admin petitions GET error:', error);
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
    const { petitionId, action, adminNotes } = petitionActionSchema.parse(body);
    const admin = getAdminClient();

    // Get petition
    const { data: petition, error: fetchError } = await admin
      .from('petitions')
      .select('*')
      .eq('id', petitionId)
      .single();

    if (fetchError || !petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      admin_notes: adminNotes || null,
      decided_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    let auditAction = '';

    if (action === 'approve') {
      if (petition.status !== 'voting') {
        return NextResponse.json(
          { error: 'Can only approve petitions in voting status' },
          { status: 400 }
        );
      }

      // Get campaign to validate target
      const { data: campaign } = await admin
        .from('campaigns')
        .select('id, target, max_target')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      if (petition.requested_target <= campaign.target) {
        return NextResponse.json(
          { error: 'Requested target must be higher than current target' },
          { status: 400 }
        );
      }
      if (petition.requested_target > campaign.max_target) {
        return NextResponse.json(
          { error: `Target cannot exceed $${campaign.max_target.toLocaleString()}` },
          { status: 400 }
        );
      }

      // Update campaign target
      await admin
        .from('campaigns')
        .update({
          target: petition.requested_target,
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaign.id);

      updateData.status = 'approved';
      auditAction = 'petition.approved';
    } else if (action === 'reject') {
      if (!['collecting', 'voting'].includes(petition.status)) {
        return NextResponse.json(
          { error: 'Can only reject active petitions' },
          { status: 400 }
        );
      }
      updateData.status = 'rejected';
      auditAction = 'petition.rejected';
    } else if (action === 'cancel') {
      if (!['collecting', 'voting'].includes(petition.status)) {
        return NextResponse.json(
          { error: 'Can only cancel active petitions' },
          { status: 400 }
        );
      }
      updateData.status = 'cancelled';
      auditAction = 'petition.cancelled';
    }

    const { data: updated, error } = await admin
      .from('petitions')
      .update(updateData)
      .eq('id', petitionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: auditAction,
      resource: 'petitions',
      resource_id: petitionId,
      details: {
        requested_target: petition.requested_target,
        previous_target: action === 'approve' ? petition.requested_target : undefined,
        admin_notes: adminNotes,
      },
    });

    return NextResponse.json({ success: true, petition: updated });
  } catch (error) {
    console.error('Admin petitions PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}