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
          className="text-center text-text-secondary space-y-1"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-main">
            Artinya: {currentWord.indonesian}
          </p>
          <p className="text-xs text-text-secondary/80">
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
  <div className="battle-visual">
    <div className="battle-visual-bg" />
    <Swords className={`battle-sword ${feedback === 'WRONG' ? 'text-red-500' : 'text-white'}`} />

    <div className="battle-visual-action">
      <button onClick={onOpenInventory} className="battle-inventory-btn">
        <Briefcase className="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </div>

    <div className="battle-visual-strength">
      STR: {enemyStrength.toLocaleString()}
    </div>

    {isShieldActive && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="shield-overlay"
      />
    )}

    <AnimatePresence>
      {feedback === 'SHIELD' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="blocked-text"
        >
          BLOCKED!
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const QuestionBox = ({ displayWord }: { displayWord: string }) => (
  <div className="question-box">
    <h2 className="question-text">{displayWord}</h2>
  </div>
);

interface AnswerGridProps {
  options: string[];
  currentWord: Word;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  onAnswer: (isCorrect: boolean) => void;
}

const AnswerGrid = ({ options, currentWord, feedback, onAnswer }: AnswerGridProps) => (
  <div className="answer-grid">
    {options.map((opt, i) => (
      <button
        key={i}
        onClick={() => onAnswer(opt === currentWord.indonesian)}
        disabled={feedback !== null && feedback !== 'SHIELD'}
        className="block-button answer-btn disabled:opacity-50"
      >
        {opt}
      </button>
    ))}
  </div>
);
