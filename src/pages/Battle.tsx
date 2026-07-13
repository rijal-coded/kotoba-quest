import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, GameMode, Item, Page, QuestionItem, WordCoverage, QuestionType } from '../types';
import { useBattleEngine } from '../hooks/useBattleEngine';
import { EnemyPanel } from '../components/battle/EnemyPanel';
import { PlayerPanel } from '../components/battle/PlayerPanel';
import { QuestionCard } from '../components/battle/QuestionCard';
import { InventoryModal } from '../components/battle/InventoryModal';
import { VictoryScreen } from '../components/battle/VictoryScreen';
import { DefeatScreen } from '../components/battle/DefeatScreen';
import { BattleLayout } from '../components/battle/BattleLayout';

import { ParticleEffect } from '../components/battle/ParticleEffect';
import { WordReview } from '../components/battle/WordReview';
import { WordCard } from '../components/battle/WordCard';
import { buildQuestionQueue, buildQuestionConfig, generateQuestionConfig, ALL_QUESTION_TYPES } from '../utils/questionUtils';
import type { QuestionConfig } from '../utils/questionUtils';
import { generateEnemy, ProgressContext } from '../utils/enemyUtils';
import { Shield, Heart, Play, Pause } from 'lucide-react';
import { getLootDrop, LootContext } from '../utils/lootTables';

interface BattleProps {
  level: Level;
  isEndless?: boolean;
  gameMode: GameMode;
  inventory: Item[];
  completedLevels: number;
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page, currentInventory?: Item[], wordCoverage?: WordCoverage[]) => void;
  onMarkWordSeen: (levelId: string, wordIndex: number) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
  onConfirmNav?: () => void;
  onNavigate?: (page: Page) => void;
}

const BOSS_LEAD_UP = 6;

export const Battle = ({ level, isEndless, gameMode, inventory, completedLevels, onFinish, onMarkWordSeen, pendingNav, onCancelNav, onConfirmNav, onNavigate }: BattleProps) => {
  const [startTime] = useState(Date.now());
  const [showInventory, setShowInventory] = useState(false);
  const prevEnemiesBeatenRef = useRef(0);
  const battleStreakRef = useRef(0);
  const [showWave, setShowWave] = useState(false);
  const [waveId, setWaveId] = useState(0);
  const handleWaveDismiss = useCallback(() => setShowWave(false), []);
  const questionStartTimeRef = useRef(Date.now());
  const [speedFeedback, setSpeedFeedback] = useState<'quick' | 'normal' | 'slow' | null>(null);

  const { state, actions } = useBattleEngine(level, isEndless, inventory, gameMode);
  const actionsRef = useRef(actions);
  useEffect(() => { actionsRef.current = actions; });

  // Queue management
  const [queue, setQueue] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordCoverage, setWordCoverage] = useState<WordCoverage[]>([]);
  const [bossActivated, setBossActivated] = useState(false);
  const [currentFaults, setCurrentFaults] = useState(0);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [liveQuestion, setLiveQuestion] = useState<{ wordIndex: number; config: QuestionConfig } | null>(null);

// Word review tracking
const [wordResults, setWordResults] = useState<{ wordIndex: number; questionType: QuestionType; correct: boolean }[]>([]);
const [showWordReview, setShowWordReview] = useState(false);

// Wave progress data (non-endless, non-tantangan)
const showWaveProgress = !isEndless && gameMode === 'BELAJAR' && queue.length > 0;
const currentWave = state.enemiesBeaten + 1;
const queueProgress = showWaveProgress ? currentIndex / queue.length : 0;
const isBossZone = showWaveProgress ? currentIndex >= queue.length - BOSS_LEAD_UP : false;

  // WordCard state for Belajar mode
  const [showWordCard, setShowWordCard] = useState(false);
  const seenThisBattleRef = useRef<Set<number>>(new Set());

  const activeWords = useMemo(() => level.words.slice(0, level.unlockedWordCount), [level]);

  // Build queue on mount (non-endless only)
  useEffect(() => {
    if (queue.length > 0 || isEndless || gameMode === 'LATIHAN') return;
    const newQueue = buildQuestionQueue(level.words, level.unlockedWordCount);
    setQueue(newQueue);
    setWordCoverage(level.words.map((_, i) => ({
      wordIndex: i,
      coveredQuestions: [],
      correct: true,
    })));
  }, [level, isEndless, gameMode]);

  // Current question
  const currentItem = queue[currentIndex] || null;
  const currentWord = currentItem ? level.words[currentItem.wordIndex] || null : null;

  // Synchronously determine if WordCard should block question rendering
  const needsWordCard = gameMode === 'BELAJAR' && !isEndless && currentItem
    && !seenThisBattleRef.current.has(currentItem.wordIndex)
    && !level.seenWordIndices?.includes(currentItem.wordIndex)
    && !showWave;

  // Check for boss activation (when approaching queue end)
  useEffect(() => {
    if (bossActivated || currentIndex < queue.length - BOSS_LEAD_UP) return;
    if (queue.length === 0) return;
    setBossActivated(true);
    actionsRef.current.setBoss(true);
  }, [currentIndex, queue.length, bossActivated]);

