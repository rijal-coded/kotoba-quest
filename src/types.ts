export type Page = 'HOME' | 'MODE_SELECT' | 'BATTLE' | 'INVENTORY' | 'LEVEL_SELECT' | 'ABOUT' | 'WORDS';

export type GameMode = 'BELAJAR' | 'LATIHAN' | 'TANTANGAN';

export type QuestionType = 'kana' | 'kanji' | 'romaji' | 'indonesian';
export type AnswerType = 'kana' | 'kanji' | 'romaji' | 'indonesian';

export interface Word {
  japanese: string;
  kanji?: string;
  indonesian: string;
  romaji: string;
}

export interface QuestionItem {
  wordIndex: number;
  questionType: QuestionType;
  answerType: AnswerType;
}

export interface WordCoverage {
  wordIndex: number;
  coveredQuestions: QuestionType[];
  correct: boolean;
}

export interface LevelSession {
  queue: QuestionItem[];
  currentIndex: number;
  wordCoverage: WordCoverage[];
  bossDefeated: boolean;
  totalCorrect: number;
  totalWrong: number;
  enemiesBeaten: number;
  playerHP: number;
  maxPlayerHP: number;
  score: number;
  startTime: number;
}

export interface Level {
  id: string;
  name: string;
  icon: string;
  words: Word[];
  isCompleted: boolean;
  bestTime: number;
  unlockedWordCount: number;
  seenWordIndices: number[];
  wordCoverage?: WordCoverage[];
}

export type ItemType = 'WEAPON' | 'SHIELD' | 'ARMOR' | 'HELM' | 'ACCESSORY' | 'CONSUMABLE';
export type ItemTier = 1 | 2 | 3 | 4 | 5;
export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type ConsumableEffectType = 'HEAL' | 'SP_RESTORE' | 'BUFF_ATTACK' | 'BUFF_DEFENSE';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  tier: ItemTier;
  description: string;
  rarity: ItemRarity;
  strengthRequired: number;
  attackBonus?: number;
  defenseBonus?: number;
  hpBonus?: number;
  critChance?: number;
  blockChance?: number;
  count?: number;
  effectType?: ConsumableEffectType;
  effectValue?: number;
  effectDuration?: number;
  affixes?: string[];
  isEquipped?: boolean;
}

export interface EquippedStats {
  totalAttack: number;
  totalDefense: number;
  totalHpBonus: number;
  totalCritChance: number;
  totalBlockChance: number;
}

export const EQUIP_SLOTS: ItemType[] = ['WEAPON', 'SHIELD', 'ARMOR', 'HELM', 'ACCESSORY'];

export const TIER_LABELS: Record<ItemTier, string> = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold',
  4: 'Platinum',
  5: 'Legendary',
};

export const TIER_RARITY_MAP: Record<ItemTier, ItemRarity> = {
  1: 'COMMON',
  2: 'COMMON',
  3: 'RARE',
  4: 'EPIC',
  5: 'LEGENDARY',
};

export const STRENGTH_REQUIREMENTS: Record<ItemTier, number> = {
  1: 0,
  2: 200,
  3: 1000,
  4: 3000,
  5: 8000,
};

export interface EndlessRecord {
  date: number;
  enemiesBeaten: number;
  wordsBeaten: number;
}
