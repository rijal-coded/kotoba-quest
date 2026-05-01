import { Play, Gamepad2, User } from 'lucide-react';
import { Page } from '../types';
import { NavButton } from './UI';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-[73px] md:bottom-0 md:left-auto md:w-24 md:flex-col md:justify-start md:pt-8 md:gap-8 md:border-t-0 md:border-l bg-bg-surface/95 backdrop-blur-md border-t border-text-primary/10 px-6 md:px-0 py-3 md:py-8 flex justify-between md:items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] md:shadow-none md:rounded-none transition-colors duration-300">
      <NavButton
        icon={<Play className="w-6 h-6 fill-current" />}
        label="Main"
        active={currentPage === 'BATTLE' || currentPage === 'LEVEL_SELECT'}
        onClick={() => onNavigate('LEVEL_SELECT')}
      />
      <NavButton
        icon={<Gamepad2 className="w-6 h-6" />}
        label="Mode"
        active={currentPage === 'MODE_SELECT'}
        onClick={() => onNavigate('MODE_SELECT')}
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
