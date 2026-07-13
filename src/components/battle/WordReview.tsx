import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { Word } from '../../types';

interface WordReviewItem {
  word: Word;
  correct: boolean;
  wrongAttempts: number;
}

interface WordReviewProps {
  items: WordReviewItem[];
  score: number;
  onBack: () => void;
}

export const WordReview = ({ items, score, onBack }: WordReviewProps) => {
  const correctCount = items.filter(i => i.correct).length;
  const totalWrongAttempts = items.reduce((sum, i) => sum + i.wrongAttempts, 0);
  const totalAttempts = correctCount + totalWrongAttempts;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-main" />
            <h2 className="text-2xl md:text-3xl font-bold text-main"
              style={{ fontFamily: 'var(--font-display)' }}>
              Word Review
            </h2>
            <Sparkles className="w-5 h-5 text-main" />
          </div>
          <div className="flex justify-center gap-4 text-sm font-mono">
            <span className="text-accent">{correctCount} benar</span>
            <span className="text-text-secondary">|</span>
            <span className="text-danger">{totalWrongAttempts} salah</span>
            <span className="text-text-secondary">|</span>
            <span className="text-main">{accuracy}% akurasi</span>
          </div>
        </div>

        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: item.correct ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                item.correct
                  ? 'border-accent/30 bg-accent/5'
                  : 'border-danger/30 bg-danger/5'
              }`}
            >
              {item.correct ? (
                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-danger shrink-0" />
              )}
              <div className="flex-1 text-left min-w-0">
                <span className="text-sm font-bold text-text-primary">
                  {item.word.kanji || item.word.japanese}
                </span>
                <span className="text-xs text-text-secondary ml-2">
                  {item.word.indonesian}
                </span>
              </div>
              {item.wrongAttempts > 0 && (
                <span className="text-[10px] font-mono font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded shrink-0">
                  {item.wrongAttempts}× salah
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="kawaii-btn-outline px-8 py-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </motion.button>
      </motion.div>
    </div>
  );
};
