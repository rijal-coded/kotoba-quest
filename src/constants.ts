import { Level, Item } from './types';

export const INITIAL_LEVELS: Level[] = [
  {
    id: 'keluarga',
    name: 'KELUARGA',
    icon: 'Users',
    isCompleted: false,
    bestTime: 0,
    words: [
      { japanese: 'かぞく', kanji: '家族', indonesian: 'KELUARGA', romaji: 'kazoku' },
      { japanese: 'ちち', kanji: '父', indonesian: 'AYAH', romaji: 'chichi' },
      { japanese: 'はは', kanji: '母', indonesian: 'IBU', romaji: 'haha' },
      { japanese: 'あに', kanji: '兄', indonesian: 'KAKAK LAKI-LAKI', romaji: 'ani' },
      { japanese: 'あね', kanji: '姉', indonesian: 'KAKAK PEREMPUAN', romaji: 'ane' },
    ]
  },
  {
    id: 'kelas',
    name: 'KELAS',
    icon: 'GraduationCap',
    isCompleted: false,
    bestTime: 0,
    words: [
      { japanese: 'きょうしつ', kanji: '教室', indonesian: 'RUANG KELAS', romaji: 'kyoushitsu' },
      { japanese: 'つくえ', kanji: '机', indonesian: 'MEJA', romaji: 'tsukue' },
      { japanese: 'いす', kanji: '椅子', indonesian: 'KURSI', romaji: 'isu' },
      { japanese: 'こくばん', kanji: '黒板', indonesian: 'PAPAN TULIS', romaji: 'kokuban' },
      { japanese: 'えんぴつ', kanji: '鉛筆', indonesian: 'PENSIL', romaji: 'enpitsu' },
    ]
  },
  {
    id: 'dapur',
    name: 'DAPUR',
    icon: 'Utensils',
    isCompleted: false,
    bestTime: 0,
    words: [
      { japanese: 'だいどころ', kanji: '台所', indonesian: 'DAPUR', romaji: 'daidokoro' },
      { japanese: 'れいぞうこ', kanji: '冷蔵庫', indonesian: 'KULKAS', romaji: 'reizouko' },
      { japanese: 'さら', kanji: '皿', indonesian: 'PIRING', romaji: 'sara' },
      { japanese: 'はし', kanji: '箸', indonesian: 'SUMPIT', romaji: 'hashi' },
      { japanese: 'ほうちょう', kanji: '包丁', indonesian: 'PISAU DAPUR', romaji: 'houchou' },
    ]
  },
  {
    id: 'kamar-tidur',
    name: 'KAMAR TIDUR',
    icon: 'Bed',
    isCompleted: false,
    bestTime: 0,
    words: [
      { japanese: 'しんしつ', kanji: '寝室', indonesian: 'KAMAR TIDUR', romaji: 'shinshitsu' },
      { japanese: 'まくら', kanji: '枕', indonesian: 'BANTAL', romaji: 'makura' },
      { japanese: 'ふとん', kanji: '布団', indonesian: 'FUTON', romaji: 'futon' },
      { japanese: 'かがみ', kanji: '鏡', indonesian: 'CERMIN', romaji: 'kagami' },
      { japanese: 'まど', kanji: '窓', indonesian: 'JENDELA', romaji: 'mado' },
    ]
  }
];

export const INITIAL_INVENTORY: Item[] = [
  {
    id: 'w1',
    name: 'KATANA RUSAK DAN HANCUR',
    type: 'WEAPON',
    description: 'Pedang tua yang sudah berkarat.',
    rarity: 'COMMON',
  },
  {
    id: 's1',
    name: 'PERISAI KAYU TIDAK BERDURI',
    type: 'SHIELD',
    description: 'Perisai kayu sederhana.',
    rarity: 'COMMON',
  },
  {
    id: 'a1',
    name: 'GELANG TEMBAGA BATU BIASA',
    type: 'ACCESSORY',
    description: 'Gelang tembaga kusam.',
    rarity: 'COMMON',
  },
  {
    id: 'c1',
    name: 'KAPSUL PENINGKAT ADRENALIN',
    type: 'CONSUMABLE',
    description: 'Memulihkan 50 HP',
    rarity: 'COMMON',
    count: 3
  }
];
