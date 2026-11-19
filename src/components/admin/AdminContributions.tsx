'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ContributionStatus = 'pending' | 'confirmed' | 'rejected' | 'refunded' | 'reversed';
interface Contribution {
  id: string;
  paymentMethod: string;
  transactionHash: string;
  amount: number;
  currency: string;
  status: ContributionStatus;
  submittedAt: string;
  confirmedAt: string | null;
  reconNotes: string;
}

function fromRow(row: Record<string, unknown>): Contribution {
  return {
    id: String(row.id),
    paymentMethod: String(row.payment_method || ''),
    transactionHash: String(row.transaction_hash || ''),
    amount: Number(row.amount || 0),
    currency: String(row.currency || ''),
    status: (['pending', 'confirmed', 'rejected', 'refunded', 'reversed'].includes(String(row.status))
      ? String(row.status) : 'pending') as ContributionStatus,
    submittedAt: String(row.submitted_at || ''),
    confirmedAt: row.confirmed_at ? String(row.confirmed_at) : null,
    reconNotes: String(row.recon_notes || ''),
  };
}

function amountLabel(amount: number, currency: string) {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currency}`;
}

export function AdminContributions() {
  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | ContributionStatus>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadContributions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/contributions', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load contributions');
      setContributions(Array.isArray(payload.contributions) ? payload.contributions.map(fromRow) : []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load contributions' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadContributions(); }, [loadContributions]);

  const runAction = async (contribution: Contribution, action: 'verify' | 'reject' | 'notes') => {
    let reconNotes = contribution.reconNotes;
    let usdValue: number | undefined;
    let exchangeRate: number | undefined;

    if (action === 'verify') {
      if (!window.confirm(`Confirm that you have independently verified ${amountLabel(contribution.amount, contribution.currency)} and its transaction?`)) return;
      if (contribution.currency.toUpperCase() !== 'USD') {
        const usdInput = window.prompt('Enter the verified USD value for this contribution:');
        if (usdInput === null) return;
        const rateInput = window.prompt(`Enter the verified USD exchange rate for 1 ${contribution.currency}:`);
        if (rateInput === null) return;
        usdValue = Number(usdInput);
        exchangeRate = Number(rateInput);
        if (!Number.isFinite(usdValue) || usdValue <= 0 || !Number.isFinite(exchangeRate) || exchangeRate <= 0) {
          setMessage({ type: 'error', text: 'USD value and exchange rate must both be greater than zero.' });
          return;
        }
      }
    } else if (action === 'reject') {
      if (!window.confirm('Reject this contribution?')) return;
      const note = window.prompt('Reason for rejection (optional):');
      if (note === null) return;
      reconNotes = note;
    } else {
      const note = window.prompt('Reconciliation notes:', contribution.reconNotes);
      if (note === null) return;
      reconNotes = note;
    }

    setProcessingId(contribution.id);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/contributions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributionId: contribution.id,
          action,
          reconNotes,
          ...(usdValue !== undefined ? { usdValue, exchangeRate, rateSource: 'manual_admin_entry' } : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to update contribution');
      setMessage({ type: 'success', text: action === 'verify' ? 'Contribution confirmed.' : action === 'reject' ? 'Contribution rejected.' : 'Notes saved.' });
      await loadContributions();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to update contribution' });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = contributions.filter((item) => {
    const q = search.toLowerCase();
    const matches = item.transactionHash.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return matches && (statusFilter === 'all' || item.status === statusFilter);
  });
  const count = (status: ContributionStatus) => contributions.filter((item) => item.status === status).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Contributions</h1>
          <p className="mt-1 text-stone-600">Review submitted transactions and record manual verification.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning">{count('pending')} Pending</Badge>
          <Badge variant="success">{count('confirmed')} Confirmed</Badge>
          <Badge variant="error">{count('rejected')} Rejected</Badge>
        </div>
      </header>

      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}

      <Card variant="default" padding="md">
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Input placeholder="Search by transaction hash or ID..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-lg flex-1" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 sm:w-48">
            <option value="all">All statuses</option>
            {(['pending', 'confirmed', 'rejected', 'refunded', 'reversed'] as ContributionStatus[]).map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </CardContent>
      </Card>

      <Card variant="default" padding="md">
        <CardContent>
          {isLoading ? <p className="py-10 text-center text-stone-500">Loading contributions...</p> :
           filtered.length === 0 ? <p className="py-10 text-center text-stone-500">No contributions found.</p> :
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead><tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                 <th className="px-3 py-3">Method</th><th className="px-3 py-3">Transaction</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Submitted</th><th className="px-3 py-3">Actions</th>
               </tr></thead>
               <tbody className="divide-y divide-stone-100">
                 {filtered.map((item) => <tr key={item.id}>
                   <td className="px-3 py-4 text-sm font-medium text-charcoal-800">{item.paymentMethod.toUpperCase()}</td>
                   <td className="px-3 py-4"><code className="block max-w-xs truncate text-xs text-stone-600" title={item.transactionHash}>{item.transactionHash}</code><span className="text-xs text-stone-400">{item.id}</span></td>
                   <td className="px-3 py-4 text-right text-sm font-mono">{amountLabel(item.amount, item.currency)}</td>
                   <td className="px-3 py-4"><Badge variant={item.status === 'confirmed' ? 'success' : item.status === 'pending' ? 'warning' : 'error'}>{item.status}</Badge></td>
                   <td className="px-3 py-4 text-xs text-stone-500">{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : '—'}</td>
                   <td className="px-3 py-4"><div className="flex flex-wrap gap-2">
                     {item.status === 'pending' && <>
                       <Button size="sm" disabled={processingId === item.id} onClick={() => void runAction(item, 'verify')}>{processingId === item.id ? 'Saving...' : 'Verify'}</Button>
                       <Button size="sm" variant="outline" disabled={processingId === item.id} onClick={() => void runAction(item, 'reject')}>Reject</Button>
                     </>}
                     <Button size="sm" variant="ghost" disabled={processingId === item.id} onClick={() => void runAction(item, 'notes')}>Notes</Button>
                   </div></td>
                 </tr>)}
               </tbody>
             </table>
           </div>}
        </CardContent>
      </Card>
      <p className="text-xs text-stone-500">Crypto contributions require an independently verified exchange rate and USD value before they can be counted toward the campaign total.</p>
    </div>
  );
}
