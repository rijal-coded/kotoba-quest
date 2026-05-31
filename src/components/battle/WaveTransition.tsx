import { useState } from 'react';
import { Sparkles, Skull } from 'lucide-react';

interface WaveTransitionProps {
  wave: number;
  enemyName: string;
  enemyRank: string;
  enemyTier: number;
  isBoss: boolean;
  onDismiss?: () => void;
}

const TIER_LABELS = ['Ashigaru', 'Samurai', 'Hatamoto', 'Daimyo', 'Shogun'];

export const WaveTransition = ({ wave, enemyName, enemyRank, enemyTier, isBoss, onDismiss }: WaveTransitionProps) => {
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center cursor-pointer bg-bg-primary/90 backdrop-blur-sm transition-opacity duration-300 ${dismissing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleDismiss}
    >
      <div className="text-center space-y-3">
        {/* Boss badge */}
        {isBoss && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/20 border-2 border-warning text-warning">
            <Skull className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-widest">BOSS</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-main/40" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">
            {isBoss ? 'Pertempuran' : `Gelombang ${wave}`}
          </p>
          <Sparkles className="w-4 h-4 text-main/40" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-main" style={{ fontFamily: 'var(--font-display)' }}>
          {enemyName}
        </h2>

        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          {enemyRank} · Tier {enemyTier}
        </p>

        {/* Tier progression ladder */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {TIER_LABELS.map((label, i) => {
            const tierNum = i + 1;
            const isCurrent = tierNum === enemyTier;
            const isPast = tierNum < enemyTier;
            return (
              <div
                key={label}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                  isCurrent
                    ? 'bg-warning/20 text-warning border border-warning/60 shadow-[0_0_8px_rgba(255,217,125,0.3)]'
                    : isPast
                    ? 'text-text-secondary/50'
                    : 'text-text-secondary/30'
                }`}
              >
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{tierNum}</span>
              </div>
            );
          })}
        </div>

        {/* Speed indicator */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Serangan
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-2 rounded-sm transition-all ${
                  i < enemyTier
                    ? 'bg-warning shadow-[0_0_4px_rgba(255,217,125,0.5)]'
                    : 'bg-bg-surface border border-border'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
            {enemyTier}
          </span>
        </div>
      </div>
    </div>
  );
};
