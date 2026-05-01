import { motion } from 'motion/react';
import { Zap, Sword, Shield } from 'lucide-react';
import { memo } from 'react';

interface PlayerPanelProps {
  hp: number;
  maxHp: number;
  skillPoints: number;
  enemyHP: number;
  isShieldActive: boolean;
  onUseAttack: () => void;
  onUseDefend: () => void;
}

export const PlayerPanel = memo(({ hp, maxHp, skillPoints, enemyHP, isShieldActive, onUseAttack, onUseDefend }: PlayerPanelProps) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="battle-panel battle-panel--player fixed md:static bottom-[64px] left-0 right-0 md:bottom-auto z-40 md:col-span-4 md:h-fit">
      <div className="space-y-4 max-w-md md:max-w-none mx-auto px-4 md:px-0">
        <HPBar label="PLAYER HP" percent={hpPercent} color="bg-main" count={`${hp} / ${maxHp}`} />

        <div className="skill-section">
          <div className="flex justify-between items-end mb-2">
            <h4 className="skill-label">
              <Zap className="w-3 h-3 md:w-4 md:h-4" /> SKILL POINTS
            </h4>
            <span className="skill-value">{skillPoints}</span>
          </div>

          <div className="sp-bar-bg">
            <div className="sp-bar-fill" style={{width: `${skillPoints}%`}} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 pt-1">
            <SkillButton
              icon={Sword}
              label="Zen Slash"
              cost="30 SP"
              color="red"
              disabled={skillPoints < 30 || enemyHP <= 0}
              onClick={onUseAttack}
            />
            <SkillButton
              icon={Shield}
              label="Neon Guard"
              cost="20 SP"
              color="cyan"
              disabled={skillPoints < 20 || isShieldActive}
              onClick={onUseDefend}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

interface HPBarProps {
  label: string;
  percent: number;
  color: string;
  count: string;
}

const HPBar = ({ label, percent, color, count }: HPBarProps) => (
  <div className="flex-1">
    <div className="flex justify-between items-end mb-1.5">
      <h3 className="text-xs md:text-sm font-black uppercase text-main leading-none">{label}</h3>
      <span className="hp-count">{count}</span>
    </div>
    <div className="hp-bar">
      <motion.div
        className={`hp-bar-fill ${color}`}
        animate={{ width: `${percent}%`}}
        transition={{duration: 0.3}}
      />
    </div>
  </div>
);

interface SkillButtonProps {
  icon: React.ElementType;
  label: string;
  cost: string;
  color: 'red' | 'cyan';
  disabled: boolean;
  onClick: () => void;
}

const SkillButton = ({ icon: Icon, label, cost, color, disabled, onClick }: SkillButtonProps) => {
  const colorClasses = color === 'red'
    ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
    : 'border-main/40 bg-main/10 text-main hover:bg-main/20';

  // Glow effect when skill is ready (not disabled)
  const glowStyle = !disabled ? (color === 'red'
    ? { boxShadow: '0 0 12px rgba(239, 68, 68, 0.7)' }
    : { boxShadow: '0 0 12px rgba(0, 156, 255, 0.7)' })
    : undefined;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`skill-button border ${colorClasses}`}
      style={glowStyle}
    >
      <Icon className="w-3.5 h-3.5 md:w-5 md:h-5" /> {label} <span className="opacity-50">{cost}</span>
    </button>
  );
};
