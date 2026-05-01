# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kotoba Quest** is a Japanese vocabulary learning RPG game built with React + TypeScript. The game features:
- Cyberpunk/synthwave neon aesthetic (dark mode default)
- Turn-based vocabulary battles where correct answers deal damage
- 20 themed levels with ~15 words each (300+ vocabulary items)
- RPG mechanics: SP skills, inventory/equipment, enemy scaling
- Endless mode and experimental AI-powered battle mode
- LocalStorage-based persistence (no backend required)

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 (with CSS custom properties for theming)
- **Animations**: Motion (framer-motion)
- **State**: React hooks (useReducer, useState, useEffect, useCallback, useMemo)
- **Routing**: Custom page-based routing via `useGameState` hook (no React Router)
- **Storage**: LocalStorage (persistence for levels, inventory, username, power score, endless records)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (`@google/genai`) for experimental battle mode

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server (port 3000, host 0.0.0.0)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check (no emit)
npm run lint

# Clean dist folder
npm run clean
```

## Project Architecture

### Routing & State Management

- **Centralized State**: All global state managed in `src/hooks/useGameState.ts`
  - Current page, selected level, game mode (KANA/KANJI)
  - Levels progress, inventory, equipment, power score
  - Endless mode records, username, theme preference
  - LocalStorage persistence via useEffect sync
  - Navigation handler with special guard for endless mode

- **Page System**: Custom page-based routing (not React Router)
  - Pages defined in `src/App.tsx` via switch statement
  - Pages: HOME, MODE_SELECT, LEVEL_SELECT, BATTLE, ENDLESS, INVENTORY, ABOUT, EXPERIMENTAL_BATTLE
  - Navigation through `handleNavigate` function in `useGameState`

### Battle System

- **Core Engine**: `src/hooks/useBattleEngine.ts`
  - useReducer with `BattleState` and `BattleAction` types
  - Manages: player/enemy HP, skill points, cooldowns, feedback states
  - Enemy attack timer ticks every 500ms, building cooldown to 100% then attacks
  - Shield skill blocks next attack and clears feedback
  - Victory when all words answered (non-endless); defeat when player HP ≤ 0

- **Battle Components** (`src/components/battle/`):
  - `EnemyPanel.tsx`: Displays enemy info, HP bar, rank/tier icon
  - `PlayerPanel.tsx`: Shows player HP, skill points, skill buttons (Zen Slash / Neon Guard)
  - `QuestionCard.tsx`: Main interaction area (display word, 4 multiple choice answers in Indonesian)
  - `InventoryModal.tsx`: Item usage modal (consumables only)
  - `VictoryScreen.tsx` / `DefeatScreen.tsx`: End states

- **Battle Flow**:
  1. Load level words (for endless: random word from combined pool)
  2. Show word (KANA: hiragana/katakana; KANJI: kanji with optional reading hint)
  3. Player selects Indonesian meaning from 4 choices
  4. Correct: damage enemy (25 + weapon bonus), gain 100 score, 25 SP
  5. Wrong: player takes 10 damage, screen shake
  6. Enemy attacks when cooldown reaches 100% (mitigated by shield)
  7. Next word auto-advances after 600ms feedback
  8. Enemy defeated → spawn next enemy with scaling stats
  9. Battle ends: victory (all words) or defeat (HP=0)

### Data Models

- `src/types.ts`: Core TypeScript interfaces
  - `Page`, `GameMode`, `Word`, `Level`, `Item`, `GameState`, `EndlessRecord`

- `src/constants.ts`:
  - `INITIAL_LEVELS`: 20 themed levels with vocabulary (Japanese, Kanji, Indonesian, Romaji)
  - `INITIAL_INVENTORY`: Starting equipment (Uchigatana, Tedate Kayu, Ramuan Yakuso x3)

- `src/utils/enemyUtils.ts`:
  - `EnemyTemplate` interface
  - Tier system (Ashigaru → Samurai → Hatamoto → Daimyo → Shogun)
  - HP, damage, strength scaling per tier
  - Boss enemies: historical figures (Date Masamune, Sanada Yukimura, Oda Nobunaga, Tokugawa Ieyasu)

### Styling & Themes

- Tailwind CSS v4 with custom `@theme` in `src/index.css`
- CSS custom properties: `--main`, `--accent`, `--bg-primary`, `--bg-surface`, `--text-primary`, `--text-secondary`
- Dark mode default (`:root` = light, `.dark` = dark)
- Cyberpunk neon palette: cyan (`#009CFF`) as primary, green (`#49F89B`) as accent
- Custom component classes: `.neon-border`, `.neon-text-cyan`, `.battle-panel`, `.hp-bar`, `.sp-bar-bg`, `.skill-button`
- Animations: `.animate-shake` keyframe for feedback

### API Integration

- Gemini AI integration in `src/pages/ExperimentalBattle.tsx` (16KB file)
- API key from `import.meta.env.GEMINI_API_KEY` (injected via Vite config)
- Used for dynamic word generation/grading in experimental mode

