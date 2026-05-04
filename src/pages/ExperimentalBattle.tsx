import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Zap, Target, Shield, Sword, Briefcase } from 'lucide-react';
import { Level, GameMode, Item, Page, Word } from '../types';
import { useBattleEngine } from '../hooks/useBattleEngine';
import { shuffleArray } from '../utils/arrayUtils';
import { FloatingText } from '../components/battle/FloatingText';
import { ParticleBurst } from '../components/battle/ParticleBurst';
import { SlashEffect } from '../components/battle/effects/SlashEffect';
import { ShieldWave } from '../components/battle/effects/ShieldWave';


interface BattleProps {
  levels: Level[];
  initialLevelIndex?: number;
  isEndless?: boolean;
  gameMode: GameMode;
  inventory: Item[];
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page, currentInventory?: Item[]) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
}

// Types for effect entries
interface FloatingTextEntry {
  id: string;
  text: string;
  x: number;
  y: number;
  color: 'damage' | 'heal' | 'sp' | 'score' | 'critical' | 'benar' | 'salah';
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

interface ParticleBurstEntry {
  id: string;
  x: number;
  y: number;
  color: 'cyan' | 'red' | 'green' | 'pink' | 'gold';
  count?: number;
  velocity?: number;
}

export const ExperimentalBattle = memo(({ levels, initialLevelIndex = 0, isEndless, gameMode, inventory, onFinish }: BattleProps) => {
  const [startTime] = useState(Date.now());
  const [showInventory, setShowInventory] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevelIndex);
  const currentLevel = levels[currentLevelIndex];

  const { state, activeWords, currentWord, actions } = useBattleEngine(currentLevel, isEndless, inventory, gameMode);

  // Effect spawning state
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextEntry[]>([]);
  const [particleBursts, setParticleBursts] = useState<ParticleBurstEntry[]>([]);
  const [slashEffects, setSlashEffects] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [shieldWaves, setShieldWaves] = useState<Array<{ id: string; x: number; y: number }>>([]);

  // Helpers to spawn skill effects
  const spawnSlash = (x: number, y: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setSlashEffects(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setSlashEffects(prev => prev.filter(item => item.id !== id));
    }, 500);
  };

