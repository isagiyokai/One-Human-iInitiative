import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { voteSchema } from '@/lib/validators';
import { hashToken } from '@/lib/browser-token';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const petitionId = searchParams.get('petitionId');

    if (!petitionId) {
      return NextResponse.json({ error: 'Petition ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get vote counts from secure view
    const { data: petition, error } = await supabase
      .from('petition_aggregates_public')
      .select('yes_votes, no_votes, total_votes')
      .eq('id', petitionId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    return NextResponse.json({
      yes: petition.yes_votes || 0,
      no: petition.no_votes || 0,
      total: petition.total_votes || 0
    });
  } catch (error) {
    console.error('Votes GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = voteSchema.parse(body);
    const supabase = await createClient();

    // Get browser token
    const token = body.token;
    if (!token) {
      return NextResponse.json({ error: 'Participation token required' }, { status: 400 });
    }

    const tokenHash = await hashToken(token);

    // Check if petition exists and is in voting status
    const { data: petition, error: petitionError } = await supabase
      .from('petitions')
      .select('id, status, voting_ends_at')
      .eq('id', validated.petitionId)
      .single();

    if (petitionError || !petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    if (petition.status !== 'voting') {
      return NextResponse.json(
        { error: 'Voting is not active for this petition' },
        { status: 400 }
      );
    }

    if (new Date(petition.voting_ends_at) < new Date()) {
      return NextResponse.json(
        { error: 'Voting period has ended' },
        { status: 400 }
      );
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('petition_id', validated.petitionId)
      .eq('token_hash', tokenHash)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this petition' },
        { status: 409 }
      );
    }

    // Submit vote
    const { error } = await supabase
      .from('votes')
      .insert({
        petition_id: validated.petitionId,
        token_hash: tokenHash,
        choice: validated.choice,
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already voted on this petition' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Votes POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}