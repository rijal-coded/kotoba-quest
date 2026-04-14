import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Briefcase, Skull, Languages, X } from 'lucide-react';
import { Level, Word, GameState, GameMode, Item, Page } from '../types';
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

export const Battle = ({ level, isEndless, gameMode, inventory, setInventory, onFinish, pendingNav, onCancelNav }: BattleProps) => {
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

  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [shake, setShake] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [showEndlessFinish, setShowEndlessFinish] = useState(false);
  const [rewardNotification, setRewardNotification] = useState<string | null>(null);

  const currentWord = useMemo(() => {
    if (isEndless) {
      // In endless, pick random word from level
      return level.words[Math.floor(Math.random() * level.words.length)];
    }
    return level.words[gameState.currentWordIndex % level.words.length];
  }, [gameState.currentWordIndex, level.words, isEndless]);

  const displayWord = gameMode === 'KANJI' && currentWord.kanji ? currentWord.kanji : currentWord.japanese;

  const options = useMemo(() => {
    const correct = currentWord.indonesian;
    const others = level.words
      .filter(w => w.indonesian !== correct)
      .map(w => w.indonesian)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [currentWord, level.words]);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentWord.indonesian;
    let newEnemyHP = gameState.enemyHP;

    if (isCorrect) {
      setFeedback('CORRECT');
      newEnemyHP = Math.max(0, gameState.enemyHP - 25);
      setGameState(prev => ({
        ...prev,
        enemyHP: newEnemyHP,
        wordsBeaten: prev.wordsBeaten + 1,
        score: prev.score + 100
      }));
    } else {
      setFeedback('WRONG');
      setShake(true);
      setGameState(prev => ({
        ...prev,
        playerHP: Math.max(0, prev.playerHP - 20)
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

      if (newEnemyHP <= 0) {
        const nextEnemiesBeaten = gameState.enemiesBeaten + 1;
        if (isEndless && nextEnemiesBeaten > 0 && nextEnemiesBeaten % 2 === 0) {
          setInventory(currentInv => {
            const newInv = [...currentInv];
            const potion = newInv.find(i => i.id === 'c1');
            if (potion) {
              potion.count = (potion.count || 0) + 1;
            } else {
              newInv.push({
                id: 'c1',
                name: 'KAPSUL PENINGKAT ADRENALIN',
                type: 'CONSUMABLE',
                description: 'Memulihkan 50 HP',
                rarity: 'COMMON',
                count: 1
              });
            }
            return newInv;
          });
          setRewardNotification('+1 KAPSUL PENINGKAT ADRENALIN');
          setTimeout(() => setRewardNotification(null), 3000);
        }
      }
    }, 600);
  };

  const useItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      if (gameState.playerHP >= gameState.maxPlayerHP) {
        return; // Don't use if HP is full
      }
      setGameState(prev => ({
        ...prev,
        playerHP: Math.min(prev.maxPlayerHP, prev.playerHP + 50)
      }));
      setInventory(prev => prev.map(i => 
        i.id === item.id ? { ...i, count: (i.count || 1) - 1 } : i
      ));
      setIsInventoryOpen(false);
    }
  };

  useEffect(() => {
    if (gameState.playerHP <= 0 && !showDefeat && !showEndlessFinish) {
      if (isEndless) {
        setShowEndlessFinish(true);
      } else {
        setShowDefeat(true);
      }
    }
  }, [gameState.playerHP, showDefeat, showEndlessFinish, isEndless]);

  useEffect(() => {
    if (!isEndless && gameState.enemyHP <= 0 && gameState.currentWordIndex >= level.words.length && !showVictory) {
      setShowVictory(true);
    }
  }, [gameState.enemyHP, gameState.currentWordIndex, isEndless, level.words.length, showVictory]);

  const handleFinish = (victory: boolean) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (victory) {
      const reward: Item = {
        id: 'c1',
        name: 'KAPSUL PENINGKAT ADRENALIN',
        type: 'CONSUMABLE',
        description: 'Memulihkan 50 HP',
        rarity: 'COMMON',
        count: 1
      };
      onFinish(true, timeSpent, [reward], 100);
    } else {
      onFinish(false, timeSpent);
    }
  };

  if (showEndlessFinish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-cyan uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
          ENDLESS SELESAI
        </h2>
        <div className="bg-dark-surface border border-neon-cyan p-6 w-full max-w-sm space-y-4">
          <div className="flex items-center justify-between bg-dark-bg p-4 border border-white/10">
            <span className="text-xs font-bold text-white/60 uppercase">Musuh Dikalahkan</span>
            <span className="text-xl font-mono text-neon-pink">{gameState.enemiesBeaten}</span>
          </div>
          <div className="flex items-center justify-between bg-dark-bg p-4 border border-white/10">
            <span className="text-xs font-bold text-white/60 uppercase">Jawaban Benar</span>
            <span className="text-xl font-mono text-neon-green">{gameState.wordsBeaten}</span>
          </div>
        </div>
        <button 
          onClick={() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            onFinish(false, timeSpent, [], 0, gameState.enemiesBeaten, gameState.wordsBeaten, pendingNav || undefined);
          }}
          className="px-12 py-4 bg-neon-cyan text-dark-bg font-black uppercase tracking-widest hover:bg-neon-cyan/90 transition-colors"
        >
          Lanjut
        </button>
      </div>
    );
  }

  if (showVictory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-green uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          LEVEL SELESAI
        </h2>
        <div className="bg-dark-surface border border-neon-green p-6 w-full max-w-sm space-y-4">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Rewards</h3>
          <div className="flex items-center justify-between bg-dark-bg p-4 border border-white/10">
            <span className="text-xs font-bold text-neon-cyan uppercase">KAPSUL PENINGKAT ADRENALIN</span>
            <span className="text-xs font-mono text-neon-green">x1</span>
          </div>
        </div>
        <button 
          onClick={() => handleFinish(true)}
          className="px-12 py-4 bg-neon-green text-dark-bg font-black uppercase tracking-widest hover:bg-neon-green/90 transition-colors"
        >
          Lanjut
        </button>
      </div>
    );
  }

  if (showDefeat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-pink uppercase tracking-widest drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">
          GAGAL
        </h2>
        <p className="text-white/60 uppercase tracking-widest">Coba lagi lain waktu.</p>
        <button 
          onClick={() => handleFinish(false)}
          className="px-12 py-4 border-2 border-neon-pink text-neon-pink font-black uppercase tracking-widest hover:bg-neon-pink hover:text-dark-bg transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const consumables = inventory.filter(i => i.type === 'CONSUMABLE' && (i.count || 0) > 0);

  return (
    <div className={`p-4 pb-24 space-y-6 max-w-md mx-auto transition-transform ${shake ? 'animate-shake' : ''}`}>
      {/* Pending Nav Prompt */}
      <AnimatePresence>
        {pendingNav && isEndless && !showEndlessFinish && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/90 backdrop-blur-sm p-4"
          >
            <div className="bg-dark-surface border-2 border-neon-pink p-6 max-w-sm w-full space-y-6 text-center">
              <h3 className="text-xl font-black text-neon-pink uppercase tracking-widest">Peringatan</h3>
              <p className="text-white/80 uppercase tracking-widest text-sm">
                Rekor endless kamu akan hilang, lanjutkan?
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowEndlessFinish(true)}
                  className="px-8 py-2 bg-neon-pink text-dark-bg font-black uppercase tracking-widest hover:bg-neon-pink/90 transition-colors"
                >
                  IYA
                </button>
                <button 
                  onClick={() => {
                    if (onCancelNav) onCancelNav();
                  }}
                  className="px-8 py-2 border border-white/40 text-white/60 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                >
                  TIDAK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Notification */}
      <AnimatePresence>
        {rewardNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neon-green text-dark-bg px-4 py-2 font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          >
            {rewardNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enemy Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">The Dark Lord</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter">GREITHER</h3>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Power Score</span>
            <div className="text-xl font-mono text-neon-blue">190.000.000</div>
          </div>
        </div>
        
        <HPBar current={gameState.enemyHP} max={gameState.maxEnemyHP} label="Enemy HP" color="bg-neon-green" />
      </div>

      {/* Battle Visual */}
      <div className="aspect-video bg-dark-surface border border-white/5 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-neon-blue)_0%,_transparent_70%)]" />
        <motion.div
          animate={feedback === 'CORRECT' ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
        >
          <Swords className={`w-24 h-24 ${feedback === 'WRONG' ? 'text-red-500' : 'text-white'} transition-colors`} />
        </motion.div>
        
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute inset-0 flex items-center justify-center font-black text-4xl uppercase tracking-tighter ${feedback === 'CORRECT' ? 'text-neon-green' : 'text-red-500'}`}
            >
              {feedback === 'CORRECT' ? 'CRITICAL!' : 'MISS!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Section */}
      <div className="space-y-6 relative">
        <HPBar current={gameState.playerHP} max={gameState.maxPlayerHP} label="Player HP" color="bg-neon-blue" />

        {/* Question Box */}
        <div className="bg-neon-blue p-6 text-center border-2 border-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <h2 className="text-4xl font-bold text-white tracking-widest">
            {displayWord}
          </h2>
        </div>

        {/* Answer Grid */}
        <div className="grid grid-cols-2 gap-3 relative">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null || isInventoryOpen}
              className="block-button border-neon-cyan/40 text-sm py-4 disabled:opacity-50"
            >
              {opt}
            </button>
          ))}

          {/* Inventory Overlay */}
          <AnimatePresence>
            {isInventoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 bg-dark-bg/95 backdrop-blur-sm border-2 border-neon-cyan p-4 z-10 shadow-[0_0_20px_rgba(0,255,255,0.2)] flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-neon-cyan uppercase tracking-widest">Tas Item</h4>
                  <button onClick={() => setIsInventoryOpen(false)} className="text-white/50 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {consumables.length > 0 ? consumables.map(item => (
                    <button
                      key={item.id}
                      onClick={() => useItem(item)}
                      className={`w-full text-left bg-dark-surface border border-white/10 p-3 flex justify-between items-center transition-colors ${gameState.playerHP >= gameState.maxPlayerHP ? 'opacity-50 cursor-not-allowed' : 'hover:border-neon-green'}`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white uppercase">{item.name}</div>
                        <div className="text-[10px] text-white/50">{item.description}</div>
                      </div>
                      <span className="text-xs font-mono text-neon-cyan">x{item.count}</span>
                    </button>
                  )) : (
                    <div className="text-center text-xs text-white/40 py-4 uppercase tracking-widest">Kosong</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Inventory/Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          {isEndless ? (
            <>
              <button 
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className="bg-dark-surface border border-white/10 p-3 flex items-center justify-center hover:border-neon-cyan transition-colors"
              >
                <Briefcase className="w-6 h-6 text-white/40" />
              </button>
              <div className="bg-dark-surface border border-white/10 p-3 flex items-center justify-between px-4">
                <Languages className="w-5 h-5 text-neon-cyan" />
                <span className="font-mono font-bold">{gameState.wordsBeaten}</span>
              </div>
              <div className="bg-dark-surface border border-white/10 p-3 flex items-center justify-between px-4">
                <Skull className="w-5 h-5 text-white/40" />
                <span className="font-mono font-bold">{gameState.enemiesBeaten}</span>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              className="col-span-3 block-button flex items-center justify-center gap-3 border-neon-cyan/40"
            >
              <Briefcase className="w-5 h-5" />
              TAS ITEM
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
