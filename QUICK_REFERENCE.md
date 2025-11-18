# Poker Training App - Quick Reference Guide

## 🎯 At a Glance

| Aspect | Status | Details |
|--------|--------|---------|
| **Project Type** | ✅ | React Native (Expo) |
| **App Architecture** | ✅ | Tab-based navigation with stack navigators |
| **State Management** | ⚠️ | Local state + AsyncStorage (NO Redux) |
| **Backend/API** | ❌ | None - all data is static/embedded |
| **Database** | ❌ | None - uses device storage only |
| **Tests** | ❌ | Zero test coverage |
| **Analytics** | ❌ | Not implemented |
| **Authentication** | ❌ | No user accounts |

---

## 📁 File Structure Quick Map

```
/src/
├── core/                    # Game Logic Engines
│   ├── gamification.js      (283 lines) - XP, Levels, Achievements, Streaks
│   ├── spacedRepetition.js  (372 lines) - SM-2 Algorithm, Flashcards
│   └── soundManager.js      (200 lines) - Audio & Haptic Feedback
│
├── data/                    # Content Storage (ALL STATIC)
│   ├── pokerRanges.js       (150 lines) - GTO Ranges for 6 positions
│   ├── pushFoldCharts.js    (200+ lines) - MTT Push/Fold Charts
│   ├── exploitativeStrategies.js (150 lines) - 5 Leaks & Exploits
│   ├── trainingPlan.js      (400+ lines) - 40-Hour Training Plan
│   └── miniGames.js         (200+ lines) - Quiz Generators
│
├── components/              # Reusable UI (3 total)
│   ├── XPBar.js             (167 lines) - Level & XP Display
│   ├── StreakFlame.js       (113 lines) - Daily Streak 🔥
│   └── AchievementBadge.js  (180+ lines) - Achievement Modal & List
│
└── screens/                 # Screen Components (8 total)
    ├── HomeScreen.js        (299 lines) - Dashboard & Path Selection
    ├── TrainingPlanScreen.js (359 lines) - 40-Hour Plan Tracker
    ├── RangeTrainerScreen.js (396 lines) - Range Study Tool
    ├── PushFoldScreen.js    (405 lines) - Push/Fold Explorer
    ├── ExploitativeGuideScreen.js (556 lines) - Leak Exploits Guide
    ├── QuizGameScreen.js    (411 lines) - Multiple Choice Quiz
    ├── SpacedRepetitionScreen.js (508 lines) - Flashcard SRS
    └── ProfileScreen.js     (254 lines) - Stats & Settings
```

---

## 🔑 Core Systems Overview

### 1. Gamification Engine (`/src/core/gamification.js`)
**What it does**: Reward system for learning
- **XP Rewards**: 10+ reward types (quiz complete, perfect score, streak milestones)
- **Levels**: 1-10 progression (0 XP → 20,000 XP)
- **Achievements**: 15+ unlockable badges with XP rewards
- **Streaks**: Daily login tracking with fire emoji 🔥
- **Daily Goals**: MIN=50XP, RECOMMENDED=100XP, HARDCORE=200XP

**Key Functions**:
```javascript
calculateLevel(totalXP)           // → { level, progress, xpForNext... }
StreakManager.calculateStreak()   // → days since last activity
StreakManager.isStreakActive()    // → is user still in streak?
```

### 2. Spaced Repetition Engine (`/src/core/spacedRepetition.js`)
**What it does**: Science-based flashcard learning (SM-2 Algorithm)
- **Card Class**: Flashcard with SM-2 properties (EF, interval, nextReview)
- **Deck Class**: Collection of cards with filtering (getDueCards, getNewCards, etc.)
- **StudySession**: Session manager with stats tracking
- **4 Poker Decks**: Pre-made flashcard sets (Ranges, Push/Fold, Exploits, Theory)

**Key Classes**:
```javascript
Card              // Individual flashcard
Deck              // Collection of cards
StudySession      // Session management
createPokerDecks() // Returns 4 pre-made decks
```

### 3. Sound & Haptics Manager (`/src/core/soundManager.js`)
**What it does**: Audio and vibration feedback
- **Sound Events**: 11+ event types (correct, wrong, level-up, etc.)
- **Haptic Levels**: Light, Medium, Heavy, Success, Warning, Error
- **Singleton Pattern**: App-wide audio/haptics manager
- **Settings**: Enable/disable sounds, set volume, enable/disable haptics

**Key Methods**:
```javascript
soundManager.playSound(eventType)
soundManager.triggerHaptic(type)
soundManager.setEnabled(bool)
soundManager.setVolume(0-1)
```

---

## 📊 Content Storage

