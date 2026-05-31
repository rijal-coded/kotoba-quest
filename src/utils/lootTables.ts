import { Item, ItemTier, TIER_RARITY_MAP } from '../types';
import { HISTORICAL_ITEMS, TIER_MULTIPLIER } from './equipmentData';
import { generateRandomItem } from './itemGenerator';

export interface LootContext {
  enemiesBeaten: number;
  accuracy: number;
  isBossKill: boolean;
  battleStreak: number;
  completedLevels: number;
}

const BASE_DROP_CHANCES: Record<ItemTier, number> = {
  1: 0.70,
  2: 0.45,
  3: 0.25,
  4: 0.10,
  5: 0.01,
};

interface TierReq {
  minEnemiesBeaten: number;
  requiresBoss?: boolean;
  requiresPerfect?: boolean;
}

const ELIGIBLE_TIERS: Record<ItemTier, TierReq> = {
  1: { minEnemiesBeaten: 0 },
  2: { minEnemiesBeaten: 5 },
  3: { minEnemiesBeaten: 15 },
  4: { minEnemiesBeaten: 30, requiresBoss: true },
  5: { minEnemiesBeaten: 50, requiresBoss: true, requiresPerfect: true },
};

export function getEligibleTiers(ctx: LootContext): ItemTier[] {
  const tiers: ItemTier[] = [];
  for (let t = 1; t <= 5; t++) {
    const tier = t as ItemTier;
    const req = ELIGIBLE_TIERS[tier];
    if (ctx.enemiesBeaten < req.minEnemiesBeaten) continue;
    if (req.requiresBoss && !ctx.isBossKill) continue;
    if (req.requiresPerfect && ctx.accuracy < 100) continue;
    tiers.push(tier);
  }
  if (tiers.length === 0) tiers.push(1);
  return tiers;
}

export function calculateDropChance(tier: ItemTier, ctx: LootContext): number {
  let chance = BASE_DROP_CHANCES[tier];
  if (ctx.accuracy === 100) chance *= 1.6;
  else if (ctx.accuracy >= 80) chance *= 1.3;
  else if (ctx.accuracy < 50) chance *= 0.7;

  if (ctx.isBossKill) chance = Math.min(1, chance * (tier === 5 ? 20 : tier === 4 ? 3.5 : 2.0));
  const streakBonus = 1 + Math.min(ctx.battleStreak * 0.05, 0.5);
  chance *= streakBonus;
  const modeBonus = 1.3;
  chance *= modeBonus;
  return Math.min(1, Math.max(0, chance));
}

export function rollDrop(tier: ItemTier, ctx: LootContext): boolean {
  const chance = calculateDropChance(tier, ctx);
  return Math.random() < chance;
}

export function getLootDrop(ctx: LootContext, maxItems = 3): Item[] {
  const eligibleTiers = getEligibleTiers(ctx);
  const rewards: Item[] = [];
  const guaranteedTier = calculateGuaranteedTier(ctx);
  if (guaranteedTier !== null && eligibleTiers.includes(guaranteedTier)) {
    rewards.push(pickItemForTier(guaranteedTier, ctx));
  }
  let attempts = 0;
  const maxAttempts = maxItems * 3;
  while (rewards.length < maxItems && attempts < maxAttempts) {
    attempts++;
    const tier = eligibleTiers[Math.floor(Math.random() * eligibleTiers.length)];
    if (rollDrop(tier, ctx)) {
      rewards.push(pickItemForTier(tier, ctx));
    }
  }
  return rewards;
}

function calculateGuaranteedTier(ctx: LootContext): ItemTier | null {
  if (!ctx.isBossKill) return 1;
  if (ctx.accuracy === 100) {
    const eligible = getEligibleTiers(ctx);
    if (eligible.length > 1) return eligible[Math.min(3, eligible.length - 2)];
    return eligible[eligible.length - 1];
  }
  return 1;
}

function pickItemForTier(tier: ItemTier, ctx: LootContext): Item {
  const baseQuality = Math.min(1, (ctx.enemiesBeaten + ctx.accuracy / 100) / 50);
  if (tier === 1 || baseQuality < 0.5) return generateRandomItem(tier);
  const useHistorical = Math.random() < Math.min(0.8, baseQuality * 0.4);
  if (useHistorical && tier >= 3) return generateHistoricalItem(tier);
  return generateRandomItem(tier);
}

function generateHistoricalItem(tier: ItemTier): Item {
  const historical = HISTORICAL_ITEMS[tier];
  const base = historical[Math.floor(Math.random() * historical.length)];

  const item: Item = {
    id: `hist_${tier}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: base.name,
    type: base.type,
    tier,
    description: base.description || '',
    rarity: TIER_RARITY_MAP[tier],
    isEquipped: false,
  };

  if (base.baseAttack !== undefined) item.attackBonus = applyEquipmentTier(base.baseAttack, tier);
  if (base.baseDefense !== undefined) item.defenseBonus = applyEquipmentTier(base.baseDefense, tier);
  if (base.baseHp !== undefined) item.hpBonus = applyEquipmentTier(base.baseHp, tier);
  if (base.baseCrit !== undefined) item.critChance = Math.min(100, applyEquipmentTier(base.baseCrit, tier));
  if (base.baseBlock !== undefined) item.blockChance = Math.min(100, applyEquipmentTier(base.baseBlock, tier));

  return item;
}
function applyEquipmentTier(base: number, tier: ItemTier): number {
  const multiplier = (tier === 4) ? 1.3 : tier === 5 ? 1.5 : 1;
  return Math.round(base * multiplier);
}
