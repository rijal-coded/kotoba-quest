import { motion, useAnimation } from 'motion/react';
import { useEffect, useMemo } from 'react';

/**
 * ParticleBurst - Geometric particle explosion effect.
 * Burst of triangles/diamonds radiating from a point, then fading out.
 *
 * @property {string} id - Unique identifier for cleanup
 * @property {number} x - Horizontal position as percentage (0-100) relative to container
 * @property {number} y - Vertical position as percentage (0-100) relative to container
 * @property {'cyan' | 'red' | 'green' | 'pink' | 'gold'} color - Particle color theme
 * @property {number} [count=12] - Number of particles (8-16 recommended)
 * @property {number} [velocity=80] - Base travel distance in pixels
 */
interface ParticleBurstProps {
  id: string;
  x: number;
  y: number;
  color: 'cyan' | 'red' | 'green' | 'pink' | 'gold';
  count?: number;
  velocity?: number;
}

// Map color prop to CSS variable
const colorToVar = (color: string) => {
  const map: Record<string, string> = {
    cyan: 'var(--main)', // maps to --main (cyan)
    red: 'var(--color-neon-red)',
    green: 'var(--color-neon-green)',
    pink: 'var(--color-neon-pink)',
    gold: '#FBBF24', // Tailwind amber-400
  };
  return map[color] || 'var(--main)';
};

// Generate random particle data
const generateParticle = (index: number, total: number, baseVelocity: number) => {
  const angle = (index / total) * 360; // evenly distributed around circle
  const velocity = baseVelocity * (0.8 + Math.random() * 0.4); // ±20% variance
  const rotation = Math.random() * 720 - 360; // ±2 rotations
  const size = 6 + Math.random() * 6; // 6-12px
  const delay = Math.random() * 0.1; // slight stagger for organic feel

  return { angle, velocity, rotation, size, delay };
};

export const ParticleBurst = ({
  id,
  x,
  y,
  color,
  count = 12,
  velocity = 80,
}: ParticleBurstProps) => {
  const colorVar = useMemo(() => colorToVar(color), [color]);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) =>
        generateParticle(i, count, velocity)
      ),
    [count, velocity]
  );

  const containerStyle = {
    left: `${x}%`,
    top: `${y}%`,
    width: 0,
    height: 0,
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
    zIndex: 100,
  };

  return (
    <div className="particle-burst" style={containerStyle}>
      {particles.map((p, i) => {
        // Compute end position using trigonometry
        const rad = (p.angle * Math.PI) / 180;
        const endX = Math.cos(rad) * p.velocity;
        const endY = Math.sin(rad) * p.velocity;

        return (
          <motion.div
            key={`${id}-${i}`}
            className="particle"
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: colorVar,
              // Cyberpunk shape: triangle (can also use diamond, square)
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              originX: 0.5,
              originY: 0.5,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: endX,
              y: endY,
              rotate: p.rotation,
              scale: [0, 1.2, 1],
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
              delay: p.delay,
            }}
          />
        );
      })}
    </div>
  );
};
