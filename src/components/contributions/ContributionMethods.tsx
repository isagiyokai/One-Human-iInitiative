'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QRCodeComponent as QRCode } from '@/components/ui/QRCode';
import { CopyToClipboard } from './CopyToClipboard';

interface PaymentSettings {
  bitcoin_address: string;
  solana_address: string;
  phantom_username: string;
  kofi_enabled: boolean;
  kofi_url: string;
  kofi_label: string;
  kofi_status: string;
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
  },
  {
    id: 'solana',
    name: 'Solana',
    network: 'SOL',
    instructions: 'Send SOL or SPL tokens to the address above. Minimum 0.001 SOL for transaction fees.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.055 3.309l8.553 3.86-1.826 7.304c-.23.92-.822 1.485-1.58 1.425l-6.115-.491 3.573-5.209c.32-.467.148-.96-.246-1.13l-4.807-2.167 1.646-6.584zm1.89 1.588 4.597 2.075-2.739 8.218c-.083.25-.345.25-.428 0L8.433 11.26l3.681-5.363zM14.753 8.49l-3.359 4.897-3.816-.307 3.246-4.69 3.929.1z"/>
      </svg>
    ),
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'phantom',
    name: 'Phantom Username',
    network: 'Phantom',
    instructions: 'Open Phantom Wallet, go to Send, enter the username above as the recipient. Supports SOL and SPL tokens.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v2h-2zm0 4h2v4h-2z"/>
      </svg>
    ),
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    network: 'Ko-fi',
    instructions: 'Visit the Ko-fi page to contribute via card, PayPal, or other methods. Ko-fi takes a small platform fee.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
      </svg>
    ),
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
];

function buildMethods(settings: PaymentSettings): ContributionMethod[] {
  return methodConfigs.map(config => {
    if (config.id === 'bitcoin') {
      return {
        ...config,
        address: settings.bitcoin_address,
        qrCode: `bitcoin:${settings.bitcoin_address}`,
        enabled: true,
      };
    }
    if (config.id === 'solana') {
      return {
        ...config,
        address: settings.solana_address,
        qrCode: `solana:${settings.solana_address}`,
        enabled: true,
      };
    }
    if (config.id === 'phantom') {
      return {
        ...config,
        address: settings.phantom_username,
        qrCode: `https://phantom.app/ul/${settings.phantom_username.replace('@', '')}`,
        enabled: true,
      };
    }
    return {
      ...config,
      address: settings.kofi_url.replace('https://ko-fi.com/', ''),
      qrCode: settings.kofi_url,
      enabled: settings.kofi_enabled && settings.kofi_status === 'active',
      disabledReason: !settings.kofi_enabled ? 'Ko-fi integration not enabled' : settings.kofi_status !== 'active' ? 'Ko-fi integration pending approval. Currently not available.' : undefined,
    };
  });
}

export function ContributionMethods() {
  const [settings, setSettings] = React.useState<PaymentSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/campaign');
        if (!res.ok) throw new Error('Failed to load payment settings');
        const data = await res.json();
        setSettings(data.settings);
      } catch (err) {
        setError('Unable to load contribution methods. Please try again later.');
        console.error('Failed to fetch payment settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <header className="text-center max-w-2xl mx-auto">
          <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
            Ways to Contribute
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Choose the method that works best for you. All contributions are verified manually on-chain.
            100% of confirmed funds reach the recipient directly.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    {config.id === 'phantom' ? 'Username' : 'Address'}
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
      <div className="space-y-8 animate-fade-in">
        <header className="text-center max-w-2xl mx-auto">
          <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
            Ways to Contribute
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Choose the method that works best for you. All contributions are verified manually on-chain.
            100% of confirmed funds reach the recipient directly.
          </p>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || 'Unable to load contribution methods'}</p>
        </div>
      </div>
    );
  }

  const methods = buildMethods(settings);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center max-w-2xl mx-auto">
        <h2 id="contribute-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
          Ways to Contribute
        </h2>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Choose the method that works best for you. All contributions are verified manually on-chain.
          100% of confirmed funds reach the recipient directly.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map((method) => (
          <ContributionMethodCard key={method.id} method={method} />
        ))}
      </div>

      {/* Verification Notice */}
      <div className="rounded-2xl border border-stone-200 bg-warm-white p-6 sm:p-8 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-charcoal-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-900 mb-2">How Verification Works</h3>
            <ul className="text-sm text-stone-600 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>After sending, copy the transaction hash (TXID)</li>
              <li>Submit it via the contribution form (coming soon)</li>
              <li>Admin verifies on-chain within 24 hours</li>
              <li>Once confirmed, your contribution counts toward the target</li>
              <li>Duplicate transaction hashes are automatically rejected</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContributionMethodCard({ method }: { method: ContributionMethod }) {
  return (
    <Card
      variant={method.enabled ? 'default' : 'outlined'}
      padding="lg"
      className="relative hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out"
      hover
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
            {method.id === 'phantom' ? 'Username' : 'Address'}
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono text-charcoal-900 bg-stone-100 px-3 py-2 rounded-lg break-all">
              {method.address}
            </code>
            <CopyToClipboard
              text={method.address}
              disabled={!method.enabled}
              aria-label={`Copy ${method.name} address`}
            />
          </div>
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

        {method.enabled && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigator.clipboard.writeText(method.address)}
          >
            Copy Address
          </Button>
        )}
      </CardContent>
    </Card>
  );
}