# Kotoba Quest - Game Design Document (GDD)

## 1. Game Overview
**Title:** Kotoba Quest
**Genre:** Educational RPG / Gamified Language Learning
**Platform:** Web Browser (Mobile & Desktop Responsive)
**Core Concept:** A cyberpunk-themed educational game that uses spaced repetition and RPG battle mechanics to help users memorize Japanese vocabulary (Hiragana, Katakana, and Kanji).

## 2. Visual & Aesthetic Design
**Theme:** Neon Dark Mode / Cyberpunk
**Color Palette:**
- **Background:** Dark/Near-Black (`#0A0A0A`, `#1A1A1A`)
- **Accents:** 
  - Neon Cyan (`#00FFFF`)
  - Neon Blue (`#3B82F6`)
  - Neon Green (`#10B981`)
  - Neon Fuchsia/Pink (`#D946EF`) - *Adjusted for better readability on dark backgrounds.*
**UI Style:**
- Flat design with no gradients or 3D textures.
- Geometric, blocky layouts with crisp, thin borders (wireframe-like).
- Minimalist iconography using Lucide React.
**Typography:**
- **Primary/Headings:** Space Grotesk (Bold, utilitarian, digital dashboard feel)
- **Data/Code/Numbers:** JetBrains Mono

## 3. Gameplay Mechanics
**Core Loop:**
1. Select Difficulty Mode (Kana or Kanji).
2. Select a Level from the Level List.
3. Enter Battle phase.
4. Answer vocabulary questions correctly to attack the enemy; wrong answers result in taking damage.
5. Win to earn rewards and Power Score, or lose and try again.

**Combat System:**
- **Player HP:** 100 (Max 100). Takes 20 damage on a wrong answer.
- **Enemy HP:** 100 (Max 100). Takes 25 damage on a correct answer.
- **Questions:** Multiple choice (1 correct answer, 3 randomized incorrect answers from the same level).
- **Feedback:** 
  - *Correct:* Flashes "CRITICAL!" in green.
  - *Wrong:* Flashes "MISS!" in red, screen shakes.

## 4. Game Modes
**1. Normal Mode (Level-based):**
- Players choose predefined vocabulary levels.
- **Vocabulary Theme**: Setiap level didasarkan pada chapter dari buku "はじめての日本語能力試験N5単語1000" (contoh: Chapter 1: Self Intro, Chapter 2: Belajar, dll).
- **Progressive Vocabulary Unlock**: Setiap level memiliki total *pool* kata (misal 15 kata). Saat pertama kali dimainkan, hanya 10 kata yang tersedia untuk dimainkan. Jika pemain berhasil menyelesaikan level tersebut, 5 kata baru akan ditambahkan ke dalam *pool* level tersebut untuk permainan berikutnya. Layar *reward* akan memberikan notifikasi bahwa kosakata baru telah ditambahkan, sehingga meningkatkan *replayability* dan variasi kata.
- Completing a level records the "Best Time" and marks it as "SELESAI" (Completed).
- Grants Power Score (+100) and item rewards (e.g., Health Potion) upon victory.

**2. Endless Mode (Tanpa Batas):**
- **Unlock Condition:** Must complete at least one normal level.
- **Setup:** Player selects from their completed levels to pool the vocabulary words together.
- **Mechanic:** Fight an endless stream of enemies. Enemy HP resets to 100 after each defeat.
- **Rewards:** Player receives 1x "Kapsul Peningkat Adrenalin" (Health Potion) automatically for every 2 enemies defeated.
- **End Condition:** Player HP reaches 0, or player voluntarily navigates away (triggers a warning prompt to prevent accidental data loss).
- **Records:** Tracks Highest Record (Enemies defeated & words answered) and a history of the last 5 attempts.

## 5. Progression & Items
**Power Score:** 
- Accumulated by winning battles (+100 per win). Acts as a high score/experience metric.

**Inventory System:**
- Players can access a "Tas Item" (Inventory) during battle (overlay) or via the Profile page.
- **Consumables:**
  - *Kapsul Peningkat Adrenalin*: Heals 50 HP. Cannot be used if HP is already full (100).

## 6. User Interface & Navigation
**Navigation:**
- **Desktop:** Side navigation bar (below header, right side).
- **Mobile:** Bottom navigation bar.
- **Tabs:** 
  - *Main*: Level Select / Battle
  - *Tanpa Batas*: Endless Mode
  - *Mode*: Mode Select (Kana/Kanji)
  - *Profil*: Inventory & Stats

**Key Screens:**
- **Home:** "New Game" (prompts for username, resets data) or "Lanjutkan" (Continue if save data exists).
- **Mode Select:** Choose between KANA (Easy) and KANJI (Hard).
- **Level Select:** Grid of levels showing completion status and best times. Title adapts to selected mode (e.g., "KANA MODE").
- **Battle:** Shows Enemy HP, Player HP, current word, 4 answer choices, and an inventory overlay.
- **Profile/Inventory:** Displays Username, Power Score, and collected items.
- **About:** Brief description of the game, mechanics, and credits.

## 7. Data Management (Save System)
Data is persisted locally in the browser using `localStorage`, allowing players to return to their progress:
- `kotoba_username`: Player's chosen name.
- `kotoba_levels`: Progress, completion status, and best times for all levels.
- `kotoba_inventory`: Items collected and their quantities.
- `kotoba_power_score`: Total accumulated score.
- `kotoba_endless_records`: History of endless mode runs (date, enemies beaten, words beaten).
