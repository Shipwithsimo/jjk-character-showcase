import { useState, useCallback, useRef } from "react";

type UseCarouselOptions = {
  totalItems: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

export const useCarousel = ({
  totalItems,
  initialIndex = 0,
  onIndexChange,
}: UseCarouselOptions) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateIndex = useCallback(
    (newIndex: number) => {
      // Debounce per evitare spam
      if (debounceTimer.current) return;

      setCurrentIndex(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex);
      }

      debounceTimer.current = setTimeout(() => {
        debounceTimer.current = null;
      }, 200);
    },
    [onIndexChange]
  );

  const next = useCallback(() => {
    const newIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    updateIndex(newIndex);
  }, [currentIndex, totalItems, updateIndex]);

  const prev = useCallback(() => {
    const newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    updateIndex(newIndex);
  }, [currentIndex, totalItems, updateIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems) {
        updateIndex(index);
      }
    },
    [totalItems, updateIndex]
  );

  // Preload immagine adiacente (solo indice, implementazione nel componente)
  const getAdjacentIndices = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    const nextIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    return { prevIndex, nextIndex };
  }, [currentIndex, totalItems]);

  return {
    currentIndex,
    next,
    prev,
    goTo,
    getAdjacentIndices,
  };
};
