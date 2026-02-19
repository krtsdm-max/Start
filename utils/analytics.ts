import { format, parseISO, isValid, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Expense, Category, CATEGORIES, SpendingSummary } from '@/types/expense';

export function getSpendingSummary(expenses: Expense[]): SpendingSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const monthlyTotal = expenses
    .filter((e) => {
      try {
        const date = parseISO(e.date);
        return isValid(date) && isWithinInterval(date, { start: monthStart, end: monthEnd });
      } catch {
        return false;
      }
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const byCategory: Record<Category, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Savings: 0,
    Other: 0,
  };

  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const topCategory =
    expenses.length > 0
      ? (CATEGORIES.reduce((a, b) => (byCategory[a] >= byCategory[b] ? a : b)) as Category)
      : null;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Build monthly data for last 6 months
  const monthlyMap: Record<string, number> = {};
  expenses.forEach((e) => {
    try {
      const date = parseISO(e.date);
      if (!isValid(date)) return;
      const key = format(date, 'yyyy-MM');
      monthlyMap[key] = (monthlyMap[key] || 0) + e.amount;
    } catch {
      // skip invalid dates
    }
  });

  // Get last 6 months sorted
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(format(d, 'yyyy-MM'));
  }

  const monthlyData = months.map((m) => ({
    month: m,
    total: monthlyMap[m] || 0,
  }));

  return { total, monthlyTotal, topCategory, byCategory, recentExpenses, monthlyData };
}

export function filterExpenses(
  expenses: Expense[],
  search: string,
  category: Category | 'All',
  dateFrom: string,
  dateTo: string
): Expense[] {
  return expenses.filter((e) => {
    const matchesSearch =
      !search ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'All' || e.category === category;

    const matchesDateFrom = !dateFrom || e.date >= dateFrom;
    const matchesDateTo = !dateTo || e.date <= dateTo;

    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
  });
}
