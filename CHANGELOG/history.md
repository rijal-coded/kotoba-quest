# Project History - Kotoba Quest

Semua perubahan, peningkatan, penambahan, dan perbaikan yang dilakukan pada Kotoba Quest sejak awal pengembangan.

## [2026-05-05 06:33]
### Improved
- **Border Color System**: Replaced all white-tinted borders (`border-text-primary/10`, `border-text-primary/20`, `rgba(255,255,255,0.08)`) with cyan-tinted (`border-main/10`, `border-main/15`, `rgba(0,156,255,0.08)`) across 12+ files for consistent dark-mode theming.
- **Sidebar Navigation**: Fixed glow overflow on active nav buttons — replaced `glow-cyan` class with a contained `shadow-[0_0_8px...]` on the icon container; enlarged icon area to `w-10 h-10`/`w-11 h-11`; reduced label font size.
- **Enemy Panel Glow**: Reduced `enemy-idle-glow` animation intensity by ~50% (from 0.15/0.35 to 0.08/0.18 opacity) to be less distracting during gameplay.

### Fixed
- **"MAIN" → "HOME" Button**: Changed sidebar nav label from "Main" to "Home" and replaced the Lucide `Play` icon with a Google Material Symbols `home` icon loaded via font link.
- **CSS Glass Borders**: Changed `--glass-border` from white (`rgba(255,255,255,0.08)`) to cyan (`rgba(0,156,255,0.08)`), fixing glass-morphism panels to use themed borders.
- **Battle Panel Borders**: Changed `.battle-panel` border from gray (`rgba(156,163,175,0.1)`) to cyan (`rgba(0,156,255,0.1)`).

## [2026-04-29 16:24]
### Improved
- **App.tsx Refactor**: Extracted state, persistence, and routing logic into `src/hooks/useGameState.ts`, reducing file size from 255 to ~100 lines.
- **Battle Engine Refactor**: Replaced 6 separate `useState` hooks with a unified, atomic `useReducer` in `src/hooks/useBattleEngine.ts`.
- **Component Modularization**: Split the massive 438-line `Battle.tsx` into small, focused components (`EnemyPanel`, `PlayerPanel`, `QuestionCard`, `InventoryModal`, etc.) in `src/components/battle/`.

## [2026-04-29 15:58]
### Added
- **Ultimate Reviewer Protocol**: Explicitly established the USER as the final authority for all code changes.
- **Conditional Audit Log**: Refined the changelog rule to only record changes after USER verification.

### Improved
- **AIP Refinement**: Clarified technical terminology (memoization) and interaction protocols to ensure maximum architectural clarity.


## [2026-04-23]
### Added
- Menambahkan 20 level bertema baru dengan kategori kosakata yang spesifik.
- Menambahkan sistem RPG Battle penuh:
    - Skill Points (SP) system.
    - Skill: "Zen Slash" (Damage besar) dan "Neon Guard" (Pertahanan).
    - Battle Item: Penggunaan consumable dari Inventory.
- Menambahkan aset musuh baru dengan sistem Rank (Ashigaru, Samurai, Hatamoto, Daimyo, Shogun).
- Menambahkan Boss encounter dengan nama-nama tokoh sejarah Jepang (Oda Nobunaga, Tokugawa Ieyasu, dll).
- Menambahkan fitur Password pada halaman About ("faira") yang menampilkan pesan "I LOVE YOU".

### Improvements
- Meningkatkan UI Battle untuk Desktop dan Tablet dengan layout sidebar yang sejajar.
- Memperbaiki responsivitas Mobile dengan statistik tetap (fixed) di bagian bawah.
- Menghapus prefix "Chapter *" pada nama level untuk estetika yang lebih bersih.
- Memperbaiki penulisan okurigana pada mode Kanji (contoh: 行く alih-alih 行).

### Fixes
- Memperbaiki bug di mana pemain dipaksa menjawab setelah mengalahkan musuh menggunakan skill. Sekarang musuh berikutnya langsung muncul.
- Memperbaiki kesalahan orientasi HP bar musuh yang tidak floating dengan benar pada saat scroll.
- Menghapus akses langsung ke mode eksperimental untuk menjaga integritas alur permainan utama.

## [Awal Pengembangan]
### Added
- Struktur dasar aplikasi menggunakan React + Vite + Tailwind CSS.
- Sistem navigasi halaman (Home, Level Select, Battle, About, Inventory).
- Logika dasar pertanyaan pilihan ganda (Multiple Choice).
- Sistem penyimpanan progress lokal (LocalStorage).
- Mode permainan: KANA (Hiragana/Katakana) dan KANJI.
- Implementasi tema visual Cyberpunk/Neon.
