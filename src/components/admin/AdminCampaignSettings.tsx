'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

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
    heroTagline: 'A privacy-conscious campaign to provide direct financial support to an anonymous individual. Your generosity stays private. No tracking, no accounts, no public lists.',
    // Story/Content fields
    storyTitle: 'The Person Behind the Campaign',
    storyContent: 'Behind this campaign is one person — a human being with dreams, struggles, and a story that matters. They\'ve chosen to remain anonymous to protect their privacy and dignity. This isn\'t about publicity or recognition; it\'s about one human helping another.',
    privacyTitle: 'Why Anonymity Matters',
    privacyContent: 'Anonymity protects the recipient from unwanted attention, harassment, and the complications that come with public fundraising. It also protects contributors — your generosity stays between you and the cause. No names, no tracking, no data harvesting. Just human kindness.',
    processTitle: 'How It Works',
    processContent: '1. Choose a contribution method (Bitcoin, Solana, Phantom Username, or Ko-fi)\n2. Send your contribution directly to the provided address\n3. Submit the transaction hash for verification\n4. Admin manually verifies on-chain\n5. Once confirmed, your contribution counts toward the target\n6. 100% of confirmed funds go to the recipient',
    // Custom story blocks (storyboard)
    customBlocks: [
      { id: '1', title: '', content: '', type: 'text' },
    ],
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('basic');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlockChange = (index: number, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      customBlocks: prev.customBlocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const addBlock = () => {
    setFormData(prev => ({
      ...prev,
      customBlocks: [...prev.customBlocks, { id: Date.now().toString(), title: '', content: '', type: 'text' }],
    }));
  };

  const removeBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customBlocks: prev.customBlocks.filter((_, i) => i !== index),
    }));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const blocks = [...prev.customBlocks];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { ...prev, customBlocks: blocks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // In real implementation, this would call the admin campaign API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Campaign settings saved successfully!' });
    } catch {
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-stone-100 rounded-xl p-1 mb-6" aria-label="Settings sections">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Basic Info</TabsTrigger>
          <TabsTrigger value="dates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Dates</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Public Content</TabsTrigger>
          <TabsTrigger value="storyboard" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Storyboard</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="basic" className="animate-fade-in">
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
          </TabsContent>

          <TabsContent value="dates" className="animate-fade-in">
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
          </TabsContent>

          <TabsContent value="content" className="animate-fade-in">
            {/* Public Content */}
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>Homepage Hero</CardTitle>
                <CardDescription>Content displayed in the hero section</CardDescription>
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
              </CardContent>
            </Card>

            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>Campaign Explanation Tabs</CardTitle>
                <CardDescription>Content for the three tabs: Story, Privacy, How It Works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-charcoal-700">The Story Tab</label>
                  <Input
                    label="Tab Title"
                    name="storyTitle"
                    value={formData.storyTitle}
                    onChange={handleChange}
                    placeholder="The Person Behind the Campaign"
                  />
                  <Textarea
                    label="Tab Content"
                    name="storyContent"
                    value={formData.storyContent}
                    onChange={handleChange}
                    rows={4}
                    hint="Markdown supported"
                  />
                </div>
                <div className="border-t border-stone-200 pt-4 space-y-4">
                  <label className="block text-sm font-medium text-charcoal-700">Privacy Tab</label>
                  <Input
                    label="Tab Title"
                    name="privacyTitle"
                    value={formData.privacyTitle}
                    onChange={handleChange}
                    placeholder="Why Anonymity Matters"
                  />
                  <Textarea
                    label="Tab Content"
                    name="privacyContent"
                    value={formData.privacyContent}
                    onChange={handleChange}
                    rows={4}
                    hint="Markdown supported"
                  />
                </div>
                <div className="border-t border-stone-200 pt-4 space-y-4">
                  <label className="block text-sm font-medium text-charcoal-700">How It Works Tab</label>
                  <Input
                    label="Tab Title"
                    name="processTitle"
                    value={formData.processTitle}
                    onChange={handleChange}
                    placeholder="How It Works"
                  />
                  <Textarea
                    label="Tab Content (one step per line)"
                    name="processContent"
                    value={formData.processContent}
                    onChange={handleChange}
                    rows={6}
                    hint="Each line becomes a numbered step. Markdown supported."
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>Additional Public Content</CardTitle>
                <CardDescription>Displayed below campaign progress on homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  label="Additional Content (Markdown)"
                  name="publicContent"
                  value={formData.publicContent}
                  onChange={handleChange}
                  rows={6}
                  hint="Supports Markdown. Displayed below campaign progress on homepage."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storyboard" className="animate-fade-in">
            {/* Storyboard - Custom Story Blocks */}
            <Card variant="default" padding="lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Storyboard</CardTitle>
                    <CardDescription>Build custom story sections for the homepage. Drag to reorder, add any content you want.</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addBlock}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.customBlocks.length === 0 ? (
                  <div className="text-center py-8 text-stone-500">
                    <p>No story blocks yet. Click &quot;Add Block&quot; to create your first story section.</p>
                  </div>
                ) : (
                  formData.customBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="border border-stone-200 rounded-xl p-4 bg-white space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <Input
                            label="Block Title"
                            value={block.title}
                            onChange={(e) => handleBlockChange(index, 'title', e.target.value)}
                            placeholder="Section title (optional)"
                          />
                          <Textarea
                            label="Content (Markdown)"
                            value={block.content}
                            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
                            rows={4}
                            placeholder="Write your story, update, announcement, or any content here..."
                          />
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveBlock(index, index - 1)}
                                aria-label="Move up"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </Button>
                            )}
                            {index < formData.customBlocks.length - 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveBlock(index, index + 1)}
                                aria-label="Move down"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l7-7m-7 7v-18" />
                                </svg>
                              </Button>
                            )}
                          </div>
                          {formData.customBlocks.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlock(index)}
                              aria-label="Remove block"
                              className="text-red-600 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline">
              Preview Changes
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}