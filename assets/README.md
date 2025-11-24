# Assets Platzhalter

Für eine vollständige App benötigen Sie folgende Assets:

## Benötigte Dateien

1. **icon.png** (1024x1024)
   - App-Icon für iOS und Android
   - PNG-Format, transparent oder mit Hintergrund

2. **splash.png** (1242x2436)
   - Splash-Screen beim App-Start
   - Sollte das Branding der App zeigen

3. **adaptive-icon.png** (1024x1024)
   - Android Adaptive Icon
   - Nur der Vordergrund-Layer

4. **favicon.png** (48x48)
   - Web-Version Favicon
   - Kleines Icon für Browser-Tab

## Temporäre Lösung

Die App funktioniert auch ohne diese Assets mit Standard Expo-Icons.

Um eigene Icons zu erstellen:
- Nutzen Sie Tools wie Figma, Canva oder Adobe Illustrator
- Poker-Thema: Spielkarten, Chips, GTO-Symbole
- Farbschema: Grün (#2d5f3f) für Cash Game, Rot (#c41e3a) für MTT

## Beispiel-Generierung

```bash
# Mit ImageMagick können Sie schnell Platzhalter erstellen:
convert -size 1024x1024 xc:#2d5f3f -pointsize 200 -fill white -gravity center -annotate +0+0 "♠♥" icon.png
```
