/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "rgba(139, 92, 246, 0.4)", // purple
  "rgba(239, 68, 68, 0.3)",  // red
  "rgba(59, 130, 246, 0.3)",  // blue
  "rgba(6, 182, 212, 0.3)",   // cyan
];

const PARTICLE_COUNT = 12;

export const EnergyAura = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();

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

    // Inizializza particelle
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedY: -Math.random() * 0.3 - 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let frameCount = 0;
    const render = () => {
      frameCount++;
      // Renderizza ogni 2 frame per ridurre il carico (~30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((p) => {
          // Aggiorna posizione
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.1;

          // Reset se esce dallo schermo
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }

          // Disegna particella
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
