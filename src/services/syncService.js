/**
 * Sync Service
 * Handles synchronization of local data with backend
 * Supports offline-first architecture with conflict resolution
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

const SYNC_KEYS = {
  LAST_SYNC: 'lastSync',
  PENDING_SYNC: 'pendingSync',
  SYNC_ENABLED: 'syncEnabled',
};

class SyncService {
  constructor() {
    this.syncInProgress = false;
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.syncInterval = null;
  }

  /**
   * Initialize sync service
   */
  async initialize() {
    const lastSync = await AsyncStorage.getItem(SYNC_KEYS.LAST_SYNC);
    if (lastSync) {
      this.lastSyncTime = new Date(lastSync);
    }

    const syncEnabled = await AsyncStorage.getItem(SYNC_KEYS.SYNC_ENABLED);
    if (syncEnabled === 'true') {
      this.startAutoSync();
    }
  }

  /**
   * Enable automatic syncing
   */
  async enableAutoSync(intervalMinutes = 15) {
    await AsyncStorage.setItem(SYNC_KEYS.SYNC_ENABLED, 'true');
    this.startAutoSync(intervalMinutes);
  }

  /**
   * Disable automatic syncing
   */
  async disableAutoSync() {
    await AsyncStorage.setItem(SYNC_KEYS.SYNC_ENABLED, 'false');
    this.stopAutoSync();
  }

  /**
   * Start automatic sync interval
   */
  startAutoSync(intervalMinutes = 15) {
    this.stopAutoSync(); // Clear any existing interval

    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Queue item for sync
   */
  async queueForSync(key, data) {
    const pending = await this.getPendingSyncs();
    pending.push({
      key,
      data,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(
      SYNC_KEYS.PENDING_SYNC,
      JSON.stringify(pending)
    );
  }

  /**
   * Get pending syncs
   */
  async getPendingSyncs() {
    const pending = await AsyncStorage.getItem(SYNC_KEYS.PENDING_SYNC);
    return pending ? JSON.parse(pending) : [];
  }

  /**
   * Clear pending syncs
   */
  async clearPendingSyncs() {
    await AsyncStorage.removeItem(SYNC_KEYS.PENDING_SYNC);
  }

  /**
   * Sync all local data to cloud
   */
  async syncAll(forceSync = false) {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return { success: false, message: 'Sync in progress' };
    }

    // Check if logged in
    if (!apiClient.authToken) {
      return { success: false, message: 'Not authenticated' };
    }

    this.syncInProgress = true;

    try {
      // Gather all local data
      const localData = await this.gatherLocalData();

      // Check if sync needed
      if (!forceSync && !this.isSyncNeeded(localData)) {
        this.syncInProgress = false;
        return { success: true, message: 'No sync needed', skipped: true };
      }

      // Upload to cloud
      const result = await apiClient.fullSync(localData);

      if (result.success) {
        // Update last sync time
        this.lastSyncTime = new Date();
        await AsyncStorage.setItem(
          SYNC_KEYS.LAST_SYNC,
          this.lastSyncTime.toISOString()
        );

        // Clear pending syncs
        await this.clearPendingSyncs();

        // Handle conflicts if any
        if (result.data.conflicts) {
          await this.resolveConflicts(result.data.conflicts);
        }

        this.syncInProgress = false;
        return {
          success: true,
          message: 'Sync successful',
          syncedAt: this.lastSyncTime,
        };
      }

      this.syncInProgress = false;
      return result;

    } catch (error) {
      console.error('Sync error:', error);
      this.syncInProgress = false;
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Gather all local data for sync
   */
  async gatherLocalData() {
    const data = {};

    // Get all relevant keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const relevantKeys = keys.filter(key =>
      key.startsWith('user_') ||
      key.startsWith('progress_') ||
      key.startsWith('srs_') ||
      key.startsWith('achievements_') ||
      key.startsWith('analytics_')
    );

    // Fetch all relevant data
    const values = await AsyncStorage.multiGet(relevantKeys);

    values.forEach(([key, value]) => {
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch (e) {
          data[key] = value;
        }
      }
    });

    // Add pending syncs
    data.pendingChanges = await this.getPendingSyncs();

    return data;
  }

  /**
   * Check if sync is needed
   */
  isSyncNeeded(localData) {
    // Always sync if there are pending changes
    if (localData.pendingChanges && localData.pendingChanges.length > 0) {
      return true;
    }

    // Sync if last sync was more than 1 hour ago
    if (!this.lastSyncTime) return true;

    const hoursSinceSync = (new Date() - this.lastSyncTime) / (1000 * 60 * 60);
    return hoursSinceSync >= 1;
  }

  /**
   * Resolve sync conflicts
   * Strategy: Server wins for achievements/unlocks, latest timestamp wins for progress
   */
  async resolveConflicts(conflicts) {
    for (const conflict of conflicts) {
      const { key, serverValue, localValue, serverTimestamp, localTimestamp } = conflict;

      let resolvedValue;

      if (key.startsWith('achievements_')) {
        // Server wins for achievements (union of both)
        resolvedValue = this.mergeAchievements(serverValue, localValue);
      } else if (key.startsWith('progress_')) {
        // Latest timestamp wins
        resolvedValue = new Date(serverTimestamp) > new Date(localTimestamp)
          ? serverValue
          : localValue;
      } else {
        // Default: server wins
        resolvedValue = serverValue;
      }

      // Save resolved value locally
      await AsyncStorage.setItem(key, JSON.stringify(resolvedValue));
    }
  }

  /**
   * Merge achievements (union)
   */
  mergeAchievements(server, local) {
    const merged = { ...server };

    // Add any local achievements not in server
    Object.keys(local).forEach(achievementId => {
      if (!merged[achievementId]) {
        merged[achievementId] = local[achievementId];
      }
    });

    return merged;
  }

  /**
   * Pull latest data from cloud
   */
  async pullFromCloud() {
    try {
      const result = await apiClient.getProgressFromCloud();

      if (result.success && result.data) {
        // Save cloud data locally
        await this.saveCloudDataLocally(result.data);

        return {
          success: true,
          message: 'Data pulled successfully',
        };
      }

      return result;

    } catch (error) {
      console.error('Pull error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Save cloud data locally
   */
  async saveCloudDataLocally(cloudData) {
    const entries = Object.entries(cloudData).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);

    await AsyncStorage.multiSet(entries);
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    const pending = await this.getPendingSyncs();

    return {
      lastSync: this.lastSyncTime,
      pendingChanges: pending.length,
      syncInProgress: this.syncInProgress,
      autoSyncEnabled: this.syncInterval !== null,
    };
  }

  /**
   * Force sync now
   */
  async forceSyncNow() {
    return this.syncAll(true);
  }
}

// Singleton instance
const syncService = new SyncService();

export default syncService;
export { SyncService };
