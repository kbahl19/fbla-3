/**
 * Final 12-week session report with score, care grade, and expense breakdown.
 * Props: petState, financeState, weeksPlayed, onSaveLeaderboard, onPlayAgain, onLeaderboard
 */
import { useMemo, useState } from 'react';
import { calculateCareGrade, calculateScore, calculateAvgStat, formatCurrency } from '../utils/helpers';

const gradeColors = {
  A: 'text-[#6bcb77]',
  B: 'text-[#ffd93d]',
  C: 'text-[#4d96ff]',
  D: 'text-[#ff9f1c]',
  F: 'text-[#ff6b6b]'
};

const SCORE_TIERS = [
  { min: 400, label: 'Legendary Owner', color: 'text-[#ffd93d]' },
  { min: 300, label: 'Expert Owner', color: 'text-[#6bcb77]' },
  { min: 200, label: 'Good Owner', color: 'text-[#4d96ff]' },
  { min: 100, label: 'Learning Owner', color: 'text-[#c77dff]' },
  { min: 0, label: 'Struggling Owner', color: 'text-[#ff6b6b]' }
];

function getScoreTier(score) {
  return SCORE_TIERS.find((t) => score >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1];
}

export default function Report({ petState, financeState, weeksPlayed, onSaveLeaderboard, onPlayAgain, onLeaderboard }) {
  const [saved, setSaved] = useState(false);

  const careGrade = calculateCareGrade(petState);
  const gradeClass = gradeColors[careGrade] || 'text-white';
  const avgStat = calculateAvgStat(petState);
  const finalScore = calculateScore(petState, financeState);
  const scoreTier = getScoreTier(finalScore);

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
    if (financeState.savingsGoal && financeState.wallet >= financeState.savingsGoal) insights.push('Savings goal was achieved while completing pet care.');
    if ((petState.mood === 'happy' || petState.mood === 'energetic') && petState.health >= 70) {
      insights.push(`Final pet reaction was ${petState.mood} with healthy stats, showing strong care balance.`);
    }
    if (insights.length === 0) insights.push('Care and spending stayed balanced overall, with no major risk pattern detected.');

    return { actionRows, biggestExpense, totalBills, totalIncome, insights };
  }, [petState.actionLog, petState.mood, petState.health, financeState.expenses, financeState.wallet, financeState.savingsGoal]);

  const handleSave = () => {
    if (saved) return;
    const entry = {
      ownerName: petState.ownerName,
      petName: petState.name,
      petType: petState.type,
      careGrade,
      finalScore,
      avgStat,
      wallet: financeState.wallet,
      totalSpent: financeState.totalSpent,
      weeksPlayed,
      stage: petState.stage,
      date: new Date().toLocaleDateString()
    };
    onSaveLeaderboard(entry);
    setSaved(true);
  };

  const savingsStatus = financeState.savingsGoal
    ? financeState.wallet >= financeState.savingsGoal
      ? `Goal met: ${formatCurrency(financeState.savingsGoal)}`
      : `${formatCurrency(financeState.savingsGoal - financeState.wallet)} short`
    : 'No goal set';

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">12-Week Final Report</h2>
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
          <p className="mt-2 font-heading text-6xl text-[#ffd93d]">{finalScore}</p>
          <p className={`mt-2 font-heading text-xl ${scoreTier.color}`}>{scoreTier.label}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-[#a7a9be]">
            <span>Wallet: <span className="text-white">{formatCurrency(Math.max(0, financeState.wallet))}</span></span>
            <span>+</span>
            <span>Avg Stats ({avgStat}/100): <span className="text-white">+{avgStat * 2} pts</span></span>
          </div>
          <p className="mt-2 text-xs text-[#a7a9be]">Score formula: wallet + (average stats x 2)</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Care summary */}
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <h3 className="font-heading text-xl text-white">Pet Care Summary</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#a7a9be]">
              <div className="flex justify-between">
                <span>Care Grade</span>
                <span className={`font-heading text-2xl ${gradeClass}`}>{careGrade}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Stage</span>
                <span className="text-white capitalize">{petState.stage}</span>
              </div>
              <div className="flex justify-between">
                <span>Pet Age</span>
                <span className="text-white">{petState.age} weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Final Mood</span>
                <span className="text-white capitalize">{petState.mood}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Stats</span>
                <span className="text-white">{avgStat}/100</span>
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
                  <td className="py-2">Savings Goal Status</td>
                  <td className="py-2 text-right text-white">{savingsStatus}</td>
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

