# Game Design Document — Kotoba Quest

## Description

Kotoba Quest is an educational RPG that gamifies Japanese language learning within a cyberpunk-themed world. Players take on the role of a "Kotoba Runner" navigating a neon-lit digital landscape, battling enemies through Japanese vocabulary mastery (Hiragana, Katakana, Kanji). The game blends classic RPG mechanics with language acquisition, turning flashcards and quizzes into real-time combat encounters.

**Core Loop:** Learn vocabulary → Enter battle → Answer correctly to deal damage → Defeat enemies → Unlock new content and equipment.

**Target Audience:** Japanese language learners of JLPT N5 Level.

**Tone:** Encouraging, immersive, slightly futuristic with synthwave/cyberpunk aesthetics.

---

## Genre

**Educational RPG / Gamified Language Learning**

- **Primary:** Language learning (Japanese)
- **Secondary:** Turn-based RPG combat
- **Theme:** Cyberpunk (neon cities, digital realms, holographic interfaces)
- **Perspective:** Top-down/battle-focused with interactive UI
- **Platform:** Web browser (responsive design)

---

## Platform

**Web (Browser-based)**

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (framer-motion)
- **Runtime:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Deployment:** Static web hosting (Vite build output → `dist/`)
- **Mobile Support:** Responsive web design (desktop and mobile browsers)
- **AI Integration:** Google Gemini API for experimental battle mode

**No native mobile app** - fully browser-based with offline capabilities via LocalStorage persistence.

---

## Level Design

### World Structure

The game is structured into **5 Worlds**, each containing **10 levels** with progressive difficulty:

| World             | Theme                              | Focus                   | Enemy Type                     |
| ----------------- | ---------------------------------- | ----------------------- | ------------------------------ |
| Hiragana Dojo     | Neon dojo with floating characters | Hiragana recognition    | Sensei bots, stroke drones     |
| Katakana Tower    | Glitching skyscraper               | Katakana reading        | Glitch mobs, firewall sprites  |
| Kanji Citadel     | Massive fortress                   | Kanji meanings/readings | Samurai programs, gatekeepers  |
| Vocabulary Wastes | Scavenger outskirts                | Word translation        | Scavenger drones, word wraiths |
| Boss Arena        | Core mainframe                     | Mixed review            | Raiden (final boss)            |

### Progression Rules

- Worlds unlock **sequentially**; levels within a world unlock **linearly**
- Each level increases vocabulary complexity (JLPT N5 → N4 → N3 progression)
- **Enemy HP scaling:**
  - Early levels: ~100 HP
  - Mid levels: ~200 HP
  - Late levels: ~350 HP
- **Clearing a level grants:**
  - Gold (in-game currency)
  - XP (experience points)
  - Equipment unlocks (weapons, armor, accessories)
  - Star ratings (1-3 stars based on performance)

### Star Rating System

Players earn 1-3 stars per level based on performance criteria:

- **3 Stars:** No damage taken, fast clear (<30 seconds), 100% correct answers
- **2 Stars:** No damage taken OR fast clear OR ≤1 wrong answer
- **1 Star:** Complete level with any number of mistakes

---

## Gameplay

### Core Loop

```
Username Entry → Mode Selection → Level Selection → Battle → Progression
```

### Mode Selection

- **Learn Mode:** Study vocabulary without penalties; view flashcards, listen to audio, see example sentences (future feature)
- **Practice Mode:** Enter battles with reduced enemy HP; safe environment to test knowledge
- **Normal Mode:** Standard battle with full enemy HP and rewards

### Battle System

**Turn-Based Vocabulary Combat**

#### Player Stats

- **HP:** 150 base (persistent across battles, restored between levels via items or end-of-battle heal)
- **SP (Skill Points):** Starts at 100 per battle, regenerates on correct answers
- **Weapon Damage:** Bonus added to base damage (25 + weapon bonus)

#### Enemy Mechanics

