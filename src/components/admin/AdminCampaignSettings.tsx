'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'target_reached', label: 'Target Reached' },
  { value: 'expired', label: 'Expired' },
  { value: 'completed', label: 'Completed' },
];

export function AdminCampaignSettings() {
  const [formData, setFormData] = React.useState({
    name: 'One Human Initiative',
    description: 'A privacy-conscious campaign to provide direct financial support to an anonymous individual.',
    target: '10000',
    maxTarget: '50000',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-14T23:59:59Z',
    status: 'active',
    publicContent: '',
    heroTitle: 'ONE HUMAN. ONE OPPORTUNITY.',
    heroTagline: 'A privacy-conscious campaign to provide direct financial support to an anonymous individual. No tracking. No accounts. No compromise.',
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // In real implementation, this would call the admin campaign API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Campaign settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Campaign Settings</h1>
          <p className="mt-1 text-stone-600">Configure campaign details, targets, and public content</p>
        </div>
        <Badge variant="info">Live Preview</Badge>
      </header>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core campaign details shown publicly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Campaign Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Target Amount (USD)"
                type="number"
                name="target"
                value={formData.target}
                onChange={handleChange}
                required
                min="1000"
                max="50000"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Maximum Target (USD)"
                type="number"
                name="maxTarget"
                value={formData.maxTarget}
                onChange={handleChange}
                required
                min="10000"
                max="50000"
              />
              <Input
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                // Using select instead
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Textarea
              label="Public Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              hint="Shown on homepage and transparency page"
            />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Campaign Dates</CardTitle>
            <CardDescription>Start and end dates (UTC)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start Date (UTC)"
              type="datetime-local"
              name="startDate"
              value={formData.startDate.slice(0, 16)}
              onChange={handleChange}
            />
            <Input
              label="End Date (UTC)"
              type="datetime-local"
              name="endDate"
              value={formData.endDate.slice(0, 16)}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* Public Content */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Public Content</CardTitle>
            <CardDescription>Content displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Hero Title"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
            />
            <Input
              label="Hero Tagline"
              name="heroTagline"
              value={formData.heroTagline}
              onChange={handleChange}
            />
            <Textarea
              label="Additional Public Content (Markdown)"
              name="publicContent"
              value={formData.publicContent}
              onChange={handleChange}
              rows={6}
              hint="Supports Markdown. Displayed below campaign progress on homepage."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Preview Changes
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}