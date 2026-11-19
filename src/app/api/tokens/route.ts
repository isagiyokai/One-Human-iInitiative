import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/browser-token';

export const dynamic = 'force-dynamic';

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token : '';

    if (!TOKEN_PATTERN.test(token)) {
      return NextResponse.json({ error: 'Invalid browser token' }, { status: 400 });
    }

    const tokenHash = await hashToken(token);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('browser_participation_tokens')
      .upsert(
        { token_hash: tokenHash, last_used_at: new Date().toISOString() },
        { onConflict: 'token_hash' }
      )
      .select('id')
      .single();

    if (error || !data) {
      console.error('Browser token registration failed:', error);
      return NextResponse.json({ error: 'Unable to register browser token' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tokenId: data.id });
  } catch (error) {
    console.error('Browser token POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '';
    if (!TOKEN_PATTERN.test(token)) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const tokenHash = await hashToken(token);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('browser_participation_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (error) {
      console.error('Browser token lookup failed:', error);
      return NextResponse.json({ error: 'Unable to verify browser token' }, { status: 500 });
    }

    return NextResponse.json({ valid: Boolean(data) });
  } catch (error) {
    console.error('Browser token GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
