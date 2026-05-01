/**
 * Tests for Gamification System
 */

import {
  XP_REWARDS,
  LEVELS,
  calculateLevel,
  StreakManager,
  getDailyGoalProgress,
  AchievementManager,
  MilestoneTracker,
} from '../src/core/gamification';

describe('Gamification System', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
      expect(result.levelData.title).toBe('Poker Novice');
    });

    it('should return correct level for 1000 XP', () => {
      const result = calculateLevel(1000);
      expect(result.level).toBe(5);
    });

    it('should calculate progress correctly', () => {
      const result = calculateLevel(150);
      expect(result.level).toBe(2);
      expect(result.progress).toBeGreaterThan(0);
      expect(result.progress).toBeLessThan(1);
    });
  });

  describe('StreakManager', () => {
    it('should calculate streak correctly for consecutive days', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const diff = StreakManager.calculateStreak(yesterday, today);
      expect(diff).toBe(1);
    });

    it('should identify active streak', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const isActive = StreakManager.isStreakActive(yesterday);
      expect(isActive).toBe(true);
    });

    it('should identify broken streak', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const isActive = StreakManager.isStreakActive(threeDaysAgo);
      expect(isActive).toBe(false);
    });

    it('should return correct streak status', () => {
      const status = StreakManager.getStreakStatus(6);
      expect(status.emoji).toBe('🔥');
      expect(status.message).toContain('Heiß');
    });
  });

  describe('getDailyGoalProgress', () => {
    it('should calculate progress correctly', () => {
      const result = getDailyGoalProgress(50, 100);
      expect(result.progress).toBe(0.5);
      expect(result.achieved).toBe(false);
      expect(result.remaining).toBe(50);
    });

    it('should mark goal as achieved when met', () => {
      const result = getDailyGoalProgress(150, 100);
      expect(result.achieved).toBe(true);
      expect(result.remaining).toBe(0);
    });
  });

  describe('AchievementManager', () => {
    let manager;

    beforeEach(() => {
      manager = new AchievementManager();
    });

    it('should unlock achievement when requirement met', () => {
      const stats = {
        sessionsCompleted: 1,
      };

      const unlocked = manager.checkAchievements(stats);
      expect(unlocked.length).toBeGreaterThan(0);
      expect(unlocked[0].id).toBe('first_steps');
    });

    it('should not unlock same achievement twice', () => {
      const stats = {
        sessionsCompleted: 1,
      };

      manager.checkAchievements(stats);
      const secondCheck = manager.checkAchievements(stats);
      expect(secondCheck.length).toBe(0);
    });

    it('should calculate achievement progress', () => {
      const stats = {
        sessions_completed: 5,
      };

      const progress = manager.getProgress('DEDICATED_LEARNER', stats);
      expect(progress.current).toBe(5);
      expect(progress.required).toBe(10);
      expect(progress.percentage).toBe(50);
    });
  });

  describe('MilestoneTracker', () => {
    let tracker;

    beforeEach(() => {
      tracker = new MilestoneTracker();
    });

    it('should detect XP milestone', () => {
      const stats = {
        totalXP: 1000,
        questionsAnswered: 0,
        perfectScores: 0,
      };

      const milestones = tracker.checkMilestones(stats);
      expect(milestones.length).toBeGreaterThan(0);
      expect(milestones[0].type).toBe('xp');
    });

    it('should get next milestones', () => {
      const stats = {
        totalXP: 500,
        questionsAnswered: 50,
        perfectScores: 2,
      };

      const next = tracker.getNextMilestones(stats);
      expect(next.length).toBeGreaterThan(0);
      expect(next[0].progress).toBeGreaterThan(0);
    });
  });
});
