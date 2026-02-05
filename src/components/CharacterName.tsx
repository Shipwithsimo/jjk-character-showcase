/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { motion } from "framer-motion";
import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { ANIMATION_CONFIG } from "../lib/constant";
import { Character } from "../lib/types";
import "../styles/textEffects.css";

type CharacterNameProps = {
  character: Character;
  onHover: (text: string) => void;
  onHoverEnd: () => void;
  onLockToggle?: (characterId: string) => void;
  isLocked?: boolean;
};

// Mappa degli effetti speciali per personaggio
const SPECIAL_EFFECTS: Record<string, "blood" | "frost" | "wave"> = {
  ryomenSukuna: "blood",
  gojoSatoru: "frost",
  itadoriYuji: "wave",
  tojiFushiguro: "wave",
  "makiZen'in": "wave",
};

const CharacterNameComponent = ({
  character,
  onHover,
  onHoverEnd,
  onLockToggle,
  isLocked = false,
}: CharacterNameProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Colori del personaggio
  const colors = character.colors;
  const specialEffect = SPECIAL_EFFECTS[character.id] || "wave";

  // Stili dinamici basati sui colori del personaggio (solo quando locked)
  const characterStyles = useMemo(() => {
    const gradient = `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`;
    const glowShadow = `0 0 20px ${colors.primary}80, 0 0 40px ${colors.secondary}60`;
    const borderColor = colors.primary;
    const depthColor = colors.secondary;

    return {
      gradient,
      glowShadow,
      borderColor,
      depthColor,
    };
  }, [colors]);

  // Glitch effect solo quando locked (meno distrazioni)
  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover(character.displayName);
  }, [onHover, character.displayName]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverEnd();
  }, [onHoverEnd]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onLockToggle?.(character.id);
  }, [onLockToggle, character.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onLockToggle?.(character.id);
    }
  }, [onLockToggle, character.id]);

  // Determina le classi CSS per gli effetti
  const getEffectClasses = () => {
    const classes = ["relative", "transition-all", "duration-200", "cursor-pointer", "text-3d"];
    
    if (isLocked) {
      classes.push("border-b-2", "text-3d-active");
      
      // Applica effetto speciale in base al personaggio
      switch (specialEffect) {
        case "blood":
          classes.push("cursed-blood");
          break;
        case "frost":
          classes.push("frost-glitch", "locked");
          break;
        case "wave":
          classes.push("wave-motion");
          break;
      }
    } else {
      // Wave motion per tutti in idle (più leggero)
      classes.push("wave-motion");
    }

    if (isGlitching) {
      classes.push("text-glitch");
    }

    return classes.join(" ");
  };

  // Stile per il layer frontale (gradiente quando locked)
  const frontStyle = isLocked
    ? {
        backgroundImage: characterStyles.gradient,
        backgroundClip: "text" as const,
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
        color: "transparent" as const,
      }
    : {
        color: "#ffffff",
      };

  // Stile per il testo 3D dietro (ombra solida)
  const backStyle = {
    color: isLocked ? characterStyles.depthColor : "rgba(139, 92, 246, 0.3)",
  };

  // Renderizza le gocce di sangue extra per Sukuna
  const renderBloodDrops = () => {
    if (specialEffect !== "blood" || !isLocked) return null;
    
    return (
      <>
        <span className="blood-drop-1" />
        <span className="blood-drop-2" />
        <span className="blood-drop-3" />
      </>
    );
  };

  return (
    <motion.span
      data-text={character.displayName}
      role="button"
      tabIndex={0}
      aria-label={`Visualizza scene di ${character.displayName}. Premi Invio per selezionare.`}
      aria-pressed={isLocked}
      className={getEffectClasses()}
      style={{
        borderColor: isLocked ? characterStyles.borderColor : "transparent",
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: "0.05em",
        willChange: "transform",
      }}
      animate={isLocked ? ANIMATION_CONFIG.hover : ANIMATION_CONFIG.initial}
      whileHover={{
        ...ANIMATION_CONFIG.hover,
        filter: "brightness(1.2)",
      }}
      transition={{
        ...ANIMATION_CONFIG.transition,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Testo 3D dietro (layer di profondità) - visibile solo quando NON locked */}
      {!isLocked && (
        <span 
          className="text-3d-back" 
          aria-hidden="true"
          style={{
            ...backStyle,
            textShadow: isGlitching
              ? `1px 1px 0 ${colors.secondary}, -1px -1px 0 ${colors.accent}`
              : "none",
          }}
        >
          {character.displayName}
        </span>
      )}
      
      {/* Testo principale (davanti) - gradiente */}
      <span 
        className="text-3d-front"
        style={{
          ...frontStyle,
          textShadow: isGlitching && isLocked
            ? `2px 2px 0 ${colors.secondary}, -2px -2px 0 ${colors.accent}`
            : isHovered && !isLocked
            ? "0 0 20px rgba(255, 255, 255, 0.8)"
            : "none",
        }}
      >
        {character.displayName}
      </span>
      
      {renderBloodDrops()}
    </motion.span>
  );
};

export const CharacterName = memo(CharacterNameComponent);
