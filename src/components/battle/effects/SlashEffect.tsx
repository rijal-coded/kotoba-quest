import { motion } from 'motion/react';
import { CSSProperties } from 'react';

interface SlashEffectProps {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color?: string; // CSS color, defaults to neon red/pink
}

/**
 * SlashEffect - A quick slashing animation for attack skills.
 * Renders a diagonal slash line that rapidly draws itself across the target area.
 */
export const SlashEffect = ({ x, y, color = 'rgba(239, 68, 68, 0.9)' }: SlashEffectProps) => {
  const slashSize = 120; // size in px
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

  return (
    <div className="slash-effect" style={containerStyle}>
      <motion.svg
        width={slashSize}
        height={slashSize}
        viewBox="0 0 100 100"
        style={{ position: 'absolute', left: -slashSize/2, top: -slashSize/2 }}
      >
        <motion.line
          x1="10"
          y1="10"
          x2="90"
          y2="90"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8))',
          }}
        />
      </motion.svg>
    </div>
  );
};
