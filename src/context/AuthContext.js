/**
 * Authentication Context
 * Global state management for user authentication
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { tokenStorage } from '../utils/secureStorage';
import { sessionManager } from '../utils/sessionManager';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize authentication state from stored tokens
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Try to load stored auth data
      const authToken = await tokenStorage.getAuthToken();
      const userId = await tokenStorage.getUserId();

      if (authToken && userId) {
        // Initialize API client with stored tokens
        await apiClient.initializeFromStorage();

        // Verify token is still valid
        const result = await apiClient.request('/auth/verify', {
          method: 'POST',
        });

        if (result.success && result.data.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);

          // Start session monitoring
          sessionManager.startSession();
        } else {
          // Token invalid, clear auth
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    try {
      const result = await apiClient.login(email, password);

      if (result.success && result.data.user) {
        setUser(result.data.user);
        setIsAuthenticated(true);

        // Start session monitoring
        sessionManager.startSession();

        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  };

  /**
   * Register new user
   */
  const register = async (email, password, username) => {
    try {
      const result = await apiClient.register(email, password, username);

      if (result.success && result.data.user) {
        setUser(result.data.user);
        setIsAuthenticated(true);

        // Start session monitoring
        sessionManager.startSession();

        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  };

  /**
   * Logout and clear auth state
   */
  const logout = useCallback(async () => {
    try {
      // Notify backend
      await apiClient.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuth();
    }
  }, []);

  /**
   * Clear all auth state
   */
  const clearAuth = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await apiClient.clearAuth();
    sessionManager.endSession();
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const result = await apiClient.request('/auth/me', {
        method: 'GET',
      });

      if (result.success && result.data.user) {
        setUser(result.data.user);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    try {
      const result = await apiClient.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (result.success && result.data.user) {
        setUser(result.data.user);
        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Profile update failed',
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  /**
   * Handle session timeout
   */
  useEffect(() => {
    const handleTimeout = () => {
      console.log('Session timeout - logging out');
      logout();
    };

    sessionManager.setTimeoutHandler(handleTimeout);

    return () => {
      sessionManager.clearTimeoutHandler();
    };
  }, [logout]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export default AuthContext;
