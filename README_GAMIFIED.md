# Poker Training Pro 🃏🎮

**Version 2.0 - Gamified Learning Edition**

Eine rigorose, GTO-basierte Poker-Trainings-App mit **Gamification**, **Spaced Repetition** und **Interactive Mini-Games** - entwickelt nach modernsten Educational Game Design Prinzipien (2025).

---

## 🌟 Was ist neu in v2.0?

### 🎮 **Gamification System** (Duolingo-Style)
- **XP & Levels**: Verdiene Experience Points für jede Aktivität, steige auf bis Level 10 (Legend)
- **Daily Streaks**: Baue deine Streak auf (🔥) - Loss Aversion Psychologie für tägliches Training
- **Achievements**: 15+ freischaltbare Badges für Meilensteine
- **Daily Challenges**: Täglich wechselnde Challenges mit Bonus-XP

### 🧠 **Spaced Repetition Engine** (Anki SM-2 Algorithm)
- **4 vorgefertigte Decks**: Ranges, Push/Fold, Exploits, Theory
- **Optimale Intervalle**: 1d → 6d → 13d → 30d basierend auf Performance
- **90% Retention Target**: Wissenschaftlich optimiert für langfristiges Lernen
- **Session-Tracking**: Detailed stats (Accuracy, Duration, New Cards, Reviews)

### 🎯 **Interactive Mini-Games**
- **Quiz Game**: Multiple-Choice mit sofortigem Feedback & Erklärungen
- **Speed Drills**: Schnelle Ja/Nein Entscheidungen (unter 5s pro Frage)
- **Scenario Trainer**: Komplexe, multi-step Poker-Situationen

### 🔊 **Sound & Haptic Feedback** (Multi-Sensory UX)
- **Success Sounds**: Pleasant chimes bei korrekten Antworten
- **Error Sounds**: Sharp alerts bei Fehlern
- **Haptic Feedback**: Vibrationen für wichtige Momente (Level-Up, Achievements)
- **Konfigurierbar**: Ein/Aus in Settings

### 🎨 **Modern UI/UX 2025**
- **Micro-interactions**: Purposeful animations (Progress Bars, Card Flips)
- **Visual Feedback**: Color-coded (Green = Correct, Red = Wrong)
- **Minimalist Design**: Clean, fokussiert, keine Ablenkungen
- **Dark Mode Ready**: (Coming Soon)

---

## 📊 Forschungsbasiert

Diese App basiert auf den neuesten Erkenntnissen aus:

### UI/UX Best Practices 2025
- Micro-interactions für Feedback
- Multi-sensory coherence (Audio + Haptic + Visual)
- Performance first (instant loading, smooth animations)
- Accessibility & inclusivity

### Gamification Research
- **Streaks**: 100-150% Engagement Boost (Duolingo-validated)
- **Loss Aversion**: "Don't break the chain" Psychologie
- **Immediate Gratification**: Dopamine hits bei jeder Aktion
- **Progress Visualization**: XP Bars, Levels, Badges

### Spaced Repetition Science
- **SM-2 Algorithm**: SuperMemo 2 (Gold Standard seit 1987)
- **Anki Modifications**: User control, minimum EF 130%
- **Target Retention**: ~90% (optimal für Lernen vs Zeitaufwand)
- **FSRS Inspiration**: Future-ready für adaptive Intervalle

### Educational Game Design
- **Bite-sized Lessons**: 5-10min Sessions (Duolingo-Style)
- **Immediate Feedback**: Instant gratification & error correction
- **Clear Objectives**: Immer wissen, was als nächstes kommt
- **Skill Trees**: Visual progress durch structured Learning Path

---

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (v14+)
- npm oder yarn
- Expo CLI

### Installation

```bash
# Dependencies installieren
npm install

# App starten
npm start
# oder
expo start

# Auf Device (via Expo Go App)
# Scanne QR-Code mit der Expo Go App

# Im Web-Browser (für schnelle Preview)
npm run web
```

---

## 📱 App-Struktur (v2.0)

