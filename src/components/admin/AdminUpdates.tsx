'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateDraft {
  title: string;
  content: string;
  imageUrl: string;
  status: 'draft' | 'published';
}

const emptyDraft: UpdateDraft = { title: '', content: '', imageUrl: '', status: 'draft' };

function fromRow(row: Record<string, unknown>): CampaignUpdate {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    content: String(row.content || ''),
    imageUrl: String(row.image_url || ''),
    status: row.status === 'published' ? 'published' : 'draft',
    publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

export function AdminUpdates() {
  const [updates, setUpdates] = React.useState<CampaignUpdate[]>([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'published'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<UpdateDraft>(emptyDraft);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUpdates = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/updates', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load campaign updates');
      setUpdates(Array.isArray(payload.updates) ? payload.updates.map(fromRow) : []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load campaign updates' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadUpdates(); }, [loadUpdates]);

  const filteredUpdates = updates.filter((update) => {
    const query = search.toLowerCase();
    const matches = update.title.toLowerCase().includes(query) ||
      update.content.toLowerCase().includes(query) || update.id.toLowerCase().includes(query);
    return matches && (statusFilter === 'all' || update.status === statusFilter);
  });

  const beginCreate = () => {
    setEditingId('new');
    setFormData(emptyDraft);
    setMessage(null);
  };

  const beginEdit = (update: CampaignUpdate) => {
    setEditingId(update.id);
    setFormData({
      title: update.title,
      content: update.content,
      imageUrl: update.imageUrl,
      status: update.status,
    });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyDraft);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const isNew = editingId === 'new';
      const response = await fetch('/api/admin/updates', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? formData : { id: editingId, ...formData }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save update');
      setEditingId(null);
      setFormData(emptyDraft);
      setMessage({ type: 'success', text: isNew ? 'Update created.' : 'Update saved.' });
      await loadUpdates();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save update' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this update? This cannot be undone.')) return;
    setDeletingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/updates?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to delete update');
      setMessage({ type: 'success', text: 'Update deleted.' });
      await loadUpdates();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete update' });
    } finally {
      setDeletingId(null);
    }
  };

  const publishedCount = updates.filter((update) => update.status === 'published').length;
  const draftCount = updates.filter((update) => update.status === 'draft').length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Updates</h1>
          <p className="mt-1 text-stone-600">Manage campaign updates and announcements</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">{publishedCount} Published</Badge>
          <Badge variant="warning">{draftCount} Drafts</Badge>
          <Button onClick={beginCreate}>Create Update</Button>
        </div>
      </header>

      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}

      <Card variant="default" padding="md">
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Input placeholder="Search by title or content..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-lg flex-1" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 sm:w-48">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </CardContent>
      </Card>

      {editingId && (
        <Card variant="default" padding="lg">
          <CardHeader><CardTitle>{editingId === 'new' ? 'Create update' : 'Edit update'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" name="title" value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} required maxLength={200} />
              <Textarea label="Content (Markdown supported)" name="content" value={formData.content} onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))} rows={8} required />
              <Input label="Image URL (optional)" type="url" name="imageUrl" value={formData.imageUrl} onChange={(event) => setFormData((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="https://..." />
              <label className="block text-sm font-medium text-charcoal-700">
                Publication status
                <select value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as UpdateDraft['status'] }))} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingId === 'new' ? 'Create update' : 'Save changes'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card variant="default" padding="md">
        <CardContent>
          {isLoading ? <p className="py-10 text-center text-stone-500">Loading updates from the database...</p> :
           filteredUpdates.length === 0 ? <p className="py-10 text-center text-stone-500">No updates found.</p> :
           <div className="space-y-3">
             {filteredUpdates.map((update) => (
               <article key={update.id} className="rounded-xl border border-stone-200 p-4">
                 <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                   <div className="min-w-0 flex-1">
                     <div className="mb-2 flex flex-wrap items-center gap-3">
                       <h2 className="font-semibold text-charcoal-900">{update.title}</h2>
                       <Badge variant={update.status === 'published' ? 'success' : 'warning'}>{update.status}</Badge>
                     </div>
                     <p className="whitespace-pre-wrap text-sm text-stone-600">{update.content}</p>
                     <p className="mt-3 text-xs text-stone-500">Created {update.createdAt ? new Date(update.createdAt).toLocaleString() : '—'}{update.publishedAt ? ` · Published ${new Date(update.publishedAt).toLocaleString()}` : ''}</p>
                   </div>
                   <div className="flex shrink-0 gap-2">
                     <Button size="sm" variant="outline" onClick={() => beginEdit(update)}>Edit</Button>
                     <Button size="sm" variant="ghost" disabled={deletingId === update.id} onClick={() => void handleDelete(update.id)}>{deletingId === update.id ? 'Deleting...' : 'Delete'}</Button>
                   </div>
                 </div>
               </article>
             ))}
           </div>}
        </CardContent>
      </Card>
    </div>
  );
}
