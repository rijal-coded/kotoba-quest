import { useState } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Level, EndlessRecord } from '../types';

interface EndlessSetupProps {
  levels: Level[];
  records: EndlessRecord[];
  onStart: (selectedLevels: Level[]) => void;
}

export const EndlessSetup = ({ levels, records, onStart }: EndlessSetupProps) => {
  const completedLevels = levels.filter(l => l.isCompleted);
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

  const highestRecord = records.reduce((max, record) => record.enemiesBeaten > max.enemiesBeaten ? record : max, { enemiesBeaten: 0, wordsBeaten: 0, date: 0 });
  const recentRecords = [...records].sort((a, b) => b.date - a.date).slice(0, 5);

  if (completedLevels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
        <Icons.Lock className="w-16 h-16 text-white/20" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-white/40">Mode Terkunci</h2>
        <p className="text-white/60">Selesaikan setidaknya satu level untuk membuka Mode Tanpa Batas.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 md:pb-6 space-y-8 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black uppercase text-neon-pink drop-shadow-[0_0_2px_rgba(236,72,153,0.5)] tracking-widest">
          MODE TANPA BATAS
        </h2>
        <p className="text-white/60 text-sm uppercase tracking-widest">Bertahan selama mungkin</p>
      </div>

      {/* Highest Record */}
      <div className="bg-dark-surface border border-neon-pink p-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neon-pink uppercase tracking-widest">Rekor Tertinggi</span>
          <div className="text-xl font-black text-white">{highestRecord.enemiesBeaten} Musuh</div>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Kata Benar</span>
          <div className="text-lg font-mono text-neon-green">{highestRecord.wordsBeaten}</div>
        </div>
      </div>

      {/* Recent Records */}
      {recentRecords.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Riwayat Rekor</h3>
          <div className="space-y-2">
            {recentRecords.map((record, i) => (
              <div key={i} className="bg-dark-surface/50 border border-white/5 p-3 flex justify-between items-center">
                <span className="text-xs text-white/60">{new Date(record.date).toLocaleDateString()}</span>
                <div className="flex gap-4 text-xs font-mono">
                  <span className="text-neon-pink">{record.enemiesBeaten} 💀</span>
                  <span className="text-neon-green">{record.wordsBeaten} ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Pilih Level Kosakata</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {completedLevels.map((level) => {
            const IconComponent = (Icons as any)[level.icon] || Icons.HelpCircle;
            const isSelected = selectedIds.has(level.id);
            
            return (
              <button
                key={level.id}
                onClick={() => toggleLevel(level.id)}
                className={`w-full flex items-center gap-4 p-4 border transition-all ${
                  isSelected 
                    ? 'bg-neon-pink/10 border-neon-pink text-white' 
                    : 'bg-dark-surface border-white/10 text-white/40 hover:border-white/30'
                }`}
              >
                <div className={`w-12 h-12 flex items-center justify-center border ${isSelected ? 'border-neon-pink text-neon-pink' : 'border-white/10 text-white/40'}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left font-bold uppercase tracking-widest">
                  {level.name}
                </div>
                <div className={`w-6 h-6 border flex items-center justify-center ${isSelected ? 'border-neon-pink bg-neon-pink text-dark-bg' : 'border-white/20'}`}>
                  {isSelected && <Icons.Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onStart(completedLevels.filter(l => selectedIds.has(l.id)))}
        disabled={selectedIds.size === 0}
        className="w-full py-4 bg-neon-pink text-dark-bg font-black uppercase tracking-widest disabled:opacity-50 hover:bg-neon-pink/90 transition-colors"
      >
        Mulai
      </button>
    </div>
  );
};
