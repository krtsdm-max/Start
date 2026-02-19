'use client';

import { useCallback } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { generateId, getTodayString } from '@/utils/formatters';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'expense-tracker-expenses';

// Sample data for first-time users
const SAMPLE_EXPENSES: Expense[] = [
  {
    id: generateId(),
    date: getTodayString(),
    amount: 45.50,
    category: 'Food',
    description: 'Grocery shopping at Whole Foods',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    amount: 120.00,
    category: 'Bills',
    description: 'Monthly internet subscription',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    amount: 25.00,
    category: 'Transportation',
    description: 'Uber ride to airport',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    amount: 89.99,
    category: 'Shopping',
    description: 'New headphones from Amazon',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    amount: 15.00,
    category: 'Entertainment',
    description: 'Netflix subscription',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    amount: 32.50,
    category: 'Food',
    description: 'Dinner at Italian restaurant',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    amount: 200.00,
    category: 'Bills',
    description: 'Electric bill',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    amount: 60.00,
    category: 'Entertainment',
    description: 'Concert tickets',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    amount: 18.75,
    category: 'Food',
    description: 'Coffee shop and pastries',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    date: new Date(Date.now() - 35 * 86400000).toISOString().split('T')[0],
    amount: 150.00,
    category: 'Shopping',
    description: 'Clothing from H&M',
    createdAt: new Date().toISOString(),
  },
];

export function useExpenses() {
  const [expenses, setExpenses, isLoaded] = useLocalStorage<Expense[]>(STORAGE_KEY, SAMPLE_EXPENSES);

  const addExpense = useCallback(
    (data: ExpenseFormData): Expense => {
      const newExpense: Expense = {
        id: generateId(),
        date: data.date,
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description.trim(),
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    },
    [setExpenses]
  );

  const updateExpense = useCallback(
    (id: string, data: ExpenseFormData): void => {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                date: data.date,
                amount: parseFloat(data.amount),
                category: data.category,
                description: data.description.trim(),
              }
            : e
        )
      );
    },
    [setExpenses]
  );

  const deleteExpense = useCallback(
    (id: string): void => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses]
  );

  const deleteMultiple = useCallback(
    (ids: string[]): void => {
      const idSet = new Set(ids);
      setExpenses((prev) => prev.filter((e) => !idSet.has(e.id)));
    },
    [setExpenses]
  );

  return { expenses, addExpense, updateExpense, deleteExpense, deleteMultiple, isLoaded };
}
