'use client';

import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseFormData } from '@/types/expense';
import ExpenseForm from '@/components/ExpenseForm';

export default function NewExpensePage() {
  const { addExpense } = useExpenses();

  function handleSubmit(data: ExpenseFormData) {
    addExpense(data);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/expenses"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Expense</h1>
          <p className="text-sm text-slate-500">Record a new expense</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Expense Details</h2>
        </div>
        <ExpenseForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
