/**
 * useSyncService Hook
 * Manages sync service lifecycle and prevents memory leaks
 */

import { useEffect } from 'react';
import syncService from '../services/syncService';

/**
 * Initialize and cleanup sync service
 * @param {boolean} autoSync - Enable automatic background sync
 * @param {number} intervalMinutes - Sync interval in minutes
 */
export function useSyncService(autoSync = true, intervalMinutes = 15) {
  useEffect(() => {
    let cancelled = false;

    // Initialize sync service
    const initializeSync = async () => {
      try {
        await syncService.initialize();

        if (!cancelled && autoSync) {
          await syncService.enableAutoSync(intervalMinutes);
        }
      } catch (error) {
        console.error('Failed to initialize sync service:', error);
      }
    };

    initializeSync();

    // Cleanup on unmount
    return () => {
      cancelled = true;
      syncService.stopAutoSync();
    };
  }, [autoSync, intervalMinutes]);

  return syncService;
}

export default useSyncService;
