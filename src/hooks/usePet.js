import { useEffect, useMemo, useRef, useState } from 'react';
import { deriveMood, getEvolutionStage, clampStat } from '../utils/helpers';
import { validateItemCost, validateStatChange } from '../utils/validators';

const BASE_STATS = {
  hunger: 80,
  happiness: 70,
  energy: 80,
  health: 80,
  hygiene: 70
};

export const PET_ACTIONS = {
  restEnergyBoost: 20,
  cleanCost: 2,
  cleanHygieneBoost: 30,
  trickCost: 10,
  fullTreatmentBonus: 10
};

export const STAT_THRESHOLDS = {
  criticalHealth: 20,
  warning: 25
};

const DECAY_INTERVAL_MS = 4000;
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
  const base = {
    name: config?.name || 'Pet',
    type: config?.type || 'dog',
    ownerName: config?.ownerName || '',
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
    actionLog: []
  };
  return base;
};

const safeDelta = (current, delta) => {
  const adjustedDelta = clampStat(current + delta) - current;
  const validation = validateStatChange(current, adjustedDelta);
  if (!validation.valid) {
    return { valid: false, error: validation.error, delta: 0 };
  }
  return { valid: true, error: null, delta: adjustedDelta };
};

/**
 * Manages pet state, decay, evolution, and player actions.
 * @param {{ name: string, type: string, ownerName: string } | null} initialConfig
 * @param {number} wallet
 * @returns {{ petState: object, feed: Function, play: Function, rest: Function, clean: Function, healthCheck: Function, learnTrick: Function, recordMinigame: Function, resetPet: Function }}
 */
