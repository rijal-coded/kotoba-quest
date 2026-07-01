import { motion } from 'motion/react';
import { Zap, Sword, Shield, Heart, Sparkles } from 'lucide-react';
import { memo, useMemo } from 'react';

interface PlayerPanelProps {
  hp: number;
  maxHp: number;
  actionPoints: number;
  enemyHP: number;
  isShieldActive: boolean;
  onUseAttack: () => void;
  onUseDefend: () => void;
}

function getHPBarClass(percent: number): string {
  if (percent <= 20) return 'kawaii-hp-fill--danger';
  if (percent <= 40) return 'kawaii-hp-fill--low';
  if (percent <= 70) return 'kawaii-hp-fill--mid';
  return 'kawaii-hp-fill--high';
}

export const PlayerPanel = memo(({ hp, maxHp, actionPoints, enemyHP, isShieldActive, onUseAttack, onUseDefend }: PlayerPanelProps) => {
  const hpPercent = Math.max(0, Math.min(100, maxHp > 0 ? (hp / maxHp) * 100 : 0));
  const hpBarClass = useMemo(() => getHPBarClass(hpPercent), [hpPercent]);

  return (
    <div className="kawaii-panel relative z-40 md:col-span-4">
      <div className="absolute top-3 right-3 opacity-20">
        <Sparkles className="w-4 h-4 text-main" />
      </div>

      <div className="relative z-10 space-y-5 md:space-y-6 max-w-md md:max-w-none mx-auto">
        {/* HP Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-danger" />
            </div>
            <motion.span
              key={hp}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-xl md:text-2xl font-mono font-bold text-text-primary"
            >
              {hp} / {maxHp}
            </motion.span>
          </div>
          <div className="kawaii-hp-bar">
            <motion.div
              className={`kawaii-hp-fill ${hpBarClass}`}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action Points Section */}
        <div className="space-y-3 p-4 rounded-2xl bg-bg-surface-alt border border-border">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-secondary" />
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                AP
              </h4>
            </div>
            <motion.span
              key={actionPoints}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-3xl font-mono font-bold text-secondary"
            >
              {actionPoints}/10
            </motion.span>
          </div>

          {/* AP Dots */}
          <div className="flex gap-1.5 mb-3">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < actionPoints
                    ? 'bg-secondary shadow-[0_0_6px_rgba(100,200,255,0.5)]'
                    : 'bg-bg-surface'
                }`}
              />
            ))}
          </div>

          {/* Skill Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 pt-2">
            <SkillButton
              icon={Sword}
              label="Zen Slash"
              cost="3 AP"
              disabled={actionPoints < 3 || enemyHP <= 0}
              onClick={onUseAttack}
              isReady={actionPoints >= 3 && enemyHP > 0}
              variant="danger"
            />
            <SkillButton
              icon={Shield}
              label="Neon Guard"
              cost="2 AP"
              disabled={actionPoints < 2 || isShieldActive}
              onClick={onUseDefend}
              isReady={actionPoints >= 2 && !isShieldActive}
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

interface SkillButtonProps {
  icon: React.ElementType;
  label: string;
  cost: string;
  disabled: boolean;
  onClick: () => void;
  isReady: boolean;
  variant: 'danger' | 'primary';
}

const SkillButton = ({ icon: Icon, label, cost, disabled, onClick, isReady, variant }: SkillButtonProps) => {
  const variantClasses = variant === 'danger'
    ? 'border-danger/30 text-danger hover:bg-danger/5'
    : 'border-main/30 text-main hover:bg-main/5';

  return (
    <motion.button
      whileHover={isReady ? { scale: 1.02 } : {}}
      whileTap={isReady ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <span className="text-[10px] opacity-60 font-mono">{cost}</span>
    </motion.button>
  );
};
