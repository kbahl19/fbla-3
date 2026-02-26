// Weighted formula: hunger and happiness matter most, hygiene least.
// The health and energy checks run first and override the weighted score —
// a sick or exhausted pet has a fixed mood regardless of everything else.
export function deriveMood(petState) {
  const weighted =
    petState.hunger * 0.3 +
    petState.happiness * 0.3 +
    petState.health * 0.25 +
    petState.energy * 0.1 +
    petState.hygiene * 0.05;

  if (petState.health < 30) return 'sick';      // health crisis overrides everything
  if (petState.energy < 25) return 'tired';     // too exhausted to show other emotions
  if (petState.energy > 85) return 'energetic'; // high energy overrides the weighted score too
  if (weighted > 75) return 'happy';
  if (weighted < 40) return 'sad';
  return 'content';
}

// Age is incremented once per minute (AGE_INTERVAL_MS = 60000 in usePet).
// baby: 0–4 min, teen: 5–9 min, adult: 10+ min.
export function getEvolutionStage(age) {
  if (age < 5) return 'baby';
  if (age < 10) return 'teen';
  return 'adult';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
}

// Simple letter grade shown on the report — plain average of all 5 stats.
// Not the same as the scoring engine's Wellbeing component, which only uses
// happiness, health, and energy.
export function calculateCareGrade(petState) {
  const average =
    (petState.hunger + petState.happiness + petState.health + petState.energy + petState.hygiene) / 5;
  if (average >= 90) return 'A';
  if (average >= 75) return 'B';
  if (average >= 60) return 'C';
  if (average >= 45) return 'D';
  return 'F';
}

// Three-tier color for stat bars: green → yellow → red.
// The red threshold (below 30) aligns with the fast-decay zone in usePet.
export function getStatColor(value) {
  if (value > 60) return 'bg-[#6bcb77]';
  if (value >= 30) return 'bg-[#ffd93d]';
  return 'bg-[#ff6b6b]';
}

export function clampStat(value) {
  return Math.min(100, Math.max(0, value));
}

export function calculateAvgStat(petState) {
  return Math.round(
    (petState.hunger + petState.happiness + petState.health + petState.energy + petState.hygiene) / 5
  );
}

// Final score = wallet + avgStat * 2
export function calculateScore(petState, financeState) {
  const avg = calculateAvgStat(petState);
  return Math.round(Math.max(0, financeState.wallet) + avg * 2);
}
