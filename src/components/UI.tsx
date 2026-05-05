import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface HPBarProps {
  current: number;
  max: number;
  label: string;
  color: string;
}

export const HPBar = ({ current, max, label, color }: HPBarProps) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-secondary">{label}</span>
        <span className="text-xs md:text-sm font-mono text-text-secondary">{current}/{max}</span>
      </div>
      <div className="hp-bar">
        <motion.div
          className={`hp-bar-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const NavButton = ({ icon, label, active, disabled, onClick }: NavButtonProps) => (
  <motion.button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all ${
      active
        ? 'text-main'
        : 'text-text-secondary hover:text-text-primary'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    <div className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl transition-all ${
      active
        ? 'bg-main/10 border border-main/30 shadow-[0_0_8px_rgba(0,156,255,0.25)]'
        : 'hover:bg-text-primary/5'
    }`}>
      {icon}
    </div>
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{label}</span>
  </motion.button>
);
