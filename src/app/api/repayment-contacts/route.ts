import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { repaymentContactSchema } from '@/lib/validators';
import { validateKoFiUrl, validateBuyMeACoffeeUrl } from '@/lib/utils';
import { z } from 'zod';
import { verifyAdminApiAuth } from '@/lib/admin-api-auth';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const admin = getAdminClient();
    const { data: contacts, error } = await admin
      .from('repayment_contacts')
      .select('id, contribution_id, platform, url, consent_given, consent_at, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin repayment contacts GET error:', error);
      return NextResponse.json({ error: 'Unable to load repayment contacts' }, { status: 500 });
    }

    return NextResponse.json({ contacts: contacts || [] });
  } catch (error) {
    console.error('Admin repayment contacts GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const { data: contact, error } = await admin
      .from('repayment_contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)
      .select('id, contribution_id, platform')
      .maybeSingle();

    if (error) {
      console.error('Admin repayment contacts DELETE error:', error);
      return NextResponse.json({ error: 'Unable to delete repayment contact' }, { status: 500 });
    }
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin repayment contacts DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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