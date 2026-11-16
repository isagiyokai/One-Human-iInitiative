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
  evidenceUrl?: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

const categories = [
  'Hosting & Infrastructure',
  'Domain & SSL',
  'Payment Processing',
  'Legal & Compliance',
  'Design & Development',
  'Marketing & Outreach',
  'Transaction Fees',
  'Other',
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'Hosting & Infrastructure',
    description: 'Vercel Pro plan - 3 months',
    amount: 60,
    currency: 'USD',
    status: 'published',
    evidenceUrl: 'https://example.com/receipts/vercel-pro-q1.pdf',
    createdAt: '2024-01-10T10:00:00Z',
    publishedAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    category: 'Domain & SSL',
    description: 'onehumaninitiative.org domain registration (1 year)',
    amount: 12.50,
    currency: 'USD',
    status: 'published',
    evidenceUrl: 'https://example.com/receipts/domain.pdf',
    createdAt: '2024-01-11T14:30:00Z',
    publishedAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '3',
    category: 'Payment Processing',
    description: 'Ko-fi platform setup fee',
    amount: 50,
    currency: 'USD',
    status: 'draft',
    evidenceUrl: undefined,
    createdAt: '2024-01-18T11:00:00Z',
    publishedAt: undefined,
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '4',
    category: 'Legal & Compliance',
    description: 'Privacy policy legal review',
    amount: 500,
    currency: 'USD',
    status: 'published',
    evidenceUrl: 'https://example.com/receipts/legal-review.pdf',
    createdAt: '2024-01-12T16:00:00Z',
    publishedAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '5',
    category: 'Transaction Fees',
    description: 'Bitcoin network fees for 5 transactions',
    amount: 2.34,
    currency: 'USD',
    status: 'published',
    evidenceUrl: 'https://example.com/receipts/btc-fees.pdf',
    createdAt: '2024-01-20T08:00:00Z',
    publishedAt: '2024-01-21T12:00:00Z',
    updatedAt: '2024-01-21T12:00:00Z',
  },
];

const statusConfig = {
  draft: { label: 'Draft', variant: 'warning' as const },
  published: { label: 'Published', variant: 'success' as const },
};

export function AdminExpenses() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'published'>('all');
  const [expenses] = React.useState<Expense[]>(mockExpenses);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Partial<Expense>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedTotal = expenses
    .filter(e => e.status === 'published')
    .reduce((sum, e) => sum + e.amount, 0);

  const draftTotal = expenses
    .filter(e => e.status === 'draft')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      status: expense.status,
      evidenceUrl: expense.evidenceUrl || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Expense updated successfully!' });
      setEditingId(null);
      setFormData({});
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense? This action cannot be undone.')) {
      // In real implementation, call API to delete
      console.log('Deleted:', id);
      alert('Expense deleted! (Demo - would call API in production)');
    }
  };

  const handleCreate = () => {
    const newExpense: Partial<Expense> = {
      category: 'Other',
      description: '',
      amount: 0,
      currency: 'USD',
      status: 'draft',
      evidenceUrl: '',
    };
    setFormData(newExpense);
    setEditingId('new');
  };

  const isNew = editingId === 'new';

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Expenses</h1>
          <p className="mt-1 text-stone-600">Track campaign expenditures with evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">Published: {formatCurrency(publishedTotal)}</Badge>
          <Badge variant="warning">Draft: {formatCurrency(draftTotal)}</Badge>
          <Button onClick={handleCreate}>Add Expense</Button>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by description, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
            className="w-full sm:w-48 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editingId && (
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>{isNew ? 'Create New Expense' : 'Edit Expense'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Input
                  label="Currency"
                  name="currency"
                  value={formData.currency || 'USD'}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                />
                <select
                  name="status"
                  value={formData.status || 'draft'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <Textarea
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                required
              />
              <Input
                label="Evidence URL (optional)"
                type="url"
                name="evidenceUrl"
                value={formData.evidenceUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/receipt.pdf"
              />
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Amount</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Evidence</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Created</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono text-charcoal-900">{expense.id}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-charcoal-700">{expense.category}</span>
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <span className="text-sm text-charcoal-900 truncate block">{expense.description}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-mono text-charcoal-900">
                      {formatCurrency(expense.amount)} {expense.currency}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={statusConfig[expense.status].variant} size="sm">
                        {statusConfig[expense.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {expense.evidenceUrl ? (
                        <a
                          href={expense.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-earth-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-sm text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-stone-600">
                      {new Date(expense.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-600">No expenses match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}