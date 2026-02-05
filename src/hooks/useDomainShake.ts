/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 * 
 * Domain Expansion screen shake effect
 */

import { useCallback, useRef } from "react";
import { useAnimation } from "framer-motion";

// Personaggi che triggerano lo shake (i più potenti)
const SHAKE_CHARACTERS = ["gojoSatoru", "ryomenSukuna"];

export const useDomainShake = () => {
  const controls = useAnimation();
  const isShakingRef = useRef(false);

  const triggerShake = useCallback((characterId: string) => {
    if (!SHAKE_CHARACTERS.includes(characterId) || isShakingRef.current) {
      return;
    }

    isShakingRef.current = true;

    // Shake pattern diverso per personaggio
    const isGojo = characterId === "gojoSatoru";
    
    if (isGojo) {
      // Gojo: shake lento e potente (Infinite Void)
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        y: [0, 4, -4, 6, -6, 2, -2, 0],
        scale: [1, 1.02, 1],
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      });
    } else {
      // Sukuna: shake violento e rapido (Malevolent Shrine)
      controls.start({
        x: [0, -12, 12, -10, 10, -8, 8, -6, 6, 0],
        y: [0, -6, 6, -8, 8, -4, 4, -2, 2, 0],
        scale: [1, 1.03, 0.98, 1],
        transition: {
          duration: 0.5,
          ease: "circOut",
        },
      });
    }

    // Reset flag dopo l'animazione
    setTimeout(() => {
      isShakingRef.current = false;
    }, isGojo ? 800 : 500);
  }, [controls]);

  return { controls, triggerShake };
};
