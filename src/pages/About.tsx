import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface AboutProps {
  isExperimentalMode: boolean;
  setIsExperimentalMode: (val: boolean) => void;
  onNavigate: (page: Page) => void;
  onResetData: () => void;
}

export const About = ({ isExperimentalMode, setIsExperimentalMode, onNavigate, onResetData }: AboutProps) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  const handleTitleClick = () => {
    if (isExperimentalMode) {
      setShowExitPrompt(true);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Faira Khairaniza Ferdian') {
      setIsExperimentalMode(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      setShowPasswordPrompt(false);
      setPassword('');
    }
  };

  const handleExitExp = (confirm: boolean) => {
    if (confirm) {
      setIsExperimentalMode(false);
    }
    setShowExitPrompt(false);
  };

  const handleReset = () => {
    onResetData();
    // Simple visual feedback for development
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

      <div className="pt-8 border-t border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/30">
          Created by Muhammad Rijal Rais<br />
          Assisted by AI
        </p>
      </div>

      {isExperimentalMode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-6 border-2 border-neon-pink bg-dark-surface space-y-6"
        >
          <h3 className="text-xl font-black text-neon-pink tracking-widest uppercase">Experimental Zone</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest">Akses mode developer aktif</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => onNavigate('EXPERIMENTAL_BATTLE')}
              className="w-full px-8 py-3 bg-red-500/10 text-red-400 border border-red-500 font-bold uppercase tracking-widest hover:bg-red-500/30 transition-colors"
            >
              [Test] Launch RPG Battle
            </button>
            <button 
              onClick={handleReset}
              className="w-full px-8 py-3 bg-orange-500/10 text-orange-400 border border-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/30 transition-colors"
            >
              [Debug] Reset Progress
            </button>
          </div>
        </motion.div>
      )}

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

      {/* Exit Confirm Modal */}
      <AnimatePresence>
        {showExitPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/95 backdrop-blur-sm p-4"
          >
            <div className="bg-dark-surface border-2 border-neon-pink p-6 max-w-sm w-full space-y-6 text-center">
              <h3 className="text-xl font-black text-neon-pink uppercase tracking-widest">Peringatan</h3>
              <p className="text-white/80 uppercase tracking-widest text-sm">
                Apakah Anda yakin untuk keluar dari mode eksperimen?
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => handleExitExp(true)}
                  className="px-8 py-2 bg-neon-pink text-dark-bg font-black uppercase tracking-widest hover:bg-neon-pink/90 transition-colors"
                >
                  IYA
                </button>
                <button 
                  onClick={() => handleExitExp(false)}
                  className="px-8 py-2 border border-white/40 text-white/60 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                >
                  TIDAK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
