'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QRCodeComponent as QRCode } from '@/components/ui/QRCode';
import { CopyWalletAddressButton } from './CopyWalletAddressButton';

interface PaymentSettings {
  bitcoin_address: string;
  solana_address: string;
}

interface ContributionMethod {
  id: string;
  name: string;
  network: string;
  address: string;
  qrCode: string;
  instructions: string;
  enabled: boolean;
  disabledReason?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  bgColorLight: string;
}

const methodConfigs: Omit<ContributionMethod, 'address' | 'qrCode' | 'enabled' | 'disabledReason'>[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    network: 'BTC',
    instructions: 'Send BTC to the address above. Include a memo if your wallet supports it. Minimum 0.0001 BTC.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v2h2v-2zm0 4h-2v4h2v-4z"/>
      </svg>
    ),
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    bgColorLight: 'bg-amber-50',
  },
  {
    id: 'solana',
    name: 'Solana',
    network: 'SOL',
    instructions: 'Send native SOL only to the address above on Solana mainnet. Keep a small amount of SOL available for network fees.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.055 3.309l8.553 3.86-1.826 7.304c-.23.92-.822 1.485-1.58 1.425l-6.115-.491 3.573-5.209c.32-.467.148-.96-.246-1.13l-4.807-2.167 1.646-6.584zm1.89 1.588 4.597 2.075-2.739 8.218c-.083.25-.345.25-.428 0L8.433 11.26l3.681-5.363zM14.753 8.49l-3.359 4.897-3.816-.307 3.246-4.69 3.929.1z"/>
      </svg>
    ),
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    bgColorLight: 'bg-green-50',
  },

];

function buildMethods(settings: PaymentSettings, campaignActive: boolean): ContributionMethod[] {
  return methodConfigs.map((config) => {
    const isBitcoin = config.id === 'bitcoin';
    const address = isBitcoin ? settings.bitcoin_address : settings.solana_address;
    return {
      ...config,
      address,
      qrCode: isBitcoin ? `bitcoin:${address}` : `solana:${address}`,
      enabled: Boolean(address) && !isPlaceholderAddress(address, config.id) && campaignActive,
      disabledReason: !address || isPlaceholderAddress(address, config.id)
        ? 'Payment address is not configured'
        : !campaignActive
          ? 'The campaign is not currently accepting contributions'
          : undefined,
    };
  });
}

function isPlaceholderAddress(address: string, type: string): boolean {
  const placeholders: Record<string, string> = {
    bitcoin: 'bc1qexample',
    solana: 'SolanaExample',
  };
  return address.includes(placeholders[type] || '');
}

interface ContributionMethodsProps {
  initialSettings: PaymentSettings | null;
  initialCampaignActive: boolean;
}