### All Content is STATIC (No API/Database)

| File | Content Type | Count | Format |
|------|--------------|-------|--------|
| pokerRanges.js | GTO Ranges | 6 positions + 2 3-bet types + 2 cold call types | Objects with hands[] |
| pushFoldCharts.js | Push/Fold Charts | 3 stack sizes × 4 positions + re-shove | Objects with hands[] |
| exploitativeStrategies.js | Leak Exploits | 5 common leaks | Objects with exploit{} |
| trainingPlan.js | Training Plan | 2 paths (Cash/MTT) × 7 days | Objects with modules[] |
| miniGames.js | Quiz Questions | Dynamic generators | Class-based (QuizGenerator) |

**Access Pattern**:
```javascript
// Import static data
import { RFI_RANGES } from './data/pokerRanges';
import { PUSH_FOLD_CHARTS } from './data/pushFoldCharts';

// Use directly in screens/components
const range = RFI_RANGES['UTG'];  // { percentage: '15%', hands: [...] }
```

---

## 🎮 Key Game Mechanics

### XP & Levels
- Earn XP for: Quizzes (10-25 XP), Daily goals (50 XP), Streaks (100-2000 XP)
- **10 Levels**: Novice (1) → Legend (10)
- **Progress**: Exponential XP requirements (1000 XP → Level 5, 20,000 XP → Level 10)

### Daily Streaks
- Tracked by `lastActiveDate`
- Breaks if user doesn't train for 2+ days
- Visual indicator: 🔥 flame with color (gray → orange → red → purple)
- Psychological motivation: "Don't break the chain"

### Achievements
- 15+ unlockable badges (First Steps, Perfect Score, Quiz Master, etc.)
- Each has: id, title, icon, description, xpReward, requirement
- Locked badges show 🔒 (greyed out)

### Spaced Repetition
- **Algorithm**: SM-2 (SuperMemo 2) - gold standard since 1987
- **Quality Ratings**: Again (0), Hard (1), Good (2), Easy (3)
- **Intervals**: 
  - Fail → 0 days (review today)
  - 1st pass → 1 day
  - 2nd pass → 6 days
  - 3rd+ pass → interval × EF (exponential growth)
- **Target**: 90% retention (optimal learning)

---

## 🎨 UI Component Tree

```
App.js
├── TabNavigator
│   ├── HomeScreen
│   │   └── (no components used)
│   │
│   ├── LearnStack
│   │   ├── TrainingPlanScreen
│   │   ├── RangeTrainerScreen
│   │   ├── PushFoldScreen
│   │   └── ExploitativeGuideScreen
│   │
│   ├── PracticeStack
│   │   ├── QuizGameScreen
│   │   └── SpacedRepetitionScreen
│   │
│   └── ProfileScreen
│       ├── XPBar
│       ├── StreakFlame
│       └── AchievementBadge
│           └── AchievementList
│               └── AchievementItem[]
```

---

## 💾 Data Persistence (AsyncStorage)

### Stored Keys

| Key | Data Type | Example |
|-----|-----------|---------|
| `user_profile` | JSON | `{ totalXP: 1250, currentStreak: 5, ... }` |
| `app_settings` | JSON | `{ soundEnabled: true, hapticsEnabled: true }` |
| `progress_CASH_GAME` | JSON | `{ completed: [0,1,2,...] }` |
| `progress_MTT` | JSON | `{ completed: [0,1,...] }` |

### Load/Save Pattern
```javascript
// Load on component mount
useEffect(() => {
  const saved = await AsyncStorage.getItem('user_profile');
  if (saved) setProfile(JSON.parse(saved));
}, []);

// Save on update
const updateProfile = async (newProfile) => {
  setProfile(newProfile);
  await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
};
```

---

## ⚙️ Technology Stack Summary

### Core Dependencies
- **React Native**: 0.72.6 (mobile framework)
- **Expo**: ~49.0.0 (development platform)
- **React Native Paper**: 5.10.0 (Material Design UI)
- **React Navigation**: 6.x (routing)

### Features
- **Audio/Video**: Expo AV (sounds, but currently mocked)
- **Haptics**: Expo Haptics (vibration feedback)
- **Icons**: Material Community Icons
- **Animations**: React Native Animated API
- **Storage**: AsyncStorage (device local storage only)

### Missing (for production)
- ❌ Testing libraries (Jest, Testing Library)
- ❌ API client (Axios, Fetch)
- ❌ Backend (Node, Firebase, etc.)
- ❌ State management library (Redux, Zustand)
- ❌ Analytics (Sentry, Mixpanel)
- ❌ Authentication (Auth0, Firebase Auth)

---

