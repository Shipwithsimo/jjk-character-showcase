import { useState, useEffect, useRef } from "react";

type PerformanceGatingOptions = {
  enable3D: boolean;
  enableTrailParticles: boolean;
  enableMouseRepel: boolean;
  enableHexGrid: boolean;
  enableBackgroundParticles: boolean;
  reducedMotion: boolean;
};

// Verifica se il browser supporta la scheda grafica
const hasGoodGPU = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return true; // Se non possiamo leggere, assumiamo buone prestazioni
    
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Verifica se è un renderer software o integrato vecchio
    const isSoftwareRenderer = /software|swiftshader|llvmpipe/i.test(renderer);
    return !isSoftwareRenderer;
  } catch {
    return true;
  }
};

export const usePerformanceGating = (): PerformanceGatingOptions => {
  const [options, setOptions] = useState<PerformanceGatingOptions>({
    enable3D: true,
    enableTrailParticles: true,
    enableMouseRepel: false, // Disabilitato di default
    enableHexGrid: false,    // Disabilitato di default
    enableBackgroundParticles: true,
    reducedMotion: false,
  });

  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    const checkPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const isWeakCPU = navigator.hardwareConcurrency < 4;
      const isMobileUserAgent = /Mobi|Android/i.test(navigator.userAgent);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const goodGPU = hasGoodGPU();

      // Su mobile o CPU debole, disabilita quasi tutto
      const shouldDisableHeavyEffects = isMobile || isWeakCPU || isMobileUserAgent;
      
      // Su GPU lenta, riduci gli effetti
      const shouldReduceEffects = !goodGPU || prefersReducedMotion;

      setOptions({
        // 3D solo su desktop con buona GPU
        enable3D: !shouldDisableHeavyEffects && !shouldReduceEffects,
        // Trail particles solo su desktop potente
        enableTrailParticles: !shouldDisableHeavyEffects,
        // Mouse repel disabilitato (non implementato)
        enableMouseRepel: false,
        // Hex grid disabilitato (non implementato)
        enableHexGrid: false,
        // Background particles sempre attivi ma con count ridotto gestito dal componente
        enableBackgroundParticles: true,
        // Reduced motion se richiesto dal sistema
        reducedMotion: prefersReducedMotion,
      });
    };

    // Delay per non bloccare il primo render
    const timer = setTimeout(checkPerformance, 100);

    // Debounce resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkPerformance, 250);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    
    // Ascolta preferenze reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => checkPerformance();
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return options;
};
