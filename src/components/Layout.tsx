import { Home, Info } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  return (
    <header className="border-b border-white/10 p-4 flex justify-between items-center bg-dark-bg sticky top-0 z-50">
      <button 
        onClick={() => onNavigate('HOME')}
        className="flex items-center gap-2 group"
      >
        <Home className="w-6 h-6 text-neon-cyan group-hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] transition-all" />
        <h1 className="text-xl font-black tracking-tighter uppercase text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.5)]">
          KOTOBA QUEST
        </h1>
      </button>
      
      <button 
        onClick={() => onNavigate('ABOUT')}
        className={`px-4 py-1 border-2 font-bold uppercase tracking-widest text-sm transition-all ${
          currentPage === 'ABOUT' 
          ? 'bg-neon-cyan text-dark-bg border-neon-cyan' 
          : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10'
        }`}
      >
        ABOUT
      </button>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="p-8 border-t border-white/10 mt-auto bg-dark-surface">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h3 className="font-bold uppercase tracking-widest text-neon-cyan">Kotoba Quest</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Platform pembelajaran bahasa Jepang interaktif dengan mekanisme pertarungan RPG taktis.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold uppercase tracking-widest text-white/40">About</h3>
          <p className="text-xs text-white/40">
            Created by Muhammad Rijal Rais<br />
            AI Assisted Development
          </p>
        </div>
        
        <div className="flex justify-end items-center">
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
            <div className="w-6 h-6 bg-neon-cyan/20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};
