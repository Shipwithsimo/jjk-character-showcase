/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

interface ThemedCursorProps {
  characterId: string | null;
}

// Configurazione cursor per ogni personaggio
type CursorConfig = {
  emoji: string;
  size: number;
  glowColor: string;
  trail: boolean;
};

const CURSOR_CONFIGS: Record<string, CursorConfig> = {
  itadoriYuji: {
    emoji: "👊",
    size: 28,
    glowColor: "rgba(236, 72, 153, 0.6)", // Rosa
    trail: true,
  },
  gojoSatoru: {
    emoji: "∞",
    size: 32,
    glowColor: "rgba(6, 182, 212, 0.8)", // Azzurro
    trail: true,
  },
  ryomenSukuna: {
    emoji: "👁️",
    size: 28,
    glowColor: "rgba(220, 38, 38, 0.7)", // Rosso
    trail: true,
  },
  tojiFushiguro: {
    emoji: "🗡️",
    size: 28,
    glowColor: "rgba(16, 185, 129, 0.6)", // Verde
    trail: false,
  },
  "makiZen'in": {
    emoji: "⚔️",
    size: 28,
    glowColor: "rgba(139, 92, 246, 0.6)", // Viola
    trail: false,
  },
  default: {
    emoji: "✦",
    size: 16,
    glowColor: "rgba(139, 92, 246, 0.4)", // Viola default
    trail: false,
  },
};

export const ThemedCursor = ({ characterId }: ThemedCursorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring per movimento fluido
  const springConfig = { damping: 20, stiffness: 500, mass: 0.3 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const config = characterId ? CURSOR_CONFIGS[characterId] : CURSOR_CONFIGS.default;

  useEffect(() => {
    // Nascondi cursore di default
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    
    // Nascondi cursore su tutti gli elementi
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.innerHTML = `
      * { cursor: none !important; }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Trail effect per alcuni personaggi
      if (config.trail && Math.random() > 0.8) {
        const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() };
        setTrail((prev) => [...prev.slice(-4), newTrail]);
        
        setTimeout(() => {
          setTrail((prev) => prev.filter((t) => t.id !== newTrail.id));
        }, 300);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };
    
    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.body.style.cursor = originalCursor;
      const existingStyle = document.getElementById("custom-cursor-style");
      if (existingStyle) document.head.removeChild(existingStyle);
      
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY, config.trail]);

  const halfSize = config.size / 2;

  return (
    <>
      {/* Trail particles */}
      {config.trail && trail.map((t) => (
        <motion.div
          key={t.id}
          className="fixed pointer-events-none z-[9998]"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            left: t.x - config.size * 0.25,
            top: t.y - config.size * 0.25,
            width: config.size * 0.5,
            height: config.size * 0.5,
            backgroundColor: config.glowColor,
            borderRadius: "50%",
            filter: "blur(3px)",
          }}
        />
      ))}

      {/* Cursore principale - posizionato con left/top invece di transform */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: smoothX,
          top: smoothY,
          marginLeft: -halfSize,
          marginTop: -halfSize,
          width: config.size,
          height: config.size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{
          scale: isClicking ? 0.85 : isHovering ? 1.25 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Glow effect - centrato assolutamente */}
        <div
          className="absolute rounded-full"
          style={{
            width: config.size * 2,
            height: config.size * 2,
            left: "50%",
            top: "50%",
            marginLeft: -config.size,
            marginTop: -config.size,
            backgroundColor: config.glowColor,
            filter: "blur(10px)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        {/* Emoji/Simbolo - centrato */}
        <span
          style={{
            fontSize: config.size,
            lineHeight: 1,
            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))",
            userSelect: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {config.emoji}
        </span>
      </motion.div>
    </>
  );
};
