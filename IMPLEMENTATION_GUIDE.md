# Poker Training App - Implementation Guide

## Overview

You now have a complete understanding of the poker training app codebase. This guide helps you implement the requested features effectively.

## What You Have

### Completed Systems
- ✅ **Gamification**: Full XP, levels, achievements, streaks system
- ✅ **Spaced Repetition**: SM-2 algorithm with card/deck system
- ✅ **UI Components**: XPBar, StreakFlame, AchievementBadge
- ✅ **Screen Navigation**: 8 screens with proper routing
- ✅ **Sound/Haptics**: Audio/vibration feedback system
- ✅ **Quiz Generator**: Dynamic multiple-choice quiz system
- ✅ **Content Storage**: All poker strategy data in static files
- ✅ **Local Persistence**: AsyncStorage for device-local data

### Total Codebase
- **3,200+ lines** of well-organized code
- **8 screens** covering learning, practice, profile
- **3 reusable components** for gamification UI
- **3 core engines** for business logic
- **5 data files** with poker strategy content

## What You're Missing (For New Features)

### Critical Gaps
1. **No Backend API** - All data is static/local
2. **No Testing** - Zero test coverage
3. **No Analytics** - No user behavior tracking
4. **No Authentication** - No user accounts or login
5. **No Content Management** - Updating content requires code changes
6. **No Data Validation** - No input/output validation layer

## How to Implement New Features

### Adding New Content (Ranges, Charts, Exploits)

**Option 1: Static File Approach (Current)**
```javascript
// /src/data/newContent.js
export const NEW_DATA = {
  item1: { /* data */ },
  item2: { /* data */ },
};

// In screen component
import { NEW_DATA } from '../data/newContent';
// Use it directly
const data = NEW_DATA['item1'];
```
**Pros**: Simple, no API needed
**Cons**: Requires app rebuild for changes

**Option 2: Dynamic Loading (Recommended for Scaling)**
```javascript
// Create /src/services/api.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://your-backend.com/api',
});

export async function fetchRanges() {
  const response = await apiClient.get('/ranges');
  return response.data;
}

// In screen component
useEffect(() => {
  fetchRanges().then(setRanges);
}, []);
```
**Pros**: Can update content without rebuilding
**Cons**: Need backend infrastructure

### Adding New Gamification Features

**Extending XP Rewards**:
```javascript
// /src/core/gamification.js
export const XP_REWARDS = {
  // ... existing
  NEW_FEATURE: 100,
};

// In screen component
import { XP_REWARDS } from '../core/gamification';
setTotalXP(totalXP + XP_REWARDS.NEW_FEATURE);
```

**Adding New Achievements**:
```javascript
export const ACHIEVEMENTS = {
  // ... existing
  NEW_ACHIEVEMENT: {
    id: 'new_achievement',
    title: 'Title',
    description: 'Description',
    icon: '🎯',
    xpReward: 100,
    requirement: { type: 'custom', count: 5 },
  },
};
```

### Adding New Screens

**Basic Template**:
```javascript
// /src/screens/NewScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewScreen({ navigation }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('new_screen_data');
      if (saved) setData(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const saveData = async (newData) => {
    try {
      setData(newData);
      await AsyncStorage.setItem('new_screen_data', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>New Screen</Title>
          <Paragraph>Content here</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
});
```

**Add to Navigation** (in App.js):
```javascript
function LearnStack() {
  return (
    <Stack.Navigator>
      {/* ... existing */}
      <Stack.Screen
        name="NewScreen"
        component={NewScreen}
        options={{ title: 'New Screen' }}
      />
    </Stack.Navigator>
  );
}
```

### Adding Analytics

**Step 1: Create Analytics Service**:
```javascript
// /src/services/analytics.js
export async function trackEvent(eventName, properties = {}) {
  try {
    const payload = {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      userId: 'local-user', // TODO: Add real user ID
    };
    
    // TODO: Send to backend
    console.log('[Analytics]', eventName, properties);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

export async function trackScreen(screenName) {
  await trackEvent('screen_view', { screen: screenName });
}
```

**Step 2: Use in Screens**:
```javascript
import { trackEvent, trackScreen } from '../services/analytics';

export default function QuizGameScreen() {
  useEffect(() => {
    trackScreen('quiz_game');
  }, []);
  
  const handleAnswer = async (answer) => {
    trackEvent('quiz_answered', { isCorrect, difficulty });
    // ... rest of logic
  };
}
```

### Adding Tests

**Basic Test Template** (Jest + React Testing Library):
```javascript
// /src/core/gamification.test.js
import { calculateLevel, LEVELS } from './gamification';

describe('Gamification Engine', () => {
  test('calculateLevel returns correct level for XP', () => {
    const result = calculateLevel(1250);
    expect(result.level).toBe(5);
    expect(result.progress).toBeGreaterThan(0);
  });
  
  test('XP requirements are cumulative', () => {
    for (let i = 1; i < 10; i++) {
      expect(LEVELS[i].xpRequired).toBeLessThan(LEVELS[i + 1].xpRequired);
    }
  });
});

describe('Spaced Repetition', () => {
  test('Card.review() updates EF correctly', () => {
    const card = new Card('test', 'Q', 'A', 'test');
    const result = card.review(3); // Easy
    
    expect(result.ef).toBeGreaterThan(2.5);
    expect(result.success).toBe(true);
  });
});
```

