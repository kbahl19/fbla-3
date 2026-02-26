/**
 * Reflex Tap minigame — click the glowing paw before it disappears!
 * Gets faster each round. 15 total rounds.
 * Props: onFinish(amount, source), onBack()
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

const TOTAL_ROUNDS = 15;
const BASE_WINDOW_MS = 1400; // Time the paw is visible
const MIN_WINDOW_MS = 500;
const DELAY_BETWEEN_MS = 600;

const getEarnings = (hits) => {
  if (hits >= 13) return 80;
  if (hits >= 9) return 55;
  if (hits >= 5) return 30;
  if (hits >= 1) return 10;
  return 0;
};

export default function ReflexTap({ onFinish, onBack }) {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [pawPos, setPawPos] = useState(null); // { x, y } percent
  const [active, setActive] = useState(false); // paw is visible and clickable
  const [feedback, setFeedback] = useState(null); // 'hit' | 'miss'
  const [windowMs, setWindowMs] = useState(BASE_WINDOW_MS);
  const activeRef = useRef(false);
  const timeoutRef = useRef(null);
  const roundRef = useRef(0);
  const hitsRef = useRef(0);

  useEffect(() => { activeRef.current = active; }, [active]);

  const spawnPaw = useCallback((currentRound, currentHits) => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    // Random position (keep away from edges)
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 75;
    setPawPos({ x, y });
    setActive(true);
    setFeedback(null);
    activeRef.current = true;

    const window_ = Math.max(MIN_WINDOW_MS, BASE_WINDOW_MS - currentHits * 60);
    setWindowMs(window_);

    timeoutRef.current = setTimeout(() => {
      if (activeRef.current) {
        // Missed
        setActive(false);
        activeRef.current = false;
        setFeedback('miss');
        setPawPos(null);
        const nextRound = currentRound + 1;
        roundRef.current = nextRound;
        setRound(nextRound);
        setTimeout(() => spawnPaw(nextRound, hitsRef.current), DELAY_BETWEEN_MS);
      }
    }, window_);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setRound(0);
    setHits(0);
    roundRef.current = 0;
    hitsRef.current = 0;
    setTimeout(() => spawnPaw(0, 0), 800);
  };

  const handlePawClick = () => {
    if (!active) return;
    clearTimeout(timeoutRef.current);
    setActive(false);
    activeRef.current = false;
    const nextHits = hitsRef.current + 1;
    hitsRef.current = nextHits;
    setHits(nextHits);
    setFeedback('hit');
    setPawPos(null);
    const nextRound = roundRef.current + 1;
    roundRef.current = nextRound;
    setRound(nextRound);
    setTimeout(() => spawnPaw(nextRound, nextHits), DELAY_BETWEEN_MS);
  };

  const earnings = getEarnings(hits);
  const windowPct = Math.round((windowMs / BASE_WINDOW_MS) * 100);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Reflex Tap</h2>
            <p className="text-sm text-[#a7a9be]">Click the paw before it disappears!</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        {started && !gameOver && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="text-[#a7a9be]">Round: <span className="text-white">{round}/{TOTAL_ROUNDS}</span></span>
            <span className="text-[#a7a9be]">Hits: <span className="text-[#6bcb77]">{hits}</span></span>
            <span className="text-[#a7a9be]">
              Window: <span className={`font-bold ${windowMs < 700 ? 'text-[#ff6b6b]' : 'text-white'}`}>{(windowMs / 1000).toFixed(1)}s</span>
            </span>
          </div>
        )}

        {!started && !gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <p className="text-[#a7a9be]">A paw will appear on screen. Click it as fast as you can before it vanishes! Gets faster with each hit.</p>
            <div className="mt-3 text-xs text-[#a7a9be]">
              5 hits: $5 · 9 hits: $10 · 13+ hits: $15
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="mt-4 rounded-2xl bg-[#4d96ff] px-6 py-3 font-heading text-white transition hover:scale-[1.01]"
            >
              Start Game
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div
            className="relative mt-4 h-[420px] cursor-crosshair overflow-hidden rounded-3xl border border-white/10 bg-[#252338] select-none"
            onClick={() => { if (!active && feedback === null) return; }}
          >
            {/* Feedback flash */}
            {feedback === 'hit' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-heading text-2xl text-[#6bcb77] animate-bounce">+HIT!</span>
              </div>
            )}
            {feedback === 'miss' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-heading text-2xl text-[#ff6b6b]">MISS!</span>
              </div>
            )}

            {/* Paw */}
            {active && pawPos && (
              <button
                type="button"
                onClick={handlePawClick}
                className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#ffd93d] text-5xl shadow-lg transition-transform hover:scale-110 active:scale-95 animate-pulse"
                style={{ left: `${pawPos.x}%`, top: `${pawPos.y}%` }}
              >
                🐾
              </button>
            )}

            {/* Difficulty bar */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex justify-between text-xs text-[#a7a9be] mb-1">
                <span>Speed</span>
                <span>{100 - Math.round(windowPct)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#1a1828]">
                <div
                  className="h-1.5 rounded-full bg-[#ff6b6b] transition-all duration-300"
                  style={{ width: `${100 - windowPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <h3 className="font-heading text-2xl text-white">Done!</h3>
            <p className="mt-2 text-[#a7a9be]">
              Hit <span className="font-bold text-white">{hits}</span> out of {TOTAL_ROUNDS} paws.
            </p>
            <p className="mt-2 text-lg text-[#6bcb77]">Earnings: {formatCurrency(earnings)}</p>
            <button
              type="button"
              onClick={() => onFinish(earnings, 'Reflex Tap')}
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
