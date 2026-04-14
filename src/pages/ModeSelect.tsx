import { motion } from 'motion/react';
import { Page, GameMode } from '../types';

interface ModeSelectProps {
  onSelectMode: (mode: GameMode) => void;
  onNavigate: (page: Page) => void;
}

export const ModeSelect = ({ onSelectMode, onNavigate }: ModeSelectProps) => {
  const handleSelect = (mode: GameMode) => {
    onSelectMode(mode);
    onNavigate('LEVEL_SELECT');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 max-w-2xl w-full"
      >
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.5)]">
            PILIH MODE
          </h2>
          <p className="text-white/60 tracking-[0.2em] uppercase text-sm">
            Tentukan tingkat kesulitanmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => handleSelect('KANA')}
            className="group relative p-8 bg-dark-surface border-2 border-neon-green overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <div className="absolute inset-0 bg-neon-green translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative z-10 flex flex-col items-center gap-4 group-hover:text-dark-bg transition-colors">
              <span className="text-4xl font-black tracking-widest uppercase">
                KANA
              </span>
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                (EASY)
              </span>
              <p className="text-xs opacity-70 mt-2">
                Bermain menggunakan Hiragana dan Katakana. Cocok untuk pemula.
              </p>
            </div>
          </button>

          <button 
            onClick={() => handleSelect('KANJI')}
            className="group relative p-8 bg-dark-surface border-2 border-neon-pink overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            <div className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative z-10 flex flex-col items-center gap-4 group-hover:text-dark-bg transition-colors">
              <span className="text-4xl font-black tracking-widest uppercase">
                KANJI
              </span>
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                (HARD)
              </span>
              <p className="text-xs opacity-70 mt-2">
                Bermain menggunakan Kanji. Tantangan untuk yang sudah mahir.
              </p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
