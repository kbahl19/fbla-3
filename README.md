# PetPal (FBLA Intro to Programming - Virtual Pet)

PetPal is a React + Vite virtual pet game built for the 2025-2026 FBLA Introduction to Programming topic. The app combines pet care gameplay with a cost-of-care budgeting system so users must balance health, happiness, and spending decisions.

## Topic Coverage (Required Features)

- Customization:
  - Player enters `owner name`
  - Player chooses `pet name`
  - Player chooses `pet type`
- Care actions:
  - `Feed`
  - `Play`
  - `Rest`
  - `Clean`
  - `Health Check` (vet)
- Reactions to care level:
  - Pet mood states include `happy`, `sick`, `sad`, and `energetic` (plus `tired/content`)
- Cost-of-care system:
  - Running wallet total
  - Action costs
  - Weekly living costs
  - Salary tied to pet health
- Optional earning/savings goals:
  - Minigames generate income
  - User can set a savings goal and track progress

## Rubric-Focused Improvements Included

- Modular React components and hooks (`usePet`, `useFinance`)
- Input validation with both syntactic and semantic checks visible in the UI
- Clear navigation (`Help`, `Leaderboard`, `Minigames`, `Report`)
- Meaningful end-of-session report (score, expense breakdown, action analysis, insights)
- Local data storage using arrays/lists and `localStorage` for leaderboard
- Competition-ready documentation pack in `docs/`

## Setup and Run

1. Install dependencies:
   - `npm install`
2. Start the development server:
   - `npm run dev`
3. Build production bundle:
   - `npm run build`
4. Optional preview:
   - `npm run preview`

## 7-Minute Demo (Quick Version)

Use `docs/DEMO_SCRIPT_7_MIN.md` for the full judging demo script.

Recommended demo flow:

1. Start at setup screen and show validation messages.
2. Customize owner name, pet name, and pet type.
3. Demonstrate feed/play/rest/clean/health check actions.
4. Show pet mood/reactions and stat changes.
5. Show wallet changes, weekly bills/salary, and savings goal validation.
6. Play one minigame to earn money.
7. Open final report and explain analytics + cost-of-care decisions.

## Validation (Syntactic + Semantic)

- Syntactic validation examples:
  - Pet name format and max length
  - Owner name allowed characters and max length
  - Trick name format and duplicate prevention
  - Savings goal must be a whole dollar value
- Semantic validation examples:
  - Cannot purchase items when wallet funds are insufficient
  - Savings goal cannot exceed starting budget
  - Action buttons disable when unaffordable

## Reports and Analysis Output

The final report is designed for analysis (not just logs) and includes:

- Final score and score tier
- Pet care summary (mood/stage/stats/tricks/minigames)
- Financial summary (income/spending/final wallet/savings goal status)
- Expense breakdown by category with percentages
- Care activity analysis (counts for feed/play/rest/clean/health checks/tricks)
- Decision insights (biggest expense, bills vs income, coaching observations)
- Detailed action log for audit trail

## Templates, Libraries, and Tools Used

### Libraries / Frameworks

- `react` (UI framework)
- `react-dom` (React DOM renderer)
- `vite` (dev server / build tool)
- `@vitejs/plugin-react` (Vite React support)
- `tailwindcss` (utility CSS framework)
- `postcss` (CSS processing)
- `autoprefixer` (vendor prefixes)

### Templates / Starters

- Vite React project structure (`create-vite` style layout)
- Tailwind CSS configuration for Vite/React integration

## Attributions / Credits

- Unicode emoji characters are used for pet/item visuals (native platform emoji rendering)
- Fonts are loaded via Google Fonts (see `index.html`)
- No paid assets or external image packs are required for core gameplay

## FBLA Compliance Checklist (README Summary)

See the full checklist in `docs/FBLA_COMPLIANCE_CHECKLIST.md`.

- Topic requirements covered: Yes
- Cost-of-care running total and expense tracking: Yes
- Customization + care actions + pet reactions: Yes
- Savings/earning goal support: Yes
- Validation (syntactic + semantic) visible to user: Yes
- Help/navigation clarity: Yes
- Report supports analysis: Yes
- Documentation + attributions + demo prep: Yes

## File/Code Map (Key Files)

- `src/App.jsx` - app flow, weekly timer, view routing
- `src/hooks/usePet.js` - pet state, mood logic, care actions
- `src/hooks/useFinance.js` - wallet, expenses, savings goal, income/bills
- `src/components/SetupScreen.jsx` - setup UX and validation messages
- `src/components/ActionPanel.jsx` - care actions and trick validation UX
- `src/components/FinancePanel.jsx` - budget, savings goal, recent expenses
- `src/components/HelpModal.jsx` - in-app help and instructions
- `src/components/Report.jsx` - final analytics/report output
- `src/utils/validators.js` - validation rules
- `docs/` - FBLA submission support documents

## Notes for Judges / Evaluators

- Leaderboard data is stored locally in browser `localStorage` for privacy and offline demo reliability.
- The app intentionally favors stable, explainable logic over unnecessary complexity to support quick judging review.
