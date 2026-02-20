'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseFormData } from '@/types/expense';
import ExpenseForm from '@/components/ExpenseForm';

export default function NewExpensePage() {
  const { addExpense } = useExpenses();

  function handleSubmit(data: ExpenseFormData) {
    addExpense(data);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/expenses"
          className="p-2 rounded-full text-[#6e6e73] hover:bg-black/[0.06] hover:text-[#1d1d1f] transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Add Expense</h1>
          <p className="text-[13px] text-[#6e6e73]">Record a new expense</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
        <ExpenseForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
