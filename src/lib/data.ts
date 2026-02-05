/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 *
 * Character scene data and assets
 */

import itadoriYuji1 from "/itadori-yuji-1.gif";
import itadoriYuji2 from "/itadori-yuji-2.gif";
import itadoriYuji3 from "/itadori-yuji-3.gif";
import itadoriYuji4 from "/itadori-yuji-4.gif";
import itadoriYuji5 from "/itadori-yuji-5.gif";
import gojoSatoru1 from "/gojo-satoru-1.gif";
import gojoSatoru2 from "/gojo-satoru-2.gif";
import gojoSatoru3 from "/gojo-satoru-3.gif";
import gojoSatoru4 from "/gojo-satoru-4.gif";
import gojoSatoru5 from "/gojo-satoru-5.gif";
import ryomenSukuna1 from "/ryomen-sukuna-1.gif";
import ryomenSukuna2 from "/ryomen-sukuna-2.gif";
import ryomenSukuna3 from "/ryomen-sukuna-3.gif";
import ryomenSukuna4 from "/ryomen-sukuna-4.gif";
import ryomenSukuna5 from "/ryomen-sukuna-5.gif";
import tojiFushiguro1 from "/toji-fushiguro-1.gif";
import tojiFushiguro2 from "/toji-fushiguro-2.gif";
import tojiFushiguro3 from "/toji-fusghiguro-3.gif";
import tojiFushiguro4 from "/toji-fushiguro-4.gif";
import tojiFushiguro5 from "/toji-fushiguro-5.gif";
import makiZenin1 from "/maki-zen'in-1.gif";
import makiZenin2 from "/maki-zen'in-2.gif";
import makiZenin3 from "/maki-zen'in-3..gif";
import makiZenin4 from "/maki-zen'in-4.gif";
import makiZenin5 from "/maki-zen'in-5.gif";
import { PhysicsConfig } from "../hooks/usePhysicsEngine";

export type CharacterScene = {
  src: string;
  offsetX: number;
  offsetY: number;
  rotate: number;
};

export type CharacterPhysics = Record<string, PhysicsConfig>;

export const sceneData: Record<string, CharacterScene[]> = {
  itadoriYuji: [
    {
      src: itadoriYuji1,
      offsetX: -480,
      offsetY: -200,
      rotate: -10,
    },
    {
      src: itadoriYuji2,
      offsetX: -10,
      offsetY: -320,
      rotate: 3,
    },
    {
      src: itadoriYuji3,
      offsetX: 450,
      offsetY: -120,
      rotate: -6,
    },
    {
      src: itadoriYuji4,
      offsetX: 0,
      offsetY: 0,
      rotate: 5,
    },
    {
      src: itadoriYuji5,
      offsetX: 0,
      offsetY: 0,
      rotate: -8,
    },
  ],
  gojoSatoru: [
    {
      src: gojoSatoru1,
      offsetX: -520,
      offsetY: -150,
      rotate: 5,
    },
    {
      src: gojoSatoru2,
      offsetX: -10,
      offsetY: -300,
      rotate: -8,
    },
    {
      src: gojoSatoru3,
      offsetX: 480,
      offsetY: -90,
      rotate: 4,
    },
    {
      src: gojoSatoru4,
      offsetX: 0,
      offsetY: 0,
      rotate: -6,
    },
    {
      src: gojoSatoru5,
      offsetX: 0,
      offsetY: 0,
      rotate: 7,
    },
  ],
  ryomenSukuna: [
    {
      src: ryomenSukuna1,
      offsetX: -450,
      offsetY: -180,
      rotate: -12,
    },
    {
      src: ryomenSukuna2,
      offsetX: 30,
      offsetY: -280,
      rotate: 7,
    },
    {
      src: ryomenSukuna3,
      offsetX: 500,
      offsetY: -20,
      rotate: 15,
    },
    {
      src: ryomenSukuna4,
      offsetX: 0,
      offsetY: 0,
      rotate: -9,
    },
    {
      src: ryomenSukuna5,
      offsetX: 0,
      offsetY: 0,
      rotate: 12,
    },
  ],
  tojiFushiguro: [
    {
      src: tojiFushiguro1,
      offsetX: -500,
      offsetY: -100,
      rotate: -7,
    },
    {
      src: tojiFushiguro2,
      offsetX: -20,
      offsetY: -250,
      rotate: 4,
    },
    {
      src: tojiFushiguro3,
      offsetX: 420,
      offsetY: -60,
      rotate: -5,
    },
    {
      src: tojiFushiguro4,
      offsetX: 0,
      offsetY: 0,
      rotate: 8,
    },
    {
      src: tojiFushiguro5,
      offsetX: 0,
      offsetY: 0,
      rotate: -6,
    },
  ],
  "makiZen'in": [
    {
      src: makiZenin1,
      offsetX: -470,
      offsetY: -140,
      rotate: -4,
    },
    {
      src: makiZenin2,
      offsetX: -30,
      offsetY: -230,
      rotate: -6,
    },
    {
      src: makiZenin3,
      offsetX: 460,
      offsetY: -80,
      rotate: 8,
    },
    {
      src: makiZenin4,
      offsetX: 0,
      offsetY: 0,
      rotate: -7,
    },
    {
      src: makiZenin5,
      offsetX: 0,
      offsetY: 0,
      rotate: 9,
    },
  ],
};

// 🎮 Physics configurations for each character
// All characters float with different behaviors - NO FALLING!
export const characterPhysics: CharacterPhysics = {
  itadoriYuji: {
    gravity: 0,              // Zero gravity - movimento puro
    bounce: 0.85,
    airFriction: 0.98,
    initialVelocity: { min: 3, max: 6 },
    magnetism: "neutral",
    trailColor: "#ff6b35",
    squashStretch: 0.25,
  },
  gojoSatoru: {
    gravity: -0.15,          // Levita gentilmente verso l'alto
    bounce: 0.6,
    airFriction: 0.95,
    initialVelocity: { min: 1, max: 2.5 },
    magnetism: "repulsion",
    repulsionRadius: 300,
    repulsionForce: 0.8,
    trailColor: "#00d4ff",
    squashStretch: 0.1,
  },
  ryomenSukuna: {
    gravity: 0,              // Zero gravity - caos puro
    bounce: 0.9,
    airFriction: 0.99,
    initialVelocity: { min: 4, max: 8 },
    magnetism: "chaotic",
    chaosInterval: 2000,
    trailColor: "#ff0055",
    squashStretch: 0.15,
    randomImpulses: true,
  },
  tojiFushiguro: {
    gravity: 0,              // Zero gravity ma con dash improvvisi
    bounce: 0.8,
    airFriction: 0.93,
    initialVelocity: { min: 5, max: 9 },
    magnetism: "none",
    trailColor: "#00ff88",
    squashStretch: 0.2,
    dashMechanic: true,
    dashCooldown: 3000,
  },
  "makiZen'in": {
    gravity: -0.05,          // Levita leggermente
    bounce: 0.75,
    airFriction: 0.96,
    initialVelocity: { min: 3, max: 5 },
    magnetism: "soft-attraction",
    attractionRadius: 250,
    attractionForce: 0.3,
    trailColor: "#9d4edd",
    squashStretch: 0.3,
  },
};
