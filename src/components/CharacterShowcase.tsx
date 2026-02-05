/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { motion, useAnimation, useTransform, MotionValue, useSpring } from "framer-motion";
import { memo, useState, useRef, useCallback, useEffect } from "react";
import { CharacterScene } from "../lib/data";

// Mappa degli effetti aura per personaggio
type AuraType = "fire" | "frost" | "neutral" | "cursed" | "steel";

const CHARACTER_AURA: Record<string, AuraType> = {
  itadoriYuji: "fire",
  gojoSatoru: "frost", 
  ryomenSukuna: "cursed",
  tojiFushiguro: "steel",
  "makiZen'in": "neutral",
};

const AURA_COLORS: Record<AuraType, { primary: string; secondary: string; glow: string }> = {
  fire: {
    primary: "#ef4444",
    secondary: "#f97316", 
    glow: "rgba(239, 68, 68, 0.6)",
  },
  frost: {
    primary: "#06b6d4",
    secondary: "#3b82f6",
    glow: "rgba(6, 182, 212, 0.6)",
  },
  cursed: {
    primary: "#dc2626",
    secondary: "#7f1d1d",
    glow: "rgba(220, 38, 38, 0.7)",
  },
  steel: {
    primary: "#10b981",
    secondary: "#065f46",
    glow: "rgba(16, 185, 129, 0.5)",
  },
  neutral: {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    glow: "rgba(139, 92, 246, 0.5)",
  },
};

type CharacterShowcaseProps = {
  selectedName: string;
  scene: CharacterScene;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  onCardClick?: (characterId: string, sceneIndex: number) => void;
};

// Profondità parallax per ogni card
const PARALLAX_CONFIG = [
  { factor: 0.15, zOffset: -50, scale: 0.9 },
  { factor: 0.35, zOffset: 0, scale: 1 },
  { factor: 0.55, zOffset: 50, scale: 1.05 },
];

const CharacterShowcaseComponent = ({
  selectedName,
  scene,
  index,
  mouseX,
  mouseY,
  onCardClick,
}: CharacterShowcaseProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const controls = useAnimation();
  
  const config = PARALLAX_CONFIG[index] || PARALLAX_CONFIG[1];
  const auraType = CHARACTER_AURA[selectedName] || "neutral";
  const auraColors = AURA_COLORS[auraType];

  // Spring smoother per tilt
  const springConfig = { damping: 20, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Movimento base del mouse
  const baseX = useTransform(mouseX, (val) => scene.offsetX + val * config.factor);
  const baseY = useTransform(mouseY, (val) => scene.offsetY + val * config.factor);
  
  // Parallax aggiuntivo
  const parallaxX = useTransform(mouseX, (val) => val * config.factor * 0.3);
  const parallaxY = useTransform(mouseY, (val) => val * config.factor * 0.3);

  // 🎯 PARALLAX TILT ESTREMO - più intenso
  const tiltIntensity = 0.025 + (index * 0.008);
  const rotateX = useTransform(smoothMouseY, (val) => isHovered ? -val * tiltIntensity : 0);
  const rotateY = useTransform(smoothMouseX, (val) => isHovered ? val * tiltIntensity : 0);

  // Shake effect al primo render
  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start({
        x: [0, -3, 3, -2, 2, 0],
        y: [0, 2, -2, 2, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }, index * 150 + 200);
    return () => clearTimeout(timer);
  }, [index, controls]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExploding(true);
    controls.start({
      scale: [1, 1.3, 0],
      opacity: [1, 0.8, 0],
      rotate: [scene.rotate, scene.rotate + 180, scene.rotate + 360],
      transition: { duration: 0.5, times: [0, 0.3, 1] },
    });
    setTimeout(() => {
      setIsExploding(false);
      controls.start({
        scale: config.scale,
        opacity: 1,
        rotate: scene.rotate,
      });
    }, 800);
  }, [controls, scene.rotate, config.scale]);

  if (isExploding) {
    return (
      <motion.div
        ref={cardRef}
        className="absolute flex aspect-[3/2] w-56 sm:w-60 items-center justify-center overflow-hidden rounded-xl cursor-pointer"
        style={{
          x: baseX,
          y: baseY,
          rotate: scene.rotate,
          zIndex: 10 + index,
          transformStyle: "preserve-3d",
        }}
        animate={controls}
      >
        <img
          src={scene.src}
          alt={selectedName}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute flex aspect-[3/2] w-56 sm:w-60 items-center justify-center overflow-hidden rounded-xl cursor-pointer character-card"
      style={{
        x: baseX,
        y: baseY,
        translateX: parallaxX,
        translateY: parallaxY,
        rotate: scene.rotate,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: config.scale,
        zIndex: 10 + index,
        transformStyle: "preserve-3d",
        willChange: "transform",
        // 🎨 Bordo aura colorato personaggio
        border: `2px solid ${isHovered ? auraColors.primary : auraColors.secondary + "60"}`,
        boxShadow: isHovered 
          ? `0 0 30px ${auraColors.glow}, 0 0 60px ${auraColors.glow}, inset 0 0 20px ${auraColors.glow}`
          : `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${auraColors.glow}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: config.scale, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        mass: 0.6,
        delay: index * 0.1,
      }}
      whileHover={{
        scale: config.scale * 1.1,
        z: config.zOffset + 40,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onCardClick?.(selectedName, index);
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Immagine principale */}
      <img
        src={scene.src}
        alt={selectedName}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* 🎬 VIGNETTE CINEMA - Cornice scura stile film */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)
          `,
        }}
      />

      {/* 🔥 FIRE AURA - Per personaggi fuoco/caldo */}
      {auraType === "fire" && (
        <>
          {/* Fiamme sul bordo inferiore */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: `linear-gradient(0deg, ${auraColors.primary}60 0%, transparent 100%)`,
              animation: "fireFlicker 0.5s ease-in-out infinite alternate",
            }}
          />
          {/* Particelle fuoco */}
          <div className="absolute inset-0 pointer-events-none fire-particles" />
        </>
      )}

      {/* ❄️ FROST OVERLAY - Per Gojo */}
      {auraType === "frost" && (
        <>
          {/* Bordo ghiacciato */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, rgba(6,182,212,0.3) 0%, transparent 30%),
                linear-gradient(315deg, rgba(59,130,246,0.2) 0%, transparent 30%)
              `,
              boxShadow: "inset 0 0 30px rgba(6,182,212,0.2)",
            }}
          />
          {/* Cristalli di ghiaccio ai bordi */}
          <div 
            className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
            style={{
              background: "linear-gradient(315deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        </>
      )}

      {/* 👁️ CURSED AURA - Per Sukuna */}
      {auraType === "cursed" && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(220,38,38,0.2) 0%, transparent 40%),
                radial-gradient(circle at 70% 70%, rgba(127,29,29,0.3) 0%, transparent 40%)
              `,
              animation: "cursedPulse 2s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* ⚔️ STEEL AURA - Per Toji */}
      {auraType === "steel" && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(45deg, rgba(16,185,129,0.1) 0%, transparent 50%, rgba(6,95,70,0.1) 100%)",
          }}
        />
      )}

      {/* Overlay gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-red-600/10 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
};

export const CharacterShowcase = memo(CharacterShowcaseComponent);
