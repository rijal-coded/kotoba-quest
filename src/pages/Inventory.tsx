import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Item, EquippedStats } from '../types';
import { Shield, Sword, Star, Zap, Sparkles, Heart, Shield as ShieldIcon, Swords, Crosshair } from 'lucide-react';
import { MAX_INVENTORY_SLOTS } from '../constants';
import { STRENGTH_REQUIREMENTS, TIER_RARITY_MAP, TIER_LABELS } from '../types';
import { computeEquippedStats } from '../utils/equipmentStats';

const RARITY_ORDER = { COMMON: 0, RARE: 1, EPIC: 2, LEGENDARY: 3 } as const;
const TYPE_ORDER = { WEAPON: 0, SHIELD: 1, ARMOR: 2, HELM: 3, ACCESSORY: 4, CONSUMABLE: 5 } as const;

interface InventoryProps {
  username: string;
  inventory: Item[];
  setInventory: (items: Item[]) => void;
  strength: number;
}

const rarityColor = (rarity: Item['rarity']) => {
  if (rarity === 'LEGENDARY') return 'kawaii-badge--warning';
  if (rarity === 'EPIC') return 'kawaii-badge--danger';
  if (rarity === 'RARE') return 'kawaii-badge--primary';
  return 'kawaii-badge--neutral';
};

