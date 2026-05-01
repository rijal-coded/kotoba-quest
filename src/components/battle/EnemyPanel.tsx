import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { EnemyTemplate } from '../../utils/enemyUtils';

interface EnemyPanelProps {
  enemy: EnemyTemplate;
  currentHP: number;
  cooldownPercentage: number;
}

export const EnemyPanel = ({ enemy, currentHP, cooldownPercentage }: EnemyPanelProps) => {
  const hpPercent = Math.max(0, Math.min(100, (currentHP / enemy.maxHp) * 100));
  const tierColor = enemy.tier === 5 ? 'bg-neon-pink' : 'bg-accent';
  const nameColor =
    enemy.tier === 5 ? 'text-neon-pink' :
    enemy.tier >= 4 ? 'text-main' : 'text-red-400';

  return (
    <div className="battle-panel battle-panel--enemy sticky md:static top-[73px] z-30 md:col-span-12">
      <div className="flex items-center gap-4 max-w-md md:max-w-none mx-auto">
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm md:text-lg font-black uppercase leading-none ${nameColor}`}>{enemy.name}</h3>
              <span className="text-[8px] md:text-xs font-bold px-2 py-0.5 bg-text-primary/10 text-text-secondary rounded-full">{enemy.rank}</span>
            </div>
            <span className="hp-count">{currentHP} / {enemy.maxHp} HP</span>
          </div>
          <HPBar percent={hpPercent} color={tierColor} />
        </div>

        <div className="w-24 md:w-48">
          <div className="intent-display flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 md:w-4 md:h-4"/> Intent
            </div>
            <span className="text-xs font-black text-main">{Math.round(cooldownPercentage)}%</span>
          </div>
          <HPBar percent={cooldownPercentage} color="bg-red-500" variant="cooldown" />
        </div>
      </div>
    </div>
  );
};

interface HPBarProps {
  percent: number;
  color: string;
  variant?: 'default' | 'cooldown';
}

const HPBar = ({ percent, color, variant = 'default' }: HPBarProps) => (
  <div className={`hp-bar ${variant === 'cooldown' ? 'hp-bar--cooldown' : ''}`}>
    <motion.div
      className={`hp-bar-fill ${color}`}
      animate={{ width: `${percent}%`}}
      transition={{duration: 0.3}}
    />
  </div>
);
