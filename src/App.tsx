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
import { RefreshCw } from 'lucide-react';

export default function App() {
  const {
    isHydrated,
    hydrateError,
    currentPage,
    selectedLevel,
    pendingNav,
    setPendingNav,
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

  // Show loading screen while hydrating from persistence
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin" style={{ animationDuration: '1s' }}>
            <RefreshCw className="w-12 h-12 text-main" />
          </div>
          <p className="text-text-secondary uppercase tracking-widest text-sm">Loading Kotoba Quest...</p>
        </div>
      </div>
    );
  }

  // Show error boundary for hydration errors (app continues with defaults)
  if (hydrateError) {
    console.error('Hydration error:', hydrateError);
    // Could also show a non-blocking toast here in the future
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
      case 'MODE_SELECT':
        return <ModeSelect onSelectMode={setGameMode} onNavigate={handleNavigate} />;
      case 'LEVEL_SELECT':
        return <LevelSelect levels={levels} gameMode={gameMode} onSelect={handleLevelSelect} onNavigate={handleNavigate} />;
      case 'BATTLE':
        return selectedLevel ? (
          <Battle
            level={selectedLevel}
            isEndless={gameMode === 'TANTANGAN'}
            gameMode={gameMode}
            inventory={inventory}
            onFinish={handleBattleFinish}
            pendingNav={pendingNav}
            onCancelNav={() => setPendingNav(null)}
          />
        ) : (
          <LevelSelect levels={levels} gameMode={gameMode} onSelect={handleLevelSelect} onNavigate={handleNavigate} />
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
