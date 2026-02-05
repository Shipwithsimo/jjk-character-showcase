# 🎭 Guida per Aggiungere le Immagini di Jujutsu Kaisen

## 📋 Immagini Necessarie

Devi preparare **15 GIF** (3 per ogni personaggio) delle scene iconiche di Jujutsu Kaisen.

### Struttura dei File

Nella cartella `public/`, sostituisci i file esistenti con i tuoi, rinominandoli esattamente come segue:

#### **Itadori Yuji** (3 GIF)
- `itadori-yuji-1.gif` - Esempio: Black Flash o combattimento vs Mahito
- `itadori-yuji-2.gif` - Esempio: Divergent Fist o scene emotive
- `itadori-yuji-3.gif` - Esempio: Cooperazione con Todo o momenti epici

#### **Gojo Satoru** (3 GIF)
- `gojo-satoru-1.gif` - Esempio: Infinity demonstration o Limitless
- `gojo-satoru-2.gif` - Esempio: Domain Expansion (Unlimited Void)
- `gojo-satoru-3.gif` - Esempio: Purple Hollow o momenti iconici

#### **Ryomen Sukuna** (3 GIF)
- `ryomen-sukuna-1.gif` - Esempio: Trasformazione o presa di controllo
- `ryomen-sukuna-2.gif` - Esempio: Malevolent Shrine Domain Expansion
- `ryomen-sukuna-3.gif` - Esempio: Dismantle/Cleave o combattimenti

#### **Toji Fushiguro** (3 GIF)
- `toji-fushiguro-1.gif` - Esempio: Ten Shadows Technique
- `toji-fushiguro-2.gif` - Esempio: Divine Dogs o shikigami
- `toji-fushiguro-3.gif` - Esempio: Domain Expansion o scene intense

#### **Maki Zen'in** (3 GIF)
- `maki-zen'in-1.gif` - Esempio: Straw Doll Technique
- `maki-zen'in-2.gif` - Esempio: Resonance attack
- `maki-zen'in-3.gif` - Esempio: Combattimenti o momenti iconici

---

## 🔍 Dove Trovare le GIF

### Opzione 1: Siti Web Consigliati
- **Tenor** (https://tenor.com) - Cerca "Jujutsu Kaisen [nome personaggio]"
- **Giphy** (https://giphy.com) - Ampia collezione di anime GIF
- **Imgur** (https://imgur.com) - Community con molte GIF JJK
- **Reddit** (r/JuJutsuKaisen) - Post della community con scene gif

### Opzione 2: Creare le Proprie GIF
1. **Trova episodi di JJK** (streaming legale: Crunchyroll, Netflix)
2. **Usa tool di screen recording**:
   - **ezgif.com** - Converti video in GIF online
   - **GIPHY Capture** (Mac) - Screen recorder a GIF
   - **ScreenToGif** (Windows) - Registra e esporta GIF
3. **Ottimizza le dimensioni**: Cerca di mantenere ogni GIF sotto 2-3 MB per performance migliori

### Opzione 3: Estrai da Video
```bash
# Con ffmpeg (se installato)
ffmpeg -i video.mp4 -ss 00:00:10 -t 3 -vf "fps=15,scale=480:-1" output.gif
```

---

## 📦 Passi per l'Installazione

1. **Prepara le 15 GIF** seguendo i nomi esatti sopra elencati
2. **Elimina i vecchi file** dalla cartella `public/`:
   ```bash
   cd public
   rm attack-on-titan-*.gif demon-slayer-*.gif silent-voice-*.gif spirited-away-*.gif bunny-girl-*.gif
   ```
3. **Copia le nuove GIF** nella cartella `public/`
4. **Verifica i nomi** - Devono corrispondere esattamente a quelli nel codice
5. **Avvia l'app**: `npm run dev`

---

## 💡 Suggerimenti

- **Risoluzione consigliata**: 480x320 o simile (aspect ratio 3:2)
- **FPS**: 10-20 fps sono sufficienti
- **Durata**: 2-5 secondi per GIF
- **Formato**: Ottimizzato per web (comprimi se > 3MB)
- **Qualità**: Bilanciare tra qualità visiva e dimensioni file

---

## 🎨 Personalizzazione Avanzata

Se vuoi cambiare le posizioni o rotazioni delle immagini, modifica il file:
`src/lib/data.ts`

Cambia i valori di:
- `offsetX` / `offsetY` - Posizione della GIF
- `rotate` - Rotazione in gradi

---

## ❓ Problemi Comuni

**Le immagini non si caricano?**
- Verifica i nomi esatti dei file (case-sensitive!)
- Controlla che le GIF siano nella cartella `public/`
- Riavvia il server di sviluppo

**Le GIF sono troppo grandi?**
- Usa un compressore online: ezgif.com/optimize
- Riduci dimensioni e FPS

**Vuoi usare altri personaggi?**
- Modifica `src/lib/constant.ts` per cambiare i nomi
- Aggiorna `src/lib/data.ts` con i nuovi percorsi

---

Buon divertimento con la tua gallery di Jujutsu Kaisen! 🔥⚡
