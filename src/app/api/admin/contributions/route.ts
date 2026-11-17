import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { verifyAdminApiAuth } from '@/lib/admin-api-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const verifySchema = z.object({
  contributionId: z.string().uuid(),
  action: z.enum(['verify', 'reject', 'refund', 'reverse']),
  reconNotes: z.string().optional(),
  // For manual USD conversion override
  usdValue: z.number().positive().optional(),
  exchangeRate: z.number().positive().optional(),
  rateSource: z.string().optional(),
});

// Exchange rate fetching function (can be replaced with external API)
async function fetchExchangeRate(currency: string): Promise<{ rate: number; source: string } | null> {
  // In production, integrate with CoinGecko, CoinMarketCap, or similar
  // For now, return mock rates - ADMIN MUST OVERRIDE WITH REAL RATES
  const mockRates: Record<string, number> = {
    'BTC': 45000, // 1 BTC = $45,000
    'SOL': 100,   // 1 SOL = $100
    'USD': 1,     // 1 USD = $1
  };

  const rate = mockRates[currency.toUpperCase()];
  if (rate) {
    return { rate, source: 'manual_mock' };
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const authError = await verifyAdminApiAuth();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const admin = getAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = admin
      .from('contributions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`transaction_hash.ilike.%${search}%,id.ilike.%${search}%`);
    }

    const { data: contributions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contributions: contributions || [] });
  } catch (error) {
    console.error('Admin contributions GET error:', error);
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
    const { contributionId, action, reconNotes, usdValue, exchangeRate, rateSource } = verifySchema.parse(body);
    const admin = getAdminClient();

    // Get contribution
    const { data: contribution, error: fetchError } = await admin
      .from('contributions')
      .select('*')
      .eq('id', contributionId)
      .single();

    if (fetchError || !contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    if (contribution.status !== 'pending' && action !== 'refund' && action !== 'reverse') {
      return NextResponse.json(
        { error: 'Contribution has already been processed' },
        { status: 400 }
      );
    }

    // For refund/reverse, contribution must be confirmed
    if ((action === 'refund' || action === 'reverse') && contribution.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Can only refund or reverse confirmed contributions' },
        { status: 400 }
      );
    }

    let updateData: Record<string, unknown> = {};
    let auditAction = '';

    if (action === 'verify') {
      // Fetch exchange rate if not provided manually
      let finalUsdValue = usdValue;
      let finalExchangeRate = exchangeRate;
      let finalRateSource = rateSource;
      const finalRateTimestamp = new Date().toISOString();

      if (!finalUsdValue || !finalExchangeRate) {
        const rateData = await fetchExchangeRate(contribution.currency);
        if (rateData) {
          finalExchangeRate = finalExchangeRate || rateData.rate;
          finalRateSource = finalRateSource || rateData.source;
          if (!finalUsdValue) {
            finalUsdValue = Number(contribution.amount) * finalExchangeRate;
          }
        } else {
          // If no rate available and not manually provided, require manual entry
          return NextResponse.json(
            { error: 'Exchange rate required for USD conversion. Please provide usdValue and exchangeRate manually.' },
            { status: 400 }
          );
        }
      }

      updateData = {
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || null,
        usd_value: finalUsdValue,
        exchange_rate: finalExchangeRate,
        rate_source: finalRateSource,
        rate_timestamp: finalRateTimestamp,
      };
      auditAction = 'contribution.verified';
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || 'Rejected by admin',
      };
      auditAction = 'contribution.rejected';
    } else if (action === 'refund') {
      updateData = {
        status: 'refunded',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || 'Refunded by admin',
      };
      auditAction = 'contribution.refunded';
    } else if (action === 'reverse') {
      updateData = {
        status: 'reversed',
        confirmed_at: new Date().toISOString(),
        recon_notes: reconNotes || 'Reversed by admin',
      };
      auditAction = 'contribution.reversed';
    }

    const { data: updated, error } = await admin
      .from('contributions')
      .update(updateData)
      .eq('id', contributionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: auditAction,
      resource: 'contributions',
      resource_id: contributionId,
      details: {
        payment_method: contribution.payment_method,
        amount: contribution.amount,
        currency: contribution.currency,
        transaction_hash: contribution.transaction_hash.slice(0, 20) + '...',
        recon_notes: reconNotes,
        usd_value: updateData.usd_value,
        exchange_rate: updateData.exchange_rate,
        rate_source: updateData.rate_source,
      },
    });

    return NextResponse.json({ success: true, contribution: updated });
  } catch (error) {
    console.error('Admin contributions PATCH error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}