const typeIcon = (type: Item['type']) => {
  switch (type) {
    case 'WEAPON': return <Sword className="w-4 h-4" />;
    case 'SHIELD': return <ShieldIcon className="w-4 h-4" />;
    case 'ARMOR': return <Shield className="w-4 h-4" />;
    case 'HELM': return <Zap className="w-4 h-4" />;
    case 'ACCESSORY': return <Star className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getTypeColor = (type: Item['type']) => {
  switch (type) {
    case 'WEAPON': return 'text-danger';
    case 'SHIELD': return 'text-accent';
    case 'ARMOR': return 'text-secondary';
    case 'HELM': return 'text-main';
    case 'ACCESSORY': return 'text-warning';
    default: return 'text-main';
  }
};

const StatsPanel = ({ stats }: { stats: EquippedStats }) => {
  const statItems = [
    { label: 'ATK', value: stats.totalAttack, icon: <Swords className="w-4 h-4" />, color: 'text-danger' },
    { label: 'DEF', value: stats.totalDefense, icon: <ShieldIcon className="w-4 h-4" />, color: 'text-accent' },
    { label: 'HP', value: stats.totalHpBonus, icon: <Heart className="w-4 h-4" />, color: 'text-success' },
    { label: 'CRIT', value: `${stats.totalCritChance}%`, icon: <Crosshair className="w-4 h-4" />, color: 'text-warning' },
    { label: 'BLOCK', value: `${stats.totalBlockChance}%`, icon: <Shield className="w-4 h-4" />, color: 'text-primary' },
  ];

  return (
    <div className="kawaii-card p-4">
      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Player Stats</h4>
      <div className="grid grid-cols-5 gap-2">
        {statItems.map(stat => (
          <div key={stat.label} className="text-center">
            <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-sm font-mono font-bold text-text-primary mt-1">
              {stat.value}
            </div>
            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Inventory = ({ username, inventory, setInventory, strength }: InventoryProps) => {
  const [filter, setFilter] = useState<'SEMUA' | 'SENJATA' | 'PERISAI' | 'ARMOR' | 'HELM' | 'AKSESORI' | 'POTIONS'>('SEMUA');
  const equippedStats = useMemo(() => computeEquippedStats(inventory), [inventory]);
  const equipped = useMemo(() => inventory.filter(item => item.isEquipped), [inventory]);

  const toggleEquip = (targetItem: Item) => {
    if (targetItem.type === 'CONSUMABLE') return;
    setInventory(
      inventory.map(item => {
        if (item.type === targetItem.type && item.isEquipped && item.id !== targetItem.id) {
          return { ...item, isEquipped: false };
        }
        if (item.id === targetItem.id) {
          return { ...item, isEquipped: !item.isEquipped };
        }
        return item;
      })
    );
  };

  const items = useMemo(() => inventory.filter(item => {
    if (filter === 'SEMUA') return true;
    if (filter === 'SENJATA') return item.type === 'WEAPON';
    if (filter === 'PERISAI') return item.type === 'SHIELD';
    if (filter === 'ARMOR') return item.type === 'ARMOR';
    if (filter === 'HELM') return item.type === 'HELM';
    if (filter === 'AKSESORI') return item.type === 'ACCESSORY';
    if (filter === 'POTIONS') return item.type === 'CONSUMABLE';
    return true;
  }), [inventory, filter]);

  const sortedItems = useMemo(() => [...items].sort((a, b) => {
    const ra = RARITY_ORDER[a.rarity] ?? 0;
    const rb = RARITY_ORDER[b.rarity] ?? 0;
    if (ra !== rb) return ra - rb;
    const ta = TYPE_ORDER[a.type] ?? 99;
    const tb = TYPE_ORDER[b.type] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name);
  }), [items]);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-4xl mx-auto">
      {/* User Header */}
      <div className="kawaii-panel flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-text-secondary">Username</span>
          <h3 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            {username || 'UNKNOWN'}
          </h3>
        </div>
        <div className="text-right space-y-0.5">
          <span className="text-xs font-bold text-text-secondary">Strength</span>
          <div className="text-xl font-mono text-main font-bold">{strength.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Stats Panel */}
      <StatsPanel stats={equippedStats} />

      {/* Equipped Section */}
      {equipped.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Equipped</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {equipped.map(item => (
              <div key={item.id} className="kawaii-card p-4 space-y-2 border-main/30">
                <div className="flex items-center gap-2">
                  <span className={getTypeColor(item.type)}>{typeIcon(item.type)}</span>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">{item.type}</span>
                  {item.tier && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-bg-surface-alt text-text-secondary">
                      T{item.tier}
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-bold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.name}
                </h5>
                <div className="space-y-0.5">
                  {item.attackBonus && <p className="text-[10px] text-text-secondary">ATK +{item.attackBonus}</p>}
                  {item.defenseBonus && <p className="text-[10px] text-text-secondary">DEF +{item.defenseBonus}</p>}
                  {item.hpBonus && <p className="text-[10px] text-text-secondary">HP +{item.hpBonus}</p>}
                  {item.critChance && <p className="text-[10px] text-text-secondary">CRIT +{item.critChance}%</p>}
                  {item.blockChance && <p className="text-[10px] text-text-secondary">BLK +{item.blockChance}%</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-main" />
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Inventaris</h4>
          </div>
          <span className={`text-xs font-mono ${inventory.length >= MAX_INVENTORY_SLOTS ? 'text-danger animate-pulse' : 'text-text-secondary'}`}>
            {inventory.length}/{MAX_INVENTORY_SLOTS} slot
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-horizontal-thin">
          {(['SEMUA', 'SENJATA', 'PERISAI', 'ARMOR', 'HELM', 'AKSESORI', 'POTIONS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all ${
                filter === tab
                  ? 'bg-main/10 border-main text-main'
                  : 'border-border text-text-secondary hover:border-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedItems.map((item, index) => {
            const canEquip = item.type === 'CONSUMABLE' || !item.tier || strength >= item.strengthRequired;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`kawaii-card p-4 flex justify-between items-start group ${
                  item.isEquipped ? 'border-main/30 bg-main/5' : ''
                } ${!canEquip && item.type !== 'CONSUMABLE' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-border ${getTypeColor(item.type)}`}>
                    {typeIcon(item.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h6 className="text-sm font-bold text-text-primary truncate">
                        {item.name}
                      </h6>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${rarityColor(item.rarity)}`}>
                        {item.rarity}
                      </span>
                      {item.tier && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-bg-surface-alt text-text-secondary uppercase">
                          {TIER_LABELS[item.tier]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-tight">{item.description}</p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-text-secondary">
                      {item.attackBonus && <span>ATK +{item.attackBonus}</span>}
                      {item.defenseBonus && <span>DEF +{item.defenseBonus}</span>}
                      {item.hpBonus && <span>HP +{item.hpBonus}</span>}
                      {item.critChance && <span>CRIT {item.critChance}%</span>}
                      {item.blockChance && <span>BLK {item.blockChance}%</span>}
                    </div>
                    {!canEquip && item.type !== 'CONSUMABLE' && (
                      <p className="text-[10px] text-danger font-bold">
                        Requires {item.strengthRequired} Strength
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-2">
                  {item.count !== undefined && (
                    <span className="text-sm font-mono font-bold text-main">x{item.count}</span>
                  )}
                  {item.type !== 'CONSUMABLE' && canEquip && (
                    <button
                      onClick={() => toggleEquip(item)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${
                        item.isEquipped
                          ? 'border-danger text-danger bg-danger/5 hover:bg-danger/10'
                          : 'border-main text-main bg-main/5 hover:bg-main/10'
                      }`}
                    >
                      {item.isEquipped ? 'Unequip' : 'Equip'}
                    </button>
                  )}
                  {item.type !== 'CONSUMABLE' && !canEquip && (
                    <span className="px-3 py-1 text-[10px] font-bold rounded-full border border-danger/30 text-danger/60 bg-danger/5">
                      Locked
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
