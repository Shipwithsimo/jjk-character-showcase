/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";

interface DynamicBackgroundProps {
  characterId: string | null;
}

// Mappa dei background per personaggio (usa le immagini esistenti)
const BACKGROUND_MAP: Record<string, string> = {
  itadoriYuji: "/itadori-yuji-1.gif",
  gojoSatoru: "/gojo-satoru-1.gif",
  ryomenSukuna: "/ryomen-sukuna-1.gif",
  tojiFushiguro: "/toji-fushiguro-1.gif",
  "makiZen'in": "/maki-zen'in-1.gif",
};

// Character data for silhouettes
const CHARACTERS = [
  { id: "itadoriYuji", name: "Itadori Yuji", color: "#ef4444", image: "/itadori-yuji-1.gif" },
  { id: "gojoSatoru", name: "Gojo Satoru", color: "#06b6d4", image: "/gojo-satoru-1.gif" },
  { id: "ryomenSukuna", name: "Ryomen Sukuna", color: "#dc2626", image: "/ryomen-sukuna-1.gif" },
  { id: "tojiFushiguro", name: "Toji Fushiguro", color: "#10b981", image: "/toji-fushiguro-1.gif" },
  { id: "makiZen'in", name: "Maki Zen'in", color: "#8b5cf6", image: "/maki-zen'in-1.gif" },
];

// Fallback gradient quando nessuno è selezionato
const DEFAULT_GRADIENT = "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)";

export const DynamicBackground = memo(({ characterId }: DynamicBackgroundProps) => {
  const backgroundImage = characterId ? BACKGROUND_MAP[characterId] : null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="sync">
        {backgroundImage ? (
          <motion.div
            key={characterId}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Immagine di sfondo */}
            <img
              src={backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "blur(4px) brightness(0.3)", // Reduced from 8px for performance
                transform: "scale(1.1)", // Evita bordi bianchi durante il blur
              }}
            />
            
            {/* Overlay gradiente per leggibilità */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, transparent 0%, rgba(15, 15, 15, 0.7) 70%, rgba(15, 15, 15, 0.95) 100%),
                  linear-gradient(180deg, rgba(15, 15, 15, 0.5) 0%, rgba(15, 15, 15, 0.8) 100%)
                `,
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            className="absolute inset-0"
            style={{ background: DEFAULT_GRADIENT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Character Silhouettes Grid - Layout più visibile */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="grid grid-cols-5 gap-8 max-w-7xl w-full" style={{ opacity: 0.6 }}>
                {CHARACTERS.map((character, index) => (
                  <motion.div
                    key={character.id}
                    className="relative aspect-[3/4] flex items-center justify-center overflow-hidden rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                      boxShadow: `0 0 60px ${character.color}70, inset 0 0 60px ${character.color}30`,
                      border: `3px solid ${character.color}90`,
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Character Image as Silhouette - PIÙ LUMINOSO */}
                    <img
                      src={character.image}
                      alt={character.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: "grayscale(100%) brightness(0.6) contrast(250%)",
                        mixBlendMode: "lighten",
                        opacity: 0.8,
                      }}
                    />

                    {/* Colored Glow Overlay - PIÙ INTENSO */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `
                          radial-gradient(circle at center, ${character.color}60 0%, ${character.color}30 50%, transparent 80%),
                          linear-gradient(180deg, ${character.color}20 0%, transparent 100%)
                        `,
                        animation: `pulse ${2 + index * 0.3}s ease-in-out infinite alternate`,
                        opacity: 0.9,
                      }}
                    />

                    {/* Character Name - PIÙ GRANDE */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                      <motion.div
                        className="text-white font-black text-sm uppercase tracking-widest"
                        style={{
                          textShadow: `
                            0 0 20px ${character.color},
                            0 0 40px ${character.color}CC,
                            0 2px 4px rgba(0,0,0,0.8)
                          `,
                        }}
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2 + index * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {character.name.split(" ")[0]}
                      </motion.div>
                    </div>

                    {/* Edge Glow Stronger */}
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: `inset 0 0 50px ${character.color}50, inset 0 0 100px ${character.color}20`,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${character.color}30 0%, transparent 50%)`,
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3 + index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Animated Grid Lines */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path
                      d="M 80 0 L 0 0 0 80"
                      fill="none"
                      stroke="rgba(139, 92, 246, 0.3)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay fisso per energia */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
});

DynamicBackground.displayName = "DynamicBackground";
