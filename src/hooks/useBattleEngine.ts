import { useReducer, useEffect, useMemo, useState, useRef, Dispatch, SetStateAction } from 'react';
import { Level, Item, Word, GameMode } from '../types';
import { generateEnemy, EnemyTemplate } from '../utils/enemyUtils';

// Battle constants
const BASE_DAMAGE = 30;
const BASE_SP_GAIN = 35;

export interface BattleState {
  playerHP: number;
  maxPlayerHP: number;
  enemyHP: number;
  maxEnemyHP: number;
  currentEnemy: EnemyTemplate;
  currentLevel: Level;
  currentWordIndex: number;
  endlessRandomIndex: number; // Stabilizes random word selection
  score: number;
  wordsBeaten: number;
  enemiesBeaten: number;
  equipped: {
    weapon: Item | null;
    shield: Item | null;
    accessory: Item | null;
  };
  skillPoints: number;
  isShieldActive: boolean;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  shake: boolean;
  showVictory: boolean;
  showDefeat: boolean;
  enemyCooldown: number;
  inventory: Item[]; // For self-contained battle modes
}

export type BattleAction =
  | { type: 'ANSWER_CORRECT'; weaponBonus: number; spGain: number }
  | { type: 'ANSWER_WRONG' }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'ENEMY_ATTACK_TICK'; speedModifier: number }
  | { type: 'ENEMY_ATTACK_HIT'; damage: number }
  | { type: 'ENEMY_ATTACK_BLOCKED' }
  | { type: 'ENEMY_DEFEATED'; nextEnemy: EnemyTemplate }
  | { type: 'USE_SKILL_ATTACK' }
  | { type: 'USE_SKILL_DEFEND' }
  | { type: 'USE_ITEM_HEAL'; amount: number }
  | { type: 'USE_ITEM_CONSUME'; itemId: string }
  | { type: 'NEXT_WORD'; endlessRandomIndex: number }
  | { type: 'TRIGGER_VICTORY' }
  | { type: 'TRIGGER_DEFEAT' }
  | { type: 'SYNC_LEVEL'; level: Level };

