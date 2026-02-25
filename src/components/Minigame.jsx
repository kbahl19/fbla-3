/**
 * Minigame hub — choose from 5 minigames to earn extra coins.
 * Props: onEarn(amount, source), onRecordPlay(), onBack()
 */
import { useState } from 'react';
import FoodCatcher from './minigames/FoodCatcher';
import MemoryMatch from './minigames/MemoryMatch';
import ReflexTap from './minigames/ReflexTap';
import BudgetBlitz from './minigames/BudgetBlitz';
import SequenceSimon from './minigames/SequenceSimon';

const GAMES = [
  {
    id: 'food_catcher',
    name: 'Food Catcher',
    emoji: '🍎',
    description: 'Catch falling food items before they hit the ground. Use ← → arrow keys or A/D.',
    difficulty: 'Medium',
    maxEarnings: 15,
    difficultyColor: 'text-[#ffd93d]'
  },
  {
    id: 'memory_match',
    name: 'Memory Match',
    emoji: '🃏',
    description: 'Flip cards to find matching pet care pairs. Race against the 60-second clock!',
    difficulty: 'Hard',
    maxEarnings: 16,
    difficultyColor: 'text-[#ff6b6b]'
  },
  {
    id: 'reflex_tap',
    name: 'Reflex Tap',
    emoji: '🐾',
    description: 'Click the glowing paw before it disappears! Gets faster each round.',
    difficulty: 'Hard',
    maxEarnings: 15,
    difficultyColor: 'text-[#ff6b6b]'
  },
  {
    id: 'budget_blitz',
    name: 'Budget Blitz',
    emoji: '🧮',
    description: 'Answer pet budgeting math questions quickly. 8 seconds per question!',
    difficulty: 'Medium',
    maxEarnings: 20,
    difficultyColor: 'text-[#ffd93d]'
  },
  {
    id: 'sequence_simon',
    name: 'Care Sequence',
    emoji: '🎯',
    description: 'Memorize and repeat the pet care routine sequence. Each round gets longer!',
    difficulty: 'Hard',
    maxEarnings: 15,
    difficultyColor: 'text-[#ff6b6b]'
  }
];

export default function Minigame({ onEarn, onRecordPlay, onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleFinish = (amount, source) => {
    if (amount > 0) onEarn(amount, source);
    onRecordPlay();
    setSelectedGame(null);
  };

  const handleBackToHub = () => setSelectedGame(null);

  if (selectedGame === 'food_catcher') {
    return <FoodCatcher onFinish={handleFinish} onBack={handleBackToHub} />;
  }
  if (selectedGame === 'memory_match') {
    return <MemoryMatch onFinish={handleFinish} onBack={handleBackToHub} />;
  }
  if (selectedGame === 'reflex_tap') {
    return <ReflexTap onFinish={handleFinish} onBack={handleBackToHub} />;
  }
  if (selectedGame === 'budget_blitz') {
    return <BudgetBlitz onFinish={handleFinish} onBack={handleBackToHub} />;
  }
  if (selectedGame === 'sequence_simon') {
    return <SequenceSimon onFinish={handleFinish} onBack={handleBackToHub} />;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Earn Coins</h2>
            <p className="mt-1 text-sm text-[#a7a9be]">
              Play minigames to earn extra money for your pet's care. In real life, income takes effort!
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back to Pet
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelectedGame(game.id)}
              className="rounded-2xl border border-white/10 bg-[#252338] p-5 text-left transition hover:-translate-y-1 hover:border-[#4d96ff]"
            >
              <div className="text-4xl">{game.emoji}</div>
              <h3 className="mt-3 font-heading text-lg text-white">{game.name}</h3>
              <p className="mt-1 text-xs text-[#a7a9be]">{game.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={game.difficultyColor}>{game.difficulty}</span>
                <span className="text-[#6bcb77]">Up to ${game.maxEarnings}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-4">
          <p className="text-xs text-[#a7a9be]">
            <span className="text-white">Tip:</span> Minigame earnings supplement your weekly salary. A healthy pet earns $30/week automatically — minigames are for when you need extra cash fast!
          </p>
        </div>
      </div>
    </div>
  );
}
