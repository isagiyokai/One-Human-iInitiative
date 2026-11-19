'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RepaymentContact {
  id: string;
  contributionId: string;
  platform: 'ko-fi' | 'buy-me-a-coffee';
  url: string;
  consentGiven: boolean;
  consentAt: string | null;
  createdAt: string;
}

function fromRow(row: Record<string, unknown>): RepaymentContact {
  return {
    id: String(row.id),
    contributionId: String(row.contribution_id || ''),
    platform: row.platform === 'buy-me-a-coffee' ? 'buy-me-a-coffee' : 'ko-fi',
    url: String(row.url || ''),
    consentGiven: Boolean(row.consent_given),
    consentAt: row.consent_at ? String(row.consent_at) : null,
    createdAt: String(row.created_at || ''),
  };
}

export function AdminRepaymentContacts() {
  const [contacts, setContacts] = React.useState<RepaymentContact[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadContacts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/repayment-contacts', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load repayment contacts');
      setContacts(Array.isArray(payload.contacts) ? payload.contacts.map(fromRow) : []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load repayment contacts' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadContacts(); }, [loadContacts]);

  const removeContact = async (id: string) => {
    if (!window.confirm('Remove this private repayment contact? The original record will be soft-deleted.')) return;
    setDeletingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/repayment-contacts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to remove contact');
      setMessage({ type: 'success', text: 'Repayment contact removed.' });
      await loadContacts();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to remove contact' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = contacts.filter((contact) => contact.contributionId.toLowerCase().includes(search.toLowerCase()) || contact.url.toLowerCase().includes(search.toLowerCase()) || contact.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold text-charcoal-900">Repayment Contacts</h1><p className="mt-1 text-stone-600">Private contact links stored with supporter consent.</p></div>
        <Badge variant="info">{contacts.length} contacts</Badge>
      </header>
      <Card variant="outlined" padding="md"><CardContent><p className="text-sm text-stone-700">These links are private supporter data and are only returned through the authenticated admin API. Avoid copying them into public updates or messages.</p></CardContent></Card>
      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}
      <Card variant="default" padding="md"><CardContent><Input placeholder="Search by contribution ID or contact URL..." value={search} onChange={(event) => setSearch(event.target.value)} /></CardContent></Card>
      <Card variant="default" padding="md">
        <CardContent>
          {isLoading ? <p className="py-10 text-center text-stone-500">Loading private contact records...</p> :
           filtered.length === 0 ? <p className="py-10 text-center text-stone-500">No repayment contacts found.</p> :
           <div className="overflow-x-auto"><table className="w-full text-left">
             <thead><tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500"><th className="px-3 py-3">Contribution</th><th className="px-3 py-3">Platform</th><th className="px-3 py-3">Contact URL</th><th className="px-3 py-3">Consent</th><th className="px-3 py-3">Submitted</th><th className="px-3 py-3">Action</th></tr></thead>
             <tbody className="divide-y divide-stone-100">{filtered.map((contact) => <tr key={contact.id}>
               <td className="px-3 py-4 text-xs font-mono text-stone-600">{contact.contributionId}</td>
               <td className="px-3 py-4 text-sm text-charcoal-800">{contact.platform === 'ko-fi' ? 'Ko-fi' : 'Buy Me a Coffee'}</td>
               <td className="px-3 py-4 text-sm"><a href={contact.url} target="_blank" rel="noopener noreferrer" className="break-all text-earth-700 underline">{contact.url}</a></td>
               <td className="px-3 py-4"><Badge variant={contact.consentGiven ? 'success' : 'warning'}>{contact.consentGiven ? 'Given' : 'Not recorded'}</Badge></td>
               <td className="px-3 py-4 text-xs text-stone-500">{contact.createdAt ? new Date(contact.createdAt).toLocaleString() : '—'}</td>
               <td className="px-3 py-4"><Button size="sm" variant="ghost" disabled={deletingId === contact.id} onClick={() => void removeContact(contact.id)}>{deletingId === contact.id ? 'Removing...' : 'Remove'}</Button></td>
             </tr>)}</tbody>
           </table></div>}
        </CardContent>
      </Card>
    </div>
  );
}
