'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: 'draft' | 'published';
  evidenceUrl: string;
  createdAt: string;
  publishedAt: string | null;
}

interface ExpenseDraft {
  category: string;
  description: string;
  amount: string;
  currency: string;
  status: 'draft' | 'published';
  evidenceUrl: string;
}

const categories = ['Hosting & Infrastructure', 'Domain & SSL', 'Payment Processing', 'Legal & Compliance', 'Design & Development', 'Marketing & Outreach', 'Transaction Fees', 'Other'];
const emptyDraft: ExpenseDraft = { category: 'Other', description: '', amount: '', currency: 'USD', status: 'draft', evidenceUrl: '' };

function fromRow(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id),
    category: String(row.category || ''),
    description: String(row.description || ''),
    amount: Number(row.amount || 0),
    currency: String(row.currency || 'USD'),
    status: row.status === 'published' ? 'published' : 'draft',
    evidenceUrl: String(row.evidence_url || ''),
    createdAt: String(row.created_at || ''),
    publishedAt: row.published_at ? String(row.published_at) : null,
  };
}

export function AdminExpenses() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'published'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<ExpenseDraft>(emptyDraft);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadExpenses = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/expenses', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load expenses');
      setExpenses(Array.isArray(payload.expenses) ? payload.expenses.map(fromRow) : []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load expenses' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadExpenses(); }, [loadExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    const query = search.toLowerCase();
    const matches = expense.description.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query) || expense.id.toLowerCase().includes(query);
    return matches && (statusFilter === 'all' || expense.status === statusFilter);
  });
  const publishedTotal = expenses.filter((item) => item.status === 'published').reduce((total, item) => total + item.amount, 0);
  const draftTotal = expenses.filter((item) => item.status === 'draft').reduce((total, item) => total + item.amount, 0);

  const beginCreate = () => {
    setEditingId('new');
    setFormData(emptyDraft);
    setMessage(null);
  };
  const beginEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: String(expense.amount),
      currency: expense.currency,
      status: expense.status,
      evidenceUrl: expense.evidenceUrl,
    });
    setMessage(null);
  };
  const cancelEdit = () => { setEditingId(null); setFormData(emptyDraft); };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(formData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Enter an amount greater than zero.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const isNew = editingId === 'new';
      const body = { ...formData, amount };
      const response = await fetch('/api/admin/expenses', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? body : { id: editingId, ...body }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save expense');
      setEditingId(null);
      setFormData(emptyDraft);
      setMessage({ type: 'success', text: isNew ? 'Expense created.' : 'Expense saved.' });
      await loadExpenses();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save expense' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return;
    setDeletingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/expenses?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to delete expense');
      setMessage({ type: 'success', text: 'Expense deleted.' });
      await loadExpenses();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete expense' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Expenses</h1>
          <p className="mt-1 text-stone-600">Track campaign expenditures with evidence</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Published: {formatCurrency(publishedTotal)}</Badge>
          <Badge variant="warning">Draft: {formatCurrency(draftTotal)}</Badge>
          <Button onClick={beginCreate}>Add expense</Button>
        </div>
      </header>

      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}

      <Card variant="default" padding="md">
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Input placeholder="Search by description or category..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-lg flex-1" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 sm:w-48">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </CardContent>
      </Card>

      {editingId && (
        <Card variant="default" padding="lg">
          <CardHeader><CardTitle>{editingId === 'new' ? 'Create expense' : 'Edit expense'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-charcoal-700">Category
                  <select value={formData.category} onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5">
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <Input label="Currency (3-letter code)" value={formData.currency} onChange={(event) => setFormData((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} maxLength={3} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Amount" type="number" value={formData.amount} onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))} min="0.01" step="0.01" required />
                <label className="block text-sm font-medium text-charcoal-700">Status
                  <select value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as ExpenseDraft['status'] }))} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>
              <Textarea label="Description" value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} rows={3} required />
              <Input label="Evidence URL (optional)" type="url" value={formData.evidenceUrl} onChange={(event) => setFormData((current) => ({ ...current, evidenceUrl: event.target.value }))} placeholder="https://..." />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingId === 'new' ? 'Create expense' : 'Save changes'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card variant="default" padding="md">
        <CardContent>
          {isLoading ? <p className="py-10 text-center text-stone-500">Loading expenses from the database...</p> :
           filteredExpenses.length === 0 ? <p className="py-10 text-center text-stone-500">No expenses found.</p> :
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead><tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                 <th className="px-3 py-3">Category</th><th className="px-3 py-3">Description</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Evidence</th><th className="px-3 py-3">Created</th><th className="px-3 py-3">Actions</th>
               </tr></thead>
               <tbody className="divide-y divide-stone-100">
                 {filteredExpenses.map((expense) => <tr key={expense.id}>
                   <td className="px-3 py-4 text-sm text-charcoal-700">{expense.category}</td>
                   <td className="px-3 py-4 text-sm text-charcoal-900">{expense.description}</td>
                   <td className="px-3 py-4 text-right text-sm font-mono">{formatCurrency(expense.amount)} {expense.currency}</td>
                   <td className="px-3 py-4"><Badge variant={expense.status === 'published' ? 'success' : 'warning'}>{expense.status}</Badge></td>
                   <td className="px-3 py-4 text-sm">{expense.evidenceUrl ? <a href={expense.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-earth-700 underline">View</a> : '—'}</td>
                   <td className="px-3 py-4 text-xs text-stone-500">{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : '—'}</td>
                   <td className="px-3 py-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => beginEdit(expense)}>Edit</Button><Button size="sm" variant="ghost" disabled={deletingId === expense.id} onClick={() => void handleDelete(expense.id)}>{deletingId === expense.id ? 'Deleting...' : 'Delete'}</Button></div></td>
                 </tr>)}
               </tbody>
             </table>
           </div>}
        </CardContent>
      </Card>
    </div>
  );
}
