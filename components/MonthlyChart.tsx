'use client';

import { useState } from 'react';
import { SpendingSummary } from '@/types/expense';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import { BarChart2, TrendingUp, AlignLeft } from 'lucide-react';

type ChartType = 'bar' | 'line' | 'structured';

interface MonthlyChartProps {
  summary: SpendingSummary;
}

const CHART_TYPES: { type: ChartType; label: string; Icon: React.ElementType }[] = [
  { type: 'bar', label: 'Bar', Icon: BarChart2 },
  { type: 'line', label: 'Line', Icon: TrendingUp },
  { type: 'structured', label: 'Structured', Icon: AlignLeft },
];

const SVG_W = 400;
const SVG_H = 140;
const PAD = { top: 20, right: 12, bottom: 24, left: 44 };
const CHART_W = SVG_W - PAD.left - PAD.right;
const CHART_H = SVG_H - PAD.top - PAD.bottom;

function yPos(value: number, max: number): number {
  return PAD.top + CHART_H - (value / max) * CHART_H;
}

export default function MonthlyChart({ summary }: MonthlyChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const { monthlyData } = summary;
  const maxAmount = Math.max(...monthlyData.map((m) => m.total), 1);
  const hasData = monthlyData.some((m) => m.total > 0);
  const currentMonth = new Date().toISOString().substring(0, 7);

  // Evenly-spaced x centre for each month
  const slotW = CHART_W / monthlyData.length;
  const xCenter = (i: number) => PAD.left + slotW * i + slotW / 2;

  // Y-axis tick values (4 ticks)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => maxAmount * t);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header + switcher */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-900">Monthly Spending (Last 6 Months)</h3>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {CHART_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartType === type
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          No expense data yet
        </div>
      ) : (
        <>
          {/* ── BAR chart ─────────────────────────────────── */}
          {chartType === 'bar' && (
            <div className="flex items-end gap-3 h-44">
              {monthlyData.map((item) => {
                const heightPercent = (item.total / maxAmount) * 100;
                const isCurrent = item.month === currentMonth;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex items-end" style={{ height: '140px' }}>
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {formatCurrency(item.total)}
                      </div>
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isCurrent ? 'bg-indigo-500' : 'bg-indigo-200 group-hover:bg-indigo-300'
                        }`}
                        style={{ height: `${Math.max(heightPercent, item.total > 0 ? 4 : 0)}%` }}
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

          {/* ── LINE chart ────────────────────────────────── */}
          {chartType === 'line' && (
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{ height: '176px' }}
              aria-label="Monthly spending line chart"
            >
              {/* Grid lines + y-axis labels */}
              {ticks.map((t, i) => {
                const y = yPos(t, maxAmount);
                return (
                  <g key={i}>
                    <line
                      x1={PAD.left} y1={y} x2={SVG_W - PAD.right} y2={y}
                      stroke="#e2e8f0" strokeWidth="1"
                    />
                    <text
                      x={PAD.left - 6} y={y + 4}
                      textAnchor="end" fontSize="9" fill="#94a3b8"
                    >
                      {t === 0 ? '0' : t >= 1000 ? `${(t / 1000).toFixed(1)}k` : Math.round(t)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis baseline */}
              <line
                x1={PAD.left} y1={PAD.top + CHART_H}
                x2={SVG_W - PAD.right} y2={PAD.top + CHART_H}
                stroke="#e2e8f0" strokeWidth="1"
              />

              {/* Filled area under the line */}
              <path
                d={[
                  `M ${xCenter(0)} ${yPos(monthlyData[0].total, maxAmount)}`,
                  ...monthlyData.slice(1).map((item, i) => `L ${xCenter(i + 1)} ${yPos(item.total, maxAmount)}`),
                  `L ${xCenter(monthlyData.length - 1)} ${PAD.top + CHART_H}`,
                  `L ${xCenter(0)} ${PAD.top + CHART_H}`,
                  'Z',
                ].join(' ')}
                fill="url(#lineGrad)"
                opacity="0.4"
              />

              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Line */}
              <polyline
                points={monthlyData.map((item, i) => `${xCenter(i)},${yPos(item.total, maxAmount)}`).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Dots + labels */}
              {monthlyData.map((item, i) => {
                const cx = xCenter(i);
                const cy = yPos(item.total, maxAmount);
                const isCurrent = item.month === currentMonth;
                return (
                  <g key={item.month}>
                    <circle cx={cx} cy={cy} r="5" fill={isCurrent ? '#6366f1' : '#fff'} stroke="#6366f1" strokeWidth="2.5" />
                    <text
                      x={cx}
                      y={PAD.top + CHART_H + 16}
                      textAnchor="middle"
                      fontSize="9"
                      fill={isCurrent ? '#6366f1' : '#94a3b8'}
                      fontWeight={isCurrent ? '600' : '400'}
                    >
                      {formatMonthYear(item.month).split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* ── STRUCTURED BAR chart ──────────────────────── */}
          {chartType === 'structured' && (
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{ height: '176px' }}
              aria-label="Monthly spending structured bar chart"
            >
              {/* Grid lines + y-axis labels */}
              {ticks.map((t, i) => {
                const y = yPos(t, maxAmount);
                return (
                  <g key={i}>
                    <line
                      x1={PAD.left} y1={y} x2={SVG_W - PAD.right} y2={y}
                      stroke={t === 0 ? '#cbd5e1' : '#e2e8f0'}
                      strokeWidth={t === 0 ? 1.5 : 1}
                      strokeDasharray={t === 0 ? undefined : '4 3'}
                    />
                    <text
                      x={PAD.left - 6} y={y + 4}
                      textAnchor="end" fontSize="9" fill="#94a3b8"
                    >
                      {t === 0 ? '0' : t >= 1000 ? `${(t / 1000).toFixed(1)}k` : Math.round(t)}
                    </text>
                  </g>
                );
              })}

              {/* Bars with value labels */}
              {monthlyData.map((item, i) => {
                const cx = xCenter(i);
                const barW = slotW * 0.55;
                const barH = (item.total / maxAmount) * CHART_H;
                const barY = PAD.top + CHART_H - barH;
                const isCurrent = item.month === currentMonth;

                return (
                  <g key={item.month}>
                    {/* Background track */}
                    <rect
                      x={cx - barW / 2}
                      y={PAD.top}
                      width={barW}
                      height={CHART_H}
                      rx="4"
                      fill="#f1f5f9"
                    />
                    {/* Filled bar */}
                    {item.total > 0 && (
                      <rect
                        x={cx - barW / 2}
                        y={barY}
                        width={barW}
                        height={Math.max(barH, 4)}
                        rx="4"
                        fill={isCurrent ? '#6366f1' : '#a5b4fc'}
                      />
                    )}
                    {/* Value label above bar */}
                    {item.total > 0 && (
                      <text
                        x={cx}
                        y={Math.max(barY - 4, PAD.top + 8)}
                        textAnchor="middle"
                        fontSize="8"
                        fill={isCurrent ? '#4338ca' : '#6b7280'}
                        fontWeight="600"
                      >
                        {item.total >= 1000
                          ? `${(item.total / 1000).toFixed(1)}k`
                          : Math.round(item.total)}
                      </text>
                    )}
                    {/* Month label */}
                    <text
                      x={cx}
                      y={PAD.top + CHART_H + 16}
                      textAnchor="middle"
                      fontSize="9"
                      fill={isCurrent ? '#6366f1' : '#94a3b8'}
                      fontWeight={isCurrent ? '600' : '400'}
                    >
                      {formatMonthYear(item.month).split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </>
      )}
    </div>
  );
}
