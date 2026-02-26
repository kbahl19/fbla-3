// Final Score = 0.4 * Wellbeing + 0.3 * Financial + 0.2 * Consistency - 0.1 * Volatility
// Clamped to 0–100, rounded to nearest integer.

export class ScoringEngine {
  constructor({ dailySnapshots = [], weeklySpending = [], preventiveSpending = 0, emergencySpending = 0 }) {
    this.snapshots          = dailySnapshots;
    this.weeklySpending     = weeklySpending;
    this.preventiveSpending = preventiveSpending;
    this.emergencySpending  = emergencySpending;
    this.totalSpending      = preventiveSpending + emergencySpending;
  }

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

  // 40% — average of (happiness + health + energy) / 3 across all weekly snapshots
  // Hunger excluded — it already drives health and happiness decay
  calculate_wellbeing() {
    if (!this.snapshots.length) return 50;
    const weeklyAverages = this.snapshots.map(
      (s) => (s.happiness + s.health + s.energy) / 3
    );
    return this._clamp(this._mean(weeklyAverages));
  }

  // 30% — ratio of preventive to total spending (100 = all preventive, 0 = all emergency)
  calculate_financial_score() {
    if (this.totalSpending === 0) return 50;
    const ratio = this.preventiveSpending / this.totalSpending;
    return this._clamp(ratio * 100);
  }

  // 20% — penalizes large week-to-week swings in happiness, health, energy
  calculate_consistency_score() {
    if (this.snapshots.length < 2) return 100;
    const stabilityScores = [];
    for (let i = 1; i < this.snapshots.length; i++) {
      const prev = this.snapshots[i - 1];
      const curr = this.snapshots[i];
      const instability =
        Math.abs(curr.happiness - prev.happiness) +
        Math.abs(curr.health    - prev.health)    +
        Math.abs(curr.energy    - prev.energy);
      // 300 = max possible instability (3 stats × 100)
      stabilityScores.push(this._clamp(100 - (instability / 300) * 100));
    }
    return this._clamp(this._mean(stabilityScores));
  }

  // 10% penalty — coefficient of variation on weekly spending
  // Low volatility → small penalty; erratic spikes → larger penalty
  calculate_volatility_score() {
    if (!this.weeklySpending.length) return 0;
    const mean = this._mean(this.weeklySpending);
    if (mean === 0) return 0;
    const cv = this._stddev(this.weeklySpending) / mean;
    return this._clamp(cv * 100);
  }

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
