# Poker Training App - Comprehensive Codebase Overview

## Executive Summary

This is a React Native Expo app implementing a gamified, science-based poker training system with spaced repetition learning and mini-games. The codebase is well-structured but currently lacks external API integration, test coverage, and analytics. It uses local state management with AsyncStorage for persistence.

---

## 1. PROJECT STRUCTURE - React Native App

### Technology Stack
- **Framework**: React Native (v0.72.6)
- **Development Platform**: Expo (~49.0.0)
- **UI Library**: React Native Paper (v5.10.0)
- **Navigation**: React Navigation (v6.x)
  - Bottom Tab Navigator
  - Stack Navigator (for nested screens)
- **State Management**: React Hooks + AsyncStorage (NO Redux/Context API)
- **Audio/Haptics**: Expo AV (v13.4.1), Expo Haptics (v12.4.0)
- **Storage**: AsyncStorage (v1.18.2) for local persistence
- **Icons**: Material Community Icons

### Folder Structure
```
/home/user/Poker/
├── App.js                              # Main entry point & navigation setup
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
├── babel.config.js                     # Babel configuration
├── assets/                             # App icons & splash screens
│
└── src/
    ├── core/                           # Business Logic Engines
    │   ├── gamification.js             # XP, Levels, Achievements, Streaks
    │   ├── spacedRepetition.js         # SM-2 Algorithm, Card/Deck System
    │   └── soundManager.js             # Sound & Haptic Feedback Manager
    │
    ├── data/                           # Static Content/Questions Storage
    │   ├── pokerRanges.js              # GTO Preflop Ranges (RFI, 3-Bet, Cold Call)
    │   ├── pushFoldCharts.js           # MTT Push/Fold Charts (20bb, 15bb, 10bb)
    │   ├── exploitativeStrategies.js   # Common Leaks & Exploits
    │   ├── trainingPlan.js             # 40-Hour Training Plan (2 Paths)
    │   └── miniGames.js                # Quiz & Drill Generators
    │
    ├── components/                     # Reusable UI Components
    │   ├── XPBar.js                    # Level & XP Progress Display
    │   ├── StreakFlame.js              # Daily Streak Display (🔥)
    │   └── AchievementBadge.js         # Achievement Unlock Modal & List
    │
    └── screens/                        # Screen Components (8 total)
        ├── HomeScreen.js               # Dashboard with path selection
        ├── TrainingPlanScreen.js       # 40-hour plan tracker
        ├── RangeTrainerScreen.js       # Interactive range study tool
        ├── PushFoldScreen.js           # Push/Fold chart explorer
        ├── ExploitativeGuideScreen.js  # Exploit strategies guide
        ├── QuizGameScreen.js           # Interactive quiz game
        ├── SpacedRepetitionScreen.js   # Flashcard SRS system
        └── ProfileScreen.js            # User stats & settings
```

---

## 2. QUESTIONS/CONTENT STORAGE

### Storage Format
**All content is stored as static JavaScript objects** - No database, no APIs currently.

### Content Files & Structure

#### A. Poker Ranges (`/src/data/pokerRanges.js`)
- **POSITIONS**: Position definitions (UTG, MP, CO, BTN, SB, BB)
- **RFI_RANGES**: Raise-First-In ranges for all 6 positions
  - Structure: `RFI_RANGES[POSITION] = { position, percentage, hands[], description }`
  - Example: `RFI_RANGES.UTG = { position: 'UTG', percentage: '15%', hands: ['AA', 'KK', ...], description: '...' }`
- **THREE_BET_RANGES**: Linear & Polarized 3-bet strategies
- **COLD_CALL_RANGES**: In-position vs out-of-position call ranges
- **Lines of Code**: ~150

#### B. Push/Fold Charts (`/src/data/pushFoldCharts.js`)
- **PUSH_FOLD_CHARTS**: Dictionary by stack size (20BB, 15BB, 10BB)
  - Structure: `PUSH_FOLD_CHARTS[STACK_SIZE] = { stackSize, openShove{}, reShove{} }`
  - Each position has: `{ position, range%, hands[], description }`
