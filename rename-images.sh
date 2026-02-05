#!/bin/bash

# Script per rinominare facilmente le immagini JJK
# Uso: ./rename-images.sh

echo "🎭 Script di Rinominazione Immagini Jujutsu Kaisen"
echo "=================================================="
echo ""
echo "Questo script ti aiuterà a rinominare le tue GIF per il progetto."
echo ""

# Array dei nomi richiesti
declare -a files=(
  "itadori-yuji-1.gif"
  "itadori-yuji-2.gif"
  "itadori-yuji-3.gif"
  "gojo-satoru-1.gif"
  "gojo-satoru-2.gif"
  "gojo-satoru-3.gif"
  "ryomen-sukuna-1.gif"
  "ryomen-sukuna-2.gif"
  "ryomen-sukuna-3.gif"
  "megumi-fushiguro-1.gif"
  "megumi-fushiguro-2.gif"
  "megumi-fushiguro-3.gif"
  "nobara-kugisaki-1.gif"
  "nobara-kugisaki-2.gif"
  "nobara-kugisaki-3.gif"
)

# Verifica se siamo nella directory corretta
if [ ! -d "public" ]; then
  echo "❌ Errore: Devi eseguire questo script dalla root del progetto!"
  exit 1
fi

cd public

echo "📋 File richiesti:"
echo ""
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (mancante)"
  fi
done

echo ""
echo "📊 File vecchi da rimuovere:"
old_files=$(ls -1 | grep -E "(attack-on-titan|demon-slayer|silent-voice|spirited-away|bunny-girl).*\.gif" | wc -l)
if [ "$old_files" -gt 0 ]; then
  ls -1 | grep -E "(attack-on-titan|demon-slayer|silent-voice|spirited-away|bunny-girl).*\.gif"
  echo ""
  read -p "Vuoi rimuovere questi file vecchi? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f attack-on-titan-*.gif demon-slayer-*.gif silent-voice-*.gif spirited-away-*.gif bunny-girl-*.gif
    echo "✅ File vecchi rimossi!"
  fi
else
  echo "  Nessun file vecchio trovato."
fi

echo ""
echo "📝 Modalità rinominazione interattiva"
echo "======================================"
echo ""
echo "Se hai file con nomi diversi, possiamo rinominarli ora."
read -p "Vuoi avviare la modalità di rinominazione? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  for target_file in "${files[@]}"; do
    if [ ! -f "$target_file" ]; then
      echo ""
      echo "🎯 Manca: $target_file"
      echo "File disponibili:"
      ls -1 *.gif 2>/dev/null | grep -v -E "^(itadori|gojo|ryomen|megumi|nobara)" || echo "  (nessun file .gif trovato)"
      echo ""
      read -p "Inserisci il nome del file da rinominare (o premi INVIO per saltare): " source_file
      if [ -n "$source_file" ] && [ -f "$source_file" ]; then
        mv "$source_file" "$target_file"
        echo "✅ Rinominato: $source_file -> $target_file"
      else
        echo "⏭️  Saltato"
      fi
    fi
  done
fi

cd ..

echo ""
echo "🎉 Completato!"
echo ""
echo "📊 Riepilogo finale:"
cd public
missing=0
for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    ((missing++))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ Tutte le 15 GIF sono presenti!"
  echo "🚀 Puoi ora avviare il progetto con: npm run dev"
else
  echo "⚠️  Mancano ancora $missing file"
  echo "📖 Consulta SETUP_IMAGES.md per maggiori informazioni"
fi

cd ..
