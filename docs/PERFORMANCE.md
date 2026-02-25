# Performance Optimization Guide

This document outlines performance best practices and optimization strategies for the Poker Training App.

## Performance Metrics

### Target Metrics
- **App Launch**: < 3 seconds (cold start)
- **Screen Navigation**: < 300ms
- **API Response Time**: < 500ms
- **Frame Rate**: 60 FPS (UI interactions)
- **Memory Usage**: < 150MB (idle)
- **Bundle Size**: < 50MB (production)

## Optimization Strategies

### 1. Code Splitting and Lazy Loading

Lazy load screens and heavy components:

```javascript
import React, { lazy, Suspense } from 'react';

const HeavyScreen = lazy(() => import('./screens/HeavyScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyScreen />
    </Suspense>
  );
}
```

### 2. Image Optimization

**Best Practices:**
- Use WebP format for images
- Compress images before bundling
- Use responsive images
- Implement lazy loading for images

```javascript
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

// Use FastImage for better caching
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.high,
  }}
  resizeMode={FastImage.resizeMode.contain}
/>
```

### 3. FlatList Optimization

Optimize long lists:

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 4. Memoization

Use React.memo and useMemo:

```javascript
import React, { memo, useMemo } from 'react';

// Memoize components
const QuestionCard = memo(({ question, onAnswer }) => {
  return <Card>{/* content */}</Card>;
});

// Memoize expensive calculations
function QuizScreen() {
  const sortedQuestions = useMemo(
    () => questions.sort((a, b) => a.difficulty - b.difficulty),
    [questions]
  );
}
```

### 5. Debouncing and Throttling

Optimize frequent operations:

```javascript
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

function SearchScreen() {
  const handleSearch = useCallback(
    debounce((query) => {
      // Expensive search operation
      searchQuestions(query);
    }, 300),
    []
  );
}
```

### 6. AsyncStorage Optimization

Batch AsyncStorage operations:

```javascript
// Bad: Multiple awaits
await AsyncStorage.setItem('key1', value1);
await AsyncStorage.setItem('key2', value2);
await AsyncStorage.setItem('key3', value3);

// Good: Batch operation
await AsyncStorage.multiSet([
  ['key1', value1],
  ['key2', value2],
  ['key3', value3],
]);
```

### 7. Network Optimization

**Request Batching:**
```javascript
// Batch multiple API calls
const [user, stats, achievements] = await Promise.all([
  apiClient.getUser(),
  apiClient.getStats(),
  apiClient.getAchievements(),
]);
```

**Response Caching:**
```javascript
const cache = new Map();

async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const data = await fetch(url);
  cache.set(url, data);
  return data;
}
```

## Performance Monitoring

### Using React Native Performance

```javascript
import { PerformanceObserver, performance } from 'react-native-performance';

// Monitor navigation performance
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });

// Measure screen load time
performance.mark('screen-start');
// ... screen loads
performance.mark('screen-end');
performance.measure('screen-load', 'screen-start', 'screen-end');
```

### Sentry Performance Monitoring

Already integrated! Use:

```javascript
import { errorTracking } from '../services/errorTracking';

const transaction = errorTracking.startTransaction('quiz-load', 'navigation');
// ... load quiz
transaction.finish();
```

## Bundle Size Optimization

### Analyze Bundle

```bash
# Install analyzer
npm install --save-dev react-native-bundle-visualizer

# Analyze bundle
npx react-native-bundle-visualizer
```

### Reduce Bundle Size

1. **Remove unused dependencies**
2. **Use tree-shaking**
3. **Enable Hermes engine** (already configured)
4. **Minify assets**

## Memory Management

### Prevent Memory Leaks

```javascript
useEffect(() => {
  const subscription = observable.subscribe();
  const timer = setInterval(() => {}, 1000);

  // Cleanup
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);
```

### Profile Memory Usage

Use React DevTools Profiler:
1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Interact with app
5. Stop recording
6. Analyze component render times

## Platform-Specific Optimizations

### iOS

- Enable Hermes (configured in `app.json`)
- Use native modules for heavy tasks
- Optimize images for iOS (1x, 2x, 3x)

### Android

- Enable Hermes (configured in `app.json`)
- Use ProGuard for release builds
- Optimize APK size with app bundles

## Performance Checklist

Before release, verify:

- [ ] All images optimized
- [ ] Lists use FlatList with optimization props
- [ ] No unnecessary re-renders (use React DevTools)
- [ ] API calls are batched where possible
- [ ] AsyncStorage operations are optimized
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Bundle size < 50MB
- [ ] Cold start < 3 seconds
- [ ] 60 FPS during interactions
- [ ] Network requests < 500ms
- [ ] Hermes enabled
- [ ] ProGuard enabled (Android)

## Tools

- **React DevTools Profiler**: Component performance
- **Flipper**: Network, Redux, AsyncStorage debugging
- **Sentry Performance**: Real-time performance monitoring
- **Xcode Instruments**: iOS profiling
- **Android Studio Profiler**: Android profiling

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Hermes Engine](https://hermesengine.dev/)
- [Optimizing FlatList](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Performance Monitoring with Sentry](https://docs.sentry.io/platforms/react-native/performance/)
