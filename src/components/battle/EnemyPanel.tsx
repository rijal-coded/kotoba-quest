import { motion } from 'motion/react';
import { Target, Skull } from 'lucide-react';
import { EnemyTemplate } from '../../utils/enemyUtils';
import { useEffect, useMemo, useState } from 'react';



interface WaveAnnouncement {
  waveId: number;
  wave: number;
  enemyName: string;
  enemyRank: string;
  enemyTier: number;
  isBoss: boolean;
}

interface EnemyPanelProps {
  enemy: EnemyTemplate;
  currentHP: number;
  cooldownPercentage: number;
  waveAnnouncement?: WaveAnnouncement | null;
  onWaveDismiss?: () => void;
}

function getHPBarClass(percent: number): string {
  if (percent <= 20) return 'kawaii-hp-fill--danger';
  if (percent <= 40) return 'kawaii-hp-fill--low';
  if (percent <= 70) return 'kawaii-hp-fill--mid';
  return 'kawaii-hp-fill--high';
}

export const EnemyPanel = ({ enemy, currentHP, cooldownPercentage, waveAnnouncement, onWaveDismiss }: EnemyPanelProps) => {
  const hpPercent = Math.max(0, Math.min(100, enemy.maxHp > 0 ? (currentHP / enemy.maxHp) * 100 : 0));
  const hpBarClass = useMemo(() => getHPBarClass(hpPercent), [hpPercent]);
  const isBoss = enemy.tier >= 4;
  const [stripVisible, setStripVisible] = useState(false);
  const [stripDismissing, setStripDismissing] = useState(false);

  const hasAnnouncement = !!waveAnnouncement;

  // slide strip in when announcement appears
  useEffect(() => {
    if (hasAnnouncement) {
      setStripDismissing(false);
      const t = requestAnimationFrame(() => setStripVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setStripVisible(false);
      setStripDismissing(false);
    }
  }, [hasAnnouncement]);

  // auto-dismiss after 3.5s, keyed by waveId
  useEffect(() => {
    if (!hasAnnouncement || !onWaveDismiss) return;
    const timer = setTimeout(() => {
      setStripDismissing(true);
      setTimeout(() => onWaveDismiss(), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [hasAnnouncement, onWaveDismiss, waveAnnouncement?.waveId]);

  const handleStripDismiss = () => {
    if (stripDismissing) return;
    setStripDismissing(true);
    setTimeout(() => onWaveDismiss?.(), 300);
  };

  return (
    <div className="kawaii-panel sticky md:static top-[61px] z-30 md:col-span-12 py-2 md:py-3 px-3 md:px-4">
      {/* Wave announcement strip */}
      {hasAnnouncement && (
        <div
          className={`flex items-center justify-between gap-2 px-2.5 py-1 mb-2 rounded border cursor-pointer transition-all duration-300 ease-out ${
            stripVisible && !stripDismissing
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1'
          } ${
            waveAnnouncement.isBoss
              ? 'bg-warning/10 border-warning/50'
              : 'bg-main/5 border-main/30'
          }`}
          onClick={handleStripDismiss}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            {waveAnnouncement.isBoss && <Skull className="w-3 h-3 text-warning shrink-0" />}
            <span className={`text-[9px] font-bold uppercase tracking-wider ${
              waveAnnouncement.isBoss ? 'text-warning' : 'text-main'
            }`}>
              {waveAnnouncement.isBoss ? 'Pertempuran' : `Gelombang ${waveAnnouncement.wave}`}
            </span>
            <span className="text-border text-[9px]">·</span>
            <span className="text-[10px] font-bold text-text-primary truncate">
              {waveAnnouncement.enemyName}
            </span>
            <span className="text-[9px] font-bold text-text-secondary whitespace-nowrap">
              {waveAnnouncement.enemyRank} · T{waveAnnouncement.enemyTier}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleStripDismiss(); }}
            className="text-text-secondary hover:text-text-primary text-[9px] font-bold shrink-0 px-1 py-0.5 rounded hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Row 1: Name + rank + HP text + HP bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3
            className={`text-base md:text-xl font-bold leading-none tracking-tight truncate ${
              isBoss ? 'text-danger' : 'text-main'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {enemy.name}
          </h3>
          <span className="text-[9px] md:text-[10px] font-bold text-text-secondary bg-bg-surface-alt px-1.5 py-0.5 rounded shrink-0">
            {enemy.rank}
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-mono font-bold text-text-secondary shrink-0">
          {currentHP}/{enemy.maxHp}
        </span>
      </div>

      {/* HP bar (full width, thin) */}
      <div className="kawaii-hp-bar mt-1">
        <motion.div
          className={`kawaii-hp-fill ${hpBarClass}`}
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ height: '0.375rem' }}
        />
      </div>

      {/* Row 2: Intent bar + percentage + tier dots */}
      <div className="flex items-center gap-3 mt-2">
        {/* Intent section */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Target className="w-3 h-3 text-text-secondary shrink-0" />
          <span className="text-[9px] md:text-[10px] font-bold text-text-secondary uppercase tracking-wider shrink-0">
            Intent
          </span>
          <span className="text-[10px] md:text-xs font-mono font-bold text-main shrink-0">
            {Math.round(cooldownPercentage)}%
          </span>
          <div className="kawaii-hp-bar flex-1 min-w-0">
            <motion.div
              className="kawaii-hp-fill kawaii-hp-fill--danger"
              animate={{ width: `${cooldownPercentage}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ height: '0.25rem' }}
            />
          </div>
        </div>

        {/* Tier dots */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-1.5 rounded-sm transition-all ${
                  i < enemy.tier
                    ? isBoss
                      ? 'bg-warning shadow-[0_0_3px_rgba(255,217,125,0.4)]'
                      : 'bg-main shadow-[0_0_3px_rgba(0,156,255,0.3)]'
                    : 'bg-border/40'
                }`}
              />
            ))}
          </div>
          <span className="text-[8px] md:text-[9px] font-bold text-text-secondary uppercase hidden sm:inline">
            T{enemy.tier}
          </span>
        </div>
      </div>
    </div>
  );
};
