import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface HomeProps {
  onStart: (page: Page) => void;
  username: string;
  onSetUsername: (name: string) => void;
  onResetData: () => void;
}

export const Home = ({ onStart, username, onSetUsername, onResetData }: HomeProps) => {
  const [isEnteringName, setIsEnteringName] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleNewGameClick = () => {
    if (username) {
      setShowConfirmReset(true);
    } else {
      setIsEnteringName(true);
    }
  };

  const handleConfirmReset = (confirm: boolean) => {
    if (confirm) {
      onResetData();
      setInputValue('');
      setShowConfirmReset(false);
      setIsEnteringName(true);
    } else {
      setShowConfirmReset(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSetUsername(inputValue.trim());
      onStart('MODE_SELECT');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.5)]">
            KOTOBA QUEST
          </h2>
          <p className="text-white/60 tracking-[0.2em] uppercase text-sm">
            Master the language. Win the battle.
          </p>
        </div>

        <div className="py-12 min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showConfirmReset ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6 max-w-sm"
              >
                <p className="text-neon-pink font-bold uppercase tracking-widest text-sm border border-neon-pink p-4 bg-neon-pink/10">
                  Memulai game baru akan menimpa data sebelumnya. Lanjutkan?
                </p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => handleConfirmReset(true)}
                    className="px-8 py-2 bg-neon-pink text-dark-bg font-black uppercase tracking-widest hover:bg-neon-pink/90 transition-colors"
                  >
                    IYA
                  </button>
                  <button 
                    onClick={() => handleConfirmReset(false)}
                    className="px-8 py-2 border border-white/40 text-white/60 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                  >
                    TIDAK
                  </button>
                </div>
              </motion.div>
            ) : isEnteringName ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 items-center w-full max-w-xs"
              >
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="ENTER USERNAME"
                  className="w-full bg-dark-surface border-2 border-neon-cyan px-6 py-3 text-center font-mono text-xl uppercase tracking-widest text-neon-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                  autoFocus
                  maxLength={15}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full px-8 py-3 bg-neon-cyan text-dark-bg font-black tracking-widest uppercase disabled:opacity-50 transition-opacity hover:opacity-90"
                >
                  Mulai
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 w-full max-w-xs"
              >
                {username && (
                  <button 
                    onClick={() => onStart('MODE_SELECT')}
                    className="group relative px-12 py-4 bg-transparent border-2 border-neon-cyan overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                  >
                    <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 font-black text-xl tracking-widest uppercase group-hover:text-dark-bg transition-colors">
                      Lanjutkan
                    </span>
                  </button>
                )}
                <button 
                  onClick={handleNewGameClick}
                  className={`px-12 py-4 font-black text-xl tracking-widest uppercase transition-all ${
                    username 
                      ? 'text-white/40 border border-white/10 hover:text-white hover:border-white/40' 
                      : 'group relative bg-transparent border-2 border-neon-cyan overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                  }`}
                >
                  {!username && <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                  <span className={`relative z-10 ${!username ? 'group-hover:text-dark-bg' : ''}`}>
                    Permainan Baru
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
