import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Level, GameMode, Page } from '../types';

interface LevelSelectProps {
  levels: Level[];
  gameMode: GameMode;
  onSelect: (level: Level) => void;
  onNavigate?: (page: Page) => void;
}

const formatTime = (seconds: number) => {
  if (seconds <= 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const LevelSelect = ({ levels, gameMode, onSelect, onNavigate }: LevelSelectProps) => {
  // In TANTANGAN mode, only show completed (practiced) levels
  const availableLevels = gameMode === 'TANTANGAN'
    ? levels.filter(l => l.isCompleted)
    : levels;

  const hasNoAvailable = availableLevels.length === 0;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-main tracking-widest">
          {gameMode === 'TANTANGAN' ? 'TANTANGAN MODE' : `${gameMode} MODE`}
        </h2>
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-main/10 text-main rounded-full border border-main/20">
          {availableLevels.length} Level
        </span>
      </div>

      {hasNoAvailable ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-text-secondary">Tidak ada level yang tersedia. Selesaikan setidaknya satu level di mode LEARNING atau PRACTICE untuk membuka Tantangan!</p>
          <button
            onClick={() => onNavigate?.('MODE_SELECT')}
            className="px-6 py-3 bg-main/10 text-main font-bold rounded-xl border border-main/30 hover:bg-main/20 hover:glow-cyan transition-all text-sm uppercase tracking-wider"
          >
            Kembali ke Mode Awal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {availableLevels.map((level, index) => {
          const IconComponent = (Icons as any)[level.icon] || Icons.HelpCircle;

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(level)}
              className="w-full bg-bg-surface border border-text-primary/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-main/50 hover:shadow-[0_4px_20px_rgba(0,156,255,0.1)] transition-all text-left"
            >
              <div className="w-12 h-12 shrink-0 bg-bg-primary border border-text-primary/10 rounded-xl flex items-center justify-center text-main group-hover:scale-110 group-hover:border-main/40 transition-all">
                <IconComponent className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-tight text-text-primary group-hover:text-main transition-colors truncate">
                  {level.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <div className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${level.isCompleted ? 'bg-accent/15 text-accent' : 'bg-text-primary/5 text-text-secondary'}`}>
                    {level.isCompleted ? (
                      <><Icons.CheckCircle2 className="w-3 h-3" /> SELESAI</>
                    ) : (
                      <><Icons.Circle className="w-3 h-3" /> BELUM</>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-text-primary/5 text-text-secondary text-[9px] font-bold rounded-full">
                    <Icons.Clock className="w-3 h-3" />
                    {formatTime(level.bestTime)}
                  </div>
                </div>
              </div>

              <Icons.ChevronRight className="w-5 h-5 shrink-0 text-text-secondary group-hover:text-main transition-colors" />
            </motion.button>
          );
        })}
        </div>
      )}
    </div>
  );
};
