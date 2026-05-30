import { motion } from 'motion/react';
import { Page, GameMode } from '../types';
import { Sparkles, Leaf, Flame, Zap } from 'lucide-react';

interface ModeSelectProps {
  onSelectMode: (mode: GameMode) => void;
  onNavigate: (page: Page) => void;
}

interface ModeConfig {
  mode: GameMode;
  label: string;
  difficulty: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'BELAJAR',
    label: 'Belajar',
    difficulty: 'Mudah',
    description: 'Belajar dengan tenang. Lihat kartu kata baru, musuh yang lambat, dan AP yang mengalir deras.',
    icon: <Leaf className="w-6 h-6" />,
    colorClass: 'border-accent/40 hover:border-accent text-accent hover:bg-accent/5',
  },
  {
    mode: 'LATIHAN',
    label: 'Latihan',
    difficulty: 'Sulit',
    description: 'Uji kemampuan tanpa petunjuk. Serangan musuh lebih cepat, AP lebih sulit didapat.',
    icon: <Flame className="w-6 h-6" />,
    colorClass: 'border-danger/40 hover:border-danger text-danger hover:bg-danger/5',
  },
  {
    mode: 'TANTANGAN',
    label: 'Tantangan',
    difficulty: 'Tantangan',
    description: 'Pilih level yang sudah kamu kuasai dan hadapi skala kesulitan tanpa batas.',
    icon: <Zap className="w-6 h-6" />,
    colorClass: 'border-secondary/40 hover:border-secondary text-secondary hover:bg-secondary/5',
  },
];

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
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-main" />
            <h2 className="text-3xl md:text-5xl font-bold text-main"
              style={{ fontFamily: 'var(--font-display)' }}>
              Pilih Mode
            </h2>
            <Sparkles className="w-5 h-5 text-main" />
          </div>
          <p className="text-text-secondary text-sm">
            Tentukan tingkat kesulitanmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {MODES.map((modeConfig) => (
            <motion.button
              key={modeConfig.mode}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(modeConfig.mode)}
              className={`group p-8 kawaii-card text-left border-2 transition-all ${modeConfig.colorClass}`}
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {modeConfig.icon}
                  <span className="kawaii-badge kawaii-badge--neutral">
                    {modeConfig.difficulty}
                  </span>
                </div>

                <span className="text-3xl md:text-4xl font-bold text-text-primary"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {modeConfig.label}
                </span>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {modeConfig.description}
                </p>

                <div className="flex items-center gap-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity text-current">
                  Mulai →
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
