/**
 * Weekly popup modal shown at the end of each in-game week.
 * Shows salary earned, bills charged, and running balance.
 * Props: data, totalWeeks, weeklyBill, onClose
 */
import { formatCurrency } from '../utils/helpers';

export default function WeeklyUpdate({ data, totalWeeks, weeklyBill, onClose }) {
  const { completedWeek, nextWeek, salary, petHealth, isGameOver } = data;
  const net = salary - weeklyBill;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1a1828] p-6 shadow-2xl">
        <div className="text-center">
          <span className="text-5xl">{isGameOver ? '🏁' : '📅'}</span>
          <h2 className="mt-3 font-heading text-3xl text-[#ffd93d]">
            {isGameOver ? 'Final Week Complete!' : `Week ${completedWeek} Done`}
          </h2>
          <p className="mt-1 text-sm text-[#a7a9be]">
            {isGameOver
              ? `All ${totalWeeks} weeks completed. Time to see your final score!`
              : `Week ${nextWeek} of ${totalWeeks} begins now.`}
          </p>
        </div>

        {/* Health check result */}
        <div className={`mt-5 rounded-2xl border px-4 py-3 ${
          petHealth >= 70
            ? 'border-[#6bcb77]/40 bg-[#6bcb77]/10'
            : petHealth >= 40
              ? 'border-[#ffd93d]/40 bg-[#ffd93d]/10'
              : 'border-[#ff6b6b]/40 bg-[#ff6b6b]/10'
        }`}>
          <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Pet Health Check</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-white">Health: {petHealth}/100</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              petHealth >= 70
                ? 'bg-[#6bcb77] text-[#1a1828]'
                : petHealth >= 40
                  ? 'bg-[#ffd93d] text-[#1a1828]'
                  : 'bg-[#ff6b6b] text-white'
            }`}>
              {petHealth >= 70 ? 'Healthy' : petHealth >= 40 ? 'Struggling' : 'Critical'}
            </span>
          </div>
        </div>

        {/* This week's finances */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#252338] p-4">
          <p className="text-xs uppercase tracking-wide text-[#a7a9be]">This Week</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#a7a9be]">Weekly living costs</span>
              <span className="text-[#ff6b6b]">-{formatCurrency(weeklyBill)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a7a9be]">
                Salary
                {salary === 0 && <span className="ml-2 text-[#ff6b6b]">(pet too sick!)</span>}
                {salary > 0 && salary < 30 && <span className="ml-2 text-[#ffd93d]">(pet struggling)</span>}
              </span>
              <span className={salary > 0 ? 'text-[#6bcb77]' : 'text-[#a7a9be]'}>
                {salary > 0 ? `+${formatCurrency(salary)}` : formatCurrency(0)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold">
              <span className="text-white">Net this week</span>
              <span className={net >= 0 ? 'text-[#6bcb77]' : 'text-[#ff6b6b]'}>
                {net >= 0 ? '+' : ''}{formatCurrency(net)}
              </span>
            </div>
          </div>
        </div>

        {/* Tip */}
        {salary === 0 && (
          <p className="mt-3 rounded-xl border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-3 py-2 text-xs text-[#ff6b6b]">
            Visit the vet to restore health — a healthy pet earns up to $30/week salary!
          </p>
        )}
        {salary > 0 && salary < 30 && (
          <p className="mt-3 rounded-xl border border-[#ffd93d]/30 bg-[#ffd93d]/10 px-3 py-2 text-xs text-[#ffd93d]">
            Boost health above 70 to earn the full $30/week salary!
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#4d96ff] px-6 py-3 font-heading text-white transition hover:scale-[1.01] active:scale-[0.99]"
        >
          {isGameOver ? 'See Final Results' : `Start Week ${nextWeek}`}
        </button>
      </div>
    </div>
  );
}
