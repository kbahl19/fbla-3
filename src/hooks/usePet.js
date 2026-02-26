import { useEffect, useMemo, useRef, useState } from 'react';
import { deriveMood, getEvolutionStage, clampStat } from '../utils/helpers';
import { validateItemCost, validateStatChange, validateTrickName } from '../utils/validators';
import { normalizeCustomization } from '../data/customization';

const BASE_STATS = {
  hunger: 80,
  happiness: 70,
  energy: 80,
  health: 80,
  hygiene: 70
};

export const PET_ACTIONS = {
  restEnergyBoost: 20,
  cleanCost: 8,
  cleanHygieneBoost: 30,
  trickCost: 20,
  fullTreatmentBonus: 10
};

export const STAT_THRESHOLDS = {
  criticalHealth: 20,
  warning: 25
};

const DECAY_INTERVAL_MS = 3000;
const AGE_INTERVAL_MS = 60000;

const createActionLogEntry = (action, cost, note) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  action,
  cost,
  timestamp: new Date().toISOString(),
  note
});

const buildInitialState = (config) => {
  const age = 0;
  const stage = getEvolutionStage(age);
  return {
    name: config?.name || 'Pet',
    type: config?.type || 'dog',
    ownerName: config?.ownerName || '',
    customization: normalizeCustomization(config?.customization),
    stage,
    hunger: BASE_STATS.hunger,
    happiness: BASE_STATS.happiness,
    energy: BASE_STATS.energy,
    health: BASE_STATS.health,
    hygiene: BASE_STATS.hygiene,
    mood: 'content',
    age,
    minigamesPlayed: 0,
    healthBottomedOut: false,
    tricks: [],
    actionLog: [],
    dailySnapshots: []
  };
};

// Returns the clamped delta and whether it's valid to apply
const safeDelta = (current, delta) => {
  const adjustedDelta = clampStat(current + delta) - current;
  const validation = validateStatChange(current, adjustedDelta);
  if (!validation.valid) return { valid: false, error: validation.error, delta: 0 };
  return { valid: true, error: null, delta: adjustedDelta };
};

