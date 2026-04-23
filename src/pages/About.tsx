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
    <div className="p-8 max-w-2xl mx-auto space-y-8 text-center relative selection:bg-neon-cyan selection:text-dark-bg">
      <h2 
        onClick={handleTitleClick}
        className="text-4xl font-black uppercase tracking-tighter text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.5)] cursor-pointer select-none transition-colors hover:text-white"
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
      
      <div className="space-y-4 text-white/70 leading-relaxed">
        <p>
          Kotoba Quest adalah sebuah eksperimen dalam gamifikasi pembelajaran bahasa. 
          Menggabungkan estetika cyberpunk dengan metode pengulangan spasi untuk membantu 
          pengguna menghafal kosakata bahasa Jepang (Hiragana, Katakana, & Kanji).
        </p>
        <p>
          Setiap jawaban yang benar akan memberikan serangan kepada musuh, sementara 
          jawaban yang salah akan membuat karakter Anda menerima kerusakan. 
          Bertahanlah dan kuasai bahasanya!
        </p>
      </div>

      <div className="pt-12 space-y-4">
        <button 
          onClick={handleReset}
          className="text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-orange-500 transition-colors"
        >
          [ Hard Reset Database ]
        </button>

        <div className="pt-8 border-t border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/30">
            Created by Muhammad Rijal Rais<br />
            Assisted by AI
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/95 backdrop-blur-sm p-4"
          >
            <form 
              onSubmit={handlePasswordSubmit}
              className="bg-dark-surface border-2 border-neon-cyan p-6 max-w-sm w-full space-y-6 text-center"
            >
              <h3 className="text-xl font-black text-neon-cyan uppercase tracking-widest">Akses Dilarang</h3>
              <p className="text-white/60 text-xs uppercase tracking-widest">Masukkan kata sandi administrator</p>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-bg border border-neon-cyan/50 px-4 py-3 text-center text-neon-cyan focus:outline-none focus:border-neon-cyan"
                autoFocus
              />
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}
                  className="flex-1 px-4 py-2 border border-white/40 text-white/60 font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neon-cyan text-dark-bg font-black uppercase tracking-widest hover:bg-neon-cyan/90 transition-colors"
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
