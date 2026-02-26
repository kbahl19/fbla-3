/**
 * Memory Match minigame — flip cards to find matching pet care pairs.
 * Props: onFinish(amount, source), onBack()
 */
import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

const CARD_PAIRS = [
  { id: 'apple', emoji: '🍎', label: 'Apple' },
  { id: 'bowl', emoji: '🥣', label: 'Kibble' },
  { id: 'syringe', emoji: '💉', label: 'Vaccine' },
  { id: 'stethoscope', emoji: '🩺', label: 'Stethoscope' },
  { id: 'bath', emoji: '🛁', label: 'Bath' },
  { id: 'yarn', emoji: '🧶', label: 'Yarn Ball' },
  { id: 'puzzle', emoji: '🧩', label: 'Puzzle' },
  { id: 'heart', emoji: '❤️', label: 'Love' }
];

const TOTAL_TIME = 60;

function buildDeck() {
  const cards = [];
  CARD_PAIRS.forEach((pair, index) => {
    cards.push({ uid: `${pair.id}-a`, pairId: pair.id, emoji: pair.emoji, index: index * 2 });
    cards.push({ uid: `${pair.id}-b`, pairId: pair.id, emoji: pair.emoji, index: index * 2 + 1 });
  });
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

const getEarnings = (matches) => Math.min(matches * 10, 80);

export default function MemoryMatch({ onFinish, onBack }) {
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]); // uids currently face-up
  const [matched, setMatched] = useState(new Set()); // pairIds that are matched
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);
  const [flips, setFlips] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!started || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, gameOver]);

  useEffect(() => {
    if (matched.size === CARD_PAIRS.length) {
      clearInterval(timerRef.current);
      setGameOver(true);
    }
  }, [matched]);

  const handleFlip = (card) => {
    if (lockBoard || gameOver || !started) return;
    if (matched.has(card.pairId)) return;
    if (flipped.includes(card.uid)) return;
    if (flipped.length === 2) return;

    const nextFlipped = [...flipped, card.uid];
    setFlipped(nextFlipped);
    setFlips((f) => f + 1);

    if (nextFlipped.length === 2) {
      const [a, b] = nextFlipped.map((uid) => deck.find((c) => c.uid === uid));
      if (a.pairId === b.pairId) {
        setMatched((prev) => new Set([...prev, a.pairId]));
        setFlipped([]);
      } else {
        setLockBoard(true);
        setTimeout(() => {
          setFlipped([]);
          setLockBoard(false);
        }, 900);
      }
    }
  };

  const earnings = getEarnings(matched.size);
  const allMatched = matched.size === CARD_PAIRS.length;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Memory Match</h2>
            <p className="text-sm text-[#a7a9be]">Find all 8 pet care pairs before time runs out!</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        {started && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="text-[#a7a9be]">
              Time: <span className={`font-bold ${timeLeft <= 10 ? 'text-[#ff6b6b] animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
            </span>
            <span className="text-[#a7a9be]">Matches: <span className="text-white">{matched.size}/{CARD_PAIRS.length}</span></span>
            <span className="text-[#a7a9be]">Flips: <span className="text-white">{flips}</span></span>
            <span className="text-[#a7a9be]">Earning: <span className="text-[#6bcb77]">{formatCurrency(getEarnings(matched.size))}</span></span>
          </div>
        )}

        {/* Time bar */}
        {started && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#252338]">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${timeLeft > 20 ? 'bg-[#6bcb77]' : timeLeft > 10 ? 'bg-[#ffd93d]' : 'bg-[#ff6b6b]'}`}
              style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}
            />
          </div>
        )}

        {!started && !gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <p className="text-[#a7a9be]">Flip cards to find matching pairs. Remember where cards are! You have 60 seconds.</p>
            <p className="mt-2 text-xs text-[#a7a9be]">Each match = $2 · All 8 matches = $16</p>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-4 rounded-2xl bg-[#4d96ff] px-6 py-3 font-heading text-white transition hover:scale-[1.01]"
            >
              Start Game
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {deck.map((card) => {
              const isFaceUp = flipped.includes(card.uid) || matched.has(card.pairId);
              const isMatched = matched.has(card.pairId);
              return (
                <button
                  key={card.uid}
                  type="button"
                  onClick={() => handleFlip(card)}
                  className={`aspect-square rounded-2xl border text-3xl transition-all duration-300 ${
                    isFaceUp
                      ? isMatched
                        ? 'border-[#6bcb77] bg-[#6bcb77]/20 text-white'
                        : 'border-[#4d96ff] bg-[#252338] text-white'
                      : 'border-white/10 bg-[#252338] text-transparent hover:border-white/30'
                  }`}
                >
                  {isFaceUp ? card.emoji : '?'}
                </button>
              );
            })}
          </div>
        )}

        {gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <h3 className="font-heading text-2xl text-white">
              {allMatched ? 'Perfect! All matched!' : 'Time\'s up!'}
            </h3>
            <p className="mt-2 text-[#a7a9be]">
              Found <span className="text-white font-bold">{matched.size}</span> of {CARD_PAIRS.length} pairs in <span className="text-white">{flips}</span> flips.
            </p>
            <p className="mt-2 text-lg text-[#6bcb77]">Earnings: {formatCurrency(earnings)}</p>
            <button
              type="button"
              onClick={() => onFinish(earnings, 'Memory Match')}
              className="mt-4 rounded-2xl bg-[#6bcb77] px-6 py-3 font-heading text-[#1a1828] transition hover:scale-[1.01]"
            >
              Collect {formatCurrency(earnings)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
