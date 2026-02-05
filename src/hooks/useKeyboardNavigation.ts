import { useEffect, useState, useCallback } from "react";
import { Character } from "../lib/types";

type UseKeyboardNavigationProps = {
  items: Character[];
  onSelect?: (characterId: string, index: number) => void;
  onEscape?: () => void;
  enabled?: boolean;
};

export const useKeyboardNavigation = ({
  items,
  onSelect,
  onEscape,
  enabled = true,
}: UseKeyboardNavigationProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => {
            const newIndex = prev === 0 ? items.length - 1 : prev - 1;
            if (onSelect) {
              onSelect(items[newIndex].id, newIndex);
            }
            return newIndex;
          });
          break;

        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => {
            const newIndex = prev === items.length - 1 ? 0 : prev + 1;
            if (onSelect) {
              onSelect(items[newIndex].id, newIndex);
            }
            return newIndex;
          });
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (onSelect) {
            onSelect(items[activeIndex].id, activeIndex);
          }
          break;

        case "Escape":
          e.preventDefault();
          if (onEscape) {
            onEscape();
          }
          break;
      }
    },
    [enabled, items, activeIndex, onSelect, onEscape]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    activeIndex,
    setActiveIndex,
  };
};
