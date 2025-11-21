# GitHub Copilot Instructions for Poker Training App

## Project Overview

This is a React Native Expo application that provides a gamified poker training platform with spaced repetition, adaptive learning, and comprehensive analytics. The app helps users learn poker strategy through scientifically-proven learning methods (SM-2 algorithm), gamification (XP, levels, achievements), and multiple game modes (quizzes, drills, range trainer, push/fold charts).

## Technology Stack

- **Framework**: React Native 0.72.6 with Expo ~49.0.0
- **Language**: JavaScript (ES6+)
- **UI Library**: React Native Paper 5.10.0
- **Navigation**: React Navigation 6.x (Bottom Tabs + Stack)
- **State Management**: React Hooks + Context API (AuthContext) + AsyncStorage (NO Redux)
- **Storage**: AsyncStorage 1.18.2 for local persistence
- **Secure Storage**: expo-secure-store with AsyncStorage fallback
- **Audio/Haptics**: Expo AV 13.4.1, Expo Haptics 12.4.0
- **Testing**: Jest
- **Icons**: Material Community Icons

## Project Structure

```
/Poker
├── src/
│   ├── core/                 # Business logic engines
│   │   ├── gamification.js   # XP, levels, achievements, streaks
│   │   ├── spacedRepetition.js  # SM-2 algorithm, card/deck system
│   │   ├── adaptiveEngine.js    # Difficulty adjustment
│   │   └── soundManager.js      # Sound & haptic feedback
│   ├── data/                 # Static content/questions
│   │   ├── pokerRanges.js
│   │   ├── pushFoldCharts.js
│   │   ├── exploitativeStrategies.js
│   │   ├── ploQuestions.js
│   │   ├── nlheMttQuestions.js
│   │   ├── miniGames.js
│   │   └── trainingPlan.js
│   ├── screens/              # Screen components
│   │   ├── HomeScreen.js
│   │   ├── QuizGameScreen.js
│   │   ├── SpacedRepetitionScreen.js
│   │   ├── PLOTrainingScreen.js
│   │   ├── HandHistoryScreen.js
│   │   ├── AnalyticsScreen.js
│   │   ├── OnboardingScreen.js
│   │   └── ...
│   ├── components/           # Reusable UI components
│   │   ├── XPBar.js
│   │   ├── StreakFlame.js
│   │   ├── AchievementBadge.js
│   │   ├── ErrorBoundary.js
│   │   └── LoadingSpinner.js
│   ├── context/              # React Context providers
│   │   └── AuthContext.js    # Authentication state management
│   ├── services/             # API & services
│   │   ├── apiClient.js
│   │   └── syncService.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useAsyncData.js
│   │   └── useSyncService.js
│   └── utils/                # Utility functions
│       ├── validation.js
│       ├── secureStorage.js
│       └── sessionManager.js
├── __tests__/                # Unit tests
├── docs/                     # Documentation
├── App.js                    # Root component & navigation setup
└── package.json
```

## Coding Standards and Best Practices

### General Guidelines

1. **Code Style**
   - Follow Airbnb React/JSX style guide
   - Use functional components with hooks (no class components)
   - Use descriptive variable and function names
   - Keep functions small and focused (single responsibility)
   - Add comments for complex logic, but prefer self-documenting code

2. **Import Statements**
   - Always verify ALL necessary imports are included at the top of files
   - Common React Native imports: `Text`, `TouchableOpacity`, `View`, `ScrollView`, `StyleSheet`
   - Use destructuring for imports: `import { View, Text } from 'react-native'`

3. **Component Structure**
   - Functional components with hooks
   - Props validation when applicable
   - Consistent prop naming
   - Extract complex logic into custom hooks
   - Use memo/useCallback for performance when needed

4. **State Management**
   - Use `useState` for local component state
   - Use `useEffect` for side effects
   - Use AsyncStorage for persistent data
   - Use AuthContext (via `useAuth()` hook) for authentication state
   - Clean up effects properly (return cleanup functions)
   - Consider creating new Context providers for other global state needs

### Specific Patterns

1. **AsyncStorage Usage**
   - Always wrap in try-catch blocks
   - Use JSON.parse/JSON.stringify for complex data
   - Validate parsed data before using
   - Handle null/undefined gracefully
   - Example:
   ```javascript
   try {
     const data = await AsyncStorage.getItem('key');
     const parsed = data ? JSON.parse(data) : defaultValue;
     // Validate parsed data
     return parsed;
   } catch (error) {
     console.error('Error loading data:', error);
     return defaultValue;
   }
   ```

