/**
 * ScoringEngine — 4-component scoring for the pet financial responsibility simulation.
 *
 * Final Score = 0.4 * Wellbeing + 0.3 * Financial + 0.2 * Consistency - 0.1 * Volatility
 * Clamped to 0–100, rounded to nearest integer.
 *
 * --- PRESENTATION SUMMARY (5 sentences) ---
 * "Your score has four parts, each measuring a different aspect of how well you cared
 * for your pet. Wellbeing (40%) averages your pet's happiness, health, and energy across
 * every week — it's the biggest factor because your pet's quality of life is the whole point.
 * Financial Responsibility (30%) rewards preventive spending like regular food and routine
 * checkups over emergency vet visits — planning ahead is worth more than reacting to crises.
 * Consistency (20%) penalizes large week-to-week stat swings, because good pet care is
 * steady and routine, not feast-or-famine. Finally, Spending Volatility (10% penalty)
 * subtracts points for erratic spending spikes — stable budgeting is a sign of financial
 * responsibility, which is the whole theme of this simulation."
 */

export class ScoringEngine {
  /**
   * @param {object} params
   * @param {{ happiness: number, health: number, energy: number }[]} params.dailySnapshots
   *   One snapshot per in-game week, recorded at the end of each week.
   * @param {number[]} params.weeklySpending
   *   Total spending amount per week (same length as dailySnapshots).
   * @param {number} params.preventiveSpending
   *   Cumulative spending on preventive care (food, toys, cleaning, routine vet).
   * @param {number} params.emergencySpending
   *   Cumulative spending on emergency/reactive care (full treatment).
   */
  constructor({ dailySnapshots = [], weeklySpending = [], preventiveSpending = 0, emergencySpending = 0 }) {
    this.snapshots          = dailySnapshots;
    this.weeklySpending     = weeklySpending;
    this.preventiveSpending = preventiveSpending;
    this.emergencySpending  = emergencySpending;
    this.totalSpending      = preventiveSpending + emergencySpending;
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  _mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  }

  // Population standard deviation
  _stddev(arr) {
    if (arr.length < 2) return 0;
    const mean = this._mean(arr);
    const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
  }

  _clamp(v, min = 0, max = 100) {
    return Math.min(max, Math.max(min, v));
  }

  // ─── Component 1: Pet Wellbeing (40%) ───────────────────────────────────────

  /**
   * Average of (happiness + health + energy) / 3 across all weekly snapshots.
   * Hunger is excluded — it already drives health and happiness decay.
   * Returns 50 (neutral) if no data yet.
   */
  calculate_wellbeing() {
    if (!this.snapshots.length) return 50;
    const weeklyAverages = this.snapshots.map(
      (s) => (s.happiness + s.health + s.energy) / 3
    );
    return this._clamp(this._mean(weeklyAverages));
  }

  // ─── Component 2: Financial Responsibility (30%) ─────────────────────────────

  /**
   * preventive_ratio = preventive_spending / total_spending * 100
   * 100 = all spending was preventive (best)
   * 0   = all spending was emergency/reactive (worst)
   * 50  = neutral baseline when no spending recorded
   */
  calculate_financial_score() {
    if (this.totalSpending === 0) return 50;
    const ratio = this.preventiveSpending / this.totalSpending;
    return this._clamp(ratio * 100);
  }

  // ─── Component 3: Care Consistency (20%) ────────────────────────────────────

  /**
   * For each consecutive week pair, compute absolute stat changes for
   * happiness, health, energy. Max instability per period = 300 (3 stats × 100).
   * Normalize to 0–100 and average. Perfect consistency = 100.
   */
  calculate_consistency_score() {
    if (this.snapshots.length < 2) return 100; // single snapshot = no swings
    const stabilityScores = [];
    for (let i = 1; i < this.snapshots.length; i++) {
      const prev = this.snapshots[i - 1];
      const curr = this.snapshots[i];
      const instability =
        Math.abs(curr.happiness - prev.happiness) +
        Math.abs(curr.health    - prev.health)    +
        Math.abs(curr.energy    - prev.energy);
      // 300 = maximum possible instability (3 stats each swinging 100)
      const stabilityScore = 100 - (instability / 300) * 100;
      stabilityScores.push(this._clamp(stabilityScore));
    }
    return this._clamp(this._mean(stabilityScores));
  }

  // ─── Component 4: Spending Volatility Penalty (10%) ─────────────────────────

  /**
   * Coefficient of variation = stddev / mean, normalized to 0–100.
   * Low volatility → low penalty. Erratic spending spikes → high penalty.
   * Returns 0 if no spending data (no penalty).
   */
  calculate_volatility_score() {
    if (!this.weeklySpending.length) return 0;
    const mean = this._mean(this.weeklySpending);
    if (mean === 0) return 0; // nothing spent = stable
    const cv = this._stddev(this.weeklySpending) / mean;
    return this._clamp(cv * 100);
  }

  // ─── Final Score ─────────────────────────────────────────────────────────────

  /**
   * Final Score = 0.4W + 0.3F + 0.2C - 0.1V, clamped 0–100.
   * Returns all component scores plus the final score and classification.
   */
  calculate_final_score() {
    const wellbeing   = this.calculate_wellbeing();
    const financial   = this.calculate_financial_score();
    const consistency = this.calculate_consistency_score();
    const volatility  = this.calculate_volatility_score();

    const raw   = 0.4 * wellbeing + 0.3 * financial + 0.2 * consistency - 0.1 * volatility;
    const final = this._clamp(Math.round(raw));

    return {
      wellbeing:      Math.round(wellbeing),
      financial:      Math.round(financial),
      consistency:    Math.round(consistency),
      volatility:     Math.round(volatility),
      final,
      classification: classify(final)
    };
  }
}

// ─── Classification ──────────────────────────────────────────────────────────

const TIERS = [
  { min: 90, label: 'Elite Owner',        color: '#ffd93d' },
  { min: 75, label: 'Responsible Owner',  color: '#6bcb77' },
  { min: 60, label: 'Learning Owner',     color: '#4d96ff' },
  { min: 40, label: 'Struggling Owner',   color: '#c77dff' },
  { min:  0, label: 'Neglectful Owner',   color: '#ff6b6b' }
];

export function classify(score) {
  return TIERS.find((t) => score >= t.min) || TIERS[TIERS.length - 1];
}
