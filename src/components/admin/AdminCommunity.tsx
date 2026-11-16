'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface Petition {
  id: string;
  requestedTarget: number;
  reason: string;
  status: 'collecting' | 'voting' | 'approved' | 'rejected' | 'cancelled';
  tokenCount: number;
  requiredTokens: number;
  createdAt: string;
  votingStartsAt?: string;
  votingEndsAt?: string;
  decidedAt?: string;
  adminNotes?: string;
}

interface Vote {
  id: string;
  petitionId: string;
  choice: 'yes' | 'no';
  tokenHash: string;
  createdAt: string;
}

const mockPetitions: Petition[] = [
  {
    id: '1',
    requestedTarget: 25000,
    reason: 'The initial target was reached quickly. Many supporters want to continue helping.',
    status: 'approved',
    tokenCount: 12,
    requiredTokens: 5,
    createdAt: '2024-01-18T10:00:00Z',
    votingStartsAt: '2024-01-19T10:00:00Z',
    votingEndsAt: '2024-01-26T10:00:00Z',
    decidedAt: '2024-01-27T09:00:00Z',
    adminNotes: 'Approved - target increased to $25,000',
  },
  {
    id: '2',
    requestedTarget: 35000,
    reason: 'Additional funds needed for unexpected expenses.',
    status: 'voting',
    tokenCount: 8,
    requiredTokens: 5,
    createdAt: '2024-01-25T14:00:00Z',
    votingStartsAt: '2024-01-26T14:00:00Z',
    votingEndsAt: '2024-02-02T14:00:00Z',
    decidedAt: undefined,
    adminNotes: undefined,
  },
  {
    id: '3',
    requestedTarget: 45000,
    reason: 'Community members want to maximize impact before campaign ends.',
    status: 'collecting',
    tokenCount: 3,
    requiredTokens: 5,
    createdAt: '2024-01-28T09:00:00Z',
    votingStartsAt: undefined,
    votingEndsAt: undefined,
    decidedAt: undefined,
    adminNotes: undefined,
  },
];

const mockVotes: Vote[] = [
  { id: '1', petitionId: '1', choice: 'yes', tokenHash: 'abc123...', createdAt: '2024-01-20T10:00:00Z' },
  { id: '2', petitionId: '1', choice: 'yes', tokenHash: 'def456...', createdAt: '2024-01-21T11:00:00Z' },
  { id: '3', petitionId: '1', choice: 'no', tokenHash: 'ghi789...', createdAt: '2024-01-22T12:00:00Z' },
  { id: '4', petitionId: '2', choice: 'yes', tokenHash: 'jkl012...', createdAt: '2024-01-27T10:00:00Z' },
  { id: '5', petitionId: '2', choice: 'yes', tokenHash: 'mno345...', createdAt: '2024-01-28T11:00:00Z' },
];