2. **Question/Content Format**
   - All questions follow this structure:
   ```javascript
   {
     id: 'unique_id',
     category: 'category_name',
     difficulty: 'easy|medium|hard',
     question: 'Your question text?',
     answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
     correctAnswer: 'Option 2',
     explanation: 'Detailed explanation...',
     points: 15,
   }
   ```

3. **Gamification Integration**
   - Award XP for completed actions
   - Update streaks daily
   - Check and unlock achievements after XP changes
   - Use sound/haptic feedback for positive actions
   - Example:
   ```javascript
   import { awardXP, checkAchievements } from '../core/gamification';
   
   const handleQuizComplete = async (score) => {
     await awardXP(XP_REWARDS.QUIZ_COMPLETED);
     await checkAchievements();
     playSound('success');
   };
   ```

4. **Navigation**
   - Use `navigation.navigate('ScreenName', { params })` for navigation
   - Use `navigation.goBack()` to return
   - Access params with `route.params`
   - Use Stack navigator for hierarchical screens
   - Use Tab navigator for main sections

5. **Authentication Context**
   - Use the `useAuth()` hook to access authentication state
   - Available from `src/context/AuthContext.js`
   - Provides: `user`, `loading`, `isAuthenticated`, `login`, `register`, `logout`, `refreshUser`, `updateProfile`
   - Example:
   ```javascript
   import { useAuth } from '../context/AuthContext';
   
   function MyScreen() {
     const { user, isAuthenticated, login, logout } = useAuth();
     
     if (!isAuthenticated) {
       // Show login screen
     }
     
     // Use user data
     return <Text>Welcome {user?.username}</Text>;
   }
   ```

## Security Best Practices

### Critical Security Requirements

1. **Token Storage**
   - NEVER store authentication tokens in plain memory
   - Use the `secureStorage` utility (`src/utils/secureStorage.js`) for sensitive data
   - This utility uses `expo-secure-store` when available, with AsyncStorage fallback
   - Session timeout is implemented via `sessionManager` (15 minutes)

2. **Input Validation**
   - Validate all user inputs before processing
   - Use validation library (yup/joi) for complex validation
   - Sanitize data before displaying (prevent XSS)
   - Example:
   ```javascript
   import { validateEmail, sanitizeInput } from '../utils/validation';
   
   const email = sanitizeInput(userInput);
   if (!validateEmail(email)) {
     throw new Error('Invalid email');
   }
   ```

3. **Error Handling**
   - Always wrap async operations in try-catch
   - Use ErrorBoundary for component errors
   - Never expose sensitive data in error messages
   - Log errors appropriately (avoid logging tokens/passwords)

4. **Data Safety**
   - Validate parsed JSON data structure
   - Handle null/undefined gracefully
   - Set default values for missing data
   - Don't trust client-side validation alone

## Testing Guidelines

1. **Unit Tests**
   - Write tests for core business logic (gamification, spaced repetition, adaptive engine)
   - Test edge cases and error conditions
   - Mock AsyncStorage and external dependencies
   - Use descriptive test names: `describe('ClassName', () => { it('should do X when Y', ...) })`

2. **Test Structure**
   ```javascript
   import { calculateLevel } from '../src/core/gamification';
   
   describe('Gamification', () => {
     describe('calculateLevel', () => {
       it('should return level 1 for 0-99 XP', () => {
         expect(calculateLevel(0)).toBe(1);
         expect(calculateLevel(99)).toBe(1);
       });
       
       it('should return level 2 for 100-299 XP', () => {
         expect(calculateLevel(100)).toBe(2);
         expect(calculateLevel(299)).toBe(2);
       });
     });
   });
   ```

3. **Running Tests**
   - Run all tests: `npm test`
   - Run with coverage: `npm run test:coverage`
   - Run in watch mode: `npm test -- --watch`
   - Run specific file: `npm test gamification.test.js`

## Build and Development

1. **Setup**
   ```bash
   npm install              # Install dependencies
   npm start                # Start Expo development server
   npm run ios              # Run on iOS simulator (Mac only)
   npm run android          # Run on Android emulator
   npm run web              # Run in web browser
   ```

2. **Linting**
   - Currently no linter configured (lint script echoes 'No linter configured')
   - Structure linting available: `npm run lint:structure`

3. **Development Workflow**
   - Use Expo Go app for testing on physical devices
   - Hot reload enabled for quick iteration
   - Check console for errors/warnings
   - Test on both iOS and Android when possible

