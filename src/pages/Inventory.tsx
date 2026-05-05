import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Item } from '../types';
import { Shield, Sword, Star, Zap } from 'lucide-react';
import { MAX_INVENTORY_SLOTS } from '../constants';

// Sort orders (outside component to avoid recreation)
const RARITY_ORDER = { COMMON: 0, RARE: 1, EPIC: 2, LEGENDARY: 3 } as const;
const TYPE_ORDER = { WEAPON: 0, SHIELD: 1, ACCESSORY: 2, CONSUMABLE: 3 } as const;

interface InventoryProps {
  username: string;
  inventory: Item[];
  setInventory: (items: Item[]) => void;
  powerScore: number;
}

const rarityColor = (rarity: Item['rarity']) => {
  if (rarity === 'LEGENDARY') return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
  if (rarity === 'EPIC') return 'text-neon-pink border-neon-pink/30 bg-neon-pink/10';
  if (rarity === 'RARE') return 'text-main border-main/30 bg-main/10';
  return 'text-text-secondary border-main/10 bg-text-primary/5';
};

const typeIcon = (type: Item['type']) => {
  if (type === 'WEAPON') return <Sword className="w-4 h-4" />;
  if (type === 'SHIELD') return <Shield className="w-4 h-4" />;
  if (type === 'ACCESSORY') return <Star className="w-4 h-4" />;
  return <Zap className="w-4 h-4" />;
};

const getTypeStyle = (type: Item['type']) => {
  if (type === 'WEAPON') return { text: 'text-red-400', border: 'border-red-500/30' };
  if (type === 'SHIELD') return { text: 'text-accent', border: 'border-accent/30' };
  if (type === 'ACCESSORY') return { text: 'text-neon-pink', border: 'border-neon-pink/30' };
  return { text: 'text-main', border: 'border-main/30' };
};

const EquippedItemCard = ({ item }: { item: Item }) => {
  const style = getTypeStyle(item.type);
  
  return (
    <div className={`bg-bg-surface border rounded-2xl p-4 space-y-2 ${style.border}`}>
      <div className="flex items-center gap-2">
        <span className={style.text}>{typeIcon(item.type)}</span>
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{item.type}</span>
      </div>
      <h5 className={`text-sm font-black uppercase tracking-tight ${style.text}`}>
        {item.name}
      </h5>
      {item.attackBonus && <p className="text-[10px] text-text-secondary">ATK +{item.attackBonus}</p>}
      {item.defenseBonus && <p className="text-[10px] text-text-secondary">DEF +{item.defenseBonus}</p>}
    </div>
  );
};

export const Inventory = ({ username, inventory, setInventory, powerScore }: InventoryProps) => {
  const [filter, setFilter] = useState<'SEMUA' | 'SENJATA' | 'PERISAI' | 'AKSESORI' | 'POTIONS'>('SEMUA');

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
    if (filter === 'AKSESORI') return item.type === 'ACCESSORY';
    if (filter === 'POTIONS') return item.type === 'CONSUMABLE';
    return true;
  }), [inventory, filter]);

  // Sort by rarity (COMMON→RARE→EPIC→LEGENDARY), then type (WEAPON→SHIELD→ACCESSORY→CONSUMABLE), then name
  const sortedItems = useMemo(() =>
    [...items].sort((a, b) => {
      const ra = RARITY_ORDER[a.rarity] ?? 0;
      const rb = RARITY_ORDER[b.rarity] ?? 0;
      if (ra !== rb) return ra - rb;
      const ta = TYPE_ORDER[a.type] ?? 99;
      const tb = TYPE_ORDER[b.type] ?? 99;
      if (ta !== tb) return ta - tb;
      return a.name.localeCompare(b.name);
    }),
    [items]
  );

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-4xl mx-auto">
      {/* User Header */}
      <div className="bg-bg-surface border border-main/10 rounded-2xl p-5 flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-main uppercase tracking-widest">Username</span>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary">{username || 'UNKNOWN'}</h3>
        </div>
        <div className="text-right space-y-0.5">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Power Score</span>
          <div className="text-xl font-mono text-main font-bold">{powerScore.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Equipped Section */}
      {equipped.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-[0.3em]">Equipped</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {equipped.map(item => (
              <EquippedItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-[0.3em]">Inventaris</h4>
          <span className={`text-[10px] font-mono ${inventory.length >= MAX_INVENTORY_SLOTS ? 'text-red-500 animate-pulse' : 'text-text-secondary'}`}>
            {inventory.length}/{MAX_INVENTORY_SLOTS} SLOT
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['SEMUA', 'SENJATA', 'PERISAI', 'AKSESORI', 'POTIONS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                filter === tab
                  ? 'bg-main/10 border-main text-main'
                  : 'border-main/10 text-text-secondary hover:border-main/25 hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedItems.map((item, index) => {
            let borderClasses = item.isEquipped ? 'border-main/40 bg-main/5' : 'border-main/10 hover:border-main/25';
            
            // Dynamic Rarity Effects
            if (item.rarity === 'LEGENDARY') {
              borderClasses = 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-pulse hover:animate-none hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]';
            } else if (item.rarity === 'EPIC') {
              borderClasses = 'border-neon-pink shadow-[0_0_10px_rgba(217,70,239,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.5)]';
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`bg-bg-surface border rounded-2xl p-4 flex justify-between items-start group transition-all ${borderClasses}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${rarityColor(item.rarity)}`}>
                    {typeIcon(item.type)}
                  </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h6 className="text-xs font-black uppercase tracking-tight text-text-primary truncate">
                      {item.name}
                    </h6>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest ${rarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-tight">{item.description}</p>
                  <div className="flex gap-2 text-[9px] font-mono text-text-secondary">
                    {item.attackBonus && <span>ATK +{item.attackBonus}</span>}
                    {item.defenseBonus && <span>DEF +{item.defenseBonus}</span>}
                    {item.hpBonus && <span>HP +{item.hpBonus}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-2">
                {item.count !== undefined && (
                  <span className="text-sm font-mono font-bold text-main">x{item.count}</span>
                )}
                {item.type !== 'CONSUMABLE' && (
                  <button
                    onClick={() => toggleEquip(item)}
                    className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border rounded-full transition-all ${
                      item.isEquipped
                        ? 'border-neon-pink text-neon-pink bg-neon-pink/10 hover:bg-neon-pink/20'
                        : 'border-main text-main bg-main/10 hover:bg-main/20'
                    }`}
                  >
                    {item.isEquipped ? 'UNEQUIP' : 'EQUIP'}
                  </button>
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
