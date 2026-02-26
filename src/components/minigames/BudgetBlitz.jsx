/**
 * Budget Blitz minigame — answer pet budget math questions quickly.
 * 10 questions, 8 seconds each.
 * Props: onFinish(amount, source), onBack()
 */
import { useEffect, useRef, useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/helpers';

const TIME_PER_Q = 8;
const TOTAL_QUESTIONS = 10;

function generateQuestions() {
  const pool = [
    () => {
      const vetCost = [10, 15, 25][Math.floor(Math.random() * 3)];
      const wallet = vetCost + Math.floor(Math.random() * 30) + 5;
      const ans = wallet - vetCost;
      const wrong = [ans + 5, ans - 5, ans + 10].filter((n) => n !== ans && n > 0);
      return {
        question: `Vet visit costs $${vetCost}. You have $${wallet}. How much is left?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const salary = [15, 30][Math.floor(Math.random() * 2)];
      const bill = 20;
      const weeks = [2, 3, 4][Math.floor(Math.random() * 3)];
      const net = (salary - bill) * weeks;
      const ans = net;
      const wrong = [net + salary, net - bill, net + 10].filter((n) => n !== ans);
      return {
        question: `Salary $${salary}/wk, bills $${bill}/wk. Net change after ${weeks} weeks?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const meal = [2, 6, 12][Math.floor(Math.random() * 3)];
      const qty = [2, 3, 4][Math.floor(Math.random() * 3)];
      const ans = meal * qty;
      const wrong = [ans + meal, ans - meal, ans + 2].filter((n) => n !== ans && n > 0);
      return {
        question: `One meal costs $${meal}. How much for ${qty} meals?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const start = [100, 150, 200][Math.floor(Math.random() * 3)];
      const spend1 = [10, 15, 25][Math.floor(Math.random() * 3)];
      const spend2 = [3, 6, 8][Math.floor(Math.random() * 3)];
      const earned = [5, 10, 15][Math.floor(Math.random() * 3)];
      const ans = start - spend1 - spend2 + earned;
      const wrong = [ans + spend1, ans - earned, ans + 5].filter((n) => n !== ans);
      return {
        question: `Start: $${start}. Spent $${spend1} on vet + $${spend2} on food. Earned $${earned} from minigame. Balance?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const toy = [3, 8, 15][Math.floor(Math.random() * 3)];
      const food = [2, 6, 12][Math.floor(Math.random() * 3)];
      const ans = toy + food;
      const wrong = [ans + toy, ans - food, ans + 3].filter((n) => n !== ans && n > 0);
      return {
        question: `Toy costs $${toy} and food costs $${food}. Total cost?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const weeks = [12];
      const w = weeks[0];
      const bill = 20;
      const salary = 30;
      const start = 200;
      const ans = start + (salary - bill) * w;
      const wrong = [ans - 50, ans + 50, ans - bill * w].filter((n) => n !== ans);
      return {
        question: `Start: $200. $30 salary - $20 bills/wk for 12 weeks. Final wallet (no spending)?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const budget = [200, 150, 100][Math.floor(Math.random() * 3)];
      const spent = Math.floor(budget * 0.4);
      const pct = Math.round((spent / budget) * 100);
      const ans = pct;
      const wrong = [pct + 10, pct - 10, pct + 20].filter((n) => n !== ans && n > 0 && n <= 100);
      return {
        question: `Budget: $${budget}. Spent: $${spent}. What % of budget did you spend?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const perDay = [2, 3, 4][Math.floor(Math.random() * 3)];
      const days = [7, 14, 30][Math.floor(Math.random() * 3)];
      const ans = perDay * days;
      const wrong = [ans + perDay * 2, ans - perDay, ans + 10].filter((n) => n !== ans && n > 0);
      return {
        question: `Pet food costs $${perDay}/day. How much for ${days} days?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const goal = [50, 75, 100][Math.floor(Math.random() * 3)];
      const current = Math.floor(goal * 0.6);
      const ans = goal - current;
      const wrong = [ans + 10, ans + 20, current].filter((n) => n !== ans && n > 0);
      return {
        question: `Savings goal: $${goal}. Current savings: $${current}. How much more needed?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    },
    () => {
      const income = [5, 10, 15][Math.floor(Math.random() * 3)];
      const plays = [2, 3, 4][Math.floor(Math.random() * 3)];
      const ans = income * plays;
      const wrong = [ans + income, ans - income, ans * 2].filter((n) => n !== ans && n > 0);
      return {
        question: `Each minigame earns $${income}. Total from ${plays} games?`,
        answer: ans,
        options: shuffle([ans, wrong[0], wrong[1], wrong[2]])
      };
    }
  ];

  const selected = shuffle(pool).slice(0, TOTAL_QUESTIONS);
  return selected.map((fn) => fn());
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const getEarnings = (correct) => correct * 10;

export default function BudgetBlitz({ onFinish, onBack }) {
  const questions = useMemo(() => generateQuestions(), []);
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  const advance = (wasCorrect) => {
    clearInterval(timerRef.current);
    const nextCorrect = wasCorrect ? correct + 1 : correct;
    setCorrect(nextCorrect);

    const nextQ = current + 1;
    if (nextQ >= TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setTimeout(() => {
        setCurrent(nextQ);
        setSelected(null);
        setTimeLeft(TIME_PER_Q);
      }, 600);
    }
  };

  useEffect(() => {
    if (!started || gameOver || selected !== null) return;
    setTimeLeft(TIME_PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          advance(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, current, gameOver, selected]);

  const handleAnswer = (option) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(option);
    const q = questions[current];
    const wasCorrect = option === q.answer;
    setTimeout(() => advance(wasCorrect), 700);
  };

  const q = questions[current];
  const earnings = getEarnings(correct);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-[#1a1828]/90 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl text-[#ffd93d]">Budget Blitz</h2>
            <p className="text-sm text-[#a7a9be]">Quick pet budgeting math — 8 seconds per question!</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-[#4d96ff]"
          >
            Back
          </button>
        </div>

        {!started && !gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <p className="text-[#a7a9be]">Answer 10 pet care budgeting questions. You have 8 seconds each. $2 per correct answer!</p>
            <p className="mt-2 text-xs text-[#a7a9be]">Max earnings: $20</p>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-4 rounded-2xl bg-[#4d96ff] px-6 py-3 font-heading text-white transition hover:scale-[1.01]"
            >
              Start Quiz
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-[#a7a9be]">
              <span>Q {current + 1} / {TOTAL_QUESTIONS}</span>
              <span className={`font-bold ${timeLeft <= 3 ? 'text-[#ff6b6b] animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
              <span>Score: <span className="text-[#6bcb77]">{correct}</span></span>
            </div>

            {/* Timer bar */}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#252338]">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${timeLeft > 4 ? 'bg-[#4d96ff]' : 'bg-[#ff6b6b]'}`}
                style={{ width: `${(timeLeft / TIME_PER_Q) * 100}%` }}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-5">
              <p className="text-lg text-white leading-relaxed">{q.question}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {q.options.map((option, i) => {
                let cls = 'border-white/10 bg-[#252338] text-white hover:border-[#4d96ff]';
                if (selected !== null) {
                  if (option === q.answer) cls = 'border-[#6bcb77] bg-[#6bcb77]/20 text-[#6bcb77]';
                  else if (option === selected) cls = 'border-[#ff6b6b] bg-[#ff6b6b]/20 text-[#ff6b6b]';
                  else cls = 'border-white/10 bg-[#252338] text-[#a7a9be] opacity-60';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    className={`rounded-2xl border px-4 py-4 text-left font-heading text-lg transition ${cls}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameOver && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#252338] p-6 text-center">
            <h3 className="font-heading text-2xl text-white">Quiz Complete!</h3>
            <p className="mt-2 text-[#a7a9be]">
              Got <span className="font-bold text-white">{correct}</span> of {TOTAL_QUESTIONS} correct.
            </p>
            <p className="mt-2 text-lg text-[#6bcb77]">Earnings: {formatCurrency(earnings)}</p>
            <div className="mt-2 text-sm text-[#a7a9be]">
              {correct >= 8 ? 'Excellent financial thinking!' : correct >= 5 ? 'Good work!' : 'Keep practicing your budgeting skills!'}
            </div>
            <button
              type="button"
              onClick={() => onFinish(earnings, 'Budget Blitz')}
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
