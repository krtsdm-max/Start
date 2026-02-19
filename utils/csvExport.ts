import { Expense } from '@/types/expense';
import { formatDate } from './formatters';

export function exportToCSV(expenses: Expense[], filename = 'expenses.csv'): void {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.amount.toFixed(2),
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
