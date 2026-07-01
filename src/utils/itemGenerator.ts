import { Item, ItemType, ItemTier, TIER_RARITY_MAP } from '../types';
import {
  BaseItemDef,
  ConsumableDef,
  CONSUMABLE_DEFS,
  PREFIXES,
  SUFFIXES,
  HISTORICAL_ITEMS,
  applyTier,
  getBaseItems,
} from './equipmentData';

let idCounter = Date.now();
function nextId(): string {
  return `item_${(idCounter++).toString(36)}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomAffixCount(tier: ItemTier, forceAffixCount?: number): number {
  if (tier <= 2) return 0;
  if (forceAffixCount !== undefined) return Math.min(forceAffixCount, 2);
  if (tier === 3) return Math.random() < 0.4 ? 1 : 0;
  if (tier === 4) return Math.random() < 0.6 ? 1 : (Math.random() < 0.3 ? 2 : 0);
  return Math.random() < 0.5 ? 2 : 1;
}

export function generateEquipment(type: ItemType, tier: ItemTier, forceAffixCount?: number): Item {
  const historical = HISTORICAL_ITEMS[tier]?.filter(h => h.type === type);
  const historicalChance = forceAffixCount !== undefined ? 0.05 : (tier >= 4 ? 0.7 : tier >= 3 ? 0.3 : 0);
  const useHistorical = historical && historical.length > 0 && Math.random() < historicalChance;

  let base: BaseItemDef;
  if (useHistorical && historical!.length > 0) {
    base = pickRandom(historical!);
  } else {
    const bases = getBaseItems(type);
    base = pickRandom(bases.length > 0 ? bases : [{ name: 'Unknown', type }]);
  }

  const prefix = pickRandom(PREFIXES[tier]);
  const affixCount = pickRandomAffixCount(tier, forceAffixCount);
  const chosenSuffixes: typeof SUFFIXES = [];
  const usedSuffixLabels = new Set<string>();
  for (let i = 0; i < affixCount; i++) {
    let candidate = pickRandom(SUFFIXES);
    let tries = 0;
    while (usedSuffixLabels.has(candidate.label) && tries < 10) {
      candidate = pickRandom(SUFFIXES);
      tries++;
    }
    if (!usedSuffixLabels.has(candidate.label)) {
      chosenSuffixes.push(candidate);
      usedSuffixLabels.add(candidate.label);
    }
  }

  const affixLabels = chosenSuffixes.map(s => s.label);

  const sumAffix = (field: 'attackMod' | 'defenseMod' | 'hpMod' | 'critMod' | 'blockMod') =>
    (prefix[field] ?? 0) + chosenSuffixes.reduce((sum, s) => sum + (s[field] ?? 0), 0);

  const sumBase = (field: 'baseAttack' | 'baseDefense' | 'baseHp' | 'baseCrit' | 'baseBlock') =>
    base[field] ?? 0;

  const computeStat = (baseField: 'baseAttack' | 'baseDefense' | 'baseHp' | 'baseCrit' | 'baseBlock', affixField: 'attackMod' | 'defenseMod' | 'hpMod' | 'critMod' | 'blockMod', isPercent = false): number | undefined => {
    const baseVal = sumBase(baseField);
    const affixVal = sumAffix(affixField);
    const total = applyTier(baseVal, tier) + affixVal;
    if (total <= 0) return undefined;
    return isPercent ? Math.min(total, 100) : total;
  };

  const isHistoricalItem = useHistorical && !!base.description;
 const displayName = isHistoricalItem
 ? base.name
 : `${base.name} ${prefix.label}`.trim();

  const description = isHistoricalItem
    ? base.description!
    : buildDescription(type, tier, prefix.label, affixLabels);

  const item: Item = {
    id: nextId(),
    name: displayName,
    type,
    tier,
    description,
  rarity: TIER_RARITY_MAP[tier],
  affixes: affixLabels.length > 0 ? affixLabels : undefined,
    isEquipped: false,
  };

  const atk = computeStat('baseAttack', 'attackMod');
  const def = computeStat('baseDefense', 'defenseMod');
  const hp = computeStat('baseHp', 'hpMod');
  const crit = computeStat('baseCrit', 'critMod', true);
  const block = computeStat('baseBlock', 'blockMod', true);

  if (atk !== undefined) item.attackBonus = atk;
  if (def !== undefined) item.defenseBonus = def;
  if (hp !== undefined) item.hpBonus = hp;
  if (crit !== undefined) item.critChance = crit;
  if (block !== undefined) item.blockChance = block;

  return item;
}

export function generateConsumable(tier: ItemTier): Item {
  const eligible = CONSUMABLE_DEFS.filter(c => c.minTier <= tier);
  const def: ConsumableDef = pickRandom(eligible.length > 0 ? eligible : CONSUMABLE_DEFS.slice(0, 1));

  const item: Item = {
    id: nextId(),
    name: def.name,
    type: 'CONSUMABLE',
    tier,
    description: def.description,
  rarity: TIER_RARITY_MAP[tier],
  count: 1,
    effectType: def.effectType,
    effectValue: def.effectValue,
    effectDuration: def.effectDuration,
  };

  if (def.effectType === 'HEAL') {
    item.hpBonus = def.effectValue;
  }

  return item;
}

export function generateRandomItem(tier: ItemTier, forceAffixCount?: number): Item {
  const equipTypes: ItemType[] = ['WEAPON', 'SHIELD', 'ARMOR', 'HELM', 'ACCESSORY'];
  const isConsumable = Math.random() < 0.35;

  if (isConsumable) {
    return generateConsumable(tier);
  }

  const type = pickRandom(equipTypes);
  return generateEquipment(type, tier, forceAffixCount);
}

function buildDescription(type: ItemType, tier: ItemTier, prefix: string, affixes: string[]): string {
  const tierNames: Record<ItemTier, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Platinum',
    5: 'Legendary',
  };

  const typeNames: Record<ItemType, string> = {
    WEAPON: 'senjata',
    SHIELD: 'perisai',
    ARMOR: 'zirah',
    HELM: 'pelindung kepala',
    ACCESSORY: 'aksesori',
    CONSUMABLE: 'konsumable',
  };

  let desc = `${tierNames[tier]}-grade ${typeNames[type]}.`;
  if (prefix && prefix !== 'Standar') {
    desc += ` Bermodifikasi "${prefix}".`;
  }
  if (affixes.length > 0) {
    desc += ` Mengandung affix: ${affixes.join(', ')}.`;
  }
  return desc;
}