- Includes both:
  - **openShove**: Ranges for opening from each position
  - **reShove**: Defense ranges vs open-shoves from other positions
- **Lines of Code**: ~200+

#### C. Exploitative Strategies (`/src/data/exploitativeStrategies.js`)
- **COMMON_LEAKS**: Dictionary of 5 major leaks (Limping, Calling Station, Fit-or-Fold, Over-3-Bet Calling, Position Ignorance)
  - Structure: `COMMON_LEAKS[LEAK_NAME] = { leak, frequency, severity, gtoBaseline, exploit{}, recognition[] }`
  - Each leak includes:
    - **exploit**: Specific counter-strategy with sizing & expected win-rate
    - **recognition**: How to identify the leak at the table
- **Lines of Code**: ~150

#### D. Training Plan (`/src/data/trainingPlan.js`)
- **TRAINING_PATHS**: 2 paths (Cash Game & MTT)
  - Path A: 6-Max Cash Game (more complex, higher skill ceiling)
  - Path B: MTT (simpler learning curve)
- **TRAINING_SCHEDULE**: 7-day structured plan (40 hours total)
  - Each day contains modules: drills, videos, live play, reviews
  - Module structure: `{ hours, type, title, description, objectives[], completed }`
  - **Status**: Only Day 1-2 fully implemented (~100 lines shown)

#### E. Mini-Games/Quiz Generator (`/src/data/miniGames.js`)
- **QuizGenerator**: Class that dynamically generates quizzes
  - `generateRangeQuiz(position, difficulty)`: Multiple choice range questions
  - `generatePushFoldQuiz(stackSize, difficulty)`: Push/Fold scenario questions
  - `generateExploitQuiz(difficulty)`: Exploit scenario questions
  - `generateMixedQuiz(count, difficulty)`: Random question mix
- **Deck System**: Integrated with Spaced Repetition for SRS
- **Lines of Code**: ~200+

### Content Organization Summary
- **Total Content Storage**: ~6 files, roughly 800-900 lines of pure data
- **Question Format**: Mostly objects with `question`, `correctAnswer`, `explanation` fields
- **Content Scope**: 
  - 6 poker positions with ranges
  - 3 stack-size push/fold charts
  - 5 exploitable leaks
  - 5+ quiz question generators
  - 40-hour structured learning plan

### ⚠️ LIMITATIONS
- **No dynamic content loading**: All data is hardcoded at compile time
- **No content management system**: Updating content requires code changes
- **No cloud sync**: Changes are local-only
- **Not extensible**: Adding new content requires modifying source files

---

## 3. GAME LOGIC & ENGINES

### A. Gamification Engine (`/src/core/gamification.js`)

#### XP Rewards System
```javascript
XP_REWARDS = {
  DRILL_COMPLETED: 10,           // Basic drill completion
  QUIZ_PERFECT: 25,              // 100% on quiz
  QUIZ_GOOD: 15,                 // 80%+ on quiz
  DAILY_GOAL_REACHED: 50,        // Daily goal achievement
  STREAK_MILESTONE_7: 100,       // 7-day streak
  STREAK_MILESTONE_30: 500,      // 30-day streak
  // ... 10+ more reward types
}
```

#### Level System
- **10 Levels** (1-10): Poker Novice → Legend
- **Logarithmic progression**: XP required increases exponentially
  - Level 1: 0 XP
  - Level 5: 1000 XP
  - Level 10: 20,000 XP
- **Algorithm**: `calculateLevel(totalXP)` → returns current level, progress to next, etc.

#### Achievement System (15+ Badges)
- **Categories**: Learning, Streaks, Quizzes, Ranges, Speed, Exploits
- **Structure**: `ACHIEVEMENTS[NAME] = { id, title, icon, xpReward, requirement }`
- **Examples**:
  - FIRST_STEPS: Complete 1 training session
  - PERFECT_SCORE: Get 100% on a quiz
  - MONTH_MASTER: 30-day streak
  - QUIZ_MASTER: 5 consecutive perfect quizzes

