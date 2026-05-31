import { motion } from 'motion/react';
import { CheckCircle, Sparkles, Star, XCircle, ArrowRight, BookOpen, Gift } from 'lucide-react';
import { Item, WordCoverage } from '../../types';

interface VictoryScreenProps {
  message: 'hebat' | 'coba_lagi' | 'not_complete';
  stats: { correct: number; wrong: number; accuracy: number };
  wordCoverage: WordCoverage[];
  coverageComplete: boolean;
  rewards: Item[];
  onContinue: () => void;
  onSeeStats: () => void;
  levelName: string;
}

export const VictoryScreen = ({
  message,
  stats,
  wordCoverage,
  coverageComplete,
  rewards,
  onContinue,
  onSeeStats,
  levelName
}: VictoryScreenProps) => {
  const totalQuestions = stats.correct + stats.wrong;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Floating sparkles for "hebat" */}
        {message === 'hebat' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-accent/30"
                initial={{ opacity: 0, y: 20, x: Math.random() * 100 - 50 }}
                animate={{ opacity: [0, 0.6, 0], y: -60, rotate: 360 }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                style={{ left: `${15 + i * 14}%`, top: '60%' }}
              >
                <Star className="w-4 h-4" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="space-y-4"
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            message === 'hebat' ? 'bg-accent/20' : 'bg-main/10'
          }`}>
            {message === 'hebat' ? (
              <CheckCircle className="w-10 h-10 text-accent" />
            ) : (
              <Sparkles className="w-10 h-10 text-main" />
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}>
            {message === 'hebat' ? 'Kamu Hebat!' : 'Level Selesai!'}
          </h2>

          {!coverageComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-text-secondary bg-bg-surface-alt border border-border rounded-xl p-3"
            >
              Level belum sepenuhnya terselesaikan.{' '}
              <span className="text-main font-bold">Kunjungi halaman Kata</span> untuk melihat
              tipe soal mana yang masih perlu kamu jawab.
            </motion.p>
          )}

          {message === 'coba_lagi' && coverageComplete && (
            <p className="text-sm text-text-secondary">
              Coba lagi untuk mendapatkan hasil yang lebih baik!
            </p>
          )}
        </motion.div>

        {/* Stats */}
        <div className="kawaii-card p-4 space-y-3">
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
              <p className="text-2xl font-bold text-main">
                {totalQuestions > 0 ? stats.accuracy : 0}%
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">Akurasi</p>
            </div>
          </div>

          <button
            onClick={onSeeStats}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-main/30 text-main text-sm font-bold hover:bg-main/5 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Lihat Detail Jawaban
          </button>
        </div>

        {/* Rewards */}
        {rewards.length > 0 && (
          <div className="kawaii-card p-4 space-y-3">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-accent" />
              Hadiah
            </h3>
            <div className="space-y-2">
              {rewards.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    item.rarity === 'LEGENDARY'
                      ? 'border-accent/40 bg-accent/5'
                      : item.rarity === 'EPIC'
                      ? 'border-secondary/40 bg-secondary/5'
                      : item.rarity === 'RARE'
                      ? 'border-main/30 bg-main/5'
                      : 'border-border bg-bg-surface-alt'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-secondary">{item.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.rarity === 'LEGENDARY'
                      ? 'text-accent bg-accent/10'
                      : item.rarity === 'EPIC'
                      ? 'text-secondary bg-secondary/10'
                      : item.rarity === 'RARE'
                      ? 'text-main bg-main/10'
                      : 'text-text-secondary bg-bg-surface'
                  }`}>
                    {item.rarity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="kawaii-btn px-8 py-3 w-full"
        >
          Lanjut
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
