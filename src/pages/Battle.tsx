import { useState, Dispatch, SetStateAction } from 'react';
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
  setInventory: Dispatch<SetStateAction<Item[]>>;
  onFinish: (victory: boolean, timeSpent: number, rewards?: Item[], scoreEarned?: number, enemiesBeaten?: number, wordsBeaten?: number, navigateTo?: Page) => void;
  pendingNav?: Page | null;
  onCancelNav?: () => void;
}

export const Battle = ({ level, isEndless, gameMode, inventory, setInventory, onFinish, pendingNav, onCancelNav }: BattleProps) => {
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
      navigateTo
    );
  };

  const handleUseItem = (item: Item) => {
    if (item.type === 'CONSUMABLE' && item.count && item.count > 0) {
      actions.healPlayer(item.hpBonus ?? 50);
      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, count: (i.count || 1) - 1 } : i));
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
        inventory={inventory}
        onClose={() => setShowInventory(false)}
        onUseItem={handleUseItem}
      />
    </>
  );
};
