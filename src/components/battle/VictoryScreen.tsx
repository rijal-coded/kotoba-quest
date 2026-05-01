import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

interface VictoryScreenProps {
  onContinue: () => void;
}

export const VictoryScreen = ({ onContinue }: VictoryScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="space-y-4"
      >
        <CheckCircle className="w-20 h-20 text-accent mx-auto drop-shadow-[0_0_20px_rgba(73,248,155,0.6)]" />
        <h2 className="text-4xl font-black text-accent uppercase tracking-widest drop-shadow-[0_0_8px_rgba(73,248,155,0.5)]">
          LEVEL SELESAI
        </h2>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="px-12 py-4 bg-accent text-bg-primary font-black uppercase tracking-widest rounded-2xl shadow-[0_4px_20px_rgba(73,248,155,0.3)] hover:brightness-110 transition-all"
      >
        Lanjut
      </motion.button>
    </div>
  );
};
