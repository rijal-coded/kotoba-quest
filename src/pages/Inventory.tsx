import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Item, EquippedStats, Page } from '../types';
import { Heart, Shield, Sword, Star, Sparkles, Hammer, Trash2, HelpCircle, Lock as LockIcon, Shield as ShieldIcon, Swords, Crosshair } from 'lucide-react';
import { MAX_INVENTORY_SLOTS } from '../constants';
import { TIER_LABELS } from '../types';
import { computeEquippedStats } from '../utils/equipmentStats';

const PETA_TABLE: Record<number, number> = { 1: 1, 2: 3, 3: 8, 4: 20, 5: 50 };

const TYPE_ORDER = { WEAPON: 0, SHIELD: 1, ARMOR: 2, HELM: 3, ACCESSORY: 4, CONSUMABLE: 5 } as const;

interface InventoryProps {
  username: string;
  inventory: Item[];
  setInventory: (items: Item[]) => void;
  sakuraPetals: number;
  setSakuraPetals: React.Dispatch<React.SetStateAction<number>>;
  onNavigate: (page: Page) => void;
}

const typeIcon = (type: Item['type']) => {
  switch (type) {
    case 'WEAPON': return <Sword className="w-4 h-4" />;
    case 'SHIELD': return <ShieldIcon className="w-4 h-4" />;
    case 'ARMOR': return <Shield className="w-4 h-4" />;
    case 'HELM': return <Swords className="w-4 h-4" />;
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
            <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
            <div className="text-sm font-mono font-bold text-text-primary mt-1">{stat.value}</div>
            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HELP_CONTENT = `
Panduan Sistem Tempa
Apa itu Sakura Petals?
Sakura Petals adalah material untuk menempa equipment baru. Dapatkan dengan:
- Menjual (Salvage) item yang tidak terpakai
- Bonus penyelesaian level pertama kali (hanya sekali per level)

Cara Salvage
1. Klik "Salvage Mode" di halaman Inventaris
2. Centang item yang ingin dijual
3. Klik "Salvage (N)" untuk mengonfirmasi

Item yang dilindungi (tidak bisa dipilih):
- Item yang sedang dipasang (Equipped)
- Item yang di-Favorit (hati)
- Item terakhir dari tipe tersebut (mencegah kamu tanpa senjata)

Hasil Salvage: Semakin tinggi tier item, semakin banyak petals yang didapat. Affix juga menambah bonus.

Cara Tempa (Forge)
1. Buka halaman Tempa dari tombol di Inventaris
2. Pilih tier yang diinginkan (1-5)
3. Pilih Acak (tipe random, biaya standar) atau Pilih Tipe (biaya 1.5x) — berguna jika kamu kekurangan slot equipment tertentu
4. Klik "Tempa" untuk membuat item baru

Affixes (Suffix)
Item Tier 3+ bisa memiliki affix tambahan:
- Tier 3: 1 affix (40% kemungkinan)
- Tier 4: 1-2 affix (60% / 30%)
- Tier 5: 1-2 affix (50% / 50%)
Setiap affix menambah bonus petal saat disalvage. Efek affix bervariasi berdasarkan tier dan kualitas item.

Petals per Tier
Tier 1 (Bronze): 1 petal, +0 per affix
Tier 2 (Silver): 3 petals, +0 per affix
Tier 3 (Gold): 8 petals, +1 per affix
Tier 4 (Platinum): 20 petals, +1 per affix
Tier 5 (Legendary): 50 petals, +1 per affix

Biaya Tempa:
Tier 1: Acak 3 | Pilih Tipe 5
Tier 2: Acak 10 | Pilih Tipe 15
Tier 3: Acak 25 | Pilih Tipe 38
Tier 4: Acak 60 | Pilih Tipe 90
Tier 5: Acak 150 | Pilih Tipe 225

Tips
- Simpan petals untuk tier tinggi — item bagus sulit didapat
- Favoritkan item incaran agar tidak ke-skip saat Salvage Mode
- Tempa di tier yang sama memberimu jaminan 2 affix
- Item Historical bisa muncul saat tempa, tapi lebih jarang daripada di pertempuran
`;

export const Inventory = ({ username, inventory, setInventory, sakuraPetals, setSakuraPetals, onNavigate }: InventoryProps) => {
  const [filter, setFilter] = useState<'SEMUA' | 'SENJATA' | 'PERISAI' | 'ARMOR' | 'HELM' | 'AKSESORI' | 'POTIONS'>('SEMUA');
  const [salvageMode, setSalvageMode] = useState(false);
  const [selectedForSalvage, setSelectedForSalvage] = useState<Set<string>>(new Set());
  const [showSalvageConfirm, setShowSalvageConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const equippedStats = useMemo(() => computeEquippedStats(inventory), [inventory]);
  const computedStrength = useMemo(() => equippedStats.totalAttack + equippedStats.totalDefense + equippedStats.totalHpBonus, [equippedStats]);
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

  const toggleFavorite = (item: Item) => {
    setInventory(inventory.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  const canSelectForSalvage = (item: Item): boolean => {
    if (item.isEquipped) return false;
    if (item.isFavorite) return false;
    if (item.type === 'CONSUMABLE') return true;
    const sameTypeCount = inventory.filter(i => i.type === item.type).length;
    if (sameTypeCount <= 1) return false;
    return true;
  };

  const toggleSalvageSelection = (itemId: string) => {
    setSelectedForSalvage(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const selectAllVisible = () => {
    const visible = items.filter(canSelectForSalvage);
    const ids = visible.map(i => i.id);
    setSelectedForSalvage(new Set(ids));
  };

  const calculateSalvagePetals = (item: Item): number => {
    const base = PETA_TABLE[item.tier] ?? 1;
    const affixBonus = (item.affixes?.length ?? 0);
    if (item.type === 'CONSUMABLE') {
      return (item.count ?? 1) * PETA_TABLE[item.tier];
    }
    return base + affixBonus;
  };

  const handleBatchSalvage = () => {
    const toSalvage = inventory.filter(i => selectedForSalvage.has(i.id));
    const totalPetals = toSalvage.reduce((sum, i) => sum + calculateSalvagePetals(i), 0);
    if (totalPetals <= 0) return;
    const idsToRemove = new Set(toSalvage.map(i => i.id));
    const remaining = inventory.filter(i => !idsToRemove.has(i.id));
    setInventory(remaining);
    setSakuraPetals(prev => prev + totalPetals);
    setSelectedForSalvage(new Set());
    setSalvageMode(false);
    setShowSalvageConfirm(false);
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
    const ta = TYPE_ORDER[a.type] ?? 99;
    const tb = TYPE_ORDER[b.type] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name);
  }), [items]);

  const salvageableCount = salvageMode ? sortedItems.filter(canSelectForSalvage).length : 0;
  const selectedCount = selectedForSalvage.size;
  const totalSalvagePetals = salvageMode
    ? sortedItems.filter(i => selectedForSalvage.has(i.id)).reduce((sum, i) => sum + calculateSalvagePetals(i), 0)
    : 0;

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
          <div className="text-xl font-mono text-main font-bold">{computedStrength.toLocaleString('id-ID')}</div>
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
              <div key={item.id} className={`kawaii-card p-4 space-y-2 ${item.isEquipped ? 'border-main/30 bg-main/5' : ''}`}>
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
                  {item.attackBonus !== undefined && <p className="text-[10px] text-text-secondary">ATK +{item.attackBonus}</p>}
                  {item.defenseBonus !== undefined && <p className="text-[10px] text-text-secondary">DEF +{item.defenseBonus}</p>}
                  {item.hpBonus !== undefined && <p className="text-[10px] text-text-secondary">HP +{item.hpBonus}</p>}
                  {item.critChance !== undefined && <p className="text-[10px] text-text-secondary">CRIT +{item.critChance}%</p>}
                  {item.blockChance !== undefined && <p className="text-[10px] text-text-secondary">BLK +{item.blockChance}%</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Header Actions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-main" />
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Inventaris</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${inventory.length >= MAX_INVENTORY_SLOTS ? 'text-danger animate-pulse' : 'text-text-secondary'}`}>
              {inventory.length}/{MAX_INVENTORY_SLOTS} slot
            </span>
            <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded-full border border-accent/30">
              🌸 {sakuraPetals}
            </span>
            <button
              onClick={() => setShowHelp(true)}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-main hover:border-main/30 transition-colors"
              title="Panduan"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs + Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-horizontal-thin flex-1">
            {(['SEMUA', 'SENJATA', 'PERISAI', 'ARMOR', 'HELM', 'AKSESORI', 'POTIONS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                  filter === tab
                    ? 'bg-main/10 border-main text-main'
                    : 'border-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('FORGE')}
            className="flex-shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-full border border-accent/40 text-accent hover:bg-accent/10 transition-colors flex items-center gap-1"
          >
            <Hammer className="w-3 h-3" /> Forge
          </button>
        </div>

        {/* Salvage Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSalvageMode(!salvageMode);
              setSelectedForSalvage(new Set());
            }}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all ${
              salvageMode
                ? 'bg-danger/10 border-danger text-danger'
                : 'border-border text-text-secondary hover:border-text-secondary'
            }`}
          >
            {salvageMode ? 'Keluar Salvage Mode' : 'Salvage Mode'}
          </button>
          {salvageMode && (
            <>
              <button
                onClick={selectAllVisible}
                className="px-3 py-1.5 text-[10px] font-bold rounded-full border border-main/40 text-main hover:bg-main/10 transition-colors"
              >
                Pilih Semua ({salvageableCount})
              </button>
              {selectedCount > 0 && (
                <button
                  onClick={() => setShowSalvageConfirm(true)}
                  className="px-3 py-1.5 text-[10px] font-bold rounded-full bg-danger/10 border border-danger text-danger hover:bg-danger/20 transition-colors"
                >
                  Salvage ({selectedCount}) → 🌸 {totalSalvagePetals}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedItems.map((item, index) => {
          const canEquip = item.type !== 'CONSUMABLE';
          const protectedFromSalvage = !canSelectForSalvage(item);
          const isSelected = selectedForSalvage.has(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`kawaii-card p-4 flex justify-between items-start group ${
                item.isEquipped ? 'border-main/30 bg-main/5' : ''
              } ${!canEquip && item.type !== 'CONSUMABLE' && !salvageMode ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-border ${getTypeColor(item.type)}`}>
                  {typeIcon(item.type)}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h6 className="text-sm font-bold text-text-primary truncate">{item.name}</h6>
                    {item.tier && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-bg-surface-alt text-text-secondary uppercase">
                        {TIER_LABELS[item.tier]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-tight">{item.description}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-text-secondary">
                    {item.attackBonus !== undefined && <span>ATK +{item.attackBonus}</span>}
                    {item.defenseBonus !== undefined && <span>DEF +{item.defenseBonus}</span>}
                    {item.hpBonus !== undefined && <span>HP +{item.hpBonus}</span>}
                    {item.critChance !== undefined && <span>CRIT {item.critChance}%</span>}
                    {item.blockChance !== undefined && <span>BLK {item.blockChance}%</span>}
                  </div>
  {protectedFromSalvage && salvageMode && (
                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
    {item.isEquipped && <><LockIcon className="w-3 h-3" /> Equipped — unequip first</>}
    {!item.isEquipped && item.isFavorite && <><Heart className="w-3 h-3 text-danger" /> Favorited</>}
    {!item.isEquipped && !item.isFavorite && item.type !== 'CONSUMABLE' && inventory.filter(i => i.type === item.type).length <= 1 && (
    <><LockIcon className="w-3 h-3" /> Last {item.type} — cannot salvage</>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-2">
                {/* Favorite heart */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className={`w-6 h-6 flex items-center justify-center transition-colors ${
                    item.isFavorite ? 'text-danger' : 'text-text-secondary/30 hover:text-danger'
                  }`}
                  title={item.isFavorite ? 'Unfavorite' : 'Favorite (protect from salvage)'}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {item.count !== undefined && (
                  <span className="text-sm font-mono font-bold text-main">x{item.count}</span>
                )}

                {/* Salvage checkbox */}
                {salvageMode && canSelectForSalvage(item) && (
                  <button
                    onClick={() => toggleSalvageSelection(item.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-danger border-danger text-white'
                        : 'border-border text-transparent hover:border-danger'
                    }`}
                  >
                    {isSelected && '✓'}
                  </button>
                )}

                {item.type !== 'CONSUMABLE' && canEquip && !salvageMode && (
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

                {salvageMode && !canSelectForSalvage(item) && (
                  <span className="px-2 py-1 text-[8px] font-bold rounded-full border border-border/50 text-text-secondary/40 bg-bg-surface-alt">
                    <LockIcon className="w-2.5 h-2.5 inline mr-1" />
                    {item.isEquipped ? 'Equipped' : item.isFavorite ? 'Favorited' : 'Protected'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-text-secondary text-xs">
          Inventori kosong. Menangkan pertempuran untuk mendapatkan item!
        </div>
      )}

      {/* Salvage Confirmation Modal */}
      <AnimatePresence>
        {showSalvageConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] flex items-end md:items-center justify-center"
            onClick={() => setShowSalvageConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm bg-bg-primary border border-border rounded-t-2xl md:rounded-2xl p-5 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-text-primary">Konfirmasi Salvage</h3>
              <p className="text-xs text-text-secondary">
                Kamu akan menjual <span className="font-bold text-danger">{selectedCount} item</span> dan mendapatkan{' '}
                <span className="font-bold text-accent">🌸 {totalSalvagePetals} petals</span>.
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {inventory.filter(i => selectedForSalvage.has(i.id)).map(item => (
                  <div key={item.id} className="flex justify-between text-[10px] text-text-secondary">
                    <span className="truncate">{item.name}</span>
                    <span className="font-mono ml-2">+{calculateSalvagePetals(item)} 🌸</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSalvageConfirm(false)}
                  className="flex-1 px-4 py-2 text-xs font-bold rounded-full border border-border text-text-secondary hover:text-text-primary transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleBatchSalvage}
                  className="flex-1 px-4 py-2 text-xs font-bold rounded-full bg-danger/10 border border-danger text-danger hover:bg-danger/20 transition-colors"
                >
                  Ya, Salvage
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg max-h-[80vh] md:max-h-[85vh] bg-bg-primary border border-border rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-sm font-bold text-main uppercase tracking-wider">Panduan Sistem Tempa</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                {HELP_CONTENT}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
