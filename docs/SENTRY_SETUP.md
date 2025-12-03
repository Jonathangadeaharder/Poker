# Sentry Error Tracking Setup

This document explains how to set up and configure Sentry error tracking for the Poker Training App.

## Prerequisites

1. Create a Sentry account at https://sentry.io
2. Create a new project for React Native
3. Get your Sentry DSN (Data Source Name)

## Installation

Install the required dependencies:

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

Run the Sentry wizard to configure your project:

```bash
npx @sentry/wizard -i reactNative -p ios android
```

This will:
- Add Sentry configuration to your project
- Set up source maps for better stack traces
- Configure native crash reporting

## Configuration

### 1. Set Environment Variables

Create a `.env` file in the root of your project:

```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

Add `.env` to `.gitignore` to keep your DSN private.

### 2. Update app.json

Add your Sentry configuration to `app.json`:

```json
{
  "expo": {
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your-org",
            "project": "your-project"
          }
        }
      ]
    }
  }
}
```

### 3. Configure Sentry Auth Token

For uploading source maps, create a `.sentryclirc` file:

```ini
[auth]
token=your-auth-token

[defaults]
org=your-org
project=your-project
```

Get your auth token from https://sentry.io/settings/account/api/auth-tokens/

## Features Implemented

### 1. Automatic Error Capture

All unhandled errors are automatically sent to Sentry:
- JavaScript errors
- Native crashes (iOS/Android)
- Promise rejections
- React component errors (via ErrorBoundary)

### 2. User Context

User information is automatically tracked:
- User ID
- Email
- Username

This is set on login and cleared on logout.

### 3. Breadcrumbs

User actions are tracked as breadcrumbs:
- Screen navigation
- User interactions (button clicks, form submissions)
- API calls

### 4. Performance Monitoring

Transaction tracking for:
- Screen load times
- API call duration
- Custom operations

### 5. Error Context

Additional context is captured with errors:
- Device info (platform, version)
- Screen name
- User actions leading to the error

## Usage

### Capturing Errors Manually

```javascript
import { errorTracking } from './src/services/errorTracking';

try {
  // Your code
} catch (error) {
  errorTracking.captureError(error, {
    context: {
      feature: 'quiz',
      action: 'submit_answer',
    },
  });
}
```

### Capturing Messages

```javascript
errorTracking.captureMessage('User completed onboarding', 'info');
```

### Adding Breadcrumbs

```javascript
errorTracking.addBreadcrumb({
  category: 'user_action',
  message: 'User clicked submit button',
  data: { quizId: 123 },
});
```

### Tracking Performance

```javascript
const transaction = errorTracking.startTransaction('quiz_submission', 'task');

try {
  // Perform operation
  await submitQuiz(data);
  transaction.finish();
} catch (error) {
  transaction.setStatus('internal_error');
  transaction.finish();
  throw error;
}
```

Or use the helper:

```javascript
await errorTracking.measureOperation(
  'quiz_submission',
  'task',
  async () => {
    return await submitQuiz(data);
  }
);
```

### Screen Tracking

Screen tracking is automatic via navigation integration, but you can also track manually:

```javascript
errorTracking.trackScreenView('QuizScreen', { quizId: 123 });
```

## Development vs Production

### Development Mode

In development (`__DEV__ === true`):
- Error tracking is disabled by default
- Errors are logged to console
- Full debug output from Sentry

### Production Mode

In production:
- All errors are sent to Sentry
- User context is tracked
- Performance monitoring is enabled (20% sample rate)
- Profiling is enabled (10% sample rate)

## Testing

Test that Sentry is working:

```javascript
import { errorTracking } from './src/services/errorTracking';

// Send test error
errorTracking.testError();
```

This will send a test error and message to Sentry.

## Privacy Considerations

The following data is **NOT** sent to Sentry:
- Passwords
- Auth tokens
- Cookie data
- Any fields marked as sensitive

Sensitive headers are filtered in `beforeSend` hook.

## Error Filtering

The following errors are ignored:
- Network errors (temporary connection issues)
- User cancellations
- Common React Native warnings

You can add more filters in `src/services/errorTracking.js`.

## Viewing Errors

1. Log in to https://sentry.io
2. Select your project
3. View errors in the Issues tab
4. View performance in the Performance tab

## Alerts

Set up alerts in Sentry to notify you:
- When new errors occur
- When error rate spikes
- When performance degrades

Go to Alerts → Create Alert Rule in Sentry dashboard.

## Best Practices

1. **Don't Overuse Manual Capture**: Most errors are caught automatically
2. **Add Context**: Include relevant data with errors
3. **Use Breadcrumbs**: Track user flow leading to errors
4. **Monitor Performance**: Track critical operations
5. **Review Regularly**: Check Sentry dashboard weekly
6. **Set Up Alerts**: Get notified of critical issues
7. **Protect Sensitive Data**: Never send passwords or tokens

## Troubleshooting

### Errors Not Appearing

1. Check that Sentry is initialized: Look for "Sentry initialized successfully" in console
2. Verify DSN is correct in `.env`
3. Check network connectivity
4. Ensure you're in production mode or manually enabled tracking

### Source Maps Not Working

1. Run the Sentry wizard again: `npx @sentry/wizard -i reactNative`
2. Verify `.sentryclirc` has correct auth token
3. Check that source maps are uploaded after build

### Too Many Events

1. Reduce sample rates in `errorTracking.js`
2. Add more error filters to `ignoreErrors`
3. Upgrade Sentry plan if needed

## Resources

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Sentry Dashboard](https://sentry.io)
- [Error Tracking Best Practices](https://docs.sentry.io/product/best-practices/)

## Support

For issues with this integration, see:
- `/src/services/errorTracking.js` - Main configuration
- `/src/components/ErrorBoundary.js` - React error handling
- `/App.js` - Initialization and navigation tracking
