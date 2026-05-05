import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Level, EndlessRecord } from '../types';

interface EndlessSetupProps {
  levels: Level[];
  records: EndlessRecord[];
  onStart: (selectedLevels: Level[]) => void;
}

export const EndlessSetup = ({ levels, records, onStart }: EndlessSetupProps) => {
  const completedLevels = useMemo(() =>
    levels.filter(l => l.isCompleted),
    [levels]
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(completedLevels.map(l => l.id)));

  const toggleLevel = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const highestRecord = useMemo(() =>
    records.reduce(
      (max, record) => record.enemiesBeaten > max.enemiesBeaten ? record : max,
      { enemiesBeaten: 0, wordsBeaten: 0, date: 0 }
    ),
    [records]
  );
  const recentRecords = useMemo(() =>
    [...records].sort((a, b) => b.date - a.date).slice(0, 5),
    [records]
  );

  if (completedLevels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
        <Icons.Lock className="w-16 h-16 text-text-secondary" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-text-secondary">Mode Terkunci</h2>
        <p className="text-text-secondary max-w-xs">Selesaikan setidaknya satu level untuk membuka Mode Tanpa Batas.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-main tracking-widest">
          MODE TANPA BATAS
        </h2>
        <p className="text-text-secondary text-sm uppercase tracking-widest">Bertahan selama mungkin</p>
      </div>

      {/* Highest Record */}
      <div className="bg-bg-surface border border-main/20 rounded-2xl p-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-main uppercase tracking-widest">Rekor Tertinggi</span>
          <div className="text-xl font-black text-text-primary">{highestRecord.enemiesBeaten} Musuh</div>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Kata Benar</span>
          <div className="text-lg font-mono text-accent">{highestRecord.wordsBeaten}</div>
        </div>
      </div>

      {/* Recent Records */}
      {recentRecords.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Riwayat Rekor</h3>
          <div className="space-y-2">
            {recentRecords.map((record, i) => (
              <div key={i} className="bg-bg-surface border border-main/10 rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs text-text-secondary">{new Date(record.date).toLocaleDateString()}</span>
                <div className="flex gap-4 text-xs font-mono">
                  <span className="text-neon-pink">{record.enemiesBeaten} 💀</span>
                  <span className="text-accent">{record.wordsBeaten} ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level Selector */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Pilih Level Kosakata</h3>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {completedLevels.map((level) => {
            const IconComponent = (Icons as any)[level.icon] || Icons.HelpCircle;
            const isSelected = selectedIds.has(level.id);

            return (
              <motion.button
                key={level.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleLevel(level.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-main/10 border-main text-text-primary'
                    : 'bg-bg-surface border-main/10 text-text-secondary hover:border-main/25'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${isSelected ? 'border-main text-main bg-main/10' : 'border-main/10 text-text-secondary'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left text-sm font-bold uppercase tracking-wide">
                  {level.name}
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-main bg-main text-bg-primary' : 'border-main/15'}`}>
                  {isSelected && <Icons.Check className="w-3 h-3" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onStart(completedLevels.filter(l => selectedIds.has(l.id)))}
        disabled={selectedIds.size === 0}
        className="w-full py-4 bg-main text-bg-primary font-black uppercase tracking-widest rounded-2xl shadow-[0_4px_20px_rgba(0,156,255,0.3)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
      >
        Mulai ({selectedIds.size} level)
      </motion.button>
    </div>
  );
};
