import { useState, useEffect, useRef, useCallback } from "react";
import { MousePosition } from "../lib/types";

export const useMousePosition = (normalizer = 4) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef(0);
  const coordsRef = useRef({ x: 0, y: 0 });

  const updatePosition = useCallback(() => {
    const now = performance.now();
    // Throttle a ~30fps per il parallax (sufficiente e fluido)
    if (now - lastUpdateRef.current < 33) {
      rafRef.current = requestAnimationFrame(updatePosition);
      return;
    }

    lastUpdateRef.current = now;
    setPosition({
      x: coordsRef.current.x / normalizer,
      y: coordsRef.current.y / normalizer,
    });
    rafRef.current = undefined;
  }, [normalizer]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Salva le coordinate normalizzate
      coordsRef.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      };

      // Avvia l'aggiornamento se non già in corso
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updatePosition]);

  return position;
};