/**
 * Validates pet name input.
 * @param {string} name - The pet name to validate.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validatePetName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Pet name is required.' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Pet name must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
    return { valid: false, error: 'Use letters, numbers, and spaces only.' };
  }
  return { valid: true, error: null };
}

/**
 * Validates starting budget selection.
 * @param {number} amount - Budget amount in dollars.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateBudget(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return { valid: false, error: 'Budget must be a number.' };
  }
  if (amount < 50 || amount > 500) {
    return { valid: false, error: 'Budget must be between $50 and $500.' };
  }
  if (amount % 10 !== 0) {
    return { valid: false, error: 'Budget must be in $10 increments.' };
  }
  return { valid: true, error: null };
}

/**
 * Semantic validation checks player can afford an item.
 * @param {number} cost - Item cost.
 * @param {number} wallet - Current wallet balance.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateItemCost(cost, wallet) {
  if (typeof cost !== 'number' || cost <= 0) {
    return { valid: false, error: 'Item cost must be greater than zero.' };
  }
  if (wallet < cost) {
    return { valid: false, error: "You can't afford that yet." };
  }
  return { valid: true, error: null };
}

/**
 * Ensures stat change keeps value in valid range.
 * @param {number} current - Current stat value.
 * @param {number} delta - Change to apply.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateStatChange(current, delta) {
  const next = current + delta;
  if (next < 0 || next > 100) {
    return { valid: false, error: 'Stat change out of bounds.' };
  }
  return { valid: true, error: null };
}

/**
 * Validates savings goal amount.
 * @param {number} goal - Savings goal in dollars.
 * @param {number} budget - Total starting budget.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateSavingsGoal(goal, budget) {
  if (typeof goal !== 'number' || Number.isNaN(goal)) {
    return { valid: false, error: 'Savings goal must be a number.' };
  }
  if (goal <= 0) {
    return { valid: false, error: 'Savings goal must be greater than zero.' };
  }
  if (goal > budget) {
    return { valid: false, error: 'Savings goal cannot exceed the budget.' };
  }
  if (!Number.isInteger(goal)) {
    return { valid: false, error: 'Savings goal must be a whole dollar amount.' };
  }
  return { valid: true, error: null };
}

/**
 * Validates owner name input.
 * @param {string} name - Owner name.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateOwnerName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Owner name is required.' };
  }
  if (trimmed.length > 30) {
    return { valid: false, error: 'Owner name must be 30 characters or less.' };
  }
  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmed)) {
    return { valid: false, error: "Use letters, numbers, spaces, apostrophes, periods, or hyphens only." };
  }
  return { valid: true, error: null };
}

export function validateTrickName(trickName, existingTricks = []) {
  const trimmed = String(trickName || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Trick name is required.' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Trick name must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Use letters, numbers, spaces, apostrophes, periods, or hyphens only.' };
  }
  if (existingTricks.some((trick) => trick.toLowerCase() === trimmed.toLowerCase())) {
    return { valid: false, error: 'That trick is already known.' };
  }
  return { valid: true, error: null };
}
