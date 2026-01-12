# Poker Training App - Developer Guide

## Overview

This React Native Expo application provides a gamified poker training platform with spaced repetition, adaptive learning, and comprehensive analytics.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: JavaScript
- **Storage**: AsyncStorage (@react-native-async-storage/async-storage)
- **Charts**: react-native-chart-kit
- **Navigation**: React Navigation
- **File Upload**: expo-document-picker
- **Testing**: Jest

## Project Structure

```
/Poker
├── src/
│   ├── core/              # Core systems
│   │   ├── gamification.js        # XP, levels, achievements
│   │   ├── spacedRepetition.js   # SM-2 algorithm
│   │   ├── adaptiveEngine.js     # Difficulty adjustment
│   │   └── soundManager.js       # Audio feedback
│   ├── data/              # Static content
│   │   ├── pokerRanges.js
│   │   ├── pushFoldCharts.js
│   │   ├── exploitativeStrategies.js
│   │   ├── ploQuestions.js       # NEW: 25 PLO questions
│   │   ├── nlheMttQuestions.js   # NEW: 67 MTT questions
│   │   ├── miniGames.js
│   │   └── trainingPlan.js
│   ├── screens/           # UI screens
│   │   ├── HomeScreen.js
│   │   ├── QuizGameScreen.js
│   │   ├── SpacedRepetitionScreen.js
│   │   ├── PLOTrainingScreen.js      # NEW
│   │   ├── HandHistoryScreen.js      # NEW
│   │   ├── AnalyticsScreen.js        # NEW: Enhanced
│   │   ├── OnboardingScreen.js       # NEW
│   │   └── ...
│   ├── components/        # Reusable components
│   │   ├── XPBar.js
│   │   ├── StreakFlame.js
│   │   └── AchievementBadge.js
│   └── services/          # API & services
│       ├── apiClient.js          # NEW: API layer
│       └── syncService.js        # NEW: Cloud sync
├── __tests__/             # Unit tests
│   ├── gamification.test.js      # NEW
│   ├── spacedRepetition.test.js  # NEW
│   └── adaptiveEngine.test.js    # NEW
├── docs/                  # Documentation
│   ├── USER_GUIDE.md             # NEW
│   └── DEVELOPER_GUIDE.md        # NEW
├── App.js                 # Root component
├── app.json              # Expo config
└── package.json          # Dependencies
```

## Core Systems

### 1. Gamification System

**File**: `src/core/gamification.js`

**Key Classes**:
- `calculateLevel(totalXP)`: Converts XP to level
- `StreakManager`: Handles daily streaks
- `AchievementManager`: Tracks and unlocks achievements
- `MilestoneTracker`: Manages XP/question milestones

**XP Rewards**:
```javascript
XP_REWARDS = {
  QUIZ_PERFECT: 25,
  QUIZ_GOOD: 15,
  QUIZ_COMPLETED: 10,
  DAILY_GOAL_REACHED: 50,
  STREAK_MILESTONE_7: 100,
  // ... more
}
```

**Levels**:
- Logarithmic progression (1 → 10)
- Each level requires ~2x previous level's XP
- Level 10 = 20,000 XP total

**Adding New Achievements**:
```javascript
// In gamification.js
export const ACHIEVEMENTS = {
  YOUR_NEW_ACHIEVEMENT: {
    id: 'your_achievement_id',
    title: 'Achievement Title',
    description: 'What user must do',
    icon: '🏆',
    xpReward: 100,
    requirement: {
      type: 'custom_stat',
      count: 10,
    },
  },
};
```

### 2. Spaced Repetition System (SRS)

**File**: `src/core/spacedRepetition.js`

**Algorithm**: SM-2 (SuperMemo 2)

**Key Classes**:
- `Card`: Individual flashcard with SM-2 properties
- `Deck`: Collection of cards
- `StudySession`: Manages study sessions

**SM-2 Properties**:
- `n`: Repetition count
- `ef`: Easiness Factor (1.3 - 3.0)
- `interval`: Days until next review
- `nextReview`: Scheduled review date

**Review Quality Scale**:
```javascript
DIFFICULTY_RATINGS = {
  AGAIN: 0,  // Failed - reset
  HARD: 1,   // Difficult - shorter interval
  GOOD: 2,   // Normal - standard interval
  EASY: 3,   // Easy - longer interval
}
```

**Creating New Decks**:
```javascript
const deck = new Deck('Deck Name', 'Description');

const card = new Card(
  'unique_id',
  'Question text',
  'Answer text',
  'category',
  ['tag1', 'tag2']
);

deck.addCard(card);
```

### 3. Adaptive Learning Engine

**File**: `src/core/adaptiveEngine.js`

**Key Classes**:
- `PerformanceTracker`: Records and analyzes user performance
- `AdaptiveEngine`: Adjusts difficulty dynamically
- `AdaptiveSRSIntegration`: Combines SRS with adaptive learning

**Difficulty Levels**:
```javascript
DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
}
```

