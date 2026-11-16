'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface OverviewStats {
  totalRaised: number;
  target: number;
  contributorCount: number;
  pendingContributions: number;
  totalExpenses: number;
  activePetitions: number;
  daysRemaining: number;
  campaignStatus: string;
}

const mockStats: OverviewStats = {
  totalRaised: 25750,
  target: 10000,
  contributorCount: 142,
  pendingContributions: 8,
  totalExpenses: 8420,
  activePetitions: 1,
  daysRemaining: 18,
  campaignStatus: 'active',
};

const statusConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  active: { label: 'Active', variant: 'success' as const },
  paused: { label: 'Paused', variant: 'warning' as const },
  target_reached: { label: 'Target Reached', variant: 'success' as const },
  expired: { label: 'Expired', variant: 'error' as const },
  completed: { label: 'Completed', variant: 'default' as const },
};

export function AdminOverview() {
  const stats = mockStats;
  const { label: statusLabel, variant: statusVariant } = statusConfig[stats.campaignStatus as keyof typeof statusConfig] || statusConfig.active;
  const percentage = stats.target > 0 ? Math.min((stats.totalRaised / stats.target) * 100, 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Dashboard</h1>
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
          value={formatCurrency(stats.totalRaised)}
          description={`Target: ${formatCurrency(stats.target)}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
          trend={`+${formatNumber(stats.contributorCount)} contributors`}
        />
        <StatCard
          title="Pending Verification"
          value={formatNumber(stats.pendingContributions)}
          description="Awaiting admin review"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="amber"
          trend="Requires action"
        />
        <StatCard
          title="Published Expenses"
          value={formatCurrency(stats.totalExpenses)}
          description={`${((stats.totalExpenses / stats.totalRaised) * 100).toFixed(1)}% of funds`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="red"
          trend={`${formatNumber(5)} records published`}
        />
        <StatCard
          title="Days Remaining"
          value={stats.daysRemaining.toString()}
          description="Campaign expires in"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
          trend={stats.daysRemaining <= 7 ? 'Urgent!' : 'On track'}
        />
      </div>

      {/* Progress & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign Progress */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Campaign Progress
              <Badge variant={percentage >= 100 ? 'success' : 'default'} size="sm">
                {percentage.toFixed(1)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={stats.totalRaised}
              max={stats.target}
              showLabel
              label={`Raised ${formatCurrency(stats.totalRaised)} of ${formatCurrency(stats.target)}`}
              size="lg"
              variant={percentage >= 100 ? 'success' : 'default'}
            />
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div className="p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-charcoal-900">{formatNumber(stats.contributorCount)}</div>
                <div className="text-xs text-stone-500">Contributors</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-charcoal-900">{formatCurrency(stats.target - stats.totalRaised)}</div>
                <div className="text-xs text-stone-500">To Target</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-charcoal-900">{formatCurrency(stats.totalRaised - stats.totalExpenses)}</div>
                <div className="text-xs text-stone-500">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickActionLink
              href="/admin/contributions"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Verify Contributions"
              description={`${stats.pendingContributions} pending verification`}
              badge={stats.pendingContributions > 0 ? stats.pendingContributions.toString() : undefined}
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
              description={`${stats.activePetitions} active petition(s}`}
              badge={stats.activePetitions > 0 ? stats.activePetitions.toString() : undefined}
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
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Contribution verified', detail: 'BTC transaction abc123... confirmed', time: '2 hours ago', type: 'success' as const },
              { action: 'Expense published', detail: 'Medical: Follow-up appointment - $850', time: '5 hours ago', type: 'info' as const },
              { action: 'Petition created', detail: 'Increase target to $35,000', time: '1 day ago', type: 'warning' as const },
              { action: 'Update published', detail: 'Monthly expense report - January 2024', time: '2 days ago', type: 'default' as const },
              { action: 'Payment method updated', detail: 'Solana address changed', time: '3 days ago', type: 'info' as const },
            ].map((activity, index) => (
              <ActivityRow key={index} {...activity} />
            ))}
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
    <Card variant="default" padding="lg">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-charcoal-900">{title}</h3>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-charcoal-900 tabular-nums">{value}</div>
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
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
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
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors">
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