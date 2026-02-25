import { useState, useCallback, useEffect, useRef } from 'react';
import SetupScreen from './components/SetupScreen';
import PetDisplay from './components/PetDisplay';
import StatBars from './components/StatBars';
import ActionPanel from './components/ActionPanel';
import FinancePanel from './components/FinancePanel';
import BadgePanel from './components/BadgePanel';
import Minigame from './components/Minigame';
import Report from './components/Report';
import Leaderboard from './components/Leaderboard';
import HelpModal from './components/HelpModal';
import WeeklyUpdate from './components/WeeklyUpdate';
import usePet, { PET_ACTIONS } from './hooks/usePet';
import useFinance from './hooks/useFinance';
import { formatCurrency } from './utils/helpers';

const VIEWS = { SETUP: 'setup', GAME: 'game', MINIGAME: 'minigame', REPORT: 'report', LEADERBOARD: 'leaderboard' };

export const TOTAL_WEEKS = 12;
export const WEEKLY_BILL = 20;
export const WEEK_DURATION_MS = 90000; // 90 real seconds = 1 in-game week
const STARTING_BUDGET = 200;

export function getSalary(health) {
  if (health >= 70) return 30;
  if (health >= 40) return 15;
  return 0;
}

export function getSalaryLabel(health) {
  if (health >= 70) return { text: 'Salary: $30/wk', color: 'bg-[#6bcb77] text-[#1a1828]' };
  if (health >= 40) return { text: 'Salary: $15/wk', color: 'bg-[#ffd93d] text-[#1a1828]' };
  return { text: 'No Salary!', color: 'bg-[#ff6b6b] text-white' };
}

