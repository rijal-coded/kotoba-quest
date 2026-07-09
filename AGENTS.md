# Kotoba Quest — Agent Guide

## Commands
- `npm run dev` — dev server on port 3000, 0.0.0.0
- `npm run lint` — **typecheck only** (`tsc --noEmit`), not a linter
- `npm run build` / `npm run preview` — production build and preview
- No test suite exists

## Architecture
- **No React Router**. Page routing is a `currentPage` state machine in `App.tsx` with pages: HOME, MODE_SELECT, LEVEL_SELECT, BATTLE, INVENTORY, FORGE, ABOUT, WORDS
- Entrypoint: `src/main.tsx` → `src/App.tsx`
- Persistence: abstraction layer (`PersistenceAdapter`) with localStorage (default) or IndexedDB (opt-in via `VITE_USE_INDEXEDDB=true` env). Game state hydrates on mount with debounced batch writes (500ms).
- Path alias `@/` resolves to project root (both tsconfig and vite config)

## Dev notes
- `motion` is used (not `framer-motion`) — import from `motion/react`
- Tailwind CSS v4 — use `@import "tailwindcss"` in CSS, NOT `@tailwind` directives
- `design.md` is the source of truth for kawaii styling convention (colors, typography, components)
- CSS variables for theme colors are defined in `src/index.css` — always use them via `var(--main)`, never hardcode
- Root-level JSON files (`kanji_entries.json`, `vocab_entries.json`) are vocabulary data

## Env & platform
- `DISABLE_HMR=true` disables HMR (used in AI Studio to prevent flickering during agent edits)
- Designed for Google AI Studio deployment (see `metadata.json` and README)
- `.env*` is gitignored (except `.env.example`)

## Dependencies of note
- `tsx` in devDependencies — for running ad-hoc TypeScript scripts
- `lucide-react` — icons
