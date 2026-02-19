'use client';

import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency } from '@/utils/formatters';
import { SpendingSummary } from '@/types/expense';

interface CategoryChartProps {
  summary: SpendingSummary;
}

export default function CategoryChart({ summary }: CategoryChartProps) {
  const maxAmount = Math.max(...CATEGORIES.map((c) => summary.byCategory[c] || 0));
  const total = Object.values(summary.byCategory).reduce((a, b) => a + b, 0);

  const categoriesWithData = CATEGORIES.filter((c) => summary.byCategory[c] > 0).sort(
    (a, b) => (summary.byCategory[b] || 0) - (summary.byCategory[a] || 0)
  );

  if (categoriesWithData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Spending by Category</h3>
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          No expense data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-base font-semibold text-slate-900 mb-5">Spending by Category</h3>
      <div className="space-y-3">
        {categoriesWithData.map((category) => {
          const amount = summary.byCategory[category] || 0;
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          const color = CATEGORY_COLORS[category];

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-sm">
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="font-medium text-slate-700">{category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">{percentage.toFixed(1)}%</span>
                  <span className="font-semibold text-slate-900 w-20 text-right">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