export default function usePet(initialConfig, wallet) {
  const initialRef = useRef(buildInitialState(initialConfig));
  const [petState, setPetState] = useState(() => buildInitialState(initialConfig));

  useEffect(() => {
    if (!initialConfig?.name) return;
    const next = buildInitialState(initialConfig);
    initialRef.current = next;
    setPetState(next);
  }, [initialConfig]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => {
        const hungerDelta = safeDelta(prev.hunger, -3);
        const happinessDelta = safeDelta(prev.happiness, -2);
        const energyDelta = safeDelta(prev.energy, -1);
        const hygieneDelta = safeDelta(prev.hygiene, -1);

        if (!hungerDelta.valid || !happinessDelta.valid || !energyDelta.valid || !hygieneDelta.valid) {
          return prev;
        }

        // Health erodes when hunger or hygiene are critically low
        const healthPenalty =
          (prev.hunger < 30 ? 2 : prev.hunger < 50 ? 1 : 0) +
          (prev.hygiene < 30 ? 1 : 0);
        const healthDelta = safeDelta(prev.health, -healthPenalty);

        const next = {
          ...prev,
          hunger: prev.hunger + hungerDelta.delta,
          happiness: prev.happiness + happinessDelta.delta,
          energy: prev.energy + energyDelta.delta,
          hygiene: prev.hygiene + hygieneDelta.delta,
          health: healthPenalty > 0 && healthDelta.valid ? prev.health + healthDelta.delta : prev.health
        };

        if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
          next.healthBottomedOut = true;
        }

        return next;
      });
    }, DECAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => {
        const nextAge = prev.age + 1;
        return {
          ...prev,
          age: nextAge,
          stage: getEvolutionStage(nextAge)
        };
      });
    }, AGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

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

  /**
   * Feeds the pet with a food item.
   * @param {{ id: string, name: string, cost: number, hungerRestore: number, happinessBonus: number }} foodItem
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const feed = (foodItem) => {
    const affordability = validateItemCost(foodItem.cost, wallet);
    if (!affordability.valid) return affordability;

    const hungerBoost =
      foodItem.id === 'mystery_snack' ? (Math.random() < 0.5 ? 5 : 25) : foodItem.hungerRestore;
    const hungerDelta = safeDelta(petState.hunger, hungerBoost);
    const happinessDelta = safeDelta(petState.happiness, foodItem.happinessBonus || 0);

    if (!hungerDelta.valid || !happinessDelta.valid) {
      return { valid: false, error: 'That would overfill a stat. Try a smaller treat.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        hunger: prev.hunger + hungerDelta.delta,
        happiness: prev.happiness + happinessDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('feed', foodItem.cost, `Fed ${petState.name} a ${foodItem.name}.`);
    return {
      valid: true,
      error: null,
      details: {
        item: foodItem.name,
        cost: foodItem.cost,
        hungerDelta: hungerDelta.delta,
        happinessDelta: happinessDelta.delta
      }
    };
  };

  /**
   * Plays with the pet using a toy item.
   * @param {{ name: string, cost: number, happinessRestore: number, energyCost: number }} toyItem
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const play = (toyItem) => {
    const affordability = validateItemCost(toyItem.cost, wallet);
    if (!affordability.valid) return affordability;

    const happinessDelta = safeDelta(petState.happiness, toyItem.happinessRestore);
    const energyDelta = safeDelta(petState.energy, -toyItem.energyCost);

    if (!happinessDelta.valid || !energyDelta.valid) {
      return { valid: false, error: 'That would push a stat too far.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        happiness: prev.happiness + happinessDelta.delta,
        energy: prev.energy + energyDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('play', toyItem.cost, `Played with ${petState.name} using ${toyItem.name}.`);
    return {
      valid: true,
      error: null,
      details: {
        item: toyItem.name,
        cost: toyItem.cost,
        happinessDelta: happinessDelta.delta,
        energyDelta: energyDelta.delta
      }
    };
  };

  /**
   * Lets the pet rest to recover energy.
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const rest = () => {
    const energyDelta = safeDelta(petState.energy, PET_ACTIONS.restEnergyBoost);
    if (!energyDelta.valid) {
      return { valid: false, error: 'Energy is already maxed out.' };
    }

    setPetState((prev) => ({
      ...prev,
      energy: prev.energy + energyDelta.delta
    }));

    logAction('rest', 0, `${petState.name} took a power nap.`);
    return {
      valid: true,
      error: null,
      details: { energyDelta: energyDelta.delta, cost: 0 }
    };
  };

  /**
   * Cleans the pet to restore hygiene.
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const clean = () => {
    const affordability = validateItemCost(PET_ACTIONS.cleanCost, wallet);
    if (!affordability.valid) return affordability;

    const hygieneDelta = safeDelta(petState.hygiene, PET_ACTIONS.cleanHygieneBoost);
    if (!hygieneDelta.valid) {
      return { valid: false, error: 'Hygiene is already at the maximum.' };
    }

    setPetState((prev) => ({
      ...prev,
      hygiene: prev.hygiene + hygieneDelta.delta
    }));

    logAction('clean', PET_ACTIONS.cleanCost, `${petState.name} got a fresh clean.`);
    return {
      valid: true,
      error: null,
      details: { hygieneDelta: hygieneDelta.delta, cost: PET_ACTIONS.cleanCost }
    };
  };

  /**
   * Visits the vet to restore health.
   * @param {{ id: string, name: string, cost: number, healthRestore: number }} vetOption
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const healthCheck = (vetOption) => {
    const affordability = validateItemCost(vetOption.cost, wallet);
    if (!affordability.valid) return affordability;

    const healthDelta = safeDelta(petState.health, vetOption.healthRestore);
    if (!healthDelta.valid) {
      return { valid: false, error: 'Health is already at the maximum.' };
    }

    const bonus = vetOption.id === 'full_treatment' ? PET_ACTIONS.fullTreatmentBonus : 0;
    const hungerDelta = safeDelta(petState.hunger, bonus);
    const happinessDelta = safeDelta(petState.happiness, bonus);
    const energyDelta = safeDelta(petState.energy, bonus);
    const hygieneDelta = safeDelta(petState.hygiene, bonus);

    if (!hungerDelta.valid || !happinessDelta.valid || !energyDelta.valid || !hygieneDelta.valid) {
      return { valid: false, error: 'Those boosts would overfill a stat.' };
    }

    setPetState((prev) => {
      const next = {
        ...prev,
        health: prev.health + healthDelta.delta,
        hunger: prev.hunger + hungerDelta.delta,
        happiness: prev.happiness + happinessDelta.delta,
        energy: prev.energy + energyDelta.delta,
        hygiene: prev.hygiene + hygieneDelta.delta
      };
      if (next.health < STAT_THRESHOLDS.criticalHealth && !next.healthBottomedOut) {
        next.healthBottomedOut = true;
      }
      return next;
    });

    logAction('vet', vetOption.cost, `${petState.name} received ${vetOption.name}.`);
    return {
      valid: true,
      error: null,
      details: {
        item: vetOption.name,
        cost: vetOption.cost,
        healthDelta: healthDelta.delta,
        bonusDelta: bonus
      }
    };
  };

  /**
   * Teaches the pet a new trick.
   * @param {string} trickName
   * @returns {{ valid: boolean, error: string|null, details?: object }}
   */
  const learnTrick = (trickName) => {
    const affordability = validateItemCost(PET_ACTIONS.trickCost, wallet);
    if (!affordability.valid) return affordability;

    const trimmed = String(trickName || '').trim();
    if (!trimmed) {
      return { valid: false, error: 'Trick name cannot be empty.' };
    }
    if (petState.tricks.some((trick) => trick.toLowerCase() === trimmed.toLowerCase())) {
      return { valid: false, error: 'That trick is already known.' };
    }

    setPetState((prev) => ({
      ...prev,
      tricks: [...prev.tricks, trimmed]
    }));

    logAction('trick', PET_ACTIONS.trickCost, `${petState.name} learned ${trimmed}.`);
    return {
      valid: true,
      error: null,
      details: { trickName: trimmed, cost: PET_ACTIONS.trickCost }
    };
  };

  /**
   * Records a minigame play.
   * @returns {void}
   */
  const recordMinigame = () => {
    const validation = validateStatChange(0, 0);
    if (!validation.valid) return;
    setPetState((prev) => ({
      ...prev,
      minigamesPlayed: prev.minigamesPlayed + 1
    }));
  };

  /**
   * Resets the pet state back to the initial values.
   * @returns {void}
   */
  const resetPet = () => {
    const validation = validateStatChange(0, 0);
    if (!validation.valid) return;
    setPetState({ ...initialRef.current, actionLog: [] });
  };

  const petStateMemo = useMemo(() => petState, [petState]);

  return {
    petState: petStateMemo,
    feed,
    play,
    rest,
    clean,
    healthCheck,
    learnTrick,
    recordMinigame,
    resetPet
  };
}
