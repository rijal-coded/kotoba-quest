import { useEffect, useState } from 'react';
import { Skull } from 'lucide-react';

interface WaveBannerProps {
  wave: number;
  enemyName: string;
  enemyRank: string;
  enemyTier: number;
  isBoss: boolean;
  onDismiss: () => void;
}

const TIER_LABELS = ['Ashigaru', 'Samurai', 'Hatamoto', 'Daimyo', 'Shogun'];

export const WaveBanner = ({ wave, enemyName, enemyRank, enemyTier, isBoss, onDismiss }: WaveBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // slide in after mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // auto-dismiss after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissed(true);
      setTimeout(onDismiss, 200);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClick = () => {
    setDismissed(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 cursor-pointer transition-all duration-300 ease-out ${
        visible && !dismissed
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
      }`}
      style={{ transitionDuration: dismissed ? '200ms' : '300ms' }}
      onClick={handleClick}
    >
      <div
        className={`flex items-center justify-between gap-3 px-4 py-2.5 backdrop-blur-md border-b ${
          isBoss
            ? 'bg-warning/10 border-warning/50 shadow-[0_0_12px_rgba(255,217,125,0.15)]'
            : 'bg-bg-surface/90 border-main/30'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          {isBoss && <Skull className="w-4 h-4 text-warning shrink-0" />}
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary whitespace-nowrap">
            {isBoss ? 'Pertempuran' : `Gelombang ${wave}`}
          </span>
          <span className="text-border">|</span>
          <span className={`text-sm font-bold ${isBoss ? 'text-warning' : 'text-main'}`}>
            {enemyName}
          </span>
          <span className="text-xs font-bold text-text-secondary whitespace-nowrap">
            {enemyRank} · Tier {enemyTier}
          </span>
          {/* tier dots */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-1.5 rounded-sm ${
                  i < enemyTier
                    ? isBoss
                      ? 'bg-warning shadow-[0_0_4px_rgba(255,217,125,0.5)]'
                      : 'bg-main shadow-[0_0_4px_rgba(0,156,255,0.4)]'
                    : 'bg-border/50'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="text-text-secondary hover:text-text-primary text-xs font-bold shrink-0 px-2 py-1 rounded hover:bg-white/5 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