#### Streak Manager (`StreakManager` class)
- **`calculateStreak(lastActiveDate)`**: Days since last activity
- **`isStreakActive(lastActiveDate)`**: Check if streak is active (yesterday or today)
- **`getStreakStatus(count)`**: Return emoji & status message based on streak length
- **`getStreakColor(count)`**: Return color based on streak (gray → red → purple)
- **Streak Loss Aversion**: Fire 🔥 emoji for 3+ days creates psychological motivation

#### Daily Goals
```javascript
DAILY_GOALS = {
  MIN_XP: 50,           // Minimum to count as "day trained"
  RECOMMENDED_XP: 100,  // Standard daily goal
  HARDCORE_XP: 200,     // Advanced users
}
```

---

### B. Spaced Repetition Engine (`/src/core/spacedRepetition.js`)

#### SM-2 Algorithm Implementation
- **Gold Standard** for flashcard learning (SuperMemo 2)
- **Target Retention**: ~90% (scientifically optimal)
- **Formula**: EF' = EF + (0.1 - (3-q) × (0.08 + (3-q) × 0.02))
  - Where q = quality rating (0-3)
  - EF = Easiness Factor (min 1.3, start 2.5)

#### Card Class
```javascript
Card {
  id, front, back, category, tags
  
  // SM-2 Properties
  n: number                    // Repetition count
  ef: number                   // Easiness Factor
  interval: number             // Days until next review
  nextReview: Date             // Timestamp of next review
  lastReviewed: Date
  
  // Stats
  totalReviews, correctReviews, streakCorrect
  
  // Methods
  review(quality: 0-3)         // Update card based on performance
  isDue(date)                  // Check if card needs review
  getRetentionRate()           // Accuracy percentage
}
```

#### Difficulty Ratings
```javascript
DIFFICULTY_RATINGS = {
  AGAIN: 0,    // Incorrect → reset to learning
  HARD: 1,     // Difficult → smaller interval
  GOOD: 2,     // Good → normal interval
  EASY: 3,     // Easy → larger interval
}
```

#### Interval Progression
- **After AGAIN (fail)**: Reset to 0 days (review today)
- **After first GOOD**: 1 day
- **After second GOOD**: 6 days
- **After third+ GOOD**: interval = interval × EF (exponential growth)

#### Deck Class
- **getDueCards()**: Cards ready for review
- **getNewCards()**: Cards never studied
- **getLearningCards()**: Cards in learning phase (n < 2)
- **getStats()**: Returns total, due, new, learning, mastered count + avg retention

#### Poker Decks (`createPokerDecks()`)
4 pre-made decks for poker study:
1. **Preflop Ranges (6-Max)**: RFI, 3-Bet, cold call ranges
2. **Push/Fold Charts (MTT)**: Short-stack ranges for different stack sizes
3. **Exploitative Strategies**: Common leaks and counter-strategies
4. **Concepts & Theory**: Fundamental poker concepts (10x rule, blockers, ICM)

Each deck has 10-20 example flashcards pre-populated.

#### StudySession Class
```javascript
StudySession {
  deck: Deck
  newCardsPerSession: 10
  reviewsPerSession: 20
  cardsToday: Card[]
  
  // Session tracking
  sessionStats = {
    newCards: 0,
    reviews: 0,
    correct: 0,
    startTime: Date
  }
  
  // Methods
  startSession()              // Prepare cards for study
  getCurrentCard()            // Get current card
  submitAnswer(quality: 0-3)  // Process answer & move to next
  getSessionSummary()         // Stats with duration & accuracy
}
```

---

### C. Sound & Haptic Manager (`/src/core/soundManager.js`)

#### Sound Events
```javascript
SOUND_EVENTS = {
  // Success
  XP_GAINED, LEVEL_UP, ACHIEVEMENT_UNLOCKED, QUIZ_PERFECT,
  CORRECT_ANSWER, STREAK_MILESTONE,
  
  // Neutral
  CARD_FLIP, BUTTON_TAP, PAGE_TURN,
  
  // Negative
  WRONG_ANSWER, STREAK_BROKEN,
  
  // Ambience
  SESSION_START, SESSION_COMPLETE
}
```

