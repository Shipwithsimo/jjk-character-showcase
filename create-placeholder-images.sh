#!/bin/bash

# Script per creare immagini placeholder temporanee
# Utile per testare il progetto prima di avere le GIF definitive

echo "🎨 Creazione Immagini Placeholder JJK"
echo "======================================"
echo ""

if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick non trovato. Provo con un metodo alternativo..."
    echo ""
    echo "Installazione ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt install imagemagick"
    echo ""
fi

cd public || exit

# Definisci i personaggi e i colori
declare -A characters
characters=(
    ["itadori-yuji"]="#ef4444:red"
    ["gojo-satoru"]="#3b82f6:blue"
    ["ryomen-sukuna"]="#991b1b:darkred"
    ["megumi-fushiguro"]="#6d28d9:purple"
    ["nobara-kugisaki"]="#f97316:orange"
)

# Rimuovi vecchi file se esistono
echo "🗑️  Rimozione file vecchi..."
rm -f attack-on-titan-*.gif demon-slayer-*.gif silent-voice-*.gif spirited-away-*.gif bunny-girl-*.gif

echo "🎨 Creazione placeholder..."
echo ""

for character in "${!characters[@]}"; do
    IFS=':' read -r color name <<< "${characters[$character]}"

    for i in 1 2 3; do
        filename="${character}-${i}.gif"

        if command -v convert &> /dev/null; then
            # Usa ImageMagick se disponibile
            convert -size 480x320 -background "$color" \
                    -fill white -gravity center \
                    -pointsize 30 -font Arial \
                    label:"${character}\nScene ${i}\n\n(placeholder)" \
                    "$filename"
            echo "  ✅ Creato: $filename"
        else
            # Crea file vuoto come fallback
            touch "$filename"
            echo "  ⚠️  File vuoto: $filename (ImageMagick non disponibile)"
        fi
    done
done

cd ..

echo ""
echo "🎉 Completato!"
echo ""
echo "📝 Nota: Questi sono solo placeholder temporanei."
echo "Per il risultato finale, sostituisci con vere GIF di JJK."
echo "Vedi SETUP_IMAGES.md per dettagli."
echo ""
echo "🚀 Ora puoi avviare: npm run dev"
