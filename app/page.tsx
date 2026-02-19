'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Receipt } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { getSpendingSummary } from '@/utils/analytics';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import SummaryCards from '@/components/SummaryCards';
import CategoryChart from '@/components/CategoryChart';
import MonthlyChart from '@/components/MonthlyChart';

export default function DashboardPage() {
  const { expenses, isLoaded } = useExpenses();

  const summary = useMemo(() => getSpendingSummary(expenses), [expenses]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your financial overview at a glance</p>
        </div>
        <Link
          href="/expenses/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} expenseCount={expenses.length} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryChart summary={summary} />
        <MonthlyChart summary={summary} />
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">Recent Expenses</h3>
          <Link
            href="/expenses"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {summary.recentExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Receipt className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No expenses yet</p>
            <p className="text-slate-400 text-sm mt-1">Start tracking by adding your first expense</p>
            <Link
              href="/expenses/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add your first expense
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {summary.recentExpenses.map((expense) => {
              const color = CATEGORY_COLORS[expense.category];
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {CATEGORY_ICONS[expense.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{expense.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(expense.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                    <span className="text-xs font-medium" style={{ color }}>
                      {expense.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick category stats */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(['Food', 'Transportation', 'Bills'] as const).map((cat) => (
            <div
              key={cat}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center"
            >
              <div className="text-2xl mb-1">{CATEGORY_ICONS[cat]}</div>
              <p className="text-xs text-slate-500 font-medium">{cat}</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {formatCurrency(summary.byCategory[cat] || 0)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
