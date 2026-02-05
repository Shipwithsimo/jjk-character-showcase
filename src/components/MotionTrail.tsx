/**
 * Motion Trail Component
 * Renders trailing effect behind moving gifs
 */

import { motion } from "framer-motion";

type MotionTrailProps = {
  trail: Array<{ x: number; y: number; opacity: number }>;
  color: string;
};

export const MotionTrail = ({ trail, color }: MotionTrailProps) => {
  if (trail.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 5,
      }}
    >
      <defs>
        <linearGradient id={`trail-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        <filter id="trail-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {trail.length > 1 && (
        <motion.path
          d={
            trail.reduce((path, point, i) => {
              if (i === 0) return `M ${point.x} ${point.y}`;
              return `${path} L ${point.x} ${point.y}`;
            }, "")
          }
          stroke={`url(#trail-gradient-${color})`}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trail-blur)"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Glow points at trail positions */}
      {trail.slice(0, 5).map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={6 - i}
          fill={color}
          opacity={point.opacity * 0.4}
          filter="url(#trail-blur)"
        />
      ))}
    </svg>
  );
};
