/**
 * Displays badges and triggers a toast when new badges are earned.
 * Props: petState, financeState, onBadgeEarned
 */
import { useEffect, useMemo, useRef } from 'react';
import { BADGES } from '../data/badges';

export default function BadgePanel({ petState, financeState, onBadgeEarned }) {
  const earnedMap = useMemo(() => {
    const map = {};
    BADGES.forEach((badge) => {
      map[badge.id] = badge.condition(petState, financeState);
    });
    return map;
  }, [petState, financeState]);

  const previousEarned = useRef({});

  useEffect(() => {
    BADGES.forEach((badge) => {
      const wasEarned = previousEarned.current[badge.id];
      const isEarned = earnedMap[badge.id];
      if (!wasEarned && isEarned) {
        onBadgeEarned?.(badge);
      }
    });
    previousEarned.current = earnedMap;
  }, [earnedMap, onBadgeEarned]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1828]/80 p-6 shadow-xl">
      <h3 className="font-heading text-xl text-[#fffffe]">Badges</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BADGES.map((badge) => {
          const earned = earnedMap[badge.id];
          return (
            <div
              key={badge.id}
              className={`rounded-2xl border px-4 py-3 transition ${
                earned
                  ? 'border-[#c77dff] bg-[#252338]'
                  : 'border-white/10 bg-[#1f1d2f] opacity-30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{badge.emoji}</span>
                <div>
                  <p className="font-heading text-sm">{earned ? badge.name : '???'}</p>
                  {earned && <p className="text-xs text-[#a7a9be]">{badge.description}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}