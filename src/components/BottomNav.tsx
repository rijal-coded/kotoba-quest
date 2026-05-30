import { Play, Gamepad2, User, BookOpen } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  return (
    <nav className="kawaii-nav fixed bottom-0 left-0 right-0 md:top-[61px] md:bottom-0 md:left-auto md:w-24 md:flex-col md:justify-start md:pt-6 md:gap-4 md:border-t-0 md:border-l md:rounded-none md:px-0 md:pb-8 flex justify-around md:items-center z-50 md:shadow-none">
      <NavItem
        icon={<Play className="w-5 h-5 fill-current" />}
        label="Play"
        active={currentPage === 'BATTLE' || currentPage === 'LEVEL_SELECT'}
        onClick={() => onNavigate('LEVEL_SELECT')}
      />
      <NavItem
        icon={<Gamepad2 className="w-5 h-5" />}
        label="Mode"
        active={currentPage === 'MODE_SELECT'}
        onClick={() => onNavigate('MODE_SELECT')}
      />
      <NavItem
        icon={<BookOpen className="w-5 h-5" />}
        label="Kata"
        active={currentPage === 'WORDS'}
        onClick={() => onNavigate('WORDS')}
      />
      <NavItem
        icon={<User className="w-5 h-5" />}
        label="Profile"
        active={currentPage === 'INVENTORY'}
        onClick={() => onNavigate('INVENTORY')}
      />
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`kawaii-nav-item ${active ? 'kawaii-nav-item--active' : ''}`}
  >
    {icon}
    <span className="text-[10px] md:text-xs font-bold">{label}</span>
  </button>
);
