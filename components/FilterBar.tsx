'use client';

import { CATEGORIES, Category } from '@/types/expense';
import { FilterState } from '@/types/expense';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange({ search: '', category: 'All', dateFrom: '', dateTo: '' });
  }

  const hasActiveFilters =
    filters.search || filters.category !== 'All' || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Filter Expenses</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('category', 'All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.category === 'All'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter('category', cat as Category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter('dateFrom', e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter('dateTo', e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 text-right">
        {resultCount} {resultCount === 1 ? 'expense' : 'expenses'} found
      </p>
    </div>
  );
}