**How It Works**:
1. Tracks last 100 answers
2. Calculates recent accuracy (last 10)
3. Calculates learning velocity (improvement rate)
4. Adjusts difficulty based on:
   - Accuracy > 85% → Increase difficulty
   - Accuracy < 50% → Decrease difficulty
   - Otherwise → Maintain difficulty

**Using the Adaptive Engine**:
```javascript
import { PerformanceTracker, AdaptiveEngine } from './adaptiveEngine';

const tracker = new PerformanceTracker();
const engine = new AdaptiveEngine(tracker);

// Record answer
tracker.recordAnswer(questionId, correct, timeSpent, difficulty);

// Get recommendation
const nextDifficulty = engine.getRecommendedDifficulty();

// Get learning path
const path = engine.getPersonalizedLearningPath();
```

### 4. API Client Service

**File**: `src/services/apiClient.js`

**Features**:
- Authentication (register, login, logout)
- Token refresh
- Data sync
- Hand history upload
- Analytics tracking

**Usage**:
```javascript
import apiClient from './services/apiClient';

// Login
const result = await apiClient.login(email, password);

// Sync progress
await apiClient.syncProgressToCloud(progressData);

// Upload hand history
await apiClient.uploadHandHistory(file, 'pokerstars');

// Track event
await apiClient.trackEvent('quiz_completed', { score: 85 });
```

**Configuration**:
```javascript
// Set base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.pokertraining.app';
```

### 5. Sync Service

**File**: `src/services/syncService.js`

**Features**:
- Automatic background sync
- Conflict resolution
- Offline-first architecture
- Pending changes queue

**Usage**:
```javascript
import syncService from './services/syncService';

// Initialize
await syncService.initialize();

// Enable auto-sync (every 15 minutes)
await syncService.enableAutoSync(15);

// Manual sync
const result = await syncService.forceSyncNow();

// Queue item for sync
await syncService.queueForSync('user_progress', progressData);
```

**Conflict Resolution**:
- Achievements: Union (merge both)
- Progress: Latest timestamp wins
- Default: Server wins

## Data Structures

### User Progress
```javascript
{
  totalXP: 1500,
  level: 5,
  currentStreak: 7,
  longestStreak: 15,
  sessionsCompleted: 42,
  questionsAnswered: 350,
  perfectQuizzes: 15,
  lastActiveDate: '2025-01-15',
  dailyGoal: 100,
  // ... more stats
}
```

### SRS Card
```javascript
{
  id: 'card_123',
  front: 'Question',
  back: 'Answer',
  category: 'ranges',
  tags: ['rfi', 'utg'],
  n: 3,              // Repetitions
  ef: 2.5,           // Easiness Factor
  interval: 15,      // Days
  nextReview: Date,
  totalReviews: 10,
  correctReviews: 8,
  streakCorrect: 3,
}
```

### Quiz Question
```javascript
{
  id: 'q_456',
  category: 'mtt_bubble',
  difficulty: 'hard',
  question: 'Question text...',
  answers: ['A', 'B', 'C', 'D'],
  correctAnswer: 'B',
  explanation: 'Detailed explanation...',
  points: 20,
}
```

## Adding New Content

### Adding Questions

1. **Create or edit data file** (`src/data/yourQuestions.js`):
```javascript
export const YOUR_QUESTIONS = [
  {
    id: 'unique_id',
    category: 'category_name',
    difficulty: 'medium',
    question: 'Your question?',
    answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 'Option 2',
    explanation: 'Why this is correct...',
    points: 15,
  },
  // ... more questions
];
```

2. **Import in relevant screen**:
```javascript
import { YOUR_QUESTIONS } from '../data/yourQuestions';
```

### Adding Screens

1. **Create screen file** (`src/screens/YourScreen.js`):
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function YourScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Your Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
```

2. **Add to navigation** (in `App.js` or navigation config):
```javascript
<Stack.Screen name="YourScreen" component={YourScreen} />
```

### Adding Achievements

1. **Define in gamification.js**:
```javascript
YOUR_ACHIEVEMENT: {
  id: 'your_achievement',
  title: 'Title',
  description: 'Description',
  icon: '🏆',
  xpReward: 100,
  requirement: { type: 'stat_name', count: 10 },
}
```

2. **Update AchievementManager.checkRequirement()** if using new stat type

3. **Track stat in relevant screens**:
```javascript
// Update user stats
stats.yourCustomStat++;

// Check achievements
const unlocked = achievementManager.checkAchievements(stats);
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test gamification.test.js

# Watch mode
npm test -- --watch
```

### Writing Tests

**Example Test**:
```javascript
import { calculateLevel } from '../src/core/gamification';

describe('Gamification', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
    });

    it('should calculate correct level', () => {
      const result = calculateLevel(1000);
      expect(result.level).toBe(5);
    });
  });
});
```

### Test Coverage Goals

- Core systems: >90%
- Utilities: >80%
- UI components: >60%
- Screens: >50%

## Analytics & Tracking

### Tracking Events

```javascript
import apiClient from './services/apiClient';

