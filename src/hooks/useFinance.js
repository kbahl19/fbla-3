import { useEffect, useMemo, useRef, useState } from 'react';
import { validateBudget, validateItemCost } from '../utils/validators';

// Each expense gets a unique ID from timestamp + random hex suffix to avoid
// collisions if two expenses are created in the same millisecond.
const createExpense = (category, item, cost) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  category,
  item,
  cost,
  timestamp: new Date().toISOString()
});

export default function useFinance(initialBudget) {
  const initialRef = useRef({
    wallet: initialBudget || 0,
    budget: initialBudget || 0,
    totalSpent: 0,
    preventiveSpending: 0,
    emergencySpending: 0,
    currentWeekSpending: 0,
    weeklySpending: [],
    expenses: []
  });

  const [financeState, setFinanceState] = useState(() => ({ ...initialRef.current }));

  useEffect(() => {
    if (!initialBudget) return;
    const next = {
      wallet: initialBudget,
      budget: initialBudget,
      totalSpent: 0,
      preventiveSpending: 0,
      emergencySpending: 0,
      currentWeekSpending: 0,
      weeklySpending: [],
      expenses: []
    };
    initialRef.current = next;
    setFinanceState(next);
  }, [initialBudget]);

  // isPreventive: true = routine care (food, toys, cleaning), false = emergency/reactive
  const spend = (amount, category, item, isPreventive = true) => {
    const validation = validateItemCost(amount, financeState.wallet);
    if (!validation.valid) return validation;

    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet - amount,
      totalSpent: prev.totalSpent + amount,
      preventiveSpending: isPreventive ? prev.preventiveSpending + amount : prev.preventiveSpending,
      emergencySpending:  isPreventive ? prev.emergencySpending  : prev.emergencySpending + amount,
      currentWeekSpending: prev.currentWeekSpending + amount,
      expenses: [createExpense(category, item, amount), ...prev.expenses]
    }));

    return { valid: true, error: null };
  };

  const earn = (amount, source) => {
    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet + amount,
      expenses: [createExpense('income', source, -Math.abs(amount)), ...prev.expenses]
    }));
  };

  // Bills always charge even if wallet goes negative (models real debt)
  const chargeBill = (amount, item) => {
    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet - amount,
      totalSpent: prev.totalSpent + amount,
      expenses: [createExpense('bills', item, amount), ...prev.expenses]
    }));
  };

  // Snapshot the week's spending total and reset the running counter
  const recordWeekEnd = () => {
    setFinanceState((prev) => ({
      ...prev,
      weeklySpending: [...prev.weeklySpending, prev.currentWeekSpending],
      currentWeekSpending: 0
    }));
  };

  // Groups the flat expense list by category and sums each group's total.
  // Returns an array of { category, items, subtotal } objects for the report UI.
  const getExpenseReport = () => {
    const grouped = financeState.expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { category: expense.category, items: [], subtotal: 0 };
      }
      acc[expense.category].items.push(expense);
      acc[expense.category].subtotal += expense.cost;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const resetFinance = (newBudget) => {
    const nextBudget = typeof newBudget === 'number' ? newBudget : initialRef.current.budget;
    const validation = validateBudget(nextBudget);
    if (!validation.valid) return;
    const next = {
      wallet: nextBudget,
      budget: nextBudget,
      totalSpent: 0,
      preventiveSpending: 0,
      emergencySpending: 0,
      currentWeekSpending: 0,
      weeklySpending: [],
      expenses: []
    };
    initialRef.current = next;
    setFinanceState(next);
  };

  const financeMemo = useMemo(() => financeState, [financeState]);

  return { financeState: financeMemo, spend, earn, chargeBill, recordWeekEnd, getExpenseReport, resetFinance };
}
