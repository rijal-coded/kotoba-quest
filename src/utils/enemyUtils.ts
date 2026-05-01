import { Sword, Shield, Crown, Target, Zap, Waves } from 'lucide-react';

export interface EnemyTemplate {
  name: string;
  rank: string;
  tier: number;
  hp: number;
  maxHp: number;
  damage: number;
  strength: number;
  icon: string;
}

const JAPANESE_NAMES = ['Taro', 'Kenji', 'Hiroshi', 'Takashi', 'Jiro', 'Saburo', 'Yoshio', 'Akio', 'Kazuya', 'Haru'];

const TIER_CONFIG = [
  { rank: 'Ashigaru', hp: [40, 70], damage: [10, 15], strength: [100000, 900000], icon: 'Sword' },      // Reduced HP by ~20%
  { rank: 'Samurai', hp: [80, 120], damage: [15, 20], strength: [1000000, 5000000], icon: 'Shield' },  // Reduced HP by ~20%
  { rank: 'Hatamoto', hp: [160, 250], damage: [20, 30], strength: [6000000, 15000000], icon: 'Target' },
  { rank: 'Daimyo', hp: [300, 500], damage: [35, 45], strength: [20000000, 50000000], icon: 'Crown' },
  { rank: 'Shogun', hp: [1000, 2000], damage: [50, 80], strength: [100000000, 999999999], icon: 'Zap' },
];

export function generateEnemy(enemiesBeaten: number, isBoss: boolean = false): EnemyTemplate {
  // Determine tier based on enemies beaten or boss status
  let tier = Math.min(5, Math.floor(enemiesBeaten / 5) + 1);
  if (isBoss) tier = Math.min(5, tier + 1);

  const config = TIER_CONFIG[tier - 1];

  const getRandom = (range: number[]) => Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

  const name = isBoss ?
    ['Date Masamune', 'Sanada Yukimura', 'Oda Nobunaga', 'Tokugawa Ieyasu'][tier - 2] || 'Kusanagi' :
    JAPANESE_NAMES[Math.floor(Math.random() * JAPANESE_NAMES.length)];

  let hp = getRandom(config.hp);
  let damage = getRandom(config.damage);

  // Apply caps for high tiers to keep game manageable
  if (tier === 5) {
    hp = Math.min(1500, hp);
    damage = Math.min(60, damage);
  }

  return {
    name: name,
    rank: config.rank,
    tier: tier,
    hp: hp,
    maxHp: hp,
    damage: damage,
    strength: getRandom(config.strength),
    icon: config.icon
  };
}
