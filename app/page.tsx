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
          <div className="w-8 h-8 border-[3px] border-black/10 border-t-[#1d1d1f] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#6e6e73] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Dashboard</h1>
          <p className="text-[15px] text-[#6e6e73] mt-0.5">Your financial overview at a glance</p>
        </div>
        <Link
          href="/expenses/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all duration-200 shadow-sm"
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
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
          <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Recent Expenses</h3>
          <Link
            href="/expenses"
            className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {summary.recentExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mb-4">
              <Receipt className="w-7 h-7 text-[#a1a1a6]" />
            </div>
            <p className="text-[#1d1d1f] font-medium">No expenses yet</p>
            <p className="text-[#a1a1a6] text-sm mt-1">Start tracking by adding your first expense</p>
            <Link
              href="/expenses/new"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              Add your first expense
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {summary.recentExpenses.map((expense) => {
              const color = CATEGORY_COLORS[expense.category];
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f5f5f7]/60 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    {CATEGORY_ICONS[expense.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1d1d1f] truncate">{expense.description}</p>
                    <p className="text-xs text-[#a1a1a6]">{formatDate(expense.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[#1d1d1f] tabular-nums">{formatCurrency(expense.amount)}</p>
                    <span className="text-[11px] font-medium" style={{ color }}>
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
        <div className="grid grid-cols-3 gap-3">
          {(['Food', 'Transportation', 'Bills'] as const).map((cat) => (
            <div
              key={cat}
              className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 text-center"
            >
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
              <p className="text-xs text-[#6e6e73] font-medium">{cat}</p>
              <p className="text-sm font-semibold text-[#1d1d1f] mt-0.5 tabular-nums">
                {formatCurrency(summary.byCategory[cat] || 0)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
