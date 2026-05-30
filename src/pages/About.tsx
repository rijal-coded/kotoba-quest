import { useState, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Level } from '../types';
import { Heart, Sparkles, Shield } from 'lucide-react';

const PASSWORD_HASH = 'f3742a62e6208e5fa53c90d5defa774d0fbe96b75f01b4e053d00198afeb6afd';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface AboutProps {
  onNavigate: (page: Page) => void;
  onResetData: () => void;
  onUnlockAllLevels: () => void;
  onUnlockLevel: (levelId: string) => void;
  levels: Level[];
}

export const About = ({ onNavigate, onResetData, onUnlockAllLevels, onUnlockLevel, levels }: AboutProps) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // Debug mode
  const [showDebugPrompt, setShowDebugPrompt] = useState(false);
  const [debugPassword, setDebugPassword] = useState('');
  const [debugError, setDebugError] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const handleTitleClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'faira') {
      setSuccessMessage(true);
      setPassword('');
      setShowPasswordPrompt(false);
    } else {
      setShowPasswordPrompt(false);
      setPassword('');
    }
  };

  const handleDebugClick = () => {
    setShowDebugPrompt(true);
    setDebugPassword('');
    setDebugError(false);
  };

  const handleDebugPasswordSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const hash = await sha256(debugPassword);
    if (hash === PASSWORD_HASH) {
      setShowDebugPanel(true);
      setShowDebugPrompt(false);
      setDebugPassword('');
      setDebugError(false);
    } else {
      setDebugError(true);
      setDebugPassword('');
    }
  }, [debugPassword]);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-main" />
        <h2
          onClick={handleTitleClick}
          className="text-4xl font-bold text-main cursor-pointer select-none transition-all hover:scale-105"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          About Kotoba Quest
        </h2>
        <Sparkles className="w-5 h-5 text-main" />
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="py-12"
        >
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-danger fill-danger" />
            <span className="text-4xl font-bold text-danger"
              style={{ fontFamily: 'var(--font-display)' }}>
              I LOVE YOU
            </span>
            <Heart className="w-8 h-8 text-danger fill-danger" />
          </div>
        </motion.div>
      )}

      <div className="kawaii-card p-6 text-left space-y-4">
        <p className="text-text-secondary leading-relaxed">
          Kotoba Quest adalah sebuah eksperimen dalam gamifikasi pembelajaran bahasa.
          Menggabungkan estetika kawaii dengan metode pengulangan spasi untuk membantu
          pengguna menghafal kosakata bahasa Jepang (Hiragana, Katakana, &amp; Kanji).
        </p>
        <p className="text-text-secondary leading-relaxed">
          Setiap jawaban yang benar akan memberikan serangan kepada musuh, sementara
          jawaban yang salah akan membuat karakter Anda menerima kerusakan.
          Bertahanlah dan kuasai bahasanya!
        </p>
      </div>

      <div className="pt-8 space-y-4">
        <p className="text-xs text-text-secondary">
          Versi 1.2.0-experimental
        </p>

        <button
          onClick={handleDebugClick}
          className="text-[10px] text-text-secondary/40 hover:text-text-secondary/70 transition-colors cursor-pointer"
        >
          Debug
        </button>

        <div className="kawaii-divider" />

        <p className="text-xs text-text-secondary">
          Dibuat untuk Skripsi
        </p>
      </div>

      {/* Debug Panel */}
      <AnimatePresence>
        {showDebugPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="kawaii-card p-6 text-left space-y-4 border-2 border-danger/40"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-danger" />
              <h3 className="text-lg font-bold text-danger"
                style={{ fontFamily: 'var(--font-display)' }}>
                Debug Mode
              </h3>
            </div>

            <button
              onClick={() => { onUnlockAllLevels(); }}
              className="kawaii-btn w-full text-sm"
            >
              Buka Semua Level
            </button>

            <div className="space-y-2">
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                Buka Level Tertentu
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => { onUnlockLevel(level.id); }}
                    className="text-xs px-3 py-2 rounded-xl bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-main/30 transition-all text-left truncate"
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onResetData(); setShowDebugPanel(false); }}
              className="kawaii-btn-danger w-full text-sm"
            >
              Reset Semua Data
            </button>

            <button
              onClick={() => setShowDebugPanel(false)}
              className="kawaii-btn-outline w-full text-xs"
            >
              Tutup Debug
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Password Prompt */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="kawaii-modal-backdrop flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onSubmit={handlePasswordSubmit}
              className="kawaii-modal text-center space-y-5"
            >
              <h3 className="text-xl font-bold text-main"
                style={{ fontFamily: 'var(--font-display)' }}>
                Akses Terbatas
              </h3>
              <p className="text-text-secondary text-sm">Masukkan kata sandi administrator</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="kawaii-input text-center text-main"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}
                  className="kawaii-btn-outline flex-1 px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="kawaii-btn flex-1 px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Password Prompt */}
      <AnimatePresence>
        {showDebugPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="kawaii-modal-backdrop flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onSubmit={handleDebugPasswordSubmit}
              className="kawaii-modal text-center space-y-5"
            >
              <h3 className="text-xl font-bold text-main"
                style={{ fontFamily: 'var(--font-display)' }}>
                Debug Mode
              </h3>
              <p className="text-text-secondary text-sm">Masukkan kata sandi debug</p>
              <input
                type="password"
                value={debugPassword}
                onChange={(e) => setDebugPassword(e.target.value)}
                className="kawaii-input text-center text-main"
                autoFocus
              />
              {debugError && (
                <p className="text-xs text-danger">Kata sandi salah</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowDebugPrompt(false); setDebugPassword(''); setDebugError(false); }}
                  className="kawaii-btn-outline flex-1 px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="kawaii-btn flex-1 px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
