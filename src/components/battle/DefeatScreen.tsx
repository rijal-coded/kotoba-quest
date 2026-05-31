import { motion } from 'motion/react';
import { XCircle, Heart, ArrowRight } from 'lucide-react';

interface DefeatScreenProps {
  stats: { correct: number; wrong: number; accuracy: number };
  onRetry: () => void;
  onContinue: () => void;
}

export const DefeatScreen = ({ stats, onRetry, onContinue }: DefeatScreenProps) => {
  const total = stats.correct + stats.wrong;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="space-y-4"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-danger/10 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-danger" />
        </div>
        <h2 className="text-4xl font-bold text-danger"
          style={{ fontFamily: 'var(--font-display)' }}>
          Coba Lagi!
        </h2>
        <p className="text-text-secondary text-sm max-w-xs mx-auto">
          Tidak apa-apa, setiap percobaan membuatmu lebih kuat!
        </p>
        {total > 0 && (
          <div className="flex justify-center gap-4 text-sm font-mono">
            <span className="text-accent">{stats.correct} benar</span>
            <span className="text-text-secondary">|</span>
            <span className="text-danger">{stats.wrong} salah</span>
            <span className="text-text-secondary">|</span>
            <span className="text-main">{stats.accuracy}%</span>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="kawaii-btn-outline px-12 py-4 text-base border-danger text-danger hover:bg-danger/5"
        >
          <Heart className="w-4 h-4" />
          Coba Lagi
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="kawaii-btn px-12 py-4 text-base"
        >
          Lanjut
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