**Run Tests**:
```bash
npm install --save-dev jest @testing-library/react-native
npm test
```

## Implementation Priority

### Phase 1: Enhance Current Features (No Backend)
1. Add more quiz questions to miniGames.js
2. Expand push/fold charts with more scenarios
3. Add more achievements/badges
4. Implement dark mode (UI theme toggle)
5. Add more animations/transitions

### Phase 2: Add Basic Infrastructure
1. Create `/src/services/` directory with API client
2. Add error handling & logging service
3. Setup basic analytics tracking
4. Add form validation utilities

### Phase 3: Backend Integration (Required for scaling)
1. Setup Node.js/Express backend
2. Create user authentication (Firebase Auth or custom)
3. Build CMS for content management
4. Implement cloud storage for user data
5. Setup analytics dashboards

### Phase 4: Testing & Optimization
1. Add unit tests for core engines
2. Add integration tests for screens
3. Setup CI/CD pipeline (GitHub Actions)
4. Performance optimization & code splitting

## File Structure for New Features

```
/src/
├── core/
│   ├── gamification.js
│   ├── spacedRepetition.js
│   ├── soundManager.js
│   └── analytics.js                 // NEW
│
├── data/
│   └── /* existing files */
│
├── services/                         // NEW
│   ├── api.js                       // API client
│   ├── storage.js                   // AsyncStorage wrapper
│   └── analytics.js                 // Analytics tracking
│
├── utils/                           // NEW
│   ├── validators.js                // Input validation
│   ├── formatters.js                // Data formatting
│   └── errorHandler.js              // Error handling
│
├── components/
│   └── /* existing files */
│
└── screens/
    └── /* existing files */
```

## Key Dependencies to Add

```bash
# API & HTTP
npm install axios

# Error tracking
npm install @sentry/react-native

# Analytics
npm install @segment/analytics-react-native

# State management (optional, for complex apps)
npm install zustand
# or
npm install redux react-redux

# Testing
npm install --save-dev jest @testing-library/react-native

# Code quality
npm install --save-dev eslint prettier
```

## Environment Variables

Create `.env` file (add to .gitignore):
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

Use in code:
```javascript
import { API_URL } from '@env';
const apiClient = axios.create({ baseURL: API_URL });
```

## Common Patterns in This Codebase

### Pattern 1: Load & Persist Data
```javascript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const saved = await AsyncStorage.getItem('key');
  if (saved) setState(JSON.parse(saved));
};

const saveData = async (newData) => {
  setState(newData);
  await AsyncStorage.setItem('key', JSON.stringify(newData));
};
```

### Pattern 2: Sound + Haptics
```javascript
import soundManager from '../core/soundManager';

// On correct answer
await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);

// On error
await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
```

### Pattern 3: Award XP & Check Achievements
```javascript
import { XP_REWARDS, ACHIEVEMENTS } from '../core/gamification';

const awardXP = (rewardType) => {
  const xp = XP_REWARDS[rewardType];
  setTotalXP(totalXP + xp);
  
  // Check if achievement unlocked
  if (totalXP + xp >= ACHIEVEMENT_REQUIREMENT) {
    unlockedAchievements.push(achievementId);
  }
};
```

### Pattern 4: Study Session with SRS
```javascript
const startSession = () => {
  const session = new StudySession(deck);
  const info = session.startSession();
  // info: { totalCards, dueCards, newCards }
};

const submitAnswer = async (rating) => {
  const result = session.submitAnswer(rating); // 0-3
  // result: { success, n, ef, interval, nextReview }
  
  if (result.success) {
    await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
  }
};
```

## Debugging Tips

### Enable Console Logging
```javascript
// In core files
console.log('[GameEngine]', 'Message:', data);
console.error('[Error]', 'Something failed');
```

### Check AsyncStorage
```javascript
// Temporary debug code
async function debugStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const data = await AsyncStorage.multiGet(keys);
  console.table(data);
}
```

### Test SRS Algorithm
```javascript
import { Card, Deck } from './spacedRepetition';

const card = new Card('test', 'Q', 'A', 'test');
console.log('Initial:', card);

card.review(3); // Easy
console.log('After Easy:', { n: card.n, ef: card.ef, interval: card.interval });

card.review(0); // Again
console.log('After Again:', { n: card.n, ef: card.ef, interval: card.interval });
```

## Next Steps

1. **Read the full CODEBASE_OVERVIEW.md** (928 lines) for deep dive
2. **Review QUICK_REFERENCE.md** for quick lookups
3. **Start implementing** using patterns from existing code
4. **Test locally** with `npm start`
5. **Build & test on device** with Expo Go

## Support

### Documentation Files
- `CODEBASE_OVERVIEW.md` - Complete architectural overview
- `QUICK_REFERENCE.md` - Quick lookup reference
- `IMPLEMENTATION_GUIDE.md` - This file

### Code Comments
- Check existing comments in `/src/core/` for algorithm explanations
- SM-2 algorithm details in spacedRepetition.js
- XP rewards structure in gamification.js

### Testing
- No tests exist yet - create them as you add features
- Use Jest + React Testing Library
- Focus on core engines first (gamification, SRS)

---

**Happy coding! The codebase is well-structured and ready for expansion.** 🚀
