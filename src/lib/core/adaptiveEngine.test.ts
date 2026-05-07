import { beforeEach, describe, expect, it } from 'vitest';
import { AdaptiveEngine, DIFFICULTY_LEVELS, PerformanceTracker } from './adaptiveEngine';

let tracker: PerformanceTracker;
let engine: AdaptiveEngine;

beforeEach(() => {
	tracker = new PerformanceTracker();
	engine = new AdaptiveEngine(tracker);
});

describe('PerformanceTracker', () => {
	it('initializes with empty state', () => {
		expect(tracker.history).toHaveLength(0);
		expect(tracker.currentStreak).toBe(0);
		expect(tracker.longestStreak).toBe(0);
	});

	describe('recordAnswer', () => {
		it('adds entry to history', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			expect(tracker.history).toHaveLength(1);
			expect(tracker.history[0].questionId).toBe('q1');
			expect(tracker.history[0].correct).toBe(true);
		});

		it('increments streak on correct', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			tracker.recordAnswer('q2', true, 5000, 'easy');
			expect(tracker.currentStreak).toBe(2);
		});

		it('resets streak on incorrect', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			tracker.recordAnswer('q2', false, 5000, 'easy');
			expect(tracker.currentStreak).toBe(0);
		});

		it('tracks longest streak', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			tracker.recordAnswer('q2', true, 5000, 'easy');
			tracker.recordAnswer('q3', false, 5000, 'easy');
			tracker.recordAnswer('q4', true, 5000, 'easy');
			tracker.recordAnswer('q5', true, 5000, 'easy');
			tracker.recordAnswer('q6', true, 5000, 'easy');
			expect(tracker.longestStreak).toBe(3);
		});

		it('caps history at 100 entries', () => {
			for (let i = 0; i < 110; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			expect(tracker.history).toHaveLength(100);
		});
	});

	describe('getRecentAccuracy', () => {
		it('returns 0 for empty history', () => {
			expect(tracker.getRecentAccuracy()).toBe(0);
		});

		it('calculates accuracy correctly', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			tracker.recordAnswer('q2', false, 5000, 'easy');
			tracker.recordAnswer('q3', true, 5000, 'easy');
			expect(tracker.getRecentAccuracy(3)).toBeCloseTo(2 / 3, 2);
		});

		it('limits to last N entries', () => {
			for (let i = 0; i < 20; i++) {
				tracker.recordAnswer(`q${i}`, i < 15, 5000, 'easy');
			}
			expect(tracker.getRecentAccuracy(5)).toBe(0); // Last 5 are all incorrect (q15-q19: i < 15 is false)
		});
	});

	describe('getAccuracyByDifficulty', () => {
		it('returns null for no matching entries', () => {
			expect(tracker.getAccuracyByDifficulty('hard')).toBeNull();
		});

		it('filters by difficulty', () => {
			tracker.recordAnswer('q1', true, 5000, 'easy');
			tracker.recordAnswer('q2', false, 5000, 'hard');
			tracker.recordAnswer('q3', true, 5000, 'easy');
			expect(tracker.getAccuracyByDifficulty('easy')).toBe(1);
			expect(tracker.getAccuracyByDifficulty('hard')).toBe(0);
		});
	});

	describe('getAverageTimeByDifficulty', () => {
		it('returns null for no matching entries', () => {
			expect(tracker.getAverageTimeByDifficulty('hard')).toBeNull();
		});

		it('calculates average time', () => {
			tracker.recordAnswer('q1', true, 1000, 'easy');
			tracker.recordAnswer('q2', true, 3000, 'easy');
			expect(tracker.getAverageTimeByDifficulty('easy')).toBe(2000);
		});
	});

	describe('getLearningVelocity', () => {
		it('returns 0 for insufficient data', () => {
			expect(tracker.getLearningVelocity()).toBe(0);
		});

		it('returns positive when improving', () => {
			// First 10: 50% accuracy
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 5, 5000, 'easy');
			}
			// Last 10: 100% accuracy
			for (let i = 10; i < 20; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			expect(tracker.getLearningVelocity()).toBeGreaterThan(0);
		});

		it('returns negative when declining', () => {
			// First 10: 100% accuracy
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			// Last 10: 50% accuracy
			for (let i = 10; i < 20; i++) {
				tracker.recordAnswer(`q${i}`, i < 15, 5000, 'easy');
			}
			expect(tracker.getLearningVelocity()).toBeLessThan(0);
		});
	});

	describe('getWeakTopics', () => {
		it('returns empty for no history', () => {
			expect(tracker.getWeakTopics()).toHaveLength(0);
		});

		it('returns topics with <70% accuracy and >=5 attempts', () => {
			for (let i = 0; i < 5; i++) {
				tracker.recordAnswer(`q${i}`, i < 2, 5000, 'hard');
			}
			const weak = tracker.getWeakTopics();
			expect(weak).toHaveLength(1);
			expect(weak[0].topic).toBe('hard');
			expect(weak[0].accuracy).toBeCloseTo(0.4, 1);
		});

		it('excludes topics with >=70% accuracy', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 8, 5000, 'easy');
			}
			expect(tracker.getWeakTopics()).toHaveLength(0);
		});

		it('excludes topics with <5 attempts', () => {
			for (let i = 0; i < 3; i++) {
				tracker.recordAnswer(`q${i}`, false, 5000, 'hard');
			}
			expect(tracker.getWeakTopics()).toHaveLength(0);
		});
	});
});

