import { useEffect, useState, RefObject } from "react";
import { MousePosition, Rotation3D } from "../lib/types";

export const use3DMouseTracking = (
  ref: RefObject<HTMLElement>,
  mousePosition: MousePosition,
  intensity: number = 15
): Rotation3D => {
  const [rotation, setRotation] = useState<Rotation3D>({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Converti mousePosition (normalizzato) in coordinate schermo
    const mouseScreenX = mousePosition.x * 4 + window.innerWidth / 2;
    const mouseScreenY = mousePosition.y * 4 + window.innerHeight / 2;

    // Calcola delta come percentuale (-1 a 1)
    const deltaX = (mouseScreenX - centerX) / (rect.width / 2);
    const deltaY = (mouseScreenY - centerY) / (rect.height / 2);

    // Clamp tra -1 e 1
    const clampedDeltaX = Math.max(-1, Math.min(1, deltaX));
    const clampedDeltaY = Math.max(-1, Math.min(1, deltaY));

    // Applica intensity e inverti Y per effetto naturale
    setRotation({
      rotateX: -clampedDeltaY * intensity,
      rotateY: clampedDeltaX * intensity,
    });
  }, [mousePosition, ref, intensity]);

  return rotation;
};
