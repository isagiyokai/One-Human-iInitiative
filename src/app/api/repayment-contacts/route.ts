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

    // Validate URL based on platform
    if (validated.platform === 'ko-fi' && !validateKoFiUrl(validated.url)) {
      return NextResponse.json(
        { error: 'Invalid Ko-fi URL' },
        { status: 400 }
      );
    }
    if (validated.platform === 'buy-me-a-coffee' && !validateBuyMeACoffeeUrl(validated.url)) {
      return NextResponse.json(
        { error: 'Invalid Buy Me a Coffee URL' },
        { status: 400 }
      );
    }

    // Verify contribution exists and is confirmed
    const { data: contribution, error: contribError } = await supabase
      .from('contributions')
      .select('id, status')
      .eq('id', validated.contributionId)
      .single();

    if (contribError || !contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    if (contribution.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Repayment contact can only be added to confirmed contributions' },
        { status: 400 }
      );
    }

    // Check if contact already exists
    const { data: existing } = await supabase
      .from('repayment_contacts')
      .select('id')
      .eq('contribution_id', validated.contributionId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Repayment contact already exists for this contribution' },
        { status: 409 }
      );
    }

    // Insert repayment contact
    const admin = getAdminClient();
    const { data: contact, error } = await admin
      .from('repayment_contacts')
      .insert({
        contribution_id: validated.contributionId,
        platform: validated.platform,
        url: validated.url,
        consent_given: validated.consentGiven,
        consent_at: validated.consentGiven ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'repayment_contact.created',
      resource: 'repayment_contacts',
      resource_id: contact.id,
      details: { contribution_id: validated.contributionId, platform: validated.platform },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Repayment contact POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}