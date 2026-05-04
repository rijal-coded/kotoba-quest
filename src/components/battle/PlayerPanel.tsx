import { motion } from 'motion/react';
import { Zap, Sword, Shield, Heart } from 'lucide-react';
import { memo, useEffect, useState, useRef } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';

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
  const [hpFeedback, setHpFeedback] = useState<'damage' | 'heal' | null>(null);
  const { feedback: attackFeedback, trigger: triggerAttackFeedback } = useActionFeedback();
  const prevHpRef = useRef(hp);

  // HP change feedback
  useEffect(() => {
    if (hp < prevHpRef.current) {
      setHpFeedback('damage');
    } else if (hp > prevHpRef.current) {
      setHpFeedback('heal');
    }
    prevHpRef.current = hp;
  }, [hp]);

  // Clear HP feedback after animation
  useEffect(() => {
    if (hpFeedback) {
      const timer = setTimeout(() => setHpFeedback(null), 300);
      return () => clearTimeout(timer);
    }
  }, [hpFeedback]);

  return (
    <div className={`battle-panel battle-panel--player relative overflow-hidden z-40 md:col-span-4 ${isShieldActive ? 'shield-active' : ''} ${hpPercent < 30 ? 'critical-hp' : ''}`}>
      {/* Decorative corner brackets */}
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

      {/* Flash overlays for feedback */}
      {hpFeedback === 'damage' && <div className="flash-overlay flash-overlay--damage" />}
      {hpFeedback === 'heal' && <div className="flash-overlay flash-overlay--heal" />}
      {attackFeedback === 'attack' && <div className="flash-overlay flash-overlay--attack" />}

      <div className="relative z-10 space-y-5 md:space-y-6 max-w-md md:max-w-none mx-auto px-4 md:px-0">
        {/* HP Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-main" />
              <h3 className="text-sm md:text-base font-black uppercase text-main tracking-wider">PLAYER HP</h3>
            </div>
            <motion.span
              key={hp}
              initial={{ scale: 1.2, color: 'var(--accent)' }}
              animate={{ scale: 1, color: 'var(--main)' }}
              transition={{ duration: 0.2 }}
              className="text-lg md:text-xl font-mono font-bold text-main"
            >
              {hp} / {maxHp}
            </motion.span>
          </div>
          <HPBar percent={hpPercent} color="bg-main" />
        </div>

        {/* Skill Points Section */}
        <div className="skill-section">
          <div className="flex justify-between items-end mb-3">
            <h4 className="skill-label">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-main" /> SP
            </h4>
            <motion.span
              key={skillPoints}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="skill-value text-2xl md:text-3xl font-mono font-bold text-main"
            >
              {skillPoints}
            </motion.span>
          </div>

          <div className="sp-bar-bg">
            <motion.div
              className="sp-bar-fill"
              animate={{ width: `${skillPoints}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Skill Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 pt-2">
            <SkillButton
              icon={Sword}
              label="Zen Slash"
              cost="30 SP"
              attack
              disabled={skillPoints < 30 || enemyHP <= 0}
              onClick={() => {
                onUseAttack();
                triggerAttackFeedback('attack');
              }}
              isReady={skillPoints >= 30 && enemyHP > 0}
            />
            <SkillButton
              icon={Shield}
              label="Neon Guard"
              cost="20 SP"
              disabled={skillPoints < 20 || isShieldActive}
              onClick={() => {
                onUseDefend();
                // Defend action visual is shield border via isShieldActive prop
              }}
              isReady={skillPoints >= 20 && !isShieldActive}
            />
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="scanline text-main/5" />
    </div>
  );
});

interface HPBarProps {
  percent: number;
  color: string;
}

const HPBar = ({ percent, color }: HPBarProps) => (
  <div className="hp-bar">
    <motion.div
      className={`hp-bar-fill ${color} glow-cyan`}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </div>
);

interface SkillButtonProps {
  icon: React.ElementType;
  label: string;
  cost: string;
  attack?: boolean;
  disabled: boolean;
  onClick: () => void;
  isReady: boolean;
}

const SkillButton = ({ icon: Icon, label, cost, attack, disabled, onClick, isReady }: SkillButtonProps) => {
  const colorClasses = attack
    ? 'border-red-500/50 bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:border-red-500/60'
    : 'border-main/50 bg-main/15 text-main hover:bg-main/25 hover:border-main/60';

  const glowStyle = isReady ? (attack
    ? { boxShadow: 'var(--glow-red)' }
    : { boxShadow: 'var(--glow-cyan)' })
    : undefined;

  return (
    <motion.button
      whileHover={isReady ? { scale: 1.02 } : {}}
      whileTap={isReady ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`skill-button border ${colorClasses} relative overflow-hidden group`}
      style={glowStyle}
    >
      {/* Inner glow effect */}
      {isReady && (
        <div className={`absolute inset-0 ${attack ? 'bg-red-500/10' : 'bg-main/10'} opacity-0 group-hover:opacity-100 transition-opacity`} />
      )}
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <span className="font-bold tracking-wider">{label}</span>
      <span className="opacity-60 text-xs font-mono">{cost}</span>
    </motion.button>
  );
};
