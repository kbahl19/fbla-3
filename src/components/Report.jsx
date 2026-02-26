import { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { ScoringEngine } from '../utils/scoringEngine';

export default function Report({ petState, financeState, weeksPlayed, onSaveLeaderboard, onPlayAgain, onLeaderboard }) {
  const [saved, setSaved] = useState(false);

  const scoring = useMemo(() => {
    // Always include a final live snapshot so there's at least one data point
    const snapshots = [
      ...(petState.dailySnapshots || []),
      { happiness: petState.happiness, health: petState.health, energy: petState.energy }
    ];
    const engine = new ScoringEngine({
      dailySnapshots:     snapshots,
      weeklySpending:     financeState.weeklySpending || [],
      preventiveSpending: financeState.preventiveSpending || 0,
      emergencySpending:  financeState.emergencySpending  || 0
    });
    return engine.calculate_final_score();
  }, [petState.dailySnapshots, petState.happiness, petState.health, petState.energy, financeState.weeklySpending, financeState.preventiveSpending, financeState.emergencySpending]);

  const expenseBreakdown = useMemo(() => {
    const totals = financeState.expenses.reduce((acc, expense) => {
      if (expense.cost <= 0) return acc;
      acc[expense.category] = (acc[expense.category] || 0) + expense.cost;
      return acc;
    }, {});
    const total = Object.values(totals).reduce((sum, v) => sum + v, 0);
    const rows = Object.entries(totals).map(([category, value]) => ({
      category,
      value,
      percent: total ? Math.round((value / total) * 100) : 0
    }));
    return { total, rows };
  }, [financeState.expenses]);

  const incomeBreakdown = useMemo(() => {
    return financeState.expenses
      .filter((e) => e.cost < 0)
      .reduce((sum, e) => sum + Math.abs(e.cost), 0);
  }, [financeState.expenses]);

  const reportAnalytics = useMemo(() => {
    const actionCounts = petState.actionLog.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    }, {});

    const biggestExpense = financeState.expenses
      .filter((e) => e.cost > 0)
      .reduce((max, current) => (current.cost > (max?.cost || 0) ? current : max), null);

    const totalBills = financeState.expenses
      .filter((e) => e.category === 'bills')
      .reduce((sum, e) => sum + e.cost, 0);

    const totalIncome = financeState.expenses
      .filter((e) => e.category === 'income')
      .reduce((sum, e) => sum + Math.abs(e.cost), 0);

    const actionRows = [
      ['Feed', actionCounts.feed || 0],
      ['Play', actionCounts.play || 0],
      ['Rest', actionCounts.rest || 0],
      ['Clean', actionCounts.clean || 0],
      ['Health Check', actionCounts.vet || 0],
      ['Teach Trick', actionCounts.trick || 0]
    ];

    const insights = [];
    if ((actionCounts.vet || 0) === 0) insights.push('No health checks were recorded. Vet visits usually protect salary income.');
    if ((actionCounts.clean || 0) < 2) insights.push('Cleaning was used rarely. Low hygiene can reduce health over time.');
    if (financeState.wallet < 0) insights.push('The session ended in debt. Spending pace exceeded salary and minigame income.');
    if ((petState.mood === 'happy' || petState.mood === 'energetic') && petState.health >= 70) {
      insights.push(`Final pet reaction was ${petState.mood} with healthy stats, showing strong care balance.`);
    }
    if (insights.length === 0) insights.push('Care and spending stayed balanced overall, with no major risk pattern detected.');

    return { actionRows, biggestExpense, totalBills, totalIncome, insights };
  }, [petState.actionLog, petState.mood, petState.health, financeState.expenses, financeState.wallet]);

  const handleSave = () => {
    if (saved) return;
    const entry = {
      ownerName: petState.ownerName,
      petName: petState.name,
      petType: petState.type,
      finalScore: scoring.final,
      classification: scoring.classification.label,
      wallet: financeState.wallet,
      totalSpent: financeState.totalSpent,
      weeksPlayed,
      stage: petState.stage,
      date: new Date().toLocaleDateString()
    };
    onSaveLeaderboard(entry);
    setSaved(true);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Final Report</h2>
            <p className="text-sm text-[#a7a9be]">
              {petState.ownerName} and {petState.name} | {weeksPlayed} weeks played
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPlayAgain}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onLeaderboard}
              className="rounded-full border border-[#ffd93d]/40 px-4 py-2 text-xs uppercase tracking-wide text-[#ffd93d] transition hover:border-[#ffd93d]"
            >
              Leaderboard
            </button>
          </div>
        </div>

        {petState.healthBottomedOut && (
          <div className="mt-6 rounded-2xl border border-[#ff6b6b] bg-[#ff6b6b]/10 px-4 py-3 text-sm text-[#ff6b6b]">
            Your pet's health critically dropped (below 20) at some point. That cost you salary income!
          </div>
        )}

        {/* Final Score hero */}
        <div className="mt-6 rounded-2xl border border-[#ffd93d]/40 bg-[#ffd93d]/10 p-6 text-center">
          <p className="text-sm uppercase tracking-wide text-[#a7a9be]">Final Score</p>
          <p className="mt-2 font-heading text-7xl text-[#ffd93d]">{scoring.final}</p>
          <p className="mt-1 font-heading text-xl" style={{ color: scoring.classification.color }}>
            {scoring.classification.label}
          </p>

          {/* Component breakdown */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Wellbeing',    value: scoring.wellbeing,   weight: '40%', color: '#6bcb77', desc: 'happiness · health · energy' },
              { label: 'Financial',    value: scoring.financial,   weight: '30%', color: '#4d96ff', desc: 'preventive vs emergency' },
              { label: 'Consistency',  value: scoring.consistency, weight: '20%', color: '#c77dff', desc: 'steady week-to-week care' },
              { label: 'Volatility',   value: scoring.volatility,  weight: '−10%', color: '#ff6b6b', desc: 'spending spike penalty' }
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-white/10 bg-[#1a1828] p-3">
                <p className="text-xs text-[#a7a9be]">{c.label} <span className="text-white/40">{c.weight}</span></p>
                <p className="mt-1 font-heading text-2xl" style={{ color: c.color }}>{c.value}</p>
                <p className="mt-1 text-[10px] text-[#6b7280]">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#a7a9be]">
            0.4 × Wellbeing + 0.3 × Financial + 0.2 × Consistency − 0.1 × Volatility
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Care summary */}
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Pet Care Summary</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#a7a9be]">
              <div className="flex justify-between">
                <span>Wellbeing Score</span>
                <span className="font-heading text-[#6bcb77]">{scoring.wellbeing}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Final Stage</span>
                <span className="text-white capitalize">{petState.stage}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Mood</span>
                <span className="text-white capitalize">{petState.mood}</span>
              </div>
              <div className="flex justify-between">
                <span>Weeks Tracked</span>
                <span className="text-white">{petState.dailySnapshots?.length ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tricks Learned</span>
                <span className="text-white">{petState.tricks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Minigames Played</span>
                <span className="text-white">{petState.minigamesPlayed}</span>
              </div>
            </div>
          </div>

          {/* Financial summary */}
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Financial Summary</h3>
            <table className="mt-4 w-full text-sm">
              <tbody className="text-[#a7a9be]">
                <tr className="border-b border-white/10">
                  <td className="py-2">Starting Budget</td>
                  <td className="py-2 text-right text-white">{formatCurrency(financeState.budget)}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Total Income Earned</td>
                  <td className="py-2 text-right text-[#6bcb77]">+{formatCurrency(incomeBreakdown)}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Total Spent on Care</td>
                  <td className="py-2 text-right text-[#ff6b6b]">-{formatCurrency(financeState.totalSpent)}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 font-semibold text-white">Final Wallet Balance</td>
                  <td className={`py-2 text-right font-semibold ${financeState.wallet >= 0 ? 'text-[#6bcb77]' : 'text-[#ff6b6b]'}`}>
                    {formatCurrency(financeState.wallet)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Preventive Spending</td>
                  <td className="py-2 text-right text-[#6bcb77]">{formatCurrency(financeState.preventiveSpending || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2">Emergency Spending</td>
                  <td className="py-2 text-right text-[#ff6b6b]">{formatCurrency(financeState.emergencySpending || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Care Activity Analysis</h3>
            <div className="mt-4 grid gap-2 text-sm text-[#a7a9be]">
              {reportAnalytics.actionRows.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-[#1a1828] px-3 py-2">
                  <span>{label}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Decision Insights</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#a7a9be]">
              <div className="rounded-lg bg-[#1a1828] px-3 py-2">
                Biggest expense:{' '}
                <span className="text-white">
                  {reportAnalytics.biggestExpense
                    ? `${reportAnalytics.biggestExpense.item} (${formatCurrency(reportAnalytics.biggestExpense.cost)})`
                    : 'None'}
                </span>
              </div>
              <div className="rounded-lg bg-[#1a1828] px-3 py-2">
                Total weekly bills: <span className="text-white">{formatCurrency(reportAnalytics.totalBills)}</span>
              </div>
              <div className="rounded-lg bg-[#1a1828] px-3 py-2">
                Total salary + minigame income: <span className="text-white">{formatCurrency(reportAnalytics.totalIncome)}</span>
              </div>
              {reportAnalytics.insights.map((insight) => (
                <p key={insight} className="rounded-lg border border-white/10 bg-[#1a1828] px-3 py-2">
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-5">
          <h3 className="font-heading text-xl text-white">Expense Breakdown</h3>
          <div className="mt-4 grid gap-3">
            {expenseBreakdown.rows.length === 0 && (
              <p className="text-sm text-[#a7a9be]">No spending recorded.</p>
            )}
            {expenseBreakdown.rows.map((row) => (
              <div key={row.category}>
                <div className="flex items-center justify-between text-sm text-[#a7a9be]">
                  <span className="capitalize">{row.category}</span>
                  <span className="text-white">{formatCurrency(row.value)} ({row.percent}%)</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-[#1a1828]">
                  <div className="h-3 rounded-full bg-[#4d96ff]" style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-[#a7a9be]">
          Real pet ownership costs $500-$2,000+ annually. Financial planning for your pet is just as important as daily care.
        </p>

        {/* Tricks earned */}
        {petState.tricks.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Tricks Learned</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {petState.tricks.map((trick) => (
                <span key={trick} className="rounded-full bg-[#4d96ff]/20 px-3 py-1 text-sm text-[#4d96ff]">
                  {trick}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action log + save */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl text-white">Action Log</h3>
            <button
              type="button"
              onClick={handleSave}
              className={`rounded-xl px-4 py-2 text-xs uppercase tracking-wide transition ${
                saved ? 'bg-[#6bcb77]/30 text-[#6bcb77]' : 'bg-[#6bcb77] text-[#1a1828] hover:scale-[1.01]'
              }`}
            >
              {saved ? 'Saved to Leaderboard' : 'Save to Leaderboard'}
            </button>
          </div>
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {petState.actionLog.length === 0 && (
              <p className="text-sm text-[#a7a9be]">No actions logged yet.</p>
            )}
            {petState.actionLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2 text-sm"
              >
                <div>
                  <p className="text-white">{entry.note}</p>
                  <p className="text-xs text-[#a7a9be]">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <span className="text-[#a7a9be]">{formatCurrency(entry.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

