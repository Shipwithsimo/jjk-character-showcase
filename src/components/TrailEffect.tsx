/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { useEffect, useRef, useCallback } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  color: string;
  size: number;
};

const JJK_COLORS = [
  "rgba(139, 92, 246, 0.6)", // purple
  "rgba(239, 68, 68, 0.6)", // red
  "rgba(59, 130, 246, 0.6)", // blue
  "rgba(6, 182, 212, 0.6)", // cyan
];

// Pool di particelle riutilizzabili per evitare garbage collection
const MAX_PARTICLES = 8;
const PARTICLE_LIFETIME = 400;

export const TrailEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number>();
  const mousePosRef = useRef({ x: 0, y: 0 });

  const addParticle = useCallback((x: number, y: number) => {
    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      createdAt: performance.now(),
      color: JJK_COLORS[Math.floor(Math.random() * JJK_COLORS.length)],
      size: 6 + Math.random() * 4, // 6-10px
    };

    particlesRef.current.push(newParticle);
    // Mantieni solo le ultime N particelle
    if (particlesRef.current.length > MAX_PARTICLES) {
      particlesRef.current.shift();
    }
  }, []);

  // Throttled mouse tracking usando requestAnimationFrame
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      if (now - lastUpdateRef.current < 40) return; // ~25fps per nuove particelle

      lastUpdateRef.current = now;
      addParticle(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [addParticle]);

  // Render loop ottimizzato con Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filtra e disegna particelle
      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.createdAt;
        if (age > PARTICLE_LIFETIME) return false;

        const progress = age / PARTICLE_LIFETIME;
        const opacity = 1 - progress;
        const size = p.size * (1 - progress * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${opacity})`);
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.8 }}
    />
  );
};
