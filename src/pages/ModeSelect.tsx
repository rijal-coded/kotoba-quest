import { motion } from 'motion/react';
import { Page, GameMode } from '../types';

interface ModeSelectProps {
  onSelectMode: (mode: GameMode) => void;
  onNavigate: (page: Page) => void;
}

// Color mapping for Tailwind compatibility (avoids dynamic class issue)
const colorClasses = {
  accent: {
    border: 'border-accent/40',
    borderHover: 'hover:border-accent',
    bg: 'bg-accent/5',
    bgHover: 'group-hover:bg-accent/10',
    badgeBg: 'bg-accent/20',
    badgeText: 'text-accent',
    text: 'text-accent',
    buttonText: 'text-accent',
  },
  'neon-pink': {
    border: 'border-neon-pink/40',
    borderHover: 'hover:border-neon-pink',
    bg: 'bg-neon-pink/5',
    bgHover: 'group-hover:bg-neon-pink/10',
    badgeBg: 'bg-neon-pink/20',
    badgeText: 'text-neon-pink',
    text: 'text-neon-pink',
    buttonText: 'text-neon-pink',
  },
  main: {
    border: 'border-main/40',
    borderHover: 'hover:border-main',
    bg: 'bg-main/5',
    bgHover: 'group-hover:bg-main/10',
    badgeBg: 'bg-main/20',
    badgeText: 'text-main',
    text: 'text-main',
    buttonText: 'text-main',
  },
} as const;

type ColorKey = keyof typeof colorClasses;

interface ModeCardProps {
  mode: GameMode;
  label: string;
  difficulty: string;
  description: string;
  color: ColorKey;
  shadowRgb: string;
  onClick: () => void;
}

const ModeCard = ({ label, difficulty, description, color, shadowRgb, onClick }: ModeCardProps) => {
  const colors = colorClasses[color];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative p-8 bg-bg-surface border-2 ${colors.border} rounded-2xl overflow-hidden transition-all ${colors.borderHover} text-left`}
      style={{ boxShadow: `0 0 30px rgba(${shadowRgb},0.2)` } as React.CSSProperties}
    >
      {/* Hover background shimmer */}
      <div className={`absolute inset-0 ${colors.bg} ${colors.bgHover} transition-colors duration-300 rounded-2xl`} />

      <div className="relative z-10 flex flex-col gap-4">
        <span className={`self-start px-3 py-1 text-[10px] font-black uppercase tracking-widest ${colors.badgeBg} ${colors.badgeText} rounded-full`}>
          {difficulty}
        </span>

        <span className={`text-4xl md:text-5xl font-black tracking-widest uppercase text-text-primary ${colors.text} group-hover:${colors.text} transition-colors`}>
          {label}
        </span>

        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>

        <div className={`flex items-center gap-2 ${colors.buttonText} font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>
          Mulai →
        </div>
      </div>
    </motion.button>
  );
};

// --- Config data — single source of truth for mode definitions ---
const MODES: Omit<ModeCardProps, 'onClick'>[] = [
  {
    mode: 'LEARNING',
    label: 'LEARNING',
    difficulty: 'EASY',
    description: 'Belajar dengan tenang. Dapatkan petunjuk, musuh yang lambat, dan SP yang mengalir deras. Cocok untuk pemula.',
    color: 'accent',
    shadowRgb: '73,248,155',
  },
  {
    mode: 'PRACTICE',
    label: 'PRACTICE',
    difficulty: 'HARD',
    description: 'Uji kemiripan tanpa petunjuk. Serangan musuh lebih cepat, SP lebih sulit didapat. Tantangan sesungguhnya!',
    color: 'neon-pink',
    shadowRgb: '217,70,239',
  },
  {
    mode: 'TANTANGAN',
    label: 'TANTANGAN',
    difficulty: 'CHALLENGE',
    description: 'Pilih level yang sudah kamu kuasai dan hadapi skala kesulitan tanpa batas. Batasi hanya level yang telah selesai.',
    color: 'main',
    shadowRgb: '0,156,255',
  },
];

// --- Page component ---
export const ModeSelect = ({ onSelectMode, onNavigate }: ModeSelectProps) => {
  const handleSelect = (mode: GameMode) => {
    onSelectMode(mode);
    onNavigate('LEVEL_SELECT');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 max-w-2xl w-full"
      >
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-main">
            PILIH MODE
          </h2>
          <p className="text-text-secondary tracking-[0.2em] uppercase text-sm">
            Tentukan tingkat kesulitanmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {MODES.map((modeConfig) => (
            <ModeCard
              key={modeConfig.mode}
              {...modeConfig}
              onClick={() => handleSelect(modeConfig.mode)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
