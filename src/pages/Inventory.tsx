import { useState } from 'react';
import { motion } from 'motion/react';
import { Item } from '../types';

interface InventoryProps {
  username: string;
  inventory: Item[];
  powerScore: number;
}

export const Inventory = ({ username, inventory, powerScore }: InventoryProps) => {
  const [filter, setFilter] = useState<'SEMUA' | 'SENJATA' | 'PERISAI' | 'AKSESORI' | 'POTIONS'>('SEMUA');

  const equipped = inventory.filter(item => item.type !== 'CONSUMABLE').slice(0, 3);
  
  const items = inventory.filter(item => {
    if (filter === 'SEMUA') return true;
    if (filter === 'SENJATA') return item.type === 'WEAPON';
    if (filter === 'PERISAI') return item.type === 'SHIELD';
    if (filter === 'AKSESORI') return item.type === 'ACCESSORY';
    if (filter === 'POTIONS') return item.type === 'CONSUMABLE';
    return true;
  });

  return (
    <div className="p-6 pb-24 space-y-8 max-w-md mx-auto">
      {/* User Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">Username</span>
          <h3 className="text-2xl font-black uppercase tracking-tighter">{username || 'UNKNOWN PLAYER'}</h3>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Strength</span>
          <div className="text-xl font-mono text-neon-cyan">{powerScore.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Equipped Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Equipped</h4>
        <div className="space-y-3">
          {equipped.map((item) => (
            <div key={item.id} className="bg-dark-surface border border-white/5 p-4 space-y-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.type}</span>
              <h5 className={`font-bold uppercase tracking-tight ${
                item.type === 'WEAPON' ? 'text-neon-blue' : 
                item.type === 'SHIELD' ? 'text-neon-green' : 'text-neon-pink'
              }`}>
                {item.name}
              </h5>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Inventaris</h4>
          <span className="text-[10px] font-mono text-white/20">{inventory.length}/99 SLOT</span>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-5 gap-1">
          {['SEMUA', 'SENJATA', 'PERISAI', 'AKSESORI', 'POTIONS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`py-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter border-b-2 transition-all ${
                filter === tab ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-transparent bg-white/5 text-white/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-surface/50 border border-white/5 p-4 flex justify-between items-center group hover:border-white/20 transition-all"
            >
              <div className="space-y-1">
                <h6 className="text-xs font-bold uppercase tracking-tight group-hover:text-white transition-colors">
                  {item.name}
                </h6>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  {item.description}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-neon-cyan">
                  {item.count ? `x${item.count}` : ''}
                </span>
                <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                  {item.type === 'CONSUMABLE' ? 'OBAT' : 'PERALATAN'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