## Important Files to Know

- `src/App.tsx` - Main app component with page routing and motion transitions
- `src/hooks/useGameState.ts` - Global state and navigation logic
- `src/hooks/useBattleEngine.ts` - Battle reducer and timer logic
- `src/constants.ts` - All level data and initial inventory
- `src/types.ts` - TypeScript interfaces
- `src/index.css` - Theme, global styles, and custom component classes
- `src/pages/` - All page components (8 pages)
- `src/components/` - Shared components and battle subfolder
- `vite.config.ts` - Vite config with Tailwind plugin, alias `@/*`, Gemini API key injection

## Data Persistence

LocalStorage keys (all prefixed `kotoba_`):
- `kotoba_levels` - JSON string of Level[]
- `kotoba_inventory` - JSON string of Item[]
- `kotoba_username` - string
- `kotoba_power_score` - number as string
- `kotoba_endless_records` - JSON string of EndlessRecord[]
- `kotoba_theme` - "dark" or "light"

Helper functions in `useGameState` handle safe parsing with fallbacks.

## Level Progression & Rewards

- **Levels**: 20 levels, each with `unlockedWordCount` (starts at 15, increments by 5 on victory)
- **Victory bonus**: unlocks 5 additional words in that level
- **Endless mode**: combine unlocked words from selected levels; fights scale infinitely
- **Battle rewards** (on victory):
  - Always: 1x "RAMUAN YAKUSO" (heal 50 HP)
  - Conditional:
    - Tier 5 or score ≥1500: "MASAMUNE KATANA" (LEGENDARY, +35 ATK)
    - Tier 4 or score ≥800: "O-YOROI ARMOR" (EPIC, +20 DEF)
    - ≥2 enemies beaten: "JUUMONJI YARI" (RARE, +15 ATK)

## Admin Features

- Hidden in About page (password protected)
- Password: `faira` (case-insensitive)
- Shows "I LOVE YOU" on success

## Vocabulary System

- Indonesian to Japanese translation questions
- Multiple choice with 1 correct + 3 distractors (random from other words)
- Modes:
  - **KANA**: displays `japanese` field (hiragana/katakana)
  - **KANJI**: displays `kanji` field (falls back to `japanese` if no kanji)

See `VOCABULARY.md` for full word list (525+ entries across categories).

## Development Tips

- Use `pm2` or similar for dev server with file watching (HMR enabled unless `DISABLE_HMR=true`)
- Test on mobile viewport (bottom nav fixed, stacked layout)
- Battle animations: Motion `AnimatePresence` for page transitions; shake effect for damage
- Enemy tier calculation: `tier = min(5, floor(enemiesBeaten / 5) + 1)`
- When modifying `INITIAL_LEVELS`, ensure `id`, `name`, `icon`, `words[]` structure intact
- Icons: use Lucide React icon names (look at existing levels: UserCircle, BookOpen, Zap, Utensils, etc.)
- Tailwind v4 uses `@apply` with custom `@theme` variables; no JavaScript config needed

## Common Tasks

**Add a new level:**
1. Add to `INITIAL_LEVELS` in `src/constants.ts`
2. Set `id` (unique), `name`, `icon` (lucide-react name), `words` array
3. Each word: `{ japanese, kanji?, indonesian, romaji }`

**Modify battle difficulty:**
- Adjust base values in `initialBattleState` (starting HP, damage)
- Modify `battleReducer` constants (damage values, SP gains)
- Change enemy scaling in `generateEnemy` tier configs

**Add new equipment:**
- Add to `INITIAL_INVENTORY` or create loot tables in `Battle.tsx` `handleFinish`
- `Item` type: `id`, `name`, `type` (WEAPON/SHIELD/ACCESSORY/CONSUMABLE), `description`, `rarity`, and bonuses
- Ensure `isEquipped` defaults for starting gear

**Implement experimental features:**
- Use `src/pages/ExperimentalBattle.tsx` as sandbox
- Import Gemini from `@google/genai` and use `import.meta.env.GEMINI_API_KEY`

## Testing Notes

- No test suite currently; manual testing via `npm run dev`
- Battle flow: navigate to LEVEL_SELECT, pick level, play through
- Check localStorage keys in DevTools → Application → Storage
- Test both KANA and KANJI modes (toggle in MODE_SELECT)

## Build & Deploy

- Production build: `npm run build` → `dist/` folder
- Deployable to Vercel, Netlify, or any static host
- Requires `GEMINI_API_KEY` secret for experimental battleno

## Repository Context

- Initial commit added 20 levels, RPG battle system, enemy ranks, boss encounters
- Experimental battle mode added early (uses Gemini AI)
- Progressive unlock system (words unlocked per level)
- No backend; all data client-side

## Notes for Future Development

- Consider migrating from localStorage to IndexedDB for larger vocab sets
- Add user accounts/cloud sync if needed
- Implement word pinning or spaced repetition algorithm
- Add audio pronunciation (requires media assets)
- Leaderboards or power score comparison would need backend
