# Poker Training Pro 🃏

Eine rigorose, GTO-basierte Poker-Trainings-App für No-Limit Hold'em, entwickelt als React Native App.

## 📋 Überblick

Diese App implementiert die strategische Analyse aus dem Dokument "Rigorose Bewertung und strategische Neukonstruktion eines intensiven einwöchigen Poker-Trainingsplans".

### Hauptfunktionen

1. **Zwei spezialisierte Trainingspfade**
   - **Pfad A**: 6-Max Cash Game Spezialist (100bb Deep Stack)
   - **Pfad B**: MTT (Tournament) Spezialist (Variable Stack-Tiefen)

2. **40-Stunden Trainingsplan-Tracker**
   - 7-Tage strukturierter Plan
   - Fortschrittsverfolgung für jeden Tag
   - Module: Drills, Videos, Live Play, Reviews

3. **Range Trainer**
   - GTO-basierte Preflop-Ranges für alle Positionen
   - RFI (Raise First In) Ranges
   - 3-Bet Ranges (Linear vs Polarisiert)
   - Cold-Call Ranges

4. **Push/Fold Charts**
   - Nash Equilibrium-basierte Charts für 20bb, 15bb, 10bb
   - Open-Shove Ranges für alle Positionen
   - Re-Shove Defense Ranges
   - ICM Guidelines für Bubble & Final Table

5. **Exploitative Strategy Guide**
   - Die 5 häufigsten Hobbyspieler-Leaks
   - Spezifische Exploits mit erwarteten Win-Rates
   - 10x Rule für Set Mining
   - C-Bet Strategy Matrix (HU vs MW)

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js (v14 oder höher)
- npm oder yarn
- Expo CLI (wird automatisch installiert)

### Installation

```bash
# Dependencies installieren
npm install

# Oder mit yarn
yarn install
```

### App starten

```bash
# Development Server starten
npm start

# Oder
expo start

# Auf Android
npm run android

# Auf iOS (nur macOS)
npm run ios

# Im Web-Browser
npm run web
```

## 📱 App-Struktur

```
Poker/
├── App.js                          # Haupteinstiegspunkt & Navigation
├── src/
│   ├── data/
│   │   ├── pokerRanges.js         # GTO Preflop-Ranges
│   │   ├── pushFoldCharts.js      # MTT Push/Fold Charts
│   │   ├── exploitativeStrategies.js  # Exploits & Leaks
│   │   └── trainingPlan.js        # 40h Trainingsplan
│   └── screens/
│       ├── HomeScreen.js          # Startseite & Pfad-Auswahl
│       ├── TrainingPlanScreen.js  # 7-Tage Trainingsplan
│       ├── RangeTrainerScreen.js  # Range Training
│       ├── PushFoldScreen.js      # Push/Fold Charts
│       └── ExploitativeGuideScreen.js  # Exploits Guide
├── package.json
└── README.md
```

## 🎯 Verwendung

### 1. Pfad wählen

Beim Start der App wählen Sie einen der beiden Trainingspfade:

- **Pfad A (Cash Game)**: Schwerer, aber breiteres Skill-Set. Fokus auf Postflop-Spiel.
- **Pfad B (MTT)**: Einfacher, schnellere Lernkurve. Fokus auf Push/Fold und Stack-Management.

### 2. 40-Stunden Trainingsplan

Folgen Sie dem strukturierten 7-Tage-Plan:
- **Tag 1-2**: Grundlagen (RFI Ranges, Postflop-Basics)
- **Tag 3-4**: Kernstrategie (Exploits, Push/Fold)
- **Tag 5-6**: Fortgeschritten (3-Bet Ranges, ICM)
- **Tag 7**: Integration & Assessment

### 3. Range Trainer nutzen

- Lernen Sie GTO-konforme Preflop-Ranges
- Verstehen Sie positionsabhängige Anpassungen
- Studieren Sie 3-Bet-Strategien (Linear vs Polar)

### 4. Push/Fold Charts studieren

- Meistern Sie Short-Stack-Spiel für Turniere
- Lernen Sie Stack-Größen-spezifische Ranges
- Verstehen Sie ICM-Adjustments

### 5. Exploitative Strategien anwenden

- Identifizieren Sie häufige Gegner-Leaks
- Wenden Sie profitable Exploits an
- Tracken Sie Expected Win-Rates

## ⚠️ Wichtiger Hinweis

