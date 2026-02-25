export const BADGES = [
  {
    id: 'first_meal',
    name: 'First Meal',
    emoji: '🍽️',
    description: 'Fed your pet for the first time.',
    condition: (petState) => petState.actionLog.some((entry) => entry.action === 'feed')
  },
  {
    id: 'doctors_orders',
    name: "Doctor's Orders",
    emoji: '🩺',
    description: 'Booked the first vet visit.',
    condition: (petState) => petState.actionLog.some((entry) => entry.action === 'vet')
  },
  {
    id: 'joy_maximizer',
    name: 'Joy Maximizer',
    emoji: '🎉',
    description: 'Reached maximum happiness.',
    condition: (petState) => petState.happiness >= 100
  },
  {
    id: 'glow_up',
    name: 'Glow Up',
    emoji: '✨',
    description: 'Evolved into the growth stage.',
    condition: (petState) => petState.stage === 'teen' || petState.stage === 'adult'
  },
  {
    id: 'full_grown',
    name: 'Full Grown',
    emoji: '🏆',
    description: 'Reached the established stage.',
    condition: (petState) => petState.stage === 'adult'
  },
  {
    id: 'penny_pincher',
    name: 'Penny Pincher',
    emoji: '💰',
    description: 'Saved at least $50 beyond spending.',
    condition: (_petState, financeState) =>
      financeState.wallet - financeState.totalSpent >= 50
  },
  {
    id: 'minigame_master',
    name: 'Minigame Master',
    emoji: '🎮',
    description: 'Played the minigame five times.',
    condition: (petState) => petState.minigamesPlayed >= 5
  },
  {
    id: 'peak_performance',
    name: 'Peak Performance',
    emoji: '🚀',
    description: 'All stats above 80 at once.',
    condition: (petState) =>
      [petState.hunger, petState.happiness, petState.energy, petState.health, petState.hygiene].every(
        (stat) => stat > 80
      )
  },
  {
    id: 'trick_master',
    name: 'Trick Master',
    emoji: '🎯',
    description: 'Learned three tricks.',
    condition: (petState) => petState.tricks.length >= 3
  },
  {
    id: 'responsible_owner',
    name: 'Responsible Owner',
    emoji: '🫶',
    description: 'Completed the session with safe health levels.',
    condition: (petState) => !petState.healthBottomedOut && petState.stage === 'adult'
  }
];