#### Haptic Feedback Levels
```javascript
HAPTIC_FEEDBACK = {
  LIGHT:    Haptics.ImpactFeedbackStyle.Light,
  MEDIUM:   Haptics.ImpactFeedbackStyle.Medium,
  HEAVY:    Haptics.ImpactFeedbackStyle.Heavy,
  SUCCESS:  Haptics.NotificationFeedbackType.Success,
  WARNING:  Haptics.NotificationFeedbackType.Warning,
  ERROR:    Haptics.NotificationFeedbackType.Error
}
```

#### SoundManager Class
- **Singleton pattern** for app-wide audio/haptics
- **Mock implementation**: Currently logs events (actual audio files not loaded)
- **Feature-rich**:
  - Sound enabled/disabled toggle
  - Volume control (0-1)
  - Haptics enable/disable
  - Auto-trigger haptics based on sound type

#### Helper Functions
- `playSuccessSound()`, `playErrorSound()`, `playXPSound()`, `playLevelUpSound()`
- `hapticLight()`, `hapticSuccess()`, `hapticError()`

---

## 4. STATE MANAGEMENT

### Architecture
**No Redux, no Context API** - Uses local component state with AsyncStorage for persistence.

### Storage Keys (AsyncStorage)
```javascript
// Profile Data
'user_profile' → {
  totalXP: number,
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: Date,
  totalSessions: number,
  perfectQuizzes: number,
  unlockedAchievements: string[]
}

// App Settings
'app_settings' → {
  soundEnabled: boolean,
  hapticsEnabled: boolean,
  darkMode: boolean
}

// Training Progress
'progress_CASH_GAME' → { completed: number[] }
'progress_MTT' → { completed: number[] }
```

### State Flow
1. **Components** maintain local state with `useState()`
2. **User actions** trigger state updates
3. **AsyncStorage.setItem()** persists changes to device
4. **On app launch**, `AsyncStorage.getItem()` restores persisted state
5. **No server sync** - changes don't propagate beyond device

### ⚠️ LIMITATIONS
- **No multi-device sync**: Data is device-local only
- **No conflict resolution**: Last-write-wins if same key modified elsewhere
- **No real-time updates**: Manual refresh required after external changes
- **No data validation**: No schema enforcement
- **Scalability**: AsyncStorage has size limits (~5-10MB per app)

---

## 5. UI COMPONENT ORGANIZATION

### Framework: React Native Paper + Custom Components

### Reusable Components (3 total, in `/src/components/`)

#### 1. XPBar Component (`XPBar.js` - 167 lines)
**Purpose**: Display level, XP progress bar, and XP remaining

**Props**:
```javascript
{
  totalXP: number,
  showDetails?: boolean,   // Show level name & XP info
  compact?: boolean        // Minimal inline version
}
```

