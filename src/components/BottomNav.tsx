import { Play, Infinity, User, Lock } from 'lucide-react';
import { Page } from '../types';
import { NavButton } from './UI';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  hasCompletedLevel: boolean;
}

export const BottomNav = ({ currentPage, onNavigate, hasCompletedLevel }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-[73px] md:bottom-0 md:left-auto md:w-24 md:flex-col md:justify-start md:pt-8 md:gap-8 md:border-t-0 md:border-l bg-dark-surface border-t border-white/10 px-6 md:px-0 py-3 md:py-8 flex justify-between md:items-center z-40">
      <NavButton 
        icon={<Play className="w-6 h-6 fill-current" />} 
        label="Main" 
        active={currentPage === 'BATTLE' || currentPage === 'LEVEL_SELECT'} 
        onClick={() => onNavigate('LEVEL_SELECT')}
      />
      <NavButton 
        icon={hasCompletedLevel ? <Infinity className="w-6 h-6" /> : <Lock className="w-6 h-6" />} 
        label="Tanpa Batas" 
        active={currentPage === 'ENDLESS'} 
        disabled={!hasCompletedLevel}
        onClick={() => onNavigate('ENDLESS')}
      />
      <NavButton 
        icon={<User className="w-6 h-6" />} 
        label="Profil" 
        active={currentPage === 'INVENTORY'} 
        onClick={() => onNavigate('INVENTORY')}
      />
    </nav>
  );
};
