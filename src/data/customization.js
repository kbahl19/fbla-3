export const COLOR_THEMES = [
  {
    id: 'sunrise',
    label: 'Sunrise Gold',
    accent: '#ffd93d',
    accentSoft: 'rgba(255, 217, 61, 0.24)',
    surface: 'linear-gradient(135deg, rgba(255,217,61,0.18), rgba(26,24,40,0.88))',
    halo: 'radial-gradient(circle at 50% 35%, rgba(255,217,61,0.28), transparent 65%)'
  },
  {
    id: 'ocean',
    label: 'Ocean Blue',
    accent: '#4d96ff',
    accentSoft: 'rgba(77, 150, 255, 0.24)',
    surface: 'linear-gradient(135deg, rgba(77,150,255,0.2), rgba(26,24,40,0.88))',
    halo: 'radial-gradient(circle at 50% 35%, rgba(77,150,255,0.28), transparent 65%)'
  },
  {
    id: 'forest',
    label: 'Forest Mint',
    accent: '#6bcb77',
    accentSoft: 'rgba(107, 203, 119, 0.24)',
    surface: 'linear-gradient(135deg, rgba(107,203,119,0.2), rgba(26,24,40,0.88))',
    halo: 'radial-gradient(circle at 50% 35%, rgba(107,203,119,0.28), transparent 65%)'
  },
  {
    id: 'cosmic',
    label: 'Cosmic Rose',
    accent: '#ff6b6b',
    accentSoft: 'rgba(255, 107, 107, 0.22)',
    surface: 'linear-gradient(135deg, rgba(255,107,107,0.18), rgba(199,125,255,0.16), rgba(26,24,40,0.9))',
    halo: 'radial-gradient(circle at 50% 35%, rgba(199,125,255,0.28), transparent 65%)'
  }
];

export const ACCESSORIES = [
  { id: 'bandana', label: 'Bandana', emoji: '🧣', description: 'Adventure-ready neckwear.' },
  { id: 'bow', label: 'Bow', emoji: '🎀', description: 'Judge-friendly polished look.' },
  { id: 'glasses', label: 'Glasses', emoji: '🕶️', description: 'Cool and confident style.' },
  { id: 'crown', label: 'Crown', emoji: '👑', description: 'Championship energy.' }
];

export const PERSONALITIES = [
  { id: 'calm', label: 'Calm', tagline: 'Steady planner', emoji: '🫶' },
  { id: 'playful', label: 'Playful', tagline: 'Always ready to play', emoji: '🎉' },
  { id: 'curious', label: 'Curious', tagline: 'Loves exploring', emoji: '🔎' },
  { id: 'focused', label: 'Focused', tagline: 'Budget-minded learner', emoji: '📘' }
];

export const DEFAULT_CUSTOMIZATION = {
  colorTheme: COLOR_THEMES[0].id,
  accessory: ACCESSORIES[0].id,
  personality: PERSONALITIES[0].id
};

const isValidId = (value, options) => options.some((option) => option.id === value);

export function normalizeCustomization(customization) {
  const source = customization && typeof customization === 'object' ? customization : {};
  return {
    colorTheme: isValidId(source.colorTheme, COLOR_THEMES) ? source.colorTheme : DEFAULT_CUSTOMIZATION.colorTheme,
    accessory: isValidId(source.accessory, ACCESSORIES) ? source.accessory : DEFAULT_CUSTOMIZATION.accessory,
    personality: isValidId(source.personality, PERSONALITIES) ? source.personality : DEFAULT_CUSTOMIZATION.personality
  };
}

export function getCustomizationMeta(customization) {
  const normalized = normalizeCustomization(customization);
  return {
    theme: COLOR_THEMES.find((option) => option.id === normalized.colorTheme) || COLOR_THEMES[0],
    accessory: ACCESSORIES.find((option) => option.id === normalized.accessory) || ACCESSORIES[0],
    personality: PERSONALITIES.find((option) => option.id === normalized.personality) || PERSONALITIES[0],
    customization: normalized
  };
}
