/**
 * Physics-based Character Showcase
 * Replaces static positioning with realistic physics simulation
 */

import { memo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { CharacterScene, characterPhysics } from "../lib/data";
import { usePhysicsEngine, PhysicsState, PhysicsConfig } from "../hooks/usePhysicsEngine";
import { MotionTrail } from "./MotionTrail";

type AuraType = "fire" | "frost" | "neutral" | "cursed" | "steel";

const CHARACTER_AURA: Record<string, AuraType> = {
  itadoriYuji: "fire",
  gojoSatoru: "frost",
  ryomenSukuna: "cursed",
  tojiFushiguro: "steel",
  "makiZen'in": "neutral",
};

const AURA_COLORS: Record<AuraType, { primary: string; secondary: string; glow: string }> = {
  fire: {
    primary: "#ef4444",
    secondary: "#f97316",
    glow: "rgba(239, 68, 68, 0.6)",
  },
  frost: {
    primary: "#06b6d4",
    secondary: "#3b82f6",
    glow: "rgba(6, 182, 212, 0.6)",
  },
  cursed: {
    primary: "#dc2626",
    secondary: "#7f1d1d",
    glow: "rgba(220, 38, 38, 0.7)",
  },
  steel: {
    primary: "#10b981",
    secondary: "#065f46",
    glow: "rgba(16, 185, 129, 0.5)",
  },
  neutral: {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    glow: "rgba(139, 92, 246, 0.5)",
  },
};

type PhysicsShowcaseProps = {
  selectedName: string;
  scenes: CharacterScene[];
  onCardClick?: (characterId: string, sceneIndex: number) => void;
};

const PhysicsShowcaseComponent = ({
  selectedName,
  scenes,
  onCardClick,
}: PhysicsShowcaseProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const cardWidth = 240; // w-60 in Tailwind
  const cardHeight = 160; // aspect-[3/2]

  const physicsConfig = characterPhysics[selectedName];
  const auraType = CHARACTER_AURA[selectedName] || "neutral";
  const auraColors = AURA_COLORS[auraType];

  // Shared positions ref for magnetism
  const positionsRef = useRef<Array<{ x: number; y: number }>>([]);

  // Track hover states
  const [hoverStates, setHoverStates] = useState<boolean[]>(
    new Array(scenes.length).fill(false)
  );

  // Track dragging states
  const [draggingStates, setDraggingStates] = useState<boolean[]>(
    new Array(scenes.length).fill(false)
  );

  // Track drag velocities for throw effect
  const dragVelocitiesRef = useRef<Array<{ vx: number; vy: number }>>([]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize positions array
  useEffect(() => {
    positionsRef.current = new Array(scenes.length).fill(null).map(() => ({ x: 0, y: 0 }));
    dragVelocitiesRef.current = new Array(scenes.length).fill(null).map(() => ({ vx: 0, vy: 0 }));
  }, [scenes.length]);

  const handleHover = useCallback((index: number, hovered: boolean) => {
    setHoverStates((prev) => {
      const next = [...prev];
      next[index] = hovered;
      return next;
    });
  }, []);

  const handleClick = useCallback(
    (index: number) => {
      onCardClick?.(selectedName, index);
    },
    [selectedName, onCardClick]
  );

  const handlePositionUpdate = useCallback((index: number, x: number, y: number) => {
    positionsRef.current[index] = { x, y };
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDraggingStates((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handleDragEnd = useCallback((index: number, vx: number, vy: number) => {
    setDraggingStates((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    dragVelocitiesRef.current[index] = { vx, vy };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <AnimatePresence>
        {scenes.map((scene, index) => (
          <PhysicsCard
          key={`${selectedName}-${index}`}
          index={index}
          scene={scene}
          isHovered={hoverStates[index]}
          isDragging={draggingStates[index]}
          selectedName={selectedName}
          physicsConfig={physicsConfig}
          auraType={auraType}
          auraColors={auraColors}
          windowSize={windowSize}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          positionsRef={positionsRef}
          dragVelocityRef={dragVelocitiesRef}
          onPositionUpdate={handlePositionUpdate}
          onHover={(hovered) => handleHover(index, hovered)}
          onClick={() => handleClick(index)}
          onDragStart={() => handleDragStart(index)}
          onDragEnd={(vx, vy) => handleDragEnd(index, vx, vy)}
        />
      ))}
    </AnimatePresence>
    </div>
  );
};

type PhysicsCardProps = {
  index: number;
  scene: CharacterScene;
  isHovered: boolean;
  isDragging: boolean;
  selectedName: string;
  physicsConfig: PhysicsConfig;
  auraType: AuraType;
  auraColors: any;
  windowSize: { width: number; height: number };
  cardWidth: number;
  cardHeight: number;
  positionsRef: React.MutableRefObject<Array<{ x: number; y: number }>>;
  dragVelocityRef: React.MutableRefObject<Array<{ vx: number; vy: number }>>;
  onPositionUpdate: (index: number, x: number, y: number) => void;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: (vx: number, vy: number) => void;
};

const PhysicsCard = memo(
  ({
    index,
    scene,
    isHovered,
    isDragging,
    selectedName,
    physicsConfig,
    auraType,
    auraColors,
    windowSize,
    cardWidth,
    cardHeight,
    positionsRef,
    dragVelocityRef,
    onPositionUpdate,
    onHover,
    onClick,
    onDragStart,
    onDragEnd,
  }: PhysicsCardProps) => {
    // Use physics engine (paused when dragging)
    // otherPositions filtering now done inside hook for stability
    const physics = usePhysicsEngine({
      config: physicsConfig,
      index,
      allPositionsRef: positionsRef,
      windowWidth: windowSize.width,
      windowHeight: windowSize.height,
      cardWidth,
      cardHeight,
      isPaused: isDragging,
      dragVelocity: dragVelocityRef.current[index] || null,
    });

    // Track current position (either from drag or physics)
    // Initialize with random position to spread them out
    const [position, setPosition] = useState(() => {
      const padding = 100;
      const safeWidth = windowSize.width - cardWidth - padding * 2;
      const safeHeight = windowSize.height - cardHeight - padding * 2;
      return {
        x: padding + Math.random() * safeWidth,
        y: padding + Math.random() * safeHeight,
      };
    });

    // Refs for smooth dragging without re-renders
    const cardRef = useRef<HTMLDivElement>(null);
    const dragPosRef = useRef({ x: 0, y: 0 });
    const updateRafRef = useRef<number>();

    // Update position from physics when not dragging
    useEffect(() => {
      if (!isDragging) {
        setPosition({ x: physics.x, y: physics.y });
      }
    }, [physics.x, physics.y, isDragging]);

    // Update shared position ref
    useEffect(() => {
      const currentX = isDragging ? dragPosRef.current.x : position.x;
      const currentY = isDragging ? dragPosRef.current.y : position.y;
      onPositionUpdate(index, currentX, currentY);
    }, [position.x, position.y, isDragging, index, onPositionUpdate]);

    const handleDragStart = () => {
      dragPosRef.current = { x: position.x, y: position.y };
      onDragStart();
    };

    const handleDrag = (_e: any, info: any) => {
      // Direct DOM update for smooth drag (no React re-render!)
      const newX = info.point.x - cardWidth / 2;
      const newY = info.point.y - cardHeight / 2;

      dragPosRef.current = { x: newX, y: newY };

      // Throttle position updates with rAF
      if (!updateRafRef.current) {
        updateRafRef.current = requestAnimationFrame(() => {
          if (cardRef.current) {
            cardRef.current.style.left = `${newX}px`;
            cardRef.current.style.top = `${newY}px`;
          }
          updateRafRef.current = undefined;
        });
      }
    };

    const handleDragEnd = (_event: any, info: any) => {
      // Update React state with final position
      setPosition({
        x: dragPosRef.current.x,
        y: dragPosRef.current.y,
      });

      const vx = info.velocity.x * 0.02;
      const vy = info.velocity.y * 0.02;
      onDragEnd(vx, vy);
    };

    return (
      <>
        {/* Motion Trail - DISABLED FOR PERFORMANCE */}
        {/* <MotionTrail trail={physics.trail} color={physicsConfig.trailColor} /> */}

        {/* Card - DRAGGABLE */}
        <motion.div
          ref={cardRef}
          className="absolute flex aspect-[3/2] w-60 items-center justify-center overflow-hidden rounded-xl character-card select-none"
          drag
          dragMomentum={false}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            left: position.x,
            top: position.y,
            rotate: physics.rotation,
            scaleX: isDragging ? 1.15 : physics.scaleX,
            scaleY: isDragging ? 1.15 : physics.scaleY,
            zIndex: isDragging ? 1000 : 10 + index,
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
            pointerEvents: "auto",
            touchAction: "none",
            border: `3px solid ${isDragging ? auraColors.primary : isHovered ? auraColors.primary : auraColors.secondary + "60"}`,
            boxShadow: isDragging
              ? `0 0 80px ${auraColors.glow}, 0 0 120px ${auraColors.glow}, inset 0 0 50px ${auraColors.glow}`
              : isHovered
              ? `0 0 30px ${auraColors.glow}, 0 0 60px ${auraColors.glow}, inset 0 0 20px ${auraColors.glow}`
              : `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${auraColors.glow}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isDragging ? 1.15 : 1,
            opacity: 1,
            left: position.x,
            top: position.y,
          }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
            mass: 0.6,
            delay: index * 0.1,
          }}
          whileHover={!isDragging ? {
            scale: 1.1,
            transition: { duration: 0.2, type: "spring", stiffness: 300 },
          } : undefined}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <img
            src={scene.src}
            alt={selectedName}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%),
                linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)
              `,
            }}
          />

          {/* Fire Aura */}
          {auraType === "fire" && (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style={{
                  background: `linear-gradient(0deg, ${auraColors.primary}60 0%, transparent 100%)`,
                  animation: "fireFlicker 0.5s ease-in-out infinite alternate",
                }}
              />
              <div className="absolute inset-0 pointer-events-none fire-particles" />
            </>
          )}

          {/* Frost Overlay */}
          {auraType === "frost" && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(135deg, rgba(6,182,212,0.3) 0%, transparent 30%),
                    linear-gradient(315deg, rgba(59,130,246,0.2) 0%, transparent 30%)
                  `,
                  boxShadow: "inset 0 0 30px rgba(6,182,212,0.2)",
                }}
              />
              <div
                className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                style={{
                  background: "linear-gradient(315deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                }}
              />
            </>
          )}

          {/* Cursed Aura */}
          {auraType === "cursed" && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(220,38,38,0.2) 0%, transparent 40%),
                  radial-gradient(circle at 70% 70%, rgba(127,29,29,0.3) 0%, transparent 40%)
                `,
                animation: "cursedPulse 2s ease-in-out infinite",
              }}
            />
          )}

          {/* Steel Aura */}
          {auraType === "steel" && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(45deg, rgba(16,185,129,0.1) 0%, transparent 50%, rgba(6,95,70,0.1) 100%)",
              }}
            />
          )}

          {/* Base gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-red-600/10 pointer-events-none mix-blend-overlay" />
        </motion.div>
      </>
    );
  }
);

PhysicsCard.displayName = "PhysicsCard";

export const PhysicsShowcase = memo(PhysicsShowcaseComponent);
