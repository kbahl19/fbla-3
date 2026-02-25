/**
 * Setup screen for creating a new pet session.
 * Props: onStart({ name, type, ownerName })
 */
import { useState } from 'react';
import { PETS } from '../data/pets';
import { validatePetName, validateOwnerName } from '../utils/validators';

export default function SetupScreen({ onStart }) {
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [petType, setPetType] = useState(PETS[0]?.id || 'dog');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const nameValidation = validatePetName(petName);
    const ownerValidation = validateOwnerName(ownerName);
    const typeValid = petType ? { valid: true } : { valid: false, error: 'Choose a pet type.' };

    const nextErrors = {
      petName: nameValidation.valid ? null : nameValidation.error,
      ownerName: ownerValidation.valid ? null : ownerValidation.error,
      petType: typeValid.valid ? null : typeValid.error
    };

    setErrors(nextErrors);

    if (nameValidation.valid && ownerValidation.valid && typeValid.valid) {
      onStart({ name: petName.trim(), type: petType, ownerName: ownerName.trim() });
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-8 shadow-xl">
        <h1 className="font-heading text-4xl text-[#ffd93d]">PetPal</h1>
        <p className="mt-2 text-[#a7a9be]">
          Adopt a virtual pet and manage its care over 12 weeks. Balance your budget while keeping your pet happy and healthy!
        </p>

        {/* Objective card */}
        <div className="mt-6 rounded-2xl border border-[#4d96ff]/40 bg-[#4d96ff]/10 p-5">
          <h2 className="font-heading text-lg text-[#4d96ff]">The 12-Week Challenge</h2>
          <div className="mt-3 grid gap-2 text-sm text-[#a7a9be] sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
              <p className="font-semibold text-white">Weekly Salary</p>
              <p className="mt-1 text-xs">Keep your pet healthy to earn income each week. Health ≥70: $30 · Health 40–69: $15 · Health &lt;40: $0</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
              <p className="font-semibold text-white">Weekly Bills</p>
              <p className="mt-1 text-xs">$20/week in living costs are charged automatically whether you can afford them or not!</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#252338] p-3">
              <p className="font-semibold text-white">Final Score</p>
              <p className="mt-1 text-xs">After week 12, your score = wallet balance + (average pet stats × 2). Highest score wins!</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#a7a9be]">
            Play minigames to earn extra income. Teach tricks, earn badges, and evolve your pet. Every financial decision matters!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-3">
              <label className="text-sm uppercase tracking-wide text-[#a7a9be]">Your Name</label>
              <input
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#252338] px-4 py-3 text-white outline-none focus:border-[#4d96ff]"
                placeholder="Your name"
              />
              {errors.ownerName && <p className="text-sm text-[#ff6b6b]">{errors.ownerName}</p>}
            </div>
            <div className="grid gap-3">
              <label className="text-sm uppercase tracking-wide text-[#a7a9be]">Pet Name</label>
              <input
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#252338] px-4 py-3 text-white outline-none focus:border-[#4d96ff]"
                placeholder="e.g. Nova"
              />
              {errors.petName && <p className="text-sm text-[#ff6b6b]">{errors.petName}</p>}
            </div>
          </div>

          <div className="grid gap-3">
            <label className="text-sm uppercase tracking-wide text-[#a7a9be]">Choose Your Pet</label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PETS.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setPetType(pet.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-1 hover:border-[#4d96ff] ${
                    petType === pet.id ? 'border-[#4d96ff] bg-[#252338]' : 'border-white/10 bg-[#1f1d2f]'
                  }`}
                >
                  <div className="text-3xl">{pet.emoji_baby}</div>
                  <div className="mt-2 font-heading text-lg">{pet.name}</div>
                  <p className="mt-1 text-xs text-[#a7a9be]">{pet.description}</p>
                </button>
              ))}
            </div>
            {errors.petType && <p className="text-sm text-[#ff6b6b]">{errors.petType}</p>}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#252338] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Starting Balance</p>
                <p className="mt-1 font-heading text-2xl text-[#6bcb77]">$200.00</p>
              </div>
              <div className="grid gap-1 text-right text-xs text-[#a7a9be]">
                <p>12 weeks · $20/wk in bills</p>
                <p className="text-[#6bcb77]">Earn $15–$30/wk salary (if pet is healthy)</p>
                <p className="text-[#4d96ff]">Bonus income via minigames</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-[#4d96ff] px-6 py-4 font-heading text-lg text-white transition hover:scale-[1.01] active:scale-[0.99]"
          >
            Begin the 12-Week Journey
          </button>
        </form>
      </div>
    </div>
  );
}