const statusConfig = {
  collecting: { label: 'Collecting Signatures', variant: 'info' as const },
  voting: { label: 'Voting Active', variant: 'warning' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  rejected: { label: 'Rejected', variant: 'error' as const },
  cancelled: { label: 'Cancelled', variant: 'default' as const },
};

export function AdminCommunity() {
  const [activeTab, setActiveTab] = React.useState<string>('petitions');
  const [petitions] = React.useState<Petition[]>(mockPetitions);
  const [votes] = React.useState<Vote[]>(mockVotes);
  const [editingPetition, setEditingPetition] = React.useState<Petition | null>(null);
  const [formData, setFormData] = React.useState<Partial<Petition>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEditPetition = (petition: Petition) => {
    setEditingPetition(petition);
    setFormData({
      requestedTarget: petition.requestedTarget,
      reason: petition.reason,
      adminNotes: petition.adminNotes || '',
    });
  };

  const handleCancel = () => {
    setEditingPetition(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = (petitionId: string) => {
    if (confirm('Approve this petition? This will increase the campaign target.')) {
      console.log('Approved:', petitionId);
      alert('Petition approved! (Demo - would call API in production)');
    }
  };

  const handleReject = (petitionId: string) => {
    const notes = prompt('Enter rejection reason:');
    if (notes !== null) {
      console.log('Rejected:', petitionId, notes);
      alert('Petition rejected! (Demo - would call API in production)');
    }
  };

  const handleSaveNotes = async () => {
    if (!editingPetition) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Admin notes saved successfully!' });
      setEditingPetition(null);
      setFormData({});
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getVotesForPetition = (petitionId: string) => votes.filter(v => v.petitionId === petitionId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-charcoal-900">Community</h1>
        <p className="mt-1 text-stone-600">Manage petitions and view voting results</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`} role="alert">
          {message.text}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="petitions">Petitions ({petitions.length})</TabsTrigger>
          <TabsTrigger value="votes">Votes</TabsTrigger>
        </TabsList>

        {/* Petitions Tab */}
        <TabsContent value="petitions" className="space-y-4">
          {petitions.map((petition) => (
            <Card key={petition.id} variant="default" padding="lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">Petition #{petition.id}</CardTitle>
                      <Badge variant={statusConfig[petition.status].variant} size="md">
                        {statusConfig[petition.status].label}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      Requested target: <strong>${petition.requestedTarget.toLocaleString()}</strong> USD
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {petition.status === 'collecting' && (
                      <>
                        <span className="text-sm text-stone-600">
                          {petition.tokenCount}/{petition.requiredTokens} tokens
                        </span>
                      </>
                    )}
                    {petition.status === 'voting' && (
                      <>
                        <span className="text-sm text-stone-600">
                          Ends: {new Date(petition.votingEndsAt!).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-charcoal-700 mb-1">Reason</p>
                  <p className="text-stone-600">{petition.reason}</p>
                </div>

                {editingPetition?.id === petition.id ? (
                  <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-1">Admin Notes</label>
                      <Textarea
                        name="adminNotes"
                        value={formData.adminNotes || ''}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Internal notes on decision..."
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSaveNotes} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Notes'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {petition.adminNotes && (
                      <div className="p-3 bg-stone-50 rounded-lg">
                        <p className="text-sm font-medium text-charcoal-700 mb-1">Admin Notes</p>
                        <p className="text-stone-600">{petition.adminNotes}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {petition.status === 'collecting' && petition.tokenCount >= petition.requiredTokens && (
                        <span className="text-sm text-emerald-600 font-medium">✓ Threshold met - ready for voting</span>
                      )}
                      {petition.status === 'voting' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPetition(petition)}>
                            Add Notes
                          </Button>
                        </>
                      )}
                      {['approved', 'rejected'].includes(petition.status) && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPetition(petition)}>
                            Edit Notes
                          </Button>
                        </>
                      )}
                      {petition.status === 'collecting' && petition.tokenCount < petition.requiredTokens && (
                        <span className="text-sm text-stone-500">Waiting for {petition.requiredTokens - petition.tokenCount} more tokens</span>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2 text-sm text-stone-500">
                  <span>Created: {new Date(petition.createdAt).toLocaleString()}</span>
                  {petition.votingStartsAt && <span>Voting starts: {new Date(petition.votingStartsAt).toLocaleString()}</span>}
                  {petition.votingEndsAt && <span>Voting ends: {new Date(petition.votingEndsAt).toLocaleString()}</span>}
                  {petition.decidedAt && <span>Decided: {new Date(petition.decidedAt).toLocaleString()}</span>}
                </div>
              </CardContent>
            </Card>
          ))}

          {petitions.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent className="text-center py-8">
                <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-stone-600">No petitions yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Votes Tab */}
        <TabsContent value="votes" className="space-y-4">
          {petitions.map((petition) => {
            const petitionVotes = getVotesForPetition(petition.id);
            const yesVotes = petitionVotes.filter(v => v.choice === 'yes').length;
            const noVotes = petitionVotes.filter(v => v.choice === 'no').length;

            return (
              <Card key={petition.id} variant="default" padding="lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Petition #{petition.id} - Votes</CardTitle>
                      <CardDescription>
                        Target: ${petition.requestedTarget.toLocaleString()} | Status: {statusConfig[petition.status].label}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="success">{yesVotes} Yes</Badge>
                      <Badge variant="error">{noVotes} No</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {petitionVotes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full" role="table">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Vote ID</th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Choice</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Token Hash</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {petitionVotes.map((vote) => (
                            <tr key={vote.id} className="hover:bg-stone-50">
                              <td className="py-3 px-4 text-sm font-mono text-charcoal-900">{vote.id}</td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant={vote.choice === 'yes' ? 'success' : 'error'} size="sm">
                                  {vote.choice.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm font-mono text-charcoal-600">{vote.tokenHash}</td>
                              <td className="py-3 px-4 text-sm text-stone-600">{new Date(vote.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-stone-500 text-center py-4">No votes cast yet</p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {petitions.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent className="text-center py-8">
                <svg className="mx-auto w-12 h-12 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-stone-600">No petitions or votes yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}