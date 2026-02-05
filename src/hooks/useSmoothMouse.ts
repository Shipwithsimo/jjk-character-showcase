import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

// Hook per mouse tracking fluido con spring physics
export const useSmoothMouse = (damping: number = 25, stiffness: number = 150) => {
  // Raw values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed values con spring
  const smoothX = useSpring(mouseX, {
    damping,
    stiffness,
    mass: 0.5,
  });
  const smoothY = useSpring(mouseY, {
    damping,
    stiffness,
    mass: 0.5,
  });

  useEffect(() => {
    let rafId: number;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calcola posizione relativa al centro
      currentX = e.clientX - window.innerWidth / 2;
      currentY = e.clientY - window.innerHeight / 2;

      // Update immediato, lo spring gestisce la smoothness
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          mouseX.set(currentX);
          mouseY.set(currentY);
          rafId = 0;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  return { x: smoothX, y: smoothY };
};
