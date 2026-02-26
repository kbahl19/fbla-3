/**
 * Leaderboard showing top 12-week scores.
 * Props: onBack
 */
import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/helpers';

export default function Leaderboard({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('petpal_leaderboard') || '[]');
    const sorted = [...stored].sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
    setEntries(sorted);
  }, []);

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    localStorage.removeItem('petpal_leaderboard');
    setEntries([]);
    setConfirmClear(false);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Leaderboard</h2>
            <p className="text-sm text-[#a7a9be]">Ranked by Final Score (0–100)</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="mt-6 text-sm text-[#a7a9be]">No sessions saved yet. Complete a 12-week run and save your score!</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[#a7a9be]">
                <tr>
                  <th className="py-3 pr-4">Rank</th>
                  <th className="py-3 pr-4">Owner</th>
                  <th className="py-3 pr-4">Pet</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3 pr-4">Tier</th>
                  <th className="py-3 pr-4">Wallet</th>
                  <th className="py-3 pr-4">Weeks</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {entries.map((entry, i) => (
                  <tr
                    key={`${entry.petName}-${entry.date}-${i}`}
                    className={`border-t border-white/10 ${i === 0 ? 'bg-[#ffd93d]/5' : ''}`}
                  >
                    <td className="py-3 pr-4">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </td>
                    <td className="py-3 pr-4">{entry.ownerName}</td>
                    <td className="py-3 pr-4">{entry.petName}</td>
                    <td className="py-3 pr-4 capitalize">{entry.petType}</td>
                    <td className="py-3 pr-4 font-heading text-[#ffd93d]">{entry.finalScore ?? '—'}</td>
                    <td className="py-3 pr-4 text-xs text-[#a7a9be]">{entry.classification || '—'}</td>
                    <td className="py-3 pr-4">{formatCurrency(entry.wallet ?? entry.totalSpent)}</td>
                    <td className="py-3 pr-4">{entry.weeksPlayed ?? entry.age ?? '—'}</td>
                    <td className="py-3">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleClear}
            className={`rounded-2xl px-4 py-2 text-xs uppercase tracking-wide transition ${
              confirmClear ? 'bg-[#ff6b6b] text-white' : 'bg-[#252338] text-[#a7a9be]'
            }`}
          >
            {confirmClear ? "Confirm clear — cannot be undone" : 'Clear History'}
          </button>
        </div>
      </div>
    </div>
  );
}