**Features**:
- Animated progress bar (using React Native Animated)
- Shows current level name & icon (emoji)
- Displays XP/XP needed format
- Two modes: detailed card or compact inline
- Gold-colored progress bar (#ffd700)

#### 2. StreakFlame Component (`StreakFlame.js` - 113 lines)
**Purpose**: Display daily training streak with visual feedback

**Props**:
```javascript
{
  currentStreak: number,
  lastActiveDate: Date
}
```

**Features**:
- Flame emoji (🔥) that changes intensity with streak length
- Color-coded by streak duration (gray → orange → red → purple)
- Status message based on streak ("Heiß!" "Stark!" "Unaufhaltsam!")
- Last active date display
- Encourages daily login through visual gamification

#### 3. AchievementBadge Component (`AchievementBadge.js` - 180+ lines)
**Purpose**: Achievement unlock modal + achievement list display

**Sub-components**:
- `AchievementUnlocked`: Modal that pops up when achievement earned
  - Animated scale-in effect
  - Shows badge icon, title, description
  - Displays XP reward
  - Triggers happy sound/haptics
  
- `AchievementList`: Grid/list of all achievements
  - Shows unlocked vs locked (🔒)
  - Color coding (gray for locked)
  - XP reward indicator

### Screen Components (8 total, in `/src/screens/`)

#### 1. HomeScreen (299 lines)
**Purpose**: Main dashboard & training path selection

**Structure**:
- Welcome card with app title & description
- Two training path cards (Cash Game vs MTT)
  - Difficulty indicator
  - Target win-rate
  - Key focus areas
  - "Start Path" button
- Quick access buttons (Range Trainer, Push/Fold, Exploits)
- Educational note about external tools (GTO Wizard, DTO Poker)

**No state management** - just navigation

#### 2. ProfileScreen (254 lines)
**Purpose**: User stats, achievements, settings

**State**:
```javascript
profile: {
  totalXP, currentStreak, longestStreak, lastActiveDate,
  totalSessions, perfectQuizzes, unlockedAchievements
}
settings: { soundEnabled, hapticsEnabled, darkMode }
```

**Sections**:
- XPBar display (full details)
- StreakFlame display
- Stats grid (4 metrics)
- Achievements list with unlock count
- Settings toggles (Sound, Haptics, Dark Mode)

**Persistence**: Loads/saves both profile & settings via AsyncStorage

#### 3. TrainingPlanScreen (359 lines)
**Purpose**: 40-hour structured training plan tracker

**State**:
```javascript
selectedPath: 'CASH_GAME' | 'MTT'
completedModules: number[]
expandedDays: Set<number>
```

**Features**:
- Path selector (tab view)
- Accordion-style days (expandable)
- Each day shows total hours & modules
- Module progress (checkbox or completed indicator)
- Save progress via AsyncStorage
- Reset button to clear progress

**Data Source**: `TRAINING_SCHEDULE` from trainingPlan.js

#### 4. RangeTrainerScreen (396 lines)
**Purpose**: Interactive study tool for GTO ranges

**State**:
```javascript
selectedCategory: 'RFI' | '3BET' | 'COLD_CALL'
selectedPosition: 'UTG' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB'
showHands: boolean
```

**Features**:
- Category selector (tabs or buttons)
- Position selector (grid of buttons)
- Range display card with percentage & description
- Toggle to show/hide hand list
- Hand chips with styling
- Interactive position selection

**Data Source**: `RFI_RANGES`, `THREE_BET_RANGES`, `COLD_CALL_RANGES`

#### 5. PushFoldScreen (405 lines)
**Purpose**: Push/fold chart explorer for MTT short stack play

**State**:
```javascript
selectedStackSize: '20BB' | '15BB' | '10BB'
selectedType: 'OPEN_SHOVE' | 'RESHOVE'
selectedPosition: string
showHands: boolean
```

**Features**:
- Stack size selector (3 options)
- Scenario type selector (Open-Shove vs Re-Shove)
- Position selector (buttons grid)
- Hands display (toggleable)
- Range percentage & description

**Data Source**: `PUSH_FOLD_CHARTS`

#### 6. ExploitativeGuideScreen (556 lines - LARGEST)
**Purpose**: Guide to exploiting common player leaks

**Features**:
- Leak selector (5 tabs for each leak type)
- For each leak:
  - Leak description & frequency
  - Severity level
  - Recognition (how to spot it)
  - GTO baseline
  - Specific exploit with:
    - Action & sizing
    - Hand ranges
    - Expected win-rate
- Detailed explanations & examples

**Data Source**: `COMMON_LEAKS` from exploitativeStrategies.js

#### 7. QuizGameScreen (411 lines)
**Purpose**: Interactive multiple-choice quiz game

**State**:
```javascript
quiz: Question[]
currentIndex: number
selectedAnswer: string | null
showFeedback: boolean
score: number
totalXP: number
isComplete: boolean
```

**Features**:
- Dynamic quiz generation (via QuizGenerator)
- Multiple choice (4 options per question)
- Answer feedback (✓ or ✗) with sound
- Progress bar
- XP reward per question
- Results summary with:
  - Accuracy percentage
  - Score (N/Total)
  - Total XP earned
  - Perfect score bonus
- Restart button to run quiz again

**Gamification**:
- Correct answers → happy sound + haptic feedback + XP
- Perfect quiz → bonus XP
- Immediate feedback reinforcement

#### 8. SpacedRepetitionScreen (508 lines - SECOND LARGEST)
**Purpose**: Flashcard learning with SM-2 algorithm

**State**:
```javascript
decks: Deck[]
selectedDeck: Deck | null
session: StudySession | null
currentCard: Card | null
showAnswer: boolean
sessionStats: SessionSummary | null
```

**Features**:
- **Deck selection screen**: Shows all 4 poker decks
  - Deck stats (Total, Due, New, Learning, Mastered)
  - Progress bar per deck
  - Start button to begin session

- **Study screen** (during active session):
  - Animated card flip (3D effect)
  - Front: Question
  - Back: Answer (revealed on flip)
  - Difficulty rating buttons (Again, Hard, Good, Easy)
  - Progress indicator (card N of M)

- **Results screen** (after session):
  - Session duration & accuracy
  - Total cards studied
  - New cards added
  - Cards reviewed
  - Session summary stats

**Data Source**: `createPokerDecks()` returns 4 pre-configured decks

### Component Dependencies

```
App.js (Main Navigation)
├── HomeScreen
│   └── References: TRAINING_PATHS (static)
│
├── TabNavigator > LearnStack
│   ├── TrainingPlanScreen
│   │   ├── Uses: TRAINING_SCHEDULE
│   │   └── Stores: progress_{PATH}
│   ├── RangeTrainerScreen
│   │   └── Uses: RFI_RANGES, THREE_BET_RANGES, COLD_CALL_RANGES
│   ├── PushFoldScreen
│   │   └── Uses: PUSH_FOLD_CHARTS
│   └── ExploitativeGuideScreen
│       └── Uses: COMMON_LEAKS
│
├── TabNavigator > PracticeStack
│   ├── QuizGameScreen
│   │   ├── Uses: QuizGenerator (from miniGames)
│   │   ├── Uses: SOUND_EVENTS, XP_REWARDS
│   │   └── Uses: soundManager
│   └── SpacedRepetitionScreen
│       ├── Uses: createPokerDecks() (from spacedRepetition)
│       ├── Uses: SOUND_EVENTS, XP_REWARDS
│       └── Uses: soundManager
│
└── TabNavigator > ProfileScreen
    ├── Uses: ACHIEVEMENTS (from gamification)
    ├── Uses: XPBar, StreakFlame, AchievementList (components)
    ├── Uses: soundManager
    └── Stores: user_profile, app_settings

Component Usage:
├── XPBar: ProfileScreen, (HomeScreen in future)
├── StreakFlame: ProfileScreen
└── AchievementBadge: ProfileScreen
    └── AchievementUnlocked: (triggered from multiple screens)
```

---

## 6. API & SERVICE LAYERS

### Current Status: ❌ NO API INTEGRATION

### What Exists
- **Sound Manager**: Service singleton for audio/haptic management
- **Gamification**: Static utility functions (not a service, just calculations)
- **Spaced Repetition**: Class-based but fully local

### What's Missing
- **HTTP Client**: No axios, fetch, or REST client configured
- **Backend API**: No server endpoints defined or used
- **Cloud Sync**: No backend persistence
- **Authentication**: No user login/account system
- **Analytics Server**: No data collection endpoint
- **External Data Sources**: All data is static/embedded

### Storage URLs Found
Only 2 URLs in entire codebase:
```javascript
// In trainingPlan.js (external resources, not API calls)
url: 'https://gtowizard.com',
url: 'https://dtopoker.com',
url: 'https://pokercoaching.com',
```

These are just references to external learning tools, not actual API calls.

### AsyncStorage Usage (Client-Side Only)
```javascript
// ProfileScreen.js
await AsyncStorage.getItem('user_profile')
await AsyncStorage.setItem('user_profile', JSON.stringify(data))

// TrainingPlanScreen.js
await AsyncStorage.getItem(`progress_${selectedPath}`)
await AsyncStorage.setItem(`progress_${selectedPath}`, ...)

// App Settings
await AsyncStorage.getItem('app_settings')
await AsyncStorage.setItem('app_settings', ...)
```

### ⚠️ CRITICAL GAPS FOR PRODUCTION
1. **No authentication**: Anyone can access any user's data
2. **No data backup**: Data loss = permanent deletion
3. **No server validation**: Client can manipulate any data
4. **No content updates**: New content requires app update
5. **No analytics**: No usage tracking or error reporting
6. **No user accounts**: Cannot sync across devices

---

## 7. ANALYTICS & DASHBOARD

### Current Status: ❌ NOT IMPLEMENTED

### What Could Be Tracked
Based on gamification system, these metrics exist locally:
```javascript
User Profile:
  - totalXP: number
  - currentStreak: number
  - longestStreak: number
  - lastActiveDate: Date
  - totalSessions: number
  - perfectQuizzes: number
  - unlockedAchievements: string[]

Session Stats:
  - duration: minutes
  - accuracy: percentage
  - newCards: number
  - reviews: number
  - correct: number
  - startTime & endTime: Date

Card Stats:
  - totalReviews: number
  - correctReviews: number
  - streakCorrect: number
  - retention: percentage
```

### What's NOT Tracked
- Question/quiz-level analytics (which questions users struggle with)
- Time spent per topic
- Completion rates
- Drop-off points
- Feature usage metrics
- Error/crash logs
- User demographics
- A/B testing data

### Dashboard Implementation
**Zero dashboard code exists.** ProfileScreen shows some stats but:
- Only displays current session stats
- No historical trends
- No data visualization (charts/graphs)
- No filtering or date ranges

---

## 8. TEST INFRASTRUCTURE

### Current Status: ❌ NO TESTS EXIST

### What's Missing
- **No Jest configuration**
- **No Mocha/Chai setup**
- **No test files** (*.test.js or *.spec.js)
- **No test utilities** (render, fireEvent, etc.)
- **No CI/CD pipeline** (no GitHub Actions, etc.)

### What Should Be Tested

#### Unit Tests Needed
1. **Gamification Engine**
   - `calculateLevel()`: XP to level conversion
   - `StreakManager.calculateStreak()`: Streak calculation
   - `StreakManager.isStreakActive()`: Streak validation
   - Achievement unlock logic

2. **Spaced Repetition**
   - `Card.review()`: SM-2 algorithm calculation
   - EF (Easiness Factor) updates
   - Interval calculation
   - `Deck.getDueCards()`: Card filtering
   - `StudySession.submitAnswer()`: Session state management

3. **Sound Manager**
   - Haptic feedback triggering
   - Volume controls
   - Setting persistence

#### Integration Tests Needed
1. Quiz game flow: Generate → Answer → Score → Results
2. SRS session: Load deck → Flip cards → Submit ratings → Summary
3. Training plan: Load → Mark modules → Save progress
4. ProfileScreen: Load data → Update settings → Persist

#### E2E Tests Needed
1. Full training session workflow
2. Achievement unlock flow
3. Multi-screen navigation
4. Data persistence across app restarts

---

## DEPENDENCY ANALYSIS

### Core Dependencies
```json
{
  "expo": "~49.0.0",                          // React Native framework
  "react": "18.2.0",                          // UI library
  "react-native": "0.72.6",                   // Native bindings
  "react-native-paper": "^5.10.0",           // Material Design UI
  
  "expo-av": "~13.4.1",                       // Audio/Video (for sounds)
  "expo-haptics": "~12.4.0",                  // Haptic feedback
  "expo-status-bar": "~1.6.0",                // Status bar styling
  
  "@react-navigation/native": "^6.1.7",      // Core navigation
  "@react-navigation/bottom-tabs": "^6.5.8", // Tab navigation
  "@react-navigation/stack": "^6.3.17",      // Stack navigation
  
  "react-native-safe-area-context": "4.6.3", // Safe area handling
  "react-native-screens": "~3.22.0",          // Native screen support
  "react-native-gesture-handler": "~2.12.0", // Gesture recognition
  "react-native-reanimated": "~3.3.0",       // Animation library
  
  "react-native-vector-icons": "^10.0.0",    // Material icons
  "@react-native-async-storage/async-storage": "1.18.2" // Local storage
}
```

### Missing Dependencies for Production
- **Testing**: jest, @testing-library/react-native
- **Linting**: eslint, prettier
- **API Client**: axios or react-native-fetch
- **State Management**: Redux, Zustand, or Jotai (if adding backend)
- **Error Tracking**: Sentry
- **Analytics**: Segment, Mixpanel, Firebase
- **Environment Management**: react-native-config
- **Secure Storage**: react-native-keychain

---

## ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.js (Navigation)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         TabNavigator (Bottom Tab Navigation)             │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                 │   │
│  │  │Home  │  │Learn │  │Practice│ │Profile│               │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ↓              ↓            ↓            ↓               │
└─────────────────────────────────────────────────────────────────┘
         │              │             │             │
    ┌────┴──────┐  ┌────┴────────┬───┴────┬───────┤
    │            │  │             │        │       │
    │        TrainingPlan    RangeTrainer │       └─ ProfileScreen
    │        PushFold        Exploits     │        (XPBar, StreakFlame,
    │                                     │         Achievements)
    │                        QuizGame
    │                        SpacedRep

┌─────────────────────────────────────────────────────────────────┐
│                       Core Engines (Business Logic)              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Gamification     │  │ SpacedRepetition │  │ SoundManager │  │
│  │ ├─ calculateLevel│  │ ├─ Card class    │  │ ├─ playSound │  │
│  │ ├─ ACHIEVEMENTS  │  │ ├─ Deck class    │  │ ├─ Haptics   │  │
│  │ ├─ StreakManager │  │ ├─ StudySession  │  │ └─ Settings  │  │
│  │ └─ XP_REWARDS    │  │ └─ SM-2 Algorithm│  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↑                  ↑                         ↑
         │                  │                         │
┌─────────────────────────────────────────────────────────────────┐
│                     Static Data Files                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐          │
│  │ pokerRanges │  │pushFoldCharts│  │exploitativeStrat│         │
│  └─────────────┘  └─────────────┘  └─────────────────┘          │
│       ↑                  ↑                    ↑                   │
│  ┌─────────────┐  ┌──────────────────┐                           │
│  │trainingPlan │  │ miniGames (Quiz)  │                          │
│  └─────────────┘  └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Data Persistence Layer                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            AsyncStorage (Device Local Storage)              │ │
│  │  Keys: user_profile, app_settings, progress_{PATH}          │ │
│  │  ✗ NO BACKEND SYNC  ✗ NO CLOUD BACKUP                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## KEY INSIGHTS FOR IMPLEMENTATION

### Strengths
✅ Well-organized folder structure
✅ Clear separation of concerns (core, data, screens, components)
✅ Gamification system fully implemented
✅ Spaced Repetition engine with proper SM-2 algorithm
✅ Sound/haptics system in place
✅ Multiple poker strategy guides (ranges, push/fold, exploits)
✅ Interactive quiz and flashcard systems
✅ Responsive UI with animations

### Weaknesses
❌ No API layer or backend integration
❌ No test coverage
❌ No analytics or tracking
❌ No state management library (monolithic AsyncStorage)
❌ No authentication/user accounts
❌ Static content (no CMS)
❌ No error handling or logging
❌ No data validation
❌ Limited scalability for multi-device use
❌ No documentation (code comments sparse)

### Recommended Next Steps
1. **Add API layer**: Create services directory with HTTP client
2. **Implement testing**: Jest + React Testing Library
3. **Add backend**: Node/Express or Firebase for user accounts & sync
4. **State management**: Consider Redux/Zustand if complexity grows
5. **Analytics**: Integrate Sentry + custom event tracking
6. **CMS/Admin**: Content management system for updating questions
7. **Documentation**: Add JSDoc comments to all functions
8. **Error handling**: Try-catch blocks + error boundary components

