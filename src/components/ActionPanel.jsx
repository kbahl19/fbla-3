/**
 * Action tabs for feeding, playing, resting, cleaning, vet visits, and tricks.
 * Props: petState, financeState, onFeed, onPlay, onRest, onClean, onHealthCheck, onLearnTrick
 */
import { useState } from 'react';
import { FOOD_ITEMS, TOY_ITEMS, VET_OPTIONS } from '../data/items';
import { validateItemCost } from '../utils/validators';
import { formatCurrency } from '../utils/helpers';
import { PET_ACTIONS } from '../hooks/usePet';

const TABS = ['Feed', 'Play', 'Rest', 'Clean', 'Vet', 'Tricks'];

export default function ActionPanel({
  petState,
  financeState,
  onFeed,
  onPlay,
  onRest,
  onClean,
  onHealthCheck,
  onLearnTrick
}) {
  const [activeTab, setActiveTab] = useState('Feed');
  const [trickName, setTrickName] = useState('');
  const canAffordTrick = validateItemCost(PET_ACTIONS.trickCost, financeState.wallet).valid;
  const canAffordClean = validateItemCost(PET_ACTIONS.cleanCost, financeState.wallet).valid;

  const handleTrick = () => {
    const result = onLearnTrick(trickName);
    if (result?.valid) {
      setTrickName('');
    }
  };

  const renderItems = (items, onClick, getPreview) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const affordable = validateItemCost(item.cost, financeState.wallet).valid;
        return (
          <button
            key={item.id}
            type="button"
            disabled={!affordable}
            onClick={() => onClick(item)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              affordable
                ? 'border-white/10 bg-[#252338] hover:-translate-y-0.5 hover:border-[#ffd93d]'
                : 'cursor-not-allowed border-white/10 bg-[#1f1d2f] opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{item.emoji}</span>
              <span className="rounded-full bg-[#1a1828] px-2 py-1 text-xs text-[#ffd93d]">
                {formatCurrency(item.cost)}
              </span>
            </div>
            <div className="mt-2 font-heading text-base">{item.name}</div>
            <p className="mt-1 text-xs text-[#a7a9be]">{getPreview(item)}</p>
            {!affordable && <p className="mt-2 text-xs text-[#ff6b6b]">Can't afford</p>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1828]/80 p-6 shadow-xl">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide transition ${
              activeTab === tab
                ? 'bg-[#4d96ff] text-white'
                : 'bg-[#252338] text-[#a7a9be] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'Feed' &&
          renderItems(FOOD_ITEMS, onFeed, (item) => {
            const bonus = item.happinessBonus ? ` | Happiness +${item.happinessBonus}` : '';
            if (item.id === 'mystery_snack') {
              return `Hunger +5 or +25${bonus}`;
            }
            return `Hunger +${item.hungerRestore}${bonus}`;
          })}

        {activeTab === 'Play' &&
          renderItems(TOY_ITEMS, onPlay, (item) => `Happiness +${item.happinessRestore} | Energy -${item.energyCost}`)}

        {activeTab === 'Vet' &&
          renderItems(VET_OPTIONS, onHealthCheck, (item) =>
            item.id === 'full_treatment'
              ? `Health +${item.healthRestore} | All stats +${PET_ACTIONS.fullTreatmentBonus}`
              : `Health +${item.healthRestore}`
          )}

        {activeTab === 'Rest' && (
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <p className="text-sm text-[#a7a9be]">Energy +{PET_ACTIONS.restEnergyBoost}</p>
            <button
              type="button"
              onClick={onRest}
              className="mt-4 w-full rounded-xl bg-[#6bcb77] px-4 py-3 font-heading text-[#1a1828] transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Rest (Free)
            </button>
          </div>
        )}

        {activeTab === 'Clean' && (
          <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
            <p className="text-sm text-[#a7a9be]">
              Hygiene +{PET_ACTIONS.cleanHygieneBoost} | Cost {formatCurrency(PET_ACTIONS.cleanCost)}
            </p>
            <button
              type="button"
              onClick={onClean}
              disabled={!canAffordClean}
              className="mt-4 w-full rounded-xl bg-[#4d96ff] px-4 py-3 font-heading text-white transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Clean Up
            </button>
            {!canAffordClean && <p className="mt-2 text-xs text-[#ff6b6b]">Can't afford</p>}
          </div>
        )}

        {activeTab === 'Tricks' && (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#252338] p-5">
              <label className="text-xs uppercase tracking-wide text-[#a7a9be]">New Trick</label>
              <input
                value={trickName}
                onChange={(event) => setTrickName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2 text-white outline-none focus:border-[#4d96ff]"
                placeholder="e.g. Spin"
              />
            <button
              type="button"
              onClick={handleTrick}
              disabled={!canAffordTrick}
              className="mt-4 w-full rounded-xl bg-[#ffd93d] px-4 py-3 font-heading text-[#1a1828] transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Teach Trick ({formatCurrency(PET_ACTIONS.trickCost)})
            </button>
            {!canAffordTrick && <p className="mt-2 text-xs text-[#ff6b6b]">Can't afford</p>}
          </div>
            <div className="rounded-2xl border border-white/10 bg-[#252338] p-4">
              <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Known Tricks</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {petState.tricks.length === 0 && <span className="text-xs text-[#a7a9be]">None yet</span>}
                {petState.tricks.map((trick) => (
                  <span key={trick} className="rounded-full bg-[#4d96ff]/20 px-3 py-1 text-xs text-[#4d96ff]">
                    {trick}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
