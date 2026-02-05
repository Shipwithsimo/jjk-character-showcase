import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type Wave = {
  id: number;
  x: number;
  y: number;
  timestamp: number;
};

type EnergyWavesProps = {
  triggerPosition: { x: number; y: number } | null;
};

export const EnergyWaves = ({ triggerPosition }: EnergyWavesProps) => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [waveIdCounter, setWaveIdCounter] = useState(0);

  useEffect(() => {
    if (!triggerPosition) return;

    // Spawn 3-4 onde concentriche
    const waveCount = 3 + Math.floor(Math.random() * 2); // 3 o 4
    const newWaves: Wave[] = [];

    for (let i = 0; i < waveCount; i++) {
      newWaves.push({
        id: waveIdCounter + i,
        x: triggerPosition.x,
        y: triggerPosition.y,
        timestamp: Date.now() + i * 200, // stagger 200ms
      });
    }

    setWaveIdCounter((prev) => prev + waveCount);
    setWaves((prev) => [...prev, ...newWaves]);
  }, [triggerPosition]);

  // Cleanup onde vecchie
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setWaves((prev) => prev.filter((w) => now - w.timestamp < 1500));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {waves.map((wave, index) => (
          <motion.div
            key={wave.id}
            className="absolute rounded-full border-2"
            style={{
              left: wave.x,
              top: wave.y,
              transform: "translate(-50%, -50%)",
              borderColor: `rgba(${
                index % 3 === 0
                  ? "139, 92, 246"
                  : index % 3 === 1
                  ? "239, 68, 68"
                  : "59, 130, 246"
              }, 1)`,
            }}
            initial={{ scale: 0, opacity: 1, borderWidth: 2 }}
            animate={{
              scale: 3,
              opacity: 0,
              borderWidth: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
