import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { petitionSchema } from '@/lib/validators';
import { hashToken } from '@/lib/browser-token';
import { z } from 'zod';

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
      return NextResponse.json({ petition: null });
    }

    // Get active petition (collecting or voting)
    const { data: petition, error } = await supabase
      .from('petitions')
      .select('*')
      .eq('campaign_id', campaign.id)
      .in('status', ['collecting', 'voting', 'approved', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !petition) {
      return NextResponse.json({ petition: null });
    }

    // Get vote counts
    const { data: votes } = await supabase
      .from('votes')
      .select('choice')
      .eq('petition_id', petition.id);

    const yesVotes = votes?.filter(v => v.choice === 'yes').length || 0;
    const noVotes = votes?.filter(v => v.choice === 'no').length || 0;

    return NextResponse.json({
      petition: {
        ...petition,
        voteCounts: { yes: yesVotes, no: noVotes, total: yesVotes + noVotes },
      },
    });
  } catch (error) {
    console.error('Petitions GET error:', error);
    return NextResponse.json({ petition: null });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = petitionSchema.parse(body);
    const supabase = await createClient();

    // Get browser token
    const token = body.token;
    if (!token) {
      return NextResponse.json({ error: 'Participation token required' }, { status: 400 });
    }

    const tokenHash = await hashToken(token);

    // Get active campaign
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, target, max_target')
      .in('status', ['active', 'paused', 'target_reached'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 404 });
    }

    // Validate target increase
    if (validated.requestedTarget <= campaign.target) {
      return NextResponse.json(
        { error: 'Requested target must be higher than current target' },
        { status: 400 }
      );
    }
    if (validated.requestedTarget > campaign.max_target) {
      return NextResponse.json(
        { error: `Target cannot exceed $${campaign.max_target.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Check if there's already an active petition
    const { data: existingPetition } = await supabase
      .from('petitions')
      .select('id, status')
      .eq('campaign_id', campaign.id)
      .in('status', ['collecting', 'voting'])
      .single();

    if (existingPetition) {
      return NextResponse.json(
        { error: 'A petition is already in progress' },
        { status: 409 }
      );
    }

    // Register token if not exists
    const { error: tokenError } = await supabase
      .from('browser_participation_tokens')
      .upsert({ token_hash: tokenHash }, { onConflict: 'token_hash', ignoreDuplicates: true });

    if (tokenError && tokenError.code !== '23505') {
      console.error('Token registration error:', tokenError);
    }

    // Check if this token already signed (first signature)
    // For simplicity, we'll allow the first token to create the petition
    // In practice, you'd track signatures separately

    const admin = getAdminClient();
    const { data: petition, error } = await admin
      .from('petitions')
      .insert({
        campaign_id: campaign.id,
        requested_target: validated.requestedTarget,
        reason: validated.reason,
        status: 'collecting',
        token_count: 1,
        required_tokens: 5,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'petition.created',
      resource: 'petitions',
      resource_id: petition.id,
      details: { requested_target: validated.requestedTarget, reason: validated.reason },
    });

    return NextResponse.json({ success: true, petition });
  } catch (error) {
    console.error('Petitions POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}