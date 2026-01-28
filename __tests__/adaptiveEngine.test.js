/**
 * Tests for Adaptive Learning Engine
 */

import {
  DIFFICULTY_LEVELS,
  PerformanceTracker,
  AdaptiveEngine,
} from '../src/core/adaptiveEngine';

describe('Adaptive Learning Engine', () => {
  describe('PerformanceTracker', () => {
    let tracker;

    beforeEach(() => {
      tracker = new PerformanceTracker();
    });

    it('should record answers', () => {
      tracker.recordAnswer('q1', true, 5000, DIFFICULTY_LEVELS.EASY);
      expect(tracker.history.length).toBe(1);
      expect(tracker.currentStreak).toBe(1);
    });

    it('should update streaks on correct answers', () => {
      tracker.recordAnswer('q1', true, 5000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q2', true, 4000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q3', true, 3000, DIFFICULTY_LEVELS.MEDIUM);

      expect(tracker.currentStreak).toBe(3);
      expect(tracker.longestStreak).toBe(3);
    });

    it('should reset streak on incorrect answer', () => {
      tracker.recordAnswer('q1', true, 5000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q2', true, 4000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q3', false, 10000, DIFFICULTY_LEVELS.HARD);

      expect(tracker.currentStreak).toBe(0);
      expect(tracker.longestStreak).toBe(2);
    });

    it('should calculate recent accuracy', () => {
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, i < 7, 5000, DIFFICULTY_LEVELS.EASY);
      }

      const accuracy = tracker.getRecentAccuracy(10);
      expect(accuracy).toBeCloseTo(0.7, 2);
    });

    it('should calculate accuracy by difficulty', () => {
      tracker.recordAnswer('q1', true, 5000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q2', true, 5000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q3', false, 5000, DIFFICULTY_LEVELS.EASY);
      tracker.recordAnswer('q4', true, 5000, DIFFICULTY_LEVELS.HARD);

      const easyAccuracy = tracker.getAccuracyByDifficulty(DIFFICULTY_LEVELS.EASY);
      expect(easyAccuracy).toBeCloseTo(0.667, 2);
    });

    it('should calculate learning velocity', () => {
      // Simulate improving performance
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, i < 5, 5000, DIFFICULTY_LEVELS.EASY);
      }
      for (let i = 10; i < 20; i++) {
        tracker.recordAnswer(`q${i}`, i < 18, 5000, DIFFICULTY_LEVELS.EASY);
      }

      const velocity = tracker.getLearningVelocity();
      expect(velocity).toBeGreaterThan(0); // Improving
    });

    it('should identify weak topics', () => {
      // Perform poorly on HARD questions
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, false, 5000, DIFFICULTY_LEVELS.HARD);
      }

      const weakTopics = tracker.getWeakTopics();
      expect(weakTopics.length).toBeGreaterThan(0);
      expect(weakTopics[0].topic).toBe(DIFFICULTY_LEVELS.HARD);
    });
  });

  describe('AdaptiveEngine', () => {
    let tracker, engine;

    beforeEach(() => {
      tracker = new PerformanceTracker();
      engine = new AdaptiveEngine(tracker);
    });

    it('should start at easy difficulty', () => {
      expect(engine.currentDifficulty).toBe(DIFFICULTY_LEVELS.EASY);
    });

    it('should increase difficulty on high performance', () => {
      // Simulate high performance
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, true, 3000, DIFFICULTY_LEVELS.EASY);
      }

      const recommended = engine.getRecommendedDifficulty();
      expect(recommended).not.toBe(DIFFICULTY_LEVELS.EASY);
    });

    it('should decrease difficulty on poor performance', () => {
      engine.currentDifficulty = DIFFICULTY_LEVELS.HARD;

      // Simulate poor performance
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, i < 4, 8000, DIFFICULTY_LEVELS.HARD);
      }

      const recommended = engine.getRecommendedDifficulty();
      expect(recommended).toBe(DIFFICULTY_LEVELS.MEDIUM);
    });

    it('should generate question selection weights', () => {
      const weights = engine.getQuestionSelectionWeights();

      expect(weights[DIFFICULTY_LEVELS.EASY]).toBeGreaterThan(0);
      expect(weights[DIFFICULTY_LEVELS.MEDIUM]).toBeGreaterThan(0);

      // Weights should sum to approximately 1
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 1);
    });

    it('should select next question difficulty', () => {
      const difficulty = engine.selectNextQuestionDifficulty();
      expect(Object.values(DIFFICULTY_LEVELS)).toContain(difficulty);
    });

    it('should provide personalized learning path', () => {
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, i < 7, 5000, DIFFICULTY_LEVELS.EASY);
      }

      const path = engine.getPersonalizedLearningPath();
      expect(path.currentDifficulty).toBeDefined();
      expect(path.recentAccuracy).toBeCloseTo(0.7, 1);
      expect(path.focusAreas).toBeDefined();
      expect(path.nextSteps).toBeDefined();
    });

    it('should track difficulty changes', () => {
      // Trigger difficulty increase
      for (let i = 0; i < 10; i++) {
        tracker.recordAnswer(`q${i}`, true, 3000, DIFFICULTY_LEVELS.EASY);
      }

      engine.getRecommendedDifficulty();
      expect(engine.difficultyHistory.length).toBeGreaterThan(0);
    });
  });
});
