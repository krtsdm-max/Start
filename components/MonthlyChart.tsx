'use client';

import { SpendingSummary } from '@/types/expense';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';

interface MonthlyChartProps {
  summary: SpendingSummary;
}

export default function MonthlyChart({ summary }: MonthlyChartProps) {
  const { monthlyData } = summary;
  const maxAmount = Math.max(...monthlyData.map((m) => m.total), 1);

  const hasData = monthlyData.some((m) => m.total > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-base font-semibold text-slate-900 mb-5">Monthly Spending (Last 6 Months)</h3>
      {!hasData ? (
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          No expense data yet
        </div>
      ) : (
        <div className="flex items-end gap-3 h-44">
          {monthlyData.map((item) => {
            const heightPercent = (item.total / maxAmount) * 100;
            const isCurrentMonth = item.month === new Date().toISOString().substring(0, 7);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex items-end" style={{ height: '140px' }}>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatCurrency(item.total)}
                  </div>
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isCurrentMonth ? 'bg-indigo-500' : 'bg-indigo-200 group-hover:bg-indigo-300'
                    }`}
                    style={{
                      height: `${Math.max(heightPercent, item.total > 0 ? 4 : 0)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500 text-center leading-tight">
                  {formatMonthYear(item.month).split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
