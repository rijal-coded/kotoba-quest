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
  const tierColor = enemy.tier === 5 ? 'text-neon-pink' : 'neon-text-cyan';
  const barColor = enemy.tier === 5 ? 'bg-neon-pink' : 'bg-accent';

  return (
    <div className="battle-panel battle-panel--enemy sticky md:static top-[73px] z-30 md:col-span-12 relative overflow-hidden">
      {/* Decorative corner brackets */}
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 max-w-md md:max-w-none mx-auto px-2 md:px-0">
        <div className="flex-1 w-full space-y-3">
          {/* Enemy Header */}
          <div className="flex justify-between items-end gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-lg md:text-2xl font-black uppercase leading-none ${tierColor} tracking-wider`}
              >
                {enemy.name}
              </motion.h3>
              <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 bg-text-primary/10 text-text-secondary rounded-full border border-text-primary/20">
                {enemy.rank}
              </span>
            </div>
            <motion.span
              key={currentHP}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="hp-count text-sm md:text-lg font-mono font-bold text-main"
            >
              {currentHP} / {enemy.maxHp} HP
            </motion.span>
          </div>

          {/* HP Bar */}
          <HPBar percent={hpPercent} color={barColor} />
        </div>

        {/* Intent Display */}
        <div className="w-full md:w-auto min-w-[120px] md:min-w-48 space-y-1">
          <div className="intent-display justify-start gap-2">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-main" />
            <span className="text-xs md:text-sm font-black text-main uppercase tracking-widest">INTENT</span>
            <span className="ml-auto text-sm md:text-lg font-black text-main">{Math.round(cooldownPercentage)}%</span>
          </div>
          <HPBar percent={cooldownPercentage} color="bg-red-500" variant="cooldown" />
        </div>
      </div>

      {/* Scanline effect */}
      <div className="scanline text-main/5" />
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
      className={`hp-bar-fill ${color} ${variant !== 'cooldown' ? 'glow-cyan' : 'glow-red'}`}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </div>
);
