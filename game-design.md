# Game Design Document — Kotoba Quest

## Description

Kotoba Quest is an educational RPG that gamifies Japanese language learning within a cyberpunk-themed world. Players take on the role of a "Kotoba Runner" navigating a neon-lit digital landscape, battling enemies through Japanese vocabulary mastery (Hiragana, Katakana, Kanji). The game blends classic RPG mechanics with language acquisition, turning flashcards and quizzes into real-time combat encounters.

Core loop: learn vocabulary → enter battle → answer correctly to deal damage → defeat enemies → unlock new content and equipment.

## Genre

**Educational RPG / Gamified Language Learning**

- Primary: Language learning (Japanese)
- Secondary: Turn-based RPG combat
- Theme: Cyberpunk (neon cities, digital realms, holographic interfaces)
- Target audience: Japanese language learners of all levels
- Tone: Encouraging, immersive, slightly futuristic

## Platform

**Web (Browser-based)**

- Framework: React 19 with TypeScript
- Build tool: Vite
- Styling: Tailwind CSS v4
- Runtime: Modern browsers (Chrome, Firefox, Safari, Edge)
- Deployment: Static web hosting (Vite build output)
- No native mobile app — responsive web design targets desktop and mobile browsers

## Level Design

The game is structured into **5 Worlds**, each containing **10 levels** with progressive difficulty:

| World | Theme | Focus | Enemy Type |
|---|---|---|---|
| Hiragana Dojo | Neon dojo with floating characters | Hiragana recognition | Sensei bots, stroke drones |
| Katakana Tower | Glitching skyscraper | Katakana reading | Glitch mobs, firewall sprites |
| Kanji Citadel | Massive fortress | Kanji meanings/readings | Samurai programs, gatekeepers |
| Vocabulary Wastes | Scavenger outskirts | Word translation | Scavenger drones, word wraiths |
| Boss Arena | Core mainframe | Mixed review | Raiden (final boss) |

**Progression rules:**
- Worlds unlock sequentially; levels within a world unlock linearly
- Each level increases vocabulary complexity (JLPT N5 → N4 → N3)
- Enemy HP scales by tier (early: ~100 HP, mid: ~200 HP, late: ~350 HP)
- Clearing a level grants: Gold, XP, equipment unlocks (weapons, armor, accessories)
- Stars: 1-3 stars per level based on performance (no damage taken, fast clear, 100% correct)

## Gameplay

### Core Loop

```
Username Entry → Mode Selection → Level Selection → Battle → Progression
```

### Mode Selection

- **Learn Mode**: Study vocabulary without penalties; view flashcards, listen to audio, see example sentences
- **Practice Mode**: Enter battles with reduced enemy HP; safe environment to test knowledge

### Battle System

**Turn-Based Vocab Combat**

- **Player Stats**: 150 HP (persistent across battles, restored between levels)
- **Enemy HP**: Scales by tier (see Level Design table)
- **Vocab Question Flow**:
  1. Enemy presents a Japanese word (Hiragana/Katakana/Kanji) or meaning
  2. Player is given 4 multiple-choice options (English or Japanese)
  3. **Correct answer**: Deals `30 + weapon damage` to enemy
  4. **Wrong answer**: Deals `10 damage` to player
  5. **Time limit**: Enemy attack timer (unanswered = auto-wrong)

**SP (Skill Point) System:**
- Player starts each battle with 100 SP
- Skills cost SP and can be used once per turn:

| Skill | Cost | Effect |
|---|---|---|
| Zen Slash | 30 SP | Deals 50 damage + reveals correct answer hint |
| Neon Guard | 20 SP | Restores 40 HP |
| Data Pulse | 50 SP | Skips current question (no damage to either side) |

### Progression & Rewards

- **XP**: Earned per correct answer (10 XP) and level clear bonus (100 XP)
- **Gold**: Dropped by enemies; spent in the in-game Shop
- **Equipment Unlocks**:
  - Weapons: Increase base damage (Katana +5, Pulse Blade +10, Neon Edge +20)
  - Armor: Increases max HP (Data Vest +30, Cyber Suit +60)
  - Accessories: SP boost, XP multiplier, gold finder
- **New Content Unlock**: Clearing a world unlocks the next world + a new battle region on the map

### Persistence (from `useGameState.ts`)

- **IndexedDB** (preferred) + **LocalStorage** (fallback)
- Saved: Current level, world progress, inventory, equipment, gold, XP, star ratings
- **PersistenceAdapter** interface with `IndexedDBAdapter` and `LocalStorageAdapter`
