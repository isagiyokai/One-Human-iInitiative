import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { updateSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get active campaign
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id')
      .in('status', ['active', 'paused', 'target_reached', 'expired', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ updates: [] });
    }

    // Get published updates only
    const { data: updates, error } = await supabase
      .from('campaign_updates')
      .select('id, title, content, image_url, published_at, created_at')
      .eq('campaign_id', campaign.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ updates: [] });
    }

    return NextResponse.json({ updates: updates || [] });
  } catch (error) {
    console.error('Updates API error:', error);
    return NextResponse.json({ updates: [] });
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

    // Get active campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .in('status', ['active', 'paused', 'target_reached', 'expired', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 404 });
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
    console.error('Updates POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}