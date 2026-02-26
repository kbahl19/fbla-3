/**
 * Financial overview panel with wallet, expenses, and navigation.
 * Props: financeState, onNavigateMinigame, onNavigateReport
 */
import { formatCurrency } from '../utils/helpers';

const CATEGORY_COLORS = {
  food: 'text-[#ffd93d]',
  toys: 'text-[#4d96ff]',
  vet: 'text-[#ff6b6b]',
  cleaning: 'text-[#6bcb77]',
  tricks: 'text-[#c77dff]',
  income: 'text-[#6bcb77]',
  bills: 'text-[#ff6b6b]'
};

export default function FinancePanel({ financeState, onNavigateMinigame, onNavigateReport }) {
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
        <div className={`mt-2 font-heading text-3xl ${financeState.wallet < 0 ? 'text-[#ff6b6b]' : 'text-[#6bcb77]'}`}>
          {formatCurrency(financeState.wallet)}
        </div>
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
