import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Briefcase, Sparkles, Check, X, Sword, Shield, Zap } from 'lucide-react';
import { Word, GameMode, AnswerType } from '../../types';

interface QuestionCardProps {
  questionText: string;
  currentWord: Word;
  options: string[];
  correctAnswer: string;
  answerType: AnswerType;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  isShieldActive: boolean;
  onAnswer: (isCorrect: boolean, option: string) => void;
  onOpenInventory: () => void;
  gameMode: GameMode;
  actionPoints: number;
  enemyHP: number;
  onUseAttack: () => void;
  onUseDefend: () => void;
  speedFeedback?: 'quick' | 'normal' | 'slow' | null;
  progress?: { currentWave: number; queueProgress: number; isBossZone: boolean; totalQuestions: number; currentQuestion: number } | null;
  wrongOptions?: string[];
  currentFaults?: number;
  maxFaults?: number;
}

const ANSWER_TYPE_LABELS: Record<AnswerType, string> = {
  kana: 'Kana',
  kanji: 'Kanji',
  indonesian: 'Arti',
};

export const QuestionCard = memo(({
  questionText,
  currentWord,
  options,
  correctAnswer,
  answerType,
  feedback,
  isShieldActive,
  onAnswer,
  onOpenInventory,
  gameMode,
  actionPoints,
  enemyHP,
  onUseAttack,
  onUseDefend,
  speedFeedback,
  progress,
  wrongOptions = [],
  currentFaults = 0,
  maxFaults = 3,
}: QuestionCardProps) => {
  const isFeedbackActive = feedback !== null && feedback !== 'SHIELD';

  return (
    <div className="px-4 py-3 space-y-4 flex-1 md:col-span-8 lg:col-span-8 md:space-y-6 md:p-0">
      {/* BattleVisual — desktop only */}
      <div className="hidden md:block">
        <BattleVisual
          feedback={feedback}
          isShieldActive={isShieldActive}
          onOpenInventory={onOpenInventory}
        />
      </div>

      {/* Wave progress bar */}
      {progress && (
        <div className="px-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${progress.isBossZone ? 'text-warning' : 'text-text-secondary'}`}>
              {progress.isBossZone ? 'Boss' : `Gelombang ${progress.currentWave}`}
            </span>
            <span className="text-[11px] font-mono font-bold text-text-secondary">
              {progress.currentQuestion}/{progress.totalQuestions}
            </span>
          </div>
          <div className="h-1.5 bg-bg-surface-alt rounded-full overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${progress.isBossZone ? 'bg-warning' : 'bg-main'}`}
              animate={{ width: `${progress.queueProgress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="kawaii-panel text-center p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionText}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-text-secondary mb-2 uppercase tracking-wider font-bold">
              Pilih jawaban yang benar
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight break-words"
              style={{ fontFamily: 'var(--font-display)' }}>
              {questionText}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile skill bar */}
      <div className="md:hidden">
        <MobileSkillBar
          actionPoints={actionPoints}
          enemyHP={enemyHP}
          isShieldActive={isShieldActive}
          feedback={feedback}
          onUseAttack={onUseAttack}
          onUseDefend={onUseDefend}
          onOpenInventory={onOpenInventory}
        />
      </div>

      {/* Speed feedback (Belajar mode only) */}
      <AnimatePresence>
        {speedFeedback && feedback === 'CORRECT' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            {speedFeedback === 'quick' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-sm font-bold text-accent">
                ⚡ Cepat +1.5×
              </span>
            )}
            {speedFeedback === 'slow' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text-secondary/10 border border-border text-sm font-bold text-text-secondary">
                🐌 Lambat +0.75×
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">
          {ANSWER_TYPE_LABELS[answerType]}
        </span>
      </div>

      {currentFaults > 0 && (
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Kesempatan</span>
          <div className="flex gap-1">
            {Array.from({ length: maxFaults }, (_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < currentFaults ? 'bg-danger' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <AnswerGrid
        options={options}
        correctAnswer={correctAnswer}
        feedback={feedback}
        wrongOptions={wrongOptions}
        onAnswer={onAnswer}
      />

    </div>
  );
});

interface BattleVisualProps {
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  isShieldActive: boolean;
  onOpenInventory: () => void;
}

const BattleVisual = ({ feedback, isShieldActive, onOpenInventory }: BattleVisualProps) => (
  <div className="relative h-24 md:h-48 mb-4 rounded-2xl overflow-hidden bg-bg-surface-alt border border-border">
    <div className="absolute top-3 left-3 opacity-30">
      <Sparkles className="w-4 h-4 text-main" />
    </div>
    <div className="absolute bottom-3 right-3 opacity-20">
      <Sparkles className="w-3 h-3 text-secondary" />
    </div>

    <Swords className={`hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 transition-all duration-300 ${
      feedback === 'WRONG' ? 'text-danger' : 'text-main/40'
    }`} />

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onOpenInventory}
      className="absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-main hover:border-main/30 transition-all"
    >
      <Briefcase className="w-5 h-5" />
    </motion.button>

    {isShieldActive && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        className="absolute inset-0 bg-main rounded-2xl"
      />
    )}

    <AnimatePresence>
      {feedback === 'SHIELD' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl md:text-5xl font-bold text-main animate-kawaii-bounce"
            style={{ fontFamily: 'var(--font-display)' }}>
            Blocked!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface AnswerGridProps {
  options: string[];
  correctAnswer: string;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  wrongOptions: string[];
  onAnswer: (isCorrect: boolean, option: string) => void;
}

const AnswerGrid = ({ options, correctAnswer, feedback, wrongOptions, onAnswer }: AnswerGridProps) => (
  <div className="grid grid-cols-2 gap-3 md:gap-4">
    {options.map((opt, i) => {
      const isCorrectAnswer = opt === correctAnswer;
      const isWrongAnswer = feedback === 'WRONG' && !isCorrectAnswer;
      const isEliminated = wrongOptions.includes(opt);

      let optionClass = 'kawaii-btn-answer disabled:opacity-40 disabled:cursor-not-allowed';
      if (isEliminated && feedback === null) {
        optionClass += ' opacity-30 line-through cursor-not-allowed';
      }
      if (feedback === 'WRONG') {
        if (isCorrectAnswer) {
          optionClass += ' ring-2 ring-accent bg-accent/10';
        } else {
          optionClass += ' opacity-40';
        }
      }
      if (feedback === 'CORRECT' && isCorrectAnswer) {
        optionClass += ' ring-2 ring-accent bg-accent/10';
      }

      return (
        <motion.button
          key={`${correctAnswer}-${i}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
          whileHover={feedback === null ? { y: -1 } : {}}
          whileTap={feedback === null ? { scale: 0.98 } : {}}
          onClick={() => onAnswer(opt === correctAnswer, opt)}
          disabled={(feedback !== null && feedback !== 'SHIELD') || isEliminated}
          className={optionClass}
        >
          <span className="flex items-center justify-center gap-2 text-sm md:text-base">
            {feedback === 'CORRECT' && isCorrectAnswer && <Check className="w-4 h-4 text-accent" />}
            {isWrongAnswer && <X className="w-4 h-4 text-danger" />}
            {isEliminated && feedback === null && <X className="w-3 h-3 text-danger" />}
            {opt}
          </span>
          {feedback === 'WRONG' && isCorrectAnswer && (
            <span className="block text-[10px] text-accent font-bold mt-0.5 uppercase tracking-wider">
              Jawaban benar
            </span>
          )}
        </motion.button>
      );
    })}
  </div>
);

// ─── Mobile Skill Bar ─────────────────────────────────────────
interface MobileSkillBarProps {
  actionPoints: number;
  enemyHP: number;
  isShieldActive: boolean;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  onUseAttack: () => void;
  onUseDefend: () => void;
  onOpenInventory: () => void;
}

const MobileSkillBar = ({
  actionPoints,
  enemyHP,
  isShieldActive,
  feedback,
  onUseAttack,
  onUseDefend,
  onOpenInventory,
}: MobileSkillBarProps) => {
  const isDisabled = feedback !== null && feedback !== 'SHIELD';

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center px-1.5 py-1 rounded-lg bg-bg-surface-alt border border-border">
        <span className="text-[9px] font-bold text-text-secondary uppercase">AP</span>
        <span className="text-sm font-mono font-bold text-text-primary">{actionPoints}/10</span>
      </div>
      <button
        onClick={onUseAttack}
        disabled={isDisabled || actionPoints < 3 || enemyHP <= 0}
        className="flex-1 max-w-[140px] flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border border-danger/30 text-danger font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-danger/5 active:scale-95"
      >
        <Sword className="w-4 h-4" />
        <span>Slash</span>
        <span className="text-[10px] font-mono opacity-60">3 AP</span>
      </button>
      <button
        onClick={onUseDefend}
        disabled={isDisabled || actionPoints < 2 || isShieldActive}
        className="flex-1 max-w-[140px] flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border border-main/30 text-main font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-main/5 active:scale-95"
      >
        <Shield className="w-4 h-4" />
        <span>Guard</span>
        <span className="text-[10px] font-mono opacity-60">2 AP</span>
      </button>
      <button
        onClick={onOpenInventory}
        disabled={isDisabled}
        className="w-12 h-12 flex items-center justify-center rounded-xl border border-border text-text-secondary font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-main/30 hover:text-main active:scale-95"
      >
        <Briefcase className="w-5 h-5" />
      </button>
    </div>
  );
};


