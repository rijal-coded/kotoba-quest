import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';
import { Sparkles, Star } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center relative">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-main/10"
            animate={{ y: [-10, -40], opacity: [0, 0.5, 0], rotate: [0, 180] }}
            transition={{ duration: 3 + i * 0.5, delay: i * 0.4, repeat: Infinity }}
            style={{ left: `${10 + i * 11}%`, top: '70%' }}
          >
            <Star className="w-3 h-3" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 w-full max-w-sm relative z-10"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-main" />
            <h2 className="text-4xl md:text-6xl font-bold text-main"
              style={{ fontFamily: 'var(--font-display)' }}>
              Kotoba Quest
            </h2>
            <Sparkles className="w-6 h-6 text-main" />
          </div>
          <p className="text-text-secondary text-sm">
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
                <p className="kawaii-badge kawaii-badge--danger text-sm p-4 w-full justify-center rounded-xl">
                  Memulai game baru akan menimpa data sebelumnya. Lanjutkan?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleConfirmReset(true)}
                    className="kawaii-btn-danger flex-1 px-8 py-3"
                  >
                    Iya
                  </button>
                  <button
                    onClick={() => handleConfirmReset(false)}
                    className="kawaii-btn-outline flex-1 px-8 py-3"
                  >
                    Tidak
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
                  placeholder="Masukkan namamu..."
                  className="kawaii-input text-center text-lg"
                  autoFocus
                  maxLength={15}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="kawaii-btn w-full px-8 py-3"
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
                    className="kawaii-btn w-full px-12 py-4 text-lg"
                  >
                    Lanjutkan
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewGameClick}
                  className={username ? 'kawaii-btn-outline w-full px-12 py-4 text-lg' : 'kawaii-btn w-full px-12 py-4 text-lg'}
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
