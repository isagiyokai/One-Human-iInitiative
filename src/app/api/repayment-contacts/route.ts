import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { repaymentContactSchema } from '@/lib/validators';
import { validateKoFiUrl, validateBuyMeACoffeeUrl } from '@/lib/utils';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = repaymentContactSchema.parse(body);
    const admin = getAdminClient();
    const { data: contribution, error: contribError } = await admin
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

    const { data: existing, error: existingError } = await admin
      .from('repayment_contacts')
      .select('id, deleted_at')
      .eq('contribution_id', validated.contributionId)
      .maybeSingle();

    if (existingError) {
      console.error('Repayment contact lookup error:', existingError);
      return NextResponse.json({ error: 'Unable to check existing repayment contact' }, { status: 500 });
    }
    if (existing && !existing.deleted_at) {
      return NextResponse.json({ error: 'Repayment contact already exists for this contribution' }, { status: 409 });
    }

    const contactData = {
      platform: validated.platform,
      url: validated.url,
      consent_given: validated.consentGiven,
      consent_at: new Date().toISOString(),
      deleted_at: null,
    };

    const query = existing
      ? admin.from('repayment_contacts').update(contactData).eq('id', existing.id)
      : admin.from('repayment_contacts').insert({ ...contactData, contribution_id: validated.contributionId });

    const { data: contact, error } = await query
      .select('id, contribution_id, platform, created_at')
      .single();

    if (error) {
      console.error('Repayment contact save error:', error);
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
