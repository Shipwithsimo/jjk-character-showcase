/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jjk: {
          purple: '#8b5cf6',
          'dark-purple': '#6d28d9',
          red: '#ef4444',
          'dark-red': '#991b1b',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          black: '#0f0f0f',
          'dark-bg': '#1a1a2e',
        },
      },
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-energy': 'pulseEnergy 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shake': 'shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'energy-wave': 'energyWave 1.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseEnergy: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.6',
          },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' },
        },
        energyWave: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
            borderWidth: '2px',
          },
          '100%': {
            transform: 'scale(3)',
            opacity: '0',
            borderWidth: '1px',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            filter: 'brightness(1) drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'
          },
          '50%': {
            filter: 'brightness(1.3) drop-shadow(0 0 40px rgba(139, 92, 246, 1))'
          },
        },
      },
      boxShadow: {
        'jjk-glow': '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)',
        'jjk-glow-intense': '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(239, 68, 68, 0.5)',
      },
      backdropBlur: {
        'xl': '20px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}