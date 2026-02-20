'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Trash2, Pencil, X, Check } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: ExpenseFormData) => void;
}

export default function ExpenseItem({ expense, onDelete, onUpdate }: ExpenseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const color = CATEGORY_COLORS[expense.category];

  function handleUpdate(data: ExpenseFormData) {
    onUpdate(expense.id, data);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-5">
        <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4">Edit Expense</h4>
        <ExpenseForm
          initialData={expense}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group">
      <div className="flex items-center gap-4 p-4">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          {CATEGORY_ICONS[expense.category]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-[#1d1d1f] truncate">{expense.description}</p>
            <span className="text-base font-semibold text-[#1d1d1f] shrink-0 tabular-nums">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {expense.category}
            </span>
            <span className="text-xs text-[#a1a1a6]">{formatDate(expense.date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          {showDeleteConfirm ? (
            <>
              <button
                onClick={() => onDelete(expense.id)}
                className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="Confirm delete"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1.5 rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e5e5ea] transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full text-[#a1a1a6] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-all"
                title="Edit expense"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-full text-[#a1a1a6] hover:bg-red-50 hover:text-red-500 transition-all"
                title="Delete expense"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
