# Judge Q&A Prep (PetPal Virtual Pet)

## 1) How does your project meet the required topic?

Answer:

"The app is a virtual pet with customization (owner name, pet name, pet type), care actions (feed, play, rest, clean, health checks), pet reactions through mood states, a running cost-of-care wallet/expense system, and optional earnings plus savings goals."

## 2) Where is the cost-of-care system implemented?

Answer:

"Finance logic is centralized in `src/hooks/useFinance.js`. It records spending, income, weekly bills, wallet balance, and savings goals. Every care action triggers a finance entry so the report can analyze total costs and categories."

## 3) How do you validate user input?

Answer:

"Validation is handled in `src/utils/validators.js` and surfaced in the UI. We use syntactic validation for names/trick text/savings goal format, and semantic validation for things like affordability and savings goals exceeding the starting budget."

## 4) How do you show pet reactions?

Answer:

"Pet reactions are represented as mood states derived from live stats in `src/utils/helpers.js` and updated in `src/hooks/usePet.js`. The UI displays moods like happy, sick, sad, energetic, tired, and content."

## 5) What data structures do you use?

Answer:

"We use arrays/lists for expenses, action logs, tricks, badges, pets, and item data. These structures make it easy to summarize and analyze results in the final report."

## 6) How is the report meaningful instead of just a log?

Answer:

"The report includes score calculations, care summary, financial summary, expense breakdown percentages, care activity counts, and decision insights. The raw action log is included only as supporting detail."

## 7) Why did you use React + Vite?

Answer:

"React helps us separate UI into clean reusable components, and Vite provides a fast development/build workflow. This improves modularity and maintainability, which aligns with the rubric's code quality emphasis."

## 8) What happens if the user overspends?

Answer:

"Most care actions require enough wallet funds and are blocked if unaffordable. Weekly living costs still charge automatically, which can create debt. This models real cost-of-care pressure and forces better planning."

## 9) How do you handle savings goals?

Answer:

"The user can set an optional savings goal in the finance dashboard. The app validates the amount, tracks progress visually, and shows goal status in the final report."

## 10) How do you store leaderboard data?

Answer:

"Leaderboard entries are stored in browser `localStorage` so the app works offline and remains dependable during presentations."

## 11) What part of the code would you improve next?

Answer:

"Next steps would be adding automated tests for validators and hooks, plus optional export of report data as CSV/PDF for deeper analysis. We prioritized rubric coverage, reliability, and demo clarity first."

## 12) How did you keep the app stable without over-engineering?

Answer:

"We kept business logic in two hooks (`usePet`, `useFinance`) and used simple deterministic rules for stats, costs, and scoring. This keeps the code easy to explain, debug, and judge quickly."

## Code References to Mention Quickly

- `src/hooks/usePet.js` - pet state/actions/reactions
- `src/hooks/useFinance.js` - wallet/expenses/income/goals
- `src/components/Report.jsx` - report analytics
- `src/utils/validators.js` - validation rules
- `docs/FBLA_COMPLIANCE_CHECKLIST.md` - rubric/topic mapping
