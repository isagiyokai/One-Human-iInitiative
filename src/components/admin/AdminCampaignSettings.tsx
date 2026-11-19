'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

type CampaignStatus = 'draft' | 'active' | 'paused' | 'target_reached' | 'expired' | 'completed';
interface StoryBlock { id: string; title: string; content: string; type: string; }
interface CampaignForm {
  name: string;
  description: string;
  target: string;
  maxTarget: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  publicContent: string;
  heroTitle: string;
  heroTagline: string;
  storyTitle: string;
  storyContent: string;
  privacyTitle: string;
  privacyContent: string;
  processTitle: string;
  processContent: string;
  customBlocks: StoryBlock[];
}

const emptyForm: CampaignForm = {
  name: '', description: '', target: '', maxTarget: '', startDate: '', endDate: '', status: 'draft',
  publicContent: '', heroTitle: '', heroTagline: '', storyTitle: '', storyContent: '',
  privacyTitle: '', privacyContent: '', processTitle: '', processContent: '', customBlocks: [],
};
const statusOptions: { value: CampaignStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' }, { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' }, { value: 'target_reached', label: 'Target reached' },
  { value: 'expired', label: 'Expired' }, { value: 'completed', label: 'Completed' },
];

function toUtcInput(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

function fromCampaign(row: Record<string, unknown>): CampaignForm {
  const rawBlocks = Array.isArray(row.custom_blocks) ? row.custom_blocks : [];
  return {
    name: String(row.name || ''),
    description: String(row.description || ''),
    target: String(row.target ?? ''),
    maxTarget: String(row.max_target ?? ''),
    startDate: toUtcInput(row.start_date),
    endDate: toUtcInput(row.end_date),
    status: (statusOptions.some((item) => item.value === row.status) ? row.status : 'draft') as CampaignStatus,
    publicContent: String(row.public_content || ''),
    heroTitle: String(row.hero_title || ''),
    heroTagline: String(row.hero_tagline || ''),
    storyTitle: String(row.story_title || ''),
    storyContent: String(row.story_content || ''),
    privacyTitle: String(row.privacy_title || ''),
    privacyContent: String(row.privacy_content || ''),
    processTitle: String(row.process_title || ''),
    processContent: String(row.process_content || ''),
    customBlocks: rawBlocks.map((block, index) => {
      const item = block as Record<string, unknown>;
      return { id: String(item.id || index), title: String(item.title || ''), content: String(item.content || ''), type: String(item.type || 'text') };
    }),
  };
}

function utcIso(value: string): string {
  return value ? `${value}:00.000Z` : '';
}

export function AdminCampaignSettings() {
  const [formData, setFormData] = React.useState<CampaignForm>(emptyForm);
  const [activeTab, setActiveTab] = React.useState('basic');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadCampaign = React.useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/campaign', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load campaign settings');
      if (!payload.campaign) throw new Error('No campaign record exists yet. Create the initial campaign in the database before editing settings.');
      setFormData(fromCampaign(payload.campaign));
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load campaign settings' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadCampaign(); }, [loadCampaign]);

  const updateField = (name: keyof CampaignForm, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const updateBlock = (index: number, field: 'title' | 'content', value: string) => {
    setFormData((current) => ({
      ...current,
      customBlocks: current.customBlocks.map((block, i) => i === index ? { ...block, [field]: value } : block),
    }));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setFormData((current) => {
      const next = [...current.customBlocks];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...current, customBlocks: next };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      if (!formData.startDate || !formData.endDate) throw new Error('Set both campaign dates before saving.');
      const body = {
        ...formData,
        target: Number(formData.target),
        maxTarget: Number(formData.maxTarget),
        startDate: utcIso(formData.startDate),
        endDate: utcIso(formData.endDate),
      };
      const response = await fetch('/api/admin/campaign', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save campaign settings');
      setMessage({ type: 'success', text: 'Campaign settings saved to the database.' });
      await loadCampaign();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save campaign settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-5xl space-y-4"><h1 className="text-3xl font-bold text-charcoal-900">Campaign Settings</h1><Card padding="lg"><CardContent><p className="py-8 text-center text-stone-500">Loading campaign from the database...</p></CardContent></Card></div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold text-charcoal-900">Campaign Settings</h1><p className="mt-1 text-stone-600">Edit the campaign record and the content displayed on the public site.</p></div>
        <Badge variant={formData.status === 'active' ? 'success' : 'warning'}>{formData.status}</Badge>
      </header>
      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
          <TabsTrigger value="basic">Basic info</TabsTrigger><TabsTrigger value="dates">Dates & status</TabsTrigger><TabsTrigger value="content">Public content</TabsTrigger><TabsTrigger value="storyboard">Storyboard</TabsTrigger>
        </TabsList>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TabsContent value="basic">
            <Card padding="lg"><CardHeader><CardTitle>Campaign details</CardTitle><CardDescription>These values are stored in the campaign record.</CardDescription></CardHeader><CardContent className="space-y-4">
              <Input label="Campaign name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} required maxLength={100} />
              <Textarea label="Description" value={formData.description} onChange={(event) => updateField('description', event.target.value)} rows={4} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Target (USD)" type="number" min="1000" max="50000" value={formData.target} onChange={(event) => updateField('target', event.target.value)} required />
                <Input label="Maximum target (USD)" type="number" min="10000" max="50000" value={formData.maxTarget} onChange={(event) => updateField('maxTarget', event.target.value)} required />
              </div>
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="dates">
            <Card padding="lg"><CardHeader><CardTitle>Campaign dates and status</CardTitle><CardDescription>Dates are entered and stored in UTC.</CardDescription></CardHeader><CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Start date (UTC)" type="datetime-local" value={formData.startDate} onChange={(event) => updateField('startDate', event.target.value)} required />
                <Input label="End date (UTC)" type="datetime-local" value={formData.endDate} onChange={(event) => updateField('endDate', event.target.value)} required />
              </div>
              <label className="block text-sm font-medium text-charcoal-700">Status
                <select value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as CampaignStatus }))} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5">
                  {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              {formData.status === 'active' && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Activating a campaign also makes its payment destinations public. Configure and verify real payment addresses on the Payment Settings page first.</p>}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="content">
            <div className="space-y-5">
              <Card padding="lg"><CardHeader><CardTitle>Homepage hero</CardTitle></CardHeader><CardContent className="space-y-4">
                <Input label="Hero title" value={formData.heroTitle} onChange={(event) => updateField('heroTitle', event.target.value)} required />
                <Input label="Hero tagline" value={formData.heroTagline} onChange={(event) => updateField('heroTagline', event.target.value)} required />
                <Textarea label="Additional public content (Markdown)" value={formData.publicContent} onChange={(event) => updateField('publicContent', event.target.value)} rows={5} />
              </CardContent></Card>
              <Card padding="lg"><CardHeader><CardTitle>Story, privacy, and process tabs</CardTitle><CardDescription>These content fields are served to the public campaign page.</CardDescription></CardHeader><CardContent className="space-y-5">
                <div className="space-y-3"><Input label="Story title" value={formData.storyTitle} onChange={(event) => updateField('storyTitle', event.target.value)} /><Textarea label="Story content" value={formData.storyContent} onChange={(event) => updateField('storyContent', event.target.value)} rows={4} /></div>
                <div className="space-y-3 border-t border-stone-100 pt-4"><Input label="Privacy title" value={formData.privacyTitle} onChange={(event) => updateField('privacyTitle', event.target.value)} /><Textarea label="Privacy content" value={formData.privacyContent} onChange={(event) => updateField('privacyContent', event.target.value)} rows={4} /></div>
                <div className="space-y-3 border-t border-stone-100 pt-4"><Input label="Process title" value={formData.processTitle} onChange={(event) => updateField('processTitle', event.target.value)} /><Textarea label="Process content" value={formData.processContent} onChange={(event) => updateField('processContent', event.target.value)} rows={6} /></div>
              </CardContent></Card>
            </div>
          </TabsContent>
          <TabsContent value="storyboard">
            <Card padding="lg"><CardHeader><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Custom story blocks</CardTitle><CardDescription>Add and reorder content blocks saved with this campaign.</CardDescription></div><Button type="button" variant="outline" onClick={() => setFormData((current) => ({ ...current, customBlocks: [...current.customBlocks, { id: crypto.randomUUID(), title: '', content: '', type: 'text' }] }))}>Add block</Button></div></CardHeader><CardContent className="space-y-4">
              {formData.customBlocks.length === 0 ? <p className="py-5 text-center text-sm text-stone-500">No custom blocks. Add one to begin.</p> :
               formData.customBlocks.map((block, index) => <div key={block.id} className="space-y-3 rounded-xl border border-stone-200 p-4">
                 <Input label="Block title" value={block.title} onChange={(event) => updateBlock(index, 'title', event.target.value)} />
                 <Textarea label="Block content (Markdown)" value={block.content} onChange={(event) => updateBlock(index, 'content', event.target.value)} rows={4} />
                 <div className="flex flex-wrap justify-end gap-2">
                   <Button type="button" size="sm" variant="outline" disabled={index === 0} onClick={() => moveBlock(index, -1)}>Move up</Button>
                   <Button type="button" size="sm" variant="outline" disabled={index === formData.customBlocks.length - 1} onClick={() => moveBlock(index, 1)}>Move down</Button>
                   <Button type="button" size="sm" variant="ghost" onClick={() => setFormData((current) => ({ ...current, customBlocks: current.customBlocks.filter((_, i) => i !== index) }))}>Remove</Button>
                 </div>
               </div>)}
            </CardContent></Card>
          </TabsContent>
          <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={isSaving} onClick={() => void loadCampaign()}>Reload saved data</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save campaign settings'}</Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