## Performance Considerations

1. **Memory Management**
   - Clean up intervals/timers in useEffect cleanup
   - Unsubscribe from listeners when component unmounts
   - Example:
   ```javascript
   useEffect(() => {
     const interval = setInterval(() => {/* ... */}, 1000);
     return () => clearInterval(interval); // Cleanup!
   }, []);
   ```

2. **Optimization**
   - Use `React.memo()` for expensive render components
   - Use `useMemo()` for expensive calculations
   - Use `useCallback()` for function props passed to children
   - Lazy load heavy screens/components when possible

3. **AsyncStorage Performance**
   - Batch reads/writes when possible
   - Don't store large objects unnecessarily
   - Clear old/unused data periodically

## Common Patterns to Follow

1. **Screen Component Pattern**
   ```javascript
   import React, { useState, useEffect } from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   export default function MyScreen({ navigation, route }) {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       loadData();
     }, []);
     
     const loadData = async () => {
       try {
         const stored = await AsyncStorage.getItem('key');
         setData(stored ? JSON.parse(stored) : defaultValue);
       } catch (error) {
         console.error('Error loading data:', error);
       } finally {
         setLoading(false);
       }
     };
     
     if (loading) return <LoadingSpinner />;
     
     return (
       <View style={styles.container}>
         {/* Content */}
       </View>
     );
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 20,
     },
   });
   ```

2. **Service/API Pattern**
   ```javascript
   class MyService {
     constructor() {
       this.data = null;
     }
     
     async fetchData() {
       try {
         // Fetch logic
         return data;
       } catch (error) {
         console.error('Fetch error:', error);
         throw error;
       }
     }
     
     cleanup() {
       // Clean up resources
     }
   }
   
   export default new MyService();
   ```

## Anti-Patterns to Avoid

1. **Missing Imports** ❌
   - Always check that all React Native components used are imported
   - Common mistake: Using `Text` or `TouchableOpacity` without importing

2. **Memory Leaks** ❌
   - Don't forget cleanup in useEffect
   - Clear intervals, timeouts, subscriptions
   - Remove event listeners

3. **Unhandled Promises** ❌
   - Always use try-catch with async/await
   - Handle errors gracefully
   - Don't silently fail

4. **Insecure Storage** ❌
   - Don't store tokens in plain memory or unencrypted storage
   - Use the `secureStorage` utility for sensitive data (handles expo-secure-store with fallback)

5. **Missing Validation** ❌
   - Always validate user input
   - Check for null/undefined before accessing properties
   - Validate parsed JSON structure

## Key Architectural Decisions

1. **Backend Integration in Progress**: API client exists (`src/services/apiClient.js`) with authentication system (`AuthContext`). Some data is still stored locally in AsyncStorage, backend integration ongoing.

2. **No TypeScript**: Project uses JavaScript. When adding new code, follow existing JavaScript patterns.

3. **Simple State Management**: Uses React hooks + Context API (AuthContext for auth) + AsyncStorage. No Redux (by design).

4. **Expo Managed Workflow**: Using Expo managed workflow for easy development and deployment.

5. **Gamification First**: The gamification system (XP, levels, achievements, streaks) is core to the app. All features should integrate with it.

6. **Learning Science**: Spaced repetition (SM-2 algorithm) and adaptive difficulty are fundamental to the learning experience.

7. **Secure Storage**: Uses expo-secure-store when available with AsyncStorage fallback for cross-platform compatibility.

## Documentation

- **User Guide**: `/docs/USER_GUIDE.md` - How to use the app
- **Developer Guide**: `/docs/DEVELOPER_GUIDE.md` - Technical documentation
- **Codebase Overview**: `/CODEBASE_OVERVIEW.md` - Comprehensive codebase documentation
- **Code Review Findings**: `/CODE_REVIEW_FINDINGS.md` - Known issues and improvement roadmap

## Additional Notes

- The app supports multiple poker formats: NLH Cash, PLO, MTTs
- Questions are organized by category and difficulty
- The SM-2 spaced repetition algorithm is used for flashcards
- Sound and haptic feedback enhance the gamified experience
- Daily streaks encourage consistent practice
- The app is designed to work offline (all content is local)

When making changes, always:
1. Check existing patterns in similar files
2. Ensure all imports are present
3. Add proper error handling
4. Clean up resources in useEffect
5. Validate data from AsyncStorage
6. Integrate with gamification system when appropriate
7. Follow the existing code style
8. Update documentation if adding new features
