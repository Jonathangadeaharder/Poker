/**
 * Secure Storage Utility
 * Wrapper around expo-secure-store for encrypted token storage
 * Falls back to AsyncStorage if SecureStore unavailable
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Try to import SecureStore, fallback if not available
let SecureStore;
try {
  SecureStore = require('expo-secure-store');
} catch (e) {
  console.warn('expo-secure-store not available, falling back to AsyncStorage');
}

const STORAGE_PREFIX = '@secure_';

/**
 * Check if SecureStore is available on this platform
 */
const isSecureStoreAvailable = () => {
  return SecureStore && SecureStore.isAvailableAsync;
};

/**
 * Store sensitive data securely
 */
export async function setSecureItem(key, value) {
  const fullKey = STORAGE_PREFIX + key;

  try {
    if (isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(fullKey, value);
    } else {
      // Fallback to AsyncStorage (less secure but functional)
      await AsyncStorage.setItem(fullKey, value);
    }
    return { success: true };
  } catch (error) {
    console.error('Error storing secure item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieve sensitive data
 */
export async function getSecureItem(key) {
  const fullKey = STORAGE_PREFIX + key;

  try {
    let value;
    if (isSecureStoreAvailable()) {
      value = await SecureStore.getItemAsync(fullKey);
    } else {
      value = await AsyncStorage.getItem(fullKey);
    }
    return { success: true, value };
  } catch (error) {
    console.error('Error retrieving secure item:', error);
    return { success: false, error: error.message, value: null };
  }
}

/**
 * Delete sensitive data
 */
export async function deleteSecureItem(key) {
  const fullKey = STORAGE_PREFIX + key;

  try {
    if (isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(fullKey);
    } else {
      await AsyncStorage.removeItem(fullKey);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting secure item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Token Storage Wrapper
 * Convenience methods for auth tokens
 */
export const tokenStorage = {
  /**
   * Save authentication token
   */
  async saveAuthToken(token) {
    return setSecureItem('authToken', token);
  },

  /**
   * Get authentication token
   */
  async getAuthToken() {
    const result = await getSecureItem('authToken');
    return result.value;
  },

  /**
   * Save refresh token
   */
  async saveRefreshToken(token) {
    return setSecureItem('refreshToken', token);
  },

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    const result = await getSecureItem('refreshToken');
    return result.value;
  },

  /**
   * Save user ID
   */
  async saveUserId(userId) {
    return setSecureItem('userId', userId.toString());
  },

  /**
   * Get user ID
   */
  async getUserId() {
    const result = await getSecureItem('userId');
    return result.value;
  },

  /**
   * Clear all auth data
   */
  async clearAuthData() {
    await deleteSecureItem('authToken');
    await deleteSecureItem('refreshToken');
    await deleteSecureItem('userId');
  },
};

export default tokenStorage;
