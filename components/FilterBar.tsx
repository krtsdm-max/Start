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
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-[#a1a1a6]" />
        <span className="text-[13px] font-semibold text-[#1d1d1f]">Filter</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1a6]" />
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#a1a1a6] hover:text-[#1d1d1f] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('category', 'All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            filters.category === 'All'
              ? 'bg-[#1d1d1f] text-white'
              : 'bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e5e5ea]'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter('category', cat as Category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              filters.category === cat
                ? 'bg-[#1d1d1f] text-white'
                : 'bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e5e5ea]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-[11px] text-[#6e6e73] mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter('dateFrom', e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f5f5f7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[11px] text-[#6e6e73] mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter('dateTo', e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f5f5f7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      <p className="text-[11px] text-[#a1a1a6] text-right">
        {resultCount} {resultCount === 1 ? 'expense' : 'expenses'}
      </p>
    </div>
  );
}