// Track user action
await apiClient.trackEvent('quiz_started', {
  category: 'ranges',
  difficulty: 'medium',
});

// Track performance
await apiClient.trackEvent('quiz_completed', {
  score: 85,
  time: 120, // seconds
  accuracy: 0.85,
});
```

### Analytics Dashboard

**File**: `src/screens/AnalyticsScreen.js`

**Charts Available**:
- Line Chart: XP progress, accuracy trends
- Bar Chart: Questions by difficulty
- Pie Chart: Performance by category

**Adding New Chart**:
```javascript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [{ data: [10, 15, 20] }],
  }}
  width={screenWidth - 40}
  height={220}
  chartConfig={chartConfig}
/>
```

## Performance Optimization

### Best Practices

1. **Use React.memo for expensive components**:
```javascript
export default React.memo(YourComponent);
```

2. **Lazy load large data files**:
```javascript
const questions = React.useMemo(() => {
  return require('../data/largeQuestionSet').default;
}, []);
```

3. **Virtualize long lists**:
```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

4. **Debounce expensive operations**:
```javascript
const debouncedSave = React.useCallback(
  debounce((data) => saveToStorage(data), 500),
  []
);
```

## Debugging

### Common Issues

**1. AsyncStorage not working**:
```javascript
// Check if data exists
const data = await AsyncStorage.getItem('key');
console.log('Stored data:', data);

// Clear storage if corrupted
await AsyncStorage.clear();
```

**2. Navigation not working**:
```javascript
// Ensure screen is registered
<Stack.Screen name="ScreenName" component={ScreenComponent} />

// Use correct navigation
navigation.navigate('ScreenName', { param: value });
```

**3. State not updating**:
```javascript
// Use functional setState
setState(prev => ({ ...prev, newValue }));

// Not: setState({ newValue }) // This replaces entire state!
```

### Debug Tools

**React Native Debugger**:
```bash
npm install -g react-native-debugger
```

**Expo Dev Tools**:
```bash
expo start
# Press 'd' to open developer menu
```

**Redux DevTools** (if using Redux):
```bash
npm install --save-dev redux-devtools-extension
```

## Deployment

### Building for Production

**iOS**:
```bash
expo build:ios
```

**Android**:
```bash
expo build:android
```

**Configuration**: Edit `app.json`:
```json
{
  "expo": {
    "name": "Poker Training",
    "version": "2.0.0",
    "ios": {
      "bundleIdentifier": "com.pokertraining.app"
    },
    "android": {
      "package": "com.pokertraining.app"
    }
  }
}
```

### Environment Variables

Create `.env` file:
```
API_BASE_URL=https://api.pokertraining.app
API_TIMEOUT=30000
ENABLE_ANALYTICS=true
```

Access in code:
```javascript
const apiUrl = process.env.API_BASE_URL;
```

## Contributing

### Code Style

- Use ESLint configuration
- Follow Airbnb React/JSX style guide
- Write meaningful commit messages
- Add tests for new features

### Commit Message Format

```
feat: Add PLO training screen
fix: Resolve streak calculation bug
docs: Update developer guide
test: Add tests for adaptive engine
refactor: Simplify gamification logic
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Update documentation
4. Submit PR with clear description
5. Address review feedback
6. Merge after approval

## API Documentation

### Authentication Endpoints

**POST /auth/register**
```javascript
{
  email: 'user@example.com',
  password: 'securepassword',
  username: 'player123'
}
// Returns: { authToken, refreshToken, userId }
```

**POST /auth/login**
```javascript
{
  email: 'user@example.com',
  password: 'securepassword'
}
// Returns: { authToken, refreshToken, userId }
```

### Sync Endpoints

**POST /sync/full**
```javascript
{
  userId: 'user_123',
  data: { /* full user data */ },
  timestamp: '2025-01-15T10:00:00Z'
}
// Returns: { success: true, conflicts: [] }
```

### Analytics Endpoints

**POST /analytics/event**
```javascript
{
  userId: 'user_123',
  event: 'quiz_completed',
  data: { score: 85, category: 'ranges' },
  timestamp: '2025-01-15T10:30:00Z'
}
```

## Troubleshooting

### Common Errors

**Error: "Invariant Violation: Element type is invalid"**
- Check all imports are correct
- Ensure components are exported properly

**Error: "Can't find variable: __fbBatchedBridge"**
- Restart Metro bundler
- Clear cache: `expo start -c`

**Error: "Network request failed"**
- Check API_BASE_URL is correct
- Verify network connectivity
- Check CORS settings on backend

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [GTO Poker Resources](https://www.gtowizard.com/)

## Support

- **GitHub Issues**: Report bugs and request features
- **Developer Discord**: Join for technical discussions
- **Email**: dev@pokertraining.app

---

Happy coding! 🚀♠️♥️♣️♦️
