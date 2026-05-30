import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface WaveTransitionProps {
  wave: number;
  enemyName: string;
  enemyRank: string;
  enemyTier: number;
}

const SPEED_LABELS: Record<number, string> = {
  1: 'Lambat',
  2: 'Sedang',
  3: 'Cepat',
  4: 'Sangat Cepat',
  5: 'Brutal',
};

export const WaveTransition = ({ wave, enemyName, enemyRank, enemyTier }: WaveTransitionProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, [wave]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-main/40" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">
                Wave {wave}
              </p>
              <Sparkles className="w-4 h-4 text-main/40" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-main"
              style={{ fontFamily: 'var(--font-display)' }}>
              {enemyName}
            </h2>

            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {enemyRank} · Tier {enemyTier}
            </p>

            {/* Speed indicator */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Serangan
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-2 rounded-sm transition-all ${
                      i < enemyTier
                        ? 'bg-warning shadow-[0_0_4px_rgba(255,217,125,0.5)]'
                        : 'bg-bg-surface border border-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
                {SPEED_LABELS[enemyTier] ?? 'Brutal'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
