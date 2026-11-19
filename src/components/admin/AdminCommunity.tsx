'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

type PetitionStatus = 'collecting' | 'voting' | 'approved' | 'rejected' | 'cancelled';
interface Petition {
  id: string;
  requestedTarget: number;
  reason: string;
  status: PetitionStatus;
  tokenCount: number;
  requiredTokens: number;
  createdAt: string;
  votingStartsAt: string | null;
  votingEndsAt: string | null;
  decidedAt: string | null;
  adminNotes: string;
  voteCounts: { yes: number; no: number; total: number };
}

const statusStyles: Record<PetitionStatus, 'info' | 'warning' | 'success' | 'error' | 'default'> = {
  collecting: 'info', voting: 'warning', approved: 'success', rejected: 'error', cancelled: 'default',
};

function fromRow(row: Record<string, unknown>): Petition {
  const counts = (row.voteCounts && typeof row.voteCounts === 'object' ? row.voteCounts : {}) as Record<string, unknown>;
  return {
    id: String(row.id),
    requestedTarget: Number(row.requested_target || 0),
    reason: String(row.reason || ''),
    status: (['collecting', 'voting', 'approved', 'rejected', 'cancelled'].includes(String(row.status)) ? String(row.status) : 'collecting') as PetitionStatus,
    tokenCount: Number(row.token_count || 0),
    requiredTokens: Number(row.required_tokens || 0),
    createdAt: String(row.created_at || ''),
    votingStartsAt: row.voting_starts_at ? String(row.voting_starts_at) : null,
    votingEndsAt: row.voting_ends_at ? String(row.voting_ends_at) : null,
    decidedAt: row.decided_at ? String(row.decided_at) : null,
    adminNotes: String(row.admin_notes || ''),
    voteCounts: { yes: Number(counts.yes || 0), no: Number(counts.no || 0), total: Number(counts.total || 0) },
  };
}

export function AdminCommunity() {
  const [petitions, setPetitions] = React.useState<Petition[]>([]);
  const [activeTab, setActiveTab] = React.useState('petitions');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPetitions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/petitions', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load petitions');
      setPetitions(Array.isArray(payload.petitions) ? payload.petitions.map(fromRow) : []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load petitions' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadPetitions(); }, [loadPetitions]);

  const saveAction = async (petition: Petition, action: 'approve' | 'reject' | 'cancel' | 'notes') => {
    if (action !== 'notes' && !window.confirm(`${action[0].toUpperCase() + action.slice(1)} this petition?`)) return;
    setProcessingId(petition.id);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/petitions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petitionId: petition.id, action, adminNotes: action === 'notes' ? adminNotes : petition.adminNotes }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to update petition');
      setEditingId(null);
      setAdminNotes('');
      const actionMessage = action === 'notes' ? 'Admin notes saved.' : action === 'approve' ? 'Petition approved.' : action === 'reject' ? 'Petition rejected.' : 'Petition cancelled.';
      setMessage({ type: 'success', text: actionMessage });
      await loadPetitions();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to update petition' });
    } finally {
      setProcessingId(null);
    }
  };

  const beginNotes = (petition: Petition) => {
    setEditingId(petition.id);
    setAdminNotes(petition.adminNotes);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-charcoal-900">Community</h1>
        <p className="mt-1 text-stone-600">Review real petitions and aggregated voting results.</p>
      </header>

      {message && <div className={`rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="alert">{message.text}</div>}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="petitions">Petitions ({petitions.length})</TabsTrigger>
          <TabsTrigger value="votes">Vote totals</TabsTrigger>
        </TabsList>

        <TabsContent value="petitions" className="space-y-4">
          {isLoading ? <Card padding="lg"><CardContent><p className="py-8 text-center text-stone-500">Loading petitions...</p></CardContent></Card> :
           petitions.length === 0 ? <Card padding="lg"><CardContent><p className="py-8 text-center text-stone-500">There are no petitions in the database yet.</p></CardContent></Card> :
           petitions.map((petition) => <Card key={petition.id} variant="default" padding="lg">
             <CardHeader>
               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 <div><CardTitle className="text-lg">Petition · {petition.id.slice(0, 8)}</CardTitle><CardDescription className="mt-1">Requested target: <strong>${petition.requestedTarget.toLocaleString()} USD</strong></CardDescription></div>
                 <Badge variant={statusStyles[petition.status]}>{petition.status}</Badge>
               </div>
             </CardHeader>
             <CardContent className="space-y-4">
               <div><p className="mb-1 text-sm font-medium text-charcoal-700">Reason</p><p className="whitespace-pre-wrap text-sm text-stone-600">{petition.reason}</p></div>
               <div className="flex flex-wrap gap-3 text-sm text-stone-600">
                 <span>{petition.tokenCount}/{petition.requiredTokens} signatures</span>
                 <span>{petition.voteCounts.yes} yes</span><span>{petition.voteCounts.no} no</span>
                 {petition.votingEndsAt && <span>Voting ends {new Date(petition.votingEndsAt).toLocaleString()}</span>}
               </div>
               {editingId === petition.id ? <div className="space-y-3 rounded-lg bg-stone-50 p-4">
                 <Textarea label="Internal admin notes" value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={3} />
                 <div className="flex justify-end gap-2">
                   <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                   <Button disabled={processingId === petition.id} onClick={() => void saveAction(petition, 'notes')}>{processingId === petition.id ? 'Saving...' : 'Save notes'}</Button>
                 </div>
               </div> : petition.adminNotes ? <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-700"><strong>Admin notes:</strong> {petition.adminNotes}</div> : null}
               <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                 <Button size="sm" variant="outline" onClick={() => beginNotes(petition)}> {petition.adminNotes ? 'Edit notes' : 'Add notes'} </Button>
                 {petition.status === 'voting' && <Button size="sm" disabled={processingId === petition.id} onClick={() => void saveAction(petition, 'approve')}>Approve</Button>}
                 {(petition.status === 'collecting' || petition.status === 'voting') && <>
                   <Button size="sm" variant="outline" disabled={processingId === petition.id} onClick={() => void saveAction(petition, 'reject')}>Reject</Button>
                   <Button size="sm" variant="ghost" disabled={processingId === petition.id} onClick={() => void saveAction(petition, 'cancel')}>Cancel petition</Button>
                 </>}
               </div>
             </CardContent>
           </Card>)}
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          {isLoading ? <p className="py-8 text-center text-stone-500">Loading vote totals...</p> :
           petitions.length === 0 ? <p className="py-8 text-center text-stone-500">No petition voting data.</p> :
           petitions.map((petition) => <Card key={petition.id} padding="lg">
             <CardHeader><CardTitle className="text-base">Petition · {petition.id.slice(0, 8)}</CardTitle><CardDescription>Requested target ${petition.requestedTarget.toLocaleString()} · {petition.status}</CardDescription></CardHeader>
             <CardContent className="flex flex-wrap gap-3"><Badge variant="success">{petition.voteCounts.yes} Yes</Badge><Badge variant="error">{petition.voteCounts.no} No</Badge><Badge variant="info">{petition.voteCounts.total} Total votes</Badge></CardContent>
           </Card>)}
          <p className="text-xs text-stone-500">Individual voter tokens are not exposed in this panel; only aggregate vote totals are shown.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
