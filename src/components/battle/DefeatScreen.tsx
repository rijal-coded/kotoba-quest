import { motion } from 'motion/react';
import { XCircle, Heart, ArrowRight, Star, BookOpen } from 'lucide-react';

interface DefeatScreenProps {
  stats: { correct: number; wrong: number; accuracy: number };
  onRetry: () => void;
  onContinue: () => void;
  onSeeStats?: () => void;
}

export const DefeatScreen = ({ stats, onRetry, onContinue, onSeeStats }: DefeatScreenProps) => {
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
        <h2 className="text-4xl font-bold text-danger" style={{ fontFamily: 'var(--font-display)' }}>
          Coba Lagi!
        </h2>
        <p className="text-text-secondary text-sm max-w-xs mx-auto">
          Tidak apa-apa, setiap percobaan membuatmu lebih kuat!
        </p>

        {total > 0 && (
          <div className="kawaii-card p-4 space-y-3 max-w-xs mx-auto">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-main" />
              Statistik Pertanyaan
            </h3>
            <div className="flex justify-center gap-6 text-sm font-mono">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.correct}</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">Benar</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-danger">{stats.wrong}</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">Salah</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-main">{stats.accuracy}%</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">Akurasi</p>
              </div>
            </div>
            {onSeeStats && (
              <button
                onClick={onSeeStats}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-main/30 text-main text-sm font-bold hover:bg-main/5 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Detail Jawaban
              </button>
            )}
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
