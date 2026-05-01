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
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{label}</span>
        <span className="text-[10px] font-mono text-text-secondary">{current}/{max}</span>
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
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-main' : 'text-text-secondary hover:text-text-primary'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    <div className={`${active ? 'drop-shadow-[0_0_6px_rgba(0,156,255,0.6)]' : ''} transition-all`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);
