/**
 * Financial overview panel with wallet, budget, savings, and expenses.
 * Props: financeState, onSetSavingsGoal, onNavigateMinigame, onNavigateReport
 */
import { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { validateSavingsGoal } from '../utils/validators';

const CATEGORY_COLORS = {
  food: 'text-[#ffd93d]',
  toys: 'text-[#4d96ff]',
  vet: 'text-[#ff6b6b]',
  cleaning: 'text-[#6bcb77]',
  tricks: 'text-[#c77dff]',
  income: 'text-[#6bcb77]',
  bills: 'text-[#ff6b6b]'
};

export default function FinancePanel({
  financeState,
  onSetSavingsGoal,
  onNavigateMinigame,
  onNavigateReport
}) {
  const [goalAmount, setGoalAmount] = useState('');
  const [goalName, setGoalName] = useState('');
  const [error, setError] = useState(null);
  const parsedGoalAmount = Number(goalAmount);
  const liveGoalValidation = goalAmount === '' ? null : validateSavingsGoal(parsedGoalAmount, financeState.budget);

  const budgetPercent = financeState.budget
    ? Math.min(100, Math.round((financeState.wallet / financeState.budget) * 100))
    : 0;

  const handleGoal = () => {
    const amount = Number(goalAmount);
    const validation = validateSavingsGoal(amount, financeState.budget);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const result = onSetSavingsGoal(amount, goalName.trim());
    if (result?.valid) {
      setGoalAmount('');
      setGoalName('');
      setError(null);
    } else {
      setError(result?.error || 'Unable to set goal.');
    }
  };

  const goalProgress = financeState.savingsGoal
    ? Math.min(100, Math.round((financeState.wallet / financeState.savingsGoal) * 100))
    : 0;
  const goalRemaining = financeState.savingsGoal
    ? Math.max(0, financeState.savingsGoal - financeState.wallet)
    : 0;

  const recentExpenses = financeState.expenses.slice(0, 8);
  const groupedRecent = recentExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) acc[expense.category] = [];
    acc[expense.category].push(expense);
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1828]/80 p-6 shadow-xl">
      <h3 className="font-heading text-xl text-[#fffffe]">Finance Dashboard</h3>

      <div className="mt-4 rounded-2xl bg-[#252338] p-4 text-center">
        <div className="text-xs uppercase tracking-wide text-[#a7a9be]">Wallet Balance</div>
        <div className="mt-2 font-heading text-3xl text-[#6bcb77]">
          {formatCurrency(financeState.wallet)}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[#a7a9be]">
          <span>Budget Remaining</span>
          <span>{budgetPercent}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-[#252338]">
          <div className="h-3 rounded-full bg-[#4d96ff]" style={{ width: `${budgetPercent}%` }}></div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-4">
        <div className="text-xs uppercase tracking-wide text-[#a7a9be]">Savings Goal</div>
        {!financeState.savingsGoal && (
          <div className="mt-3 grid gap-3">
            <input
              value={goalName}
              onChange={(event) => setGoalName(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2 text-sm text-white outline-none focus:border-[#4d96ff]"
              placeholder="Goal name (optional)"
            />
            <input
              value={goalAmount}
              onChange={(event) => {
                setGoalAmount(event.target.value);
                if (error) setError(null);
              }}
              className="rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2 text-sm text-white outline-none focus:border-[#4d96ff]"
              placeholder="Goal amount"
              type="number"
              min={1}
              max={financeState.budget}
              step={1}
            />
            <p className={`text-xs ${liveGoalValidation && !liveGoalValidation.valid ? 'text-[#ff6b6b]' : 'text-[#a7a9be]'}`}>
              {goalAmount === ''
                ? `Enter a whole-dollar goal from $1 to ${financeState.budget}. Semantic validation prevents goals above the starting budget.`
                : liveGoalValidation?.valid
                  ? 'Goal amount looks valid.'
                  : liveGoalValidation?.error}
            </p>
            {error && <p className="text-xs text-[#ff6b6b]">{error}</p>}
            <button
              type="button"
              onClick={handleGoal}
              className="rounded-xl bg-[#ffd93d] px-4 py-2 font-heading text-[#1a1828] transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Set Goal
            </button>
          </div>
        )}
        {financeState.savingsGoal && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-white">
              <span>{financeState.savingsGoalName || 'Savings Goal'}</span>
              <span>{formatCurrency(financeState.savingsGoal)}</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-[#1a1828]">
              <div className="h-3 rounded-full bg-[#6bcb77]" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <p className="mt-2 text-xs text-[#a7a9be]">
              {goalRemaining > 0
                ? `${formatCurrency(goalRemaining)} left to reach the goal.`
                : 'Goal achieved!'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-[#a7a9be]">Recent Expenses</span>
          <span className="text-xs text-[#a7a9be]">Last 8</span>
        </div>
        <div className="mt-3 max-h-48 space-y-3 overflow-y-auto">
          {recentExpenses.length === 0 && <p className="text-xs text-[#a7a9be]">No expenses yet.</p>}
          {Object.entries(groupedRecent).map(([category, items]) => (
            <div key={category} className="rounded-xl border border-white/10 bg-[#252338] px-3 py-2">
              <p className={`text-xs uppercase tracking-wide ${CATEGORY_COLORS[category] || 'text-[#a7a9be]'}`}>
                {category}
              </p>
              <div className="mt-2 space-y-2">
                {items.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between text-sm">
                    <span className="text-white">{expense.item}</span>
                    <span className="text-white">
                      {expense.cost < 0 ? '+' : '-'}{formatCurrency(Math.abs(expense.cost))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onNavigateMinigame}
          className="rounded-2xl bg-[#4d96ff] px-4 py-3 font-heading text-white transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Earn Coins (Minigames)
        </button>
        <button
          type="button"
          onClick={onNavigateReport}
          className="rounded-2xl bg-[#ffd93d] px-4 py-3 font-heading text-[#1a1828] transition hover:scale-[1.01] active:scale-[0.99]"
        >
          End Session and Report
        </button>
      </div>
    </div>
  );
}