- **HP:** Scales by tier (see Enemy Tier System below)
- **Attack Timer:** Enemy builds attack cooldown over time (ticks every 500ms)
- **Damage:** Fixed per tier (mitigated by player stats and skills)

#### Combat Flow

1. **Question Presentation:**
   - Enemy displays a Japanese word (Hiragana/Katakana/Kanji) or English/Indonesian meaning
   - 4 multiple-choice options appear (1 correct, 3 distractors)
   - Time limit enforced (auto-wrong if unanswered before timer)

2. **Answer Resolution:**
   - **Correct answer:**
     - Deals `25 + weapon damage` to enemy
     - Gains 100 score points
     - Gains 25 SP
     - Enemy attack cooldown reduced
   - **Wrong answer:**
     - Player takes 10 damage
     - Screen shake visual feedback
     - Enemy attack cooldown unaffected

3. **Skills (SP-based abilities):**

| Skill      | Cost  | Effect                                              |
| ---------- | ----- | --------------------------------------------------- |
| Zen Slash  | 30 SP | Deals 50 bonus damage + reveals correct answer hint |
| Neon Guard | 20 SP | Restores 40 HP                                      |
| Data Pulse | 50 SP | Skips current question (no damage to either side)   |

4. **Battle Progression:**
   - After answer, 600ms delay for feedback (damage numbers, animations)
   - Next word automatically loads
   - Enemy defeated? → Spawn next enemy with scaled stats
   - All words answered? → Victory

#### Battle End Conditions

- **Victory:** All level vocabulary words answered correctly (or non-endless mode word pool exhausted)
- **Defeat:** Player HP ≤ 0

---

### Enemy Tier System

Enemies scale based on `enemiesBeaten` counter in endless mode and level difficulty in normal mode.

**Tiers (increasing strength):**

| Tier | Name              | HP Range | Attack Damage | Spawn Condition                  |
| ---- | ----------------- | -------- | ------------- | -------------------------------- |
| 1    | Ashigaru          | 80-120   | 10            | Early game, first 5 enemies      |
| 2    | Samurai           | 150-200  | 15            | enemiesBeaten ≥ 5 or mid-level   |
| 3    | Hatamoto          | 250-300  | 20            | enemiesBeaten ≥ 10 or late-level |
| 4    | Daimyo            | 350-400  | 25            | enemiesBeaten ≥ 15 or high-tier  |
| 5    | Shogun            | 500+     | 30            | enemiesBeaten ≥ 20 or boss waves |
| B    | Boss (Historical) | 800-1200 | 35-50         | Level 10 of each world           |

**Boss Enemies:** Named historical figures (Date Masamune, Sanada Yukimura, Oda Nobunaga, Tokugawa Ieyasu) with unique visuals and higher damage.

---

### Progression & Rewards

#### Experience & Leveling

- **XP Sources:**
  - Correct answer: 10 XP
  - Level clear bonus: 100 XP
- **Power Score:** Cumulative metric based on level progress, equipment, and performance (displayed on level select)

#### Gold Economy

- **Gold Acquisition:** Dropped by defeated enemies (scales with enemy tier)
- **Gold Usage:** Spent in the in-game Shop (not yet implemented) for consumables, equipment, upgrades

#### Equipment System

**Equipment Types:**

- **Weapons:** Increase base damage
  - Uchigatana (starting): +0 ATK
  - Katana: +5 ATK
  - Pulse Blade: +10 ATK
  - Neon Edge: +20 ATK
  - Masamune Katana (LEGENDARY): +35 ATK
- **Armor:** Increases max HP
  - Tedate Kayu (starting): +0 HP
  - Data Vest: +30 HP
  - Cyber Suit: +60 HP
  - O-Yoroi Armor (EPIC): +20 DEF (damage reduction)
- **Accessories:** Special bonuses (SP boost, XP multiplier, gold finder)
- **Consumables:** Single-use items (Ramu Yakuso: heals 50 HP)