export const initialBattleState = (level: Level, inventory: Item[] = []): BattleState => {
  const initialEnemy = generateEnemy(0);
  const equippedWeapon = inventory.find(i => i.type === 'WEAPON' && i.isEquipped) || null;
  const equippedShield = inventory.find(i => i.type === 'SHIELD' && i.isEquipped) || null;
  const equippedAccessory = inventory.find(i => i.type === 'ACCESSORY' && i.isEquipped) || null;

  return {
    playerHP: 150,
    maxPlayerHP: 150,
    enemyHP: initialEnemy.hp,
    maxEnemyHP: initialEnemy.maxHp,
    currentEnemy: initialEnemy,
    currentLevel: level,
    currentWordIndex: 0,
    endlessRandomIndex: 0,
    score: 0,
    wordsBeaten: 0,
    enemiesBeaten: 0,
    equipped: { weapon: equippedWeapon, shield: equippedShield, accessory: equippedAccessory },
    skillPoints: 0,
    isShieldActive: false,
    feedback: null,
    shake: false,
    showVictory: false,
    showDefeat: false,
    enemyCooldown: 0,
    inventory,
  };
};

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  switch (action.type) {
    case 'SYNC_LEVEL':
      return { ...state, currentLevel: action.level };

    case 'ANSWER_CORRECT': {
      const damage = BASE_DAMAGE + action.weaponBonus;
      return {
        ...state,
        feedback: 'CORRECT',
        enemyHP: Math.max(0, state.enemyHP - damage),
        wordsBeaten: state.wordsBeaten + 1,
        score: state.score + 100,
        skillPoints: Math.min(100, state.skillPoints + action.spGain),
      };
    }

    case 'ANSWER_WRONG':
      return {
        ...state,
        feedback: 'WRONG',
        shake: true,
        playerHP: Math.max(0, state.playerHP - 10),
      };

    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null, shake: false };

    case 'NEXT_WORD':
      return { 
        ...state, 
        currentWordIndex: state.currentWordIndex + 1,
        endlessRandomIndex: action.endlessRandomIndex
      };

    case 'ENEMY_ATTACK_TICK':
      return { ...state, enemyCooldown: Math.min(100, state.enemyCooldown + (5 * action.speedModifier)) };

    case 'ENEMY_ATTACK_HIT': {
      const shieldBonus = state.equipped.shield?.defenseBonus || 0;
      const actualDamage = Math.max(1, action.damage - shieldBonus);
      return {
        ...state,
        shake: true,
        playerHP: Math.max(0, state.playerHP - actualDamage),
        enemyCooldown: 0,
      };
    }

    case 'ENEMY_ATTACK_BLOCKED':
      return {
        ...state,
        feedback: 'SHIELD',
        isShieldActive: false,
        enemyCooldown: 0,
      };

    case 'ENEMY_DEFEATED':
      return {
        ...state,
        enemyHP: action.nextEnemy.hp,
        maxEnemyHP: action.nextEnemy.maxHp,
        currentEnemy: action.nextEnemy,
        enemiesBeaten: state.enemiesBeaten + 1,
      };

    case 'USE_SKILL_ATTACK': {
      const newEnemyHP = Math.max(0, state.enemyHP - 40);
      return {
        ...state,
        skillPoints: state.skillPoints - 30,
        enemyHP: newEnemyHP,
      };
    }

    case 'USE_SKILL_DEFEND':
      return {
        ...state,
        skillPoints: state.skillPoints - 20,
        isShieldActive: true,
      };

    case 'USE_ITEM_HEAL':
      return {
        ...state,
        playerHP: Math.min(state.maxPlayerHP, state.playerHP + action.amount),
      };

    case 'USE_ITEM_CONSUME':
      return {
        ...state,
        inventory: state.inventory.map(i =>
          i.id === action.itemId
            ? { ...i, count: Math.max(0, (i.count || 1) - 1) }
            : i
        ),
      };

    case 'TRIGGER_VICTORY':
      return { ...state, showVictory: true };

    case 'TRIGGER_DEFEAT':
      return { ...state, showDefeat: true };

    default:
      return state;
  }
};

