'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardData {
  campaign: {
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
    pending_contributions: number;
    active_petitions: number;
  };
}

interface AdminOverviewProps {
  initialData?: DashboardData;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  active: { label: 'Active', variant: 'success' as const },
  paused: { label: 'Paused', variant: 'warning' as const },
  target_reached: { label: 'Target Reached', variant: 'success' as const },
  expired: { label: 'Expired', variant: 'error' as const },
  completed: { label: 'Completed', variant: 'default' as const },
};

export function AdminOverview({ initialData }: AdminOverviewProps) {
  const [data, setData] = React.useState<DashboardData | null>(initialData || null);
  const [isLoading, setIsLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) return;

    async function fetchData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) throw new Error('Failed to load dashboard data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [initialData]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">Dashboard</h1>
            <p className="mt-1 text-stone-600">Campaign overview and quick actions</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="default" padding="lg">
              <CardContent className="space-y-3">
                <div className="h-5 bg-stone-200 animate-pulse rounded w-3/4" />
                <div className="h-10 bg-stone-200 animate-pulse rounded w-full" />
                <div className="h-4 bg-stone-200 animate-pulse rounded w-1/2" />
                <div className="h-3 bg-stone-200 animate-pulse rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Campaign Progress
                <div className="h-5 bg-stone-200 animate-pulse rounded w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="h-6 bg-stone-200 animate-pulse rounded" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-stone-200 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-stone-200 animate-pulse rounded" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || 'Failed to load dashboard data'}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const campaign = data.campaign;
  const { label: statusLabel, variant: statusVariant } = statusConfig[campaign.computed_status as keyof typeof statusConfig] || statusConfig.active;
  const percentage = campaign.target > 0 ? Math.min((campaign.confirmed_amount / campaign.target) * 100, 100) : 0;
  const isTargetReached = campaign.computed_status === 'target_reached' || campaign.confirmed_amount >= campaign.target;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">Dashboard</h1>
          <p className="mt-1 text-stone-600">Campaign overview and quick actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant} size="lg">
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Raised"
          value={formatCurrency(campaign.confirmed_amount)}
          description={`Target: ${formatCurrency(campaign.target)}`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
          trend={`+${formatNumber(campaign.confirmed_count)} contributors`}
        />
        <StatCard
          title="Pending Verification"
          value={formatNumber(campaign.pending_contributions)}
          description="Awaiting admin review"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="amber"
          trend={campaign.pending_contributions > 0 ? 'Requires action' : 'All caught up'}
        />
        <StatCard
          title="Published Expenses"
          value={formatCurrency(campaign.total_expenses)}
          description={`${campaign.confirmed_amount > 0 ? ((campaign.total_expenses / campaign.confirmed_amount) * 100).toFixed(1) : '0.0'}% of funds`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="red"
          trend={`${formatNumber(5)} records published`}
        />
        <StatCard
          title="Days Remaining"
          value={campaign.days_remaining.toString()}
          description="Campaign expires in"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
          trend={campaign.days_remaining <= 7 ? 'Urgent!' : 'On track'}
        />
      </div>

      {/* Progress & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign Progress */}
        <Card variant="default" padding="lg" className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Campaign Progress
              <Badge variant={isTargetReached ? 'success' : 'default'} size="sm">
                {percentage.toFixed(1)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress
              value={campaign.confirmed_amount}
              max={campaign.target}
              showLabel
              label={`Raised ${formatCurrency(campaign.confirmed_amount)} of ${formatCurrency(campaign.target)}`}
              size="lg"
              variant={isTargetReached ? 'success' : 'default'}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-xl bg-stone-50 text-center">
                <div className="text-3xl font-bold text-charcoal-900 tabular-nums">{formatNumber(campaign.confirmed_count)}</div>
                <div className="text-xs text-stone-500 mt-1">Contributors</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 text-center">
                <div className="text-3xl font-bold text-charcoal-900 tabular-nums">{formatCurrency(campaign.target - campaign.confirmed_amount)}</div>
                <div className="text-xs text-stone-500 mt-1">{isTargetReached ? 'Target Reached!' : 'To Target'}</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 text-center">
                <div className="text-3xl font-bold text-charcoal-900 tabular-nums">{formatCurrency(campaign.confirmed_amount - campaign.total_expenses)}</div>
                <div className="text-xs text-stone-500 mt-1">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="default" padding="lg" className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickActionLink
              href="/admin/contributions"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Verify Contributions"
              description={`${campaign.pending_contributions} pending verification`}
              badge={campaign.pending_contributions > 0 ? campaign.pending_contributions.toString() : undefined}
              badgeVariant="warning"
            />
            <QuickActionLink
              href="/admin/expenses"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              title="Add Expense"
              description="Record new expenditure"
            />
            <QuickActionLink
              href="/admin/community"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Review Petitions"
              description={`${campaign.active_petitions} active petition(s)`}
              badge={campaign.active_petitions > 0 ? campaign.active_petitions.toString() : undefined}
              badgeVariant="info"
            />
            <QuickActionLink
              href="/admin/updates"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="Publish Update"
              description="Create campaign update"
            />
            <QuickActionLink
              href="/admin/payments"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
              title="Update Payment Methods"
              description="BTC, SOL, Phantom, Ko-fi"
            />
            <QuickActionLink
              href="/admin/audit"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="View Audit Log"
              description="Admin action history"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="default" padding="lg" className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ActivityRow
              action="Dashboard loaded"
              detail="Real-time data from database"
              time="Just now"
              type="info"
            />
            <ActivityRow
              action="Campaign status"
              detail={`Current: ${statusLabel} (${percentage.toFixed(1)}% funded)`}
              time="Live"
              type={isTargetReached ? 'success' : 'default'}
            />
            {campaign.pending_contributions > 0 && (
              <ActivityRow
                action="Pending contributions"
                detail={`${campaign.pending_contributions} awaiting verification`}
                time="Now"
                type="warning"
              />
            )}
            {campaign.active_petitions > 0 && (
              <ActivityRow
                action="Active petitions"
                detail={`${campaign.active_petitions} petition(s) in voting`}
                time="Now"
                type="info"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: 'emerald' | 'amber' | 'red' | 'blue';
  trend: string;
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <Card variant="default" padding="lg" className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out" hover>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-charcoal-900">{title}</h3>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-bold text-charcoal-900 tabular-nums">{value}</div>
        <div className="text-sm text-stone-500">{description}</div>
        <div className="text-xs text-stone-400">{trend}</div>
      </CardContent>
    </Card>
  );
}

function QuickActionLink({
  href,
  icon,
  title,
  description,
  badge,
  badgeVariant,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-charcoal-900 truncate">{title}</p>
        <p className="text-sm text-stone-500 truncate">{description}</p>
      </div>
      {badge && (
        <Badge variant={badgeVariant || 'default'} size="sm">
          {badge}
        </Badge>
      )}
    </a>
  );
}

function ActivityRow({
  action,
  detail,
  time,
  type,
}: {
  action: string;
  detail: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'default';
}) {
  const typeColors = {
    success: 'text-emerald-600 bg-emerald-100',
    warning: 'text-amber-600 bg-amber-100',
    error: 'text-red-600 bg-red-100',
    info: 'text-blue-600 bg-blue-100',
    default: 'text-charcoal-600 bg-charcoal-100',
  };

  const icons: Record<string, React.ReactNode> = {
    success: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    default: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-charcoal-900">{action}</p>
        <p className="text-sm text-stone-600">{detail}</p>
      </div>
      <div className="flex-shrink-0 text-sm text-stone-400 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}