export function ContributionMethods({
  initialSettings,
  initialCampaignActive,
}: ContributionMethodsProps) {
  // Render the server-loaded wallet addresses immediately. This avoids a blank
  // contribution area while mobile browsers wait for a client-side API request.
  const [settings, setSettings] = React.useState<PaymentSettings | null>(initialSettings);
  const [campaignActive, setCampaignActive] = React.useState(initialCampaignActive);
  const [isLoading, setIsLoading] = React.useState(!initialSettings);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const fetchSettings = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/campaign');
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Campaign not yet active. Please check back later.');
        }
        throw new Error('Failed to load payment settings');
      }
      const data = await res.json();
      // Handle both old and new API response structures
      setSettings(data.settings || data.content);
      setCampaignActive(data.campaign?.computed_status === 'active');
      setRetryCount(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load contribution methods. Please try again later.';
      setError(message);
      console.error('Failed to fetch payment settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // The homepage already loads public payment settings on the server.
    // Only use the API as a fallback when those settings were unavailable.
    if (!initialSettings) {
      fetchSettings();
    }
  }, [fetchSettings, initialSettings]);

  const methods = React.useMemo(() => settings ? buildMethods(settings, campaignActive) : [], [settings, campaignActive]);
  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-8 animate-fade-in">
        <header className="text-center max-w-2xl mx-auto">
          <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
            Ways to Contribute
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Choose the method that works best for you. Contributions are verified manually on-chain.
            You do not need to fill in the optional transaction form to contribute.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {methodConfigs.map((config) => (
            <Card key={config.id} variant="default" padding="lg" className="relative">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <CardDescription className="text-xs font-mono text-stone-500">{config.network}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
                    Address
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-charcoal-900 bg-stone-100 px-3 py-2 rounded-lg break-all animate-pulse">
                      Loading...
                    </code>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-stone-200 animate-pulse rounded" />
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <p className="text-sm text-stone-600 leading-relaxed animate-pulse">
                    {config.instructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="space-y-5 sm:space-y-8 animate-fade-in">
        <header className="text-center max-w-2xl mx-auto">
          <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
            Ways to Contribute
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Choose the method that works best for you. Contributions are verified manually on-chain.
            You do not need to fill in the optional transaction form to contribute.
          </p>
        </header>
        {error === 'Campaign not yet active. Please check back later.' ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-base font-semibold text-amber-900 mb-2">The campaign is being prepared</p>
            <p className="text-amber-800">Contribution options will appear here after the campaign and its payment destinations have been configured and verified. Please do not send funds to unofficial addresses.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700 mb-4">{error || 'Unable to load contribution methods'}</p>
            {retryCount < 3 && (
              <Button
                variant="outline"
                onClick={() => {
                  setRetryCount(c => c + 1);
                  fetchSettings();
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : `Retry (${retryCount}/3)`}
              </Button>
            )}
            {retryCount >= 3 && (
              <p className="text-sm text-stone-500 mt-2">
                Too many retries. Please refresh the page to try again.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <header className="text-center max-w-2xl mx-auto">
        <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
          Ways to Contribute
        </h2>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Choose the method that works best for you. Contributions are verified manually on-chain.
          You do not need to fill in the optional transaction form to contribute.
        </p>
      </header>

      {/* Always-visible contribution methods: no tab interaction required on mobile */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {methods.map((method) => (
          <ContributionMethodCard key={method.id} method={method} />
        ))}
      </div>

      <div className="mt-4 sm:mt-6 rounded-2xl border border-stone-200 bg-warm-white p-4 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-charcoal-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-900 mb-2">How Verification Works</h3>
            <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>You can contribute without submitting the form below</li>
              <li>Optionally share both the amount and transaction ID if you want help matching your transfer</li>
              <li>I will verify submitted transactions on-chain</li>
              <li>Confirmed contributions are added to the campaign total</li>
              <li>Duplicate transaction IDs are automatically rejected</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-8">
        <h3 className="font-semibold text-charcoal-900">New to crypto? Try Trust Wallet</h3>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          Trust Wallet supports Bitcoin and Solana and lets people buy supported crypto through payment
          providers inside the app. Buying options depend on the country, payment method, and provider;
          fees are shown before purchase.
        </p>
        <a
          href="https://trustwallet.com/download"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-charcoal-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-charcoal-800"
        >
          Get Trust Wallet
        </a>
        <p className="mt-3 text-xs text-stone-500 leading-relaxed">
          Before sending, select the correct asset and network: Bitcoin (BTC) on the Bitcoin network,
          or native SOL on Solana. Check the address carefully. Never share your wallet recovery phrase.
          If buying is not available in your country, use a trusted service supported where you live.
        </p>
      </div>
    </div>
  );
}

function ContributionMethodCard({ method }: { method: ContributionMethod }) {
  const isPlaceholder = isPlaceholderAddress(method.address, method.id);
  const [amount, setAmount] = React.useState('');
  const [transactionHash, setTransactionHash] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionMessage, setSubmissionMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleContributionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionMessage(null);

    const cleanAmount = amount.trim();
    const cleanTransactionHash = transactionHash.trim();

    if (!cleanAmount && !cleanTransactionHash) {
      setSubmissionMessage({
        type: 'success',
        text: 'No details submitted. You can still contribute; this form is optional.',
      });
      return;
    }

    if (!cleanAmount || !cleanTransactionHash) {
      setSubmissionMessage({
        type: 'error',
        text: 'To submit verification details, please provide both the amount and transaction ID. You can also leave both blank and skip this form.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (method.id !== 'bitcoin' && method.id !== 'solana') {
        throw new Error('Unsupported payment method');
      }

      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method.id,
          transactionHash: cleanTransactionHash,
          amount: Number(cleanAmount),
          currency: method.network,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit this contribution.');
      }

      setAmount('');
      setTransactionHash('');
      setSubmissionMessage({
        type: 'success',
        text: 'Transaction submitted. It is now pending manual verification.',
      });
    } catch (error) {
      setSubmissionMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to submit this contribution.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <Card
        variant={method.enabled ? 'default' : 'outlined'}
        padding="lg"
        className="relative"
      >
        {method.enabled && (
          <Badge variant="success" size="sm" className="absolute top-4 right-4">
            Active
          </Badge>
        )}
        {!method.enabled && (
          <Badge variant="default" size="sm" className="absolute top-4 right-4">
            Unavailable
          </Badge>
        )}

        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${method.bgColor} flex items-center justify-center ${method.color}`}>
              {method.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{method.name}</CardTitle>
              <CardDescription className="text-xs font-mono text-stone-500">{method.network}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Address/Username */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
              Address
            </label>
            <div className="flex items-center gap-2">
              <code className={`min-w-0 flex-1 text-xs sm:text-sm font-mono px-3 py-2 rounded-lg break-all ${
                isPlaceholder ? 'text-stone-500 bg-stone-100' : 'text-charcoal-900 bg-stone-100'
              }`}>
                {method.address}
              </code>
              <CopyWalletAddressButton
                address={method.address}
                label={`Copy ${method.name} address`}
              />
            </div>
            {isPlaceholder && method.enabled && (
              <p className="mt-2 text-xs text-amber-600">
                ⚠️ Placeholder address - configure in admin dashboard
              </p>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <QRCode
              value={method.qrCode}
              size={120}
              ariaLabel={`${method.name} payment QR code: ${method.address}`}
            />
          </div>

          {/* Instructions */}
          <div className="pt-2 border-t border-stone-200">
            <p className="text-sm text-stone-600 leading-relaxed">
              {method.instructions}
            </p>
          </div>

          {!method.enabled && method.disabledReason && (
            <div className="p-3 rounded-lg bg-stone-100 border border-stone-200">
              <p className="text-sm text-stone-600">{method.disabledReason}</p>
            </div>
          )}

          {method.enabled && !isPlaceholder && (
            <form onSubmit={handleContributionSubmit} className="space-y-4 border-t border-stone-200 pt-5">
              <div>
                <h3 className="font-semibold text-charcoal-900">Optional transaction details</h3>
                <p className="mt-1 text-sm text-stone-600">
                  You do not have to enter an amount or transaction ID to contribute. This form is only here
                  if you want to help me identify a transfer you have already made. You can leave both fields
                  blank and skip it. If you choose to submit details, please provide both.
                </p>
              </div>
              <div>
                <label htmlFor={`${method.id}-amount`} className="mb-1.5 block text-sm font-medium text-charcoal-900">Amount ({method.network}) — optional</label>
                <input
                  id={`${method.id}-amount`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step={method.network === 'BTC' ? '0.00000001' : '0.000000001'}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-earth-600 focus:outline-none focus:ring-2 focus:ring-earth-200"
                  placeholder={method.network === 'BTC' ? '0.001' : '0.5'}
                />
              </div>
              <div>
                <label htmlFor={`${method.id}-transaction-hash`} className="mb-1.5 block text-sm font-medium text-charcoal-900">Transaction ID — optional</label>
                <textarea
                  id={`${method.id}-transaction-hash`}
                  rows={3}
                  value={transactionHash}
                  onChange={(event) => setTransactionHash(event.target.value.trim())}
                  disabled={isSubmitting}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 font-mono text-xs focus:border-earth-600 focus:outline-none focus:ring-2 focus:ring-earth-200"
                  placeholder={method.network === 'BTC' ? '64-character Bitcoin transaction ID' : 'Solana transaction signature'}
                />
              </div>
              {submissionMessage && (
                <p className={`rounded-lg border p-3 text-sm ${submissionMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="status">
                  {submissionMessage.text}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit optional details for verification'}
              </Button>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}