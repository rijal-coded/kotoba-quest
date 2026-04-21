import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Info, Zap, Target, Shield, Sword } from 'lucide-react';
import { Level, GameState, GameMode, Item, Page } from '../types';
import { HPBar } from '../components/UI';

interface BattleProps {
  level: Level;
  isEndless?: boolean;
  gameMode: GameMode;
  inventory: Item[];
  setInventory: Dispatch<SetStateAction<Item[]>>;
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
}

export const ExperimentalBattle = ({ level, isEndless, gameMode, inventory, setInventory, onFinish }: BattleProps) => {
  const [startTime] = useState(Date.now());
  const [gameState, setGameState] = useState<GameState>({
    playerHP: 100,
    maxPlayerHP: 100,
    enemyHP: 100,
    maxEnemyHP: 100,
    currentLevel: level,
    currentWordIndex: 0,
    score: 0,
    wordsBeaten: 0,
    enemiesBeaten: 0,
    inventory: inventory,
    equipped: { weapon: null, shield: null, accessory: null }
  });

  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | 'SHIELD' | null>(null);
  const [shake, setShake] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  
  // Experimental Features
  const [skillPoints, setSkillPoints] = useState(0); // 0 to 100
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [enemyCooldown, setEnemyCooldown] = useState(0); // 0 to 100

  // Simulate Enemy Attack Timer in Experimental Mode
  useEffect(() => {
    if (gameState.playerHP > 0 && gameState.enemyHP > 0 && !showVictory && !showDefeat) {
      const timer = setInterval(() => {
        setEnemyCooldown(prev => {
          if (prev >= 100) {
            // Enemy attacks automatically
            setShake(true);
            setTimeout(() => setShake(false), 500);
            
            setIsShieldActive(shield => {
              if (shield) {
                setFeedback('SHIELD');
                setTimeout(() => setFeedback(null), 600);
                return false; // Consume shield
              } else {
                setGameState(g => ({ ...g, playerHP: Math.max(0, g.playerHP - 20) }));
                return false;
              }
            });
            
            return 0; // reset cooldown
          }
          return prev + 5; // +5 every 500ms -> 100 in 10 seconds. Slower than previous iteration.
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [gameState.playerHP, gameState.enemyHP, showVictory, showDefeat]);


  const activeWords = useMemo(() => {
    return isEndless ? level.words : level.words.slice(0, level.unlockedWordCount);
  }, [level, isEndless]);

  const currentWord = useMemo(() => {
    if (isEndless) {
      return activeWords[Math.floor(Math.random() * activeWords.length)];
    }
    return activeWords[gameState.currentWordIndex % activeWords.length];
  }, [gameState.currentWordIndex, activeWords, isEndless]);

  const displayWord = gameMode === 'KANJI' && currentWord.kanji ? currentWord.kanji : currentWord.japanese;

  const options = useMemo(() => {
    const correct = currentWord.indonesian;
    const others = activeWords
      .filter(w => w.indonesian !== correct)
      .map(w => w.indonesian)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [currentWord, activeWords]);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentWord.indonesian;
    
    if (isCorrect) {
      setFeedback('CORRECT');
      const newEnemyHP = Math.max(0, gameState.enemyHP - 25);
      setSkillPoints(prev => Math.min(100, prev + 25)); // Gain SP on correct answer
      
      setGameState(prev => ({
        ...prev,
        enemyHP: newEnemyHP,
        wordsBeaten: prev.wordsBeaten + 1,
        score: prev.score + 100
      }));
    } else {
      setFeedback('WRONG');
      setShake(true);
      // No longer losing SP on wrong answer
      setGameState(prev => ({
        ...prev,
        playerHP: Math.max(0, prev.playerHP - 15) // small penalty for wrong answer
      }));
      setTimeout(() => setShake(false), 500);
    }

    setTimeout(() => {
      setFeedback(null);
      setGameState(prev => {
        let nextEnemyHP = prev.enemyHP;
        let nextEnemiesBeaten = prev.enemiesBeaten;
        let nextIndex = prev.currentWordIndex + 1;

        if (nextEnemyHP <= 0) {
          nextEnemyHP = 100;
          nextEnemiesBeaten += 1;
        }

        return {
          ...prev,
          enemyHP: nextEnemyHP,
          enemiesBeaten: nextEnemiesBeaten,
          currentWordIndex: nextIndex
        };
      });
    }, 600);
  };

  const useAttackSkill = () => {
    if (skillPoints >= 30 && gameState.enemyHP > 0) {
      setSkillPoints(prev => prev - 30);
      const newEnemyHP = Math.max(0, gameState.enemyHP - 40);
      setGameState(prev => ({ ...prev, enemyHP: newEnemyHP }));
    }
  };

  const useDefendSkill = () => {
    if (skillPoints >= 20 && !isShieldActive) {
      setSkillPoints(prev => prev - 20);
      setIsShieldActive(true);
    }
  };

  useEffect(() => {
    if (gameState.playerHP <= 0 && !showDefeat) {
      setShowDefeat(true);
    }
  }, [gameState.playerHP, showDefeat]);

  useEffect(() => {
    if (!isEndless && gameState.enemyHP <= 0 && gameState.currentWordIndex >= activeWords.length && !showVictory) {
      setShowVictory(true);
    }
  }, [gameState.enemyHP, gameState.currentWordIndex, isEndless, activeWords.length, showVictory]);

  const handleFinish = (victory: boolean) => {
    onFinish(victory, Math.floor((Date.now() - startTime) / 1000));
  };

  if (showVictory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-green uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          EXPERIMENTAL CLEAR
        </h2>
        <button onClick={() => handleFinish(true)} className="px-12 py-4 bg-neon-green text-dark-bg font-black uppercase tracking-widest">
          Lanjut
        </button>
      </div>
    );
  }

  if (showDefeat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-pink uppercase tracking-widest drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">FAILED</h2>
        <button onClick={() => handleFinish(false)} className="px-12 py-4 border-2 border-neon-pink text-neon-pink font-black uppercase">Kembali</button>
      </div>
    );
  }

  return (
    <div className={`transition-transform max-w-md mx-auto flex flex-col md:block ${shake ? 'animate-shake' : ''}`}>
      {/* Enemy Section (Sticky Mobile, Static Desktop) */}
      <div className="sticky md:static top-0 z-30 bg-dark-bg/95 md:bg-transparent backdrop-blur-md pt-4 pb-2 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:shadow-none border-b border-white/5 md:border-none">
        <div className="flex items-center gap-4">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-1">
               <h3 className="text-sm font-black uppercase text-red-400 leading-none">TEST-SAMURAI</h3>
               <span className="text-[10px] text-white/50 font-mono">{gameState.enemyHP} / {gameState.maxEnemyHP} HP</span>
             </div>
             <div className="h-2 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
               <motion.div 
                 className="absolute top-0 left-0 bottom-0 bg-neon-green" 
                 animate={{ width: `${Math.max(0, Math.min(100, (gameState.enemyHP/gameState.maxEnemyHP)*100))}%`}} 
                 transition={{duration: 0.3}} 
               />
             </div>
           </div>
           
           <div className="w-24">
             <div className="text-[10px] font-bold text-red-500 uppercase flex items-center justify-end gap-1 mb-1 leading-none">
               <Target className="w-3 h-3 block"/> Intent
             </div>
             <div className="h-2 w-full bg-dark-surface border border-red-500/30 overflow-hidden relative">
               <div className="absolute top-0 left-0 bottom-0 bg-red-500 transition-all duration-500" style={{width: `${enemyCooldown}%`}} />
             </div>
           </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3 flex-1">
        {/* Battle Visual */}
        <div className="h-24 sm:h-32 bg-dark-surface border border-white/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-neon-blue)_0%,_transparent_70%)]" />
          <Swords className={`w-12 h-12 sm:w-16 sm:h-16 ${feedback === 'WRONG' ? 'text-red-500' : 'text-white'} transition-colors blur-[0.5px]`} />
          
          {isShieldActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 border-2 border-neon-cyan opacity-50 bg-neon-cyan/10" 
            />
          )}
          
          <AnimatePresence>
            {feedback === 'SHIELD' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center font-black text-2xl uppercase tracking-tighter text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              >
                BLOCKED!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question Box */}
        <div className="bg-neon-blue p-3 text-center border-2 border-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-widest leading-none">
            {displayWord}
          </h2>
        </div>

        {/* Answer Grid */}
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null && feedback !== 'SHIELD'}
              className="block-button border-neon-cyan/40 text-[11px] sm:text-xs py-3 disabled:opacity-50 tracking-widest leading-tight"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Player Section (Sticky Mobile, Static Desktop) */}
      <div className="sticky md:static bottom-[72px] md:bottom-auto z-30 bg-dark-bg/95 md:bg-transparent backdrop-blur-md pt-2 pb-4 md:pb-0 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:shadow-none border-t border-white/5 md:border-none">
        <div className="space-y-3">
           {/* Player HP */}
           <div className="flex-1">
             <div className="flex justify-between items-end mb-1">
               <h3 className="text-xs font-black uppercase text-neon-blue leading-none">PLAYER HP</h3>
               <span className="text-[10px] text-white/50 font-mono">{gameState.playerHP} / {gameState.maxPlayerHP}</span>
             </div>
             <div className="h-2 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
               <motion.div 
                 className="absolute top-0 left-0 bottom-0 bg-neon-blue" 
                 animate={{ width: `${Math.max(0, Math.min(100, (gameState.playerHP/gameState.maxPlayerHP)*100))}%`}} 
                 transition={{duration: 0.3}} 
               />
             </div>
           </div>

           {/* Player SP & Skills */}
           <div className="bg-dark-surface/50 md:bg-dark-surface p-2 sm:p-3 border border-white/10">
             <div className="flex justify-between items-end mb-1">
               <h4 className="text-[10px] sm:text-xs font-bold text-neon-cyan tracking-widest uppercase flex items-center gap-1 leading-none">
                 <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> SP
               </h4>
               <span className="text-sm font-mono text-neon-cyan leading-none">{skillPoints}</span>
             </div>
             
             <div className="h-1.5 w-full bg-dark-bg border border-neon-cyan/30 overflow-hidden relative mb-2">
               <div className="absolute top-0 left-0 bottom-0 bg-neon-cyan transition-all duration-300" style={{width: `${skillPoints}%`}} />
             </div>

             <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={useAttackSkill}
                 disabled={skillPoints < 30 || gameState.enemyHP <= 0}
                 className="px-2 py-2 border border-red-500/50 bg-red-500/10 text-red-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 hover:bg-red-500/30"
               >
                 <Sword className="w-3 h-3" /> Slash <span className="opacity-50">30 SP</span>
               </button>
               <button 
                 onClick={useDefendSkill}
                 disabled={skillPoints < 20 || isShieldActive}
                 className="px-2 py-2 border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-[9px] sm:text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 hover:bg-neon-cyan/30"
               >
                 <Shield className="w-3 h-3" /> Guard <span className="opacity-50">20 SP</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
