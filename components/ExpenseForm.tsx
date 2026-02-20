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
        <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          max={getTodayString()}
          className={`w-full px-3.5 py-2.5 rounded-xl text-[#1d1d1f] text-sm transition-all ${
            errors.date
              ? 'bg-red-50 border border-red-300 focus:ring-red-200'
              : 'bg-[#f5f5f7] border border-transparent focus:border-black/20 focus:ring-black/10'
          } focus:outline-none focus:ring-2`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
          Amount (€) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e6e73] text-sm font-medium">
            €
          </span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-[#1d1d1f] text-sm transition-all ${
              errors.amount
                ? 'bg-red-50 border border-red-300 focus:ring-red-200'
                : 'bg-[#f5f5f7] border border-transparent focus:border-black/20 focus:ring-black/10'
            } focus:outline-none focus:ring-2`}
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChange('category', cat)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                formData.category === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-black/[0.08] text-[#6e6e73] hover:border-black/20 hover:text-[#1d1d1f]'
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
        <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What did you spend on?"
          maxLength={200}
          className={`w-full px-3.5 py-2.5 rounded-xl text-[#1d1d1f] text-sm transition-all ${
            errors.description
              ? 'bg-red-50 border border-red-300 focus:ring-red-200'
              : 'bg-[#f5f5f7] border border-transparent focus:border-black/20 focus:ring-black/10'
          } focus:outline-none focus:ring-2`}
        />
        <div className="mt-1 flex justify-between">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-[#a1a1a6] ml-auto">{formData.description.length}/200</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-sm font-medium hover:bg-[#e5e5ea] transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitted && !isInline}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            submitted && !isInline
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
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
