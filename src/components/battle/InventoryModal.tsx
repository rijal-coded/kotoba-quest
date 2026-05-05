import { motion, AnimatePresence } from 'motion/react';
import { Item } from '../../types';
import { X } from 'lucide-react';
import { memo } from 'react';

interface InventoryModalProps {
  isOpen: boolean;
  inventory: Item[];
  onClose: () => void;
  onUseItem: (item: Item) => void;
}

export const InventoryModal = memo(({ isOpen, inventory, onClose, onUseItem }: InventoryModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full md:max-w-sm bg-bg-surface border border-main/10 md:rounded-2xl rounded-t-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-main/10 pb-4">
              <h3 className="text-lg font-black uppercase tracking-tighter text-text-primary">Item Bag</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-text-primary/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-text-primary/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {inventory.filter(i => i.type === 'CONSUMABLE').length === 0 ? (
                <p className="text-center text-text-secondary py-8 uppercase text-xs font-bold tracking-widest">No usable items</p>
              ) : (
                inventory.filter(i => i.type === 'CONSUMABLE')
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onUseItem(item); onClose(); }}
                    disabled={!item.count || item.count <= 0}
                    className="w-full bg-bg-primary border border-main/10 rounded-xl p-3 flex justify-between items-center hover:border-main/40 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase text-text-primary group-hover:text-main transition-colors">{item.name}</h4>
                      <p className="text-[10px] text-text-secondary uppercase mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-main">{item.count ? `x${item.count}` : ''}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