export default function App() {
  const [view, setView] = useState(VIEWS.SETUP);
  const [config, setConfig] = useState(null);
  const [week, setWeek] = useState(1);
  const [weeklyModal, setWeeklyModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [actionFlag, setActionFlag] = useState(0);
  const [weekMs, setWeekMs] = useState(WEEK_DURATION_MS);

  const weekRef = useRef(1);
  const petStateRef = useRef(null);
  const financeStateRef = useRef(null);
  const gameEndedRef = useRef(false);

  const { financeState, spend, earn, chargeBill, setSavingsGoal, resetFinance } = useFinance(STARTING_BUDGET);
  const { petState, feed, play, rest, clean, healthCheck, learnTrick, recordMinigame, resetPet } =
    usePet(config, financeState.wallet);

  // Keep refs fresh for use inside intervals
  useEffect(() => { petStateRef.current = petState; }, [petState]);
  useEffect(() => { financeStateRef.current = financeState; }, [financeState]);

  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Countdown timer display
  useEffect(() => {
    if (view !== VIEWS.GAME) return;
    const tick = setInterval(() => {
      setWeekMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [view, week]);

  // Weekly salary + bill tick
  useEffect(() => {
    if (view !== VIEWS.GAME) return;
    const interval = setInterval(() => {
      if (gameEndedRef.current) return;
      const ps = petStateRef.current;
      const fs = financeStateRef.current;
      if (!ps || !fs) return;

      const currentWeek = weekRef.current;
      const salary = getSalary(ps.health);

      chargeBill(WEEKLY_BILL, `Week ${currentWeek} living costs`);
      if (salary > 0) earn(salary, `Week ${currentWeek} salary`);

      const nextWeek = currentWeek + 1;
      weekRef.current = nextWeek;
      const isGameOver = nextWeek > TOTAL_WEEKS;
      if (isGameOver) gameEndedRef.current = true;

      setWeek(nextWeek);
      setWeekMs(WEEK_DURATION_MS);

      setWeeklyModal({
        completedWeek: currentWeek,
        nextWeek,
        salary,
        petHealth: ps.health,
        isGameOver,
      });
    }, WEEK_DURATION_MS);
    return () => clearInterval(interval);
  }, [view, earn, chargeBill]);

  const handleStart = useCallback((cfg) => {
    setConfig(cfg);
    weekRef.current = 1;
    gameEndedRef.current = false;
    setWeek(1);
    setWeekMs(WEEK_DURATION_MS);
    setWeeklyModal(null);
    setView(VIEWS.GAME);
  }, []);

  const handleFeed = useCallback((foodItem) => {
    const result = feed(foodItem);
    if (result.valid) {
      spend(foodItem.cost, 'food', foodItem.name);
      setActionFlag((f) => f + 1);
      addToast(`Fed ${petState.name} a ${foodItem.name}!`, 'success');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [feed, spend, petState.name, addToast]);

  const handlePlay = useCallback((toyItem) => {
    const result = play(toyItem);
    if (result.valid) {
      spend(toyItem.cost, 'toys', toyItem.name);
      setActionFlag((f) => f + 1);
      addToast(`Played with ${petState.name} using ${toyItem.name}!`, 'success');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [play, spend, petState.name, addToast]);

  const handleRest = useCallback(() => {
    const result = rest();
    if (result.valid) {
      setActionFlag((f) => f + 1);
      addToast(`${petState.name} is resting. Energy recovering!`, 'info');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [rest, petState.name, addToast]);

  const handleClean = useCallback(() => {
    const result = clean();
    if (result.valid) {
      spend(PET_ACTIONS.cleanCost, 'cleaning', 'Bath time');
      setActionFlag((f) => f + 1);
      addToast(`${petState.name} is squeaky clean!`, 'success');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [clean, spend, petState.name, addToast]);

  const handleHealthCheck = useCallback((vetOption) => {
    const result = healthCheck(vetOption);
    if (result.valid) {
      spend(vetOption.cost, 'vet', vetOption.name);
      setActionFlag((f) => f + 1);
      addToast(`${petState.name} visited the vet for ${vetOption.name}!`, 'success');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [healthCheck, spend, petState.name, addToast]);

  const handleLearnTrick = useCallback((trickName) => {
    const result = learnTrick(trickName);
    if (result.valid) {
      spend(PET_ACTIONS.trickCost, 'tricks', trickName);
      setActionFlag((f) => f + 1);
      addToast(`${petState.name} learned "${trickName}"!`, 'success');
    } else {
      addToast(result.error, 'error');
    }
    return result;
  }, [learnTrick, spend, petState.name, addToast]);

  const handleEarnFromMinigame = useCallback((amount, source) => {
    earn(amount, source);
    addToast(`Earned ${formatCurrency(amount)} from minigame!`, 'success');
  }, [earn, addToast]);

  const handleSaveLeaderboard = useCallback((entry) => {
    const existing = JSON.parse(localStorage.getItem('petpal_leaderboard') || '[]');
    localStorage.setItem('petpal_leaderboard', JSON.stringify([...existing, entry]));
  }, []);

  const handlePlayAgain = useCallback(() => {
    resetPet();
    resetFinance(STARTING_BUDGET);
    weekRef.current = 1;
    gameEndedRef.current = false;
    setWeek(1);
    setWeekMs(WEEK_DURATION_MS);
    setWeeklyModal(null);
    setConfig(null);
    setView(VIEWS.SETUP);
  }, [resetPet, resetFinance]);

  const handleWeeklyClose = useCallback(() => {
    const wasGameOver = weeklyModal?.isGameOver;
    setWeeklyModal(null);
    if (wasGameOver) setView(VIEWS.REPORT);
  }, [weeklyModal]);

  // Countdown display
  const totalSec = Math.ceil(weekMs / 1000);
  const countdownMin = Math.floor(totalSec / 60);
  const countdownSec = totalSec % 60;
  const countdownLabel = `${countdownMin}:${String(countdownSec).padStart(2, '0')}`;
  const salaryInfo = getSalaryLabel(petState.health);
  const currentWeekDisplay = Math.min(week, TOTAL_WEEKS);

  if (view === VIEWS.SETUP) return <SetupScreen onStart={handleStart} />;

  if (view === VIEWS.MINIGAME) {
    return (
      <Minigame
        onEarn={handleEarnFromMinigame}
        onRecordPlay={recordMinigame}
        onBack={() => setView(VIEWS.GAME)}
      />
    );
  }

  if (view === VIEWS.REPORT) {
    return (
      <Report
        petState={petState}
        financeState={financeState}
        weeksPlayed={Math.min(TOTAL_WEEKS, week - 1)}
        onSaveLeaderboard={handleSaveLeaderboard}
        onPlayAgain={handlePlayAgain}
        onLeaderboard={() => setView(VIEWS.LEADERBOARD)}
      />
    );
  }

  if (view === VIEWS.LEADERBOARD) {
    return <Leaderboard onBack={() => setView(VIEWS.GAME)} />;
  }

  // GAME view
  return (
    <div className="min-h-screen px-4 pb-16 pt-4 sm:px-6">
      {/* Week progress header */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-3xl border border-white/10 bg-[#1a1828]/90 px-5 py-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Week</p>
              <p className="font-heading text-2xl text-[#ffd93d]">
                {currentWeekDisplay} <span className="text-base text-[#a7a9be]">/ {TOTAL_WEEKS}</span>
              </p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Next week in</p>
              <p className={`font-heading text-2xl ${weekMs < 20000 ? 'animate-pulse text-[#ff6b6b]' : 'text-white'}`}>
                {countdownLabel}
              </p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-xs uppercase tracking-wide text-[#a7a9be]">Wallet</p>
              <p className={`font-heading text-2xl ${financeState.wallet < 0 ? 'text-[#ff6b6b]' : 'text-[#6bcb77]'}`}>
                {formatCurrency(financeState.wallet)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${salaryInfo.color}`}>
              {salaryInfo.text}
            </span>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white hover:border-[#4d96ff]"
            >
              Help
            </button>
            <button
              type="button"
              onClick={() => setView(VIEWS.LEADERBOARD)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white hover:border-[#ffd93d]"
            >
              Board
            </button>
          </div>
        </div>

        {/* Week progress bar */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#252338]">
          <div
            className="h-2 rounded-full bg-[#4d96ff] transition-all duration-1000"
            style={{ width: `${((currentWeekDisplay - 1) / TOTAL_WEEKS) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#a7a9be]">
          Goal: After 12 weeks, highest score wins. Score = wallet + average pet stats x 2. Keep your pet healthy to earn your weekly salary.
        </p>
      </div>

      {/* Main game grid */}
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: pet info */}
        <div className="grid gap-6 content-start">
          <PetDisplay petState={petState} onAction={actionFlag} />
          <StatBars petState={petState} />
          <BadgePanel
            petState={petState}
            financeState={financeState}
            onBadgeEarned={(badge) => addToast(`Badge unlocked: ${badge.name} ${badge.emoji}`, 'badge')}
          />
        </div>

        {/* Right: actions + finances */}
        <div className="grid gap-6 content-start">
          <ActionPanel
            petState={petState}
            financeState={financeState}
            onFeed={handleFeed}
            onPlay={handlePlay}
            onRest={handleRest}
            onClean={handleClean}
            onHealthCheck={handleHealthCheck}
            onLearnTrick={handleLearnTrick}
          />
          <FinancePanel
            financeState={financeState}
            onSetSavingsGoal={setSavingsGoal}
            onNavigateMinigame={() => setView(VIEWS.MINIGAME)}
            onNavigateReport={() => setView(VIEWS.REPORT)}
          />
        </div>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-xs rounded-2xl border px-4 py-3 text-sm shadow-xl ${
              toast.type === 'success'
                ? 'border-[#6bcb77] bg-[#6bcb77] text-[#1a1828]'
                : toast.type === 'error'
                  ? 'border-[#ff6b6b] bg-[#ff6b6b] text-white'
                  : toast.type === 'badge'
                    ? 'border-[#c77dff] bg-[#c77dff] text-white'
                    : 'border-white/10 bg-[#252338] text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {weeklyModal && (
        <WeeklyUpdate
          data={weeklyModal}
          totalWeeks={TOTAL_WEEKS}
          weeklyBill={WEEKLY_BILL}
          onClose={handleWeeklyClose}
        />
      )}

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
