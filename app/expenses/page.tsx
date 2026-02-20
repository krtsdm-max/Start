'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Download, Trash2, Receipt } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { filterExpenses } from '@/utils/analytics';
import { exportToCSV } from '@/utils/csvExport';
import { FilterState, ExpenseFormData } from '@/types/expense';
import FilterBar from '@/components/FilterBar';
import ExpenseItem from '@/components/ExpenseItem';
import { formatCurrency } from '@/utils/formatters';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'All',
  dateFrom: '',
  dateTo: '',
};

export default function ExpensesPage() {
  const { expenses, deleteExpense, updateExpense, deleteMultiple, isLoaded } = useExpenses();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>(
    'date-desc'
  );

  const filtered = useMemo(() => {
    const results = filterExpenses(
      expenses,
      filters.search,
      filters.category,
      filters.dateFrom,
      filters.dateTo
    );

    return results.sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc':
          return b.date.localeCompare(a.date);
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [expenses, filters, sortOrder]);

  const filteredTotal = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((e) => e.id)));
    }
  }

  function handleDeleteSelected() {
    deleteMultiple(Array.from(selectedIds));
    setSelectedIds(new Set());
  }

  function handleExport() {
    const toExport = selectedIds.size > 0 ? filtered.filter((e) => selectedIds.has(e.id)) : filtered;
    exportToCSV(toExport);
  }

  function handleUpdate(id: string, data: ExpenseFormData) {
    updateExpense(id, data);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-black/10 border-t-[#1d1d1f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Expenses</h1>
          <p className="text-[15px] text-[#6e6e73] mt-0.5">
            {expenses.length} total · {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))} spent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1d1d1f] bg-white rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all duration-200"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all duration-200 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />
        </div>

        {/* Main list */}
        <div className="lg:col-span-3 space-y-3">
          {/* Sort + bulk actions bar */}
          <div className="flex items-center justify-between gap-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 py-2.5">
            <div className="flex items-center gap-3">
              {filtered.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-[#1d1d1f]"
                  />
                  <span className="text-xs text-[#6e6e73]">
                    {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
                  </span>
                </label>
              )}
              {selectedIds.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete selected
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a1a1a6] hidden sm:inline">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="text-xs text-[#1d1d1f] bg-[#f5f5f7] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/10 border-none"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </div>
          </div>

          {/* Results summary */}
          {filtered.length > 0 && (
            <div className="text-xs text-[#6e6e73] px-1">
              {filtered.length} results · Total:{' '}
              <span className="font-semibold text-[#1d1d1f]">{formatCurrency(filteredTotal)}</span>
            </div>
          )}

          {/* Expense list */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mb-4">
                <Receipt className="w-7 h-7 text-[#a1a1a6]" />
              </div>
              {expenses.length === 0 ? (
                <>
                  <p className="text-[#1d1d1f] font-medium">No expenses yet</p>
                  <p className="text-[#a1a1a6] text-sm mt-1">Add your first expense to get started</p>
                  <Link
                    href="/expenses/new"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all duration-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add expense
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-[#1d1d1f] font-medium">No matching expenses</p>
                  <p className="text-[#a1a1a6] text-sm mt-1">Try adjusting your filters</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-3 text-sm text-[#6e6e73] hover:text-[#1d1d1f] font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((expense) => (
                <div key={expense.id} className="flex items-start gap-2">
                  <div className="pt-4 pl-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(expense.id)}
                      onChange={() => toggleSelect(expense.id)}
                      className="w-4 h-4 rounded accent-[#1d1d1f] cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ExpenseItem
                      expense={expense}
                      onDelete={deleteExpense}
                      onUpdate={handleUpdate}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
