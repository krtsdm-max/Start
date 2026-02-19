'use client';

import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag, Receipt } from 'lucide-react';
import { SpendingSummary } from '@/types/expense';
import { formatCurrency } from '@/utils/formatters';
import { CATEGORY_ICONS } from '@/types/expense';

interface SummaryCardsProps {
  summary: SpendingSummary;
  expenseCount: number;
}

export default function SummaryCards({ summary, expenseCount }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Spending',
      value: formatCurrency(summary.total),
      subtitle: `${expenseCount} expenses`,
      icon: DollarSign,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      subtitle: 'Current month',
      icon: Calendar,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Top Category',
      value: summary.topCategory
        ? `${CATEGORY_ICONS[summary.topCategory]} ${summary.topCategory}`
        : 'None',
      subtitle: summary.topCategory
        ? formatCurrency(summary.byCategory[summary.topCategory])
        : 'No data',
      icon: Tag,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Avg. Per Expense',
      value: expenseCount > 0 ? formatCurrency(summary.total / expenseCount) : '$0.00',
      subtitle: 'Average amount',
      icon: Receipt,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 truncate">{card.value}</p>
              <p className="mt-1 text-xs text-slate-400">{card.subtitle}</p>
            </div>
            <div className={`${card.lightColor} p-2.5 rounded-xl`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
