import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Info, Zap, Target, Shield, Sword, Briefcase } from 'lucide-react';
import { Level, GameState, GameMode, Item, Page } from '../types';
import { generateEnemy, EnemyTemplate } from '../utils/enemyUtils';

interface BattleProps {
  level: Level; // Single level for main game
  isEndless?: boolean;
  gameMode: GameMode;
  inventory: Item[];
  setInventory: Dispatch<SetStateAction<Item[]>>;
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
}

export const Battle = ({ level, isEndless, gameMode, inventory, setInventory, onFinish, pendingNav, onCancelNav }: BattleProps) => {
  const [startTime] = useState(Date.now());
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentEnemy, setCurrentEnemy] = useState<EnemyTemplate>(() => generateEnemy(0));

  const [gameState, setGameState] = useState<GameState>({
    playerHP: 100,
    maxPlayerHP: 100,
    enemyHP: currentEnemy.hp,
    maxEnemyHP: currentEnemy.maxHp,
    currentLevel: currentLevel,
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
  
  const [skillPoints, setSkillPoints] = useState(0); 
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [enemyCooldown, setEnemyCooldown] = useState(0); 
  const [showInventory, setShowInventory] = useState(false);

  // Sync level state
  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  // Enemy Attack Timer
  useEffect(() => {
    if (gameState.playerHP > 0 && gameState.enemyHP > 0 && !showVictory && !showDefeat && !showInventory) {
      const timer = setInterval(() => {
        setEnemyCooldown(prev => {
          if (prev >= 100) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            
            setIsShieldActive(shield => {
              if (shield) {
                setFeedback('SHIELD');
                setTimeout(() => setFeedback(null), 600);
                return false; 
              } else {
                setGameState(g => ({ ...g, playerHP: Math.max(0, g.playerHP - currentEnemy.damage) }));
                return false;
              }
            });
            
            return 0;
          }
          const speedModifier = 0.5 + (currentEnemy.tier * 0.2);
          return prev + (5 * speedModifier); 
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [gameState.playerHP, gameState.enemyHP, showVictory, showDefeat, showInventory, currentEnemy.damage, currentEnemy.tier]);

  const activeWords = useMemo(() => {
    return isEndless ? currentLevel.words : currentLevel.words.slice(0, currentLevel.unlockedWordCount);
  }, [currentLevel, isEndless]);

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
      const weaponBonus = gameState.equipped.weapon ? 10 : 0;
      const newEnemyHP = Math.max(0, gameState.enemyHP - (25 + weaponBonus));
      setSkillPoints(prev => Math.min(100, prev + 25)); 
      
      setGameState(prev => ({
        ...prev,
        enemyHP: newEnemyHP,
        wordsBeaten: prev.wordsBeaten + 1,
        score: prev.score + 100
      }));
    } else {
      setFeedback('WRONG');
      setShake(true);
      setGameState(prev => ({ ...prev, playerHP: Math.max(0, prev.playerHP - 10) }));
      setTimeout(() => setShake(false), 500);
    }

    setTimeout(() => {
      setFeedback(null);
      setGameState(prev => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1
      }));
    }, 600);
  };

  // Enemy Death and Progres logic
  useEffect(() => {
    if (gameState.enemyHP <= 0 && !showVictory && !showDefeat) {
      setGameState(prev => {
        const nextEnemiesBeaten = prev.enemiesBeaten + 1;
        
        // Check victory condition for main level
        if (!isEndless && prev.currentWordIndex >= activeWords.length) {
          setShowVictory(true);
          return prev;
        }

        const newlyGeneratedEnemy = generateEnemy(nextEnemiesBeaten);
        setCurrentEnemy(newlyGeneratedEnemy);

        return {
          ...prev,
          enemyHP: newlyGeneratedEnemy.hp,
          maxEnemyHP: newlyGeneratedEnemy.maxHp,
          enemiesBeaten: nextEnemiesBeaten,
        };
      });
    }
  }, [gameState.enemyHP, isEndless, activeWords.length, showVictory, showDefeat]);

  // Skill logic
  const useAttackSkill = () => {
    if (skillPoints >= 30 && gameState.enemyHP > 0) {
      setSkillPoints(prev => prev - 30);
      const newEnemyHP = Math.max(0, gameState.enemyHP - 40);
      setGameState(prev => ({ 
        ...prev, 
        enemyHP: newEnemyHP,
        currentWordIndex: newEnemyHP <= 0 ? prev.currentWordIndex + 1 : prev.currentWordIndex
      }));
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
    if (!isEndless && gameState.currentWordIndex >= activeWords.length && !showVictory) {
      setShowVictory(true);
    }
  }, [gameState.currentWordIndex, activeWords.length, isEndless, showVictory]);

  const handleFinish = (victory: boolean) => {
    onFinish(
      victory, 
      Math.floor((Date.now() - startTime) / 1000),
      victory ? [{ id: 'c1', name: 'KAPSUL PENINGKAT ADRENALIN', type: 'CONSUMABLE', description: 'Memulihkan 50 HP', rarity: 'COMMON', count: 1 }] : [],
      gameState.score,
      gameState.enemiesBeaten,
      gameState.wordsBeaten,
      'HOME'
    );
  };

  const useItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      setGameState(prev => ({
        ...prev,
        playerHP: Math.min(prev.maxPlayerHP, prev.playerHP + 50)
      }));
      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, count: (i.count || 1) - 1 } : i));
    }
  };

  if (showVictory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-green uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          LEVEL SELESAI
        </h2>
        <button onClick={() => handleFinish(true)} className="px-12 py-4 bg-neon-green text-dark-bg font-black uppercase tracking-widest hover:brightness-110">
          Lanjut
        </button>
      </div>
    );
  }

  if (showDefeat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-pink uppercase tracking-widest drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">GAGAL</h2>
        <button onClick={() => handleFinish(false)} className="px-12 py-4 border-2 border-neon-pink text-neon-pink font-black uppercase hover:bg-neon-pink/10">Kembali</button>
      </div>
    );
  }

  return (
    <div className={`transition-transform max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-12 md:gap-6 ${shake ? 'animate-shake' : ''} md:p-6 md:pt-0`}>
      {/* Enemy Section */}
      <div className="sticky md:static top-0 z-30 bg-dark-bg/95 md:bg-dark-surface/50 backdrop-blur-md pt-4 pb-2 px-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:shadow-none border-b border-white/5 md:border md:border-white/10 md:col-span-12 lg:col-span-12">
        <div className="flex items-center gap-4 max-w-md md:max-w-none mx-auto">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-1">
               <div className="flex items-center gap-2">
                 <h3 className={`text-sm md:text-lg font-black uppercase leading-none ${
                   currentEnemy.tier === 5 ? 'text-neon-pink' : 
                   currentEnemy.tier >= 4 ? 'text-neon-cyan' : 'text-red-400'
                 }`}>{currentEnemy.name}</h3>
                 <span className="text-[8px] md:text-xs font-bold px-1 bg-white/10 text-white/50 rounded">{currentEnemy.rank}</span>
               </div>
               <span className="text-[10px] md:text-sm text-white/50 font-mono">{gameState.enemyHP} / {currentEnemy.maxHp} HP</span>
             </div>
             <div className="h-2 md:h-3 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
               <motion.div 
                 className={`absolute top-0 left-0 bottom-0 ${currentEnemy.tier === 5 ? 'bg-neon-pink' : 'bg-neon-green'}`}
                 animate={{ width: `${Math.max(0, Math.min(100, (gameState.enemyHP / currentEnemy.maxHp) * 100))}%`}} 
                 transition={{duration: 0.3}} 
               />
             </div>
           </div>
           
           <div className="w-24 md:w-48">
             <div className="text-[10px] md:text-xs font-bold text-red-500 uppercase flex items-center justify-end gap-1 mb-1 leading-none">
               <Target className="w-3 h-3 md:w-4 md:h-4 block"/> Intent
             </div>
             <div className="h-2 md:h-3 w-full bg-dark-surface border border-red-500/30 overflow-hidden relative">
               <div className="absolute top-0 left-0 bottom-0 bg-red-500 transition-all duration-500" style={{width: `${enemyCooldown}%`}} />
             </div>
           </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="px-4 py-3 space-y-4 flex-1 md:col-span-8 lg:col-span-8 md:space-y-6 md:p-0">
        <div className="h-24 sm:h-32 md:h-48 lg:h-64 bg-dark-surface border border-white/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-neon-blue)_0%,_transparent_70%)]" />
          <Swords className={`w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 ${feedback === 'WRONG' ? 'text-red-500' : 'text-white'} transition-colors blur-[0.5px]`} />
          
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <button 
              onClick={() => setShowInventory(true)}
              className="p-2 md:p-3 bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors rounded-full"
            >
              <Briefcase className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="absolute top-2 left-2 md:top-4 md:left-4">
             <div className="text-[8px] md:text-xs font-bold text-white/20 uppercase tracking-widest">
               STR: {currentEnemy.strength.toLocaleString()}
             </div>
          </div>
          
          {isShieldActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 border-2 md:border-4 border-neon-cyan opacity-50 bg-neon-cyan/10" 
            />
          )}
          
          <AnimatePresence>
            {feedback === 'SHIELD' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center font-black text-2xl md:text-5xl uppercase tracking-tighter text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              >
                BLOCKED!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-neon-blue p-4 md:p-8 text-center border-2 border-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-widest leading-none">
            {displayWord}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 pb-2 md:pb-0">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null && feedback !== 'SHIELD'}
              className="block-button border-neon-cyan/40 text-[11px] sm:text-xs md:text-base py-3 md:py-6 disabled:opacity-50 tracking-widest leading-tight"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="h-56 md:hidden" />
      </div>

      {/* Player Section / Sidebar */}
      <div className="fixed md:static bottom-[72px] left-0 right-0 md:bottom-auto z-40 bg-dark-bg/95 md:bg-dark-surface/50 backdrop-blur-md pt-2 pb-4 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] md:shadow-none border-t border-white/5 md:border md:border-white/10 md:col-span-4 lg:col-span-4 md:h-fit">
        <div className="space-y-4 max-w-md md:max-w-none mx-auto px-4 md:px-0">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-1">
               <h3 className="text-xs md:text-sm font-black uppercase text-neon-blue leading-none">PLAYER HP</h3>
               <span className="text-[10px] md:text-sm text-white/50 font-mono">{gameState.playerHP} / {gameState.maxPlayerHP}</span>
             </div>
             <div className="h-2 md:h-3 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
               <motion.div 
                 className="absolute top-0 left-0 bottom-0 bg-neon-blue" 
                 animate={{ width: `${Math.max(0, Math.min(100, (gameState.playerHP/gameState.maxPlayerHP)*100))}%`}} 
                 transition={{duration: 0.3}} 
               />
             </div>
           </div>

           <div className="bg-dark-surface/50 md:bg-transparent p-3 md:p-0 border md:border-none border-white/10 md:space-y-4">
             <div className="flex justify-between items-end mb-1">
               <h4 className="text-[10px] md:text-xs sm:text-xs font-bold text-neon-cyan tracking-widest uppercase flex items-center gap-1 leading-none">
                 <Zap className="w-3 h-3 md:w-4 md:h-4 sm:w-4 sm:h-4" /> SKILL POINTS
               </h4>
               <span className="text-sm md:text-xl font-mono text-neon-cyan leading-none">{skillPoints}</span>
             </div>
             
             <div className="h-1.5 md:h-2 w-full bg-dark-bg border border-neon-cyan/30 overflow-hidden relative mb-3">
               <div className="absolute top-0 left-0 bottom-0 bg-neon-cyan transition-all duration-300" style={{width: `${skillPoints}%`}} />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
               <button 
                 onClick={useAttackSkill}
                 disabled={skillPoints < 30 || gameState.enemyHP <= 0}
                 className="px-2 py-3 border border-red-500/50 bg-red-500/10 text-red-400 text-[9px] md:text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 md:gap-3 hover:bg-red-500/30"
               >
                 <Sword className="w-3 h-3 md:w-5 md:h-5" /> Zen Slash <span className="opacity-50">30 SP</span>
               </button>
               <button 
                 onClick={useDefendSkill}
                 disabled={skillPoints < 20 || isShieldActive}
                 className="px-2 py-3 border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-[9px] md:text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 md:gap-3 hover:bg-neon-cyan/30"
               >
                 <Shield className="w-3 h-3 md:w-5 md:h-5" /> Neon Guard <span className="opacity-50">20 SP</span>
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInventory(false)}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-dark-surface border border-white/10 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Item Bag</h3>
                <button onClick={() => setShowInventory(false)} className="text-white/40 hover:text-white">Close</button>
              </div>
              
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {gameState.inventory.filter(i => i.type === 'CONSUMABLE').length === 0 ? (
                  <p className="text-center text-white/30 py-8 uppercase text-xs font-bold tracking-widest">No usable items</p>
                ) : (
                  gameState.inventory.filter(i => i.type === 'CONSUMABLE').map(item => (
                    <button
                      key={item.id}
                      onClick={() => { useItem(item); setShowInventory(false); }}
                      disabled={!item.count || item.count <= 0}
                      className="w-full bg-white/5 border border-white/5 p-3 flex justify-between items-center hover:border-neon-cyan/50 transition-all text-left group disabled:opacity-30"
                    >
                      <div>
                        <h4 className="text-xs font-bold uppercase text-white group-hover:text-neon-cyan transition-colors">{item.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase">{item.description}</p>
                      </div>
                      <span className="text-xs font-mono text-neon-cyan">{item.count ? `x${item.count}` : ''}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

