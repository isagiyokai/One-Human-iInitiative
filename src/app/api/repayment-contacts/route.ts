import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { repaymentContactSchema } from '@/lib/validators';
import { validateKoFiUrl, validateBuyMeACoffeeUrl } from '@/lib/utils';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = repaymentContactSchema.parse(body);
    const supabase = await createClient();

    if (validated.platform === 'ko-fi' && !validateKoFiUrl(validated.url)) {
      return NextResponse.json({ error: 'Invalid Ko-fi URL' }, { status: 400 });
    }
    if (validated.platform === 'buy-me-a-coffee' && !validateBuyMeACoffeeUrl(validated.url)) {
      return NextResponse.json({ error: 'Invalid Buy Me a Coffee URL' }, { status: 400 });
    }

    const { data: contribution, error: contribError } = await supabase
      .from('contributions')
      .select('id, status')
      .eq('id', validated.contributionId)
      .single();

    if (contribError || !contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }
    if (contribution.status !== 'confirmed') {
      return NextResponse.json({ error: 'Repayment contact can only be added to confirmed contributions' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('repayment_contacts')
      .select('id')
      .eq('contribution_id', validated.contributionId)
      .is('deleted_at', null)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Repayment contact already exists for this contribution' }, { status: 409 });
    }

    const admin = getAdminClient();
    const { data: contact, error } = await admin
      .from('repayment_contacts')
      .insert({
        contribution_id: validated.contributionId,
        platform: validated.platform,
        url: validated.url,
        consent_given: validated.consentGiven,
        consent_at: new Date().toISOString(),
      })
      .select('id, contribution_id, platform, created_at')
      .single();

    if (error) {
      console.error('Repayment contact insert error:', error);
      return NextResponse.json({ error: 'Unable to save repayment contact' }, { status: 500 });
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Repayment contact POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
