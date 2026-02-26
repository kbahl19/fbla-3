export const ANIMAL_COLORS = [
  { id: 'golden',   label: 'Golden',   hex: '#f5a623', glow: 'rgba(245,166,35,0.45)' },
  { id: 'snow',     label: 'Snow',     hex: '#e8eaf6', glow: 'rgba(232,234,246,0.45)' },
  { id: 'midnight', label: 'Midnight', hex: '#3a3adb', glow: 'rgba(58,58,219,0.50)' },
  { id: 'crimson',  label: 'Crimson',  hex: '#e03131', glow: 'rgba(224,49,49,0.45)' },
  { id: 'jade',     label: 'Jade',     hex: '#2f9e44', glow: 'rgba(47,158,68,0.45)' },
  { id: 'violet',   label: 'Violet',   hex: '#9c36b5', glow: 'rgba(156,54,181,0.45)' }
];

export const ACCESSORIES = [
  { id: 'bandana', label: 'Bandana', emoji: '🧣' },
  { id: 'bow',     label: 'Bow',     emoji: '🎀' },
  { id: 'glasses', label: 'Glasses', emoji: '🕶️' },
  { id: 'crown',   label: 'Crown',   emoji: '👑' }
];

export const DEFAULT_CUSTOMIZATION = {
  animalColor: ANIMAL_COLORS[0].id,
  accessory: ACCESSORIES[0].id
};

const isValidId = (value, options) => options.some((option) => option.id === value);

export function normalizeCustomization(customization) {
  const source = customization && typeof customization === 'object' ? customization : {};
  return {
    animalColor: isValidId(source.animalColor, ANIMAL_COLORS) ? source.animalColor : DEFAULT_CUSTOMIZATION.animalColor,
    accessory:   isValidId(source.accessory,   ACCESSORIES)   ? source.accessory   : DEFAULT_CUSTOMIZATION.accessory
  };
}

export function getCustomizationMeta(customization) {
  const normalized = normalizeCustomization(customization);
  return {
    color:     ANIMAL_COLORS.find((c) => c.id === normalized.animalColor) || ANIMAL_COLORS[0],
    accessory: ACCESSORIES.find((a) => a.id === normalized.accessory)     || ACCESSORIES[0],
    customization: normalized
  };
}
