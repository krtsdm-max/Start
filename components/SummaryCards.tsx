'use client';

import { DollarSign, Calendar, Tag, Receipt } from 'lucide-react';
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
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      subtitle: 'Current month',
      icon: Calendar,
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
    },
    {
      title: 'Avg. Per Expense',
      value: expenseCount > 0 ? formatCurrency(summary.total / expenseCount) : '$0.00',
      subtitle: 'Average amount',
      icon: Receipt,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
              <card.icon className="w-4 h-4 text-[#6e6e73]" />
            </div>
            <span className="text-xs font-medium text-[#a1a1a6]">{card.subtitle}</span>
          </div>
          <p className="text-[13px] text-[#6e6e73]">{card.title}</p>
          <p className="mt-0.5 text-2xl font-semibold text-[#1d1d1f] truncate tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
