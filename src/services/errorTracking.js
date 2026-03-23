/**
 * Error Tracking Service
 * Centralized error reporting with Sentry integration
 */

import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

// Environment configuration
const SENTRY_DSN = process.env.SENTRY_DSN || '';
const ENVIRONMENT = __DEV__ ? 'development' : 'production';
const ENABLED = !__DEV__ && SENTRY_DSN.length > 0;

class ErrorTrackingService {
  constructor() {
    this.initialized = false;
    this.enabled = ENABLED;
  }

  /**
   * Initialize Sentry with configuration
   */
  initialize() {
    if (!this.enabled) {
      console.log('Error tracking disabled (dev mode or missing DSN)');
      return;
    }

    try {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT,

        // Enable tracing for performance monitoring
        enableTracing: true,
        tracesSampleRate: 0.2, // 20% of transactions

        // Enable profiling
        profilesSampleRate: 0.1, // 10% of transactions

        // Capture app version
        release: require('../../package.json').version,

        // Capture platform info
        beforeSend(event, hint) {
          // Add custom context
          event.contexts = {
            ...event.contexts,
            device: {
              platform: Platform.OS,
              version: Platform.Version,
            },
          };

          // Filter sensitive data
          if (event.request?.headers) {
            delete event.request.headers.Authorization;
            delete event.request.headers.Cookie;
          }

          return event;
        },

        // Ignore specific errors
        ignoreErrors: [
          // Network errors
          'Network request failed',
          'NetworkError',
          'timeout',

          // Common React Native warnings
          'VirtualizedLists should never be nested',
          'Require cycle',

          // User cancellations
          'AbortError',
          'User cancelled',
        ],

        // Enable native crash reporting
        enableNative: true,
        enableNativeCrashHandling: true,

        // Enable auto session tracking
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000, // 30 seconds

        // Attach stack traces
        attachStacktrace: true,

        // Debug mode
        debug: __DEV__,
      });

      this.initialized = true;
      console.log('Sentry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Set user context
   */
  setUser(user) {
    if (!this.enabled) return;

    try {
      Sentry.setUser({
        id: user?.id || user?.userId,
        email: user?.email,
        username: user?.username,
      });
    } catch (error) {
      console.error('Failed to set Sentry user:', error);
    }
  }

  /**
   * Clear user context (on logout)
   */
  clearUser() {
    if (!this.enabled) return;

    try {
      Sentry.setUser(null);
    } catch (error) {
      console.error('Failed to clear Sentry user:', error);
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(breadcrumb) {
    if (!this.enabled) return;

    try {
      Sentry.addBreadcrumb({
        timestamp: Date.now() / 1000,
        ...breadcrumb,
      });
    } catch (error) {
      console.error('Failed to add breadcrumb:', error);
    }
  }

  /**
   * Set custom context
   */
  setContext(key, context) {
    if (!this.enabled) return;

    try {
      Sentry.setContext(key, context);
    } catch (error) {
      console.error('Failed to set context:', error);
    }
  }

  /**
   * Set custom tag
   */
  setTag(key, value) {
    if (!this.enabled) return;

    try {
      Sentry.setTag(key, value);
    } catch (error) {
      console.error('Failed to set tag:', error);
    }
  }

  /**
   * Capture error manually
   */
  captureError(error, context = {}) {
    if (!this.enabled) {
      console.error('Error (not sent to Sentry):', error);
      return;
    }

    try {
      Sentry.withScope((scope) => {
        // Add custom context
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });

        // Capture the error
        Sentry.captureException(error);
      });
    } catch (err) {
      console.error('Failed to capture error:', err);
    }
  }

  /**
   * Capture message
   */
  captureMessage(message, level = 'info', context = {}) {
    if (!this.enabled) {
      console.log(`Message (not sent to Sentry): ${message}`);
      return;
    }

    try {
      Sentry.withScope((scope) => {
        // Add custom context
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });

        // Set level
        scope.setLevel(level);

        // Capture the message
        Sentry.captureMessage(message);
      });
    } catch (error) {
      console.error('Failed to capture message:', error);
    }
  }

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction(name, operation = 'navigation') {
    if (!this.enabled) return null;

    try {
      return Sentry.startTransaction({
        name,
        op: operation,
      });
    } catch (error) {
      console.error('Failed to start transaction:', error);
      return null;
    }
  }

  /**
   * Measure operation performance
   */
  async measureOperation(name, operation, callback) {
    const transaction = this.startTransaction(name, operation);

    try {
      const result = await callback();
      transaction?.finish();
      return result;
    } catch (error) {
      transaction?.setStatus('internal_error');
      transaction?.finish();
      this.captureError(error, {
        operation: {
          name,
          type: operation,
        },
      });
      throw error;
    }
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName, params = {}) {
    this.addBreadcrumb({
      type: 'navigation',
      category: 'navigation',
      message: `Navigated to ${screenName}`,
      data: params,
    });

    this.setContext('screen', {
      name: screenName,
      params,
    });
  }

  /**
   * Track user action
   */
  trackAction(action, data = {}) {
    this.addBreadcrumb({
      type: 'user',
      category: 'user_action',
      message: action,
      data,
    });
  }

  /**
   * Track API call
   */
  trackAPICall(endpoint, method, statusCode, duration) {
    this.addBreadcrumb({
      type: 'http',
      category: 'api',
      message: `${method} ${endpoint}`,
      data: {
        status_code: statusCode,
        duration_ms: duration,
      },
    });
  }

  /**
   * Test error tracking (for development)
   */
  testError() {
    this.captureMessage('Test message from errorTracking service', 'info');
    this.captureError(new Error('Test error from errorTracking service'));
  }
}

// Export singleton instance
export const errorTracking = new ErrorTrackingService();

export default errorTracking;
