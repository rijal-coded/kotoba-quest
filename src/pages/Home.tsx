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

  // Pre-computed class strings — avoids inline ternary logic inside JSX
  const primaryBtnClass =
    'w-full px-12 py-4 bg-main text-bg-primary font-black text-xl tracking-widest uppercase rounded-xl shadow-[0_4px_20px_rgba(0,156,255,0.3)] hover:brightness-110 transition-all';
  const secondaryBtnClass =
    'w-full px-12 py-4 border border-main/15 text-text-secondary font-black text-xl tracking-widest uppercase rounded-xl hover:text-text-primary hover:border-main/30 transition-all';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 w-full max-w-sm"
      >
        <div className="space-y-3">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-main drop-shadow-[0_0_20px_rgba(0,156,255,0.3)]">
            KOTOBA QUEST
          </h2>
          <p className="text-text-secondary tracking-[0.2em] uppercase text-sm">
            Master the language. Win the battle.
          </p>
        </div>

        <div className="py-8 min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showConfirmReset ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-5 w-full"
              >
                <p className="text-neon-pink font-bold uppercase tracking-widest text-sm border border-neon-pink/40 p-4 bg-neon-pink/10 rounded-2xl leading-relaxed">
                  Memulai game baru akan menimpa data sebelumnya. Lanjutkan?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleConfirmReset(true)}
                    className="flex-1 px-8 py-3 bg-neon-pink text-bg-primary font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all"
                  >
                    IYA
                  </button>
                  <button
                    onClick={() => handleConfirmReset(false)}
                    className="flex-1 px-8 py-3 border border-main/15 text-text-secondary font-bold uppercase tracking-widest rounded-xl hover:text-text-primary hover:border-main/30 transition-all"
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
                className="flex flex-col gap-4 items-center w-full"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="ENTER USERNAME"
                  className="w-full bg-bg-surface border-2 border-main/50 px-6 py-3 rounded-xl text-center font-mono text-xl uppercase tracking-widest text-main focus:outline-none focus:border-main focus:shadow-[0_0_15px_rgba(0,156,255,0.2)] transition-all"
                  autoFocus
                  maxLength={15}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full px-8 py-3 bg-main text-bg-primary font-black tracking-widest uppercase disabled:opacity-50 transition-all rounded-xl hover:brightness-110 shadow-[0_4px_15px_rgba(0,156,255,0.3)]"
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
                className="flex flex-col gap-4 w-full"
              >
                {username && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStart('MODE_SELECT')}
                    className={primaryBtnClass}
                  >
                    Lanjutkan
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewGameClick}
                  className={username ? secondaryBtnClass : primaryBtnClass}
                >
                  Permainan Baru
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
