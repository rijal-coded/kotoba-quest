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
import { Forge } from './pages/Forge';
import { LevelSelect } from './pages/LevelSelect';
import { About } from './pages/About';
import { Words } from './pages/Words';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from './hooks/useGameState';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { Sparkles } from 'lucide-react';

export default function App() {
  const {
    isHydrated,
    hydrateError,
    currentPage,
    selectedLevel,
    pendingNav,
    setCurrentPage,
    setSelectedLevel,
    setPendingNav,
    levels,
    inventory,
    username,
    strength,
    endlessRecords,
    gameMode,
    sakuraPetals,
    setSakuraPetals,
    setInventory,
    setGameMode,
    handleNavigate,
    handleLevelSelect,
    handleBattleFinish,
    handleSetUsername,
    handleResetData,
    markWordSeen,
    toggleFavorite,
    unlockLevel,
    unlockAllLevels,
  } = useGameState();

  // Show loading screen while hydrating from persistence
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-main/10">
            <Sparkles className="w-8 h-8 text-main animate-kawaii-bounce" />
          </div>
          <p className="text-text-secondary text-sm">Loading Kotoba Quest...</p>
        </div>
      </div>
    );
  }

  if (hydrateError) {
    console.error('Hydration error:', hydrateError);
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
    gameMode={gameMode}
    inventory={inventory}
    completedLevels={levels.filter(l => l.isCompleted).length}
    onFinish={handleBattleFinish}
    onMarkWordSeen={markWordSeen}
    pendingNav={pendingNav}
    onCancelNav={() => setPendingNav(null)}
    onConfirmNav={() => { if (pendingNav) { setCurrentPage(pendingNav); setSelectedLevel(null); setPendingNav(null); } }}
    onNavigate={handleNavigate}
  />
      ) : (
        <LevelSelect levels={levels} gameMode={gameMode} onSelect={handleLevelSelect} onNavigate={handleNavigate} />
      );
case 'INVENTORY':
return       <Inventory username={username} inventory={inventory} setInventory={setInventory} sakuraPetals={sakuraPetals} onNavigate={handleNavigate} setSakuraPetals={setSakuraPetals} />;
case 'FORGE':
return       <Forge sakuraPetals={sakuraPetals} setSakuraPetals={setSakuraPetals} inventory={inventory} setInventory={setInventory} onNavigate={handleNavigate} />;
case 'ABOUT':
        return <About onNavigate={handleNavigate} onResetData={handleResetData} onUnlockAllLevels={unlockAllLevels} onUnlockLevel={unlockLevel} levels={levels} />;
      case 'WORDS':
        return <Words levels={levels} onNavigate={handleNavigate} onToggleFavorite={toggleFavorite} />;
      default:
        return <Home onStart={() => handleNavigate('MODE_SELECT')} username={username} onSetUsername={handleSetUsername} onResetData={handleResetData} />;
    }
  };

  const showNav = currentPage !== 'HOME' && currentPage !== 'ABOUT' && currentPage !== 'MODE_SELECT' && currentPage !== 'FORGE';

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />

          <main className={`flex-1 ${showNav ? 'md:pr-24' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
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
      </ToastProvider>
    </ErrorBoundary>
  );
}
