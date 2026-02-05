# 🔧 Guida Avanzata alla Personalizzazione

## 🎨 Modificare i Colori

### Opzione 1: Variabili CSS Globali
Modifica [src/index.css](src/index.css) alla riga 8-16:

```css
:root {
  --jjk-purple: #8b5cf6;      /* Energia maledetta principale */
  --jjk-dark-purple: #6d28d9; /* Accenti scuri */
  --jjk-red: #ef4444;          /* Sukuna/pericolo */
  --jjk-dark-red: #991b1b;    /* Rosso scuro */
  --jjk-blue: #3b82f6;         /* Gojo/limitless */
  --jjk-cyan: #06b6d4;         /* Effetti secondari */
  --jjk-black: #0f0f0f;        /* Background nero */
  --jjk-dark-bg: #1a1a2e;      /* Background principale */
}
```

### Opzione 2: Tailwind Config
Modifica [tailwind.config.js](tailwind.config.js) alla sezione `colors`:

```js
colors: {
  jjk: {
    purple: '#tuoColore',
    // ... altri colori
  }
}
```

---

## ⚡ Modificare le Animazioni

### Velocità delle Particelle
Modifica [src/components/CursedEnergyParticles.tsx](src/components/CursedEnergyParticles.tsx) riga 26:

```tsx
duration: Math.random() * 10 + 10, // Cambia 10 e 10 per velocità diverse
```

### Numero di Particelle
Stessa file, riga 24:

```tsx
Array.from({ length: 20 }, ...) // Cambia 20 con il numero desiderato
```

### Animazione Card
Modifica [src/components/AnimePreview.tsx](src/components/AnimePreview.tsx) riga 33-36:

```tsx
transition={{
  type: "spring",
  stiffness: 200,  // Più alto = più veloce (default 200)
  damping: 10,     // Più basso = più rimbalzo (default 10)
  mass: 0.6,       // Peso dell'elemento (default 0.6)
}}
```

### Animazione Hover Titoli
Modifica [src/lib/constant.ts](src/lib/constant.ts) riga 3-16:

```tsx
export const ANIMATION_CONFIG = {
  initial: {
    scaleY: 1.15, // Scala iniziale
  },
  hover: {
    scaleY: 1.3,  // Scala al hover (più grande = più zoom)
  },
  transition: {
    type: "spring",
    stiffness: 300, // Velocità della transizione
    damping: 10,
    mass: 0.8,
  },
}
```

---

## 📐 Posizionamento delle Card

Modifica [src/lib/data.ts](src/lib/data.ts) per cambiare dove appaiono le GIF:

```tsx
itadoriYuji: [
  {
    src: itadoriYuji1,
    offsetX: -480,  // Posizione orizzontale (negativo = sinistra)
    offsetY: -200,  // Posizione verticale (negativo = alto)
    rotate: -10,    // Rotazione in gradi
  },
  // ... altre scene
]
```

### Suggerimenti:
- **offsetX**: da -600 a 600 (0 = centro)
- **offsetY**: da -400 a 300
- **rotate**: da -20 a 20 per risultati migliori

---

## 👥 Aggiungere Altri Personaggi

### Step 1: Aggiungi a constant.ts

```tsx
export const ANIME_TITLES: AnimeTitle[] = [
  // ... esistenti
  { id: "makiZenin", displayName: "Maki Zenin" },
]
```

### Step 2: Aggiungi immagini a data.ts

```tsx
// Import
import makiZenin1 from "/maki-zenin-1.gif";
import makiZenin2 from "/maki-zenin-2.gif";
import makiZenin3 from "/maki-zenin-3.gif";

// Nel data object
export const data: Record<string, AnimeSceneEntry[]> = {
  // ... esistenti
  makiZenin: [
    { src: makiZenin1, offsetX: -450, offsetY: -180, rotate: -8 },
    { src: makiZenin2, offsetX: -10, offsetY: -290, rotate: 3 },
    { src: makiZenin3, offsetX: 440, offsetY: -100, rotate: -5 },
  ],
}
```

