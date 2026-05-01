/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header, Footer } from './components/Layout';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { ModeSelect } from './pages/ModeSelect';
import { Battle } from './pages/Battle';
import { Inventory } from './pages/Inventory';
import { LevelSelect } from './pages/LevelSelect';
import { About } from './pages/About';
import { ExperimentalBattle } from './pages/ExperimentalBattle';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from './hooks/useGameState';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const {
    currentPage,
    selectedLevel,
    pendingNav,
    levels,
    inventory,
    username,
    powerScore,
    endlessRecords,
    gameMode,
    setInventory,
    setGameMode,
    handleNavigate,
    handleLevelSelect,
    handleBattleFinish,
    handleSetUsername,
    handleResetData,
  } = useGameState();

  const renderPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
      case 'MODE_SELECT':
        return <ModeSelect onSelectMode={setGameMode} onNavigate={handleNavigate} />;
      case 'LEVEL_SELECT':
        return <LevelSelect levels={levels} gameMode={gameMode} onSelect={handleLevelSelect} />;
      case 'BATTLE':
        return selectedLevel ? (
          <Battle
            level={selectedLevel}
            isEndless={gameMode === 'TANTANGAN'}
            gameMode={gameMode}
            inventory={inventory}
            setInventory={setInventory}
            onFinish={handleBattleFinish}
          />
        ) : (
          <LevelSelect levels={levels} gameMode={gameMode} onSelect={handleLevelSelect} />
        );
      case 'INVENTORY':
        return <Inventory username={username} inventory={inventory} setInventory={setInventory} powerScore={powerScore} />;
      case 'ABOUT':
        return <About onNavigate={handleNavigate} onResetData={handleResetData} />;
      case 'EXPERIMENTAL_BATTLE':
        return (
          <ExperimentalBattle
            levels={levels}
            gameMode={gameMode}
            inventory={inventory}
            setInventory={setInventory}
            onFinish={handleBattleFinish}
          />
        );
      default:
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
    }
  };

  const showNav = currentPage !== 'HOME' && currentPage !== 'ABOUT' && currentPage !== 'MODE_SELECT';

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary selection:bg-main selection:text-bg-primary transition-colors duration-300">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />

        <main className={`flex-1 relative ${showNav ? 'md:pr-24' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {showNav && (
          <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
        )}

        {currentPage === 'HOME' && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