**Item Rarity Tiers:**

- COMMON (white)
- UNCOMMON (green)
- RARE (blue)
- EPIC (purple)
- LEGENDARY (orange)

**Reward Conditional Loot (on victory):**

| Condition                     | Reward          | Rarity     |
| ----------------------------- | --------------- | ---------- |
| Always                        | Ramu Yakuso x1  | CONSUMABLE |
| Tier 5 beaten OR Score ≥ 1500 | Masamune Katana | LEGENDARY  |
| Tier 4 beaten OR Score ≥ 800  | O-Yoroi Armor   | EPIC       |
| ≥2 enemies beaten             | Juumonji Yari   | RARE       |

---

### Modes

#### Normal Mode (Level-based)

- Select a level from unlocked levels
- Battle through all vocabulary words in that level (initially 15, +5 per victory)
- Enemy progression scales with level difficulty
- Awards: XP, Gold, equipment drops, star rating

#### Endless Mode

- Combine unlocked words from selected levels
- Infinite enemy spawning with scaling difficulty
- High score tracking (waves survived or total score)
- Compete on leaderboard (future feature)
- HP does not restore between waves

#### Experimental Battle Mode (AI-powered)

- Uses Google Gemini API for dynamic word generation/grading
- Unpredictable questions outside standard vocabulary pool
- Higher risk/reward (more XP, more gold)
- Requires API key configuration

---

## Data Models

### Core Types

```typescript
interface Word {
  id: string;
  japanese: string; // Hiragana/Katakana representation
  kanji?: string; // Optional Kanji character
  indonesian: string; // Meaning in Indonesian (question target)
  romaji: string; // Romanization for reference
  category?: "hiragana" | "katakana" | "kanji" | "mixed";
}

interface Level {
  id: number;
  name: string;
  world: number; // 1-5 (Hiragana → Boss Arena)
  icon: string; // Lucide React icon name
  unlockedWordCount: number; // Starts at 15, +5 per victory
  words: Word[];
}

interface Item {
  id: string;
  name: string;
  type: "WEAPON" | "ARMOR" | "ACCESSORY" | "CONSUMABLE";
  description: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
  bonusAttack?: number;
  bonusDefense?: number;
  bonusHp?: number;
  bonusXpMultiplier?: number;
  bonusGoldFind?: number;
  healAmount?: number;
  isEquipped: boolean;
}

interface GameState {
  currentPage: Page;
  selectedLevel: number | null;
  gameMode: "KANA" | "KANJI" | null;
  levels: Level[];
  inventory: Item[];
  equippedItems: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  username: string;
  powerScore: number;
  endlessRecords: EndlessRecord[];
  highScore: number;
  theme: "dark" | "light";
}
```

---

## Persistence System

### Storage Strategy

**Primary:** IndexedDB (async, larger capacity, better for future expansion)

**Fallback:** LocalStorage (synchronous, limited to ~5MB)

### Stored Data

All data prefixed with `kotoba_`:

- `kotoba_levels` - JSON string of Level[]
- `kotoba_inventory` - JSON string of Item[]
- `kotoba_username` - string
- `kotoba_power_score` - number as string
- `kotoba_endless_records` - JSON string of EndlessRecord[]
- `kotoba_theme` - "dark" or "light"

### Persistence Architecture

- **PersistenceAdapter interface** with two implementations:
  - `IndexedDBAdapter`: Uses `idb` library or native IndexedDB
  - `LocalStorageAdapter`: Uses `window.localStorage`
- **Debounced Writes:** Changes batched to reduce I/O operations
- **Hydration:** Async loading on app startup with fallback to defaults

---

## Vocabulary System

### Categories

1. **Hiragana:** All 46 basic characters + dakuten, combinations
2. **Katakana:** All 46 basic characters + dakuten, combinations
3. **Kanji:** JLPT N5-N3 kanji with meanings and readings
4. **Mixed:** Common vocabulary combining all above

