import { useReducer, useEffect, useMemo, useRef } from 'react';
import { Level, Item, GameMode } from '../types';
import { generateEnemy, EnemyTemplate, ProgressContext } from '../utils/enemyUtils';
import { computeEquippedStats } from '../utils/equipmentStats';

const BASE_DAMAGE = 25;

export interface BattleState {
  playerHP: number;
  maxPlayerHP: number;
  enemyHP: number;
  maxEnemyHP: number;
  currentEnemy: EnemyTemplate;
  currentLevel: Level;
  score: number;
  wordsBeaten: number;
  enemiesBeaten: number;
  equipped: {
    weapon: Item | null;
    shield: Item | null;
    armor: Item | null;
    helm: Item | null;
    accessory: Item | null;
  };
  actionPoints: number;
  isShieldActive: boolean;
  feedback: 'CORRECT' | 'WRONG' | 'SHIELD' | null;
  shake: boolean;
  showVictory: boolean;
  showDefeat: boolean;
  enemyCooldown: number;
  inventory: Item[];
  isPaused: boolean;
  isBossActive: boolean;
}

export type BattleAction =
  | { type: 'ANSWER_CORRECT'; weaponBonus: number; critTriggered: boolean }
  | { type: 'ANSWER_WRONG' }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'ENEMY_ATTACK_TICK'; speedModifier: number }
  | { type: 'ENEMY_ATTACK_HIT'; damage: number; blockTriggered: boolean; isFullBlock: boolean }
  | { type: 'ENEMY_ATTACK_BLOCKED' }
  | { type: 'ENEMY_DEFEATED'; nextEnemy: EnemyTemplate }
  | { type: 'USE_SKILL_ATTACK' }
  | { type: 'USE_SKILL_DEFEND' }
  | { type: 'USE_ITEM_HEAL'; amount: number }
  | { type: 'USE_ITEM_CONSUME'; itemId: string }
  | { type: 'TRIGGER_VICTORY' }
  | { type: 'TRIGGER_DEFEAT' }
  | { type: 'SYNC_LEVEL'; level: Level }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'SET_BOSS'; isBoss: boolean };

