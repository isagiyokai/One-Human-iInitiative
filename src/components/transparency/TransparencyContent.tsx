'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'published' | 'pending';
  evidenceUrl?: string;
}

interface TransparencyData {
  totalRaised: number;
  totalExpenses: number;
  remainingBalance: number;
  contributorCount: number;
  expenses: Expense[];
  categories: { category: string; total: number; percentage: number }[];
}

// Empty state - data will be fetched from API
const emptyData: TransparencyData = {
  totalRaised: 0,
  totalExpenses: 0,
  remainingBalance: 0,
  contributorCount: 0,
  expenses: [],
  categories: [],
};

export function TransparencyContent() {
  const { totalRaised, totalExpenses, remainingBalance, contributorCount, expenses, categories } = emptyData;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Transparency
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Every confirmed contribution and expense is tracked publicly.
          Only published expenses are shown here. All amounts in USD.
        </p>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <FinancialCard
          title="Total Raised"
          value={formatCurrency(totalRaised)}
          description={`${formatNumber(contributorCount)} confirmed contributors`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
        />
        <FinancialCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          description={`${categories.length} categories`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="red"
        />
        <FinancialCard
          title="Remaining Balance"
          value={formatCurrency(remainingBalance)}
          description={`${((remainingBalance / totalRaised) * 100).toFixed(1)}% of funds`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="blue"
        />
        <FinancialCard
          title="Contributors"
          value={formatNumber(contributorCount)}
          description="Anonymous supporters"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Category Breakdown */}
      <section className="mb-12 lg:mb-16">
        <div className="max-w-3xl mx-auto">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                Expense Categories
              </CardTitle>
              <CardDescription>
                Breakdown of published expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((cat) => (
                <CategoryRow key={cat.category} category={cat} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Expenses Table */}
      <section>
        <div className="max-w-5xl mx-auto">
          <Card variant="default" padding="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    Published Expenses
                  </CardTitle>
                  <CardDescription>
                    All verified and published expenditures. Click to view evidence.
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  {expenses.length} records
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Description</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Amount</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-charcoal-900 font-mono">
                          {new Date(expense.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="default" size="sm">
                            {expense.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-charcoal-700 max-w-xs truncate">
                          {expense.description}
                        </td>
                        <td className="py-4 px-4 text-sm font-mono font-medium text-charcoal-900 text-right">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {expense.evidenceUrl && (
                            <a
                              href={expense.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-earth-600 hover:text-earth-700 hover:underline"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Legend / Notes */}
      <section className="mt-12 lg:mt-16">
        <div className="max-w-3xl mx-auto">
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-600">
              <ul className="list-disc list-inside space-y-2">
                <li>Only <strong>confirmed contributions</strong> count toward the total raised</li>
                <li>Only <strong>published expenses</strong> appear in this table</li>
                <li>Amounts shown in <strong>USD</strong> (converted at time of verification)</li>
                <li>Admin verification is manual — blockchain transactions verified on-chain</li>
                <li>Evidence documents have EXIF metadata stripped for privacy</li>
                <li>Categories and descriptions are provided by the campaign admin</li>
                <li>Remaining balance = Total Raised - Total Published Expenses</li>
              </ul>
              <p className="pt-4 border-t border-stone-200 text-xs text-stone-500">
                This transparency page updates in real-time as contributions are verified and expenses are published.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FinancialCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: 'emerald' | 'red' | 'blue' | 'purple';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card variant="default" padding="lg" className="text-center">
      <CardContent className="space-y-3">
        <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-charcoal-900 tabular-nums">{value}</div>
        <h3 className="font-semibold text-charcoal-900">{title}</h3>
        <p className="text-sm text-stone-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function CategoryRow({ category }: { category: { category: string; total: number; percentage: number } }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-charcoal-900">{category.category}</span>
        <span className="font-mono text-charcoal-900">{formatCurrency(category.total)}</span>
      </div>
      <Progress
        value={category.percentage}
        max={100}
        size="sm"
        variant="default"
        showLabel
        label={`${category.percentage.toFixed(1)}%`}
      />
    </div>
  );
}