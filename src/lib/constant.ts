/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */

import { CharacterInfo } from "./types";

export const ANIMATION_CONFIG = {
  initial: {
    scaleY: 1.15,
  },
  hover: {
    scaleY: 1.3,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 0.8,
  },
} as const;

export const CHARACTER_LIST: CharacterInfo[] = [
  {
    id: "itadoriYuji",
    displayName: "Itadori Yuji",
    colors: {
      primary: "#ec4899", // Rosa capelli
      secondary: "#f97316", // Arancione energia
      accent: "#7c3aed", // Viola uniforme
    },
  },
  {
    id: "gojoSatoru",
    displayName: "Gojo Satoru",
    colors: {
      primary: "#06b6d4", // Azzurro Six Eyes
      secondary: "#3b82f6", // Blu tecniche
      accent: "#ffffff", // Bianco capelli/benda
    },
  },
  {
    id: "ryomenSukuna",
    displayName: "Ryomen Sukuna",
    colors: {
      primary: "#dc2626", // Rosso segni
      secondary: "#991b1b", // Rosso scuro
      accent: "#171717", // Nero
    },
  },
  {
    id: "tojiFushiguro",
    displayName: "Toji Fushiguro",
    colors: {
      primary: "#10b981", // Verde occhi
      secondary: "#065f46", // Verde scuro
      accent: "#18181b", // Nero outfit
    },
  },
  {
    id: "makiZen'in",
    displayName: "Maki Zen'in",
    colors: {
      primary: "#8b5cf6", // Viola armi
      secondary: "#ec4899", // Rosa energia
      accent: "#1e1b4b", // Blu notte
    },
  },
];