Diese App ist ein **Lern- und Referenz-Tool**. Für maximale Trainingseffizienz wird empfohlen, zusätzlich professionelle GTO-Trainer zu nutzen:

- **GTO Wizard** ($29-49/mo) - Umfassendste Lösung
- **DTO Poker** ($25-40/mo) - Fokus auf MTTs
- **PokerCoaching.com** ($49/mo) - Videos + Training

Diese professionellen Tools bieten:
- KI-Gegner für Live-Training
- Hand-History-Analyse
- Kontextbezogenes Feedback
- GTO Solver-Integration

## 🎨 Assets

Die App benötigt folgende Asset-Dateien (erstellen Sie diese oder verwenden Sie Platzhalter):

```
assets/
├── icon.png              # 1024x1024 App-Icon
├── splash.png            # 1242x2436 Splash-Screen
├── adaptive-icon.png     # 1024x1024 Android Adaptive Icon
└── favicon.png           # 48x48 Web-Favicon
```

**Temporär**: Die App funktioniert auch ohne diese Assets (mit Standard Expo-Icons).

## 🧪 Features in der App

### Trainingsplan-Tracker
- ✅ Fortschrittsverfolgung pro Modul
- ✅ Persistente Speicherung (AsyncStorage)
- ✅ Visual Progress Bar
- ✅ Reset-Funktion

### Range Trainer
- ✅ Alle 6 Positionen (UTG bis BB)
- ✅ Prozentsätze & Beschreibungen
- ✅ Vollständige Hand-Listen
- ✅ 3-Bet Ranges (Linear & Polar)
- ✅ Cold-Call Guidelines

### Push/Fold Charts
- ✅ 3 Stack-Größen (20bb, 15bb, 10bb)
- ✅ Open-Shove Ranges (alle Positionen)
- ✅ Re-Shove Defense Ranges
- ✅ ICM Guidelines (Bubble & Final Table)

### Exploitative Guide
- ✅ 5 häufigste Leaks dokumentiert
- ✅ Spezifische Exploits mit Win-Rates
- ✅ Quick Reference Matrix
- ✅ 10x Rule Calculator
- ✅ C-Bet Strategy Matrix

## 🔄 Daten-Updates

Alle strategischen Daten befinden sich in `/src/data/`:
- Passen Sie Ranges nach Bedarf an
- Fügen Sie neue Exploits hinzu
- Erweitern Sie den Trainingsplan

## 📚 Theoretische Grundlage

Die App basiert auf:
- **GTO (Game Theory Optimal)** Prinzipien
- **Nash Equilibrium** für Push/Fold
- **ICM (Independent Chip Model)** für Turniere
- **Exploitative Theorie** gegen Common Leaks

### Kernkonzepte

1. **Range-Morphologie**: Linear, Polarisiert, Kondensiert, Gemerged
2. **Blocker-Effekte**: A5s blockt AA/AK (50% weniger Combos)
3. **Implied Odds**: 10x Rule für Set Mining
4. **ICM**: Non-linearer Chip-Wert in Turnieren

## 🐛 Bekannte Einschränkungen

- Keine Live-GTO-Solver-Integration (nur Daten)
- Kein Hand-History-Upload/-Analyse
- Keine KI-Gegner zum Üben
- Keine Community/Social Features

→ Diese Features sind bewusst ausgelassen, da professionelle Tools diese besser bieten.

## 📖 Weiterführende Ressourcen

- **Bücher**: "Modern Poker Theory" (Acevedo), "Applications of NLHE" (Janda)
- **Software**: PioSolver, GTO Wizard, DTO Poker
- **Communities**: TwoPlusTwo, RunItOnce, PokerCoaching
- **Tracker**: PokerTracker 4, Hold'em Manager 3

## 🤝 Beitragen

Dies ist ein Lern- und Referenzprojekt. Verbesserungsvorschläge:
- Neue Exploits dokumentieren
- Ranges aktualisieren (basierend auf Solver-Updates)
- UI/UX-Verbesserungen
- Zusätzliche Trainingsmodule

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt.

## 🎓 Credits

Strategische Konzepte basierend auf:
- GTO Wizard Research
- Smart Poker Study (KISS Ranges)
- Modern Poker Theory
- Run It Once Training

---

**Viel Erfolg beim Training! 🚀**

*Remember: Poker is a skill game. Responsible gaming only. 18+*
