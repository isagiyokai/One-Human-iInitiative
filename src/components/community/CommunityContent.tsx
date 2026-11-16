'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { formatCurrency } from '@/lib/utils';
import { useBrowserToken } from '@/hooks/useBrowserToken';

interface Petition {
  id: string;
  title: string;
  description: string;
  requestedTarget: number;
  currentTarget: number;
  status: 'draft' | 'active' | 'voting' | 'approved' | 'rejected' | 'implemented';
  yesVotes: number;
  noVotes: number;
  requiredTokens: number;
  createdAt: string;
  endsAt?: string;
  implementedAt?: string;
}

interface Vote {
  petitionId: string;
  choice: 'yes' | 'no';
  timestamp: string;
}

const mockPetition: Petition = {
  id: '1',
  title: 'Increase Campaign Target to $35,000',
  description:
    'Due to unexpected medical complications, the recipient needs additional support for ongoing treatment and rehabilitation. The current $10,000 target covers only emergency surgery. An increase to $35,000 would cover 6 months of follow-up care, physical therapy, and medication.',
  requestedTarget: 35000,
  currentTarget: 10000,
  status: 'voting',
  yesVotes: 7,
  noVotes: 2,
  requiredTokens: 5,
  createdAt: '2024-01-20T10:00:00Z',
  endsAt: '2024-02-20T10:00:00Z',
};

const mockVotes: Vote[] = [];

