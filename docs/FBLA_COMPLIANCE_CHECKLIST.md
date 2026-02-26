# FBLA Compliance Checklist - PetPal (Virtual Pet)

## Topic Requirement Mapping (2025-2026 Virtual Pet)

- [x] Customization (name + pet type + style profile)
  - `SetupScreen` collects owner name, pet name, pet type, plus `color theme`, `accessory`, and `personality`.
  - Live character creator preview shows the chosen type/emoji, names, and style selections before starting gameplay.
- [x] Care actions
  - Feed, Play, Rest, Clean, Health Check (vet) available in `ActionPanel`.
- [x] Reactions to care level
  - Mood states include `happy`, `sick`, `sad`, `energetic` (plus `tired/content`).
- [x] Running total of expenses
  - Wallet balance, total spending, and expense entries tracked in `useFinance`.
- [x] Optional earning/savings goals
  - Minigames provide income and savings goal tracking is available in `FinancePanel`.

## Rubric Alignment Checklist

### 1) Code Quality / Modularity / Comments

- [x] Component-based React structure
- [x] Logic split into reusable hooks (`usePet`, `useFinance`)
- [x] Utility helpers and validators separated (`src/utils/*`)
- [x] File-level comments present on core components/hooks
- [x] Clear naming for gameplay and finance actions

### 2) User Experience / Navigation / Help

- [x] Setup -> Game -> Minigame -> Report -> Leaderboard flow
- [x] Help modal with tabs for objective, gameplay, stats, finance, minigames, badges, tips
- [x] Visible action costs and wallet changes
- [x] Clear buttons for Help / Leaderboard / Minigames / Report
- [x] Typos and unclear symbols cleaned in key screens/help text

### 3) Input Validation (Syntactic + Semantic)

- [x] Syntactic validation shown in setup (owner name, pet name, creator selections)
- [x] Semantic setup validation (owner/pet names must be distinct)
- [x] Syntactic validation shown for trick names
- [x] Syntactic validation shown for savings goal format (whole dollars)
- [x] Semantic validation for affordability (disabled actions + messages)
- [x] Semantic validation for savings goal (cannot exceed starting budget)

### 4) Full Topic Coverage / Cost-of-Care System

- [x] Ongoing pet care impacts stats and mood
- [x] Spending reduces wallet
- [x] Weekly living costs auto-charge
- [x] Weekly salary depends on pet health
- [x] Final score combines finance + care performance

### 5) Reports / Analysis / Output Quality

- [x] Final score summary and tier
- [x] Financial summary (income, spending, wallet, goal status)
- [x] Expense breakdown with percentages
- [x] Care activity analysis (action counts)
- [x] Decision insights (bills/income/biggest expense/observations)
- [x] Action log for detailed audit trail

### 6) Data Storage / Data Structures

- [x] Arrays/lists used for expenses, actions, tricks, badges, pets, items
- [x] Local leaderboard persisted with `localStorage`
- [x] Structured objects used for finance entries and action logs

### 7) Documentation / Attributions / Submission Readiness

- [x] `README.md` includes setup instructions
- [x] `README.md` includes demo guidance
- [x] `README.md` lists libraries/templates used
- [x] `README.md` includes attributions/credits
- [x] `docs/DEMO_SCRIPT_7_MIN.md` included
- [x] `docs/QA_PREP.md` included
- [x] This compliance checklist included

## Demo Safety / Reliability Checklist

- [x] App runs locally with `npm install`, `npm run dev`
- [x] Production build script available: `npm run build`
- [x] Local-only leaderboard avoids network dependency
- [x] Help text explains scoring and salary rules during judging demo

## Presentation Protocol Prep (Team Use)

- [x] 7-minute timed demo script prepared
- [x] Judge Q&A prep prepared
- [x] Rubric mapping prepared for quick reference