```
Poker/
├── App.js                          # Navigation (Tab + Stack Navigator)
├── src/
│   ├── core/                       # 🆕 Gamification & SRS Engines
│   │   ├── gamification.js         # XP, Levels, Achievements, Streaks
│   │   ├── spacedRepetition.js     # SM-2 Algorithm, Card/Deck System
│   │   └── soundManager.js         # Sound & Haptic Feedback
│   ├── data/
│   │   ├── pokerRanges.js          # GTO Preflop-Ranges
│   │   ├── pushFoldCharts.js       # MTT Push/Fold Charts
│   │   ├── exploitativeStrategies.js  # Exploits & Leaks
│   │   ├── trainingPlan.js         # 40h Trainingsplan
│   │   └── miniGames.js            # 🆕 Quiz/Drill Generators
│   ├── components/                 # 🆕 UI Components
│   │   ├── XPBar.js                # Level & XP Visualisierung
│   │   ├── StreakFlame.js          # Daily Streak Display
│   │   └── AchievementBadge.js     # Achievement Unlock Animation
│   └── screens/
│       ├── HomeScreen.js           # Dashboard
│       ├── TrainingPlanScreen.js   # 40h Plan
│       ├── RangeTrainerScreen.js   # Range Study
│       ├── PushFoldScreen.js       # Push/Fold Charts
│       ├── ExploitativeGuideScreen.js  # Exploits Guide
│       ├── QuizGameScreen.js       # 🆕 Interactive Quiz
│       ├── SpacedRepetitionScreen.js   # 🆕 Flashcard SRS
│       └── ProfileScreen.js        # 🆕 Stats & Settings
├── package.json
└── README.md
```

---

## 🎯 Verwendung

### 🏠 Home Screen
- **XP Bar**: Aktuelles Level & Progress zum nächsten Level
- **Streak Flame**: Anzahl der aufeinanderfolgenden Trainingstage (🔥)
- **Quick Actions**: Direktzugriff zu Quiz, SRS, Training Plan
- **Daily Challenge**: Wechselnde tägliche Herausforderung

### 📚 Learn Tab (Lernen)
1. **40h Trainingsplan**: Strukturierter 7-Tage-Plan mit Progress Tracking
2. **Range Trainer**: Studiere GTO Ranges für alle Positionen
3. **Push/Fold Charts**: MTT-spezifische Short-Stack Ranges
4. **Exploits Guide**: Lerne, häufige Leaks auszunutzen

### 🎮 Practice Tab (Üben)
1. **Quiz Game**:
   - Multiple Choice Fragen (Ranges, Push/Fold, Exploits)
   - Immediate Feedback mit Erklärungen
   - Perfect Score Bonus (+25 XP)
   - Accuracy Tracking

2. **Spaced Repetition**:
   - 4 Decks: Ranges, Push/Fold, Exploits, Theory
   - SM-2 Algorithm (Anki-basiert)
   - Rate jede Karte: Again, Hard, Good, Easy
   - Optimale Review-Intervalle

### 👤 Profile Tab
- **Stats**: Total XP, Sessions, Perfect Quizzes, Longest Streak
- **Achievements**: 15+ freischaltbare Badges
- **Settings**: Sound, Haptics, Dark Mode (Coming Soon)

---

## 🏆 Achievements System

| Icon | Achievement | Beschreibung | XP |
|------|------------|--------------|------|
| 🎯 | Erste Schritte | Schließe deine erste Session ab | 50 |
| 📖 | Engagierter Schüler | 10 Sessions abgeschlossen | 100 |
| 🎓 | Poker-Gelehrter | Alle 7 Tage des Plans abgeschlossen | 500 |
| 🔥 | 7-Tage Streak | Trainiere 7 Tage am Stück | 200 |
| 💪 | 30-Tage Streak | Trainiere 30 Tage am Stück | 1000 |
| ⚡ | Unaufhaltsam | 100-Tage Streak | 5000 |
| 💯 | Perfekt! | Erreiche 100% in einem Quiz | 100 |
| 🏅 | Quiz-Meister | 5x hintereinander 100% in Quizzes | 300 |
| 🗺️ | Range-Entdecker | Studiere alle 6 Positionen | 150 |
| 📊 | Push/Fold Profi | Meistere alle 3 Stack-Größen | 200 |
| 🎯 | Exploit-Jäger | Studiere alle 5 Leaks | 150 |
| ⚡ | Blitzschnell | 10 Fragen in <5s beantwortet | 200 |

