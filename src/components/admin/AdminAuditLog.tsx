'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  ipHash: string;
  createdAt: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'campaign.status_changed',
    resource: 'campaigns',
    resourceId: '1',
    details: { from: 'draft', to: 'active', reason: 'Campaign launch' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'payment.bitcoin_address_updated',
    resource: 'campaign_settings',
    resourceId: '1',
    details: { oldAddress: 'bc1old...', newAddress: 'bc1new...' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-15T00:05:00Z',
  },
  {
    id: '3',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'contribution.verified',
    resource: 'contributions',
    resourceId: '1',
    details: { amount: '0.025 BTC', transactionHash: 'a1b2c3d4...' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-16T11:00:00Z',
  },
  {
    id: '4',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'contribution.rejected',
    resource: 'contributions',
    resourceId: '5',
    details: { amount: '25 USD', reason: 'Duplicate transaction' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-18T12:30:00Z',
  },
  {
    id: '5',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'expense.created',
    resource: 'expenses',
    resourceId: '3',
    details: { category: 'Payment Processing', amount: '50 USD', status: 'draft' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '6',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'petition.approved',
    resource: 'petitions',
    resourceId: '1',
    details: { requestedTarget: 25000, previousTarget: 10000 },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-27T09:00:00Z',
  },
  {
    id: '7',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'update.published',
    resource: 'campaign_updates',
    resourceId: '2',
    details: { title: 'First Milestone Reached' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-18T15:30:00Z',
  },
  {
    id: '8',
    adminId: 'admin-1',
    adminEmail: 'admin@onehuman.org',
    action: 'repayment_contact.deleted',
    resource: 'repayment_contacts',
    resourceId: '2',
    details: { platform: 'buy-me-a-coffee', reason: 'Supporter request' },
    ipHash: 'a1b2c3d4...',
    createdAt: '2024-01-20T10:00:00Z',
  },
];

const actionLabels: Record<string, string> = {
  'campaign.status_changed': 'Campaign Status Changed',
  'campaign.settings_updated': 'Campaign Settings Updated',
  'payment.bitcoin_address_updated': 'Bitcoin Address Updated',
  'payment.solana_address_updated': 'Solana Address Updated',
  'payment.phantom_username_updated': 'Phantom Username Updated',
  'payment.kofi_settings_updated': 'Ko-fi Settings Updated',
  'contribution.verified': 'Contribution Verified',
  'contribution.rejected': 'Contribution Rejected',
  'contribution.notes_updated': 'Contribution Notes Updated',
  'expense.created': 'Expense Created',
  'expense.updated': 'Expense Updated',
  'expense.deleted': 'Expense Deleted',
  'expense.published': 'Expense Published',
  'expense.unpublished': 'Expense Unpublished',
  'petition.approved': 'Petition Approved',
  'petition.rejected': 'Petition Rejected',
  'petition.cancelled': 'Petition Cancelled',
  'update.created': 'Update Created',
  'update.updated': 'Update Updated',
  'update.published': 'Update Published',
  'update.unpublished': 'Update Unpublished',
  'update.deleted': 'Update Deleted',
  'repayment_contact.deleted': 'Repayment Contact Deleted',
};

const resourceLabels: Record<string, string> = {
  campaigns: 'Campaign',
  campaign_settings: 'Campaign Settings',
  contributions: 'Contributions',
  expenses: 'Expenses',
  petitions: 'Petitions',
  campaign_updates: 'Updates',
  repayment_contacts: 'Repayment Contacts',
};

export function AdminAuditLog() {
  const [search, setSearch] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [resourceFilter, setResourceFilter] = React.useState<string>('all');
  const [logs] = React.useState<AuditLog[]>(mockAuditLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter;
    return matchesSearch && matchesAction && matchesResource;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action))].sort();
  const uniqueResources = [...new Set(logs.map(l => l.resource))].sort();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-charcoal-900">Audit Log</h1>
        <p className="mt-1 text-stone-600">Read-only log of all administrative actions</p>
      </header>

      {/* Info Notice */}
      <Card variant="outlined" padding="md">
        <CardContent className="flex items-start gap-3">
          <svg className="w-5 h-5 text-stone-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-stone-700">
            <p className="font-medium text-charcoal-900 mb-1">Read-Only Access</p>
            <p>
              This audit log is append-only and cannot be modified or deleted.
              IP addresses are hashed for privacy. All admin actions are recorded here automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by action, resource, admin email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm flex-1"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {actionLabels[action] || action}
              </option>
            ))}
          </select>
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
          >
            <option value="all">All Resources</option>
            {uniqueResources.map(resource => (
              <option key={resource} value={resource}>
                {resourceLabels[resource] || resource}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Timestamp</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Admin</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Action</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Resource</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Resource ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Details</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono text-charcoal-900">{log.id}</td>
                    <td className="py-4 px-4 text-sm text-stone-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-charcoal-700">
                      {log.adminEmail}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-charcoal-900">{actionLabels[log.action] || log.action}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="info" size="sm">{resourceLabels[log.resource] || log.resource}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono text-charcoal-600">
                      {log.resourceId || '—'}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <details className="group">
                        <summary className="text-sm text-earth-600 hover:underline cursor-pointer select-none">
                          View details
                        </summary>
                        <pre className="mt-2 p-3 bg-stone-50 rounded text-xs text-charcoal-700 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono text-stone-500">
                      {log.ipHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-600">No audit logs match your filters</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Showing {filteredLogs.length} of {logs.length} entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}