export const initialBattleState = (level: Level, inventory: Item[] = [], progressContext?: ProgressContext): BattleState => {
  const equippedWeapon = inventory.find(i => i.type === 'WEAPON' && i.isEquipped) || null;
  const equippedShield = inventory.find(i => i.type === 'SHIELD' && i.isEquipped) || null;
  const equippedArmor = inventory.find(i => i.type === 'ARMOR' && i.isEquipped) || null;
  const equippedHelm = inventory.find(i => i.type === 'HELM' && i.isEquipped) || null;
  const equippedAccessory = inventory.find(i => i.type === 'ACCESSORY' && i.isEquipped) || null;

  const stats = computeEquippedStats(inventory);
  const maxHp = 200 + stats.totalHpBonus;

  const initialEnemy = generateEnemy(0, false, progressContext);

  return {
    playerHP: maxHp,
    maxPlayerHP: maxHp,
    enemyHP: initialEnemy.hp,
    maxEnemyHP: initialEnemy.maxHp,
    currentEnemy: initialEnemy,
    currentLevel: level,
    score: 0,
    wordsBeaten: 0,
    enemiesBeaten: 0,
    equipped: {
      weapon: equippedWeapon,
      shield: equippedShield,
      armor: equippedArmor,
      helm: equippedHelm,
      accessory: equippedAccessory,
    },
    actionPoints: 5,
    isShieldActive: false,
    feedback: null,
    shake: false,
    showVictory: false,
    showDefeat: false,
    enemyCooldown: 0,
    inventory,
    isPaused: false,
    isBossActive: false,
  };
};

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  switch (action.type) {
    case 'SYNC_LEVEL':
      return { ...state, currentLevel: action.level };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.paused };
    case 'SET_BOSS':
      return { ...state, isBossActive: action.isBoss };
    case 'ANSWER_CORRECT': {
      const damage = BASE_DAMAGE + action.weaponBonus + (action.critTriggered ? action.weaponBonus : 0);
      return {
        ...state,
        feedback: 'CORRECT',
        enemyHP: Math.max(0, state.enemyHP - damage),
        wordsBeaten: state.wordsBeaten + 1,
        score: state.score + (action.critTriggered ? 200 : 100),
        actionPoints: Math.min(10, state.actionPoints + 1),
      };
    }
    case 'ANSWER_WRONG': {
      const tierAvg = getEquippedTierAvg(state.equipped);
      const scalingDmg = Math.max(10, Math.floor(25 * (1 + tierAvg * 0.15)));
      return {
        ...state,
        feedback: 'WRONG',
        shake: true,
        playerHP: Math.max(0, state.playerHP - scalingDmg),
        actionPoints: 0,
      };
    }
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null, shake: false };
    case 'ENEMY_ATTACK_TICK':
      return { ...state, enemyCooldown: Math.min(100, state.enemyCooldown + (5 * action.speedModifier)) };
    case 'ENEMY_ATTACK_HIT': {
      const defenseBonus = state.equipped.shield?.defenseBonus ?? 0;
      const armorBonus = state.equipped.armor?.defenseBonus ?? 0;
      const helmBonus = state.equipped.helm?.defenseBonus ?? 0;
      const accessoryDef = state.equipped.accessory?.defenseBonus ?? 0;
      const totalDefense = defenseBonus + armorBonus + helmBonus + accessoryDef;
      let finalDamage: number;
      if (action.blockTriggered && action.isFullBlock) {
        finalDamage = 0;
      } else if (action.blockTriggered) {
        finalDamage = Math.max(1, Math.floor(action.damage * 0.5) - totalDefense);
      } else {
        finalDamage = Math.max(1, action.damage - totalDefense);
      }
      return {
        ...state,
        shake: true,
        playerHP: Math.max(0, state.playerHP - finalDamage),
        enemyCooldown: 0,
      };
    }
    case 'ENEMY_ATTACK_BLOCKED':
      return { ...state, feedback: 'SHIELD', isShieldActive: false, enemyCooldown: 0 };
    case 'ENEMY_DEFEATED':
      return {
        ...state,
        enemyHP: action.nextEnemy.hp,
        maxEnemyHP: action.nextEnemy.maxHp,
        currentEnemy: action.nextEnemy,
        enemiesBeaten: state.enemiesBeaten + 1,
        enemyCooldown: 0,
      };
    case 'USE_SKILL_ATTACK': {
      const newEnemyHP = Math.max(0, state.enemyHP - 55);
      return { ...state, actionPoints: Math.max(0, state.actionPoints - 3), enemyHP: newEnemyHP };
    }
    case 'USE_SKILL_DEFEND':
      return { ...state, actionPoints: Math.max(0, state.actionPoints - 2), isShieldActive: true };
    case 'USE_ITEM_HEAL':
      return { ...state, playerHP: Math.min(state.maxPlayerHP, state.playerHP + action.amount) };
    case 'USE_ITEM_CONSUME':
      return {
        ...state,
        inventory: state.inventory.map(i =>
          i.id === action.itemId ? { ...i, count: Math.max(0, (i.count || 1) - 1) } : i
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

function getEquippedTierAvg(equipped: BattleState['equipped']): number {
  const items = [equipped.weapon, equipped.shield, equipped.armor, equipped.helm, equipped.accessory].filter((i): i is Item => !!i && typeof i.tier === 'number');
  if (items.length === 0) return 0;
  return items.reduce((sum, i) => sum + i.tier, 0) / items.length;
}

export const useBattleEngine = (
  level: Level,
  isEndless: boolean | undefined,
  inventory: Item[] = [],
  gameMode: GameMode = 'BELAJAR',
  completedLevels: number = 0
) => {
  const equippedWeapon = inventory.find(i => i.type === 'WEAPON' && i.isEquipped);
  const equippedShield = inventory.find(i => i.type === 'SHIELD' && i.isEquipped);
  const equippedArmor = inventory.find(i => i.type === 'ARMOR' && i.isEquipped);
  const equippedHelm = inventory.find(i => i.type === 'HELM' && i.isEquipped);
  const equippedAccessory = inventory.find(i => i.type === 'ACCESSORY' && i.isEquipped);
  const stats = computeEquippedStats(inventory);
  const tierAvg = getEquippedTierAvg({ weapon: equippedWeapon, shield: equippedShield, armor: equippedArmor, helm: equippedHelm, accessory: equippedAccessory });

  const progressContext: ProgressContext = {
    completedLevels,
    totalLevels: 20,
    equippedAttack: stats.totalAttack,
    equippedDefense: stats.totalDefense,
    equippedMaxHp: stats.totalHpBonus,
    playerTierAvg: tierAvg,
  };

  const [state, dispatch] = useReducer(battleReducer, level, (l) => initialBattleState(l, inventory, progressContext));

  useEffect(() => {
    dispatch({ type: 'SYNC_LEVEL', level });
  }, [level]);

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const isActive = state.playerHP > 0 && state.enemyHP > 0 && !state.showVictory && !state.showDefeat && !state.isPaused;

  const modeModifiers = useMemo(() => {
    switch (gameMode) {
      case 'BELAJAR': return { speedMult: 0.9, damageTakenMult: 0.8 };
      case 'LATIHAN': return { speedMult: 1.4, damageTakenMult: 1.2 };
      case 'TANTANGAN': default: return { speedMult: 1.2, damageTakenMult: 1.0 };
    }
  }, [gameMode]);

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
          const adjustedDamage = Math.max(1, Math.floor(rawDamage * (modeModifiers?.damageTakenMult ?? 1)));
          const critRoll = Math.random() * 100;
          const isFullBlock = false;
          const blockTriggered = false;
          const weaponBlock = currentState.equipped.weapon?.blockChance ?? 0;
          const shieldBlock = currentState.equipped.shield?.blockChance ?? 0;
          const armorBlock = currentState.equipped.armor?.blockChance ?? 0;
          const helmBlock = currentState.equipped.helm?.blockChance ?? 0;
          const accessoryBlock = currentState.equipped.accessory?.blockChance ?? 0;
          const totalBlockChance = weaponBlock + shieldBlock + armorBlock + helmBlock + accessoryBlock;
          const blockRoll = totalBlockChance > 0 ? Math.random() * 100 : 999;
          const isFullBlockRoll = blockRoll < totalBlockChance * 0.35;
          const blockTriggeredFinal = blockRoll < totalBlockChance;
          dispatch({
            type: 'ENEMY_ATTACK_HIT',
            damage: adjustedDamage,
            blockTriggered: blockTriggeredFinal,
            isFullBlock: isFullBlockRoll,
          });
          setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), 500);
        }
      } else {
        const speedModifier = (1.5 + (currentState.currentEnemy.tier * 0.4)) * (modeModifiers?.speedMult ?? 1);
        dispatch({ type: 'ENEMY_ATTACK_TICK', speedModifier });
      }
    }, 500);
    return () => clearInterval(timer);
  }, [isActive, modeModifiers]);

  useEffect(() => {
    if (state.enemyHP <= 0 && !state.showVictory && !state.showDefeat) {
      if (state.isBossActive) {
        dispatch({ type: 'TRIGGER_VICTORY' });
      } else {
        const next = state.enemiesBeaten + 1;
        const newlyGeneratedEnemy = generateEnemy(next, false, progressContext);
        dispatch({ type: 'ENEMY_DEFEATED', nextEnemy: newlyGeneratedEnemy });
      }
    }
  }, [state.enemyHP, state.showVictory, state.showDefeat, state.enemiesBeaten, state.isBossActive, progressContext]);

  useEffect(() => {
    if (state.playerHP <= 0 && !state.showDefeat) {
      dispatch({ type: 'TRIGGER_DEFEAT' });
    }
  }, [state.playerHP, state.showDefeat]);

  const answerWord = (isCorrect: boolean) => {
    if (isCorrect) {
      const weaponBonus = state.equipped.weapon?.attackBonus ?? 0;
      const critChance = state.equipped.weapon?.critChance ?? 0;
      const critTriggered = Math.random() * 100 < critChance;
      dispatch({ type: 'ANSWER_CORRECT', weaponBonus, critTriggered });
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
    }
    setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), 600);
  };

  const useAttackSkill = () => {
    if (state.actionPoints >= 3 && state.enemyHP > 0) {
      dispatch({ type: 'USE_SKILL_ATTACK' });
    }
  };

  const useDefendSkill = () => {
    if (state.actionPoints >= 2 && !state.isShieldActive) {
      dispatch({ type: 'USE_SKILL_DEFEND' });
    }
  };

  const healPlayer = (amount: number) => {
    dispatch({ type: 'USE_ITEM_HEAL', amount });
  };

  const consumeItem = (itemId: string) => {
    dispatch({ type: 'USE_ITEM_CONSUME', itemId });
  };

  const triggerVictory = () => dispatch({ type: 'TRIGGER_VICTORY' });
  const triggerDefeat = () => dispatch({ type: 'TRIGGER_DEFEAT' });

  const setPaused = (paused: boolean) => dispatch({ type: 'SET_PAUSED', paused });
  const setBoss = (isBoss: boolean) => dispatch({ type: 'SET_BOSS', isBoss });

  return {
    state,
    actions: {
      answerWord,
      useAttackSkill,
      useDefendSkill,
      healPlayer,
      consumeItem,
      triggerVictory,
      triggerDefeat,
      setPaused,
      setBoss,
    },
  };
};
