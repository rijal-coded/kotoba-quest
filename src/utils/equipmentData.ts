import { ItemType, ItemTier } from '../types';

export interface BaseItemDef {
  name: string;
  type: ItemType;
  baseAttack?: number;
  baseDefense?: number;
  baseHp?: number;
  baseCrit?: number;
  baseBlock?: number;
  description?: string;
}

export interface ConsumableDef {
  name: string;
  effectType: 'HEAL' | 'SP_RESTORE' | 'BUFF_ATTACK' | 'BUFF_DEFENSE';
  effectValue: number;
  effectDuration?: number;
  minTier: ItemTier;
  description: string;
}

export interface PrefixDef {
  label: string;
  attackMod?: number;
  defenseMod?: number;
  hpMod?: number;
  critMod?: number;
  blockMod?: number;
}

export interface SuffixDef {
  label: string;
  attackMod?: number;
  defenseMod?: number;
  hpMod?: number;
  critMod?: number;
  blockMod?: number;
}

export const TIER_MULTIPLIER: Record<ItemTier, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.2,
  4: 3.2,
  5: 4.5,
};

const TIER_VARIANCE = 0.1;

export function applyTier(base: number, tier: ItemTier): number {
  const mult = TIER_MULTIPLIER[tier];
  const variance = 1 + (Math.random() * TIER_VARIANCE * 2 - TIER_VARIANCE);
  return Math.round(base * mult * variance);
}

export const PREFIXES: Record<ItemTier, PrefixDef[]> = {
  1: [
    { label: 'Rusak', attackMod: -2 },
    { label: 'Pudar', defenseMod: -1 },
    { label: 'Gores', hpMod: -5 },
  ],
  2: [
    { label: 'Standar' },
    { label: 'Tajam', attackMod: 2 },
    { label: 'Kokoh', defenseMod: 2 },
  ],
  3: [
    { label: 'Berkilau', attackMod: 4, defenseMod: 2 },
    { label: 'Tepat', critMod: 3 },
    { label: 'Ringan', blockMod: 3 },
  ],
  4: [
    { label: 'Bercahaya', attackMod: 8, defenseMod: 4, hpMod: 15 },
    { label: 'Ganas', attackMod: 10, critMod: 5 },
    { label: 'Kuningan', defenseMod: 8, blockMod: 5 },
  ],
  5: [
    { label: 'Legenda', attackMod: 15, defenseMod: 10, hpMod: 30 },
    { label: 'Ilahi', critMod: 10, blockMod: 10 },
    { label: 'Abadi', attackMod: 12, defenseMod: 8, hpMod: 50 },
  ],
};

export const SUFFIXES: SuffixDef[] = [
  { label: 'Ketahanan', defenseMod: 3, hpMod: 10 },
  { label: 'Vitalitas', hpMod: 20 },
  { label: 'Ketajaman', attackMod: 3 },
  { label: 'Kecepatan', critMod: 2 },
  { label: 'Keberuntungan', critMod: 1, blockMod: 1 },
  { label: 'Penyerapan', attackMod: 2, hpMod: 5 },
  { label: 'Penetrasi', attackMod: 4, critMod: 2 },
  { label: 'Perlindungan', defenseMod: 5, blockMod: 3 },
];

export const WEAPON_BASES: BaseItemDef[] = [
  { name: 'Uchigatana', type: 'WEAPON', baseAttack: 8, baseCrit: 2 },
  { name: 'Tanto', type: 'WEAPON', baseAttack: 5, baseCrit: 5 },
  { name: 'Naginata', type: 'WEAPON', baseAttack: 12 },
  { name: 'Yari', type: 'WEAPON', baseAttack: 10 },
  { name: 'Bo', type: 'WEAPON', baseAttack: 6, baseDefense: 2 },
  { name: 'Kunai', type: 'WEAPON', baseAttack: 4, baseCrit: 8 },
  { name: 'Tetsubo', type: 'WEAPON', baseAttack: 15 },
  { name: 'Bokuto', type: 'WEAPON', baseAttack: 3 },
  { name: 'Wakizashi', type: 'WEAPON', baseAttack: 7, baseCrit: 4 },
  { name: 'Kanabou', type: 'WEAPON', baseAttack: 18 },
];

export const SHIELD_BASES: BaseItemDef[] = [
  { name: 'Tedate', type: 'SHIELD', baseDefense: 5, baseBlock: 3 },
  { name: 'Dobu', type: 'SHIELD', baseDefense: 8, baseBlock: 2 },
  { name: 'Happuri', type: 'SHIELD', baseDefense: 4, baseBlock: 5 },
  { name: 'Sode', type: 'SHIELD', baseDefense: 6, baseBlock: 4 },
  { name: 'O-yoroi Shield', type: 'SHIELD', baseDefense: 10, baseBlock: 6 },
];

