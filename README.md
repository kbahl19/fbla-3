# PetPal — Virtual Pet (FBLA Introduction to Programming)

PetPal is a React + Vite virtual pet game. Raise your pet, manage a budget, and balance care decisions over 4 in-game weeks.

## Topic Coverage

- **Customization:** Owner name, pet name, pet type, color theme, and accessory — with a live character creator preview
- **Care actions:** Feed, Play, Rest, Clean, Health Check (vet)
- **Pet reactions:** Mood states driven by live stats — happy, sick, sad, energetic, tired, content
- **Cost-of-care:** Running wallet, per-action costs, weekly living bills, health-based weekly salary
- **Earning / savings:** Minigames generate income; optional savings goal with validation

## Setup

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Production build: `npm run build`
4. Preview build: `npm run preview`

## Validation

Syntactic:
- Pet/owner name format, max length, allowed character set
- Trick name format and duplicate prevention
- Savings goal must be a whole dollar amount

Semantic:
- Owner name and pet name must be different
- Cannot spend more than current wallet balance (buttons disabled)
- Savings goal cannot exceed starting budget

## Reports

The final report generates a 4-component score (Wellbeing 40%, Financial Responsibility 30%, Consistency 20%, Spending Volatility −10%), a full financial summary, expense breakdown by category with percentages, care activity counts, and decision insights. An action log provides a full audit trail.

## Libraries / Tools Used

- `react`, `react-dom` — UI framework
- `vite`, `@vitejs/plugin-react` — dev server and build tool
- `tailwindcss`, `postcss`, `autoprefixer` — CSS styling
- Google Fonts (Fredoka One, Nunito) — loaded via `index.html`

## Attribution

- Unicode emoji used for pet and item visuals (native platform rendering)
- No paid assets or external image packs required

## Key Files

- `src/App.jsx` — view routing, weekly timer, game flow
- `src/hooks/usePet.js` — pet state, stat decay, mood logic, care actions
- `src/hooks/useFinance.js` — wallet, expenses, income, bills, savings goal
- `src/components/SetupScreen.jsx` — character creator and input validation
- `src/components/ActionPanel.jsx` — care actions and trick UI
- `src/components/FinancePanel.jsx` — budget and savings goal UI
- `src/components/Report.jsx` — final analytics report
- `src/utils/validators.js` — all validation rules
- `src/utils/scoringEngine.js` — 4-component scoring algorithm
