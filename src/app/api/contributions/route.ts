import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import {
  bitcoinContributionSchema,
  solanaContributionSchema,
  phantomContributionSchema,
  kofiContributionSchema
} from '@/lib/validators';
import { validateBitcoinAddress, validateSolanaAddress } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Get active campaign
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, status, target')
      .in('status', ['active', 'paused', 'target_reached'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!campaign) {
      return NextResponse.json(
        { error: 'No active campaign found' },
        { status: 404 }
      );
    }

    // Check if campaign can accept contributions
    if (campaign.status !== 'active') {
      return NextResponse.json(
        { error: 'Campaign is not accepting contributions at this time' },
        { status: 400 }
      );
    }

    // Get campaign settings for address validation
    const { data: settings } = await supabase
      .from('campaign_settings')
      .select('bitcoin_address, solana_address, kofi_enabled, kofi_status')
      .eq('campaign_id', campaign.id)
      .single();

    // Validate based on payment method
    let validatedData;
    const { paymentMethod } = body;

    switch (paymentMethod) {
      case 'bitcoin':
        validatedData = bitcoinContributionSchema.parse(body);
        if (settings && !validateBitcoinAddress(settings.bitcoin_address)) {
          return NextResponse.json(
            { error: 'Invalid Bitcoin address configured' },
            { status: 500 }
          );
        }
        break;
      case 'solana':
        validatedData = solanaContributionSchema.parse(body);
        if (settings && !validateSolanaAddress(settings.solana_address)) {
          return NextResponse.json(
            { error: 'Invalid Solana address configured' },
            { status: 500 }
          );
        }
        break;
      case 'phantom':
        validatedData = phantomContributionSchema.parse(body);
        break;
      case 'kofi':
        if (!settings?.kofi_enabled || settings.kofi_status !== 'active') {
          return NextResponse.json(
            { error: 'Ko-fi is not currently available' },
            { status: 400 }
          );
        }
        validatedData = kofiContributionSchema.parse(body);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
    }

    // Check for duplicate transaction hash
    const { data: existing } = await supabase
      .from('contributions')
      .select('id')
      .eq('transaction_hash', validatedData.transactionHash)
      .eq('payment_method', validatedData.paymentMethod)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This transaction has already been submitted' },
        { status: 409 }
      );
    }

    // Create pending contribution record
    const admin = getAdminClient();
    const { data: contribution, error } = await admin
      .from('contributions')
      .insert({
        campaign_id: campaign.id,
        payment_method: validatedData.paymentMethod,
        transaction_hash: validatedData.transactionHash,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Contribution insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create contribution record' },
        { status: 500 }
      );
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'contribution.submitted',
      resource: 'contributions',
      resource_id: contribution.id,
      details: {
        payment_method: validatedData.paymentMethod,
        amount: validatedData.amount,
        currency: validatedData.currency,
        transaction_hash: validatedData.transactionHash.slice(0, 20) + '...',
      },
    });

    return NextResponse.json({
      success: true,
      contributionId: contribution.id,
      message: 'Contribution submitted for verification. An admin will review it shortly.',
    });
  } catch (error) {
    console.error('Contribution API error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ contributions: [] });
    }

    // Get confirmed contributions (public view)
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select('id, payment_method, amount, currency, confirmed_at')
      .eq('campaign_id', campaign.id)
      .eq('status', 'confirmed')
      .order('confirmed_at', { ascending: false });

    if (error) {
      return NextResponse.json({ contributions: [] });
    }

    return NextResponse.json({ contributions: contributions || [] });
  } catch (error) {
    console.error('Contribution GET error:', error);
    return NextResponse.json({ contributions: [] });
  }
}