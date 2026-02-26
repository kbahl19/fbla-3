# 7-Minute Demo Script (FBLA Introduction to Programming)

## Goal

Show full topic coverage quickly while emphasizing validation, cost-of-care decisions, and analyzable reporting.

## Setup Before Judges Arrive (Do This First)

- Open the app on the setup screen.
- Clear prior leaderboard if needed (for a clean demo).
- Keep one browser tab only.
- Have a short sample name and pet name ready.

## Demo Timeline (7:00)

### 0:00-0:45 - Opening / Project Summary

Say:

"This is PetPal, a virtual pet app for the FBLA Introduction to Programming topic. The user manages pet care and a cost-of-care budget over 12 in-game weeks. Final score depends on both pet health and financial decisions."

Show:

- Setup screen title and challenge summary
- Weekly salary + bills explanation card

### 0:45-1:45 - Customization + Validation

Show:

- Owner name field
- Pet name field
- Pet type choices
- Character creator style options (color theme, accessory)
- Live preview panel (updates instantly)

Actions:

1. Enter an invalid name (special characters) to trigger validation.
2. Correct it and show the "valid" helper message.
3. Trigger the semantic validation by making owner name and pet name identical, then correct it.
4. Choose a pet type and style options; point out the live preview changes.
5. Start game.

Say:

"Validation is both syntactic and semantic. The setup screen checks name formatting, valid option selections, and a semantic rule that keeps owner and pet names distinct for clearer reports."

### 1:45-3:30 - Core Care Actions + Reactions

Show:

- Pet display (mood/state)
- Stat bars
- Action panel tabs

Actions:

1. Feed pet (show cost and stat changes)
2. Play with pet (show happiness up / energy down)
3. Rest pet (free action)
4. Clean pet (cost + hygiene improvement)
5. Health check / vet action (cost + health improvement)
6. Optional: teach one trick (show trick validation)

Say:

"The pet reacts to care level through mood states like happy, sick, sad, and energetic. Care and neglect change stats in real time."

### 3:30-4:45 - Cost-of-Care + Finance Features

Show:

- Wallet balance
- Recent expenses list
- Savings goal section
- Weekly timer / weekly costs and salary indicators

Actions:

1. Attempt an action you cannot afford (or explain disabled state if not currently unaffordable).
2. Set a valid savings goal.
3. Mention invalid goal behavior (whole dollars, cannot exceed starting budget).

Say:

"This shows semantic validation. Unaffordable actions are disabled, and savings goals must be realistic relative to the starting budget."

### 4:45-5:30 - Earnings / Minigames

Show:

- Minigame button from finance panel
- Start one minigame briefly
- Return to game and point out wallet increase

Say:

"Minigames provide optional earnings, which supports the earning/savings goal part of the topic while keeping the game fun."

### 5:30-6:45 - Final Report / Analysis Output

Show:

- End session and report
- Final score block
- Pet care summary
- Financial summary
- Expense breakdown chart
- Care activity analysis
- Decision insights
- Action log

Say:

"Our report is designed for analysis, not just raw logs. It summarizes spending patterns, care actions, and decision quality."

### 6:45-7:00 - Close

Say:

"PetPal demonstrates all required virtual pet features with a cost-of-care system, visible validation, and a final report that supports decision analysis."

## If You Are Running Short on Time

Cut in this order:

1. Badges explanation
2. Trick teaching demo
3. Minigame play time (show screen only)

Do not cut:

1. Customization
2. Care actions
3. Cost-of-care / finance
4. Final report

## Likely Judge Follow-Up Prompts (Transition Lines)

- "I can show where validation is implemented in the code if you'd like."
- "I can also show how expenses are stored and grouped for the report."
- "The leaderboard is local for reliability during judging and no network dependency."
