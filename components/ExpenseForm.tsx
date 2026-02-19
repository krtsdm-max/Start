'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Expense, ExpenseFormData, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { getTodayString } from '@/utils/formatters';
import { CheckCircle, X } from 'lucide-react';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  isInline?: boolean;
}

interface FormErrors {
  date?: string;
  amount?: string;
  description?: string;
}

export default function ExpenseForm({ initialData, onSubmit, onCancel, isInline }: ExpenseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData?.date ?? getTodayString(),
    amount: initialData?.amount?.toString() ?? '',
    category: initialData?.category ?? 'Food',
    description: initialData?.description ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date > getTodayString()) {
      newErrors.date = 'Date cannot be in the future';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (amount > 1_000_000) {
      newErrors.amount = 'Amount is too large';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be under 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    setSubmitted(true);
    if (!initialData && !isInline) {
      setTimeout(() => router.push('/expenses'), 800);
    }
    if (isInline) {
      setFormData({
        date: getTodayString(),
        amount: '',
        category: 'Food',
        description: '',
      });
      setSubmitted(false);
    }
  }

  function handleChange(field: keyof ExpenseFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Date <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          max={getTodayString()}
          className={`w-full px-3 py-2.5 rounded-xl border text-slate-900 text-sm transition-colors ${
            errors.date
              ? 'border-rose-400 bg-rose-50 focus:ring-rose-300'
              : 'border-slate-200 bg-white focus:border-indigo-400 focus:ring-indigo-100'
          } focus:outline-none focus:ring-2`}
        />
        {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Amount (€) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            €
          </span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`w-full pl-7 pr-3 py-2.5 rounded-xl border text-slate-900 text-sm transition-colors ${
              errors.amount
                ? 'border-rose-400 bg-rose-50 focus:ring-rose-300'
                : 'border-slate-200 bg-white focus:border-indigo-400 focus:ring-indigo-100'
            } focus:outline-none focus:ring-2`}
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChange('category', cat)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                formData.category === cat
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What did you spend on?"
          maxLength={200}
          className={`w-full px-3 py-2.5 rounded-xl border text-slate-900 text-sm transition-colors ${
            errors.description
              ? 'border-rose-400 bg-rose-50 focus:ring-rose-300'
              : 'border-slate-200 bg-white focus:border-indigo-400 focus:ring-indigo-100'
          } focus:outline-none focus:ring-2`}
        />
        <div className="mt-1 flex justify-between">
          {errors.description ? (
            <p className="text-xs text-rose-600">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-slate-400 ml-auto">{formData.description.length}/200</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitted && !isInline}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            submitted && !isInline
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm'
          }`}
        >
          {submitted && !isInline ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : initialData ? (
            'Update Expense'
          ) : (
            'Add Expense'
          )}
        </button>
      </div>
    </form>
  );
}
