import { motion, AnimatePresence } from 'motion/react';
import { Item } from '../../types';
import { X, Sparkles } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  inventory: Item[];
  onClose: () => void;
  onUseItem: (item: Item) => void;
}

export const InventoryModal = ({ isOpen, inventory, onClose, onUseItem }: InventoryModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-bg-primary/60"
          />
          <div key="modal-wrapper" className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="kawaii-modal relative w-full md:max-w-sm rounded-2xl pointer-events-auto"
            >
              <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-main" />
                  <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    Item Bag
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-bg-surface-alt flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {inventory.filter(i => i.type === 'CONSUMABLE').length === 0 ? (
                  <p className="text-center text-text-secondary py-8 text-sm">Tidak ada item yang bisa digunakan</p>
                ) : (
                  inventory.filter(i => i.type === 'CONSUMABLE')
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(item => (
                    <button
                      key={item.id}
                      onClick={() => { onUseItem(item); onClose(); }}
                      disabled={!item.count || item.count <= 0}
                      className="w-full bg-bg-surface-alt border border-border rounded-xl p-3 flex justify-between items-center hover:border-main/30 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-text-primary group-hover:text-main transition-colors">{item.name}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-sm font-mono font-bold text-main">x{item.count || 0}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
