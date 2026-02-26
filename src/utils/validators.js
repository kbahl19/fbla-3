// All validators return { valid: boolean, error: string | null }
// so callers can handle errors uniformly without try/catch.

// Pet names are intentionally more restricted than owner names —
// no punctuation so the name is safe to embed in leaderboard/report labels.
export function validatePetName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { valid: false, error: 'Pet name is required.' };
  if (trimmed.length > 20) return { valid: false, error: 'Pet name must be 20 characters or less.' };
  // Only letters, digits, and spaces — no punctuation or special characters
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) return { valid: false, error: 'Use letters, numbers, and spaces only.' };
  return { valid: true, error: null };
}

// $10 increment enforced so the UI slider doesn't need to handle arbitrary values.
export function validateBudget(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return { valid: false, error: 'Budget must be a number.' };
  if (amount < 50 || amount > 500) return { valid: false, error: 'Budget must be between $50 and $500.' };
  if (amount % 10 !== 0) return { valid: false, error: 'Budget must be in $10 increments.' };
  return { valid: true, error: null };
}

export function validateItemCost(cost, wallet) {
  if (typeof cost !== 'number' || cost <= 0) return { valid: false, error: 'Item cost must be greater than zero.' };
  if (wallet < cost) return { valid: false, error: "You can't afford that yet." };
  return { valid: true, error: null };
}

// Stats are bounded 0–100. A delta is invalid if it would push the value outside that range.
// This is a secondary guard; clampStat in helpers already caps the value before this is called.
export function validateStatChange(current, delta) {
  const next = current + delta;
  if (next < 0 || next > 100) return { valid: false, error: 'Stat change out of bounds.' };
  return { valid: true, error: null };
}

export function validateSavingsGoal(goal, budget) {
  if (typeof goal !== 'number' || Number.isNaN(goal)) return { valid: false, error: 'Savings goal must be a number.' };
  if (goal <= 0) return { valid: false, error: 'Savings goal must be greater than zero.' };
  if (goal > budget) return { valid: false, error: 'Savings goal cannot exceed the budget.' };
  if (!Number.isInteger(goal)) return { valid: false, error: 'Savings goal must be a whole dollar amount.' };
  return { valid: true, error: null };
}

// Owner names allow punctuation that pet names don't (e.g. "O'Brien", "Mary-Jane")
// since they appear in human-readable report headings rather than data keys.
export function validateOwnerName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { valid: false, error: 'Owner name is required.' };
  if (trimmed.length > 30) return { valid: false, error: 'Owner name must be 30 characters or less.' };
  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmed)) return { valid: false, error: "Use letters, numbers, spaces, apostrophes, periods, or hyphens only." };
  return { valid: true, error: null };
}

export function validateSelection(value, allowedValues, label = 'Selection') {
  if (!value) return { valid: false, error: `${label} is required.` };
  if (!Array.isArray(allowedValues) || !allowedValues.includes(value)) return { valid: false, error: `Choose a valid ${label.toLowerCase()}.` };
  return { valid: true, error: null };
}

// If either name is blank we skip the comparison — the individual name validators
// will catch the missing value. This function is only responsible for the
// distinctness rule, not for presence.
export function validateDistinctNames(ownerName, petName) {
  const owner = String(ownerName || '').trim().toLowerCase();
  const pet = String(petName || '').trim().toLowerCase();
  if (!owner || !pet) return { valid: true, error: null };
  if (owner === pet) return { valid: false, error: 'Owner name and pet name should be different for clarity.' };
  return { valid: true, error: null };
}

// Duplicate check is case-insensitive so "Sit" and "sit" are treated as the same trick.
export function validateTrickName(trickName, existingTricks = []) {
  const trimmed = String(trickName || '').trim();
  if (!trimmed) return { valid: false, error: 'Trick name is required.' };
  if (trimmed.length > 20) return { valid: false, error: 'Trick name must be 20 characters or less.' };
  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmed)) return { valid: false, error: 'Use letters, numbers, spaces, apostrophes, periods, or hyphens only.' };
  if (existingTricks.some((trick) => trick.toLowerCase() === trimmed.toLowerCase())) return { valid: false, error: 'That trick is already known.' };
  return { valid: true, error: null };
}