---

## 📈 XP & Level System

| Level | XP Required | Title | Icon |
|-------|-------------|-------|------|
| 1 | 0 | Poker Novice | 🌱 |
| 2 | 100 | Enthusiast | 🔰 |
| 3 | 250 | Student | 📚 |
| 4 | 500 | Apprentice | 🎓 |
| 5 | 1,000 | Skilled Player | ⭐ |
| 6 | 2,000 | Expert | 💎 |
| 7 | 4,000 | Master | 👑 |
| 8 | 7,000 | GTO Warrior | ⚔️ |
| 9 | 12,000 | Pro | 🏆 |
| 10 | 20,000 | **Legend** | 🔥 |

### XP Rewards

| Aktivität | XP |
|-----------|-----|
| Drill abgeschlossen | 10 |
| Video angeschaut | 5 |
| Live Session | 20 |
| Review Session | 15 |
| Quiz abgeschlossen | 10 |
| Quiz Perfect (100%) | 25 |
| Speed Drill (schnell) | 30 |
| SRS Card Review (Easy) | 3 |
| Daily Goal erreicht | 50 |
| Woche abgeschlossen | 100 |
| 7-Tage Streak Bonus | 100 |
| 30-Tage Streak Bonus | 500 |

---

## 🎓 Spaced Repetition Details

### SM-2 Algorithm Basics

Das System trackt für jede Karte:
- **n**: Anzahl korrekte Wiederholungen
- **EF**: Easiness Factor (startet bei 2.5, Minimum 1.3)
- **I**: Interval in Tagen bis zur nächsten Review

### Intervall-Beispiele

| Rating | n=0 | n=1 | n=2 | n=3 | n=4 |
|--------|-----|-----|-----|-----|-----|
| Again (0) | 0d | 0d | 0d | 0d | 0d |
| Hard (1) | 1d | 4d | 10d | 20d | 40d |
| Good (2) | 1d | 6d | 13d | 30d | 70d |
| Easy (3) | 1d | 6d | 18d | 40d | 95d |

### 4 Vorgefertigte Decks

1. **Preflop Ranges (6-Max)**
   - UTG, MP, CO, BTN, SB RFI Ranges
   - 3-Bet Linear vs Polar
   - Cold Call Guidelines

2. **Push/Fold Charts (MTT)**
   - 20bb, 15bb, 10bb Open-Shove Ranges
   - Re-Shove Defense
   - ICM Concepts

3. **Exploitative Strategies**
   - Limper ISO-Raise
   - Calling Station Exploits
   - Fit-or-Fold Counters
   - 10x Rule (Set Mining)

4. **Concepts & Theory**
   - Blocker-Effekte (A5s)
   - ICM Basics
   - Range Morphology
   - Implied Odds

---

## 🎯 Daily Challenges

Jeden Tag eine neue Challenge:

| Tag | Challenge | Beschreibung | Reward |
|-----|-----------|--------------|--------|
| Mo | Perfektionist | 10 Fragen 100% korrekt | 100 XP + Badge |
| Di | Speedster | 20 Fragen in <60s | 150 XP + Badge |
| Mi | Range-Meister | Alle 6 Positionen studieren | 80 XP + Badge |
| Do | Leak-Jäger | Alle 5 Exploits lernen | 120 XP + Badge |
| Fr | SRS Marathon | 50 Karten reviewen | 100 XP |
| Sa | Quiz Champion | 5 Quizzes abschließen | 150 XP |
| So | Consistency King | 3 Sessions heute | 100 XP |

---

## 🔊 Sound Design

### Sound Events
- **XP Gained**: Soft chime (pleasant)
- **Level Up**: Triumphant fanfare
- **Achievement Unlocked**: Special badge sound
- **Correct Answer**: Quick confirmation beep
- **Wrong Answer**: Short, sharp alert
- **Streak Milestone**: Celebration sound
- **Quiz Perfect**: Victory sound

