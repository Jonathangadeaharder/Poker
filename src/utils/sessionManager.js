/**
 * Session Manager
 * Handles user session tracking and automatic timeout
 */

import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SessionManager {
  constructor() {
    this.timeoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.timeoutId = null;
    this.lastActivityTime = Date.now();
    this.isSessionActive = false;
    this.timeoutHandler = null;
    this.appStateListener = null;
  }

  /**
   * Start monitoring user session
   */
  startSession() {
    this.isSessionActive = true;
    this.lastActivityTime = Date.now();
    this.saveLastActivityTime();

    // Reset any existing timeout
    this.resetTimeout();

    // Monitor app state changes
    this.setupAppStateListener();

    console.log('Session started');
  }

  /**
   * End session monitoring
   */
  endSession() {
    this.isSessionActive = false;
    this.clearTimeout();
    this.removeAppStateListener();
    this.clearLastActivityTime();

    console.log('Session ended');
  }

  /**
   * Reset the inactivity timeout
   */
  resetTimeout() {
    // Clear existing timeout
    this.clearTimeout();

    // Start new timeout
    this.timeoutId = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.timeoutDuration);

    // Update last activity time
    this.lastActivityTime = Date.now();
    this.saveLastActivityTime();
  }

  /**
   * Clear the timeout
   */
  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Handle session timeout
   */
  handleSessionTimeout() {
    console.log('Session timed out due to inactivity');

    if (this.timeoutHandler) {
      this.timeoutHandler();
    }

    this.endSession();
  }

  /**
   * Set the handler to call on timeout
   */
  setTimeoutHandler(handler) {
    this.timeoutHandler = handler;
  }

  /**
   * Clear the timeout handler
   */
  clearTimeoutHandler() {
    this.timeoutHandler = null;
  }

  /**
   * Check if session should timeout based on stored activity time
   */
  async checkSessionValidity() {
    try {
      const lastActivityStr = await AsyncStorage.getItem('lastActivityTime');

      if (!lastActivityStr) {
        return false;
      }

      const lastActivity = parseInt(lastActivityStr, 10);
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      // If more than timeout duration has passed, session is invalid
      if (timeSinceActivity > this.timeoutDuration) {
        console.log('Session expired while app was closed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  /**
   * Save last activity time to storage
   */
  async saveLastActivityTime() {
    try {
      await AsyncStorage.setItem('lastActivityTime', this.lastActivityTime.toString());
    } catch (error) {
      console.error('Error saving last activity time:', error);
    }
  }

  /**
   * Clear last activity time from storage
   */
  async clearLastActivityTime() {
    try {
      await AsyncStorage.removeItem('lastActivityTime');
    } catch (error) {
      console.error('Error clearing last activity time:', error);
    }
  }

  /**
   * Setup app state listener to handle app backgrounding
   */
  setupAppStateListener() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground
        this.handleAppResume();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background
        this.handleAppBackground();
      }
    });
  }

  /**
   * Remove app state listener
   */
  removeAppStateListener() {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
  }

  /**
   * Handle app resuming from background
   */
  async handleAppResume() {
    if (!this.isSessionActive) {
      return;
    }

    // Check if session should have timed out while app was in background
    const isValid = await this.checkSessionValidity();

    if (!isValid) {
      // Session expired while in background
      this.handleSessionTimeout();
    } else {
      // Session still valid, reset timeout
      this.resetTimeout();
    }
  }

  /**
   * Handle app going to background
   */
  handleAppBackground() {
    if (!this.isSessionActive) {
      return;
    }

    // Save current activity time
    this.saveLastActivityTime();
  }

  /**
   * Record user activity
   * Call this on user interactions to keep session alive
   */
  recordActivity() {
    if (!this.isSessionActive) {
      return;
    }

    this.resetTimeout();
  }

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingTime() {
    if (!this.isSessionActive) {
      return 0;
    }

    const timeSinceActivity = Date.now() - this.lastActivityTime;
    const remaining = this.timeoutDuration - timeSinceActivity;

    return Math.max(0, remaining);
  }

  /**
   * Get remaining session time in minutes
   */
  getRemainingMinutes() {
    return Math.ceil(this.getRemainingTime() / 60000);
  }

  /**
   * Set custom timeout duration
   */
  setTimeoutDuration(minutes) {
    this.timeoutDuration = minutes * 60 * 1000;

    if (this.isSessionActive) {
      this.resetTimeout();
    }
  }

  /**
   * Check if session is active
   */
  isActive() {
    return this.isSessionActive;
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();

export default sessionManager;
