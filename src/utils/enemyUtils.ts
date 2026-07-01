export interface EnemyTemplate {
  name: string;
  rank: string;
  tier: number;
  hp: number;
  maxHp: number;
  damage: number;
  icon: string;
}

export interface ProgressContext {
  equippedAttack: number;
  equippedDefense: number;
  equippedMaxHp: number;
}

const JAPANESE_NAMES = ['Taro', 'Kenji', 'Hiroshi', 'Takashi', 'Jiro', 'Saburo', 'Yoshio', 'Akio', 'Kazuya', 'Haru'];

const TIER_CONFIG = [
  { rank: 'Ashigaru', hp: [50, 80], damage: [15, 22], icon: 'Sword' },
  { rank: 'Samurai', hp: [90, 130], damage: [24, 32], icon: 'Shield' },
  { rank: 'Hatamoto', hp: [150, 220], damage: [34, 44], icon: 'Target' },
  { rank: 'Daimyo', hp: [260, 380], damage: [48, 62], icon: 'Crown' },
  { rank: 'Shogun', hp: [450, 600], damage: [65, 85], icon: 'Zap' },
];

function calculateScaling(context: ProgressContext): { hpMult: number; damageMult: number } {
  const equipPower = (context.equippedAttack || 0) + (context.equippedDefense || 0) + (context.equippedMaxHp || 0);
  const hpMult = 1 + (equipPower * 0.008);
  const damageMult = 1 + (equipPower * 0.004);
  return { hpMult, damageMult };
}

export function generateEnemy(
  enemiesBeaten: number,
  isBoss: boolean = false,
  progress: ProgressContext = { equippedAttack: 0, equippedDefense: 0, equippedMaxHp: 0 }
): EnemyTemplate {
  let tier = Math.min(5, Math.floor(enemiesBeaten / 5) + 1);
  if (isBoss) tier = Math.min(5, tier + 1);

  const config = TIER_CONFIG[tier - 1];

  const getRandom = (range: number[]) => Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

  const name = isBoss
    ? ['Date Masamune', 'Sanada Yukimura', 'Oda Nobunaga', 'Tokugawa Ieyasu'][tier - 2] || 'Kusanagi'
    : JAPANESE_NAMES[Math.floor(Math.random() * JAPANESE_NAMES.length)];

  const { hpMult, damageMult } = calculateScaling(progress);

  let hp = Math.round(getRandom(config.hp) * hpMult);
  let damage = Math.round(getRandom(config.damage) * damageMult);

  return {
    name,
    rank: config.rank,
    tier,
    hp,
    maxHp: hp,
    damage,
    icon: config.icon
  };
}
