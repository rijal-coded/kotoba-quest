# Enemy Design Document

## 1. Hierarki Jabatan (Enemy Tiers)
Musuh dibagi ke dalam 5 tingkatan berdasarkan struktur militer dan pemerintahan di era Edo Jepang:

| Tier | Jabatan (Rank) | Peran dalam Game | Deskripsi Visual |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Ashigaru** (足軽) | Grunt / Kroco | Prajurit infanteri dasar. Muncul di level awal. |
| **Tier 2** | **Samurai** (侍) | Elite | Ksatria terlatih. Muncul di pertengahan level. |
| **Tier 3** | **Hatamoto** (旗本) | Veteran | Pengawal langsung Shogun. Muncul di level tinggi. |
| **Tier 4** | **Daimyo** (大名) | Sub-Boss | Penguasa wilayah. Muncul di akhir setiap mode atau level boss. |
| **Tier 5** | **Shogun** (将軍) | Final Boss | Panglima tertinggi. Muncul sebagai tantangan terakhir. |

## 2. Katalog Musuh (Contoh)

### A. Normal Enemies (Ashigaru & Samurai)
*   **Nama**: Taro, Kenji, Hiroshi, Takashi, Jiro.
*   **Statistik**:
    *   **HP**: 50 - 90
    *   **Damage**: 10 - 15
    *   **Power Score**: 100.000 - 900.000

### B. Elite & Sub-Boss (Hatamoto & Daimyo)
*   **Nama Tokoh**: 
    *   *Date Masamune* (Si Naga Mata Satu)
    *   *Sanada Yukimura* (Pahlawan Terakhir)
    *   *Oda Nobunaga* (Sang Pemersatu)
*   **Statistik**:
    *   **HP**: 120 - 200
    *   **Damage**: 20 - 25
    *   **Power Score**: 1.500.000 - 8.000.000

### C. The Ultimate Boss (Shogun)
*   **Nama Tokoh**: **Tokugawa Ieyasu**
*   **Statistik**:
    *   **HP**: 350+
    *   **Damage**: 35+
    *   **Power Score**: 25.000.000+

## 3. Struktur Data (Technical Design)
```typescript
interface Enemy {
  name: string;      // Nama Jepang (misal: "Tokugawa Ieyasu")
  rank: string;      // Jabatan Edo (misal: "Shogun")
  tier: number;      // 1 sampai 5
  hp: number;        // Darah musuh saat ini
  maxHp: number;     // Darah maksimal
  damage: number;    // Kerusakan yang diberikan ke pemain jika salah jawab
  powerScore: number;// Angka tampilan untuk intimidasi
  icon: string;      // Ikon Lucide (misal: "Sword", "Shield", "Crown")
}
```

## 4. Dinamika Visual & Mode Endless
- **Warna Nama**: Nama musuh akan berubah warna berdasarkan Tier (Tier 1: Putih, Tier 4: Cyan, Tier 5: Gold/Neon-Pink).
- **Scaling (Endless Mode)**: Setiap kali musuh mati, musuh berikutnya akan memiliki nama acak dari *pool* nama Jepang. Pangkatnya (Rank) akan naik setiap beberapa musuh yang dikalahkan, disertai peningkatan HP dan Damage.
