import { motion } from 'motion/react';
import { XCircle } from 'lucide-react';

interface DefeatScreenProps {
  onRetry: () => void;
}

export const DefeatScreen = ({ onRetry }: DefeatScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="space-y-4"
      >
        <XCircle className="w-20 h-20 text-neon-pink mx-auto drop-shadow-[0_0_20px_rgba(217,70,239,0.6)]" />
        <h2 className="text-4xl font-black text-neon-pink uppercase tracking-widest drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">GAGAL</h2>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-12 py-4 border-2 border-neon-pink text-neon-pink font-black uppercase tracking-widest rounded-2xl hover:bg-neon-pink/10 transition-all"
      >
        Kembali
      </motion.button>
    </div>
  );
};
