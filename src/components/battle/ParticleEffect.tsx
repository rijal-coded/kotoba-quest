import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'confetti' | 'ember';
}

interface ParticleEffectProps {
  active: boolean;
  type: 'correct' | 'skill' | 'victory' | 'defeat' | 'item' | 'enemyAttack' | 'guard';
  originX?: number;
  originY?: number;
}

const EFFECT_CONFIGS = {
  correct: {
    count: 12,
    colors: ['#A8E6CF', '#FF8FAB', '#FFD1DC', '#B8A9C9'],
    speed: 4,
    life: 40,
    size: 3,
    type: 'spark' as const,
  },
  skill: {
    count: 20,
    colors: ['#FF8FAB', '#B8A9C9', '#FFD1DC'],
    speed: 6,
    life: 30,
    size: 2,
    type: 'spark' as const,
  },
  victory: {
    count: 60,
    colors: ['#A8E6CF', '#FF8FAB', '#FFD1DC', '#B8A9C9', '#FFD97D', '#FFB3C6'],
    speed: 5,
    life: 80,
    size: 4,
    type: 'confetti' as const,
  },
  defeat: {
    count: 30,
    colors: ['#FF6B8A', '#B8A9C9', '#8B7E74'],
    speed: 2,
    life: 60,
    size: 2,
    type: 'ember' as const,
  },
  item: {
    count: 15,
    colors: ['#A8E6CF', '#FFD97D', '#FFD1DC'],
    speed: 3,
    life: 45,
    size: 3,
    type: 'spark' as const,
  },
  enemyAttack: {
    count: 20,
    colors: ['#FF6B8A', '#FF8FA3', '#E85577'],
    speed: 5,
    life: 30,
    size: 4,
    type: 'ember' as const,
  },
  guard: {
    count: 18,
    colors: ['#B8A9C9', '#FFD1DC', '#C8B6E2'],
    speed: 4,
    life: 25,
    size: 3,
    type: 'spark' as const,
  },
};

export const ParticleEffect = ({ active, type, originX, originY }: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const config = EFFECT_CONFIGS[type];

  const spawnParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = originX ?? canvas.width / 2;
    const cy = originY ?? canvas.height / 2;

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
      const speed = config.speed * (0.5 + Math.random() * 0.5);

      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (config.type === 'confetti' ? 2 : 0),
        life: config.life,
        maxLife: config.life,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: config.size * (0.5 + Math.random() * 0.5),
        type: config.type,
      });
    }
  }, [config, originX, originY]);

  useEffect(() => {
    if (!active) return;
    spawnParticles();
  }, [active, spawnParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => {
        p.life--;
        if (p.life <= 0) return false;

        const progress = p.life / p.maxLife;
        const alpha = progress;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity

        ctx.globalAlpha = alpha;

        if (p.type === 'confetti') {
          ctx.fillStyle = p.color;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.life * 0.1);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 2);
          ctx.restore();
        } else if (p.type === 'ember') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
          ctx.fill();

          // Glow
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * progress * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      ctx.globalAlpha = 1;

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
