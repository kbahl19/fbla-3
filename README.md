# PetPal — Virtual Pet (FBLA Introduction to Programming)

PetPal is a browser-based virtual pet game built with React and Vite. Players name and customize a pet, make daily care decisions, and manage a budget across 4 in-game weeks. The goal is to keep the pet healthy while staying financially responsible — a pet in good health earns a weekly salary; a neglected one earns nothing.

## Topic Coverage

| Requirement | Implementation |
|---|---|
| Customization | Owner name, pet name, pet type (6 options), color theme (6), accessory (4) with a live character creator preview |
| Care actions | Feed, Play, Rest, Clean, Health Check (vet) |
| Pet reactions | 6 mood states — happy, sick, sad, energetic, tired, content — derived from live stat values |
| Cost-of-care | Running wallet balance, per-action costs, weekly living bills, health-based salary |
| Earning / savings | 5 playable minigames generate income; optional savings goal with format and range validation |

## How to Run

```bash
npm install
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

## Validation

**Syntactic** — checked in `src/utils/validators.js`:
- Pet name and owner name: required, max length, allowed characters (`[a-zA-Z0-9 ]` / `[a-zA-Z0-9 .'- ]`)
- Trick name: max 20 characters, no duplicates (case-insensitive)
- Savings goal: must be a positive whole dollar amount

**Semantic**:
- Owner name and pet name must be different (leaderboard/report clarity)
- Action buttons are disabled and show an error if the wallet balance is insufficient
- Savings goal cannot exceed the starting budget

## Scoring & Reports

The final report computes a score from 4 components:

| Component | Weight | What it measures |
|---|---|---|
| Wellbeing | 40% | Average of happiness, health, energy across all weeks |
| Financial Responsibility | 30% | Ratio of preventive to emergency spending |
| Consistency | 20% | Week-to-week stability of stats (penalizes large swings) |
| Spending Volatility | −10% | Coefficient of variation on weekly spend (penalizes erratic budgeting) |

The report also includes a financial summary, expense breakdown by category with percentages, care activity counts, contextual decision insights, and a full timestamped action log.

## Data Storage

- **In-memory:** Pet state (stats, mood, tricks, action log) and finance state (wallet, expenses, weekly snapshots) are managed in React hooks using arrays and objects.
- **Persistent:** Leaderboard entries are stored in `localStorage` so scores survive page reloads and work offline.

## Libraries / Tools

| Package | Purpose |
|---|---|
| `react` / `react-dom` | Component-based UI and rendering |
| `vite` / `@vitejs/plugin-react` | Fast dev server and production bundler |
| `tailwindcss` | Utility-first CSS — all styling done inline via class names |
| `postcss` / `autoprefixer` | Required PostCSS pipeline for Tailwind to process and add vendor prefixes |

**Fonts:** Fredoka One (headings) and Nunito (body) loaded from Google Fonts via `index.html`.

## Attribution

- Unicode emoji characters are used for all pet and item visuals — no external image files or paid assets
- Google Fonts are served by Google's CDN (free, no API key required)
- All application logic and UI is original

## Key Files

| File | Purpose |
|---|---|
| `src/App.jsx` | View routing, weekly timer, game flow |
| `src/hooks/usePet.js` | Pet state, stat decay, mood derivation, care actions |
| `src/hooks/useFinance.js` | Wallet, expenses, income, bills, savings goal |
| `src/components/SetupScreen.jsx` | Character creator with live preview and input validation |
| `src/components/ActionPanel.jsx` | Care actions panel with affordability checks |
| `src/components/FinancePanel.jsx` | Budget display and savings goal UI |
| `src/components/Report.jsx` | Final analytics report and score breakdown |
| `src/utils/validators.js` | All validation functions (syntactic and semantic) |
| `src/utils/scoringEngine.js` | 4-component weighted scoring algorithm |
| `src/components/minigames/` | 5 independent minigames (BudgetBlitz, FoodCatcher, MemoryMatch, ReflexTap, SequenceSimon) |
