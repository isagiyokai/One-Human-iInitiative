import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { campaignSchema } from '@/lib/validators';
import { validateTargetIncrease } from '@/lib/campaign';
import { validateBitcoinAddress, validateSolanaAddress } from '@/lib/utils';
import { verifyAdminApiAuth } from '@/lib/admin-api-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
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
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
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

    // Never expose seed/example payment destinations by activating a campaign.
    if (body.status === 'active') {
      const { data: settings, error: settingsError } = await admin
        .from('campaign_settings')
        .select('bitcoin_address, solana_address')
        .eq('campaign_id', campaign.id)
        .maybeSingle();

      if (settingsError || !settings) {
        return NextResponse.json({ error: 'Payment settings must be configured before the campaign can be activated.' }, { status: 400 });
      }
      const placeholderBitcoin = 'bc1qexample00000000000000000000000000000000000';
      const placeholderSolana = 'SolanaExample1111111111111111111111111111111111';
      const hasPlaceholder = settings.bitcoin_address === placeholderBitcoin
        || settings.solana_address === placeholderSolana
;

      if (
        hasPlaceholder ||
        !validateBitcoinAddress(settings.bitcoin_address || '') ||
        !validateSolanaAddress(settings.solana_address || '')
      ) {
        return NextResponse.json({ error: 'Configure valid Bitcoin and Solana wallet addresses before activation.' }, { status: 400 });
      }
    }

    // If target is being changed, validate
    if (body.target !== undefined && body.target !== campaign.target) {
      const validation = validateTargetIncrease(campaign.target, body.target);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const validated = campaignSchema.parse(body);
    const campaignUpdate = {
      name: validated.name,
      description: validated.description,
      target: validated.target,
      max_target: validated.maxTarget,
      start_date: validated.startDate,
      end_date: validated.endDate,
      status: validated.status,
      hero_title: validated.heroTitle,
      hero_tagline: validated.heroTagline,
      public_content: validated.publicContent ?? null,
      ...(validated.storyTitle !== undefined ? { story_title: validated.storyTitle } : {}),
      ...(validated.storyContent !== undefined ? { story_content: validated.storyContent } : {}),
      ...(validated.privacyTitle !== undefined ? { privacy_title: validated.privacyTitle } : {}),
      ...(validated.privacyContent !== undefined ? { privacy_content: validated.privacyContent } : {}),
      ...(validated.processTitle !== undefined ? { process_title: validated.processTitle } : {}),
      ...(validated.processContent !== undefined ? { process_content: validated.processContent } : {}),
      ...(validated.customBlocks !== undefined ? { custom_blocks: validated.customBlocks } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await admin
      .from('campaigns')
      .update(campaignUpdate)
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