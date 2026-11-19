import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { campaignSettingsSchema } from '@/lib/validators';
import { validateBitcoinAddress, validateSolanaAddress, validatePhantomUsername } from '@/lib/utils';
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
      .select('id')
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

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin payments GET error:', error);
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

    // Explicitly reject the demo wallet values from the seed migration.
    if (body.bitcoinAddress === 'bc1qexample00000000000000000000000000000000000'
      || body.solanaAddress === 'SolanaExample1111111111111111111111111111111111'
      || body.phantomUsername === '@exampleusername') {
      return NextResponse.json({ error: 'Example payment destinations cannot be saved. Enter your real wallet addresses and Phantom username.' }, { status: 400 });
    }

    // Validate addresses
    if (body.bitcoinAddress && !validateBitcoinAddress(body.bitcoinAddress)) {
      return NextResponse.json({ error: 'Invalid Bitcoin address' }, { status: 400 });
    }
    if (body.solanaAddress && !validateSolanaAddress(body.solanaAddress)) {
      return NextResponse.json({ error: 'Invalid Solana address' }, { status: 400 });
    }
    if (body.phantomUsername && !validatePhantomUsername(body.phantomUsername)) {
      return NextResponse.json({ error: 'Invalid Phantom username (must start with @)' }, { status: 400 });
    }

    const validated = campaignSettingsSchema.parse(body);
    const settingsUpdate = {
      bitcoin_address: validated.bitcoinAddress,
      solana_address: validated.solanaAddress,
      phantom_username: validated.phantomUsername,
      kofi_enabled: validated.kofiEnabled,
      kofi_url: validated.kofiUrl || null,
      kofi_label: validated.kofiLabel || 'Support on Ko-fi',
      ...(validated.kofiStatus !== undefined ? { kofi_status: validated.kofiStatus } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await admin
      .from('campaign_settings')
      .update(settingsUpdate)
      .eq('campaign_id', campaign.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    const actionMap: Record<string, string> = {
      bitcoinAddress: 'payment.bitcoin_address_updated',
      solanaAddress: 'payment.solana_address_updated',
      phantomUsername: 'payment.phantom_username_updated',
      kofiEnabled: 'payment.kofi_settings_updated',
      kofiUrl: 'payment.kofi_settings_updated',
      kofiLabel: 'payment.kofi_settings_updated',
      kofiStatus: 'payment.kofi_settings_updated',
    };

    const changedFields = Object.keys(body);
    for (const field of changedFields) {
      if (actionMap[field]) {
        await admin.from('admin_audit_logs').insert({
          action: actionMap[field],
          resource: 'campaign_settings',
          resource_id: updated.id,
          details: { field, oldValue: '***', newValue: field.includes('Address') ? '***VALIDATED***' : body[field] },
        });
      }
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Admin payments PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}