describe('AdaptiveEngine', () => {
	it('initializes with easy difficulty', () => {
		expect(engine.currentDifficulty).toBe(DIFFICULTY_LEVELS.EASY);
	});

	describe('getRecommendedDifficulty', () => {
		it('returns easy for insufficient data', () => {
			expect(engine.getRecommendedDifficulty()).toBe(DIFFICULTY_LEVELS.EASY);
		});

		it('increases difficulty when accuracy >85%', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			const recommended = engine.getRecommendedDifficulty();
			expect(recommended).toBe(DIFFICULTY_LEVELS.MEDIUM);
		});

		it('decreases difficulty when accuracy <50%', () => {
			engine.currentDifficulty = DIFFICULTY_LEVELS.MEDIUM;
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 3, 5000, 'medium');
			}
			const recommended = engine.getRecommendedDifficulty();
			expect(recommended).toBe(DIFFICULTY_LEVELS.EASY);
		});

		it('maintains difficulty when accuracy is 50-85%', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 7, 5000, 'easy');
			}
			const recommended = engine.getRecommendedDifficulty();
			expect(recommended).toBe(DIFFICULTY_LEVELS.EASY);
		});

		it('tracks difficulty history', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			engine.getRecommendedDifficulty();
			expect(engine.difficultyHistory.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('increaseDifficulty', () => {
		it('moves from easy to medium', () => {
			expect(engine.increaseDifficulty(DIFFICULTY_LEVELS.EASY)).toBe(DIFFICULTY_LEVELS.MEDIUM);
		});

		it('does not exceed expert', () => {
			expect(engine.increaseDifficulty(DIFFICULTY_LEVELS.EXPERT)).toBe(DIFFICULTY_LEVELS.EXPERT);
		});
	});

	describe('decreaseDifficulty', () => {
		it('moves from medium to easy', () => {
			expect(engine.decreaseDifficulty(DIFFICULTY_LEVELS.MEDIUM)).toBe(DIFFICULTY_LEVELS.EASY);
		});

		it('does not go below beginner', () => {
			expect(engine.decreaseDifficulty(DIFFICULTY_LEVELS.BEGINNER)).toBe(
				DIFFICULTY_LEVELS.BEGINNER
			);
		});
	});

	describe('getQuestionSelectionWeights', () => {
		it('returns weights that sum to 1', () => {
			const weights = engine.getQuestionSelectionWeights();
			const sum = Object.values(weights).reduce((a, b) => a + b, 0);
			expect(sum).toBeCloseTo(1, 2);
		});

		it('shifts toward easier when struggling', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 2, 5000, 'easy');
			}
			const weights = engine.getQuestionSelectionWeights();
			expect(weights[DIFFICULTY_LEVELS.BEGINNER]).toBeGreaterThan(0.05);
			expect(weights[DIFFICULTY_LEVELS.EXPERT]).toBe(0);
		});

		it('shifts toward harder when excelling', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, true, 5000, 'easy');
			}
			const weights = engine.getQuestionSelectionWeights();
			expect(weights[DIFFICULTY_LEVELS.HARD]).toBeGreaterThan(0.2);
			expect(weights[DIFFICULTY_LEVELS.BEGINNER]).toBe(0);
		});
	});

	describe('getPersonalizedLearningPath', () => {
		it('returns a complete learning path', () => {
			const path = engine.getPersonalizedLearningPath();
			expect(path).toHaveProperty('currentDifficulty');
			expect(path).toHaveProperty('recommendedDifficulty');
			expect(path).toHaveProperty('recentAccuracy');
			expect(path).toHaveProperty('weakTopics');
			expect(path).toHaveProperty('focusAreas');
			expect(path).toHaveProperty('nextSteps');
		});

		it('includes focus areas for low accuracy', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 3, 5000, 'easy');
			}
			const path = engine.getPersonalizedLearningPath();
			expect(path.focusAreas.length).toBeGreaterThan(0);
		});

		it('includes steps for weak topics', () => {
			for (let i = 0; i < 10; i++) {
				tracker.recordAnswer(`q${i}`, i < 3, 5000, 'hard');
			}
			const path = engine.getPersonalizedLearningPath();
			expect(path.nextSteps.length).toBeGreaterThan(0);
		});
	});

	describe('getDifficultyChangeReason', () => {
		it('returns excellent message for high accuracy', () => {
			expect(engine.getDifficultyChangeReason(0.9, 0)).toContain('Excellent');
		});

		it('returns practice message for low accuracy', () => {
			expect(engine.getDifficultyChangeReason(0.3, 0)).toContain('practice');
		});

		it('returns improvement message for high velocity', () => {
			expect(engine.getDifficultyChangeReason(0.7, 0.3)).toContain('improvement');
		});
	});
});
