# Game Design Document: Kotoba Quest

## 1. Project Overview
- **Game Title**: Kotoba Quest
- **Platform**: Web (Desktop & Mobile)
- **Genre**: Educational RPG / Vocabulary Learner
- **Aesthetic**: Cyberpunk / Synthwave / Neon

## 2. Gameplay Mechanics
### Core Loop
1. **Level Select**: Player chooses a themed level.
2. **Battle**: Player fights enemies by answering Japanese vocabulary questions (Indonesian to Japanese).
3. **Growth**: Earn progress, unlock themes, and improve skill stats.

### Battle System (RPG Elements)
- **Combat Logic**: Correct answers deal damage; incorrect answers damage the player.
- **Skill Points (SP)**: Gained through correct answers.
- **Active Skills**:
    - **Zen Slash**: High damage attack.
    - **Neon Guard**: Temporary damage reduction.
- **Inventory**: Players can use items like "Kapsul Adrenalin" to heal during battle.
- **Enemy Scaling**: Enemies gain ranks (Ashigaru to Shogun) and difficulty increases with player progress.

### Vocabulary System
- **Categories**: Nouns, Verbs, Adjectives, Expressions (No particles).
- **Modes**:
    - **KANA**: Focuses on Hiragana and Katakana.
    - **KANJI**: Displays Kanji with full Furigana/Okurigana support (e.g., 行く).
- **Target**: 200 unique vocab items.

## 3. Visual & UI Design
- **Theme**: Dark background with neon accents (Cyan, Pink, Orange).
- **Layout**:
    - **Mobile**: Vertical stacking with fixed stats and controls at the bottom for accessibility.
    - **Desktop**: Grid-based layout with a persistent skill/inventory sidebar aligned with the battle area.
- **Animations**: Using `framer-motion` for smooth transitions and combat effects.

## 4. Technical Stack
- **Framework**: React 18+ with Vite.
- **Styling**: Tailwind CSS.
- **Animations**: Motion (framer-motion).
- **Storage**: LocalStorage for persistent player data.

## 5. Security & Secret Features
- **Admin Access**: Protected via a hidden password prompt in the "About" page.
- **Current Password**: `faira` (Case-insensitive).
- **Admin Message**: "I LOVE YOU" (Visual confirmation).

## 6. Level Design
- Levels are categorized by real-world themes (e.g., School, Food, Transportation, Nature).
- Progress is gated by level completion and total words unlocked.
