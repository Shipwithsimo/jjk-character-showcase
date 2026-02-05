/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 * 
 * Scene detail modal with carousel
 */

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { useCarousel } from "../hooks/useCarousel";
import { sceneData } from "../lib/data";
import { CHARACTER_LIST } from "../lib/constant";

type SceneModalProps = {
  isOpen: boolean;
  characterId: string;
  initialIndex: number;
  onClose: () => void;
};

export const SceneModal = ({
  isOpen,
  characterId,
  initialIndex,
  onClose,
}: SceneModalProps) => {
  const scenes = sceneData[characterId] || [];
  const character = CHARACTER_LIST.find((c) => c.id === characterId);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { currentIndex, next, prev, goTo } = useCarousel({
    totalItems: scenes.length,
    initialIndex,
  });

  const currentScene = scenes[currentIndex];

  // Focus trap e gestione focus
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, prev, next, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Swipe gesture handler
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;

      if (info.offset.x > threshold) {
        prev();
      } else if (info.offset.x < -threshold) {
        next();
      }
    },
    [prev, next]
  );

  if (!currentScene || !character) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Content Container */}
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors z-10"
              aria-label="Chiudi modal"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container with Drag */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative aspect-[3/2] overflow-hidden rounded-xl border-2 border-purple-500 shadow-2xl"
              style={{
                boxShadow:
                  "0 0 60px rgba(139, 92, 246, 0.8), 0 0 120px rgba(239, 68, 68, 0.5)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={currentIndex}
                  src={currentScene.src}
                  alt={`${character.displayName} - Scena ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-500/50 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                aria-label="Scena precedente"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-500/50 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                aria-label="Scena successiva"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>

            {/* Info Panel */}
            <div className="mt-6 text-center">
              <h2
                id="modal-title"
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {character.displayName}
              </h2>
              <p className="text-white/70 text-sm">
                Scena {currentIndex + 1} / {scenes.length}
              </p>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {scenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-purple-500 w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Vai alla scena ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
