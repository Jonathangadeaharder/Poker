# GitHub Copilot Instructions - Poker Training App

## Project Overview

This is a React Native mobile application for poker training that uses gamification, spaced repetition learning (SM-2 algorithm), and interactive quiz systems. The app runs on Expo and targets iOS, Android, and web platforms.

## Tech Stack

- **Framework**: React Native 0.72.6 with Expo ~49.0.0
- **UI Library**: React Native Paper 5.10.0 (Material Design)
- **Navigation**: React Navigation 6.x (Bottom Tabs + Stack)
- **State Management**: React Hooks + AsyncStorage (no Redux)
- **Audio/Haptics**: Expo AV, Expo Haptics
- **Testing**: Jest with React Testing Library
- **Language**: JavaScript (ES6+)

## Project Structure

```
/src/
  /core/          - Business logic engines (gamification, SRS, sound)
  /data/          - Static content (ranges, charts, strategies)
  /screens/       - Screen components (8 main screens)
  /components/    - Reusable UI components
  /hooks/         - Custom React hooks
  /services/      - API clients and services
  /utils/         - Utility functions
```

## Coding Standards

### File Naming
- Use PascalCase for component files: `HomeScreen.js`, `XPBar.js`
- Use camelCase for utilities: `gamification.js`, `soundManager.js`
- Use camelCase for data files: `pokerRanges.js`, `trainingPlan.js`

### Component Patterns
- Use functional components with hooks (no class components)
- Place component state at the top using `useState` and `useEffect`
- Load persisted data in `useEffect` on mount
- Clean up subscriptions/timers in `useEffect` return functions

### State Management
- Use local component state (`useState`) for UI state
- Use AsyncStorage for persistence across sessions
- Load data pattern:
  ```javascript
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('key');
      if (data) setState(JSON.parse(data));
    } catch (error) {
      console.error('Load error:', error);
    }
  };
  ```

### Styling
- Use StyleSheet.create() for all styles
- Place styles at the bottom of the file
- Use React Native Paper theme colors
- Follow Material Design spacing (8px grid)

### Sound & Haptics
- Always use the SoundManager singleton for audio feedback
- Import: `import SoundManager from '../core/soundManager';`
- Play sounds: `SoundManager.playSound('correct')`, `SoundManager.playSound('wrong')`
- Add haptics: `SoundManager.triggerHaptic('success')`, `SoundManager.triggerHaptic('error')`

### Gamification
- Award XP using: `GamificationEngine.awardXP(userId, amount, reason)`
- Check achievements after XP awards: `GamificationEngine.checkAchievements(userId, userStats)`
- Update streaks on login: `GamificationEngine.updateDailyStreak(userId)`

### Error Handling
- Always wrap async operations in try-catch blocks
- Log errors with descriptive messages: `console.error('Description:', error)`
- Show user-friendly error messages using alerts or snackbars
- Never expose internal errors to users

## Testing Requirements

### Test Coverage
- Write tests for all core business logic in `/src/core/`
- Test files should be in `__tests__/` directory
- Name tests: `filename.test.js` (e.g., `gamification.test.js`)
- Test gamification XP calculations, level ups, and achievements
- Test SRS algorithm calculations (easiness, intervals)
- Mock AsyncStorage in tests using `@react-native-async-storage/async-storage/jest/async-storage-mock`

### Running Tests
```bash
npm test                 # Run all tests
npm test -- --watch      # Watch mode
npm test filename        # Run specific test
```

## Development Workflow

### Starting Development
```bash
npm install              # Install dependencies
npm start                # Start Expo dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run in web browser
```

### Linting
```bash
npm run lint             # Currently not configured
npm run lint:structure   # Run structure linting
```

### Building
- Development builds use Expo Go app
- Production builds require EAS Build (not configured)

## Content Management

### Adding Questions
- Add questions to appropriate data file in `/src/data/`
- Question format:
  ```javascript
  {
    id: 'unique_id',
    category: 'category_name',
    difficulty: 'easy' | 'medium' | 'hard',
    question: 'Question text?',
    answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 'Option 2',
    explanation: 'Explanation of why this is correct',
    points: 10,  // XP value
  }
  ```

### Adding Poker Ranges
- Add to `/src/data/pokerRanges.js`
- Format: `{ position, percentage, hands[], description }`
- Hands use standard notation: 'AA', 'AKs', 'AKo', etc.

## Common Patterns

### Loading Persisted Data
```javascript
useEffect(() => {
  loadUserData();
}, []);

const loadUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('@user_data');
    if (data) setUserData(JSON.parse(data));
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
};
```

### Saving Data
```javascript
const saveUserData = async (data) => {
  try {
    await AsyncStorage.setItem('@user_data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};
```

### Screen Navigation
```javascript
// Navigate to screen
navigation.navigate('ScreenName', { param: value });

// Go back
navigation.goBack();

// Navigate to tab
navigation.navigate('TabName');
```

### Awarding XP with Feedback
```javascript
// Award XP
const newXP = GamificationEngine.awardXP(userId, 50, 'quiz_completion');
setUserXP(newXP);

// Play sound and haptic
SoundManager.playSound('correct');
SoundManager.triggerHaptic('success');

// Save to storage
await AsyncStorage.setItem('@user_xp', JSON.stringify(newXP));
```

## Important Notes

### Current Limitations
- **No backend**: All data is local to the device
- **No user authentication**: Single-user per device
- **No cloud sync**: Data doesn't sync across devices
- **Static content**: All questions/content are hardcoded

### Data Persistence
- All user data stored in AsyncStorage
- Keys use `@` prefix convention: `@user_data`, `@user_xp`
- Always stringify objects before saving
- Always parse JSON when loading

### Performance
- Avoid heavy computations in render methods
- Use React.memo() for expensive components
- Debounce user input handlers
- Clean up timers and subscriptions

### Accessibility
- Use accessible labels for interactive elements
- Ensure sufficient color contrast
- Support screen readers
- Use semantic HTML on web platform

## Security Considerations

- Never commit sensitive data or API keys
- Use expo-secure-store for sensitive tokens (when implemented)
- Validate all user inputs
- Sanitize data before rendering
- No sensitive data in console.log statements in production

## Documentation

When adding new features:
1. Update relevant documentation in `/docs/` if it exists
2. Add JSDoc comments for complex functions
3. Include inline comments for non-obvious logic
4. Update README.md if adding major features

## Code Review Checklist

Before committing:
- [ ] Code follows naming conventions
- [ ] No console.log statements (or marked for removal)
- [ ] Error handling implemented
- [ ] AsyncStorage properly handled (try-catch)
- [ ] Sound/haptic feedback added where appropriate
- [ ] XP awarded for user actions
- [ ] Tests written for new logic
- [ ] No hardcoded values (use constants)
- [ ] Memory leaks prevented (cleanup in useEffect)

## Additional Resources

- Project docs: `START_HERE.md`, `CODEBASE_OVERVIEW.md`, `QUICK_REFERENCE.md`
- Expo docs: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- React Native Paper: https://callstack.github.io/react-native-paper/
