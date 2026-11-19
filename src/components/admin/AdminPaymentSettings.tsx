'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PaymentForm {
  bitcoinAddress: string;
  solanaAddress: string;
}

export function AdminPaymentSettings() {
  const [formData, setFormData] = React.useState<PaymentForm>({
    bitcoinAddress: '',
    solanaAddress: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/payments', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load payment settings');
        if (!cancelled && data.settings) {
          setFormData({
            bitcoinAddress: data.settings.bitcoin_address || '',
            solanaAddress: data.settings.solana_address || '',
          });
        }
      } catch (err) {
        if (!cancelled) setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to load settings' });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData(current => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save wallet addresses');
      setMessage({ type: 'success', text: 'Bitcoin and Solana wallet addresses saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save wallet addresses' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-charcoal-900">Payment Settings</h1>
        <p className="mt-1 text-stone-600">The campaign accepts Bitcoin and Solana only.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Bitcoin (BTC)</CardTitle>
            <CardDescription>Bitcoin mainnet receiving address</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="bitcoinAddress" className="block text-sm font-medium text-charcoal-900 mb-2">Bitcoin address</label>
            <input id="bitcoinAddress" name="bitcoinAddress" value={formData.bitcoinAddress} onChange={handleChange} required disabled={isLoading || isSaving} autoComplete="off" spellCheck={false} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 font-mono text-sm focus:border-earth-600 focus:outline-none focus:ring-2 focus:ring-earth-200" placeholder="bc1..." />
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Solana (SOL)</CardTitle>
            <CardDescription>Solana mainnet receiving address</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="solanaAddress" className="block text-sm font-medium text-charcoal-900 mb-2">Solana address</label>
            <input id="solanaAddress" name="solanaAddress" value={formData.solanaAddress} onChange={handleChange} required disabled={isLoading || isSaving} autoComplete="off" spellCheck={false} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 font-mono text-sm focus:border-earth-600 focus:outline-none focus:ring-2 focus:ring-earth-200" placeholder="Base58 public key" />
          </CardContent>
        </Card>

        <Card variant="outlined" padding="lg">
          <CardHeader><CardTitle>Before accepting contributions</CardTitle></CardHeader>
          <CardContent className="text-sm text-stone-600">
            Confirm both addresses in your own wallets. Send only BTC on Bitcoin mainnet to the Bitcoin address and SOL or supported Solana assets on Solana mainnet to the Solana address. Never send funds to an address copied from an untrusted message.
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || isSaving} size="lg">
            {isLoading ? 'Loading...' : isSaving ? 'Saving...' : 'Save Wallet Addresses'}
          </Button>
        </div>
      </form>
    </div>
  );
}
