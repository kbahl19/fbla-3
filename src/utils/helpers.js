/**
 * Derives the pet mood from stat values.
 * @param {{ hunger: number, happiness: number, health: number, energy: number, hygiene: number }} petState
 * @returns {string}
 */
export function deriveMood(petState) {
  const weighted =
    petState.hunger * 0.3 +
    petState.happiness * 0.3 +
    petState.health * 0.25 +
    petState.energy * 0.1 +
    petState.hygiene * 0.05;

  if (petState.health < 30) {
    return 'sick';
  }
  if (petState.energy < 25) {
    return 'tired';
  }
  if (petState.energy > 85) {
    return 'energetic';
  }
  if (weighted > 75) {
    return 'happy';
  }
  if (weighted < 40) {
    return 'sad';
  }
  return 'content';
}

/**
 * Returns the evolution stage for a given age.
 * @param {number} age
 * @returns {'baby'|'teen'|'adult'}
 */
export function getEvolutionStage(age) {
  if (age < 5) {
    return 'baby';
  }
  if (age < 10) {
    return 'teen';
  }
  return 'adult';
}

/**
 * Formats a number as USD currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
}

/**
 * Calculates the care grade from average stat values.
 * @param {{ hunger: number, happiness: number, health: number, energy: number, hygiene: number }} petState
 * @returns {string}
 */
export function calculateCareGrade(petState) {
  const average =
    (petState.hunger + petState.happiness + petState.health + petState.energy + petState.hygiene) / 5;
  if (average >= 90) return 'A';
  if (average >= 75) return 'B';
  if (average >= 60) return 'C';
  if (average >= 45) return 'D';
  return 'F';
}

/**
 * Returns a Tailwind background color class for a stat value.
 * @param {number} value
 * @returns {string}
 */
export function getStatColor(value) {
  if (value > 60) return 'bg-[#6bcb77]';
  if (value >= 30) return 'bg-[#ffd93d]';
  return 'bg-[#ff6b6b]';
}

/**
 * Clamps a stat value to the valid range.
 * @param {number} value
 * @returns {number}
 */
export function clampStat(value) {
  return Math.min(100, Math.max(0, value));
}
/**
 * Calculates average pet stat (0–100).
 * @param {{ hunger, happiness, health, energy, hygiene }} petState
 * @returns {number}
 */
export function calculateAvgStat(petState) {
  return Math.round(
    (petState.hunger + petState.happiness + petState.health + petState.energy + petState.hygiene) / 5
  );
}

/**
 * Final score = wallet value + avgStat x 2.
 * @param {{ hunger, happiness, health, energy, hygiene }} petState
 * @param {{ wallet: number }} financeState
 * @returns {number}
 */
export function calculateScore(petState, financeState) {
  const avg = calculateAvgStat(petState);
  return Math.round(Math.max(0, financeState.wallet) + avg * 2);
}
