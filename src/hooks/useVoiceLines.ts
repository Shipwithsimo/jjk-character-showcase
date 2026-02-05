/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 * 
 * Voice lines audio management
 */

import { useRef, useCallback, useState } from "react";

// Mappa dei file audio per ogni personaggio
const AUDIO_MAP: Record<string, string> = {
  itadoriYuji: "/audio/itadori-yuji-quote.mp3",
  gojoSatoru: "/audio/gojo-satoru-quote.mp3",
  ryomenSukuna: "/audio/sukuna-quote.mp3",
  tojiFushiguro: "/audio/toji-quote.mp3",
  "makiZen'in": "/audio/maki-quote.mp3",
};

// Fallback se non c'è l'audio specifico
const DEFAULT_AUDIO = "/audio/default-quote.mp3";

export const useVoiceLines = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);

  const playVoice = useCallback((characterId: string) => {
    // Se c'è già un audio in riproduzione, fermalo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Ottieni il path dell'audio
    const audioPath = AUDIO_MAP[characterId] || DEFAULT_AUDIO;

    // Crea nuovo elemento audio
    const audio = new Audio(audioPath);
    audio.volume = 0.7;
    
    // Gestori eventi
    audio.addEventListener("play", () => {
      setIsPlaying(true);
      setCurrentCharacter(characterId);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentCharacter(null);
    });
    
    audio.addEventListener("error", () => {
      console.warn(`Audio non trovato: ${audioPath}`);
      setIsPlaying(false);
      setCurrentCharacter(null);
    });

    // Salva riferimento e riproduci
    audioRef.current = audio;
    
    // Riproduci (gestisce anche il caso in cui l'audio non esista)
    audio.play().catch((err) => {
      console.warn("Audio play failed:", err.message);
      setIsPlaying(false);
    });
  }, []);

  const stopVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentCharacter(null);
    }
  }, []);

  return {
    playVoice,
    stopVoice,
    isPlaying,
    currentCharacter,
  };
};
