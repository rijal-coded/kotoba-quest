import { ReactNode } from 'react';

interface BattleLayoutProps {
  leftPanel?: ReactNode;
  centerPanel?: ReactNode;
  rightPanel?: ReactNode;
  children?: ReactNode;
  shake?: boolean;
  childrenLayout?: 'default' | 'experimental';
}

export const BattleLayout = ({
  leftPanel,
  centerPanel,
  rightPanel,
  children,
  childrenLayout = 'default',
  shake = false,
}: BattleLayoutProps) => {
  const containerClasses = `transition-transform max-w-5xl mx-auto ${shake ? 'animate-kawaii-shake' : ''} ${
    childrenLayout === 'experimental'
      ? 'flex flex-col md:grid md:grid-cols-12 md:gap-6 md:p-6'
      : 'flex flex-col pt-3 md:grid md:grid-cols-12 md:gap-4 md:p-6 md:pt-4'
  }`;

  if (childrenLayout === 'experimental' && children) {
    return <div className={containerClasses}>{children}</div>;
  }

  return (
    <div className={containerClasses} style={{ position: 'relative' }}>
      {/* Damage flash overlay */}
      {shake && (
        <div className="absolute inset-0 bg-danger/10 rounded-2xl pointer-events-none z-50" />
      )}

      {leftPanel && (
        <div className="md:col-span-12">{leftPanel}</div>
      )}

      {centerPanel && (
        <div className="md:col-span-8">{centerPanel}</div>
      )}

      {rightPanel && (
        <div className="hidden md:block md:col-span-4">{rightPanel}</div>
      )}
    </div>
  );
};
