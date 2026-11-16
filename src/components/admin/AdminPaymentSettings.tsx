'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const paymentMethods = [
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v2h2v-2zm0 4h-2v4h2v-4z"/>
      </svg>
    ),
    fields: [
      { name: 'bitcoinAddress', label: 'Bitcoin Address', type: 'text', placeholder: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', required: true },
    ],
  },
  {
    id: 'solana',
    name: 'Solana (SOL)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.055 3.309l8.553 3.86-1.826 7.304c-.23.92-.822 1.485-1.58 1.425l-6.115-.491 3.573-5.209c.32-.467.148-.96-.246-1.13l-4.807-2.167 1.646-6.584zm1.89 1.588 4.597 2.075-2.739 8.218c-.083.25-.345.25-.428 0L8.433 11.26l3.681-5.363zM14.753 8.49l-3.359 4.897-3.816-.307 3.246-4.69 3.929.1z"/>
      </svg>
    ),
    fields: [
      { name: 'solanaAddress', label: 'Solana Address', type: 'text', placeholder: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAtU', required: true },
    ],
  },
  {
    id: 'phantom',
    name: 'Phantom Username',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v2h-2zm0 4h2v4h-2z"/>
      </svg>
    ),
    fields: [
      { name: 'phantomUsername', label: 'Phantom Username', type: 'text', placeholder: '@onehumaninitiative', required: true },
    ],
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
      </svg>
    ),
    fields: [
      { name: 'kofiEnabled', label: 'Enable Ko-fi', type: 'checkbox' },
      { name: 'kofiUrl', label: 'Ko-fi URL', type: 'url', placeholder: 'https://ko-fi.com/onehumaninitiative', required: false },
      { name: 'kofiLabel', label: 'Button Label', type: 'text', placeholder: 'Support on Ko-fi', required: false },
      { name: 'kofiStatus', label: 'Status', type: 'select', options: ['pending_approval', 'active', 'disabled'], required: false },
    ],
  },
];

export function AdminPaymentSettings() {
  interface FormData {
    bitcoinAddress: string;
    solanaAddress: string;
    phantomUsername: string;
    kofiEnabled: boolean;
    kofiUrl: string;
    kofiLabel: string;
    kofiStatus: string;
    [key: string]: string | boolean;
  }

  const [formData, setFormData] = React.useState<FormData>({
    bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    solanaAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAtU',
    phantomUsername: '@onehumaninitiative',
    kofiEnabled: false,
    kofiUrl: 'https://ko-fi.com/onehumaninitiative',
    kofiLabel: 'Support on Ko-fi',
    kofiStatus: 'pending_approval',
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Payment settings saved successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-charcoal-900">Payment Settings</h1>
        <p className="mt-1 text-stone-600">Configure payment addresses for each contribution method</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} variant="default" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  {method.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  <CardDescription>
                    {method.id === 'kofi'
                      ? 'Ko-fi integration requires platform approval before enabling'
                      : 'Address/username shown publicly for contributions'}
                </CardDescription>
              </div>
            </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {method.fields.map((field) => {
                if (field.type === 'checkbox') {
                  return (
                    <div key={field.name} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name] as boolean}
                        onChange={handleChange}
                        id={field.name}
                        className="w-4 h-4 rounded border-stone-300 text-earth-600 focus:ring-earth-500"
                      />
                      <label htmlFor={field.name} className="font-medium text-charcoal-900">
                        {field.label}
                      </label>
                    </div>
                  );
                }
                if (field.type === 'select') {
                  return (
                    <Input
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] as string}
                      onChange={handleChange}
                    >
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                      ))}
                    </Input>
                  );
                }
                return (
                  <Input
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] as string}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={method.id === 'kofi' && field.name !== 'kofiEnabled' && !(formData.kofiEnabled as boolean)}
                  />
                );
              })}
              {method.id === 'kofi' && !formData.kofiEnabled && (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <p className="text-sm text-stone-600">
                    <strong>Note:</strong> Ko-fi requires platform approval. Enable only after your Ko-fi page is approved.
                    <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" className="text-earth-600 hover:underline ml-1">
                      Learn more
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Validation Notice */}
        <Card variant="outlined" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Address Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-stone-600">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Bitcoin:</strong> Must be a valid Bech32 (bc1...) or Legacy (1...) or SegWit (3...) address</li>
              <li><strong>Solana:</strong> Must be a valid base58 encoded public key (32-44 characters)</li>
              <li><strong>Phantom Username:</strong> Must start with @ and be a valid Phantom username</li>
              <li>Always verify addresses on a test transaction before going live</li>
              <li>Admin manually verifies all transactions on-chain before confirmation</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} size="lg">
            {isSaving ? 'Saving...' : 'Save Payment Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}