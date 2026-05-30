# Implementation Report — Kawaii Redesign v2

**Branch:** `kawaii-redesign`  
**Date:** 2026-05-29  
**Status:** Complete — Build & type-check pass

---

## Summary

Implemented the new question system, mode renames, Word Card for first-time words in Belajar mode, and a new Words collection page.

---

## Files Changed/Created

### New Files (3)
| File | Purpose |
|------|---------|
| `src/utils/questionUtils.ts` | Question type-pair generator with validation rules |
| `src/components/battle/WordCard.tsx` | Staggered reveal Word Card overlay for Belajar mode |
| `src/pages/Words.tsx` | Collected words page grouped by level |

### Modified Files (12)
| File | Changes |
|------|---------|
| `src/types.ts` | `GameMode` → `'BELAJAR' \| 'LATIHAN' \| 'TANTANGAN'`; `Page` → added `'WORDS'`; `Level` → added `seenWordIndices: number[]` |
| `src/constants.ts` | Added `seenWordIndices: []` to all 25 levels |
| `src/hooks/useGameState.ts` | Default mode → `'BELAJAR'`; added `markWordSeen()` action; returns it from hook |
| `src/hooks/useBattleEngine.ts` | Renamed mode switch (`BELAJAR`/`LATIHAN`); added `isPaused` state + `SET_PAUSED` action; timer respects pause; `setPaused` action exposed |
| `src/pages/ModeSelect.tsx` | Updated mode values, labels, descriptions to Indonesian |
| `src/pages/Battle.tsx` | Integrated WordCard overlay + `generateQuestionConfig`; passes new props to QuestionCard; tracks `seenThisBattle` per session; pauses timer during WordCard |
| `src/components/battle/QuestionCard.tsx` | Rewritten: new props (`questionText`, `options`, `correctAnswer`, `answerType`); removed old hint block; answer type label shown |
| `src/components/BottomNav.tsx` | Added "Kata" nav item with `BookOpen` icon |
| `src/App.tsx` | Added `Words` import + WORDS routing case; passes `markWordSeen` to Battle |

---

## Question Format Rules

| Question shows | Allowed answer types |
|---|---|
| Kana (`japanese`) | Indonesian, Kanji, Romaji |
| Kanji | Kana, Indonesian, Romaji |
| Romaji | Kanji, Kana |
| Indonesian | Kanji, Kana |

- Question type ≠ answer type (no trivial matches)
- All 4 answer buttons always show the **same type** (no mixing)
- Words without kanji: Kanji excluded from both question and answer types

---

## Word Card Behavior (Belajar mode only)

- Shows when a word is encountered for the **first time** in the battle
- Tracks seen words per battle via `Set<number>` (ref)
- Also persists to `seenWordIndices` in Level (via `markWordSeen` → localStorage)
- Staggered reveal: Kanji → Kana → Romaji → Indonesian meaning (2s intervals)
- Auto-closes after 18 seconds
- Close button available immediately
- **Pauses** enemy attack timer while visible

---

## Mode Renames

| Old | New | Internal value |
|-----|-----|------|
| LEARNING | Belajar | `'BELAJAR'` |
| PRACTICE | Latihan | `'LATIHAN'` |
| TANTANGAN | Tantangan | `'TANTANGAN'` |

---

## Navigation

BottomNav now has 4 items:
1. Play → LEVEL_SELECT
2. Mode → MODE_SELECT
3. **Kata** → WORDS (new)
4. Profile → INVENTORY

---

## Words Page

- Lists all words the user has seen in Belajar mode
- Grouped by level, with progress indicator (`N / total`)
- Each word card shows: Kanji, Kana, Romaji, Indonesian meaning
- Empty state prompts user to start Belajar mode

---

## Persistence

- `seenWordIndices: number[]` added to `Level` interface
- All 25 INITIAL_LEVELS initialized with `seenWordIndices: []`
- Existing localStorage saves: `seenWordIndices` will be `undefined` → handled gracefully (default `[]`)
- Persisted via the existing debounced `kotoba_levels` write

---

## Build Result

```
✓ built in 3.38s
✓ tsc --noEmit (no errors)
```
