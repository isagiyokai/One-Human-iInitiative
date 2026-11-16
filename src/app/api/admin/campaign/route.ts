import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { campaignSchema } from '@/lib/validators';
import { validateTargetIncrease } from '@/lib/campaign';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();

    // Get campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No campaign found' }, { status: 404 });
    }

    // Get settings
    const { data: settings } = await admin
      .from('campaign_settings')
      .select('*')
      .eq('campaign_id', campaign.id)
      .single();

    return NextResponse.json({ campaign, settings });
  } catch (error) {
    console.error('Admin campaign GET error:', error);
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
    const admin = getAdminClient();

    // Get current campaign
    const { data: campaign } = await admin
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'No campaign found' }, { status: 404 });
    }

    // If target is being changed, validate
    if (body.target !== undefined && body.target !== campaign.target) {
      const validation = validateTargetIncrease(campaign.target, body.target);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const validated = campaignSchema.parse(body);
    const { data: updated, error } = await admin
      .from('campaigns')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', campaign.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'campaign.settings_updated',
      resource: 'campaigns',
      resource_id: campaign.id,
      details: validated,
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Admin campaign PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}