import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';
import { Sparkles, Star, ChevronDown, Swords, BookOpen, Sword, Hammer } from 'lucide-react';

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
  const [openSection, setOpenSection] = useState<number | null>(null);

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

        <div className="kawaii-divider my-2" />

        <div className="space-y-3">
          {[
            {
              icon: Sparkles,
              title: 'Apa itu Kotoba Quest?',
              content: [
                'Kotoba Quest adalah game pembelajaran kosakata bahasa Jepang bergaya RPG (Role-Playing Game).',
                'Game ini menggabungkan estetika kawaii dengan metode spaced repetition untuk membantu kamu menghafal kosakata Jepang — mulai dari Hiragana, Katakana, hingga Kanji.',
                'Setiap kata yang kamu pelajari menjadi bagian dari pertarungan melawan musuh. Semakin banyak kosakata yang kamu kuasai, semakin kuat karaktermu!',
              ],
            },
            {
              icon: Swords,
              title: 'Cara Bermain',
              content: [
                'Saat bertarung, kamu akan ditampilkan pertanyaan kosakata (contoh: "Apa arti kata たべる?"). Jawab dengan benar untuk menyerang musuh. Jawaban yang salah akan membuat karaktermu menerima kerusakan.',
                'Karaktermu memiliki HP (nyawa) yang harus dijaga. AP (Action Points) digunakan untuk menyerang atau bertahan.',
                'Mode Belajar: Lihat kartu kata baru sebelum bertarung, musuh yang lebih lambat, dan AP yang mengalir deras. Cocok untuk belajar.',
                'Mode Latihan: Tidak ada petunjuk kata. Musuh lebih cepat, AP lebih sulit didapat. Uji kemampuanmu yang sebenarnya.',
                'Kalahkan musuh satu per satu dalam setiap gelombang. Setelah semua musuh dikalahkan, hadapi bos terakhir untuk menyelesaikan level.',
              ],
            },
            {
              icon: BookOpen,
              title: 'Level & Kosakata',
              content: [
                'Terdapat 22 level dengan tema berbeda: Sapaan, Sekolah, Makanan, Hewan, Cuaca, Waktu, dan masih banyak lagi.',
                'Setiap level berisi 6-20 kata baru yang akan dipelajari secara bertahap. Selesaikan pertarungan untuk membuka kata berikutnya dan naikkan cakupan (coverage) setiap kata.',
                'Setiap kata memiliki 3 jenis pertanyaan yang berbeda. Lengkapi semua jenis pertanyaan untuk menguasai kata sepenuhnya.',
                'Kamu juga bisa menandai kata favorit dan mencarinya melalui Kamus Kata (tab "Kata").',
              ],
            },
            {
              icon: Sword,
              title: 'Peralatan & Forge',
              content: [
                'Karaktermu bisa dilengkapi dengan 5 jenis peralatan: Senjata, Perisai, Zirah, Helm, dan Aksesori. Masing-masing memberikan bonus statistik seperti ATK, DEF, HP, CRIT, dan BLOCK.',
                'Peralatan memiliki 5 tier: Bronze, Silver, Gold, Platinum, dan Legendary. Semakin tinggi tier, semakin kuat peralatannya. Beberapa item langka memiliki deskripsi sejarah Jepang yang menarik!',
                'Buka Forge dari menu navigasi. Gunakan Sakura Petals (mata uang yang didapat dari pertarungan) untuk membuat peralatan baru. Pilih random atau spesifik slot yang diinginkan.',
                'Tidak butuh peralatan? Jual di Inventory untuk mendapatkan Sakura Petals kembali. Peralatan yang sedang dipakai, difavoritkan, atau item terakhir dari suatu jenis akan terlindungi.',
              ],
            },
            {
              icon: Hammer,
              title: 'Fitur Lainnya',
              content: [
                'Semua progress kamu disimpan secara otomatis di browser (localStorage/IndexedDB). Kamu bisa melanjutkan kapan saja.',
                'Buka panel pengaturan (ikon Sun/Moon di header) untuk beralih antara mode terang dan gelap.',
                'Telusuri seluruh kosakata yang sudah kamu temui. Cari berdasarkan kata Jepang, Kanji, atau arti Indonesia. Tandai kata favorit untuk review cepat.',
              ],
            },
          ].map((section, idx) => {
            const isOpen = openSection === idx;
            const Icon = section.icon;
            return (
              <div key={idx} className="kawaii-card overflow-hidden">
                <button
                  onClick={() => setOpenSection(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-main" />
                    <span className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                      {section.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed space-y-3">
                        {section.content.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
