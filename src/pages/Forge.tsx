import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Item, ItemTier, ItemType, Page, TIER_LABELS, EQUIP_SLOTS } from '../types';
import { generateEquipment } from '../utils/itemGenerator';
import { MAX_INVENTORY_SLOTS, TIER_COLORS } from '../constants';
import { Hammer, Sword, Shield, ShieldIcon, Zap, Star, Sparkles, X } from 'lucide-react';

interface ForgeProps {
  sakuraPetals: number;
  setSakuraPetals: React.Dispatch<React.SetStateAction<number>>;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  onNavigate: (page: Page) => void;
}

const FORGE_COSTS_RANDOM: Record<ItemTier, number> = { 1: 3, 2: 10, 3: 25, 4: 60, 5: 150 };
const FORGE_COSTS_SPECIFIC: Record<ItemTier, number> = { 1: 5, 2: 15, 3: 38, 4: 90, 5: 225 };

const SLOT_ICONS: Record<ItemType, React.ReactNode> = {
  WEAPON: <Sword className="w-5 h-5" />,
  SHIELD: <ShieldIcon className="w-5 h-5" />,
  ARMOR: <Shield className="w-5 h-5" />,
  HELM: <Zap className="w-5 h-5" />,
  ACCESSORY: <Star className="w-5 h-5" />,
  CONSUMABLE: <Sparkles className="w-5 h-5" />,
};

const SLOT_LABELS: Record<ItemType, string> = {
  WEAPON: 'Senjata',
  SHIELD: 'Perisai',
  ARMOR: 'Zirah',
  HELM: 'Helm',
  ACCESSORY: 'Aksesori',
  CONSUMABLE: 'Konsumsi',
};

