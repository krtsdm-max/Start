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
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-4">Spending by Category</h3>
        <div className="flex items-center justify-center h-40 text-[#a1a1a6] text-sm">
          No expense data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-5">Spending by Category</h3>
      <div className="space-y-4">
        {categoriesWithData.map((category) => {
          const amount = summary.byCategory[category] || 0;
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          const color = CATEGORY_COLORS[category];

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="font-medium text-[#1d1d1f]">{category}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#a1a1a6] text-xs">{percentage.toFixed(1)}%</span>
                  <span className="font-semibold text-[#1d1d1f] w-20 text-right tabular-nums">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
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
