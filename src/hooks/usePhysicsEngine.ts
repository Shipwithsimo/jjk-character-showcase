/**
 * Physics Engine Hook for Character GIFs
 * Simulates realistic physics with character-specific behaviors
 */

import { useEffect, useRef, useState } from "react";

export type PhysicsConfig = {
  gravity: number;
  bounce: number;
  airFriction: number;
  initialVelocity: { min: number; max: number };
  magnetism: "neutral" | "repulsion" | "chaotic" | "none" | "soft-attraction";
  repulsionRadius?: number;
  repulsionForce?: number;
  attractionRadius?: number;
  attractionForce?: number;
  trailColor: string;
  squashStretch: number;
  randomImpulses?: boolean;
  chaosInterval?: number;
  dashMechanic?: boolean;
  dashCooldown?: number;
};

export type PhysicsState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
};

type UsePhysicsEngineProps = {
  config: PhysicsConfig;
  index: number;
  allPositionsRef: React.MutableRefObject<Array<{ x: number; y: number }>>;
  windowWidth: number;
  windowHeight: number;
  cardWidth: number;
  cardHeight: number;
  isPaused: boolean;
  dragVelocity?: { vx: number; vy: number } | null;
};

export const usePhysicsEngine = ({
  config,
  index,
  allPositionsRef,
  windowWidth,
  windowHeight,
  cardWidth,
  cardHeight,
  isPaused,
  dragVelocity,
}: UsePhysicsEngineProps) => {
  const wasPaused = useRef(false);
  const magnetismFrame = useRef(0); // Throttle magnetism calculations
  const [state, setState] = useState<PhysicsState>(() => {
    // Initial random position within safe bounds
    const padding = 100;
    const safeWidth = windowWidth - cardWidth - padding * 2;
    const safeHeight = windowHeight - cardHeight - padding * 2;

    const x = padding + Math.random() * safeWidth;
    const y = padding + Math.random() * safeHeight;

    // Random initial velocity
    const speed = config.initialVelocity.min +
                  Math.random() * (config.initialVelocity.max - config.initialVelocity.min);
    const angle = Math.random() * Math.PI * 2;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      trail: [],
    };
  });

  const lastDashTime = useRef(0);
  const chaosPhase = useRef<"attract" | "repel">("attract");
  const lastChaosChange = useRef(Date.now());

  useEffect(() => {
    if (isPaused) {
      wasPaused.current = true;
      return;
    }

    // Apply drag velocity when resuming from pause
    if (wasPaused.current && dragVelocity) {
      setState((prevState) => ({
        ...prevState,
        vx: dragVelocity.vx,
        vy: dragVelocity.vy,
      }));
      wasPaused.current = false;
    }

    let rafId: number;
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastTime) / 16, 2); // Cap at 2x speed
      lastTime = now;

      setState((prevState) => {
        let { x, y, vx, vy, rotation, trail } = prevState;
        let scaleX = 1;
        let scaleY = 1;

        // Apply gravity
        vy += config.gravity * deltaTime;

        // Apply air friction
        vx *= config.airFriction;
        vy *= config.airFriction;

        // Magnetism effects - THROTTLED (every 3 frames for performance)
        magnetismFrame.current++;
        if (magnetismFrame.current % 3 === 0) {
          // Get other positions (exclude self)
          const otherPositions = allPositionsRef.current.filter((_, i) => i !== index);

          if (config.magnetism === "repulsion" && config.repulsionRadius && config.repulsionForce) {
            const radiusSquared = config.repulsionRadius * config.repulsionRadius;
            otherPositions.forEach((other) => {
              const dx = x - other.x;
              const dy = y - other.y;
              const distSquared = dx * dx + dy * dy;

              // Early exit - skip expensive sqrt if too far
              if (distSquared > radiusSquared || distSquared === 0) return;

              const distance = Math.sqrt(distSquared);
              const force = config.repulsionForce! * (1 - distance / config.repulsionRadius!);
              vx += (dx / distance) * force;
              vy += (dy / distance) * force;
            });
          }

          if (config.magnetism === "soft-attraction" && config.attractionRadius && config.attractionForce) {
            const radiusSquared = config.attractionRadius * config.attractionRadius;
            otherPositions.forEach((other) => {
              const dx = other.x - x;
              const dy = other.y - y;
              const distSquared = dx * dx + dy * dy;

              // Early exit
              if (distSquared > radiusSquared || distSquared === 0) return;

              const distance = Math.sqrt(distSquared);
              const force = config.attractionForce! * (distance / config.attractionRadius!);
              vx += (dx / distance) * force * 0.5;
              vy += (dy / distance) * force * 0.5;
            });
          }

          if (config.magnetism === "chaotic" && config.chaosInterval) {
            if (now - lastChaosChange.current > config.chaosInterval) {
              chaosPhase.current = chaosPhase.current === "attract" ? "repel" : "attract";
              lastChaosChange.current = now;
            }

            const maxDistSquared = 400 * 400;
            otherPositions.forEach((other) => {
              const dx = chaosPhase.current === "attract" ? other.x - x : x - other.x;
              const dy = chaosPhase.current === "attract" ? other.y - y : y - other.y;
              const distSquared = dx * dx + dy * dy;

              // Early exit
              if (distSquared === 0 || distSquared > maxDistSquared) return;

              const distance = Math.sqrt(distSquared);
              const force = 0.5 * (1 - distance / 400);
              vx += (dx / distance) * force;
              vy += (dy / distance) * force;
            });
          }
        }

        // Random impulses for chaos
        if (config.randomImpulses && Math.random() < 0.005) {
          vx += (Math.random() - 0.5) * 3;
          vy += (Math.random() - 0.5) * 3;
        }

        // Dash mechanic for Toji
        if (config.dashMechanic && config.dashCooldown) {
          if (now - lastDashTime.current > config.dashCooldown && Math.random() < 0.02) {
            const dashAngle = Math.random() * Math.PI * 2;
            vx = Math.cos(dashAngle) * 12;
            vy = Math.sin(dashAngle) * 12;
            lastDashTime.current = now;
          }
        }

        // Update position
        x += vx * deltaTime;
        y += vy * deltaTime;

        // Collision detection and bounce with squash/stretch
        let collided = false;

        // Left wall
        if (x < 0) {
          x = 0;
          vx = Math.abs(vx) * config.bounce;
          collided = true;
        }
        // Right wall
        if (x + cardWidth > windowWidth) {
          x = windowWidth - cardWidth;
          vx = -Math.abs(vx) * config.bounce;
          collided = true;
        }
        // Top wall
        if (y < 0) {
          y = 0;
          vy = Math.abs(vy) * config.bounce;
          collided = true;
        }
        // Bottom wall
        if (y + cardHeight > windowHeight) {
          y = windowHeight - cardHeight;
          vy = -Math.abs(vy) * config.bounce;
          collided = true;
        }

        // Squash and stretch on collision
        if (collided) {
          const speed = Math.sqrt(vx * vx + vy * vy);
          const squashAmount = Math.min(speed / 10, 1) * config.squashStretch;

          // Squash in direction of impact
          if (Math.abs(vx) > Math.abs(vy)) {
            scaleX = 1 - squashAmount;
            scaleY = 1 + squashAmount * 0.5;
          } else {
            scaleY = 1 - squashAmount;
            scaleX = 1 + squashAmount * 0.5;
          }
        }

        // Update rotation based on velocity
        rotation += (vx * 0.5) * deltaTime;

        // Update trail - REDUCED from 15 to 5 for performance
        const newTrail = [
          { x: x + cardWidth / 2, y: y + cardHeight / 2, opacity: 1 },
          ...trail.slice(0, 5).map((point) => ({
            ...point,
            opacity: point.opacity * 0.85,
          })),
        ].filter((point) => point.opacity > 0.1);

        return {
          x,
          y,
          vx,
          vy,
          rotation,
          scaleX,
          scaleY,
          trail: newTrail,
        };
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [
    config,
    index,
    allPositionsRef,
    windowWidth,
    windowHeight,
    cardWidth,
    cardHeight,
    isPaused,
    dragVelocity,
  ]);

  return state;
};
