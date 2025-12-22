# Accessibility Guide

This guide explains how to implement accessibility features in the Poker Training App to ensure it's usable by everyone, including users with disabilities.

## Table of Contents

1. [Overview](#overview)
2. [Accessibility Utilities](#accessibility-utilities)
3. [Implementation Guidelines](#implementation-guidelines)
4. [Testing](#testing)
5. [Best Practices](#best-practices)

## Overview

The app includes comprehensive accessibility support for:
- Screen readers (VoiceOver on iOS, TalkBack on Android)
- Keyboard navigation
- Font scaling
- Color contrast
- Touch target sizes

## Accessibility Utilities

The app provides accessibility helpers in `/src/utils/accessibility.js`:

### Button Accessibility

```javascript
import { createButtonA11y } from '../utils/accessibility';

<Button
  {...createButtonA11y('Submit Quiz', 'Submits your answers and shows results')}
  onPress={handleSubmit}
>
  Submit
</Button>
```

### Text Input Accessibility

```javascript
import { createTextInputA11y } from '../utils/accessibility';

<TextInput
  label="Email"
  value={email}
  {...createTextInputA11y('Email address', 'Enter your email to login', email)}
  onChangeText={setEmail}
/>
```

### Progress Bar Accessibility

```javascript
import { createProgressA11y } from '../utils/accessibility';

<View {...createProgressA11y(currentXP, nextLevelXP, 'Experience Progress')}>
  <ProgressBar progress={currentXP / nextLevelXP} />
</View>
```

### Checkbox Accessibility

```javascript
import { createCheckboxA11y } from '../utils/accessibility';

<Checkbox
  {...createCheckboxA11y('Remember me', rememberMe, 'Keeps you logged in')}
  status={rememberMe ? 'checked' : 'unchecked'}
  onPress={() => setRememberMe(!rememberMe)}
/>
```

### Error Message Accessibility

```javascript
import { createErrorA11y } from '../utils/accessibility';

{error && (
  <View {...createErrorA11y('Email', error)}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

## Implementation Guidelines

### 1. Buttons and Touchable Elements

**Minimum touch target**: 44x44 points (iOS) or 48x48 dp (Android)

```javascript
<TouchableOpacity
  {...createButtonA11y('Play Quiz', 'Start a new quiz game')}
  style={styles.button} // Must be at least 44x44
  onPress={handlePress}
>
  <Text>Play Quiz</Text>
</TouchableOpacity>
```

### 2. Form Inputs

Always provide labels and hints:

```javascript
<TextInput
  label="Username"
  {...createTextInputA11y(
    'Username',
    'Choose a unique username, 3 to 20 characters',
    username
  )}
  value={username}
  onChangeText={setUsername}
  error={!!errors.username}
/>

{errors.username && (
  <Text
    {...createErrorA11y('Username', errors.username)}
    style={styles.error}
  >
    {errors.username}
  </Text>
)}
```

### 3. Headers and Headings

Use semantic headers for navigation:

```javascript
import { createHeaderA11y } from '../utils/accessibility';

<Text
  {...createHeaderA11y('Quiz Results', 1)}
  style={styles.title}
>
  Quiz Results
</Text>

<Text
  {...createHeaderA11y('Your Score', 2)}
  style={styles.subtitle}
>
  Your Score
</Text>
```

### 4. Lists and Collections

Make list items accessible:

```javascript
import { createListItemA11y } from '../utils/accessibility';

<FlatList
  data={questions}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      {...createListItemA11y(
        item.question,
        item.category,
        index,
        questions.length
      )}
      onPress={() => handleSelectQuestion(item)}
    >
      <Text>{item.question}</Text>
    </TouchableOpacity>
  )}
/>
```

### 5. Images and Icons

Decorative images should be hidden from screen readers:

```javascript
import { createImageA11y } from '../utils/accessibility';

// Decorative emoji
<Text {...createImageA11y('', true)} style={styles.emoji}>
  ♠️
</Text>

// Meaningful image
<Image
  {...createImageA11y('Poker hand diagram showing a flush')}
  source={require('./assets/flush.png')}
/>
```

### 6. Navigation and Tabs

```javascript
import { createTabA11y } from '../utils/accessibility';

const tabs = ['Home', 'Learn', 'Practice', 'Profile'];

tabs.map((tab, index) => (
  <TouchableOpacity
    {...createTabA11y(tab, currentTab === tab, index, tabs.length)}
    onPress={() => setCurrentTab(tab)}
  >
    <Text>{tab}</Text>
  </TouchableOpacity>
))
```

### 7. Alerts and Notifications

```javascript
import { createAlertA11y, announceForAccessibility } from '../utils/accessibility';

// Alert component
<View {...createAlertA11y('Quiz submitted successfully', 'success')}>
  <Text>✅ Quiz submitted!</Text>
</View>

// Programmatic announcement
announceForAccessibility('You earned 50 XP!');
```

### 8. Dynamic Content

Use live regions for changing content:

```javascript
<View
  accessible={true}
  accessibilityLiveRegion="polite"
  accessibilityLabel={`Time remaining: ${timeLeft} seconds`}
>
  <Text>{timeLeft}s</Text>
</View>
```

## Screen-Specific Examples

### Login Screen

```javascript
// Header
<Text {...createHeaderA11y('Poker Training Pro', 1)}>
  Poker Training Pro
</Text>

// Email input
<TextInput
  {...createTextInputA11y('Email', 'Enter your email address')}
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Password input with show/hide button
<TextInput
  {...createTextInputA11y('Password', 'Enter your password')}
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={!showPassword}
  right={
    <TextInput.Icon
      {...createButtonA11y(
        showPassword ? 'Hide password' : 'Show password',
        'Toggle password visibility'
      )}
      icon={showPassword ? 'eye-off' : 'eye'}
      onPress={() => setShowPassword(!showPassword)}
    />
  }
/>

// Remember me checkbox
<View style={styles.rememberContainer}>
  <Checkbox
    {...createCheckboxA11y(
      'Remember me',
      rememberMe,
      'Stay logged in on this device'
    )}
    status={rememberMe ? 'checked' : 'unchecked'}
    onPress={() => setRememberMe(!rememberMe)}
  />
  <Text>Remember me</Text>
</View>

// Submit button
<Button
  {...createButtonA11y('Login', 'Sign in to your account', loading)}
  mode="contained"
  onPress={handleLogin}
  disabled={loading}
>
  Login
</Button>

// Error message
{errors.general && (
  <View {...createErrorA11y('Login', errors.general)}>
    <Text>{errors.general}</Text>
  </View>
)}
```

### Quiz Screen

```javascript
// Question header
<Text {...createHeaderA11y(`Question ${currentIndex + 1} of ${totalQuestions}`, 1)}>
  Question {currentIndex + 1}/{totalQuestions}
</Text>

// Question text
<Text {...createHeaderA11y(question.text, 2)}>
  {question.text}
</Text>

// Answer options
{question.answers.map((answer, index) => (
  <TouchableOpacity
    key={index}
    {...createRadioA11y(
      answer,
      selectedAnswer === index,
      `Select ${answer} as your answer`
    )}
    onPress={() => handleSelectAnswer(index)}
  >
    <Text>{answer}</Text>
  </TouchableOpacity>
))}

// Submit button
<Button
  {...createButtonA11y(
    'Submit Answer',
    'Submit your selected answer',
    !selectedAnswer
  )}
  disabled={!selectedAnswer}
  onPress={handleSubmit}
>
  Submit
</Button>
```

### Profile Screen

```javascript
// XP Progress
<View {...createProgressA11y(currentXP, nextLevelXP, `Level ${level} Progress`)}>
  <XPBar currentXP={currentXP} nextLevelXP={nextLevelXP} />
</View>

// Stats card
<View {...createCardA11y('Statistics', 'Your learning statistics')}>
  <Text {...createHeaderA11y('Statistics', 2)}>Statistics</Text>
  <Text {...createListItemA11y('Total Sessions', '23', 0, 3)}>
    Total Sessions: 23
  </Text>
  <Text {...createListItemA11y('Perfect Quizzes', '3', 1, 3)}>
    Perfect Quizzes: 3
  </Text>
  <Text {...createListItemA11y('Current Streak', '5 days', 2, 3)}>
    Current Streak: 5 days
  </Text>
</View>

// Settings switches
<List.Item
  title="Sound Effects"
  {...createSwitchA11y(
    'Sound Effects',
    soundEnabled,
    'Enable or disable sound effects'
  )}
  right={() => (
    <Switch
      value={soundEnabled}
      onValueChange={setSoundEnabled}
    />
  )}
/>
```

## Testing

### Manual Testing

#### iOS (VoiceOver)

1. Enable VoiceOver: Settings → Accessibility → VoiceOver
2. Triple-click home/side button to toggle
3. Swipe right/left to navigate elements
4. Double-tap to activate
5. Test navigation through all screens
6. Verify all interactive elements are labeled

#### Android (TalkBack)

1. Enable TalkBack: Settings → Accessibility → TalkBack
2. Volume up + down to toggle
3. Swipe right/left to navigate elements
4. Double-tap to activate
5. Test navigation through all screens
6. Verify all interactive elements are labeled

### Automated Testing

Use the accessibility testing helper:

```javascript
import { isScreenReaderEnabled } from '../utils/accessibility';

// Check if screen reader is active
const screenReaderActive = await isScreenReaderEnabled();

// Adjust behavior if needed
if (screenReaderActive) {
  // Provide additional context or simplified UI
}
```

### Accessibility Inspector

**iOS**: Use Xcode Accessibility Inspector
1. Open Xcode
2. Open Developer Tool → Accessibility Inspector
3. Select your app
4. Run inspection

**Android**: Use Accessibility Scanner
1. Install Accessibility Scanner from Play Store
2. Enable in Settings → Accessibility
3. Tap floating button to scan screen
4. Review suggestions

## Best Practices

### 1. Label Everything Interactive

Every button, link, input should have a clear label:
- ✅ "Submit Quiz" (clear)
- ❌ "Submit" (ambiguous)
- ✅ "Delete Account" (clear)
- ❌ "Delete" (what gets deleted?)

### 2. Provide Context in Hints

Hints explain what will happen:
- Label: "Login"
- Hint: "Sign in to your account"

### 3. Group Related Elements

```javascript
<View accessible={true} accessibilityLabel="Question 1 with 4 answer choices">
  <Text>Question 1: What is GTO?</Text>
  {/* Answer buttons */}
</View>
```

### 4. Announce Dynamic Changes

```javascript
import { announceForAccessibility } from '../utils/accessibility';

// After successful quiz submission
announceForAccessibility('Correct! You earned 10 XP');
```

### 5. Handle Loading States

```javascript
{loading ? (
  <LoadingSpinner
    accessible={true}
    accessibilityLabel="Loading quiz questions"
  />
) : (
  <QuizContent />
)}
```

### 6. Support Text Scaling

Allow text to scale with system settings:

```javascript
<Text
  style={styles.title}
  allowFontScaling={true} // Default, but be explicit
>
  Title
</Text>
```

Test with large text sizes: Settings → Display → Font Size

### 7. Maintain Color Contrast

Minimum contrast ratios (WCAG AA):
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- Interactive elements: 3:1

Use online contrast checkers:
- https://webaim.org/resources/contrastchecker/
- https://contrast-ratio.com/

### 8. Avoid Color-Only Information

Don't rely on color alone:
- ❌ Red answer = wrong, Green = correct
- ✅ Red + X icon = wrong, Green + ✓ = correct

### 9. Provide Alternative Text

For images, charts, diagrams:

```javascript
<Image
  source={require('./charts/preflop-ranges.png')}
  accessibilityLabel="Preflop raising ranges from UTG position showing premium hands like pocket pairs tens and above, and suited broadway cards"
/>
```

### 10. Test with Real Users

If possible, test with users who:
- Use screen readers daily
- Have motor impairments
- Have visual impairments
- Use assistive technologies

## Common Patterns

### Modal Dialogs

```javascript
<Modal
  visible={visible}
  accessible={true}
  accessibilityViewIsModal={true} // Traps focus
  accessibilityLabel="Confirm Delete Account"
>
  <Text {...createHeaderA11y('Confirm Deletion', 1)}>
    Confirm Deletion
  </Text>
  <Text>Are you sure you want to delete your account?</Text>
  <Button
    {...createButtonA11y('Cancel', 'Close dialog without deleting')}
    onPress={onCancel}
  >
    Cancel
  </Button>
  <Button
    {...createButtonA11y('Delete', 'Permanently delete your account')}
    onPress={onConfirm}
  >
    Delete
  </Button>
</Modal>
```

### Swipeable Content

Provide alternative navigation for carousels/swipes:

```javascript
<View>
  <FlatList
    data={slides}
    horizontal
    pagingEnabled
    accessible={false} // Let individual slides be accessible
  />

  {/* Alternative navigation */}
  <View style={styles.pagination}>
    {slides.map((_, index) => (
      <TouchableOpacity
        key={index}
        {...createButtonA11y(
          `Go to slide ${index + 1}`,
          `Navigate to ${slides[index].title}`
        )}
        onPress={() => scrollToSlide(index)}
      >
        <View style={currentSlide === index ? styles.activeDot : styles.dot} />
      </TouchableOpacity>
    ))}
  </View>
</View>
```

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/overview/introduction/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)

## Checklist

Use this checklist when implementing new screens:

- [ ] All interactive elements have accessibility labels
- [ ] All inputs have labels and hints
- [ ] All images have alt text (or marked decorative)
- [ ] All buttons have clear actions
- [ ] Errors are announced to screen readers
- [ ] Success messages are announced
- [ ] Loading states are communicated
- [ ] Touch targets are at least 44x44 points
- [ ] Color contrast meets WCAG AA standards
- [ ] Content doesn't rely on color alone
- [ ] Text can scale with system settings
- [ ] Tested with VoiceOver (iOS)
- [ ] Tested with TalkBack (Android)
- [ ] Navigation is logical with screen reader
- [ ] Modals trap focus appropriately
- [ ] Lists announce item position (e.g., "1 of 10")

## Support

For accessibility questions or issues:
- Review `/src/utils/accessibility.js`
- Check this guide
- Test with actual screen readers
- Consult WCAG guidelines