### Step 3: Aggiungi le 3 GIF in public/

```
public/
  ├── maki-zenin-1.gif
  ├── maki-zenin-2.gif
  └── maki-zenin-3.gif
```

---

## 🎭 Personalizzare per Personaggio

### Colori Unici per Ogni Personaggio
Modifica [src/components/AnimeTitleText.tsx](src/components/AnimeTitleText.tsx):

```tsx
const getCharacterGradient = (id: string) => {
  switch(id) {
    case 'itadoriYuji': return 'from-red-400 to-orange-500';
    case 'gojoSatoru': return 'from-blue-400 to-cyan-500';
    case 'ryomenSukuna': return 'from-red-600 to-black';
    case 'megumiFushiguro': return 'from-purple-500 to-blue-600';
    case 'nobaraKugisaki': return 'from-orange-400 to-pink-500';
    default: return 'from-purple-400 to-red-500';
  }
}

// Usa nel className
className={`... bg-gradient-to-r ${getCharacterGradient(title.id)}`}
```

---

## 🌟 Effetti Speciali Avanzati

### Aggiungere Sound Effects
1. Aggiungi file audio in `public/sounds/`
2. Modifica [src/components/AnimeTitleText.tsx](src/components/AnimeTitleText.tsx):

```tsx
const playSound = () => {
  const audio = new Audio('/sounds/cursed-energy.mp3');
  audio.volume = 0.3;
  audio.play();
}

// Nel component
onMouseEnter={(e) => {
  playSound();
  onHover(e.currentTarget.dataset.text!);
}}
```

### Easter Egg per Sukuna
Aggiungi effetto glitch quando passi su Sukuna:

```tsx
// In AnimeTitleText.tsx
const isSukuna = title.id === 'ryomenSukuna';

<motion.span
  // ... props esistenti
  animate={{
    ...(isSukuna && {
      textShadow: [
        "0 0 10px #ef4444",
        "2px 0 10px #ef4444",
        "-2px 0 10px #ef4444",
        "0 0 10px #ef4444"
      ]
    })
  }}
  transition={{
    textShadow: { duration: 0.2, repeat: Infinity }
  }}
>
```

### Domain Expansion Effect
Aggiungi overlay fullscreen al hover:

```tsx
// Nuovo componente: src/components/DomainExpansion.tsx
export const DomainExpansion = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: isActive ? 0.3 : 0 }}
    style={{
      background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
    }}
  />
);
```

---

## 📱 Ottimizzazione Mobile

### Disabilitare Particelle su Mobile
Modifica [src/components/CursedEnergyParticles.tsx](src/components/CursedEnergyParticles.tsx):

```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);

if (isMobile) return null; // Non renderizzare su mobile
```

### Layout Verticale per Mobile
Modifica [src/App.tsx](src/App.tsx):

```tsx
<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 ...">
```

---

## 🎯 Tips & Tricks

### Performance
- Riduci numero particelle a 10-15 per performance migliori
- Comprimi GIF sotto 1MB ciascuna
- Usa `loading="lazy"` sulle immagini

### Accessibilità
- Aggiungi `aria-label` ai titoli
- Test con lettori schermo
- Verifica contrasto colori (WCAG AA)

### SEO
- Ottimizza meta tags in [index.html](index.html)
- Aggiungi Open Graph tags
- Genera sitemap se deployed

---

## 🐛 Debugging

### Le particelle non si vedono?
```tsx
// Aumenta z-index in CursedEnergyParticles.tsx
<div className="... z-50"> // invece di z-0
```

### Card sovrapposte?
```tsx
// Regola offsetX e offsetY in data.ts
// Aumenta la distanza tra le card
```

### Animazioni scattose?
```tsx
// Riduci stiffness e aumenta damping
stiffness: 150,  // era 200
damping: 15,     // era 10
```

---

## 📚 Risorse Utili

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React TypeScript**: https://react-typescript-cheatsheet.netlify.app/
- **GIF Optimizer**: https://ezgif.com/optimize

---

Buon divertimento con la personalizzazione! 🎉
