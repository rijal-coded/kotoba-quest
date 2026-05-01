import { Home, Info, Sun, Moon } from 'lucide-react';
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
    <header className="border-b border-text-primary/10 p-4 flex justify-between items-center bg-bg-primary sticky top-0 z-50 transition-colors duration-300">
      <button 
        onClick={() => onNavigate('HOME')}
        className="flex items-center gap-2 group"
      >
        <Home className="w-6 h-6 text-main group-hover:drop-shadow-[0_0_5px_rgba(0,156,255,0.8)] transition-all" />
        <h1 className="text-xl font-black tracking-tighter uppercase text-main drop-shadow-[0_0_2px_rgba(0,156,255,0.5)]">
          KOTOBA QUEST
        </h1>
      </button>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-text-primary/10 flex items-center justify-center text-text-primary hover:bg-text-primary/5 transition-all"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={() => onNavigate('ABOUT')}
          className={`px-4 py-1.5 border-2 font-bold uppercase tracking-widest text-sm transition-all rounded-full ${
            currentPage === 'ABOUT' 
            ? 'bg-main text-bg-primary border-main' 
            : 'border-main text-main hover:bg-main/10'
          }`}
        >
          ABOUT
        </button>
      </div>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="p-8 border-t border-text-primary/10 mt-auto bg-bg-surface transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h3 className="font-bold uppercase tracking-widest text-main">Kotoba Quest</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Platform pembelajaran bahasa Jepang interaktif dengan mekanisme pertarungan RPG taktis.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold uppercase tracking-widest text-text-secondary">About</h3>
          <p className="text-xs text-text-secondary">
            Created by Muhammad Rijal Rais<br />
            AI Assisted Development
          </p>
        </div>
        
        <div className="flex justify-end items-center">
          <div className="w-12 h-12 border border-text-primary/10 rounded-2xl flex items-center justify-center">
            <div className="w-6 h-6 bg-main/20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};
