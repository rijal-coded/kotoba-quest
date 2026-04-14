/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header, Footer } from './components/Layout';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { ModeSelect } from './pages/ModeSelect';
import { Battle } from './pages/Battle';
import { Inventory } from './pages/Inventory';
import { LevelSelect } from './pages/LevelSelect';
import { EndlessSetup } from './pages/EndlessSetup';
import { Page, Level, GameMode, Item, EndlessRecord } from './types';
import { INITIAL_LEVELS, INITIAL_INVENTORY } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [pendingNav, setPendingNav] = useState<Page | null>(null);
  
  const [levels, setLevels] = useState<Level[]>(() => {
    const saved = localStorage.getItem('kotoba_levels');
    return saved ? JSON.parse(saved) : INITIAL_LEVELS;
  });
  
  const [inventory, setInventory] = useState<Item[]>(() => {
    const saved = localStorage.getItem('kotoba_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [username, setUsername] = useState<string>(() => localStorage.getItem('kotoba_username') || '');
  const [powerScore, setPowerScore] = useState<number>(() => {
    const saved = localStorage.getItem('kotoba_power_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [endlessRecords, setEndlessRecords] = useState<EndlessRecord[]>(() => {
    const saved = localStorage.getItem('kotoba_endless_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [gameMode, setGameMode] = useState<GameMode>('KANA');

  useEffect(() => {
    localStorage.setItem('kotoba_levels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('kotoba_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('kotoba_power_score', powerScore.toString());
  }, [powerScore]);

  useEffect(() => {
    localStorage.setItem('kotoba_endless_records', JSON.stringify(endlessRecords));
  }, [endlessRecords]);

  const handleNavigate = (page: Page) => {
    if (currentPage === 'ENDLESS' && selectedLevel) {
      setPendingNav(page);
      return;
    }
    setCurrentPage(page);
    if (page !== 'BATTLE' && page !== 'ENDLESS') {
      setSelectedLevel(null);
    } else if (page === 'ENDLESS') {
      setSelectedLevel(null);
    }
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setCurrentPage('BATTLE');
  };

  const handleStartEndless = (selectedLevels: Level[]) => {
    const combinedWords = selectedLevels.flatMap(l => l.words);
    const combinedLevel: Level = {
      id: 'endless',
      name: 'ENDLESS MODE',
      icon: 'Infinity',
      isCompleted: false,
      bestTime: 0,
      words: combinedWords
    };
    setSelectedLevel(combinedLevel);
  };

  const handleBattleFinish = (
    victory: boolean, 
    timeSpent: number, 
    rewards?: Item[], 
    scoreEarned: number = 0,
    enemiesBeaten?: number,
    wordsBeaten?: number,
    navigateTo?: Page
  ) => {
    if (selectedLevel && currentPage !== 'ENDLESS') {
      setLevels(prev => prev.map(l => {
        if (l.id === selectedLevel.id) {
          return {
            ...l,
            isCompleted: victory ? true : l.isCompleted,
            bestTime: victory ? (l.bestTime === 0 ? timeSpent : Math.min(l.bestTime, timeSpent)) : l.bestTime
          };
        }
        return l;
      }));
    }

    if (victory) {
      setPowerScore(prev => prev + scoreEarned);
      
      if (rewards) {
        setInventory(prev => {
          const newInventory = [...prev];
          rewards.forEach(reward => {
            const existingItem = newInventory.find(i => i.id === reward.id);
            if (existingItem && existingItem.count !== undefined) {
              existingItem.count += (reward.count || 1);
            } else {
              newInventory.push(reward);
            }
          });
          return newInventory;
        });
      }
    }

    if (currentPage === 'ENDLESS') {
      if (enemiesBeaten !== undefined && wordsBeaten !== undefined) {
        setEndlessRecords(prev => [...prev, {
          date: Date.now(),
          enemiesBeaten,
          wordsBeaten
        }]);
      }
      setSelectedLevel(null);
      setPendingNav(null);
      if (navigateTo) {
        setCurrentPage(navigateTo);
      } else {
        setCurrentPage('ENDLESS');
      }
    } else {
      setCurrentPage('LEVEL_SELECT');
    }
  };

  const handleSetUsername = (name: string) => {
    setUsername(name);
    localStorage.setItem('kotoba_username', name);
  };

  const handleResetData = () => {
    setUsername('');
    setLevels(INITIAL_LEVELS);
    setInventory(INITIAL_INVENTORY);
    setPowerScore(0);
    setEndlessRecords([]);
    localStorage.removeItem('kotoba_username');
    localStorage.removeItem('kotoba_levels');
    localStorage.removeItem('kotoba_inventory');
    localStorage.removeItem('kotoba_power_score');
    localStorage.removeItem('kotoba_endless_records');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
      case 'MODE_SELECT':
        return <ModeSelect onSelectMode={setGameMode} onNavigate={handleNavigate} />;
      case 'LEVEL_SELECT':
        return <LevelSelect levels={levels} onSelect={handleLevelSelect} />;
      case 'BATTLE':
        return selectedLevel ? (
          <Battle 
            level={selectedLevel} 
            gameMode={gameMode}
            inventory={inventory}
            setInventory={setInventory}
            onFinish={handleBattleFinish} 
          />
        ) : (
          <LevelSelect levels={levels} onSelect={handleLevelSelect} />
        );
      case 'ENDLESS':
        return selectedLevel ? (
          <Battle 
            level={selectedLevel} 
            isEndless 
            gameMode={gameMode}
            inventory={inventory}
            setInventory={setInventory}
            onFinish={handleBattleFinish}
            pendingNav={pendingNav}
            onCancelNav={() => setPendingNav(null)}
          />
        ) : (
          <EndlessSetup levels={levels} records={endlessRecords} onStart={handleStartEndless} />
        );
      case 'INVENTORY':
        return <Inventory username={username} inventory={inventory} powerScore={powerScore} />;
      case 'ABOUT':
        return (
          <div className="p-8 max-w-2xl mx-auto space-y-8 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.5)]">About Kotoba Quest</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Kotoba Quest adalah sebuah eksperimen dalam gamifikasi pembelajaran bahasa. 
                Menggabungkan estetika cyberpunk dengan metode pengulangan spasi untuk membantu 
                pengguna menghafal kosakata bahasa Jepang (Hiragana & Katakana).
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
                Powered by AI Studio Build
              </p>
            </div>
          </div>
        );
      default:
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
    }
  };

  const showNav = currentPage !== 'HOME' && currentPage !== 'ABOUT' && currentPage !== 'MODE_SELECT';

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg selection:bg-neon-cyan selection:text-dark-bg">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className={`flex-1 relative ${showNav ? 'md:pr-24' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} hasCompletedLevel={levels.some(l => l.isCompleted)} />
      )}
      
      {currentPage === 'HOME' && <Footer />}
      <Analytics />
    </div>
  );
}