export function CommunityContent() {
  const { token, isLoading, generateToken, hasVoted } = useBrowserToken();
  const [showCreatePetition, setShowCreatePetition] = React.useState(false);
  const [petitionForm, setPetitionForm] = React.useState({
    title: '',
    description: '',
    requestedTarget: '',
  });
  const [userVote, setUserVote] = React.useState<'yes' | 'no' | null>(null);

  const petition = mockPetition;
  const totalVotes = petition.yesVotes + petition.noVotes;
  const yesPercentage = totalVotes > 0 ? (petition.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (petition.noVotes / totalVotes) * 100 : 0;

  const handleVote = (choice: 'yes' | 'no') => {
    if (!token) {
      generateToken();
      return;
    }

    if (hasVoted(petition.id)) {
      alert('You have already voted on this petition.');
      return;
    }

    setUserVote(choice);
    // In real implementation, this would call the votes API
    console.log(`Voted ${choice} on petition ${petition.id}`);
  };

  const handleCreatePetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      generateToken();
      return;
    }

    if (petitionForm.title.trim().length < 10) {
      alert('Title must be at least 10 characters');
      return;
    }

    if (petitionForm.description.trim().length < 50) {
      alert('Description must be at least 50 characters');
      return;
    }

    const target = parseInt(petitionForm.requestedTarget, 10);
    if (isNaN(target) || target <= petition.currentTarget || target > 50000) {
      alert('Target must be greater than current target and not exceed $50,000');
      return;
    }

    console.log('Creating petition:', petitionForm);
    setShowCreatePetition(false);
    setPetitionForm({ title: '', description: '', requestedTarget: '' });
  };

  const statusConfig = {
    draft: { label: 'Draft', variant: 'default' as const, color: 'text-stone-600' },
    active: { label: 'Active', variant: 'info' as const, color: 'text-blue-600' },
    voting: { label: 'Voting', variant: 'warning' as const, color: 'text-amber-600' },
    approved: { label: 'Approved', variant: 'success' as const, color: 'text-emerald-600' },
    rejected: { label: 'Rejected', variant: 'error' as const, color: 'text-red-600' },
    implemented: { label: 'Implemented', variant: 'default' as const, color: 'text-charcoal-600' },
  };

  const { label: statusLabel, variant: statusVariant, color: statusColor } = statusConfig[petition.status];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Community
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Participate in shaping the campaign. Propose target increases and vote on petitions.
          Voting uses browser participation tokens — no accounts required.
        </p>
      </header>

      {/* Browser Token Status */}
      <div className="max-w-3xl mx-auto mb-8">
        <Card variant="outlined" padding="md">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-earth-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-900">Your Participation Token</p>
                <p className="text-sm text-stone-600">
                  {token
                    ? `Active · ${token.slice(0, 8)}...${token.slice(-4)}`
                    : 'Not generated yet'
                  }
                </p>
              </div>
            </div>
            {!token && (
              <Button onClick={generateToken} variant="outline" size="sm">
                Generate Token
              </Button>
            )}
            {token && (
              <Button onClick={() => generateToken()} variant="ghost" size="sm">
                Regenerate
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Petition */}
      {petition && (
        <section className="mb-12 lg:mb-16">
          <div className="max-w-3xl mx-auto">
            <Card variant="default" padding="lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <Badge variant={statusVariant} size="lg" className={statusColor}>
                      {statusLabel}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl">{petition.title}</CardTitle>
                <CardDescription>
                  Target increase from {formatCurrency(petition.currentTarget)} to {formatCurrency(petition.requestedTarget)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-stone-600 leading-relaxed">{petition.description}</p>
                </div>

                {/* Voting Progress */}
                <div className="border-t border-stone-200 pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-charcoal-900">Community Vote</h3>
                    <Badge variant="info" size="sm">
                      {totalVotes} votes cast
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-emerald-700">Yes — {petition.yesVotes} votes</span>
                        <span className="text-emerald-700">{yesPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={yesPercentage} max={100} size="md" variant="success" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-red-700">No — {petition.noVotes} votes</span>
                        <span className="text-red-700">{noPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={noPercentage} max={100} size="md" variant="error" />
                    </div>

                    <div className="text-sm text-stone-500">
                      Requires {petition.requiredTokens} unique participation tokens to proceed to voting
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {petition.status === 'voting' && (
                    <div className="border-t border-stone-200 pt-6">
                      <h4 className="font-semibold text-charcoal-900 mb-4">Your Vote</h4>
                      <div className="flex gap-4">
                        <Button
                          variant={userVote === 'yes' ? 'success' : 'outline'}
                          size="lg"
                          className="flex-1"
                          onClick={() => handleVote('yes')}
                          disabled={userVote !== null || !token || hasVoted(petition.id)}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Yes ({petition.yesVotes})
                        </Button>
                        <Button
                          variant={userVote === 'no' ? 'error' : 'outline'}
                          size="lg"
                          className="flex-1"
                          onClick={() => handleVote('no')}
                          disabled={userVote !== null || !token || hasVoted(petition.id)}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          No ({petition.noVotes})
                        </Button>
                      </div>

                      {!token && (
                        <p className="mt-3 text-sm text-stone-500 text-center">
                          Generate a participation token above to vote
                        </p>
                      )}

                      {token && hasVoted(petition.id) && (
                        <p className="mt-3 text-sm text-stone-500 text-center">
                          You have already voted on this petition
                        </p>
                      )}
                    </div>
                  )}

                  {/* Petition Timeline */}
                  <div className="border-t border-stone-200 pt-6">
                    <h4 className="font-semibold text-charcoal-900 mb-4">Timeline</h4>
                    <div className="space-y-2 text-sm text-stone-600">
                      <p>Created: {new Date(petition.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      {petition.endsAt && (
                        <p>Voting ends: {new Date(petition.endsAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      )}
                      {petition.implementedAt && (
                        <p className="text-emerald-700">
                          Implemented: {new Date(petition.implementedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Create Petition Form */}
      <section className="mb-12 lg:mb-16">
        <div className="max-w-2xl mx-auto">
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                Propose a Target Increase
              </CardTitle>
              <CardDescription>
                Petitions require 5 unique participation tokens before entering community voting.
                Maximum target: $50,000.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                variant={showCreatePetition ? 'default' : 'outline'}
                onClick={() => setShowCreatePetition(!showCreatePetition)}
                className="w-full mb-4"
              >
                {showCreatePetition ? 'Cancel' : 'Create New Petition'}
              </Button>

              {showCreatePetition && (
                <form onSubmit={handleCreatePetition} className="space-y-4">
                  <Input
                    label="Petition Title"
                    placeholder="e.g., Increase target for additional medical expenses"
                    value={petitionForm.title}
                    onChange={(e) => setPetitionForm({ ...petitionForm, title: e.target.value })}
                    required
                    maxLength={100}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Explain why the target should be increased. Be specific about how additional funds will be used."
                    value={petitionForm.description}
                    onChange={(e) => setPetitionForm({ ...petitionForm, description: e.target.value })}
                    required
                    rows={4}
                    maxLength={2000}
                  />
                  <Input
                    label="Requested Target (USD)"
                    type="number"
                    placeholder="50000"
                    value={petitionForm.requestedTarget}
                    onChange={(e) => setPetitionForm({ ...petitionForm, requestedTarget: e.target.value })}
                    required
                    min={petition.currentTarget + 1}
                    max={50000}
                    hint={`Must be between $${petition.currentTarget + 1} and $50,000`}
                  />
                  <Button type="submit" className="w-full">
                    Submit Petition
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="max-w-3xl mx-auto">
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                How Community Governance Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-stone-600">
              <ul className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Propose:</strong> Any visitor with a participation token can propose a target increase (max $50,000)
                </li>
                <li>
                  <strong>Threshold:</strong> Petitions need 5 unique tokens to support them before entering voting
                </li>
                <li>
                  <strong>Vote:</strong> Community votes Yes/No using their browser token (one vote per token per petition)
                </li>
                <li>
                  <strong>Admin Review:</strong> Approved petitions are reviewed by admin with recorded reason
                </li>
                <li>
                  <strong>Public Announcement:</strong> Before any target change, a public announcement is made
                </li>
                <li>
                  <strong>Implement:</strong> If approved, campaign target is updated (never exceeds $50,000)
                </li>
              </ul>
              <div className="pt-4 border-t border-stone-200">
                <p className="text-xs text-stone-500">
                  <strong>Note:</strong> Browser tokens are stored locally and hashed on the server.
                  This is not one-person-one-vote — it's browser-bound participation.
                  Users can clear tokens by clearing browser data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}