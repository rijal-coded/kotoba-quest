import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, GameMode, Item, Page } from '../types';
import { useBattleEngine } from '../hooks/useBattleEngine';
import { EnemyPanel } from '../components/battle/EnemyPanel';
import { PlayerPanel } from '../components/battle/PlayerPanel';
import { QuestionCard } from '../components/battle/QuestionCard';
import { InventoryModal } from '../components/battle/InventoryModal';
import { VictoryScreen } from '../components/battle/VictoryScreen';
import { DefeatScreen } from '../components/battle/DefeatScreen';
import { BattleLayout } from '../components/battle/BattleLayout';

interface BattleProps {
  level: Level;
  isEndless?: boolean;
  gameMode: GameMode;
  inventory: Item[];
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page, currentInventory?: Item[]) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
}

export const Battle = ({ level, isEndless, gameMode, inventory, onFinish, pendingNav, onCancelNav }: BattleProps) => {
  const [startTime] = useState(Date.now());
  const [showInventory, setShowInventory] = useState(false);

  const { state, activeWords, currentWord, actions } = useBattleEngine(level, isEndless, inventory, gameMode);

  const handleFinish = (victory: boolean) => {
    let rewards: Item[] = [];

    // Determine post-battle navigation: TANTANGAN returns to level select, others to home
    const navigateTo = gameMode === 'TANTANGAN' ? 'LEVEL_SELECT' : 'HOME';

    if (victory) {
      // Basic Consumable Reward
      rewards.push({ id: `c1`, name: 'RAMUAN YAKUSO', type: 'CONSUMABLE', description: 'Memulihkan 50 HP', rarity: 'COMMON', hpBonus: 50, count: 1 });
      
      // Dynamic Sengoku-Era Boss/Tier Loot
      if (state.currentEnemy.tier === 5 || state.score >= 1500) {
        rewards.push({
          id: `w-legendary-${Date.now()}`,
          name: 'MASAMUNE KATANA',
          type: 'WEAPON',
          description: 'Pedang legendaris dengan ketajaman abadi.',
          rarity: 'LEGENDARY',
          attackBonus: 35,
          isEquipped: false
        });
      } else if (state.currentEnemy.tier === 4 || state.score >= 800) {
        rewards.push({
          id: `s-epic-${Date.now()}`,
          name: 'O-YOROI ARMOR',
          type: 'SHIELD',
          description: 'Zirah berat khas komandan perang Sengoku.',
          rarity: 'EPIC',
          defenseBonus: 20,
          isEquipped: false
        });
      } else if (state.enemiesBeaten >= 2) {
        rewards.push({
          id: `w-rare-${Date.now()}`,
          name: 'JUUMONJI YARI',
          type: 'WEAPON',
          description: 'Tombak tajam untuk menembus formasi.',
          rarity: 'RARE',
          attackBonus: 15,
          isEquipped: false
        });
      }
    }

    onFinish(
      victory,
      Math.floor((Date.now() - startTime) / 1000),
      rewards,
      state.score,
      state.enemiesBeaten,
      state.wordsBeaten,
      navigateTo,
      state.inventory
    );
  };

  const handleUseItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      actions.healPlayer(item.hpBonus ?? 50);
      actions.consumeItem(item.id);
    }
  };

  if (state.showVictory) {
    return <VictoryScreen onContinue={() => handleFinish(true)} />;
  }

  if (state.showDefeat) {
    return <DefeatScreen onRetry={() => handleFinish(false)} />;
  }

  // Determine what to display based on game mode
  // PRACTICE mode shows kanji if available for extra challenge; LEARNING/TANTANGAN show kana
  const displayWord = (gameMode === 'PRACTICE' && currentWord.kanji) ? currentWord.kanji : currentWord.japanese;

  return (
    <>
      <BattleLayout
        leftPanel={
          <EnemyPanel
            enemy={state.currentEnemy}
            currentHP={state.enemyHP}
            cooldownPercentage={state.enemyCooldown}
          />
        }
        centerPanel={
          <QuestionCard
            displayWord={displayWord}
            currentWord={currentWord}
            activeWords={activeWords}
            feedback={state.feedback}
            isShieldActive={state.isShieldActive}
            enemyStrength={state.currentEnemy.strength}
            onAnswer={actions.answerWord}
            onOpenInventory={() => setShowInventory(true)}
            gameMode={gameMode}
          />
        }
        rightPanel={
          <PlayerPanel
            hp={state.playerHP}
            maxHp={state.maxPlayerHP}
            skillPoints={state.skillPoints}
            enemyHP={state.enemyHP}
            isShieldActive={state.isShieldActive}
            onUseAttack={actions.useAttackSkill}
            onUseDefend={actions.useDefendSkill}
          />
        }
        shake={state.shake}
      />

      <InventoryModal
        isOpen={showInventory}
        inventory={state.inventory}
        onClose={() => setShowInventory(false)}
        onUseItem={handleUseItem}
      />

      {/* Navigation Guard Modal for TANTANGAN mode */}
      {pendingNav && (
        <ExitConfirmationModal
          targetPage={pendingNav}
          onConfirm={() => {
            if (onCancelNav) {
              onCancelNav();
            }
          }}
          onCancel={() => {
            if (onCancelNav) {
              onCancelNav();
            }
          }}
        />
      )}
    </>
  );
};

// Exit Confirmation Modal Component
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
    EXPERIMENTAL_BATTLE: 'Pertempuran Eksperimental'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-bg-surface border border-main/10 rounded-2xl p-6 shadow-2xl glow-cyan"
        >
          <div className="hud-corner hud-corner--tl" />
          <div className="hud-corner hud-corner--tr" />
          <div className="hud-corner hud-corner--bl" />
          <div className="hud-corner hud-corner--br" />

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-main/10 border border-main/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>

            <h3 className="text-xl font-black uppercase tracking-widest text-main">
              Konfirmasi Keluar
            </h3>

            <p className="text-text-secondary text-sm">
              Anda berada dalam Mode Tantangan. Jika keluar sekarang, progres akan <span className="text-main font-bold">tidak tersimpan</span>.
              <br /><br />
              Yakin ingin keluar ke <span className="text-accent font-bold">{pageNames[targetPage]}</span>?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-bg-primary border border-main/15 text-text-primary font-bold uppercase tracking-wider rounded-xl hover:bg-text-primary/5 transition-all"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-main/90 text-bg-primary font-bold uppercase tracking-wider rounded-xl hover:bg-main transition-all shadow-[0_0_15px_rgba(0,156,255,0.4)]"
              >
                Keluar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
