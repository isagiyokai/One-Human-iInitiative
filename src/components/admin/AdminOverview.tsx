'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardCampaign {
  id: string;
  name: string;
  target: number;
  max_target: number;
  confirmed_amount: number;
  confirmed_count: number;
  status: string;
  computed_status: string;
  start_date: string;
  end_date: string;
  days_remaining: number;
  total_expenses: number;
  published_expense_count: number;
  pending_contributions: number;
  active_petitions: number;
}

interface DashboardData {
  campaign: DashboardCampaign;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  draft: { label: 'Draft', variant: 'default' },
  active: { label: 'Active', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
  target_reached: { label: 'Target reached', variant: 'success' },
  expired: { label: 'Expired', variant: 'error' },
  completed: { label: 'Completed', variant: 'default' },
};

export function AdminOverview() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/dashboard', {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to load live dashboard data.');
      }
      if (!result.campaign) {
        throw new Error('The dashboard API did not return campaign data.');
      }

      setData(result as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading && !data) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl space-y-10 pb-10" aria-busy="true">
        <header className="space-y-2">
          <div className="h-3 w-36 rounded bg-stone-200 animate-pulse" />
          <div className="h-10 w-64 max-w-full rounded bg-stone-200 animate-pulse" />
          <div className="h-4 w-80 max-w-full rounded bg-stone-200 animate-pulse" />
        </header>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} variant="default" padding="lg">
              <CardContent className="space-y-4">
                <div className="h-4 w-28 rounded bg-stone-200 animate-pulse" />
                <div className="h-9 w-44 rounded bg-stone-200 animate-pulse" />
                <div className="h-4 w-36 rounded bg-stone-200 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <Card variant="default" padding="lg"><CardContent className="h-64 animate-pulse rounded bg-stone-100" /></Card>
          <Card variant="default" padding="lg"><CardContent className="h-64 animate-pulse rounded bg-stone-100" /></Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-3xl py-12">
        <Card variant="default" padding="lg">
          <CardContent className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-charcoal-900">Dashboard unavailable</h1>
            <p className="text-stone-600">{error || 'No live campaign data was returned.'}</p>
            <div>
              <Button variant="outline" onClick={() => void loadDashboard()} loading={isLoading}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const campaign = data.campaign;
  const raised = Number(campaign.confirmed_amount) || 0;
  const target = Number(campaign.target) || 0;
  const expenses = Number(campaign.total_expenses) || 0;
  const pending = Number(campaign.pending_contributions) || 0;
  const petitions = Number(campaign.active_petitions) || 0;
  const contributors = Number(campaign.confirmed_count) || 0;
  const expenseCount = Number(campaign.published_expense_count) || 0;
  const remaining = Math.max(target - raised, 0);
  const percentage = target > 0 ? Math.min(Math.max((raised / target) * 100, 0), 100) : 0;
  const status = statusConfig[campaign.computed_status] || {
    label: 'Unknown status',
    variant: 'default' as const,
  };
  const expenseRatio = raised > 0 ? (expenses / raised) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-10 pb-12">
      <header className="flex flex-col gap-5 border-b border-stone-200 pb-7 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Campaign control centre</p>
          <h1 className="text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">Overview</h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            A live summary of confirmed contributions, items awaiting review, and published spending.
          </p>
          <p className="text-sm font-medium text-charcoal-700">{campaign.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={status.variant} size="lg">{status.label}</Badge>
          <Button variant="outline" onClick={() => void loadDashboard()} loading={isLoading}>
            Refresh data
          </Button>
        </div>
      </header>

      <section aria-label="Live campaign figures" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Confirmed contributions"
          value={formatCurrency(raised)}
          detail={`${formatNumber(contributors)} confirmed contribution(s)`}
          accent="emerald"
        />
        <MetricCard
          title="Awaiting verification"
          value={formatNumber(pending)}
          detail="Pending items requiring manual review"
          accent="amber"
        />
        <MetricCard
          title="Published expenses"
          value={formatCurrency(expenses)}
          detail={`${formatNumber(expenseCount)} published record(s) · ${expenseRatio.toFixed(1)}% of confirmed funds`}
          accent="slate"
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <Card variant="default" padding="lg" className="h-full">
          <CardHeader className="gap-3 border-b border-stone-100 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-xl">Funding progress</CardTitle>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold tabular-nums text-charcoal-800">
                {percentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm leading-6 text-stone-600">Confirmed funds compared with the current campaign target.</p>
          </CardHeader>
          <CardContent className="space-y-7 pt-6">
            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-stone-500">Raised so far</p>
                  <p className="text-3xl font-bold tracking-tight text-charcoal-900 tabular-nums sm:text-4xl">
                    {formatCurrency(raised)}
                  </p>
                </div>
                <p className="text-sm text-stone-600">Target: <span className="font-semibold text-charcoal-800">{formatCurrency(target)}</span></p>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-stone-100"
                role="progressbar"
                aria-label="Campaign funding progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(1))}
              >
                <div
                  className="h-full rounded-full bg-charcoal-800 transition-[width] duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-sm text-stone-500">
                <span>{percentage.toFixed(1)}% funded</span>
                <span>{remaining > 0 ? `${formatCurrency(remaining)} remaining` : 'Target reached'}</span>
              </div>
            </div>

            <div className="grid gap-4 border-t border-stone-100 pt-6 sm:grid-cols-3">
              <div className="rounded-xl bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Contributors</p>
                <p className="mt-2 text-2xl font-semibold text-charcoal-900 tabular-nums">{formatNumber(contributors)}</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Remaining to target</p>
                <p className="mt-2 text-2xl font-semibold text-charcoal-900 tabular-nums">{formatCurrency(remaining)}</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Days remaining</p>
                <p className="mt-2 text-2xl font-semibold text-charcoal-900 tabular-nums">{formatNumber(campaign.days_remaining)}</p>
              </div>
            </div>
            <div className="text-sm text-stone-500">
              Campaign window: {new Date(campaign.start_date).toLocaleDateString()} – {new Date(campaign.end_date).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardHeader className="border-b border-stone-100 pb-5">
            <CardTitle className="text-xl">Action centre</CardTitle>
            <p className="text-sm leading-6 text-stone-600">Go directly to the records that may need your attention.</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <ActionLink
              href="/admin/contributions"
              title="Contribution verification"
              description={pending > 0 ? `${formatNumber(pending)} pending item(s) to review` : 'No contributions are waiting for review'}
              count={pending}
              tone={pending > 0 ? 'warning' : 'neutral'}
            />
            <ActionLink
              href="/admin/community"
              title="Petitions in voting"
              description={petitions > 0 ? `${formatNumber(petitions)} active petition(s)` : 'No petitions are currently in voting'}
              count={petitions}
              tone="neutral"
            />
            <ActionLink
              href="/admin/expenses"
              title="Expense records"
              description={`${formatNumber(expenseCount)} published record(s); ${formatCurrency(expenses)} total`}
              tone="neutral"
            />
            <ActionLink
              href="/admin/campaign"
              title="Campaign settings"
              description="Review campaign details, status, and targets"
              tone="neutral"
            />
          </CardContent>
        </Card>
      </section>

      <p className="text-xs leading-5 text-stone-500">
        Values on this page come from the campaign database. This overview does not generate sample activity or placeholder transaction records.
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  accent,
}: {
  title: string;
  value: string;
  detail: string;
  accent: 'emerald' | 'amber' | 'slate';
}) {
  const accents = {
    emerald: 'border-l-4 border-l-emerald-600',
    amber: 'border-l-4 border-l-amber-500',
    slate: 'border-l-4 border-l-stone-400',
  };

  return (
    <Card variant="default" padding="lg" className={`h-full ${accents[accent]}`}>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-stone-600">{title}</p>
        <p className="break-words text-3xl font-bold tracking-tight text-charcoal-900 tabular-nums sm:text-4xl">
          {value}
        </p>
        <p className="text-sm leading-6 text-stone-500">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ActionLink({
  href,
  title,
  description,
  count,
  tone = 'neutral',
}: {
  href: string;
  title: string;
  description: string;
  count?: number;
  tone?: 'neutral' | 'warning';
}) {
  return (
    <a
      href={href}
      className="flex min-h-[88px] items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-600 focus-visible:ring-offset-2"
    >
      <span className="min-w-0">
        <span className="block font-semibold text-charcoal-900">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-stone-600">{description}</span>
      </span>
      {typeof count === 'number' && count > 0 && (
        <span className={tone === 'warning'
          ? 'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 px-2 text-sm font-semibold text-amber-900'
          : 'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 px-2 text-sm font-semibold text-charcoal-800'
        }>
          {formatNumber(count)}
        </span>
      )}
      <span className="shrink-0 text-lg text-stone-400" aria-hidden="true">→</span>
    </a>
  );
}
