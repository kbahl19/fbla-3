export const FOOD_ITEMS = [
  {
    id: 'basic_kibble',
    name: 'Basic Kibble',
    cost: 8,
    hungerRestore: 15,
    happinessBonus: 0,
    emoji: '🥣'
  },
  {
    id: 'premium_meal',
    name: 'Premium Meal',
    cost: 18,
    hungerRestore: 30,
    happinessBonus: 5,
    emoji: '🍲'
  },
  {
    id: 'gourmet_feast',
    name: 'Gourmet Feast',
    cost: 32,
    hungerRestore: 50,
    happinessBonus: 15,
    emoji: '🍱'
  },
  {
    id: 'mystery_snack',
    name: 'Mystery Snack',
    cost: 4,
    hungerRestore: 5,
    happinessBonus: 0,
    emoji: '🎁'
  }
];

export const TOY_ITEMS = [
  {
    id: 'yarn_ball',
    name: 'Yarn Ball',
    cost: 10,
    happinessRestore: 20,
    energyCost: 10,
    emoji: '🧶'
  },
  {
    id: 'puzzle_toy',
    name: 'Puzzle Toy',
    cost: 22,
    happinessRestore: 35,
    energyCost: 15,
    emoji: '🧩'
  },
  {
    id: 'luxury_playset',
    name: 'Luxury Playset',
    cost: 40,
    happinessRestore: 50,
    energyCost: 20,
    emoji: '🎠'
  }

];

export const VET_OPTIONS = [
  {
    id: 'checkup',
    name: 'Checkup',
    cost: 25,
    healthRestore: 20,
    emoji: '🩺',
    preventive: true
  },
  {
    id: 'full_treatment',
    name: 'Full Treatment',
    cost: 60,
    healthRestore: 50,
    emoji: '🏥',
    preventive: false
  }
];