import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface WaveTransitionProps {
  wave: number;
  enemyName: string;
  enemyRank: string;
}

export const WaveTransition = ({ wave, enemyName, enemyRank }: WaveTransitionProps) => {
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
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="text-center"
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

            <p className="text-xs font-bold text-text-secondary mt-2 uppercase tracking-wider">
              {enemyRank}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
