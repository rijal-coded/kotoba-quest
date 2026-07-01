import { motion } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { Word } from '../../types';

interface WordCardProps {
  word: Word;
  onClose: () => void;
}

export const WordCard = ({ word, onClose }: WordCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md"
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm kawaii-panel p-8 space-y-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-danger hover:border-danger/30 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-main">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Kata Baru</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* All fields shown at once */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs text-text-secondary mb-1">Kanji</p>
            <p className="text-4xl font-bold text-text-primary"
              style={{ fontFamily: 'var(--font-display)' }}>
              {word.kanji ?? '—'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <p className="text-xs text-text-secondary mb-1">Kana</p>
            <p className="text-3xl font-bold text-main"
              style={{ fontFamily: 'var(--font-display)' }}>
              {word.japanese}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-xs text-text-secondary mb-1">Romaji</p>
            <p className="text-xl font-bold text-secondary">
              {word.romaji}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <p className="text-xs text-text-secondary mb-1">Arti</p>
            <p className="text-lg font-bold text-accent">
              {word.indonesian}
            </p>
          </motion.div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="kawaii-btn w-full"
        >
          Mulai Menjawab
        </button>
      </motion.div>
    </motion.div>
  );
};
