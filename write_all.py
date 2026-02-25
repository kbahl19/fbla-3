import os

base = "C:/Users/Bahlk/OneDrive/Desktop/Clubs/FBLA/petpal/src"

def w(path, content):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    lines = content.count("\n")
    print(f"Written {path} ({lines} lines)")

app_jsx = """
import { useEffect, useRef, useState } from 'react';
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
import usePet, { PET_ACTIONS } from './hooks/usePet';
import useFinance from './hooks/useFinance';
import { formatCurrency, calculateAvgStat } from './utils/helpers';

const TOTAL_WEEKS = 12;
const WEEK_DURATION_MS = 20000;

const buildToast = (message, tone = 'info') => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  message,
  tone
});

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [setupData, setSetupData] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [actionPulse, setActionPulse] = useState(false);
  const [week, setWeek] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const { financeState, spend, earn, chargeBill, setSavingsGoal, resetFinance } = useFinance(setupData ? 200 : 0);
  const {
    petState,
    feed,
    play,
    rest,
    clean,
    healthCheck,
    learnTrick,
    recordMinigame,
    resetPet
  } = usePet(setupData, financeState.wallet);

  // Always-current ref so the weekly timer can read petState without stale closure
  const petStateRef = useRef(petState);
  useEffect(() => { petStateRef.current = petState; }, [petState]);

  const addToast = (message, tone = 'info') => {
    const toast = buildToast(message, tone);
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, 3000);
  };

  const triggerActionPulse = () => setActionPulse((prev) => !prev);

  // Weekly billing + salary timer
  useEffect(() => {
    if (!gameActive) return;
    const timer = setInterval(() => {
      const ps = petStateRef.current;
      const avg = calculateAvgStat(ps);
      const salary = avg >= 75 ? 25 : avg >= 50 ? 15 : avg >= 25 ? 5 : 0;
      const salaryLabel = avg >= 75 ? 'thriving' : avg >= 50 ? 'doing OK' : avg >= 25 ? 'struggling' : 'critical';

      chargeBill(15, 'Rent');
      chargeBill(5, 'Utilities');
      if (salary > 0) earn(salary, 'Weekly salary');

      const net = salary - 20;
      const netStr = net >= 0 ? `+$${net}` : `-$${Math.abs(net)}`;
      addToast(
        salary > 0
          ? `Bills -$20 · Salary +$${salary} (${salaryLabel}) · Net ${netStr}`
          : `Bills -$20 · No salary — pet needs attention!`,
        net >= 0 ? 'success' : 'error'
      );
      setWeek((w) => w + 1);
    }, WEEK_DURATION_MS);
    return () => clearInterval(timer);
  }, [gameActive]); // eslint-disable-line react-hooks/exhaustive-deps

