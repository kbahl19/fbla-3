# PetPal

Raise a virtual pet for 4 weeks. Keep it healthy, spend wisely, and earn the best score you can.

---

## Setup

Pick your owner name, pet name, pet type, color theme, and accessory. Your choices appear in the live preview on the right. When you're happy with the look, click **Start Game**.

You start with **$200**.

---

## The Game Loop

The game lasts **4 weeks**. Each week is **90 real seconds**.

At the end of every week:
- You are charged **$20 in living costs**
- You earn a **salary** based on your pet's current health (see below)
- A summary modal shows what happened and your updated balance

Your pet's stats decay automatically in real time — you can't pause. If any stat hits **0**, the game ends immediately.

---

## Stats

| Stat | Starting value | Decays every 3 seconds |
|---|---|---|
| Hunger | 80 | −5 |
| Happiness | 70 | −3 |
| Energy | 80 | −2 |
| Hygiene | 70 | −2 |
| Health | 80 | Does not decay on its own |

**Health is the exception.** It only drops when other stats get critically low:

- Hunger below 50 → health loses 2/tick; below 30 → loses 5/tick
- Hygiene below 50 → health loses 1/tick; below 30 → loses 3/tick

Let hunger or hygiene fall far enough and health will follow. Once health drops below 20 it is permanently flagged, which hurts your final score even if you recover it.

---

## Salary

Your weekly salary is based on health at the end of the week:

| Health | Salary |
|---|---|
| 70 or above | $30 |
| 40–69 | $15 |
| Below 40 | $0 |

Keeping health high is the primary way to stay solvent over 4 weeks.

---

## Care Actions

### Feed

| Item | Cost | Hunger restored | Happiness bonus |
|---|---|---|---|
| Basic Kibble | $8 | +15 | — |
| Premium Meal | $18 | +30 | +5 |
| Gourmet Feast | $32 | +50 | +15 |
| Mystery Snack | $4 | +5 or +25 (50/50) | — |

Mystery Snack is a gamble — cheap but unreliable. Don't let hunger get critical and then bet on it.

### Play

Playing costs energy. Don't play when energy is already low.

| Item | Cost | Happiness restored | Energy cost |
|---|---|---|---|
| Yarn Ball | $10 | +20 | −10 |
| Puzzle Toy | $22 | +35 | −15 |
| Luxury Playset | $40 | +50 | −20 |

### Rest

**Free.** Restores **+20 energy**. Use this whenever energy dips — it costs nothing.

### Clean

**$8.** Restores **+30 hygiene.** Clean regularly; hygiene drains slowly but low hygiene silently chips away at health.

### Vet

| Option | Cost | Health restored | Notes |
|---|---|---|---|
| Checkup | $25 | +20 | Counts as **preventive** spending |
| Full Treatment | $60 | +50 | Also gives +10 to all other stats; counts as **emergency** spending |

Checkups cost less and score better. Full Treatment is for emergencies. Using it too much hurts your financial score.

### Learn a Trick

**$20.** Teach your pet a custom trick. There's no stat benefit — it's logged in your action history and reflected in your final report.

---

## Minigames

Minigames are the main way to earn extra money. Access them from the Finance Panel. Each game can be played multiple times.

### Budget Blitz

10 math questions about pet-care costs (vet bills, salary vs. bills, etc.). You have 8 seconds per question.

**Earnings:** Scales with correct answers, up to $80 for a perfect run.

### Food Catcher

Move the basket left and right to catch falling food. Avoid the poison items (💊 🦠). Coins and strawberries are worth extra.

**Earnings:** $10 / $30 / $55 / $80 based on your score.

### Memory Match

Flip cards to find matching pet-care pairs. You have 60 seconds.

**Earnings:** $10 per matched pair, up to $80 for all 8 pairs.

### Reflex Tap

A glowing paw appears somewhere on screen — click it before it disappears. 15 rounds. It gets faster each round.

**Earnings:** $10 / $30 / $55 / $80 based on how many you hit.

### Care Sequence

Simon Says with pet care actions. Watch the sequence light up, then repeat it. The sequence grows by 1 each round. 5 rounds total (starting at length 3).

**Earnings:** $15 per round completed, up to $75 for a clean run.

---

## Scoring

After 4 weeks (or if the game ends early) you get a report with a score from 0 to 100, broken down into four components:

| Component | Weight | What it measures |
|---|---|---|
| Wellbeing | 40% | Average of happiness, health, and energy across all 4 weeks |
| Financial Responsibility | 30% | How much of your spending was preventive vs. emergency |
| Consistency | 20% | How stable your stats were week to week — big swings hurt this |
| Spending Volatility | −10% | How erratic your spending was (a penalty — steady budgets score better) |

**Financial Responsibility** rewards routine care (food, cleaning, checkups) over emergency vet visits. If you let your pet crash and then dump money into Full Treatments, this score suffers.

**Consistency** penalizes the pattern of ignoring your pet and then scrambling. Steady, regular care scores higher than the same average achieved through peaks and crashes.

Your final score determines your tier:

| Score | Tier |
|---|---|
| 90–100 | Elite Owner |
| 75–89 | Responsible Owner |
| 60–74 | Learning Owner |
| 40–59 | Struggling Owner |
| 0–39 | Neglectful Owner |

---

## Tips

- **Rest is free — use it constantly.** Energy decay is slow, but rest costs nothing and protects happiness from compounding.
- **Feed before hunger hits 50.** Below 50, health starts silently eroding. Below 30, it erodes fast.
- **Clean every week or two.** Hygiene looks harmless but behaves the same as hunger when it gets low.
- **Prioritize Checkups over Full Treatments.** They're cheaper, score as preventive, and are enough if you don't let health bottom out.
- **Play minigames early.** Getting to $250–$280 by week 2 gives you room to care properly without watching every dollar.
- **Don't overspend on luxury items.** Gourmet Feast and Luxury Playset are efficient per stat point but drain your wallet fast. Basic Kibble and Yarn Ball usually do the job.
- **Keep spending relatively even across weeks.** Volatile spending (nothing one week, everything the next) reduces your score by up to 10 points.

---

## How to Run

```bash
npm install
npm run dev
```
