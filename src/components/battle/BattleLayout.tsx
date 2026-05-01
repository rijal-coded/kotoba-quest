import { ReactNode } from 'react';

interface BattleLayoutProps {
  leftPanel?: ReactNode;    // Enemy section (top on mobile, full width on desktop)
  centerPanel?: ReactNode;  // Question area (main content)
  rightPanel?: ReactNode;   // Player section (bottom mobile, sidebar desktop)
  children?: ReactNode;     // Alternative: full custom content (for experimental layouts)
  shake?: boolean;
  childrenLayout?: 'default' | 'experimental';
}

/**
 * BattleLayout - Shared layout component for battle pages
 *
 * Provides consistent responsive grid structure for battle interfaces:
 * - Mobile: stacked layout with enemy top, question middle, player bottom (fixed)
 * - Desktop: 12-column grid with enemy (full width), question (8 cols), player (4 cols)
 *
 * @param leftPanel - Enemy panel component
 * @param centerPanel - Question/answer area component
 * @param rightPanel - Player panel with skills/inventory
 * @param children - Alternative: pass full content as children (for experimental layouts)
 * @param childrenLayout - If 'experimental', children override panels
 * @param shake - Enable shake animation on damage
 */
export const BattleLayout = ({
  leftPanel,
  centerPanel,
  rightPanel,
  children,
  childrenLayout = 'default',
  shake = false,
}: BattleLayoutProps) => {
  const containerClasses = `transition-transform max-w-5xl mx-auto ${shake ? 'animate-shake' : ''} ${
    childrenLayout === 'experimental'
      ? 'flex flex-col md:grid md:grid-cols-12 md:gap-6 md:p-6'
      : 'md:grid md:grid-cols-12 md:gap-4 md:p-6 md:pt-4'
  }`;

  if (childrenLayout === 'experimental' && children) {
    return <div className={containerClasses}>{children}</div>;
  }

  return (
    <div className={containerClasses}>
      {/* Left Panel (Enemy) - spans full width on desktop */}
      {leftPanel && (
        <div className="md:col-span-12">{leftPanel}</div>
      )}

      {/* Center Panel (Question Area) - 8 columns on desktop */}
      {centerPanel && (
        <div className="md:col-span-8">{centerPanel}</div>
      )}

      {/* Right Panel (Player) - 4 columns on desktop, fixed bottom on mobile */}
      {rightPanel && (
        <div className="md:col-span-4">{rightPanel}</div>
      )}
    </div>
  );
};