export const ARMOR_BASES: BaseItemDef[] = [
  { name: 'Do-maru', type: 'ARMOR', baseDefense: 4, baseHp: 20 },
  { name: 'Haramaki', type: 'ARMOR', baseDefense: 3, baseHp: 25 },
  { name: 'Gusoku', type: 'ARMOR', baseDefense: 7, baseHp: 30 },
  { name: 'Kikko', type: 'ARMOR', baseDefense: 2, baseHp: 15, baseBlock: 2 },
  { name: 'Tatami-do', type: 'ARMOR', baseDefense: 5, baseHp: 20 },
  { name: 'O-yoroi', type: 'ARMOR', baseDefense: 10, baseHp: 40 },
];

export const HELM_BASES: BaseItemDef[] = [
  { name: 'Hachi', type: 'HELM', baseHp: 15 },
  { name: 'Kabuto', type: 'HELM', baseDefense: 2, baseHp: 20 },
  { name: 'Jingasa', type: 'HELM', baseDefense: 1, baseHp: 10, baseBlock: 2 },
  { name: 'Mempo', type: 'HELM', baseDefense: 3, baseHp: 25 },
  { name: 'Zunari-kabuto', type: 'HELM', baseDefense: 4, baseHp: 30, baseBlock: 3 },
];

export const ACCESSORY_BASES: BaseItemDef[] = [
  { name: 'Omamori', type: 'ACCESSORY', baseCrit: 3, baseBlock: 2 },
  { name: 'Juzu', type: 'ACCESSORY', baseHp: 15, baseDefense: 1 },
  { name: 'Sageo', type: 'ACCESSORY', baseAttack: 2, baseCrit: 2 },
  { name: 'Kazaridashi', type: 'ACCESSORY', baseDefense: 3, baseBlock: 3 },
  { name: 'Inro', type: 'ACCESSORY', baseHp: 10, baseCrit: 1, baseBlock: 1 },
];

export const CONSUMABLE_DEFS: ConsumableDef[] = [
  { name: 'Yakuso Kecil', effectType: 'HEAL', effectValue: 30, minTier: 1, description: 'Racikan tanaman obat sederhana. Memulihkan 30 HP.' },
  { name: 'Yakuso Sedang', effectType: 'HEAL', effectValue: 60, minTier: 2, description: 'Racikan herbal yang lebih kuat. Memulihkan 60 HP.' },
  { name: 'Yakuso Besar', effectType: 'HEAL', effectValue: 100, minTier: 3, description: 'Racikan langka dari tanaman pegunungan. Memulihkan 100 HP.' },
  { name: 'Amrita', effectType: 'SP_RESTORE', effectValue: 3, minTier: 3, description: 'Elixir kebijaksanaan kuno. Memulihkan 3 AP.' },
  { name: 'Obat Kekuatan', effectType: 'BUFF_ATTACK', effectValue: 10, effectDuration: 3, minTier: 4, description: 'Ramuan tempur yang meningkatkan serangan +10 selama 3 giliran.' },
  { name: 'Ramuan Pelindung', effectType: 'BUFF_DEFENSE', effectValue: 10, effectDuration: 3, minTier: 4, description: 'Ramuan pertahanan yang meningkatkan pertahanan +10 selama 3 giliran.' },
  { name: 'Elixir Kehidupan', effectType: 'HEAL', effectValue: 150, minTier: 5, description: 'Elixir legendaris yang memulihkan 150 HP.' },
];

