import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Lock, ChevronDown, Search, X } from 'lucide-react';
import { Level, Page, QuestionType } from '../types';

interface WordsProps {
  levels: Level[];
  onNavigate: (page: Page) => void;
}

const QUESTION_DOT_LABELS: { type: QuestionType; symbol: string }[] = [
  { type: 'kana', symbol: 'あ' },
  { type: 'kanji', symbol: '々' },
  { type: 'romaji', symbol: 'A' },
  { type: 'indonesian', symbol: '⇄' },
];

export const Words = ({ levels, onNavigate }: WordsProps) => {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(levelId)) {
        next.delete(levelId);
      } else {
        next.add(levelId);
      }
      return next;
    });
  };

  const totalSeen = levels.reduce(
    (sum, l) => sum + (l.seenWordIndices ?? []).length,
    0
  );
  const totalWords = levels.reduce((s, l) => s + l.words.length, 0);
  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase();

  return (
    <div className="min-h-[80vh] p-4 md:p-6 pb-24 md:pb-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-main" />
          <h2 className="text-2xl md:text-3xl font-bold text-main"
            style={{ fontFamily: 'var(--font-display)' }}>
            Kata
          </h2>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <p className="text-base text-text-secondary">
          Koleksi kata — mainkan mode Belajar untuk membuka kata baru
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kata (kana, kanji, romaji, arti)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-surface-alt border border-border text-text-primary text-sm font-medium placeholder:text-text-secondary/50 outline-none focus:border-main/50 transition-colors"
        />
        {isSearching && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>

      {/* Stats + legend row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3"
      >
        {/* Compact word count */}
        <div className="kawaii-card px-3 py-1.5 text-xs text-text-secondary shrink-0">
          <span className="font-bold text-main">{totalSeen}</span>
          <span className="text-text-secondary/60"> / {totalWords}</span>
        </div>

        {/* Dot legend */}
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-bg-surface-alt border border-border text-[10px]">
          {QUESTION_DOT_LABELS.map(({ type, symbol }) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded bg-bg-surface border border-border flex items-center justify-center text-[8px] font-bold text-text-secondary">
                {symbol}
              </div>
              <span className="text-text-secondary/30">→</span>
              <div className="w-3.5 h-3.5 rounded bg-accent flex items-center justify-center text-[8px] font-bold text-white">
                {symbol}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Level grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {levels.map((level, levelIdx) => {
          const seenSet = new Set(level.seenWordIndices ?? []);
          const isExpanded = isSearching || expandedLevels.has(level.id);
          const coverageMap = new Map<number, QuestionType[]>();
          (level.wordCoverage ?? []).forEach(wc => {
            coverageMap.set(wc.wordIndex, wc.coveredQuestions);
          });

          // Filter words when searching
          const wordIndices = level.words
            .map((word, idx) => ({ word, idx }))
            .filter(({ word }) => {
              if (!isSearching) return true;
              return (
                word.japanese.toLowerCase().includes(q) ||
                (word.kanji && word.kanji.toLowerCase().includes(q)) ||
                word.romaji.toLowerCase().includes(q) ||
                word.indonesian.toLowerCase().includes(q)
              );
            });

          if (isSearching && wordIndices.length === 0) return null;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIdx * 0.03 }}
              className="space-y-2"
            >
              {/* Level header — clickable */}
              <button
                onClick={() => toggleLevel(level.id)}
                className="w-full flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-bg-surface-alt transition-colors text-left"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </motion.div>
                <h3 className="text-base font-bold text-text-secondary uppercase tracking-wider flex-1">
                  {level.name}
                </h3>
                <span className="kawaii-badge kawaii-badge--neutral text-[10px]">
                  {seenSet.size} / {level.words.length}
                </span>
              </button>

              {/* Word cards — collapsible */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="word-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    {wordIndices.map(({ word, idx }) => {
                      const isUnlocked = seenSet.has(idx);
                      const covered = coverageMap.get(idx) ?? [];

                      if (isUnlocked) {
                        return (
                          <motion.div
                            key={`${level.id}-${idx}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.01 }}
                            className="kawaii-card p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {word.kanji && (
                                  <p className="text-2xl font-bold text-text-primary"
                                    style={{ fontFamily: 'var(--font-display)' }}>
                                    {word.kanji}
                                  </p>
                                )}
                                <p className={`font-bold ${word.kanji ? 'text-base text-text-secondary' : 'text-xl text-text-primary'}`}
                                  style={{ fontFamily: word.kanji ? 'inherit' : 'var(--font-display)' }}>
                                  {word.japanese}
                                </p>
                                <p className="text-sm text-secondary font-bold mt-0.5">
                                  {word.romaji}
                                </p>
                              </div>
                              <div className="text-right shrink-0 space-y-1.5">
                                <p className="text-base font-bold text-accent">
                                  {word.indonesian}
                                </p>
                                {/* Coverage dots */}
                                <div className="flex justify-end gap-1">
                                  {QUESTION_DOT_LABELS
                                    .filter(({ type }) => type !== 'kanji' || !!word.kanji)
                                    .map(({ type, symbol }) => {
                                      const isCovered = covered.includes(type);
                                      return (
                                        <div
                                          key={type}
                                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                                            isCovered
                                              ? 'bg-accent text-white shadow-[0_0_4px_rgba(73,248,155,0.5)]'
                                              : 'bg-bg-surface border border-border text-text-secondary'
                                          }`}
                                          title={`${type}: ${isCovered ? 'Sudah' : 'Belum'}`}
                                        >
                                          {symbol}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // Locked word placeholder
                      return (
                        <motion.div
                          key={`${level.id}-${idx}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.01 }}
                          className="kawaii-card p-3 opacity-50"
                        >
                          <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-text-secondary shrink-0" />
                            <p className="text-xs text-text-secondary">
                              Kata #{idx + 1} — Mainkan mode Belajar untuk membuka
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* No results message */}
      {isSearching && levels.every(level => {
        const wordIndices = level.words.filter(word =>
          word.japanese.toLowerCase().includes(q) ||
          (word.kanji && word.kanji.toLowerCase().includes(q)) ||
          word.romaji.toLowerCase().includes(q) ||
          word.indonesian.toLowerCase().includes(q)
        );
        return wordIndices.length === 0;
      }) && (
        <div className="text-center py-12 text-text-secondary text-sm">
          Tidak ditemukan kata yang cocok dengan "{searchQuery}"
        </div>
      )}
    </div>
  );
};
