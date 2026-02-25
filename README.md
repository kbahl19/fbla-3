# PetPal

PetPal is a production-quality virtual pet web app built for FBLA Introduction to Programming. It blends pet care with real budgeting decisions to teach opportunity cost, expense tracking, savings goals, and cash-flow tradeoffs.

**Business framing**
Managing PetPal mirrors a small business lifecycle: baby (startup), teen (growth), adult (established). Spending choices affect the pet's well-being and the wallet, encouraging smart financial planning and tradeoff awareness.

**Install and run**
1. `npm install`
2. `npm run dev`

**File structure**
- `petpal/index.html` - Vite HTML entry with Google Fonts.
- `petpal/package.json` - Dependencies, scripts, and versions.
- `petpal/postcss.config.js` - PostCSS + Tailwind configuration.
- `petpal/tailwind.config.js` - Tailwind theme setup and content paths.
- `petpal/vite.config.js` - Vite configuration.
- `petpal/public/` - Static public assets.
- `petpal/src/App.jsx` - Screen router, global layout, and toast system.
- `petpal/src/index.css` - Tailwind directives and global styling.
- `petpal/src/main.jsx` - React entry point.
- `petpal/src/components/SetupScreen.jsx` - Pet setup form and validation.
- `petpal/src/components/PetDisplay.jsx` - Pet avatar, mood, stage, and tricks.
- `petpal/src/components/StatBars.jsx` - Animated stat bars with warnings.
- `petpal/src/components/ActionPanel.jsx` - Feed/play/rest/clean/vet/trick tabs.
- `petpal/src/components/FinancePanel.jsx` - Wallet, budget, goals, expenses.
- `petpal/src/components/BadgePanel.jsx` - Badge grid with unlock toasts.
- `petpal/src/components/Minigame.jsx` - Falling food catcher earning game.
- `petpal/src/components/Report.jsx` - Session summary, logs, charts, and save.
- `petpal/src/components/Leaderboard.jsx` - Local leaderboard table and clear controls.
- `petpal/src/components/HelpModal.jsx` - Help modal with tabs and tips.
- `petpal/src/data/pets.js` - Pet definitions and evolution emojis.
- `petpal/src/data/items.js` - Food, toy, and vet item data.
- `petpal/src/data/badges.js` - Badge definitions and unlock conditions.
- `petpal/src/hooks/usePet.js` - Pet state, decay, evolution, and actions.
- `petpal/src/hooks/useFinance.js` - Budget, wallet, and expense tracking.
- `petpal/src/utils/validators.js` - Input and action validation utilities.
- `petpal/src/utils/helpers.js` - Formatting, mood, and stat helpers.

**Feature list**
- Five-screen flow: setup, game, minigame, report, leaderboard.
- Pet evolution stages tied to age and lifecycle framing.
- Persistent leaderboard saved only in `localStorage`.
- Real-time stat decay and mood calculation.
- Action logging for full session reporting.
- Savings goals with progress tracking.
- Financial summaries with expense breakdown chart.
- Badge system with live unlock toasts.

**Cost of care system**
Every action has a clear monetary impact. Feeding, toys, vet visits, cleaning, and tricks deduct from the wallet; resting is free. Budget remaining and savings goals visualize cash flow tradeoffs and reinforce opportunity cost.

**Input validation**
Both syntactic and semantic checks are enforced. Examples include:
- Syntactic: pet name must be 20 characters or fewer and use only letters, numbers, and spaces.
- Semantic: attempting to buy a toy validates the current wallet can afford it before spending.

**Libraries and fonts**
- React 18.2.0
- React DOM 18.2.0
- Vite 5.4.0
- @vitejs/plugin-react 4.2.1
- Tailwind CSS 3.4.7
- PostCSS 8.4.39
- Autoprefixer 10.4.19
- Google Fonts: Fredoka One and Nunito

**Attribution**
- Emoji graphics are native Unicode characters.
- Fonts provided by Google Fonts.