export const useBattleEngine = (
  level: Level,
  isEndless: boolean | undefined,
  inventory: Item[] = [],
  gameMode: GameMode = 'LEARNING'
) => {
  const [state, dispatch] = useReducer(battleReducer, level, (l) => initialBattleState(l, inventory));

  // Sync level state
  useEffect(() => {
    dispatch({ type: 'SYNC_LEVEL', level });
  }, [level]);

  // Enemy Attack Timer
  // Use a ref to access latest state without recreating interval
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Compute isActive as a single dependency to avoid unnecessary timer restarts
  const isActive = state.playerHP > 0 && state.enemyHP > 0 && !state.showVictory && !state.showDefeat;

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const currentState = stateRef.current;
      if (currentState.enemyCooldown >= 100) {
        if (currentState.isShieldActive) {
          dispatch({ type: 'ENEMY_ATTACK_BLOCKED' });
          setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), 600);
        } else {
          const rawDamage = currentState.currentEnemy.damage;
          const adjustedDamage = Math.max(1, Math.floor(rawDamage * modeModifiers.damageTakenMult));
          dispatch({ type: 'ENEMY_ATTACK_HIT', damage: adjustedDamage });
          setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), 500);
        }
      } else {
        // Base speed modifier from tier, then apply mode multiplier
        const baseSpeedModifier = 0.5 + (currentState.currentEnemy.tier * 0.2);
        // Cap enemy speed at tier 4 effect (max multiplier 1.3 before mode mod)
        const cappedTier = Math.min(currentState.currentEnemy.tier, 4);
        const tierCappedSpeed = 0.5 + (cappedTier * 0.2);
        const speedModifier = tierCappedSpeed * modeModifiers.speedMult;
        dispatch({ type: 'ENEMY_ATTACK_TICK', speedModifier });
      }
    }, 500);

    return () => clearInterval(timer);
  }, [isActive]); // Only restart when battle becomes active/inactive

  // Mode-specific modifiers
  const modeModifiers = useMemo(() => {
    switch (gameMode) {
      case 'LEARNING':
        return { speedMult: 0.7, spGainMult: 1.5, damageTakenMult: 0.8 };
      case 'PRACTICE':
        return { speedMult: 1.3, spGainMult: 0.8, damageTakenMult: 1.2 };
      case 'TANTANGAN':
      default:
        return { speedMult: 1.0, spGainMult: 1.0, damageTakenMult: 1.0 };
    }
  }, [gameMode]);

  const activeWords = useMemo(() => {
    if (isEndless || gameMode === 'TANTANGAN') {
      // For TANTANGAN, behave like endless (random selection from unlocked words)
      return state.currentLevel.words.slice(0, state.currentLevel.unlockedWordCount);
    }
    return state.currentLevel.words.slice(0, state.currentLevel.unlockedWordCount);
  }, [state.currentLevel, isEndless, gameMode]);

  const currentWord = useMemo(() => {
    if (isEndless || gameMode === 'TANTANGAN') {
      return activeWords[state.endlessRandomIndex % activeWords.length];
    }
    return activeWords[state.currentWordIndex % activeWords.length];
  }, [state.currentWordIndex, state.endlessRandomIndex, activeWords, isEndless, gameMode]);

  // Enemy Death logic
  useEffect(() => {
    if (state.enemyHP <= 0 && !state.showVictory && !state.showDefeat) {
      const newlyGeneratedEnemy = generateEnemy(state.enemiesBeaten + 1);
      dispatch({ type: 'ENEMY_DEFEATED', nextEnemy: newlyGeneratedEnemy });
      
      // Auto-advance word if enemy was killed by skill
      if (state.feedback === null) {
        dispatch({ type: 'NEXT_WORD', endlessRandomIndex: Math.floor(Math.random() * activeWords.length) });
      }
    }
  }, [state.enemyHP, state.showVictory, state.showDefeat, state.enemiesBeaten, state.feedback, activeWords.length]);

  // Unified Victory / Defeat Detection
  useEffect(() => {
    if (state.playerHP <= 0 && !state.showDefeat) {
      dispatch({ type: 'TRIGGER_DEFEAT' });
    } else if (!isEndless && state.currentWordIndex >= activeWords.length && !state.showVictory) {
      dispatch({ type: 'TRIGGER_VICTORY' });
    }
  }, [state.playerHP, state.currentWordIndex, activeWords.length, isEndless, state.showVictory, state.showDefeat]);

  // Actions API
  const answerWord = (isCorrect: boolean) => {
    if (isCorrect) {
      const weaponBonus = state.equipped.weapon?.attackBonus || 0;
      const spGain = Math.min(100, Math.floor(BASE_SP_GAIN * modeModifiers.spGainMult));
      dispatch({ type: 'ANSWER_CORRECT', weaponBonus, spGain });
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
    }

    setTimeout(() => {
      dispatch({ type: 'CLEAR_FEEDBACK' });
      dispatch({
        type: 'NEXT_WORD',
        endlessRandomIndex: Math.floor(Math.random() * activeWords.length)
      });
    }, 600);
  };

  const useAttackSkill = () => {
    if (state.skillPoints >= 30 && state.enemyHP > 0) {
      dispatch({ type: 'USE_SKILL_ATTACK' });
    }
  };

  const useDefendSkill = () => {
    if (state.skillPoints >= 20 && !state.isShieldActive) {
      dispatch({ type: 'USE_SKILL_DEFEND' });
    }
  };

  const healPlayer = (amount: number) => {
    dispatch({ type: 'USE_ITEM_HEAL', amount });
  };

  const consumeItem = (itemId: string) => {
    dispatch({ type: 'USE_ITEM_CONSUME', itemId });
  };

  const triggerVictory = () => {
    dispatch({ type: 'TRIGGER_VICTORY' });
  };

  return {
    state,
    activeWords,
    currentWord,
    actions: {
      answerWord,
      useAttackSkill,
      useDefendSkill,
      healPlayer,
      consumeItem,
      triggerVictory
    }
  };
};