### Question Generation

- **Mode KANA:** Displays `japanese` field (hiragana/katakana script); answer is `indonesian` meaning
- **Mode KANJI:** Displays `kanji` field if available; falls back to `japanese`; answer is `indonesian` meaning
- **Distractors:** 3 random words from level pool (excluding correct answer)

### Word Pool

- **Total Words:** 525+ vocabulary items
- **Distribution:** 20 levels × ~15 base words + unlockable words
- **Fields:** `japanese`, `kanji` (optional), `indonesian`, `romaji`

See `VOCABULARY.md` for complete word list.

---

## Audio & Accessibility (Future)

- **Pronunciation Audio:** Each word optionally includes audio file (requires media assets)
- **Text-to-Speech:** Browser Web Speech API fallback (planned)
- **Accessibility:**
  - Keyboard navigation for battle selections
  - Screen reader support for questions
  - Colorblind-friendly palette (high contrast modes)
  - Reduced motion preference detection

---

## Meta Features

### Admin Panel

- **Location:** Hidden in About page
- **Authentication:** Password protected (`faira`, case-insensitive)
- **Features:** Debug tools, data reset, view statistics (to be implemented)

### Hidden Easter Eggs

- Type "I LOVE YOU" after successful admin login triggers special effect
- Secret developer tools accessible via specific key combinations

---

## Technical Constraints & Non-Functional Requirements

### Performance

- **Target FPS:** 60 FPS for battle animations (Motion-based)
- **Load Time:** <2 seconds on 3G connection
- **Bundle Size:** <500KB gzipped (code splitting per page)

### Browser Support

- Last 2 versions of Chrome, Firefox, Safari, Edge
- No IE11 support
- Service Worker for offline capability (optional)

### Data Safety

- **Autosave:** After every battle completion and inventory change
- **No data loss:** Debounced writes prevent corruption on rapid state changes
- **Reset option:** Clear all saved data from settings

---

## Game Balance Considerations

### Difficulty Curve

- **Early Game (Levels 1-5):** Gentle introduction, simple words, low enemy HP, generous SP regen
- **Mid Game (Levels 6-15):** Increased vocabulary complexity, more Kanji, enemy attacks become dangerous
- **Late Game (Levels 16-20):** Kanji-heavy words, high-tier enemies, time pressure
- **Endless Mode:** Exponential scaling (HP +10% per wave, damage +5% per wave)

### Grind Mitigation

- **No mandatory replay:** All levels can be cleared on first attempt with reasonable skill
- **Progression matters:** Better equipment significantly reduces difficulty
- **Practice mode available:** Reduced HP for learning

---

## Win & Loss Conditions

### Victory

- Defeat final boss (Raiden) in Boss Arena (World 5, Level 10)
- Unlock all 5 worlds
- Achieve 3-star ratings on all levels (optional completion)
- Max power score

### Loss

- Player HP reaches 0 during battle
- Can restart from last saved state or level selection

**There is no permanent death or failure lock.** Players can retry indefinitely.

---

## Future Roadmap (Out of Scope for Initial Release)

- Multiplayer PvP battles (real-time vocab duels)
- Cloud sync across devices
- Audio pronunciation with native speaker recordings
- Spaced repetition algorithm for review mode
- More item types (skills, abilities, mods)
- Story campaigns with NPC dialogue
- Custom word import/export
- Achievement system

---

## Notes for Development

- **State Management:** Centralized in `useGameState.ts` with LocalStorage/IndexedDB persistence
- **Battle Engine:** Reducer-based in `useBattleEngine.ts` for predictable state transitions
- **Styling:** Tailwind CSS v4 + custom CSS components for neon effects; dark theme default
- **Icons:** Lucide React icons for UI elements and level icons
- **Animations:** Motion library for page transitions and combat feedback

**See `CLAUDE.md` for detailed technical architecture and development guidelines.**
