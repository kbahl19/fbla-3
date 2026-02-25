/**
 * Displays stat bars for hunger, happiness, energy, health, and hygiene.
 * Props: petState
 */
import { getStatColor } from '../utils/helpers';
import { STAT_THRESHOLDS } from '../hooks/usePet';

const STAT_META = [
  { key: 'hunger', label: 'Hunger', icon: '🍽️' },
  { key: 'happiness', label: 'Happiness', icon: '🎈' },
  { key: 'energy', label: 'Energy', icon: '⚡' },
  { key: 'health', label: 'Health', icon: '❤️' },
  { key: 'hygiene', label: 'Hygiene', icon: '🫧' }
];

export default function StatBars({ petState }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1828]/80 p-6 shadow-xl">
      <h3 className="font-heading text-xl text-[#fffffe]">Care Stats</h3>
      <div className="mt-4 grid gap-4">
        {STAT_META.map((stat) => {
          const value = petState[stat.key];
          const barClass = getStatColor(value);
          return (
            <div key={stat.key} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#a7a9be]">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="uppercase tracking-wide">{stat.label}</span>
                  {value < STAT_THRESHOLDS.warning && <span className="text-[#ff6b6b]">⚠</span>}
                </div>
                <span className="text-white">{value}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#252338]">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barClass}`}
                  style={{ width: `${value}%`, transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
