import { Sun, Moon, Sparkles } from 'lucide-react';
import { Page } from '../types';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('kotoba_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kotoba_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kotoba_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <header className="kawaii-header">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <button
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-2 group"
        >
          <Sparkles className="w-5 h-5 text-main transition-all group-hover:animate-kawaii-bounce" />
          <h1 className="text-xl font-bold text-main" style={{ fontFamily: 'var(--font-display)' }}>
            Kotoba Quest
          </h1>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-main hover:border-main/30 hover:bg-main/5 transition-all"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('ABOUT')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              currentPage === 'ABOUT'
                ? 'bg-main text-white'
                : 'border border-main/30 text-main hover:bg-main/5'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="kawaii-footer mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="space-y-2">
          <h3 className="font-bold text-main" style={{ fontFamily: 'var(--font-display)' }}>
            Kotoba Quest
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Platform pembelajaran bahasa Jepang interaktif dengan mekanisme pertarungan RPG taktis.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-text-secondary text-sm">About</h3>
          <p className="text-xs text-text-secondary">
            Created by Muhammad Rijal Rais<br />
            AI Assisted Development
          </p>
        </div>

        <div className="flex justify-end items-center">
          <div className="w-12 h-12 rounded-2xl bg-main/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-main/40" />
          </div>
        </div>
      </div>
    </footer>
  );
};
