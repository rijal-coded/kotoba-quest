import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface AboutProps {
  onNavigate: (page: Page) => void;
  onResetData: () => void;
}

export const About = ({ onNavigate, onResetData }: AboutProps) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

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

  const handleReset = () => {
    onResetData();
    alert("Data berhasil direset!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 text-center relative">
      <h2
        onClick={handleTitleClick}
        className="text-4xl font-black uppercase tracking-tighter text-main cursor-pointer select-none transition-colors hover:brightness-125"
      >
        About Kotoba Quest
      </h2>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-black text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] animate-pulse py-12"
        >
          I LOVE YOU
        </motion.div>
      )}

      <div className="space-y-4 text-text-secondary leading-relaxed text-left bg-bg-surface border border-text-primary/10 rounded-2xl p-6">
        <p>
          Kotoba Quest adalah sebuah eksperimen dalam gamifikasi pembelajaran bahasa.
          Menggabungkan estetika cyberpunk dengan metode pengulangan spasi untuk membantu
          pengguna menghafal kosakata bahasa Jepang (Hiragana, Katakana, &amp; Kanji).
        </p>
        <p>
          Setiap jawaban yang benar akan memberikan serangan kepada musuh, sementara
          jawaban yang salah akan membuat karakter Anda menerima kerusakan.
          Bertahanlah dan kuasai bahasanya!
        </p>
      </div>

      <div className="pt-8 space-y-4">
        <div className="space-y-4">
          <h2 className="text-[10px] text-text-secondary uppercase tracking-[0.3em] hover:text-red-500 transition-colors">
            Versi 1.2.0-experimental
          </h2>
        </div>

        <div className="pt-8 border-t border-text-primary/10">
          <p className="text-xs uppercase tracking-widest text-text-secondary">
            Dibuat untuk Skripsi
          </p>
        </div>
      </div>

      {/* Password Prompt Modal */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm p-4"
          >
            <form
              onSubmit={handlePasswordSubmit}
              className="bg-bg-surface border border-main/30 rounded-2xl p-6 max-w-sm w-full space-y-5 text-center shadow-[0_0_30px_rgba(0,156,255,0.15)]"
            >
              <h3 className="text-xl font-black text-main uppercase tracking-widest">Akses Dilarang</h3>
              <p className="text-text-secondary text-xs uppercase tracking-widest">Masukkan kata sandi administrator</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-primary border border-main/40 rounded-xl px-4 py-3 text-center text-main focus:outline-none focus:border-main focus:shadow-[0_0_10px_rgba(0,156,255,0.2)] transition-all"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}
                  className="flex-1 px-4 py-2 border border-text-primary/20 text-text-secondary font-bold uppercase tracking-widest rounded-xl hover:border-text-primary/40 hover:text-text-primary transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-main text-bg-primary font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
