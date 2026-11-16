'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface Update {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Campaign Launched!',
    content: 'We are excited to announce the launch of the One Human Initiative. Thank you to everyone who has already contributed.',
    imageUrl: 'https://example.com/images/launch.jpg',
    status: 'published',
    publishedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-14T20:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'First Milestone Reached',
    content: 'We have reached $10,000 in confirmed contributions! This is an incredible start. The community petition for increasing the target is now open.',
    imageUrl: undefined,
    status: 'published',
    publishedAt: '2024-01-18T15:30:00Z',
    createdAt: '2024-01-18T15:00:00Z',
    updatedAt: '2024-01-18T15:30:00Z',
  },
  {
    id: '3',
    title: 'Transparency Report - Week 1',
    content: 'Our first weekly transparency report is now available. View all expenses and contributions on the transparency page.',
    imageUrl: 'https://example.com/images/transparency-week1.jpg',
    status: 'published',
    publishedAt: '2024-01-22T10:00:00Z',
    createdAt: '2024-01-21T18:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '4',
    title: 'Draft: Upcoming Community Event',
    content: 'Planning a virtual community meetup for supporters. Details to be announced soon.',
    imageUrl: undefined,
    status: 'draft',
    publishedAt: undefined,
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
  },
];

const statusConfig = {
  draft: { label: 'Draft', variant: 'warning' as const },
  published: { label: 'Published', variant: 'success' as const },
};

export function AdminUpdates() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'published'>('all');
  const [updates] = React.useState<Update[]>(mockUpdates);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Partial<Update>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredUpdates = updates.filter(u => {
    const matchesSearch = u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.content.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = updates.filter(u => u.status === 'published').length;
  const draftCount = updates.filter(u => u.status === 'draft').length;

  const handleEdit = (update: Update) => {
    setEditingId(update.id);
    setFormData({
      title: update.title,
      content: update.content,
      imageUrl: update.imageUrl || '',
      status: update.status,
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
      setMessage({ type: 'success', text: 'Update saved successfully!' });
      setEditingId(null);
      setFormData({});
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this update? This action cannot be undone.')) {
      console.log('Deleted:', id);
      alert('Update deleted! (Demo - would call API in production)');
    }
  };

  const handleCreate = () => {
    const newUpdate: Partial<Update> = {
      title: '',
      content: '',
      imageUrl: '',
      status: 'draft',
    };
    setFormData(newUpdate);
    setEditingId('new');
  };

  const isNew = editingId === 'new';

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Updates</h1>
          <p className="mt-1 text-stone-600">Manage campaign updates and announcements</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">{publishedCount} Published</Badge>
          <Badge variant="warning">{draftCount} Drafts</Badge>
          <Button onClick={handleCreate}>Create Update</Button>
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
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
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
            <CardTitle>{isNew ? 'Create New Update' : 'Edit Update'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                placeholder="Update title"
              />
              <Textarea
                label="Content (Markdown supported)"
                name="content"
                value={formData.content || ''}
                onChange={handleChange}
                rows={8}
                required
                placeholder="Write your update here..."
              />
              <Input
                label="Image URL (optional)"
                type="url"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
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

      {/* Updates List */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-charcoal-900 truncate">{update.title}</h3>
                      <Badge variant={statusConfig[update.status].variant} size="md">
                        {statusConfig[update.status].label}
                      </Badge>
                    </div>
                    <p className="text-stone-600 line-clamp-2">{update.content}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                      <span>Created: {new Date(update.createdAt).toLocaleString()}</span>
                      {update.publishedAt && <span>Published: {new Date(update.publishedAt).toLocaleString()}</span>}
                      {update.imageUrl && <span>📷 Has image</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(update)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(update.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUpdates.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-600">No updates match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}