export const Forge = ({ sakuraPetals, setSakuraPetals, inventory, setInventory, onNavigate }: ForgeProps) => {
  const [selectedTier, setSelectedTier] = useState<ItemTier | null>(null);
  const [slotMode, setSlotMode] = useState<'random' | 'specific'>('random');
  const [selectedSlot, setSelectedSlot] = useState<ItemType | null>(null);
  const [forgedItem, setForgedItem] = useState<Item | null>(null);
  const [isForging, setIsForging] = useState(false);

  const cost = useMemo(() => {
    if (!selectedTier) return 0;
    return slotMode === 'specific' ? FORGE_COSTS_SPECIFIC[selectedTier] : FORGE_COSTS_RANDOM[selectedTier];
  }, [selectedTier, slotMode]);

  const canAfford = sakuraPetals >= cost;
  const inventoryFull = inventory.length >= MAX_INVENTORY_SLOTS;
  const canForge = selectedTier && canAfford && !inventoryFull;

  const handleForge = () => {
    if (!canForge || !selectedTier || isForging) return;
    setIsForging(true);

    setTimeout(() => {
      const type = slotMode === 'specific' && selectedSlot ? selectedSlot : (['WEAPON', 'SHIELD', 'ARMOR', 'HELM', 'ACCESSORY'] as ItemType[])[Math.floor(Math.random() * 5)];
      const newItem = generateEquipment(type, selectedTier, 2);
      setForgedItem(newItem);
      setSakuraPetals(prev => prev - cost);
      setIsForging(false);
    }, 800);
  };

  const handleEquipForged = () => {
    if (!forgedItem) return;
    const updated = inventory.map(item => {
      if (item.type === forgedItem.type && item.isEquipped && item.id !== forgedItem.id) {
        return { ...item, isEquipped: false };
      }
      return item;
    });
    setInventory([...updated, { ...forgedItem, isEquipped: true }]);
    setForgedItem(null);
    setSelectedTier(null);
    setSelectedSlot(null);
  };

  const handleKeepForged = () => {
    if (!forgedItem) return;
    setInventory([...inventory, forgedItem]);
    setForgedItem(null);
    setSelectedTier(null);
    setSelectedSlot(null);
  };

  const resetSelection = () => {
    setForgedItem(null);
    setSelectedTier(null);
    setSelectedSlot(null);
    setIsForging(false);
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="kawaii-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hammer className="w-6 h-6 text-main" />
          <div>
            <h2 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Tempa Senjata</h2>
            <p className="text-[10px] text-text-secondary">Forge equipment using Sakura Petals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold text-accent">🌸 {sakuraPetals}</span>
          <button
            onClick={() => onNavigate('INVENTORY')}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {forgedItem ? (
          /* Result View */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="kawaii-card p-6 space-y-4 text-center"
          >
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Item Ditempa!</h3>
            <div className={`kawaii-card p-4 border-2 ${TIER_COLORS[forgedItem.tier].border} ${TIER_COLORS[forgedItem.tier].text}`}>
              <h4 className="text-base font-bold text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {forgedItem.name}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[forgedItem.tier].bg} ${TIER_COLORS[forgedItem.tier].text} uppercase`}>
                {TIER_LABELS[forgedItem.tier]}
              </span>
              <p className="text-[10px] text-text-secondary mt-2 leading-relaxed">{forgedItem.description}</p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-text-secondary mt-2 justify-center">
                {forgedItem.attackBonus !== undefined && <span>ATK +{forgedItem.attackBonus}</span>}
                {forgedItem.defenseBonus !== undefined && <span>DEF +{forgedItem.defenseBonus}</span>}
                {forgedItem.hpBonus !== undefined && <span>HP +{forgedItem.hpBonus}</span>}
                {forgedItem.critChance !== undefined && <span>CRIT {forgedItem.critChance}%</span>}
                {forgedItem.blockChance !== undefined && <span>BLK {forgedItem.blockChance}%</span>}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleKeepForged}
                className="flex-1 px-4 py-2.5 text-xs font-bold rounded-full border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={handleEquipForged}
                className="flex-1 px-4 py-2.5 text-xs font-bold rounded-full bg-main/10 border border-main text-main hover:bg-main/20 transition-colors"
              >
                Pakai Sekarang
              </button>
            </div>
          </motion.div>
        ) : (
          /* Forge Selection View */
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Tier Selector */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Pilih Tier</h3>
              <div className="grid grid-cols-5 gap-2">
  {([1, 2, 3, 4, 5] as ItemTier[]).map(tier => {
    const cost = slotMode === 'specific' ? FORGE_COSTS_SPECIFIC[tier] : FORGE_COSTS_RANDOM[tier];
    const selected = selectedTier === tier;
    return (
                    <button
                      key={tier}
                      onClick={() => { setSelectedTier(tier); setSelectedSlot(null); }}
      className={`p-3 rounded-xl border text-center transition-all ${
        selected
          ? `${TIER_COLORS[tier].border} ${TIER_COLORS[tier].text} ${TIER_COLORS[tier].bg}`
          : 'border-border text-text-secondary hover:border-text-secondary'
      }`}
    >
      <div className="text-[10px] font-bold">{TIER_LABELS[tier]}</div>
      <div className="text-[8px] font-mono mt-1">🌸 {cost}</div>
    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Mode Selector */}
            {selectedTier && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Pilih Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setSlotMode('random'); setSelectedSlot(null); }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      slotMode === 'random'
                        ? 'border-main text-main bg-main/5'
                        : 'border-border text-text-secondary hover:border-text-secondary'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-[10px] font-bold">Acak</div>
                    <div className="text-[8px] font-mono text-text-secondary mt-0.5">🌸 {FORGE_COSTS_RANDOM[selectedTier]}</div>
                    <div className="text-[9px] text-text-secondary mt-1">Tipe acak</div>
                  </button>
                  <button
                    onClick={() => setSlotMode('specific')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      slotMode === 'specific'
                        ? 'border-main text-main bg-main/5'
                        : 'border-border text-text-secondary hover:border-text-secondary'
                    }`}
                  >
                    <Hammer className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-[10px] font-bold">Pilih Tipe</div>
                    <div className="text-[8px] font-mono text-text-secondary mt-0.5">🌸 {FORGE_COSTS_SPECIFIC[selectedTier]}</div>
                    <div className="text-[9px] text-text-secondary mt-1">Tipe spesifik</div>
                  </button>
                </div>

                {/* Specific Slot Buttons */}
                {slotMode === 'specific' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-5 gap-2"
                  >
                    {(EQUIP_SLOTS as ItemType[]).map(slot => {
                      const selected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            selected
                              ? 'border-main text-main bg-main/5'
                              : 'border-border text-text-secondary hover:border-text-secondary'
                          }`}
                        >
                          <div className="flex justify-center">{SLOT_ICONS[slot]}</div>
                          <div className="text-[8px] font-bold mt-1">{SLOT_LABELS[slot]}</div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Forge Action */}
            {selectedTier && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
      {inventoryFull && (
        <p className="text-[10px] text-danger font-bold text-center">
          Inventori penuh ({inventory.length}/{MAX_INVENTORY_SLOTS})
        </p>
      )}
      {!canAfford && (
        <p className="text-[10px] text-danger font-bold text-center">
          Butuh 🌸 {cost} (memiliki {sakuraPetals})
        </p>
      )}
                <button
                  onClick={handleForge}
                  disabled={!canForge || isForging}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    canForge && !isForging
                      ? 'bg-main/10 border border-main text-main hover:bg-main/20'
                      : 'border border-border text-text-secondary/40 cursor-not-allowed'
                  }`}
                >
                  {isForging ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Menempa...
                    </span>
                  ) : (
                    `Tempa 🌸 ${cost}`
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
