import { useEffect, useMemo, useRef, useState } from 'react';
import { validateBudget, validateItemCost, validateSavingsGoal, validateStatChange } from '../utils/validators';

const createExpense = (category, item, cost) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  category,
  item,
  cost,
  timestamp: new Date().toISOString()
});

/**
 * Manages wallet balance, spending, savings goals, and expense tracking.
 * @param {number} initialBudget
 * @returns {{ financeState: object, spend: Function, earn: Function, setSavingsGoal: Function, getExpenseReport: Function, resetFinance: Function }}
 */
export default function useFinance(initialBudget) {
  const initialRef = useRef({
    wallet: initialBudget || 0,
    budget: initialBudget || 0,
    totalSpent: 0,
    savingsGoal: null,
    savingsGoalName: null,
    expenses: []
  });

  const [financeState, setFinanceState] = useState(() => ({ ...initialRef.current }));

  useEffect(() => {
    if (!initialBudget) return;
    const next = {
      wallet: initialBudget,
      budget: initialBudget,
      totalSpent: 0,
      savingsGoal: null,
      savingsGoalName: null,
      expenses: []
    };
    initialRef.current = next;
    setFinanceState(next);
  }, [initialBudget]);

  /**
   * Deducts spending from the wallet and records an expense.
   * @param {number} amount
   * @param {string} category
   * @param {string} item
   * @returns {{ valid: boolean, error: string|null }}
   */
  const spend = (amount, category, item) => {
    const validation = validateItemCost(amount, financeState.wallet);
    if (!validation.valid) return validation;

    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet - amount,
      totalSpent: prev.totalSpent + amount,
      expenses: [createExpense(category, item, amount), ...prev.expenses]
    }));

    return { valid: true, error: null };
  };

  /**
   * Adds earnings to the wallet and records income.
   * @param {number} amount
   * @param {string} source
   * @returns {void}
   */
  const earn = (amount, source) => {
    const validation = validateStatChange(0, 0);
    if (!validation.valid) return;
    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet + amount,
      expenses: [createExpense('income', source, -Math.abs(amount)), ...prev.expenses]
    }));
  };

  /**
   * Auto-charges a recurring bill regardless of wallet balance (allows debt).
   * @param {number} amount
   * @param {string} item
   * @returns {void}
   */
  const chargeBill = (amount, item) => {
    setFinanceState((prev) => ({
      ...prev,
      wallet: prev.wallet - amount,
      totalSpent: prev.totalSpent + amount,
      expenses: [createExpense('bills', item, amount), ...prev.expenses]
    }));
  };

  /**
   * Sets the savings goal and label.
   * @param {number} amount
   * @param {string} name
   * @returns {{ valid: boolean, error: string|null }}
   */
  const setSavingsGoal = (amount, name) => {
    const validation = validateSavingsGoal(amount, financeState.budget);
    if (!validation.valid) return validation;

    setFinanceState((prev) => ({
      ...prev,
      savingsGoal: amount,
      savingsGoalName: name || 'Savings Goal'
    }));

    return { valid: true, error: null };
  };

  /**
   * Groups expenses by category with subtotals.
   * @returns {{ category: string, items: object[], subtotal: number }[]}
   */
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

  /**
   * Resets finance state with a new budget.
   * @param {number} newBudget
   * @returns {void}
   */
  const resetFinance = (newBudget) => {
    const nextBudget = typeof newBudget === 'number' ? newBudget : initialRef.current.budget;
    const validation = validateBudget(nextBudget);
    if (!validation.valid) return;
    const next = {
      wallet: nextBudget,
      budget: nextBudget,
      totalSpent: 0,
      savingsGoal: null,
      savingsGoalName: null,
      expenses: []
    };
    initialRef.current = next;
    setFinanceState(next);
  };

  const financeMemo = useMemo(() => financeState, [financeState]);

  return {
    financeState: financeMemo,
    spend,
    earn,
    chargeBill,
    setSavingsGoal,
    getExpenseReport,
    resetFinance
  };
}
