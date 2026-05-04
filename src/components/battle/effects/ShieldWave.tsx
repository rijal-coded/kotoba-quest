import { motion } from 'motion/react';
import { CSSProperties } from 'react';

interface ShieldWaveProps {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color?: string; // CSS color, defaults to neon cyan
}

/**
 * ShieldWave - Expanding ring burst for defensive/block skill.
 * Renders concentric rings that expand outward and fade.
 */
export const ShieldWave = ({ x, y, color = 'rgba(6, 182, 212, 0.9)' }: ShieldWaveProps) => {
  const containerStyle: CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    pointerEvents: 'none',
    zIndex: 60,
  };

  const ringCount = 3;

  return (
    <div className="shield-wave" style={containerStyle}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.div
          key={i}
          className="shield-ring"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            boxShadow: `0 0 10px ${color}`,
          }}
          initial={{ width: 20, height: 20, opacity: 1 }}
          animate={{
            width: 200,
            height: 200,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.15,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
