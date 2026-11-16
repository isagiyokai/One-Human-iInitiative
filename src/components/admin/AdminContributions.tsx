'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface Contribution {
  id: string;
  paymentMethod: 'bitcoin' | 'solana' | 'phantom' | 'kofi';
  transactionHash: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'rejected';
  submittedAt: string;
  confirmedAt?: string;
  reconNotes?: string;
}

const mockContributions: Contribution[] = [
  {
    id: '1',
    paymentMethod: 'bitcoin',
    transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    amount: 0.025,
    currency: 'BTC',
    status: 'confirmed',
    submittedAt: '2024-01-16T10:30:00Z',
    confirmedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: '2',
    paymentMethod: 'solana',
    transactionHash: '5KJp9mN2xV7qR4wE8tY3uI1oP6aS9dF2gH5jK8lM3nB6vC9xZ2qW5rT8yU1iO',
    amount: 150,
    currency: 'SOL',
    status: 'confirmed',
    submittedAt: '2024-01-17T14:20:00Z',
    confirmedAt: '2024-01-17T14:45:00Z',
  },
  {
    id: '3',
    paymentMethod: 'phantom',
    transactionHash: '3N4m5K6j7H8g9F0d1S2a3Z4x5C6v7B8n9M0q1W2e3R4t5Y7u8I9o0P1p2Q',
    amount: 75,
    currency: 'SOL',
    status: 'pending',
    submittedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: '4',
    paymentMethod: 'bitcoin',
    transactionHash: 'f6e5d4c3b2a109876543210fedcba9876543210fedcba9876543210fedcba987',
    amount: 0.01,
    currency: 'BTC',
    status: 'pending',
    submittedAt: '2024-01-21T16:45:00Z',
  },
  {
    id: '5',
    paymentMethod: 'kofi',
    transactionHash: 'kofi_1234567890',
    amount: 25,
    currency: 'USD',
    status: 'rejected',
    submittedAt: '2024-01-18T12:00:00Z',
    confirmedAt: '2024-01-18T12:30:00Z',
    reconNotes: 'Duplicate transaction - already processed',
  },
];

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const },
  confirmed: { label: 'Confirmed', variant: 'success' as const },
  rejected: { label: 'Rejected', variant: 'error' as const },
};

const methodIcons: Record<string, React.ReactNode> = {
  bitcoin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v2h2v-2zm0 4h-2v4h2v-4z"/>
    </svg>
  ),
  solana: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.055 3.309l8.553 3.86-1.826 7.304c-.23.92-.822 1.485-1.58 1.425l-6.115-.491 3.573-5.209c.32-.467.148-.96-.246-1.13l-4.807-2.167 1.646-6.584zm1.89 1.588 4.597 2.075-2.739 8.218c-.083.25-.345.25-.428 0L8.433 11.26l3.681-5.363zM14.753 8.49l-3.359 4.897-3.816-.307 3.246-4.69 3.929.1z"/>
    </svg>
  ),
  phantom: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v2h-2zm0 4h2v4h-2z"/>
    </svg>
  ),
  kofi: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  ),
};

export function AdminContributions() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [contributions] = React.useState<Contribution[]>(mockContributions);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [reconNotes, setReconNotes] = React.useState('');

  const filteredContributions = contributions.filter(c => {
    const matchesSearch = c.transactionHash.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = contributions.filter(c => c.status === 'pending').length;
  const confirmedCount = contributions.filter(c => c.status === 'confirmed').length;
  const rejectedCount = contributions.filter(c => c.status === 'rejected').length;

  const handleVerify = (id: string) => {
    const contribution = contributions.find(c => c.id === id);
    if (!contribution) return;
    if (confirm(`Verify this ${contribution.paymentMethod.toUpperCase()} contribution of ${contribution.amount} ${contribution.currency}?`)) {
      // In real implementation, call API to verify
      console.log('Verified:', id);
      alert('Contribution verified! (Demo - would call API in production)');
    }
  };

  const handleReject = (id: string) => {
    const contribution = contributions.find(c => c.id === id);
    if (!contribution) return;
    const notes = prompt('Enter rejection reason:');
    if (notes !== null) {
      // In real implementation, call API to reject
      console.log('Rejected:', id, notes);
      alert('Contribution rejected! (Demo - would call API in production)');
    }
  };

  const handleEditNotes = (contribution: Contribution) => {
    setEditingId(contribution.id);
    setReconNotes(contribution.reconNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    // In real implementation, call API to save notes
    console.log('Save notes:', id, reconNotes);
    setEditingId(null);
    setReconNotes('');
    alert('Notes saved! (Demo - would call API in production)');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Contributions</h1>
          <p className="mt-1 text-stone-600">Review and verify pending contributions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning">{pendingCount} Pending</Badge>
          <Badge variant="success">{confirmedCount} Confirmed</Badge>
          <Badge variant="error">{rejectedCount} Rejected</Badge>
        </div>
      </header>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by transaction hash or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'rejected')}
            className="w-full sm:w-48 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </CardContent>
      </Card>

      {/* Contributions Table */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Method</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Transaction Hash</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Amount</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono text-charcoal-900">{contribution.id}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-2 text-sm text-charcoal-700">
                        {methodIcons[contribution.paymentMethod]}
                        {contribution.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm font-mono text-charcoal-600 truncate block max-w-xs">
                        {contribution.transactionHash.slice(0, 20)}...
                      </code>
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-mono text-charcoal-900">
                      {formatCurrency(contribution.amount)} {contribution.currency}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={statusConfig[contribution.status].variant} size="sm">
                        {statusConfig[contribution.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-stone-600">
                      {new Date(contribution.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {contribution.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleVerify(contribution.id)}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() => handleReject(contribution.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {contribution.status !== 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotes(contribution)}
                          >
                            Notes
                          </Button>
                        )}
                        {editingId === contribution.id && (
                          <>
                            <input
                              type="text"
                              value={reconNotes}
                              onChange={(e) => setReconNotes(e.target.value)}
                              placeholder="Reconciliation notes..."
                              className="w-48 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-charcoal-500"
                            />
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSaveNotes(contribution.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingId(null); setReconNotes(''); }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContributions.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-600">No contributions match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}