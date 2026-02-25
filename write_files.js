const fs = require("fs");
const base = "C:/Users/Bahlk/OneDrive/Desktop/Clubs/FBLA/petpal/src";

// App.jsx
const appJsx = [
  "import { useEffect, useRef, useState } from 'react';",
  "import SetupScreen from './components/SetupScreen';",
  "import PetDisplay from './components/PetDisplay';",
  "import StatBars from './components/StatBars';",
  "import ActionPanel from './components/ActionPanel';",
  "import FinancePanel from './components/FinancePanel';",
  "import BadgePanel from './components/BadgePanel';",
  "import Minigame from './components/Minigame';",
  "import Report from './components/Report';",
  "import Leaderboard from './components/Leaderboard';",
  "import HelpModal from './components/HelpModal';",
  "import usePet, { PET_ACTIONS } from './hooks/usePet';",
  "import useFinance from './hooks/useFinance';",
  "import { formatCurrency, calculateAvgStat } from './utils/helpers';",
  "",
  "const TOTAL_WEEKS = 12;",
  "const WEEK_DURATION_MS = 20000;",
  "",
