import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { petitionSchema } from '@/lib/validators';
import { hashToken } from '@/lib/browser-token';
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
      return NextResponse.json({ petition: null });
    }

    // Fetch only public petition fields and aggregate vote totals through a narrow RPC.
    const admin = getAdminClient();
    const { data: petitions, error } = await admin
      .rpc('get_public_petition_aggregates', { p_campaign_id: campaign.id });

    if (error) {
      console.error('Public petition aggregate query failed:', error);
      return NextResponse.json({ error: 'Unable to load petition data' }, { status: 500 });
    }

    const petition = petitions?.[0];
    if (!petition) {
      return NextResponse.json({ petition: null });
    }

    return NextResponse.json({
      petition: {
        ...petition,
        voteCounts: {
          yes: petition.yes_votes || 0,
          no: petition.no_votes || 0,
          total: petition.total_votes || 0
        },
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

    const admin = getAdminClient();

    // Petition rows and participation-token hashes are private server-side data.
    const { data: registeredToken, error: tokenLookupError } = await admin
      .from('browser_participation_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (tokenLookupError || !registeredToken) {
      return NextResponse.json({ error: 'Register this browser before creating a petition' }, { status: 403 });
    }

    // Check if there's already an active petition.
    const { data: existingPetition, error: existingPetitionError } = await admin
      .from('petitions')
      .select('id, status')
      .eq('campaign_id', campaign.id)
      .in('status', ['collecting', 'voting'])
      .maybeSingle();

    if (existingPetitionError) {
      console.error('Existing petition lookup error:', existingPetitionError);
      return NextResponse.json({ error: 'Unable to check for an existing petition' }, { status: 500 });
    }

    if (existingPetition) {
      return NextResponse.json(
        { error: 'A petition is already in progress' },
        { status: 409 }
      );
    }

    // Only a previously registered browser token can create a petition.
    // Signature aggregation is represented by token_count until per-signature records exist.
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