'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  ipHash: string;
  createdAt: string;
}

const actionLabels: Record<string, string> = {
  'campaign.status_changed': 'Campaign status changed',
  'campaign.settings_updated': 'Campaign settings updated',
  'payment.bitcoin_address_updated': 'Bitcoin address updated',
  'payment.solana_address_updated': 'Solana address updated',
  'payment.phantom_username_updated': 'Phantom username updated',
  'payment.kofi_settings_updated': 'Ko-fi settings updated',
  'contribution.verified': 'Contribution verified',
  'contribution.rejected': 'Contribution rejected',
  'contribution.notes_updated': 'Contribution notes updated',
  'expense.created': 'Expense created',
  'expense.updated': 'Expense updated',
  'expense.deleted': 'Expense deleted',
  'expense.published': 'Expense published',
  'expense.unpublished': 'Expense unpublished',
  'petition.approved': 'Petition approved',
  'petition.rejected': 'Petition rejected',
  'petition.cancelled': 'Petition cancelled',
  'update.created': 'Update created',
  'update.updated': 'Update updated',
  'update.published': 'Update published',
  'update.unpublished': 'Update unpublished',
  'update.deleted': 'Update deleted',
  'repayment_contact.deleted': 'Repayment contact deleted',
};

function fromRow(row: Record<string, unknown>): AuditLog {
  return {
    id: String(row.id),
    adminEmail: String(row.admin_email || 'Admin'),
    action: String(row.action || ''),
    resource: String(row.resource || ''),
    resourceId: row.resource_id ? String(row.resource_id) : null,
    details: row.details && typeof row.details === 'object' ? row.details as Record<string, unknown> : null,
    ipHash: String(row.ip_hash || '—'),
    createdAt: String(row.created_at || ''),
  };
}

export function AdminAuditLog() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [search, setSearch] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState('all');
  const [resourceFilter, setResourceFilter] = React.useState('all');
  const [offset, setOffset] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [message, setMessage] = React.useState<string | null>(null);
  const pageSize = 50;

  const loadLogs = React.useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams({ limit: String(pageSize), offset: String(offset) });
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (resourceFilter !== 'all') params.set('resource', resourceFilter);
      const response = await fetch(`/api/admin/audit?${params}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load audit history');
      setLogs(Array.isArray(payload.logs) ? payload.logs.map(fromRow) : []);
      setTotal(Number(payload.pagination?.total || 0));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load audit history');
    } finally {
      setIsLoading(false);
    }
  }, [offset, actionFilter, resourceFilter]);

  React.useEffect(() => { void loadLogs(); }, [loadLogs]);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return log.action.toLowerCase().includes(q) || log.resource.toLowerCase().includes(q) ||
      log.adminEmail.toLowerCase().includes(q) || log.id.toLowerCase().includes(q);
  });
  const uniqueActions = [...new Set(logs.map((log) => log.action))].sort();
  const uniqueResources = [...new Set(logs.map((log) => log.resource))].sort();

  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-charcoal-900">Audit Log</h1><p className="mt-1 text-stone-600">Read-only history returned by the database.</p></header>
      <Card variant="outlined" padding="md"><CardContent><p className="text-sm text-stone-700">Audit history is displayed from stored records. Older demo entries are not generated or substituted in this view.</p></CardContent></Card>
      {message && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{message}</div>}
      <Card variant="default" padding="md">
        <CardContent className="flex flex-col gap-3 lg:flex-row">
          <Input placeholder="Search this page..." value={search} onChange={(event) => setSearch(event.target.value)} className="flex-1" />
          <select value={actionFilter} onChange={(event) => { setOffset(0); setActionFilter(event.target.value); }} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 lg:w-64">
            <option value="all">All actions</option>
            {uniqueActions.map((action) => <option key={action} value={action}>{actionLabels[action] || action}</option>)}
          </select>
          <select value={resourceFilter} onChange={(event) => { setOffset(0); setResourceFilter(event.target.value); }} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 lg:w-48">
            <option value="all">All resources</option>
            {uniqueResources.map((resource) => <option key={resource} value={resource}>{resource}</option>)}
          </select>
        </CardContent>
      </Card>
      <Card variant="default" padding="md">
        <CardContent>
          {isLoading ? <p className="py-10 text-center text-stone-500">Loading audit records...</p> :
           filtered.length === 0 ? <p className="py-10 text-center text-stone-500">No audit records found.</p> :
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead><tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500"><th className="px-3 py-3">Time</th><th className="px-3 py-3">Admin</th><th className="px-3 py-3">Action</th><th className="px-3 py-3">Resource</th><th className="px-3 py-3">Details</th></tr></thead>
               <tbody className="divide-y divide-stone-100">{filtered.map((log) => <tr key={log.id}>
                 <td className="whitespace-nowrap px-3 py-4 text-xs text-stone-500">{log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}</td>
                 <td className="px-3 py-4 text-sm text-charcoal-700">{log.adminEmail}</td>
                 <td className="px-3 py-4 text-sm text-charcoal-900">{actionLabels[log.action] || log.action}</td>
                 <td className="px-3 py-4"><Badge variant="info">{log.resource}</Badge><div className="mt-1 text-xs text-stone-400">{log.resourceId || ''}</div></td>
                 <td className="max-w-md px-3 py-4"><details><summary className="cursor-pointer text-sm text-earth-700">View details</summary><pre className="mt-2 whitespace-pre-wrap rounded bg-stone-50 p-3 text-xs text-stone-700">{JSON.stringify(log.details || {}, null, 2)}</pre></details></td>
               </tr>)}</tbody>
             </table>
           </div>}
          <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
            <p className="text-sm text-stone-500">Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={offset === 0 || isLoading} onClick={() => setOffset((value) => Math.max(0, value - pageSize))}>Previous</Button>
              <Button size="sm" variant="outline" disabled={offset + pageSize >= total || isLoading} onClick={() => setOffset((value) => value + pageSize)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