export const HISTORICAL_ITEMS: Record<ItemTier, BaseItemDef[]> = {
  1: [],
  2: [],
  3: [
    { name: 'Bizen Katana', type: 'WEAPON', baseAttack: 11, baseCrit: 3, description: 'Ditempa oleh aliran Osafune di Provinsi Bizen, sekolah pembuatan pedang tertua dan terkemuka di Jepang (abad 12-16).' },
    { name: 'Mino Tachi', type: 'WEAPON', baseAttack: 9, baseCrit: 4, description: 'Pedang dari Provinsi Mino, dikenal akan keseimbangan sempurna antara ketajaman dan kekuatan.' },
    { name: 'Mori Do-maru', type: 'ARMOR', baseDefense: 5, baseHp: 25, description: 'Perlengkapan perang klan Mori yang menguasai wilayah Chugoku. Warna biru lautnya melambangkan supremasi angkutan laut mereka.' },
    { name: 'Takeda Gusoku', type: 'ARMOR', baseDefense: 6, baseHp: 35, description: 'Armor merah khas pasukan Takeda yang ditakuti di seluruh Jepang. Simbol keberanian tanpa batas.' },
    { name: 'Kabuto Maedate', type: 'HELM', baseDefense: 3, baseHp: 25, baseBlock: 3, description: 'Kabuto dengan hiasan depan (maedate) berbentuk tanduk. Menandakan status prajurit veteran.' },
  ],
  4: [
    { name: "Date Masamune's Crescent Helm", type: 'HELM', baseDefense: 5, baseHp: 40, baseCrit: 3, description: "Kabuto dengan maedate bulan sabit emas khas Date Masamune — 'Naga Mata Satu' dari Tohoku. Simbol ambisi seorang daimyo yang nyaris menguasai seluruh Jepang." },
    { name: "Yukimura's Cross Spear", type: 'WEAPON', baseAttack: 13, baseCrit: 4, description: "Yari bersilang merah darah milik Sanada Yukimura, 'Pahlawan Terakhir Era Sengoku'. Dalam Pengepungan Osaka, tombak ini membuat pasukan Tokugawa gemetar ketakutan." },
    { name: "Nobunaga's Tanegashima", type: 'WEAPON', baseAttack: 14, baseCrit: 2, description: "Senapan kancing api (matchlock) yang merevolusi perang Jepang. Oda Nobunaga menggunakan 3.000 senapan ini untuk menghancurkan kavaleri Takeda di Pertempuran Nagashino, 1575." },
    { name: "Kenshin's Bishamonten Armor", type: 'ARMOR', baseDefense: 9, baseHp: 45, baseBlock: 4, description: "Armor Uesugi Kenshin, 'Naga Echigo', yang memuja Bishamonten — dewa perang. Ia memasuki medan perang dengan keyakinan bahwa dirinya adalah inkarnasi dewa." },
    { name: "Hattori Hanzo's Ninjato", type: 'WEAPON', baseAttack: 10, baseCrit: 8, description: "Pedang lurus hitam milik Hattori Hanzo, pemimpin Iga ninja yang menyelamatkan Tokugawa Ieyasu dari jebakan di Iga. Melambangkan kesetiaan dan kelicikan." },
    { name: "Shingen's Gunbai", type: 'ACCESSORY', baseDefense: 5, baseBlock: 5, baseCrit: 2, description: "Kipas perang (gunbai) milik Takeda Shingen yang digunakan untuk memimpin pasukan dalam Pertempuran Kawanakajima. Simbol komando dan strategi." },
    { name: "Honda Tadakatsu's Sode", type: 'SHIELD', baseDefense: 10, baseBlock: 7, description: "Perisai bahu milik Honda Tadakatsu, jenderal terkuat Tokugawa yang tidak pernah terluka dalam 100 pertempuran. Konon pelindung ini menangkis segala musuh." },
  ],
  5: [
    { name: 'Kusanagi-no-Tsurugi', type: 'WEAPON', baseAttack: 16, baseCrit: 6, description: "Salah satu dari Tiga Harta Pusaka Kekaisaran Jepang. Konon ditemukan oleh dewa Susanoo di dalam ekor naga Yamata-no-Orochi. Melambangkan kebajikan dan keberanian." },
    { name: 'Tonbogiri', type: 'WEAPON', baseAttack: 18, baseCrit: 3, description: "Tombak legendaris milik Honda Tadakatsu, jenderal terkuat Tokugawa Ieyasu yang tidak pernah terluka dalam 100 pertempuran. Dinamai 'Pemotong Capung' karena ujungnya konon begitu tajam hingga capung yang hinggap terbelah." },
    { name: 'Dojigiri Yasutsuna', type: 'WEAPON', baseAttack: 20, baseCrit: 5, description: "Salah satu Tenka-Goken (Lima Pedang Terhebat Jepang). Ditempa oleh Hoki-no-Kuni Yasutsuna. Konon membelah raksasa peminum Shuten-doji hingga dua." },
    { name: 'Onimaru Kunitsuna', type: 'WEAPON', baseAttack: 17, baseCrit: 8, description: "Pedang yang konon bergerak sendiri di malam hari untuk memenggal roh iblis yang mengganggu Kaisar. Ditempa oleh Kunitsuna, pandai besi legendaris dari aliran Awataguchi." },
    { name: "Ieyasu's O-yoroi", type: 'ARMOR', baseDefense: 12, baseHp: 60, baseBlock: 6, description: "Zirah lengkap milik Tokugawa Ieyasu, sang pemersatu Jepang. Dikenakan saat Pertempuran Sekigahara yang menentukan masa depan Jepang selama 250 tahun ke depan." },
    { name: 'Muramasa Katana', type: 'WEAPON', baseAttack: 19, baseCrit: 10, description: "Ditempa oleh Muramasa Sengo, pandai besi dari Provinsi Iga yang pedangnya konon haus darah. Dikatakan tidak bisa disarungkan tanpa menumpahkan darah — kutukan sekaligus kekuatan." },
    { name: 'Shogun Kabuto', type: 'HELM', baseDefense: 6, baseHp: 50, baseCrit: 4, baseBlock: 4, description: "Kabuto kebesaran Shogun, dimahkotai hiasan emas naga. Hanya yang menguasai seluruh Jepang yang layak memakainya." },
    { name: 'Susanoo Omamori', type: 'ACCESSORY', baseCrit: 8, baseBlock: 8, baseHp: 30, description: "Jimat kebesaran dewa Susanoo, penguasa badai dan lautan. Memberikan perlindungan absolut serta keberuntungan di medan perang." },
  ],
};

export function getBaseItems(type: ItemType): BaseItemDef[] {
  switch (type) {
    case 'WEAPON': return WEAPON_BASES;
    case 'SHIELD': return SHIELD_BASES;
    case 'ARMOR': return ARMOR_BASES;
    case 'HELM': return HELM_BASES;
    case 'ACCESSORY': return ACCESSORY_BASES;
    default: return [];
  }
}
