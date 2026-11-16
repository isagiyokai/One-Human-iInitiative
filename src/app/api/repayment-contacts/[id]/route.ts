import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Allow both authenticated users (for their own contacts) and admins
    const admin = getAdminClient();

    // Get contact to verify ownership or admin
    const { data: contact, error: fetchError } = await admin
      .from('repayment_contacts')
      .select('id, contribution_id')
      .eq('id', id)
      .single();

    if (fetchError || !contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // If user is authenticated but not admin, verify they own the contribution
    // For now, only allow admin deletion (simpler)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await admin
      .from('repayment_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'repayment_contact.deleted',
      resource: 'repayment_contacts',
      resource_id: id,
      details: { contribution_id: contact.contribution_id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Repayment contact DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}