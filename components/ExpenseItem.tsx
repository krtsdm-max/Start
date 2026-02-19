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
      <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Edit Expense</h4>
        <ExpenseForm
          initialData={expense}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
      <div className="flex items-center gap-4 p-4">
        {/* Category dot */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          {CATEGORY_ICONS[expense.category]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-900 truncate">{expense.description}</p>
            <span className="text-base font-bold text-slate-900 shrink-0">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {expense.category}
            </span>
            <span className="text-xs text-slate-400">{formatDate(expense.date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {showDeleteConfirm ? (
            <>
              <button
                onClick={() => onDelete(expense.id)}
                className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                title="Confirm delete"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                title="Edit expense"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
