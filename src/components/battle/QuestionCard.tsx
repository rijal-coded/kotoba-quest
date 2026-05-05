import { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Briefcase } from 'lucide-react';
import { Word, GameMode } from '../../types';
import { shuffleArray } from '../../utils/arrayUtils';

interface QuestionCardProps {
  displayWord: string;
  currentWord: Word;
  activeWords: Word[];
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  isShieldActive: boolean;
  enemyStrength: number;
  onAnswer: (isCorrect: boolean) => void;
  onOpenInventory: () => void;
  gameMode: GameMode;
}

export const QuestionCard = memo(({
  displayWord,
  currentWord,
  activeWords,
  feedback,
  isShieldActive,
  enemyStrength,
  onAnswer,
  onOpenInventory,
  gameMode
}: QuestionCardProps) => {

  const options = useMemo(() => {
    const correct = currentWord.indonesian;
    const others = shuffleArray(
      activeWords
        .filter(w => w.indonesian !== correct)
        .map(w => w.indonesian)
    ).slice(0, 3);
    return shuffleArray([correct, ...others]);
  }, [currentWord, activeWords]);

  return (
    <div className="battle-area px-4 py-3 space-y-4 flex-1 md:col-span-8 lg:col-span-8 md:space-y-6 md:p-0">
      <BattleVisual
        feedback={feedback}
        isShieldActive={isShieldActive}
        enemyStrength={enemyStrength}
        onOpenInventory={onOpenInventory}
      />

      <QuestionBox displayWord={displayWord} />

      {/* Learning mode hint: show translation and romaji */}
      {gameMode === 'LEARNING' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-text-secondary space-y-1"
        >
          <p className="text-sm md:text-base font-bold uppercase tracking-wider text-main">
            Artinya: {currentWord.indonesian}
          </p>
          <p className="text-xs md:text-sm text-text-secondary/80">
            {currentWord.romaji}
          </p>
        </motion.div>
      )}

      <AnswerGrid
        options={options}
        currentWord={currentWord}
        feedback={feedback}
        onAnswer={onAnswer}
      />

      <div className="h-56 md:hidden" />
    </div>
  );
});

interface BattleVisualProps {
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  isShieldActive: boolean;
  enemyStrength: number;
  onOpenInventory: () => void;
}

const BattleVisual = ({ feedback, isShieldActive, enemyStrength, onOpenInventory }: BattleVisualProps) => (
  <div className="battle-visual relative h-40 md:h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-bg-surface/30 to-bg-surface/10 border border-main/10">
    {/* Background grid pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--main) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}
    />

    <Swords className={`battle-sword absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 transition-all duration-300 ${
      feedback === 'WRONG' ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'text-main drop-shadow-[0_0_20px_rgba(0,156,255,0.6)]'
    }`} />

    {/* Inventory Button */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onOpenInventory}
      className="battle-inventory-btn absolute top-2 right-2 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-bg-surface/80 border border-main/30 text-main flex items-center justify-center hover:bg-main/20 hover:border-main/50 transition-all"
    >
      <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
    </motion.button>

    {/* Enemy Strength Display */}
    <div className="battle-visual-strength absolute top-2 left-2 px-3 py-1 bg-bg-surface/90 border border-main/10 rounded-lg">
      <span className="text-xs md:text-sm font-mono font-bold text-main">
        STR: <span className="text-base md:text-lg">{enemyStrength.toLocaleString()}</span>
      </span>
    </div>

    {/* Shield Effect */}
    {isShieldActive && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        className="absolute inset-0 bg-gradient-radial from-main/30 via-transparent to-transparent"
      />
    )}

    {/* Feedback Text */}
    <AnimatePresence>
      {feedback === 'SHIELD' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl md:text-5xl font-black text-main animate-pulse glow-cyan">BLOCKED!</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const QuestionBox = ({ displayWord }: { displayWord: string }) => (
  <div className="question-box relative overflow-hidden rounded-xl bg-bg-surface/50 border border-main/10 p-6 md:p-8 mb-4">
    {/* Decorative scan line */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="w-full h-1 bg-main/20"
        initial={{ y: 0 }}
        animate={{ y: '100%' }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>

    <h2 className="question-text text-3xl md:text-4xl lg:text-5xl font-black text-text-primary text-center tracking-tight leading-tight break-words relative z-10">
      {displayWord}
    </h2>
  </div>
);

interface AnswerGridProps {
  options: string[];
  currentWord: Word;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  onAnswer: (isCorrect: boolean) => void;
}

const AnswerGrid = ({ options, currentWord, feedback, onAnswer }: AnswerGridProps) => (
  <div className="answer-grid grid grid-cols-2 gap-3 md:gap-4">
    {options.map((opt, i) => (
      <motion.button
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        whileHover={feedback === null ? { scale: 1.02, y: -2 } : {}}
        whileTap={feedback === null ? { scale: 0.98 } : {}}
        onClick={() => onAnswer(opt === currentWord.indonesian)}
        disabled={feedback !== null && feedback !== 'SHIELD'}
        className="block-button relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-main/0 to-main/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10 text-sm md:text-base">{opt}</span>
      </motion.button>
    ))}
  </div>
);
