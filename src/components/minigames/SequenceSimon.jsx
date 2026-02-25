/**
 * Care Sequence (Simon Says) minigame — memorize and repeat the care routine.
 * Each round the sequence grows by 1. 5 rounds (sequences 3–7 actions long).
 * Props: onFinish(amount, source), onBack()
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

const CARE_ACTIONS = [
  { id: 'feed', emoji: '🍽️', label: 'Feed', color: 'bg-[#ffd93d]/20 border-[#ffd93d]', glow: '#ffd93d' },
  { id: 'play', emoji: '🎮', label: 'Play', color: 'bg-[#4d96ff]/20 border-[#4d96ff]', glow: '#4d96ff' },
  { id: 'clean', emoji: '🛁', label: 'Clean', color: 'bg-[#6bcb77]/20 border-[#6bcb77]', glow: '#6bcb77' },
  { id: 'rest', emoji: '😴', label: 'Rest', color: 'bg-[#c77dff]/20 border-[#c77dff]', glow: '#c77dff' },
  { id: 'vet', emoji: '🩺', label: 'Vet', color: 'bg-[#ff6b6b]/20 border-[#ff6b6b]', glow: '#ff6b6b' }
];

const TOTAL_ROUNDS = 5;
const START_LENGTH = 3;
const SHOW_DELAY_MS = 550; // time each item lights up
const SHOW_GAP_MS = 200;

const getEarnings = (roundsCompleted) => roundsCompleted * 3;

export default function SequenceSimon({ onFinish, onBack }) {
  const [phase, setPhase] = useState('idle'); // idle | showing | input | fail | done
  const [sequence, setSequence] = useState([]);
  const [round, setRound] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [highlightId, setHighlightId] = useState(null);
  const [inputProgress, setInputProgress] = useState([]);
  const [failedAt, setFailedAt] = useState(null);
  const sequenceRef = useRef([]);
  const inputRef = useRef([]);

  const showSequence = useCallback((seq) => {
    setPhase('showing');
    setInputProgress([]);
    inputRef.current = [];

    seq.forEach((id, i) => {
      setTimeout(() => {
        setHighlightId(id);
        setTimeout(() => setHighlightId(null), SHOW_DELAY_MS);
      }, i * (SHOW_DELAY_MS + SHOW_GAP_MS));
    });

    setTimeout(() => {
      setPhase('input');
    }, seq.length * (SHOW_DELAY_MS + SHOW_GAP_MS) + 200);
  }, []);

  const startRound = useCallback((currentRound) => {
    const seqLength = START_LENGTH + currentRound;
    const newSeq = Array.from({ length: seqLength }, () =>
      CARE_ACTIONS[Math.floor(Math.random() * CARE_ACTIONS.length)].id
    );
    setSequence(newSeq);
    sequenceRef.current = newSeq;
    setRound(currentRound);
    setFailedAt(null);
    setTimeout(() => showSequence(newSeq), 800);
  }, [showSequence]);

  const handleStart = () => {
    setRoundsCompleted(0);
    startRound(0);
  };

  const handleAction = (actionId) => {
    if (phase !== 'input') return;
    const idx = inputRef.current.length;
    const seq = sequenceRef.current;

    if (seq[idx] === actionId) {
      const next = [...inputRef.current, actionId];
      inputRef.current = next;
      setInputProgress(next);

      if (next.length === seq.length) {
        // Round complete!
        const nextRoundsCompleted = roundsCompleted + 1;
        setRoundsCompleted(nextRoundsCompleted);
        setPhase('idle');

        if (nextRoundsCompleted >= TOTAL_ROUNDS) {
          setPhase('done');
        } else {
          setTimeout(() => startRound(round + 1), 1000);
        }
      }
    } else {
      // Wrong action
      setFailedAt(idx);
      setPhase('fail');
      setTimeout(() => setPhase('done'), 1500);
    }
  };

  const earnings = getEarnings(roundsCompleted);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Care Sequence</h2>
            <p className="text-sm text-[#a7a9be]">Watch the pet care routine, then repeat it from memory!</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        {phase === 'idle' && round === 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <p className="text-[#a7a9be]">Watch the care sequence light up, then click the buttons in the same order. 5 rounds, starts with 3 actions and grows!</p>
            <p className="mt-2 text-xs text-[#a7a9be]">Each round completed = $3 (max $15)</p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-4 rounded-2xl bg-[#4d96ff] px-6 py-3 font-heading text-white transition hover:scale-[1.01]"
            >
              Start Game
            </button>
          </div>
        )}

        {phase !== 'idle' || round > 0 ? (
          <div className="mt-6">
            {/* Status */}
            <div className="flex flex-wrap gap-4 text-sm text-[#a7a9be]">
              <span>Round: <span className="text-white">{Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</span></span>
              <span>Sequence length: <span className="text-white">{START_LENGTH + round}</span></span>
              <span>Progress: <span className="text-[#6bcb77]">{inputProgress.length}/{sequence.length}</span></span>
            </div>

            {/* Phase indicator */}
            <div className={`mt-4 rounded-xl px-4 py-2 text-sm text-center font-semibold ${
              phase === 'showing'
                ? 'bg-[#ffd93d]/20 text-[#ffd93d]'
                : phase === 'input'
                  ? 'bg-[#4d96ff]/20 text-[#4d96ff]'
                  : phase === 'fail'
                    ? 'bg-[#ff6b6b]/20 text-[#ff6b6b]'
                    : phase === 'done'
                      ? 'bg-[#6bcb77]/20 text-[#6bcb77]'
                      : 'bg-[#252338] text-[#a7a9be]'
            }`}>
              {phase === 'showing' && 'Watch carefully!'}
              {phase === 'input' && 'Now repeat the sequence!'}
              {phase === 'fail' && 'Wrong! Game over.'}
              {phase === 'idle' && round > 0 && 'Round complete! Get ready...'}
              {phase === 'done' && roundsCompleted >= TOTAL_ROUNDS && 'All rounds complete!'}
              {phase === 'done' && roundsCompleted < TOTAL_ROUNDS && `Got ${roundsCompleted} rounds right!`}
            </div>

            {/* Sequence display */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {sequence.map((id, i) => {
                const action = CARE_ACTIONS.find((a) => a.id === id);
                const isCompleted = i < inputProgress.length;
                const isFailed = failedAt === i;
                return (
                  <div
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-all duration-200 ${
                      isFailed
                        ? 'border-[#ff6b6b] bg-[#ff6b6b]/30'
                        : isCompleted
                          ? 'border-[#6bcb77] bg-[#6bcb77]/20'
                          : 'border-white/10 bg-[#252338]'
                    }`}
                  >
                    {phase === 'input' || isFailed || isCompleted ? action.emoji : '?'}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            {(phase === 'input' || phase === 'showing') && (
              <div className="mt-6 grid grid-cols-5 gap-2">
                {CARE_ACTIONS.map((action) => {
                  const isHighlighted = highlightId === action.id;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAction(action.id)}
                      disabled={phase !== 'input'}
                      className={`flex flex-col items-center rounded-2xl border px-2 py-4 transition-all duration-200 ${action.color} ${
                        isHighlighted ? 'scale-110 brightness-150' : 'opacity-90 hover:brightness-125'
                      } ${phase !== 'input' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                      style={{ boxShadow: isHighlighted ? `0 0 20px ${action.glow}` : 'none' }}
                    >
                      <span className="text-3xl">{action.emoji}</span>
                      <span className="mt-1 text-xs text-white">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {phase === 'done' && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <h3 className="font-heading text-2xl text-white">
              {roundsCompleted >= TOTAL_ROUNDS ? 'Perfect Memory!' : `${roundsCompleted} Rounds Completed`}
            </h3>
            <p className="mt-2 text-[#a7a9be]">
              Completed <span className="font-bold text-white">{roundsCompleted}</span> of {TOTAL_ROUNDS} rounds.
            </p>
            <p className="mt-2 text-lg text-[#6bcb77]">Earnings: {formatCurrency(earnings)}</p>
            <button
              type="button"
              onClick={() => onFinish(earnings, 'Care Sequence')}
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
