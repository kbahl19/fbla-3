import { useMemo, useState } from 'react';
import { PETS } from '../data/pets';
import { ANIMAL_COLORS, ACCESSORIES, DEFAULT_CUSTOMIZATION, getCustomizationMeta } from '../data/customization';
import { validateDistinctNames, validateOwnerName, validatePetName, validateSelection } from '../utils/validators';

export default function SetupScreen({ onStart }) {
  const [petName, setPetName]     = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [petType, setPetType]     = useState(PETS[0]?.id || 'dog');
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
  const [errors, setErrors]       = useState({});

  const petMeta = useMemo(() => PETS.find((p) => p.id === petType) || PETS[0], [petType]);
  const meta    = useMemo(() => getCustomizationMeta(customization), [customization]);

  const setColor     = (animalColor) => setCustomization((prev) => ({ ...prev, animalColor }));
  const setAccessory = (accessory)   => setCustomization((prev) => ({ ...prev, accessory }));

  const handleSubmit = () => {
    const nameV    = validatePetName(petName);
    const ownerV   = validateOwnerName(ownerName);
    const distinctV = validateDistinctNames(ownerName, petName);
    const typeV    = validateSelection(petType, PETS.map((p) => p.id), 'Pet type');
    const colorV   = validateSelection(customization.animalColor, ANIMAL_COLORS.map((c) => c.id), 'Color');
    const accV     = validateSelection(customization.accessory,   ACCESSORIES.map((a) => a.id),   'Accessory');

    const next = {
      petName:   nameV.valid    ? null : nameV.error,
      ownerName: ownerV.valid   ? null : ownerV.error,
      petType:   typeV.valid    ? null : typeV.error,
      color:     colorV.valid   ? null : colorV.error,
      accessory: accV.valid     ? null : accV.error,
      setup:     distinctV.valid ? null : distinctV.error
    };
    setErrors(next);

    if (nameV.valid && ownerV.valid && distinctV.valid && typeV.valid && colorV.valid && accV.valid) {
      onStart({ name: petName.trim(), type: petType, ownerName: ownerName.trim(), customization: meta.customization });
    }
  };

  const anyError = Object.values(errors).some(Boolean);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d0c1a] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <span className="font-heading text-2xl text-[#ffd93d] tracking-wide">PetPal</span>
        <span className="text-sm text-[#a7a9be]">Build Your Character</span>
        <div className="rounded-xl border border-white/10 bg-[#1a1828] px-4 py-2 text-sm">
          <span className="text-[#a7a9be]">Start: </span>
          <span className="font-heading text-[#6bcb77]">$200</span>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT — options panel */}
        <div className="flex flex-col gap-5 px-8 py-6 w-[420px] shrink-0 overflow-y-auto border-r border-white/5">

          {/* Pet type */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#a7a9be] mb-3">Choose Pet</p>
            <div className="grid grid-cols-3 gap-2">
              {PETS.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setPetType(pet.id)}
                  className={`rounded-xl border px-2 py-3 flex flex-col items-center gap-1 transition-all duration-150 ${
                    petType === pet.id
                      ? 'border-[#ffd93d] bg-[#ffd93d]/10'
                      : 'border-white/8 bg-[#1a1828] hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{pet.emoji_baby}</span>
                  <span className="text-xs font-semibold text-white">{pet.name}</span>
                </button>
              ))}
            </div>
            {errors.petType && <p className="mt-1 text-xs text-[#ff6b6b]">{errors.petType}</p>}
          </div>

          {/* Animal color */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#a7a9be] mb-3">Color</p>
            <div className="flex gap-3 flex-wrap">
              {ANIMAL_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColor(color.id)}
                  title={color.label}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-150 ${
                    customization.animalColor === color.id
                      ? 'scale-125 border-white'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex, boxShadow: customization.animalColor === color.id ? `0 0 12px ${color.hex}` : 'none' }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#a7a9be]">{meta.color.label}</p>
            {errors.color && <p className="mt-1 text-xs text-[#ff6b6b]">{errors.color}</p>}
          </div>

          {/* Accessory */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#a7a9be] mb-3">Accessory</p>
            <div className="flex gap-2">
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccessory(acc.id)}
                  className={`flex-1 rounded-xl border py-3 flex flex-col items-center gap-1 transition-all duration-150 ${
                    customization.accessory === acc.id
                      ? 'border-[#ffd93d] bg-[#ffd93d]/10'
                      : 'border-white/8 bg-[#1a1828] hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{acc.emoji}</span>
                  <span className="text-xs font-semibold text-white">{acc.label}</span>
                </button>
              ))}
            </div>
            {errors.accessory && <p className="mt-1 text-xs text-[#ff6b6b]">{errors.accessory}</p>}
          </div>

          {/* Name inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#a7a9be] mb-2">Your Name</p>
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                maxLength={30}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2.5 text-sm text-white outline-none focus:border-[#ffd93d] placeholder:text-[#4a4869]"
              />
              {errors.ownerName && <p className="mt-1 text-xs text-[#ff6b6b]">{errors.ownerName}</p>}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#a7a9be] mb-2">Pet Name</p>
              <input
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                maxLength={20}
                placeholder="e.g. Nova"
                className="w-full rounded-xl border border-white/10 bg-[#1a1828] px-3 py-2.5 text-sm text-white outline-none focus:border-[#ffd93d] placeholder:text-[#4a4869]"
              />
              {errors.petName && <p className="mt-1 text-xs text-[#ff6b6b]">{errors.petName}</p>}
            </div>
          </div>
          {errors.setup && <p className="-mt-2 text-xs text-[#ff6b6b]">{errors.setup}</p>}

          {/* Start button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-auto rounded-2xl py-4 font-heading text-lg text-[#0d0c1a] bg-[#ffd93d] hover:bg-[#ffe566] active:scale-95 transition-all duration-150 shadow-lg"
            style={{ boxShadow: '0 4px 24px rgba(255,217,61,0.35)' }}
          >
            Start Game →
          </button>
          {anyError && <p className="text-center text-xs text-[#ff6b6b]">Please fix the errors above.</p>}
        </div>

        {/* RIGHT — pet preview */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
          {/* Background glow matching color */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 45%, ${meta.color.glow}, transparent 65%)` }}
          />

          {/* Pet circle */}
          <div
            className="relative flex items-center justify-center rounded-full border-2 text-[9rem] animate-pet-float shadow-2xl"
            style={{
              width: '260px',
              height: '260px',
              borderColor: `${meta.color.hex}66`,
              background: `radial-gradient(circle, ${meta.color.glow}, rgba(13,12,26,0.6))`,
              boxShadow: `0 0 60px ${meta.color.glow}, 0 0 120px ${meta.color.glow}`
            }}
          >
            {petMeta?.emoji_baby}
            {/* Accessory */}
            <span className="absolute top-4 right-6 text-4xl drop-shadow-lg">
              {meta.accessory.emoji}
            </span>
          </div>

          {/* Name display */}
          <div className="relative text-center">
            <p className="font-heading text-4xl text-white drop-shadow">{petName.trim() || 'Your Pet'}</p>
            <p className="mt-1 text-sm text-[#a7a9be]">
              {petMeta?.name} · {meta.color.label} · {meta.accessory.emoji} {meta.accessory.label}
            </p>
            {ownerName.trim() && (
              <p className="mt-1 text-xs text-[#6b7280]">Owner: {ownerName.trim()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
