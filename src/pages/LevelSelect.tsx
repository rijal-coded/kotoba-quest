import { motion } from 'motion/react';
import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Level, GameMode, Page } from '../types';
import { Sparkles } from 'lucide-react';

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
  const availableLevels = useMemo(() => levels, [levels]);

  const hasNoAvailable = availableLevels.length === 0;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-main" />
        <h2 className="text-2xl md:text-3xl font-bold text-main"
          style={{ fontFamily: 'var(--font-display)' }}>
          {`${gameMode} Mode`}
        </h2>
        <span className="kawaii-badge kawaii-badge--primary">
          {availableLevels.length} Level
        </span>
      </div>

      {hasNoAvailable ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-text-secondary">Tidak ada level yang tersedia.</p>
          <button
            onClick={() => onNavigate?.('MODE_SELECT')}
            className="kawaii-btn-outline px-6 py-3 text-sm"
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
                transition={{ delay: index * 0.02, duration: 0.15 }}
  whileHover={{ scale: 1.01, y: -1 }}
  whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(level)}
                className="w-full kawaii-card p-4 flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 shrink-0 bg-main/10 rounded-xl flex items-center justify-center text-main group-hover:scale-110 transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm md:text-base font-bold text-text-primary group-hover:text-main transition-colors truncate"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {level.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const allUnlocked = level.unlockedWordCount >= level.words.length;
                      if (level.isCompleted && allUnlocked) {
                        return (
                          <span className="kawaii-badge kawaii-badge--success">
                            <Icons.CheckCircle2 className="w-3 h-3" /> Selesai
                          </span>
                        );
                      }
                      if (level.isCompleted) {
                        return (
                          <span className="kawaii-badge kawaii-badge--primary">
                            <Icons.CircleDot className="w-3 h-3" /> Progres
                          </span>
                        );
                      }
                      return (
                        <span className="kawaii-badge kawaii-badge--neutral">
                          <Icons.Circle className="w-3 h-3" /> Belum
                        </span>
                      );
                    })()}
                    <span className="kawaii-badge kawaii-badge--neutral">
                      <Icons.Clock className="w-3 h-3" />
                      {formatTime(level.bestTime)}
                    </span>
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