// WordCard for Belajar mode
useEffect(() => {
  if (gameMode !== 'BELAJAR' || isEndless || !currentItem) return;
  if (seenThisBattleRef.current.has(currentItem.wordIndex)) return;
  if (level.seenWordIndices?.includes(currentItem.wordIndex)) return;
  if (showWave) return;
  setShowWordCard(true);
  actionsRef.current.setPaused(true);
}, [currentItem?.wordIndex, gameMode, isEndless, showWave, level.seenWordIndices]);

  const handleWordCardClose = useCallback(() => {
    if (!currentItem) return;
    setShowWordCard(false);
    actions.setPaused(false);
    seenThisBattleRef.current.add(currentItem.wordIndex);
    onMarkWordSeen(level.id, currentItem.wordIndex);
  }, [currentItem, level.id, onMarkWordSeen, actions]);

  const generateNextLatihanQuestion = useCallback(() => {
    if (activeWords.length === 0) return;
    const wordIndex = Math.floor(Math.random() * activeWords.length);
    const word = activeWords[wordIndex];
    const config = generateQuestionConfig(word, activeWords);
    setLiveQuestion({ wordIndex, config });
  }, [activeWords]);

  // Generate question for LATIHAN mode (on mount or after retry)
  useEffect(() => {
    if (gameMode !== 'LATIHAN') {
      setLiveQuestion(null);
      return;
    }
    if (activeWords.length > 0 && !liveQuestion) {
      generateNextLatihanQuestion();
    }
  }, [gameMode, activeWords.length, liveQuestion, generateNextLatihanQuestion]);

  // Question config
  const questionConfig = useMemo(() => {
    if (!currentItem || !currentWord) return null;
    return buildQuestionConfig(currentWord, activeWords, currentItem.questionType, currentItem.answerType);
  }, [currentItem, currentWord, activeWords]);

  // Particle state
  const [particleEffect, setParticleEffect] = useState<{ type: 'correct' | 'skill' | 'enemyAttack' | 'guard' | 'item' | 'victory' | 'defeat' } | null>(null);

  // Heal popup
  const [healPopup, setHealPopup] = useState<{ amount: number } | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
  const blockingUI = state.showVictory || state.showDefeat || showWordReview || showWordCard || showInventory || showWave;
  if (blockingUI) return;
  switch (e.key.toLowerCase()) {
  case 'z':
    handleAttackSkill();
    break;
  case 'n':
    handleDefendSkill();
    break;
  case 'i':
    setShowInventory(prev => !prev);
    break;
  case 'p':
  case 'escape':
    actions.setPaused(!state.isPaused);
    break;
  }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
}, [state.showVictory, state.showDefeat, showWordReview, showWordCard, showInventory, state.isPaused, actions]);

  // Trigger particles on feedback
  useEffect(() => {
    if (state.feedback === 'CORRECT') {
      setParticleEffect({ type: 'correct' });
      const timer = setTimeout(() => setParticleEffect(null), 500);
      return () => clearTimeout(timer);
    }
  }, [state.feedback]);

  useEffect(() => {
    if (state.enemiesBeaten > prevEnemiesBeatenRef.current && state.enemiesBeaten > 0) {
      setWaveId(id => id + 1);
      setShowWave(true);
    }
    prevEnemiesBeatenRef.current = state.enemiesBeaten;
  }, [state.enemiesBeaten]);

  const prevShakeRef = useRef(false);
  useEffect(() => {
    if (state.shake && !prevShakeRef.current && state.feedback !== 'WRONG') {
      setParticleEffect({ type: 'enemyAttack' });
      const timer = setTimeout(() => setParticleEffect(null), 500);
      return () => clearTimeout(timer);
    }
    prevShakeRef.current = state.shake;
  }, [state.shake, state.feedback]);

  useEffect(() => {
    if (state.feedback === 'SHIELD') {
      setParticleEffect({ type: 'guard' });
      const timer = setTimeout(() => setParticleEffect(null), 500);
      return () => clearTimeout(timer);
    }
  }, [state.feedback]);

  const handleAnswer = (isCorrect: boolean, option: string) => {
    // Determine word index based on mode
    const wordIndex = gameMode === 'LATIHAN' ? liveQuestion?.wordIndex : currentItem?.wordIndex;
    if (wordIndex === undefined) return;

    // Compute speed multiplier (Belajar mode only)
    const elapsed = (Date.now() - questionStartTimeRef.current) / 1000;
    let speedMulti = 1;
    let feedback: 'quick' | 'normal' | 'slow' = 'normal';
    if (gameMode === 'BELAJAR') {
      if (elapsed < 4) {
        speedMulti = 1.5;
        feedback = 'quick';
      } else if (elapsed > 8) {
        speedMulti = 0.75;
        feedback = 'slow';
      } else {
        feedback = 'normal';
      }
      setSpeedFeedback(feedback);
      setTimeout(() => setSpeedFeedback(null), 800);
    }

    onMarkWordSeen(level.id, wordIndex);

    const qType = gameMode === 'LATIHAN' ? liveQuestion!.config.questionType : currentItem!.questionType;

    // Track result
    setWordResults(prev => [...prev, { wordIndex, questionType: qType, correct: isCorrect }]);

    // Update coverage (Belajar mode only, LATIHAN is survival-based)
    if (gameMode === 'BELAJAR') {
      setWordCoverage(prev => prev.map(wc => {
        if (wc.wordIndex !== wordIndex) return wc;
        return {
          ...wc,
          coveredQuestions: [...new Set([...wc.coveredQuestions, qType])],
          correct: isCorrect ? wc.correct : false,
        };
      }));
    }

    if (isCorrect) {
      actions.answerWord(true, speedMulti, 0);
      setCurrentFaults(0);
      setWrongOptions([]);
      setTimeout(() => {
        if (gameMode === 'LATIHAN') {
          generateNextLatihanQuestion();
        } else {
          setCurrentIndex(prev => prev + 1);
        }
        questionStartTimeRef.current = Date.now();
      }, 600);
    } else {
      setWrongOptions(prev => prev.includes(option) ? prev : [...prev, option]);
      const nextFaults = currentFaults + 1;
      setCurrentFaults(nextFaults);
      actions.answerWord(false, 1, nextFaults);
      if (nextFaults >= 3) {
        setTimeout(() => {
          setCurrentFaults(0);
          setWrongOptions([]);
          if (gameMode === 'LATIHAN') {
            generateNextLatihanQuestion();
          } else {
            setCurrentIndex(prev => prev + 1);
          }
          questionStartTimeRef.current = Date.now();
        }, 1200);
      }
    }
  };

  const handleFinish = (victory: boolean) => {
    const navigateTo = 'LEVEL_SELECT';
    onFinish(
      victory,
      Math.floor((Date.now() - startTime) / 1000),
      victory ? earnedRewards : undefined,
      state.score,
      state.enemiesBeaten,
      state.wordsBeaten,
      navigateTo,
      state.inventory,
      wordCoverage
    );
  };

  const handleRetry = () => {
    actions.resetBattle(level, inventory);
    setQueue([]);
    setCurrentIndex(0);
    setWordCoverage([]);
    setWordResults([]);
    setShowWordReview(false);
    setShowWave(false);
    setWaveId(0);
    setBossActivated(false);
    setSpeedFeedback(null);
    setShowWordCard(false);
    setParticleEffect(null);
    setHealPopup(null);
    setCurrentFaults(0);
    setWrongOptions([]);
    setLiveQuestion(null);
    prevEnemiesBeatenRef.current = 0;
    battleStreakRef.current = 0;
    questionStartTimeRef.current = Date.now();
    seenThisBattleRef.current = new Set();
  };

  const handleUseItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      if (state.playerHP >= state.maxPlayerHP) return;
      actions.healPlayer(item.hpBonus ?? 50);
      actions.consumeItem(item.id);
      setParticleEffect({ type: 'item' });
      setTimeout(() => setParticleEffect(null), 500);
      setHealPopup({ amount: item.hpBonus ?? 50 });
      setTimeout(() => setHealPopup(null), 1200);
    }
  };

  const handleAttackSkill = () => {
    actions.useAttackSkill();
    setParticleEffect({ type: 'skill' });
    setTimeout(() => setParticleEffect(null), 800);
  };

  const handleDefendSkill = () => {
    actions.useDefendSkill();
    setParticleEffect({ type: 'guard' });
    setTimeout(() => setParticleEffect(null), 600);
  };

  // Deduplicated word results (any correct attempt = word correct, track wrong attempts)
  const deduplicatedWordResults = useMemo(() => {
    const byWord = new Map<number, { correct: boolean; wrongAttempts: number }>();
    for (const r of wordResults) {
      const existing = byWord.get(r.wordIndex);
      if (!existing) {
        byWord.set(r.wordIndex, { correct: r.correct, wrongAttempts: r.correct ? 0 : 1 });
      } else {
        if (r.correct) existing.correct = true;
        else existing.wrongAttempts += 1;
      }
    }
    return [...byWord.entries()].map(([wordIndex, data]) => ({
      word: level.words[wordIndex],
      correct: data.correct,
      wrongAttempts: data.wrongAttempts,
    }));
  }, [wordResults, level.words]);

  // Aggregated stats derived from deduplicated results
  const aggregatedStats = useMemo(() => {
    const correct = deduplicatedWordResults.filter(r => r.correct).length;
    const wrong = deduplicatedWordResults.reduce((sum, r) => sum + r.wrongAttempts, 0);
    const total = correct + wrong;
    return { correct, wrong, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
  }, [deduplicatedWordResults]);

  const accuracy = aggregatedStats.accuracy;
  const coverageComplete = wordCoverage.length > 0
    ? wordCoverage.every(wc => {
        const word = level.words[wc.wordIndex];
        const requiredTypes = (word?.kanji && !word?.kanjiInfoOnly) ? 3 : 2;
        return wc.coveredQuestions.length >= requiredTypes;
      })
    : false;
  const victoryMessage: 'hebat' | 'coba_lagi' | 'not_complete' = state.showVictory
    ? accuracy >= 90 && coverageComplete ? 'hebat' : !coverageComplete ? 'not_complete' : 'coba_lagi'
    : 'coba_lagi';

  // Reward loot system (3-layer gating)
  const earnedRewards = useMemo<Item[]>(() => {
    if (!state.showVictory) return [];
    const isBossKill = state.isBossActive || bossActivated;
  const ctx: LootContext = {
    enemiesBeaten: state.enemiesBeaten,
    accuracy,
    isBossKill: isBossKill,
    battleStreak: battleStreakRef.current,
    completedLevels,
  };
  return getLootDrop(ctx);
}, [state.showVictory, state.enemiesBeaten, state.isBossActive, accuracy, completedLevels]);

  useEffect(() => {
    if (state.enemiesBeaten > prevEnemiesBeatenRef.current) {
      battleStreakRef.current = 0;
    }
    if (state.showVictory) {
      battleStreakRef.current += 1;
    }
  }, [state.enemiesBeaten, state.showVictory]);

  // Victory screen
  if (state.showVictory && !showWordReview) {
    return (
      <VictoryScreen
        message={victoryMessage}
        stats={{ correct: aggregatedStats.correct, wrong: aggregatedStats.wrong, accuracy }}
        wordCoverage={wordCoverage}
        coverageComplete={coverageComplete}
        rewards={earnedRewards}
        levelName={level.name}
        onContinue={() => handleFinish(true)}
        onSeeStats={() => {
          if (wordResults.length > 0) {
            setShowWordReview(true);
          }
        }}
      />
    );
  }

  // Word review
  if (showWordReview && !isEndless) {
    return (
      <WordReview
        items={deduplicatedWordResults}
        score={state.score}
        onBack={() => setShowWordReview(false)}
      />
    );
  }

  // Defeat screen
  if (state.showDefeat) {
    return (
      <DefeatScreen
        stats={{ correct: aggregatedStats.correct, wrong: aggregatedStats.wrong, accuracy }}
        onRetry={handleRetry}
        onContinue={() => handleFinish(false)}
        onSeeStats={() => {
          if (wordResults.length > 0) {
            setShowWordReview(true);
          }
        }}
      />
    );
  }

  // Loading state while queue builds
  if (queue.length === 0 && !isEndless && gameMode === 'BELAJAR') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-text-secondary">Mempersiapkan pertanyaan...</p>
      </div>
    );
  }

  // Loading for LATIHAN mode before first question is generated
  if (gameMode === 'LATIHAN' && !liveQuestion && activeWords.length > 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-text-secondary">Mempersiapkan pertanyaan...</p>
      </div>
    );
  }

  return (
    <div className="bg-ambient min-h-full pb-24 md:pb-0">
      <div className="orb orb--mint" />
      <div className="orb orb--lavender" />
      <div className="orb orb--pink" />


      {/* Shield indicator */}
      {state.isShieldActive && (
        <div className="fixed top-[73px] right-4 md:right-28 z-40 px-3 py-1.5 rounded-full border border-main/50 bg-main/10 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-main" />
            <span className="text-[10px] font-bold text-main uppercase tracking-wider">SHIELD</span>
          </div>
        </div>
      )}

      {particleEffect && (
        <ParticleEffect active={true} type={particleEffect.type} />
      )}

      <AnimatePresence>
        {healPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            style={{ bottom: '40%' }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-lg font-mono font-bold text-accent">+{healPopup.amount} HP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {speedFeedback && speedFeedback !== 'normal' && state.feedback === 'CORRECT' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            style={{ bottom: '40%' }}
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
              speedFeedback === 'quick'
                ? 'bg-accent/20 border-accent/40'
                : 'bg-text-secondary/10 border-border'
            }`}>
              <span className={`text-lg font-mono font-bold ${
                speedFeedback === 'quick' ? 'text-accent' : 'text-text-secondary'
              }`}>
                {speedFeedback === 'quick' ? '⚡ Cepat +1.5×' : '🐌 Lambat +0.75×'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shield flash overlay — mobile only */}
      <AnimatePresence>
        {state.feedback === 'SHIELD' && (
          <motion.div
            key="shield-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center md:hidden pointer-events-none"
          >
            <div className="absolute inset-0 bg-main/15" />
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-5xl font-bold text-main z-10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Blocked!
            </motion.span>
          </motion.div>
        )}
</AnimatePresence>

{/* Pause overlay */}
{state.isPaused && !state.showVictory && !state.showDefeat && !showWordReview && !showWordCard && !showInventory && (
  <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm">
    <div className="space-y-6 text-center">
      <div className="text-5xl font-bold text-white animate-pulse">PAUSED</div>
      <div className="flex space-x-4">
        <button
          onClick={() => actions.setPaused(false)}
          className="px-6 py-3 rounded-xl bg-main/80 text-white hover:bg-main/90 transition-colors"
        >
          RESUME
        </button>
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('LEVEL_SELECT');
            }
          }}
          className="px-6 py-3 rounded-xl bg-main/80 text-white hover:bg-main/90 transition-colors"
        >
          EXIT
        </button>
      </div>
    </div>
  </div>
)}

<BattleLayout
        leftPanel={
          <EnemyPanel
            enemy={state.currentEnemy}
            currentHP={state.enemyHP}
            cooldownPercentage={state.enemyCooldown}
            waveAnnouncement={showWave ? {
              waveId,
              wave: state.enemiesBeaten,
              enemyName: state.currentEnemy.name,
              enemyRank: state.currentEnemy.rank,
              enemyTier: state.currentEnemy.tier,
              isBoss: state.isBossActive || bossActivated,
            } : null}
            onWaveDismiss={handleWaveDismiss}
          />
        }
        centerPanel={
          gameMode === 'LATIHAN' && liveQuestion ? (
            <QuestionCard
              questionText={liveQuestion.config.questionText}
              currentWord={activeWords[liveQuestion.wordIndex]}
              options={liveQuestion.config.options}
              correctAnswer={liveQuestion.config.correctAnswer}
              answerType={liveQuestion.config.answerType}
              feedback={state.feedback}
              isShieldActive={state.isShieldActive}
              onAnswer={handleAnswer}
              onOpenInventory={() => setShowInventory(true)}
              gameMode={gameMode}
              actionPoints={state.actionPoints}
              enemyHP={state.enemyHP}
              onUseAttack={handleAttackSkill}
              onUseDefend={handleDefendSkill}
              wrongOptions={wrongOptions}
              currentFaults={currentFaults}
              maxFaults={3}
            />
          ) : currentItem && questionConfig && !needsWordCard ? (
            <QuestionCard
              questionText={questionConfig.questionText}
              currentWord={currentWord!}
              options={questionConfig.options}
              correctAnswer={questionConfig.correctAnswer}
              answerType={questionConfig.answerType}
              feedback={state.feedback}
              isShieldActive={state.isShieldActive}
              onAnswer={handleAnswer}
              onOpenInventory={() => setShowInventory(true)}
              gameMode={gameMode}
              actionPoints={state.actionPoints}
              enemyHP={state.enemyHP}
              onUseAttack={handleAttackSkill}
              onUseDefend={handleDefendSkill}
              progress={showWaveProgress
                ? { currentWave, queueProgress, isBossZone, totalQuestions: queue.length, currentQuestion: currentIndex + 1 }
                : undefined
              }
              wrongOptions={wrongOptions}
              currentFaults={currentFaults}
              maxFaults={3}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-text-secondary text-center">
                Semua pertanyaan telah dijawab. Kalahkan bos untuk menyelesaikan level!
              </p>
            </div>
          )
        }
        rightPanel={
          <PlayerPanel
            hp={state.playerHP}
            maxHp={state.maxPlayerHP}
            actionPoints={state.actionPoints}
            enemyHP={state.enemyHP}
            isShieldActive={state.isShieldActive}
            onUseAttack={handleAttackSkill}
            onUseDefend={handleDefendSkill}
          />
        }
        shake={state.shake}
      />

{/* Mobile HUD HP pill and pause button — bottom-right */}
<div className="fixed bottom-[calc(100px+env(safe-area-inset-bottom,0px))] right-4 z-40 md:hidden flex items-center gap-2">
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface/90 backdrop-blur-sm border border-border shadow-lg">
    <Heart className="w-3.5 h-3.5 text-danger" />
    <motion.span
      key={state.playerHP}
      initial={{ scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className="text-xs font-mono font-bold text-text-primary"
    >
      {state.playerHP}/{state.maxPlayerHP}
    </motion.span>
  </div>
  <button
    onClick={() => actions.setPaused(!state.isPaused)}
    className="p-2 rounded-full hover:bg-main/20 transition-colors"
    aria-label={state.isPaused ? 'Resume Game' : 'Pause Game'}
  >
    {state.isPaused ? (
      <Play className="w-5 h-5 text-main" />
    ) : (
      <Pause className="w-5 h-5 text-main" />
    )}
  </button>
</div>

      <InventoryModal
        isOpen={showInventory}
        inventory={state.inventory}
        onClose={() => setShowInventory(false)}
        onUseItem={handleUseItem}
      />

      <AnimatePresence>
        {showWordCard && currentWord && (
          <WordCard word={currentWord} onClose={handleWordCardClose} />
        )}
      </AnimatePresence>

      {pendingNav && (
        <ExitConfirmationModal
          targetPage={pendingNav}
          onConfirm={() => { if (onConfirmNav) onConfirmNav(); }}
          onCancel={() => { if (onCancelNav) onCancelNav(); }}
        />
      )}
    </div>
  );
};

interface ExitConfirmationModalProps {
  targetPage: Page;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitConfirmationModal = ({ targetPage, onConfirm, onCancel }: ExitConfirmationModalProps) => {
  const pageNames: Record<Page, string> = {
  HOME: 'Beranda',
  MODE_SELECT: 'Pemilihan Mode',
  LEVEL_SELECT: 'Pemilihan Level',
  BATTLE: 'Pertempuran',
  INVENTORY: 'Inventori',
  ABOUT: 'Tentang',
  WORDS: 'Kata',
  FORGE: 'Tempa',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="kawaii-modal-backdrop flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="kawaii-modal text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-main/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-main"
            style={{ fontFamily: 'var(--font-display)' }}>
            Konfirmasi Keluar
          </h3>

          <p className="text-text-secondary text-sm">
            Jika keluar sekarang, progres akan <span className="text-main font-bold">tidak tersimpan</span>.
            <br /><br />
            Yakin ingin keluar ke <span className="text-accent font-bold">{pageNames[targetPage]}</span>?
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="kawaii-btn-outline flex-1 px-4 py-3"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="kawaii-btn flex-1 px-4 py-3"
            >
              Keluar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
