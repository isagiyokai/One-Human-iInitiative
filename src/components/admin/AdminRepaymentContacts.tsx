'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface RepaymentContact {
  id: string;
  contributionId: string;
  platform: 'ko-fi' | 'buy-me-a-coffee';
  url: string;
  consentGiven: boolean;
  consentAt: string;
  createdAt: string;
}

const mockContacts: RepaymentContact[] = [
  {
    id: '1',
    contributionId: '1',
    platform: 'ko-fi',
    url: 'https://ko-fi.com/supporter123',
    consentGiven: true,
    consentAt: '2024-01-16T11:05:00Z',
    createdAt: '2024-01-16T11:05:00Z',
  },
  {
    id: '2',
    contributionId: '2',
    platform: 'buy-me-a-coffee',
    url: 'https://buymeacoffee.com/anon_supporter',
    consentGiven: true,
    consentAt: '2024-01-17T14:50:00Z',
    createdAt: '2024-01-17T14:50:00Z',
  },
  {
    id: '3',
    contributionId: '4',
    platform: 'ko-fi',
    url: 'https://ko-fi.com/another_supporter',
    consentGiven: true,
    consentAt: '2024-01-21T16:50:00Z',
    createdAt: '2024-01-21T16:50:00Z',
  },
];

const platformIcons = {
  'ko-fi': (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  ),
  'buy-me-a-coffee': (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  ),
};

export function AdminRepaymentContacts() {
  const [search, setSearch] = React.useState('');
  const [contacts] = React.useState<RepaymentContact[]>(mockContacts);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filteredContacts = contacts.filter(c =>
    c.contributionId.toLowerCase().includes(search.toLowerCase()) ||
    c.url.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = (id: string) => {
    if (confirm('Delete this repayment contact? This action cannot be undone.')) {
      // In real implementation, call API to delete
      console.log('Deleted:', id);
      alert('Contact deleted! (Demo - would call API in production)');
    }
    setDeletingId(null);
  };

  const cancelDelete = () => setDeletingId(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Repayment Contacts</h1>
          <p className="mt-1 text-stone-600">
            Private contact links submitted by supporters. Never shown publicly.
          </p>
        </div>
        <Badge variant="info">{contacts.length} Total Contacts</Badge>
      </header>

      {/* Privacy Notice */}
      <Card variant="outlined" padding="md">
        <CardContent className="flex items-start gap-3">
          <svg className="w-5 h-5 text-earth-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-sm text-stone-700">
            <p className="font-medium text-charcoal-900 mb-1">Privacy Protected</p>
            <p>
              These contact links are <strong>never displayed publicly</strong> and are only accessible
              to administrators. Supporters explicitly consented to share this information.
              Data is stored securely and can be deleted upon request.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent>
          <Input
            placeholder="Search by contribution ID, platform, or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Contribution</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Platform</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Contact URL</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Consent</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono text-charcoal-900">{contact.id}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-charcoal-700">#{contact.contributionId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-2 text-sm text-charcoal-700">
                        {platformIcons[contact.platform]}
                        {contact.platform === 'ko-fi' ? 'Ko-fi' : 'Buy Me a Coffee'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={contact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-earth-600 hover:underline truncate block max-w-xs"
                      >
                        {contact.url}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={contact.consentGiven ? 'success' : 'warning'} size="sm">
                        {contact.consentGiven ? 'Given' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-stone-600">
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {deletingId === contact.id ? (
                          <>
                            <Button variant="error" size="sm" onClick={() => confirmDelete(contact.id)}>
                              Confirm
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelDelete}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-600">No repayment contacts match your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}