## 🚀 Quick Navigation Reference

### How Data Flows

**Quiz Flow**:
```
QuizGameScreen
  ↓ imports
QuizGenerator.generateMixedQuiz()
  ↓ uses
RFI_RANGES, PUSH_FOLD_CHARTS, COMMON_LEAKS
  ↓ returns
questions[] { question, answers[], correctAnswer, points }
  ↓ user answers
XP awarded (via XP_REWARDS)
soundManager.playSound() triggered
```

**SRS Flow**:
```
SpacedRepetitionScreen
  ↓ imports
createPokerDecks() → Deck[]
  ↓ each Deck contains
Card[] with SM-2 properties
  ↓ StudySession.submitAnswer(rating)
Updates Card.review() with new EF, interval, nextReview
  ↓ stores in
Deck.cards (in memory only, not persisted!)
```

**Profile Flow**:
```
ProfileScreen
  ↓ loads from AsyncStorage
user_profile, app_settings
  ↓ displays via
XPBar (calculateLevel), StreakFlame, AchievementList
  ↓ updates stored in
AsyncStorage when settings toggle
```

---

## 🔴 Critical Gaps

| Gap | Impact | Workaround |
|-----|--------|-----------|
| **No Backend** | Data is local only | Multi-device sync impossible |
| **No Tests** | Unknown code reliability | Manual testing required |
| **No Analytics** | Can't track user behavior | Guessing what features work |
| **No Auth** | No user accounts | Anyone can clear other's data |
| **No CMS** | Content changes require code update | Hard to iterate on content |
| **Static Data** | Fixed at compile time | Must rebuild app for new content |

---

## 📝 File Sizes & Complexity

```
Screens (by lines, largest first):
  ExploitativeGuideScreen.js    556 lines  ⭐⭐⭐ Complex
  SpacedRepetitionScreen.js     508 lines  ⭐⭐⭐ Complex
  TrainingPlanScreen.js         359 lines  ⭐⭐ Medium
  PushFoldScreen.js             405 lines  ⭐⭐ Medium
  RangeTrainerScreen.js         396 lines  ⭐⭐ Medium
  QuizGameScreen.js             411 lines  ⭐⭐ Medium
  HomeScreen.js                 299 lines  ⭐ Simple
  ProfileScreen.js              254 lines  ⭐ Simple

Core Engines (by lines):
  spacedRepetition.js           372 lines  ⭐⭐⭐ Complex
  gamification.js               283 lines  ⭐⭐ Medium
  soundManager.js               200 lines  ⭐ Simple

Components (by lines):
  AchievementBadge.js           180+ lines ⭐⭐ Medium
  XPBar.js                      167 lines  ⭐ Simple
  StreakFlame.js                113 lines  ⭐ Simple

Data (by lines):
  trainingPlan.js               400+ lines (mostly data)
  miniGames.js                  200+ lines
  pushFoldCharts.js             200+ lines
  exploitativeStrategies.js     150 lines
  pokerRanges.js                150 lines

Total Project: ~3,200 lines of code
```

---

## 🎓 Learning Path Recommended for New Dev

1. **Start**: `App.js` - understand navigation structure
2. **Then**: `HomeScreen.js` - simplest screen, good template
3. **Then**: `gamification.js` - understand XP/levels system
4. **Then**: `spacedRepetition.js` - understand SRS engine
5. **Then**: `ProfileScreen.js` - see how state + AsyncStorage work
6. **Then**: Other screens - they follow similar patterns
7. **Finally**: `miniGames.js` - most complex data generation

---

## 🔗 Dependencies Graph

```
App.js
├── HomeScreen (no imports from src/)
├── TrainingPlanScreen
│   └── imports TRAINING_SCHEDULE
├── RangeTrainerScreen
│   └── imports RFI_RANGES, THREE_BET_RANGES, COLD_CALL_RANGES
├── PushFoldScreen
│   └── imports PUSH_FOLD_CHARTS
├── ExploitativeGuideScreen
│   └── imports COMMON_LEAKS
├── QuizGameScreen
│   ├── imports QuizGenerator
│   ├── imports XP_REWARDS
│   ├── imports soundManager
│   └── (mini games use RANGES + PUSH_FOLD + LEAKS data)
├── SpacedRepetitionScreen
│   ├── imports createPokerDecks
│   ├── imports StudySession, Card, Deck
│   ├── imports SOUND_EVENTS
│   └── imports soundManager
└── ProfileScreen
    ├── imports AsyncStorage
    ├── imports ACHIEVEMENTS
    ├── imports XPBar
    ├── imports StreakFlame
    ├── imports AchievementBadge
    └── imports soundManager
```

