/**
 * Help modal with gameplay, objective, stats, finance, and badge guidance.
 * Props: isOpen, onClose
 */
import { useState } from 'react';
import { BADGES } from '../data/badges';

const BADGE_HINTS = {
  first_meal: 'Start with a simple meal.',
  doctors_orders: 'Schedule a health visit early.',
  joy_maximizer: 'Find ways to keep happiness high.',
  glow_up: 'Stick with the routine until the next stage.',
  full_grown: 'See the journey through to the end.',
  penny_pincher: 'Save more than you spend.',
  minigame_master: 'Play the minigame consistently.',
  peak_performance: 'Balance every stat at once.',
  trick_master: 'Teach multiple tricks over time.',
  responsible_owner: 'Keep health safe for the whole session.'
};

const TABS = ['Objective', 'How to Play', 'Stats Guide', 'Finance Guide', 'Minigames', 'Badges', 'Tips'];

export default function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Objective');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#1a1828] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl text-[#ffd93d]">PetPal Help</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white hover:border-[#4d96ff]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-2 text-xs uppercase tracking-wide transition ${
                activeTab === tab ? 'bg-[#4d96ff] text-white' : 'bg-[#252338] text-[#a7a9be] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 text-sm text-[#a7a9be]">
          {activeTab === 'Objective' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#ffd93d]/30 bg-[#ffd93d]/10 p-4">
                <p className="font-heading text-white">The 12-Week Challenge</p>
                <p className="mt-1">Manage your pet's care over exactly 12 weeks (each week = 90 seconds of real time). At the end, the player with the highest Final Score wins!</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#252338] p-4">
                <p className="font-heading text-white">Final Score Formula</p>
                <p className="mt-1 font-mono text-[#4d96ff]">Score = Wallet Balance + (Average Stats × 2)</p>
                <p className="mt-2">Example: $150 wallet + (75 avg stats × 2) = 150 + 150 = <strong className="text-white">300 points</strong></p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#252338] p-4">
                <p className="font-heading text-white">Weekly Salary System</p>
                <p className="mt-1">Every week, you receive a salary — but only if your pet is healthy:</p>
                <ul className="mt-2 space-y-1 pl-3">
                  <li><span className="text-[#6bcb77]">Health ≥ 70:</span> $30 salary (Healthy!)</li>
                  <li><span className="text-[#ffd93d]">Health 40–69:</span> $15 salary (Struggling)</li>
                  <li><span className="text-[#ff6b6b]">Health &lt; 40:</span> $0 salary (Too sick!)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#252338] p-4">
                <p className="font-heading text-white">Weekly Bills</p>
                <p className="mt-1">$20 in living costs is charged every week regardless. Budget wisely or you'll go negative!</p>
              </div>
            </div>
          )}

          {activeTab === 'How to Play' && (
            <div className="space-y-3">
              <p>Choose a pet, name it, and start your 12-week journey with $200.</p>
              <p>Feed, play, rest, clean, and visit the vet every week to keep your pet's stats up.</p>
              <p>Each week, $20 in bills are charged and a salary is paid based on pet health.</p>
              <p>Play minigames to earn extra income when your budget gets tight.</p>
              <p>After 12 weeks, your final score determines your rank on the leaderboard.</p>
              <p>Teach your pet tricks, earn badges, and watch it evolve from baby → teen → adult!</p>
            </div>
          )}

          {activeTab === 'Stats Guide' && (
            <div className="space-y-3">
              <p><strong className="text-white">Hunger:</strong> Drops every few seconds. Feed your pet to restore it. If it hits zero, health suffers.</p>
              <p><strong className="text-white">Happiness:</strong> Boost with play sessions or premium meals. Low happiness = sad pet.</p>
              <p><strong className="text-white">Energy:</strong> Drained by playing. Rest to recover. Tired pets can't stay energetic.</p>
              <p><strong className="text-white">Health:</strong> Erodes when hunger or hygiene are low. Vet visits restore health — CRITICAL for salary!</p>
              <p><strong className="text-white">Hygiene:</strong> Drops slowly. Use "Clean" to prevent health penalties.</p>
              <p className="rounded-xl border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 p-3">
                <strong className="text-[#ff6b6b]">Warning:</strong> When any stat hits below 25, your pet is struggling. Below 20 health triggers a crisis!
              </p>
            </div>
          )}

          {activeTab === 'Finance Guide' && (
            <div className="space-y-3">
              <p>Your <strong className="text-white">wallet</strong> is your spendable cash. Starts at $200.</p>
              <p>Every action costs money — food, toys, vet visits, cleaning, and tricks all reduce your wallet.</p>
              <p>Income comes from your weekly salary (tied to pet health) and minigame earnings.</p>
              <p>Set a <strong className="text-white">savings goal</strong> to stay disciplined and track your progress toward a target.</p>
              <p>At game end: wallet balance contributes directly to your final score — don't overspend!</p>
            </div>
          )}

          {activeTab === 'Minigames' && (
            <div className="space-y-3">
              <p>Play minigames from the Finance panel to earn extra money. Each has unique mechanics:</p>
              <div className="space-y-2">
                <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <p className="font-heading text-white">🍎 Food Catcher</p>
                  <p className="text-xs mt-1">Catch falling food with arrow keys. Avoid poison pills. 3 lives. Score 20+ for max $15.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <p className="font-heading text-white">🃏 Memory Match</p>
                  <p className="text-xs mt-1">Flip cards to find pet care item pairs. 60-second timer. Each pair = $2, max $16.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <p className="font-heading text-white">🐾 Reflex Tap</p>
                  <p className="text-xs mt-1">Click the glowing paw before it vanishes. Gets faster with hits. 15 rounds, max $15.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <p className="font-heading text-white">🧮 Budget Blitz</p>
                  <p className="text-xs mt-1">Answer 10 pet budget math questions in 8 seconds each. $2/correct, max $20.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <p className="font-heading text-white">🎯 Care Sequence</p>
                  <p className="text-xs mt-1">Watch and repeat care action sequences (Simon Says). 5 rounds, $3/round, max $15.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Badges' && (
            <div className="space-y-2">
              {BADGES.map((badge) => (
                <div key={badge.id} className="rounded-xl border border-white/10 bg-[#252338] p-3">
                  <div className="flex items-center gap-2">
                    <span>{badge.emoji}</span>
                    <span className="text-white">{badge.name}</span>
                  </div>
                  <p className="mt-1 text-xs">Hint: {BADGE_HINTS[badge.id] || 'Keep playing to discover this.'}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Tips' && (
            <div className="space-y-3">
              <p>Prioritize health above all — it determines your weekly salary AND final score.</p>
              <p>Schedule vet visits early. Waiting until health is critical wastes multiple salary cycles.</p>
              <p>Balance short-term pet care costs with long-term wallet preservation. Overspending tanks your score.</p>
              <p>Use minigames when you're low on funds, especially Budget Blitz for reliable $20 earnings.</p>
              <p>Set a savings goal to stay focused. Having a target prevents impulse spending.</p>
              <p>Watch the weekly countdown — plan your actions before each week ends!</p>
              <p>Tricks boost the pet's profile but cost $10 each. Only invest after core stats are stable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
