import { motion } from 'motion/react';
import { Target, Sparkles } from 'lucide-react';
import { EnemyTemplate } from '../../utils/enemyUtils';
import { useMemo } from 'react';

interface EnemyPanelProps {
  enemy: EnemyTemplate;
  currentHP: number;
  cooldownPercentage: number;
}

function getHPBarClass(percent: number): string {
  if (percent <= 20) return 'kawaii-hp-fill--danger';
  if (percent <= 40) return 'kawaii-hp-fill--low';
  if (percent <= 70) return 'kawaii-hp-fill--mid';
  return 'kawaii-hp-fill--high';
}

export const EnemyPanel = ({ enemy, currentHP, cooldownPercentage }: EnemyPanelProps) => {
  const hpPercent = Math.max(0, Math.min(100, (currentHP / enemy.maxHp) * 100));
  const hpBarClass = useMemo(() => getHPBarClass(hpPercent), [hpPercent]);
  const isBoss = enemy.tier >= 4;

  return (
    <div className="kawaii-panel sticky md:static top-[61px] z-30 md:col-span-12">
      {/* Decorative sparkle */}
      <div className="absolute top-3 right-3 opacity-20">
        <Sparkles className="w-4 h-4 text-main" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 max-w-md md:max-w-none mx-auto">
        <div className="flex-1 w-full space-y-3">
          {/* Enemy Header */}
          <div className="flex justify-between items-end gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xl md:text-3xl font-bold leading-none tracking-tight ${
                  isBoss ? 'text-danger' : 'text-main'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {enemy.name}
              </motion.h3>
              <span className="kawaii-badge kawaii-badge--neutral">
                {enemy.rank}
              </span>
            </div>
            <motion.span
              key={currentHP}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-sm md:text-lg font-mono font-bold text-text-primary"
            >
              {currentHP} / {enemy.maxHp}
            </motion.span>
          </div>

          {/* HP Bar */}
          <div className="kawaii-hp-bar">
            <motion.div
              className={`kawaii-hp-fill ${hpBarClass}`}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Intent Display */}
        <div className="w-full md:w-auto min-w-[120px] md:min-w-48 space-y-1">
          <div className="flex items-center justify-start gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Intent</span>
            <span className="ml-auto font-mono text-main">{Math.round(cooldownPercentage)}%</span>
          </div>
          <div className="kawaii-hp-bar">
            <motion.div
              className="kawaii-hp-fill kawaii-hp-fill--danger"
              animate={{ width: `${cooldownPercentage}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ height: '0.5rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
