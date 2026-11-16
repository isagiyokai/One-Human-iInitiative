import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { updateSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ updates: [] });
    }

    let query = admin
      .from('campaign_updates')
      .select('*')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: updates, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updates: updates || [] });
  } catch (error) {
    console.error('Admin updates GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);
    const admin = getAdminClient();

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No campaign found' }, { status: 404 });
    }

    const { data: update, error } = await admin
      .from('campaign_updates')
      .insert({
        campaign_id: campaign.id,
        ...validated,
        published_at: validated.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'update.created',
      resource: 'campaign_updates',
      resource_id: update.id,
      details: { title: validated.title, status: validated.status },
    });

    return NextResponse.json({ success: true, update });
  } catch (error) {
    console.error('Admin updates POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    const admin = getAdminClient();

    if (!id) {
      return NextResponse.json({ error: 'Update ID required' }, { status: 400 });
    }

    const validated = updateSchema.partial().parse(updates);
    const updateData = {
      ...validated,
      published_at: validated.status === 'published' ? new Date().toISOString() :
                    validated.status === 'draft' ? null : undefined,
      updated_at: new Date().toISOString(),
    };

    const { data: update, error } = await admin
      .from('campaign_updates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: validated.status === 'published' ? 'update.published' :
            validated.status === 'draft' ? 'update.unpublished' : 'update.updated',
      resource: 'campaign_updates',
      resource_id: id,
      details: validated,
    });

    return NextResponse.json({ success: true, update });
  } catch (error) {
    console.error('Admin updates PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const admin = getAdminClient();

    if (!id) {
      return NextResponse.json({ error: 'Update ID required' }, { status: 400 });
    }

    const { error } = await admin
      .from('campaign_updates')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'update.deleted',
      resource: 'campaign_updates',
      resource_id: id,
      details: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin updates DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}