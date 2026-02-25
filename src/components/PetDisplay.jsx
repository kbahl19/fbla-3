/**
 * Displays the current pet, mood, and evolution details.
 * Props: petState, onAction (boolean)
 */
import { useEffect, useMemo, useState } from 'react';
import { PETS } from '../data/pets';
import { STAT_THRESHOLDS } from '../hooks/usePet';

const moodStyles = {
  happy: 'bg-[#ffd93d] text-[#1a1828]',
  sad: 'bg-[#4d96ff] text-white',
  sick: 'bg-[#ff6b6b] text-white',
  energetic: 'bg-[#6bcb77] text-[#1a1828]',
  tired: 'bg-[#6b7280] text-white',
  content: 'bg-[#c77dff] text-white'
};

export default function PetDisplay({ petState, onAction }) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (!onAction) return;
    setBounce(true);
    const timeout = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(timeout);
  }, [onAction]);

  const petMeta = useMemo(() => PETS.find((pet) => pet.id === petState.type), [petState.type]);
  const emoji = petState.stage === 'baby' ? petMeta?.emoji_baby : petState.stage === 'teen' ? petMeta?.emoji_teen : petMeta?.emoji_adult;

  const moodClass = moodStyles[petState.mood] || moodStyles.content;
  const isHealthCritical = petState.health < STAT_THRESHOLDS.criticalHealth;

  const visibleTricks = petState.tricks.slice(0, 5);
  const remainingTricks = petState.tricks.length - visibleTricks.length;

  return (
    <div
      className={`rounded-3xl border ${
        isHealthCritical ? 'border-[#ff6b6b] animate-pulse' : 'border-white/10'
      } bg-[#1a1828]/80 p-6 text-center shadow-xl`}
    >
      <div
        className={`mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[#252338] text-7xl shadow-lg ${
          bounce ? 'animate-pet-bounce' : 'animate-pet-float'
        }`}
      >
        {emoji}
      </div>

      <h2 className="mt-4 font-heading text-3xl text-[#fffffe]">{petState.name}</h2>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-[#252338] px-3 py-1 text-xs uppercase tracking-wide text-[#a7a9be]">
          {petMeta?.name || petState.type}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${moodClass}`}>{petState.mood}</span>
      </div>

      <div className="mt-4 grid gap-1 text-sm text-[#a7a9be]">
        <span>
          Stage: <span className="text-white">{petState.stage}</span>
        </span>
        <span>
          Age: <span className="text-white">{petState.age} weeks</span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {visibleTricks.map((trick) => (
          <span key={trick} className="rounded-full bg-[#4d96ff]/20 px-3 py-1 text-xs text-[#4d96ff]">
            {trick}
          </span>
        ))}
        {remainingTricks > 0 && (
          <span className="rounded-full bg-[#252338] px-3 py-1 text-xs text-[#a7a9be]">+{remainingTricks} more</span>
        )}
        {petState.tricks.length === 0 && (
          <span className="text-xs text-[#a7a9be]">No tricks yet</span>
        )}
      </div>
    </div>
  );
}
