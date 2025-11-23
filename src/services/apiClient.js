/**
 * API Client Service Layer
 * Centralized API communication for backend integration
 * Supports authentication, sync, analytics, and hand history uploads
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.pokertraining.app';
const API_VERSION = 'v1';
const API_TIMEOUT = 30000; // 30 seconds

class ApiClient {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_VERSION}`;
    this.authToken = null;
    this.refreshToken = null;
    this.userId = null;
  }

  /**
   * Set authentication tokens
   */
  setAuth(authToken, refreshToken, userId) {
    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.authToken = null;
    this.refreshToken = null;
    this.userId = null;
  }

  /**
   * Get authorization headers
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Make HTTP request with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.includeAuth !== false),
      timeout: options.timeout || API_TIMEOUT,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired - try to refresh
          const refreshed = await this.refreshAuthToken();
          if (refreshed) {
            // Retry original request
            return this.request(endpoint, options);
          }
          throw new Error('Authentication failed');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Refresh auth token
   */
  async refreshAuthToken() {
    if (!this.refreshToken) return false;

    const result = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
      includeAuth: false,
    });

    if (result.success && result.data.authToken) {
      this.setAuth(result.data.authToken, result.data.refreshToken, result.data.userId);
      return true;
    }

    return false;
  }

  // ========== AUTHENTICATION ==========

  /**
   * Register new user
   */
  async register(email, password, username) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
      includeAuth: false,
    });
  }

  /**
   * Login user
   */
  async login(email, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    });

    if (result.success && result.data.authToken) {
      this.setAuth(
        result.data.authToken,
        result.data.refreshToken,
        result.data.userId
      );
    }

    return result;
  }

  /**
   * Logout user
   */
  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearAuth();
    return result;
  }

  /**
   * Get current user profile
   */
  async getUserProfile() {
    return this.request('/users/me');
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ========== DATA SYNC ==========

  /**
   * Sync user progress to cloud
   */
  async syncProgressToCloud(progressData) {
    return this.request('/sync/progress', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        progress: progressData,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  /**
   * Get user progress from cloud
   */
  async getProgressFromCloud() {
    return this.request('/sync/progress');
  }

  /**
   * Sync spaced repetition data
   */
  async syncSRSData(decks) {
    return this.request('/sync/srs', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        decks,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  /**
   * Get SRS data from cloud
   */
  async getSRSData() {
    return this.request('/sync/srs');
  }

  /**
   * Full sync (progress + SRS + achievements)
   */
  async fullSync(localData) {
    return this.request('/sync/full', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        data: localData,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // ========== HAND HISTORY ==========

  /**
   * Upload hand history file
   */
  async uploadHandHistory(file, format = 'pokerstars') {
    const formData = new FormData();
    formData.append('handHistory', file);
    formData.append('format', format);
    formData.append('userId', this.userId);

    return this.request('/hands/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        // Don't set Content-Type - let browser set it with boundary
      },
    });
  }

  /**
   * Get hand history analysis
   */
  async getHandAnalysis(handId) {
    return this.request(`/hands/${handId}/analysis`);
  }

  /**
   * Get user's hand history list
   */
  async getHandHistoryList(page = 1, limit = 20) {
    return this.request(`/hands?page=${page}&limit=${limit}`);
  }

  /**
   * Request hand analysis (AI-powered)
   */
  async requestHandAnalysis(handId, analysisType = 'gto') {
    return this.request(`/hands/${handId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ analysisType }),
    });
  }

  // ========== ANALYTICS ==========

  /**
   * Submit session data
   */
  async submitSessionData(sessionData) {
    return this.request('/analytics/session', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        ...sessionData,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(timeRange = '30d') {
    return this.request(`/analytics/user?range=${timeRange}`);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(category = 'xp', limit = 100) {
    return this.request(`/leaderboard?category=${category}&limit=${limit}`);
  }

  /**
   * Track event (for analytics)
   */
  async trackEvent(eventName, eventData = {}) {
    return this.request('/analytics/event', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // ========== ACHIEVEMENTS ==========

  /**
   * Get user achievements
   */
  async getAchievements() {
    return this.request('/achievements');
  }

  /**
   * Unlock achievement
   */
  async unlockAchievement(achievementId) {
    return this.request('/achievements/unlock', {
      method: 'POST',
      body: JSON.stringify({ achievementId }),
    });
  }

  // ========== CONTENT ==========

  /**
   * Get latest questions/content
   */
  async getLatestContent(category = 'all') {
    return this.request(`/content?category=${category}`);
  }

  /**
   * Submit question feedback
   */
  async submitQuestionFeedback(questionId, feedback) {
    return this.request('/content/feedback', {
      method: 'POST',
      body: JSON.stringify({
        questionId,
        feedback,
        userId: this.userId,
      }),
    });
  }

  // ========== ADAPTIVE ENGINE ==========

  /**
   * Get recommended questions based on performance
   */
  async getRecommendedQuestions(count = 10) {
    return this.request(`/adaptive/recommend?count=${count}`);
  }

  /**
   * Submit answer for adaptive tracking
   */
  async submitAnswer(questionId, correct, timeSpent) {
    return this.request('/adaptive/answer', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        questionId,
        correct,
        timeSpent,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  /**
   * Get difficulty adjustment recommendations
   */
  async getDifficultyRecommendation() {
    return this.request('/adaptive/difficulty');
  }
}

// Singleton instance
const apiClient = new ApiClient();

// Export both class and instance
export default apiClient;
export { ApiClient };
