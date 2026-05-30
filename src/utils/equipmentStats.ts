import { Item, EquippedStats, ItemType, ItemTier, EQUIP_SLOTS } from '../types';

export function computeEquippedStats(items: Item[]): EquippedStats {
  const equipped = items.filter(i => i.isEquipped && i.type !== 'CONSUMABLE');
  let totalAttack = 0;
  let totalDefense = 0;
  let totalHpBonus = 0;
  let totalCritChance = 0;
  let totalBlockChance = 0;

  for (const item of equipped) {
    if (item.type === 'WEAPON' || item.type === 'ACCESSORY') {
      totalAttack += item.attackBonus ?? 0;
      totalCritChance += item.critChance ?? 0;
    }
    if (item.type === 'SHIELD' || item.type === 'ARMOR' || item.type === 'HELM' || item.type === 'ACCESSORY') {
      totalDefense += item.defenseBonus ?? 0;
      totalBlockChance += item.blockChance ?? 0;
    }
    if (item.type === 'ARMOR' || item.type === 'HELM' || item.type === 'ACCESSORY') {
      totalHpBonus += item.hpBonus ?? 0;
    }
    if (item.type === 'ACCESSORY') {
      totalAttack += item.attackBonus ?? 0;
      totalCritChance += item.critChance ?? 0;
      totalBlockChance += item.blockChance ?? 0;
      totalHpBonus += item.hpBonus ?? 0;
    }
  }

  return {
    totalAttack,
    totalDefense,
    totalHpBonus,
    totalCritChance: Math.min(100, totalCritChance),
    totalBlockChance: Math.min(100, totalBlockChance),
  };
}

export function getEquippedHighTier(inventory: Item[]): ItemTier | null {
  const equipped = inventory.filter(i => i.isEquipped && i.tier);
  if (equipped.length === 0) return null;
  return Math.max(...equipped.map(i => i.tier)) as ItemTier;
}

export function getAverageEquippedTier(inventory: Item[]): number {
  const equipped = inventory.filter(i => i.isEquipped && i.tier);
  if (equipped.length === 0) return 0;
  const sum = equipped.reduce((acc, i) => acc + i.tier, 0);
  return sum / Math.max(1, equipped.length);
}

export function hasItemEquippedOfType(inventory: Item[], type: ItemType): boolean {
  return inventory.some(i => i.type === type && i.isEquipped);
}

export function getFirstEmptySlot(inventory: Item[]): ItemType | null {
  for (const slot of EQUIP_SLOTS) {
    if (!hasItemEquippedOfType(inventory, slot)) return slot;
  }
  return null;
}
