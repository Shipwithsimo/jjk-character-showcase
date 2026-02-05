/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 * 
 * An interactive character showcase experience
 */

import { useState, lazy, Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { PhysicsShowcase } from "./components/PhysicsShowcase";
import { CharacterName } from "./components/CharacterName";
import { EnergyAura } from "./components/EnergyAura";
import { TrailEffect } from "./components/TrailEffect";
import { DynamicBackground } from "./components/DynamicBackground";
import { ThemedCursor } from "./components/ThemedCursor";
import { useMobileWarning } from "./hooks/useMobileWarning";
import { useSmoothMouse } from "./hooks/useSmoothMouse";
import { useVoiceLines } from "./hooks/useVoiceLines";
import { useDomainShake } from "./hooks/useDomainShake";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { usePerformanceGating } from "./hooks/usePerformanceGating";
import { CHARACTER_LIST } from "./lib/constant";
import { sceneData } from "./lib/data";
import { ModalState } from "./lib/types";
import "./App.css";
import { Toaster } from "sonner";

const SceneModal = lazy(() =>
  import("./components/SceneModal").then((module) => ({
    default: module.SceneModal,
  }))
);

const Page = () => {
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const [lockedPreview, setLockedPreview] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    characterId: null,
    initialSceneIndex: 0,
  });

  const { x: mouseX, y: mouseY } = useSmoothMouse(20, 120); // damping 20, stiffness 120 per fluidità
  const { enableTrailParticles } = usePerformanceGating();
  const { playVoice, stopVoice, currentCharacter } = useVoiceLines();
  const { controls: shakeControls, triggerShake } = useDomainShake();
  useMobileWarning();

  // Keyboard navigation
  useKeyboardNavigation({
    items: CHARACTER_LIST,
    onSelect: (characterId) => {
      setHoveredText(characterId);
      setLockedPreview(characterId);
    },
    onEscape: () => {
      setLockedPreview(null);
      setModalState({ isOpen: false, characterId: null, initialSceneIndex: 0 });
    },
    enabled: !modalState.isOpen,
  });

  // Lock/Unlock preview + riproduzione audio + shake effect
  const handleLockToggle = useCallback((titleId: string) => {
    if (lockedPreview === titleId) {
      // Se deseleziono, ferma l'audio
      setLockedPreview(null);
      stopVoice();
    } else {
      // Se seleziono un nuovo personaggio
      setLockedPreview(titleId);
      setHoveredText(titleId);
      // Riproduci la frase (solo se è diverso dal precedente)
      if (currentCharacter !== titleId) {
        playVoice(titleId);
      }
      // Trigger shake per personaggi potenti (Gojo, Sukuna)
      triggerShake(titleId);
    }
  }, [lockedPreview, currentCharacter, playVoice, stopVoice, triggerShake]);

  // Apertura modal
  const handleCardClick = (characterId: string, sceneIndex: number) => {
    setModalState({
      isOpen: true,
      characterId,
      initialSceneIndex: sceneIndex,
    });
  };

  // Chiusura modal
  const handleModalClose = () => {
    setModalState({ isOpen: false, characterId: null, initialSceneIndex: 0 });
  };

  // Gestione hover: se locked, ignora onHoverEnd
  const handleHover = (text: string) => {
    setHoveredText(text);
  };

  const handleHoverEnd = () => {
    if (!lockedPreview) {
      setHoveredText(null);
    }
  };

  // Determina quale testo mostrare (locked ha priorità)
  const displayedText = lockedPreview || hoveredText;

  return (
    <motion.div 
      className="relative flex w-screen flex-col items-center justify-center min-h-screen perspective-1000"
      animate={shakeControls}
    >
      <ThemedCursor characterId={lockedPreview} />
      <DynamicBackground characterId={lockedPreview} />
      <EnergyAura />
      {enableTrailParticles && <TrailEffect />}
      <Toaster />

      <div className="flex flex-col items-center justify-center gap-6 text-nowrap text-5xl font-black uppercase *:cursor-default md:text-7xl relative z-10">
        {CHARACTER_LIST.map((character) => (
          <CharacterName
            key={character.id}
            character={character}
            onHover={handleHover}
            onHoverEnd={handleHoverEnd}
            onLockToggle={handleLockToggle}
            isLocked={lockedPreview === character.id}
          />
        ))}
      </div>

      {displayedText && sceneData[displayedText] && (
        <PhysicsShowcase
          key={displayedText}
          selectedName={displayedText}
          scenes={sceneData[displayedText]}
          onCardClick={handleCardClick}
        />
      )}

      {/* Modal Lazy Loaded */}
      <Suspense fallback={null}>
        {modalState.isOpen && modalState.characterId && (
          <SceneModal
            isOpen={modalState.isOpen}
            characterId={modalState.characterId}
            initialIndex={modalState.initialSceneIndex}
            onClose={handleModalClose}
          />
        )}
      </Suspense>
    </motion.div>
  );
};

export default Page;
