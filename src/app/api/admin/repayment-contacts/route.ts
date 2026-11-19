import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { verifyAdminApiAuth } from '@/lib/admin-api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

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
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });

    const admin = getAdminClient();
    const { data: contact, error } = await admin
      .from('repayment_contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Admin repayment contacts DELETE error:', error);
      return NextResponse.json({ error: 'Unable to remove repayment contact' }, { status: 500 });
    }
    if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin repayment contacts DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