  const spawnShieldWave = (x: number, y: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setShieldWaves(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setShieldWaves(prev => prev.filter(item => item.id !== id));
    }, 600);
  };

  // Helper to spawn a floating text
  const spawnFloatingText = (text: string, x: number, y: number, color: FloatingTextEntry['color'], size: 'sm' | 'md' | 'lg' = 'md', duration: number = 1.5) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingTexts(prev => [...prev, { id, text, x, y, color, size, duration }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, duration * 1000);
  };

  // Helper to spawn a particle burst
  const spawnParticleBurst = (x: number, y: number, color: 'cyan' | 'red' | 'green' | 'pink' | 'gold', count?: number, velocity?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setParticleBursts(prev => [...prev, { id, x, y, color, count, velocity }]);
    setTimeout(() => {
      setParticleBursts(prev => prev.filter(item => item.id !== id));
    }, 1500);
  };

  // Detect state changes to spawn visual feedback
  const prevStateRef = useRef(state);
  useEffect(() => {
    const prev = prevStateRef.current;

    // Enemy took damage
    if (state.enemyHP < prev.enemyHP) {
      const damage = prev.enemyHP - state.enemyHP;
      spawnFloatingText(`-${damage}`, 50, 25, 'damage', 'lg');
      spawnParticleBurst(50, 25, 'cyan');
    }

    // Player took damage
    if (state.playerHP < prev.playerHP) {
      const damage = prev.playerHP - state.playerHP;
      spawnFloatingText(`-${damage}`, 50, 78, 'damage', 'lg');
      spawnParticleBurst(50, 78, 'red');
    }

    // Player healed
    if (state.playerHP > prev.playerHP) {
      const heal = state.playerHP - prev.playerHP;
      spawnFloatingText(`+${heal}`, 50, 78, 'heal', 'md');
      spawnParticleBurst(50, 78, 'green');
    }

    // Skill points gained (from answering)
    if (state.skillPoints > prev.skillPoints) {
      const spGain = state.skillPoints - prev.skillPoints;
      spawnFloatingText(`+${spGain} SP`, 50, 73, 'sp', 'sm');
    }

    // Score increased
    if (state.score > prev.score) {
      // Score increase is usually 100 per correct answer; might be multiple if combo later, but no combo now.
      const scoreGain = state.score - prev.score;
      spawnFloatingText(`+${scoreGain}`, 50, 18, 'score', 'sm');
    }

    // Feedback: CORRECT / WRONG
    if (state.feedback === 'CORRECT' && prev.feedback !== 'CORRECT') {
      spawnFloatingText('BENAR!', 50, 45, 'benar', 'lg', 1);
    } else if (state.feedback === 'WRONG' && prev.feedback !== 'WRONG') {
      spawnFloatingText('SALAH!', 50, 45, 'salah', 'lg', 1);
    }

    // Skill usage detection
    // Attack skill: SP decreased by 30 and enemy HP decreased by 40
    if (prev.skillPoints - state.skillPoints === 30 && prev.enemyHP - state.enemyHP === 40) {
      spawnSlash(50, 25); // enemy panel center approx
      spawnParticleBurst(50, 25, 'pink');
    }

    // Defend skill: SP decreased by 20 and shield became active
    if (prev.skillPoints - state.skillPoints === 20 && state.isShieldActive && !prev.isShieldActive) {
      spawnShieldWave(50, 78); // player panel center approx
    }

    prevStateRef.current = state;
  }, [state]);


  // Display logic: PRACTICE shows kanji if available; LEARNING/TANTANGAN show kana
  const displayWord = (gameMode === 'PRACTICE' && currentWord.kanji) ? currentWord.kanji : currentWord.japanese;

  const handleFinish = (victory: boolean) => {
    onFinish(
      victory,
      Math.floor((Date.now() - startTime) / 1000),
      [],
      state.score,
      state.enemiesBeaten,
      state.wordsBeaten,
      'HOME',
      state.inventory
    );
  };

  const handleUseItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      actions.healPlayer(50);
      actions.consumeItem(item.id);
      setShowInventory(false);
    }
  };

  // Handle level progression for multi-level experimental battles
  useEffect(() => {
    if (!isEndless && !state.showVictory && !state.showDefeat && state.currentWordIndex >= activeWords.length) {
      if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
      } else {
        actions.triggerVictory();
      }
    }
  }, [state.currentWordIndex, state.showVictory, state.showDefeat, activeWords.length, isEndless, currentLevelIndex, levels.length]);

  if (state.showVictory) {
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

  if (state.showDefeat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
        <h2 className="text-4xl font-black text-neon-pink uppercase tracking-widest drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">FAILED</h2>
        <button onClick={() => handleFinish(false)} className="px-12 py-4 border-2 border-neon-pink text-neon-pink font-black uppercase">Kembali</button>
      </div>
    );
  }

  return (
    <div className={`transition-transform max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-12 md:gap-6 ${state.shake ? 'animate-shake' : ''} md:p-6 relative`}>
      {/* Enemy Section (Sticky Mobile, Part of Grid Desktop) */}
      <div className="sticky md:static top-0 z-30 bg-dark-bg/95 md:bg-dark-surface/50 backdrop-blur-md pt-4 pb-2 px-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:shadow-none border-b border-white/5 md:border md:border-white/10 md:col-span-12 lg:col-span-12">
        <div className="flex items-center gap-4 max-w-md md:max-w-none mx-auto">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-1">
               <div className="flex items-center gap-2">
                 <h3 className={`text-sm md:text-lg font-black uppercase leading-none ${
                   state.currentEnemy.tier === 5 ? 'text-neon-pink' :
                   state.currentEnemy.tier >= 4 ? 'text-neon-cyan' : 'text-red-400'
                 }`}>{state.currentEnemy.name}</h3>
                 <span className="text-[8px] md:text-xs font-bold px-1 bg-white/10 text-white/50 rounded">{state.currentEnemy.rank}</span>
               </div>
               <span className="text-[10px] md:text-sm text-white/50 font-mono">{state.enemyHP} / {state.currentEnemy.maxHp} HP</span>
             </div>
             <div className="h-2 md:h-3 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
               <motion.div
                 className={`absolute top-0 left-0 bottom-0 ${state.currentEnemy.tier === 5 ? 'bg-neon-pink' : 'bg-neon-green'}`}
                 animate={{ width: `${Math.max(0, Math.min(100, (state.enemyHP / state.currentEnemy.maxHp) * 100))}%`}}
                 transition={{duration: 0.3}}
               />
             </div>
           </div>

           <div className="w-24 md:w-48">
             <div className="text-[10px] md:text-xs font-bold text-red-500 uppercase flex items-center justify-end gap-1 mb-1 leading-none">
               <Target className="w-3 h-3 md:w-4 md:h-4 block"/> Intent
             </div>
             <div className="h-2 md:h-3 w-full bg-dark-surface border border-red-500/30 overflow-hidden relative">
               <div className="absolute top-0 left-0 bottom-0 bg-red-500 transition-all duration-500" style={{width: `${state.enemyCooldown}%`}} />
             </div>
           </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="px-4 py-3 space-y-4 flex-1 md:col-span-8 lg:col-span-8 md:space-y-6">
        {/* Battle Visual */}
        <div className="h-24 sm:h-32 md:h-48 lg:h-64 bg-dark-surface border border-white/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-neon-blue)_0%,_transparent_70%)]" />
          <Swords className={`w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 ${state.feedback === 'WRONG' ? 'text-red-500' : 'text-white'} transition-colors blur-[0.5px]`} />

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
               STR: {state.currentEnemy.strength.toLocaleString()}
             </div>
          </div>

          {state.isShieldActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 border-2 md:border-4 border-neon-cyan opacity-50 bg-neon-cyan/10"
            />
          )}

          <AnimatePresence>
            {state.feedback === 'SHIELD' && (
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

          {/* Enemy Defeat Overlay */}
          <AnimatePresence>
            {state.defeatTransitionPending && (
              <motion.div
                key="defeated"
                className="absolute inset-0 flex items-center justify-center bg-red-900/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  DEFEATED!
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question Box */}
        <div className="bg-neon-blue p-4 md:p-8 text-center border-2 border-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentWord.japanese}
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-widest leading-none"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {displayWord}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Answer Options */}
        <AnswerOptions
          currentWord={currentWord}
          activeWords={activeWords}
          feedback={state.feedback}
          onAnswer={actions.answerWord}
        />

        {/* Spacer for fixed mobile UI bottom panel + nav */}
        <div className="h-56 md:hidden" />
      </div>

      {/* Player Section (Fixed Mobile Bottom, Static Sidebar Desktop) */}
      <PlayerPanel
        hp={state.playerHP}
        maxHp={state.maxPlayerHP}
        skillPoints={state.skillPoints}
        enemyHP={state.enemyHP}
        isShieldActive={state.isShieldActive}
        onUseAttack={actions.useAttackSkill}
        onUseDefend={actions.useDefendSkill}
      />

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={showInventory}
        inventory={state.inventory}
        onClose={() => setShowInventory(false)}
        onUseItem={handleUseItem}
      />

      {/* Effects Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {floatingTexts.map(ft => (
          <FloatingText
            key={ft.id}
            id={ft.id}
            text={ft.text}
            x={ft.x}
            y={ft.y}
            color={ft.color}
            size={ft.size}
            duration={ft.duration}
          />
        ))}
        {particleBursts.map(pb => (
          <ParticleBurst
            key={pb.id}
            id={pb.id}
            x={pb.x}
            y={pb.y}
            color={pb.color}
            count={pb.count}
            velocity={pb.velocity}
          />
        ))}
        {slashEffects.map(se => (
          <SlashEffect key={se.id} x={se.x} y={se.y} />
        ))}
        {shieldWaves.map(sw => (
          <ShieldWave key={sw.id} x={sw.x} y={sw.y} />
        ))}
      </div>
    </div>
  );
});

// Extracted Answer Options component
interface AnswerOptionsProps {
  currentWord: Word;
  activeWords: Word[];
  feedback: string | null;
  onAnswer: (isCorrect: boolean) => void;
}

const AnswerOptions = ({ currentWord, activeWords, feedback, onAnswer }: AnswerOptionsProps) => {
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
    <div className="grid grid-cols-2 gap-2 md:gap-4 pb-2 md:pb-0">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt === currentWord.indonesian)}
          disabled={feedback !== null && feedback !== 'SHIELD'}
          className="block-button border-neon-cyan/40 text-[11px] sm:text-xs md:text-base py-3 md:py-6 disabled:opacity-50 tracking-widest leading-tight"
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

// Extracted Inventory Modal component
interface InventoryModalProps {
  isOpen: boolean;
  inventory: Item[];
  onClose: () => void;
  onUseItem: (item: Item) => void;
}

const InventoryModal = ({ isOpen, inventory, onClose, onUseItem }: InventoryModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
            <button onClick={onClose} className="text-white/40 hover:text-white">Close</button>
          </div>

          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {inventory.filter(i => i.type === 'CONSUMABLE').length === 0 ? (
              <p className="text-center text-white/30 py-8 uppercase text-xs font-bold tracking-widest">No usable items</p>
            ) : (
              inventory.filter(i => i.type === 'CONSUMABLE').map(item => (
                <button
                  key={item.id}
                  onClick={() => onUseItem(item)}
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
);

// Extracted Player Panel component
interface PlayerPanelProps {
  hp: number;
  maxHp: number;
  skillPoints: number;
  enemyHP: number;
  isShieldActive: boolean;
  onUseAttack: () => void;
  onUseDefend: () => void;
}

const PlayerPanel = ({ hp, maxHp, skillPoints, enemyHP, isShieldActive, onUseAttack, onUseDefend }: PlayerPanelProps) => (
  <div className="fixed md:static bottom-[72px] left-0 right-0 md:bottom-auto z-40 bg-dark-bg/95 md:bg-dark-surface/50 backdrop-blur-md pt-2 pb-4 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] md:shadow-none border-t border-white/5 md:border md:border-white/10 md:col-span-4 lg:col-span-4 md:h-fit">
    <div className="space-y-4 max-w-md md:max-w-none mx-auto px-4 md:px-0">
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1">
          <h3 className="text-xs md:text-sm font-black uppercase text-neon-blue leading-none">PLAYER HP</h3>
          <span className="text-[10px] md:text-sm text-white/50 font-mono">{hp} / {maxHp}</span>
        </div>
        <div className="h-2 md:h-3 w-full bg-dark-surface border border-white/10 overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-neon-blue"
            animate={{ width: `${Math.max(0, Math.min(100, (hp / maxHp) * 100))}%`}}
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
            onClick={onUseAttack}
            disabled={skillPoints < 30 || enemyHP <= 0}
            className="px-2 py-3 border border-red-500/50 bg-red-500/10 text-red-400 text-[9px] md:text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 md:gap-3 hover:bg-red-500/30"
          >
            <Sword className="w-3 h-3 md:w-5 md:h-5" /> Zen Slash <span className="opacity-50">30 SP</span>
          </button>
          <button
            onClick={onUseDefend}
            disabled={skillPoints < 20 || isShieldActive}
            className="px-2 py-3 border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-[9px] md:text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1 md:gap-3 hover:bg-neon-cyan/30"
          >
            <Shield className="w-3 h-3 md:w-5 md:h-5" /> Neon Guard <span className="opacity-50">20 SP</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
