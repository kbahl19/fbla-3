/**
 * Food Catcher minigame — catch falling food, dodge poison items.
 * Props: onFinish(amount, source), onBack()
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { formatCurrency } from '../../utils/helpers';

const FOOD_ITEMS = [
  { emoji: '🍎', points: 1, type: 'food' },
  { emoji: '🍇', points: 1, type: 'food' },
  { emoji: '🍪', points: 1, type: 'food' },
  { emoji: '🥕', points: 1, type: 'food' },
  { emoji: '🍓', points: 2, type: 'bonus' },
  { emoji: '💰', points: 3, type: 'coin' },
  { emoji: '💊', points: -1, type: 'poison' },
  { emoji: '🦠', points: -1, type: 'poison' }
];

const getEarnings = (score) => {
  if (score >= 20) return 80;
  if (score >= 12) return 55;
  if (score >= 6) return 30;
  if (score >= 1) return 10;
  return 0;
};

export default function FoodCatcher({ onFinish, onBack }) {
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const playerXRef = useRef(50);

  // Keep refs in sync
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);

  const gameAreaRef = useRef(null);

  const handleKey = useCallback((e) => {
    if (!started) return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      setPlayerX((prev) => {
        const next = Math.max(4, prev - 10);
        playerXRef.current = next;
        return next;
      });
    }
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      setPlayerX((prev) => {
        const next = Math.min(96, prev + 10);
        playerXRef.current = next;
        return next;
      });
    }
  }, [started]);

  const handleMouseMove = useCallback((e) => {
    if (!started || gameOver) return;
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(96, Math.max(4, x));
    playerXRef.current = clamped;
    setPlayerX(clamped);
  }, [started, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Spawn items
  useEffect(() => {
    if (!started || gameOver) return;
    const spawnMs = Math.max(400, 900 - scoreRef.current * 12);
    const interval = setInterval(() => {
      const item = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
      setItems((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          x: Math.random() * 88 + 6,
          y: 0,
          speed: 1.2 + Math.min(3, scoreRef.current * 0.06),
          ...item
        }
      ]);
    }, spawnMs);
    return () => clearInterval(interval);
  }, [started, gameOver, score]);

  // Physics tick
  useEffect(() => {
    if (!started || gameOver) return;
    const tick = setInterval(() => {
      setItems((prev) => {
        const next = [];
        let caught = 0;
        let poisonCaught = 0;
        let missed = 0;

        for (const item of prev) {
          const ny = item.y + item.speed * 2.2;
          const inCatchZone = ny >= 84 && ny < 95;
          const overlap = Math.abs(item.x - playerXRef.current) < 8;

          if (inCatchZone && overlap) {
            if (item.type === 'poison') poisonCaught += 1;
            else caught += item.points;
          } else if (ny >= 100) {
            if (item.type === 'food' || item.type === 'bonus' || item.type === 'coin') {
              missed += 1;
            }
          } else {
            next.push({ ...item, y: ny });
          }
        }

        if (caught > 0) setScore((s) => s + caught);
        if (poisonCaught > 0) setLives((l) => Math.max(0, l - poisonCaught));
        if (missed > 0) setLives((l) => Math.max(0, l - missed));

        return next;
      });
    }, 40);
    return () => clearInterval(tick);
  }, [started, gameOver]);

  useEffect(() => {
    if (lives <= 0 && started) setGameOver(true);
  }, [lives, started]);

  const earnings = getEarnings(score);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Food Catcher</h2>
            <p className="text-sm text-[#a7a9be]">Catch food, grab coins, dodge poison pills!</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-[#a7a9be]">Score: <span className="text-white">{score}</span></span>
          <span className="text-[#a7a9be]">
            Lives: {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
            ))}
          </span>
          <span className="text-[#a7a9be]">Keys: <span className="text-white">← → or A/D</span></span>
        </div>

        <div className="mt-3 flex gap-3 text-xs text-[#a7a9be]">
          <span>🍎 +1pt</span>
          <span>🍓 +2pts</span>
          <span>💰 +3pts</span>
          <span className="text-[#ff6b6b]">💊 -1 life</span>
          <span className="text-[#ff6b6b]">Miss food = -1 life</span>
        </div>

        {!started && !gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <p className="text-[#a7a9be]">Use ← → arrow keys or A/D to move. Catch food, grab coins, avoid poison!</p>
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
          <div
          ref={gameAreaRef}
          onMouseMove={handleMouseMove}
          className="relative mt-4 h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-[#252338] cursor-none"
        >
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute text-3xl"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translateX(-50%)' }}
              >
                {item.emoji}
              </div>
            ))}
            {/* Catcher */}
            <div
              className="absolute bottom-4 text-5xl transition-none"
              style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
            >
              🐾
            </div>
            {/* Mobile controls */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              <button
                type="button"
                onPointerDown={() => {
                  const interval = setInterval(() => {
                    setPlayerX((p) => {
                      const n = Math.max(4, p - 4);
                      playerXRef.current = n;
                      return n;
                    });
                  }, 40);
                  const stop = () => clearInterval(interval);
                  window.addEventListener('pointerup', stop, { once: true });
                }}
                className="flex-1 rounded-bl-3xl bg-white/5 py-4 text-xl text-white"
              >
                ◀
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  const interval = setInterval(() => {
                    setPlayerX((p) => {
                      const n = Math.min(96, p + 4);
                      playerXRef.current = n;
                      return n;
                    });
                  }, 40);
                  const stop = () => clearInterval(interval);
                  window.addEventListener('pointerup', stop, { once: true });
                }}
                className="flex-1 rounded-br-3xl bg-white/5 py-4 text-xl text-white"
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <h3 className="font-heading text-2xl text-white">Game Over!</h3>
            <p className="mt-2 text-[#a7a9be]">You scored <span className="text-white font-bold">{score}</span> points.</p>
            <p className="mt-2 text-lg text-[#6bcb77]">Earnings: {formatCurrency(earnings)}</p>
            <div className="mt-4 text-xs text-[#a7a9be]">
              Score 6+ → $30 · Score 12+ → $55 · Score 20+ → $80
            </div>
            <button
              type="button"
              onClick={() => onFinish(earnings, 'Food Catcher')}
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