export default function usePet(initialConfig, wallet) {
  const initialRef = useRef(buildInitialState(initialConfig));
  const [petState, setPetState] = useState(() => buildInitialState(initialConfig));

  useEffect(() => {
    if (!initialConfig?.name) return;
    const next = buildInitialState(initialConfig);
    initialRef.current = next;
    setPetState(next);
  }, [initialConfig]);

  // Stat decay tick — hunger drops fastest, hygiene slowest
  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => {
        const hungerDelta    = safeDelta(prev.hunger,    -5);
        const happinessDelta = safeDelta(prev.happiness, -3);
        const energyDelta    = safeDelta(prev.energy,    -2);
        const hygieneDelta   = safeDelta(prev.hygiene,   -2);

        if (!hungerDelta.valid || !happinessDelta.valid || !energyDelta.valid || !hygieneDelta.valid) {
          return prev;
        }

        // Health erodes when hunger or hygiene are critically low
        const healthPenalty =
          (prev.hunger < 30 ? 5 : prev.hunger < 50 ? 2 : 0) +
          (prev.hygiene < 30 ? 3 : prev.hygiene < 50 ? 1 : 0);
        const healthDelta = safeDelta(prev.health, -healthPenalty);

        const next = {
          ...prev,
          hunger:    prev.hunger    + hungerDelta.delta,
          happiness: prev.happiness + happinessDelta.delta,
          energy:    prev.energy    + energyDelta.delta,
          hygiene:   prev.hygiene   + hygieneDelta.delta,
          health:    healthPenalty > 0 && healthDelta.valid ? prev.health + healthDelta.delta : prev.health
        };

        if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
          next.healthBottomedOut = true;
        }

        return next;
      });
    }, DECAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Age tick — drives evolution stage
  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => {
        const nextAge = prev.age + 1;
        return { ...prev, age: nextAge, stage: getEvolutionStage(nextAge) };
      });
    }, AGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Re-derive mood whenever any stat changes
  useEffect(() => {
    setPetState((prev) => {
      const nextMood = deriveMood(prev);
      if (nextMood === prev.mood) return prev;
      return { ...prev, mood: nextMood };
    });
  }, [petState.hunger, petState.happiness, petState.health, petState.energy, petState.hygiene]);

  const logAction = (action, cost, note) => {
    setPetState((prev) => ({
      ...prev,
      actionLog: [createActionLogEntry(action, cost, note), ...prev.actionLog]
    }));
  };

  const feed = (foodItem) => {
    const affordability = validateItemCost(foodItem.cost, wallet);
    if (!affordability.valid) return affordability;

    // mystery_snack has a random outcome
    const hungerBoost =
      foodItem.id === 'mystery_snack' ? (Math.random() < 0.5 ? 5 : 25) : foodItem.hungerRestore;
    const hungerDelta    = safeDelta(petState.hunger,    hungerBoost);
    const happinessDelta = safeDelta(petState.happiness, foodItem.happinessBonus || 0);

    if (!hungerDelta.valid || !happinessDelta.valid) {
      return { valid: false, error: 'That would overfill a stat. Try a smaller treat.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        hunger:    prev.hunger    + hungerDelta.delta,
        happiness: prev.happiness + happinessDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('feed', foodItem.cost, `Fed ${petState.name} a ${foodItem.name}.`);
    return { valid: true, error: null, details: { item: foodItem.name, cost: foodItem.cost, hungerDelta: hungerDelta.delta, happinessDelta: happinessDelta.delta } };
  };

  const play = (toyItem) => {
    const affordability = validateItemCost(toyItem.cost, wallet);
    if (!affordability.valid) return affordability;

    const happinessDelta = safeDelta(petState.happiness, toyItem.happinessRestore);
    const energyDelta    = safeDelta(petState.energy,    -toyItem.energyCost);

    if (!happinessDelta.valid || !energyDelta.valid) {
      return { valid: false, error: 'That would push a stat too far.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        happiness: prev.happiness + happinessDelta.delta,
        energy:    prev.energy    + energyDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('play', toyItem.cost, `Played with ${petState.name} using ${toyItem.name}.`);
    return { valid: true, error: null, details: { item: toyItem.name, cost: toyItem.cost, happinessDelta: happinessDelta.delta, energyDelta: energyDelta.delta } };
  };

  const rest = () => {
    const energyDelta = safeDelta(petState.energy, PET_ACTIONS.restEnergyBoost);
    if (!energyDelta.valid) return { valid: false, error: 'Energy is already maxed out.' };

    setPetState((prev) => ({ ...prev, energy: prev.energy + energyDelta.delta }));
    logAction('rest', 0, `${petState.name} took a power nap.`);
    return { valid: true, error: null, details: { energyDelta: energyDelta.delta, cost: 0 } };
  };

  const clean = () => {
    const affordability = validateItemCost(PET_ACTIONS.cleanCost, wallet);
    if (!affordability.valid) return affordability;

    const hygieneDelta = safeDelta(petState.hygiene, PET_ACTIONS.cleanHygieneBoost);
    if (!hygieneDelta.valid) return { valid: false, error: 'Hygiene is already at the maximum.' };

    setPetState((prev) => ({ ...prev, hygiene: prev.hygiene + hygieneDelta.delta }));
    logAction('clean', PET_ACTIONS.cleanCost, `${petState.name} got a fresh clean.`);
    return { valid: true, error: null, details: { hygieneDelta: hygieneDelta.delta, cost: PET_ACTIONS.cleanCost } };
  };

  const healthCheck = (vetOption) => {
    const affordability = validateItemCost(vetOption.cost, wallet);
    if (!affordability.valid) return affordability;

    const healthDelta = safeDelta(petState.health, vetOption.healthRestore);
    if (!healthDelta.valid) return { valid: false, error: 'Health is already at the maximum.' };

    // full_treatment gives a small bonus to all other stats
    const bonus = vetOption.id === 'full_treatment' ? PET_ACTIONS.fullTreatmentBonus : 0;
    const hungerDelta    = safeDelta(petState.hunger,    bonus);
    const happinessDelta = safeDelta(petState.happiness, bonus);
    const energyDelta    = safeDelta(petState.energy,    bonus);
    const hygieneDelta   = safeDelta(petState.hygiene,   bonus);

    if (!hungerDelta.valid || !happinessDelta.valid || !energyDelta.valid || !hygieneDelta.valid) {
      return { valid: false, error: 'Those boosts would overfill a stat.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        health:    prev.health    + healthDelta.delta,
        hunger:    prev.hunger    + hungerDelta.delta,
        happiness: prev.happiness + happinessDelta.delta,
        energy:    prev.energy    + energyDelta.delta,
        hygiene:   prev.hygiene   + hygieneDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('vet', vetOption.cost, `${petState.name} received ${vetOption.name}.`);
    return { valid: true, error: null, details: { item: vetOption.name, cost: vetOption.cost, healthDelta: healthDelta.delta, bonusDelta: bonus } };
  };

  const learnTrick = (trickName) => {
    const affordability = validateItemCost(PET_ACTIONS.trickCost, wallet);
    if (!affordability.valid) return affordability;

    const trickValidation = validateTrickName(trickName, petState.tricks);
    if (!trickValidation.valid) return trickValidation;
    const trimmed = String(trickName || '').trim();

    setPetState((prev) => ({ ...prev, tricks: [...prev.tricks, trimmed] }));
    logAction('trick', PET_ACTIONS.trickCost, `${petState.name} learned ${trimmed}.`);
    return { valid: true, error: null, details: { trickName: trimmed, cost: PET_ACTIONS.trickCost } };
  };

  // Called at the end of each week tick before advancing the week counter
  const recordDaySnapshot = () => {
    setPetState((prev) => ({
      ...prev,
      dailySnapshots: [
        ...prev.dailySnapshots,
        { happiness: prev.happiness, health: prev.health, energy: prev.energy }
      ]
    }));
  };

  const recordMinigame = () => {
    setPetState((prev) => ({ ...prev, minigamesPlayed: prev.minigamesPlayed + 1 }));
  };

  const resetPet = () => {
    setPetState({ ...initialRef.current, tricks: [], actionLog: [], dailySnapshots: [] });
  };

  const petStateMemo = useMemo(() => petState, [petState]);

  return { petState: petStateMemo, feed, play, rest, clean, healthCheck, learnTrick, recordMinigame, recordDaySnapshot, resetPet };
}