### Haptic Feedback
- **Light**: Card reviews, button taps
- **Medium**: Page turns, selections
- **Heavy**: Important actions
- **Success**: Correct answers, achievements
- **Warning**: Time running out
- **Error**: Wrong answers

---

## ⚠️ Wichtiger Hinweis

Diese App ist ein **Gamified Learning Tool** für das Studium von Poker-Strategien. Für **echtes GTO-Training** mit Solvern verwenden Sie zusätzlich:

### Empfohlene professionelle Tools:
- **GTO Wizard** ($29-49/mo): Umfassendste Lösung, Hand Trainer, Range Explorer
- **DTO Poker** ($25-40/mo): MTT-fokussiert, Push/Fold Trainer
- **PokerCoaching.com** ($49/mo): Videos + Community

### Warum beide nutzen?
- **Diese App**: Gamified Learning, Spaced Repetition, Unterwegs-Studium, Motivation durch Streaks/XP
- **Professionelle Tools**: Live Hand Training gegen AI, echte Solver-Integration, Hand History Analysis

**Kombination = Maximale Effizienz** 🚀

---

## 🛠️ Technologie-Stack

### Frontend
- **React Native** + **Expo** (Cross-platform: iOS, Android, Web)
- **React Navigation** (Tab + Stack Navigator)
- **React Native Paper** (Material Design 3)
- **React Native Reanimated** (Smooth Animations)

### State & Data
- **AsyncStorage** (Persistent Data: Progress, Settings, Profile)
- **Context API** (Global State für XP, Streaks, Achievements)

### Audio/Haptics
- **Expo AV**: Audio playback
- **Expo Haptics**: Vibration feedback

### Algorithmen
- **SM-2 (SuperMemo 2)**: Spaced Repetition
- **Logarithmic XP Scaling**: RPG-style Level System
- **Loss Aversion Psychology**: Streak Mechanics

---

## 📚 Literatur & Quellen

### Poker-Strategie
- Modern Poker Theory (Acevedo)
- Applications of NLHE (Janda)
- GTO Wizard Research
- Smart Poker Study (KISS Ranges)

### Gamification
- Duolingo's Engagement Research
- Khan Academy's Achievement Systems
- Habitica's Habit-Formation Mechanics

### Spaced Repetition
- SuperMemo Research (Dr. Piotr Wozniak)
- Anki Documentation
- FSRS Algorithm Papers

### UI/UX
- Google Material Design 3
- Apple Human Interface Guidelines
- 2025 Mobile UX Trends (Micro-interactions, Multi-sensory)

---

## 🔜 Roadmap (v3.0)

- [ ] **Dark Mode**: Vollständige Theme-Unterstützung
- [ ] **Hand History Upload**: Analysiere deine gespielten Hände
- [ ] **Leaderboards**: Globale XP & Streak Rankings
- [ ] **Social Features**: Freunde, Challenges, Duels
- [ ] **Advanced Analytics**: Detaillierte Win-Rate Tracking
- [ ] **AI Coach**: Personalisierte Empfehlungen basierend auf Leaks
- [ ] **Voice Interface**: Audio-basierte Quizzes (während dem Autofahren)
- [ ] **AR Mode**: Augmented Reality Flashcards

---

## 🤝 Contributing

Pull Requests willkommen! Besonders für:
- Neue Quiz-Fragen
- Zusätzliche SRS Decks
- Neue Achievements
- Sound Effects
- UI/UX Verbesserungen

---

## 📄 Lizenz

Educational Use Only. Nicht für kommerziellen Gebrauch ohne Genehmigung.

---

## 🎓 Credits

**Poker-Strategie**: GTO Wizard, Smart Poker Study, PokerCoaching
**Gamification**: Duolingo, Khan Academy, Habitica
**Spaced Repetition**: SuperMemo, Anki
**UI/UX**: Google Material Design, Apple HIG
**Research**: Educational Game Design Journals 2024-2025

---

**Built with ❤️ for Poker learners who love data, strategy, and gamified learning.**

**Version 2.0 | Gamified Learning Edition | 2025**

🃏 *"Level Up Your Poker Game"* 🎮
