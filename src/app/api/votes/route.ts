import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { voteSchema } from '@/lib/validators';
import { hashToken } from '@/lib/browser-token';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const petitionId = searchParams.get('petitionId');
    const token = searchParams.get('token');

    if (!petitionId) {
      return NextResponse.json({ error: 'Petition ID required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const [yesResult, noResult] = await Promise.all([
      admin.from('votes').select('id', { count: 'exact', head: true }).eq('petition_id', petitionId).eq('choice', 'yes'),
      admin.from('votes').select('id', { count: 'exact', head: true }).eq('petition_id', petitionId).eq('choice', 'no'),
    ]);

    if (yesResult.error || noResult.error) {
      console.error('Vote count query failed:', yesResult.error || noResult.error);
      return NextResponse.json({ error: 'Unable to load vote counts' }, { status: 500 });
    }

    let hasVoted = false;
    if (token) {
      if (!TOKEN_PATTERN.test(token)) {
        return NextResponse.json({ error: 'Invalid participation token' }, { status: 400 });
      }
      const tokenHash = await hashToken(token);
      const { data: registered, error: tokenError } = await admin
        .from('browser_participation_tokens')
        .select('id')
        .eq('token_hash', tokenHash)
        .maybeSingle();

      if (tokenError || !registered) {
        return NextResponse.json({ error: 'Browser token is not registered' }, { status: 403 });
      }

      const { data: existingVote, error: voteError } = await admin
        .from('votes')
        .select('id')
        .eq('petition_id', petitionId)
        .eq('token_hash', tokenHash)
        .maybeSingle();

      if (voteError) {
        console.error('Vote lookup failed:', voteError);
        return NextResponse.json({ error: 'Unable to check voting status' }, { status: 500 });
      }
      hasVoted = Boolean(existingVote);
    }

    const yes = yesResult.count || 0;
    const no = noResult.count || 0;
    return NextResponse.json({ yes, no, total: yes + no, hasVoted });
  } catch (error) {
    console.error('Votes GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = voteSchema.parse(body);

    if (!TOKEN_PATTERN.test(validated.token)) {
      return NextResponse.json({ error: 'Invalid participation token' }, { status: 400 });
    }

    const tokenHash = await hashToken(validated.token);
    const admin = getAdminClient();

    const { data: registeredToken, error: tokenError } = await admin
      .from('browser_participation_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (tokenError || !registeredToken) {
      return NextResponse.json({ error: 'Register this browser before voting' }, { status: 403 });
    }

    const { data: petition, error: petitionError } = await admin
      .from('petitions')
      .select('id, status, voting_ends_at')
      .eq('id', validated.petitionId)
      .maybeSingle();

    if (petitionError || !petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    if (petition.status !== 'voting') {
      return NextResponse.json({ error: 'Voting is not active for this petition' }, { status: 400 });
    }

    if (!petition.voting_ends_at || new Date(petition.voting_ends_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: 'Voting period has ended' }, { status: 400 });
    }

    const { data: existingVote, error: existingVoteError } = await admin
      .from('votes')
      .select('id')
      .eq('petition_id', validated.petitionId)
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (existingVoteError) {
      console.error('Existing vote lookup failed:', existingVoteError);
      return NextResponse.json({ error: 'Unable to verify previous voting activity' }, { status: 500 });
    }
    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted on this petition' }, { status: 409 });
    }

    const { error: insertError } = await admin
      .from('votes')
      .insert({
        petition_id: validated.petitionId,
        token_hash: tokenHash,
        choice: validated.choice,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'You have already voted on this petition' }, { status: 409 });
      }
      console.error('Vote insert failed:', insertError);
      return NextResponse.json({ error: 'Unable to record vote' }, { status: 500 });
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
