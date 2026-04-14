import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Level } from '../types';

interface LevelSelectProps {
  levels: Level[];
  onSelect: (level: Level) => void;
}

export const LevelSelect = ({ levels, onSelect }: LevelSelectProps) => {
  return (
    <div className="p-6 pb-24 md:pb-6 space-y-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-black text-center uppercase text-neon-blue drop-shadow-[0_0_2px_rgba(59,130,246,0.5)] tracking-widest">
        DAFTAR LEVEL
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level, index) => {
          const IconComponent = (Icons as any)[level.icon] || Icons.HelpCircle;
          
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(level)}
              className="w-full bg-dark-surface border border-white/10 p-4 flex items-center gap-6 group hover:border-neon-cyan/50 transition-all"
            >
              <div className="w-16 h-16 shrink-0 bg-dark-bg border border-white/5 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                <IconComponent className="w-8 h-8" />
              </div>
              
              <div className="flex-1 text-left space-y-1">
                <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-neon-cyan transition-colors">
                  {level.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase ${level.isCompleted ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-white/30'}`}>
                    {level.isCompleted ? (
                      <><Icons.CheckCircle2 className="w-3 h-3" /> SELESAI</>
                    ) : (
                      <><Icons.XCircle className="w-3 h-3" /> BELUM SELESAI</>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 text-white/40 text-[10px] font-bold">
                    <Icons.Clock className="w-3 h-3" /> {level.bestTime > 0 ? `${Math.floor(level.bestTime / 60)}:${(level.bestTime % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                </div>
              </div>
              
              <Icons.ChevronRight className="w-6 h-6 shrink-0 text-white/20 group-hover:text-neon-cyan transition-colors" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
