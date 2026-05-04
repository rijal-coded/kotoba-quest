import { motion } from 'motion/react';
import { CSSProperties, useEffect, useMemo } from 'react';

/**
 * Floating text popup for combat feedback.
 * Displays damage, healing, SP gain, score, or status messages that float upward and fade.
 *
 * @property {string} id - Unique identifier for cleanup
 * @property {string} text - Text to display (e.g., "-30", "BENAR!", "+35 SP")
 * @property {number} x - Horizontal position as percentage (0-100) relative to container
 * @property {number} y - Vertical position as percentage (0-100) relative to container
 * @property {'damage' | 'heal' | 'sp' | 'score' | 'critical' | 'benar' | 'salah'} color - Color theme of the text
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Font size variant
 * @property {number} [duration=1.5] - Animation duration in seconds
 */
interface FloatingTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  color: 'damage' | 'heal' | 'sp' | 'score' | 'critical' | 'benar' | 'salah';
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const FloatingText = ({
  id,
  text,
  x,
  y,
  color,
  size = 'md',
  duration = 1.5,
}: FloatingTextProps) => {
  const colorVar = useMemo(() => `var(--color-${color})`, [color]);

  // Use inline style for dynamic positioning and color theming
  const containerStyle: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    color: colorVar,
    textShadow: `0 0 8px ${colorVar}, 0 0 12px ${colorVar}`,
    willChange: 'transform, opacity',
  };

  return (
    <motion.div
      className="floating-text absolute pointer-events-none z-50 font-mono font-black uppercase tracking-wider"
      style={containerStyle}
      initial={{ y: 0, scale: 1, opacity: 1 }}
      animate={{ y: -120, scale: 0.5, opacity: 0 }}
      transition={{ duration, ease: 'easeOut' }}
    >
      <span className={sizeClasses[size]}>{text}</span>
    </motion.div>
  );
};
