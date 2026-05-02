import { describe, expect, it } from 'vitest';
import {
	ACHIEVEMENTS,
	AchievementManager,
	calculateLevel,
	DAILY_GOALS,
	getDailyGoalProgress,
	LEVELS,
	MILESTONES,
	MilestoneTracker,
	StreakManager,
	XP_REWARDS
} from './gamification';

describe('XP_REWARDS', () => {
	it('exports all reward constants', () => {
		expect(XP_REWARDS.DRILL_COMPLETED).toBe(10);
		expect(XP_REWARDS.QUIZ_PERFECT).toBe(25);
		expect(XP_REWARDS.DAILY_GOAL_REACHED).toBe(50);
		expect(XP_REWARDS.STREAK_MILESTONE_100).toBe(2000);
	});
});

describe('LEVELS', () => {
	it('has 10 levels', () => {
		expect(Object.keys(LEVELS)).toHaveLength(10);
	});

	it('starts at 0 XP for level 1', () => {
		expect(LEVELS[1].xpRequired).toBe(0);
	});

	it('increases XP requirements monotonically', () => {
		for (let i = 2; i <= 10; i++) {
			expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
		}
	});
});

describe('calculateLevel', () => {
	it('returns level 1 for 0 XP', () => {
		const result = calculateLevel(0);
		expect(result.level).toBe(1);
		expect(result.levelData.title).toBe('Poker Novice');
	});

	it('returns level 2 at 100 XP', () => {
		const result = calculateLevel(100);
		expect(result.level).toBe(2);
		expect(result.levelData.title).toBe('Enthusiast');
	});

	it('returns level 5 at 1000 XP', () => {
		const result = calculateLevel(1000);
		expect(result.level).toBe(5);
		expect(result.levelData.title).toBe('Skilled Player');
	});

	it('returns level 10 at max XP', () => {
		const result = calculateLevel(20000);
		expect(result.level).toBe(10);
		expect(result.levelData.title).toBe('Legend');
	});

	it('returns level 10 for XP exceeding max', () => {
		const result = calculateLevel(99999);
		expect(result.level).toBe(10);
	});

	it('calculates progress correctly within a level', () => {
		const result = calculateLevel(150); // Between level 2 (100) and level 3 (250)
		expect(result.level).toBe(2);
		expect(result.xpInCurrentLevel).toBe(50);
		expect(result.xpNeededForNext).toBe(100);
		expect(result.progress).toBeCloseTo(50 / 150, 2);
	});

	it('returns correct xpForNextLevel', () => {
		const result = calculateLevel(0);
		expect(result.xpForNextLevel).toBe(LEVELS[2].xpRequired);
	});
});

describe('StreakManager', () => {
	describe('calculateStreak', () => {
		it('returns 0 for null', () => {
			expect(StreakManager.calculateStreak(null)).toBe(0);
		});

		it('returns 0 for same day', () => {
			const today = new Date('2026-01-15');
			expect(StreakManager.calculateStreak('2026-01-15', today)).toBe(0);
		});

		it('returns 1 for yesterday', () => {
			const today = new Date('2026-01-15');
			expect(StreakManager.calculateStreak('2026-01-14', today)).toBe(1);
		});

		it('returns 7 for a week ago', () => {
			const today = new Date('2026-01-22');
			expect(StreakManager.calculateStreak('2026-01-15', today)).toBe(7);
		});
	});

	describe('isStreakActive', () => {
		it('returns true for null (no streak = 0 days, within 1-day threshold)', () => {
			expect(StreakManager.isStreakActive(null)).toBe(true);
		});

		it('returns true for today', () => {
			expect(StreakManager.isStreakActive(new Date().toISOString())).toBe(true);
		});

		it('returns true for yesterday', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			expect(StreakManager.isStreakActive(yesterday)).toBe(true);
		});

		it('returns false for 3 days ago', () => {
			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
			expect(StreakManager.isStreakActive(threeDaysAgo)).toBe(false);
		});
	});

	describe('getStreakStatus', () => {
		it('returns sleep emoji for 0 streak', () => {
			const status = StreakManager.getStreakStatus(0);
			expect(status.emoji).toBe('\u{1F634}');
		});

		it('returns fire emoji for streak 5', () => {
			const status = StreakManager.getStreakStatus(5);
			expect(status.emoji).toBe('\u{1F525}');
		});

		it('returns legendary for streak 100+', () => {
			const status = StreakManager.getStreakStatus(100);
			expect(status.message).toBe('Legendary!');
		});
	});

	describe('getStreakColor', () => {
		it('returns grey for 0', () => {
			expect(StreakManager.getStreakColor(0)).toBe('#9e9e9e');
		});

		it('returns purple for 100+', () => {
			expect(StreakManager.getStreakColor(100)).toBe('#d500f9');
		});
	});
});

describe('AchievementManager', () => {
	it('unlocks achievement when requirement met', () => {
		const manager = new AchievementManager();
		const unlocked = manager.checkAchievements({ sessions_completed: 1 });
		expect(unlocked).toHaveLength(1);
		expect(unlocked[0].id).toBe('first_steps');
	});

	it('does not unlock same achievement twice', () => {
		const manager = new AchievementManager();
		manager.checkAchievements({ sessions_completed: 1 });
		const second = manager.checkAchievements({ sessions_completed: 1 });
		expect(second).toHaveLength(0);
	});

	it('unlocks multiple achievements', () => {
		const manager = new AchievementManager();
		const unlocked = manager.checkAchievements({
			sessions_completed: 10,
			current_streak: 7,
			quizzes_completed: 1,
			perfect_quizzes: 1
		});
		expect(unlocked.length).toBeGreaterThanOrEqual(4);
	});

	it('returns empty array when no new achievements', () => {
		const manager = new AchievementManager();
		const unlocked = manager.checkAchievements({});
		expect(unlocked).toHaveLength(0);
	});

	describe('getProgress', () => {
		it('returns null for unknown achievement', () => {
			const manager = new AchievementManager();
			expect(manager.getProgress('nonexistent', {})).toBeNull();
		});

		it('returns progress for valid achievement', () => {
			const manager = new AchievementManager();
			const progress = manager.getProgress('FIRST_STEPS', { sessions_completed: 0 });
			expect(progress).not.toBeNull();
			expect(progress!.current).toBe(0);
			expect(progress!.required).toBe(1);
			expect(progress!.percentage).toBe(0);
			expect(progress!.unlocked).toBe(false);
		});

		it('caps percentage at 100', () => {
			const manager = new AchievementManager();
			const progress = manager.getProgress('FIRST_STEPS', { sessions_completed: 50 });
			expect(progress!.percentage).toBe(100);
		});
	});

	describe('getUnlockedAchievements', () => {
		it('returns empty array initially', () => {
			const manager = new AchievementManager();
			expect(manager.getUnlockedAchievements()).toHaveLength(0);
		});

		it('returns unlocked achievements', () => {
			const manager = new AchievementManager();
			manager.checkAchievements({ sessions_completed: 1 });
			const unlocked = manager.getUnlockedAchievements();
			expect(unlocked).toHaveLength(1);
		});
	});

	describe('getLockedAchievements', () => {
		it('returns all achievements initially', () => {
			const manager = new AchievementManager();
			const locked = manager.getLockedAchievements({});
			expect(locked.length).toBe(Object.keys(ACHIEVEMENTS).length);
		});

		it('excludes unlocked achievements', () => {
			const manager = new AchievementManager();
			manager.checkAchievements({ sessions_completed: 1 });
			const locked = manager.getLockedAchievements({});
			expect(locked.length).toBe(Object.keys(ACHIEVEMENTS).length - 1);
		});
	});
});

describe('MilestoneTracker', () => {
	it('detects XP milestone', () => {
		const tracker = new MilestoneTracker();
		const milestones = tracker.checkMilestones({ totalXP: 1000 });
		expect(milestones.length).toBeGreaterThanOrEqual(1);
		expect(milestones.some((m) => m.type === 'xp')).toBe(true);
	});

	it('detects questions milestone', () => {
		const tracker = new MilestoneTracker();
		const milestones = tracker.checkMilestones({ questionsAnswered: 100 });
		expect(milestones.some((m) => m.type === 'questions')).toBe(true);
	});

	it('detects perfect scores milestone', () => {
		const tracker = new MilestoneTracker();
		const milestones = tracker.checkMilestones({ perfectScores: 5 });
		expect(milestones.some((m) => m.type === 'perfect')).toBe(true);
	});

	it('does not repeat milestones', () => {
		const tracker = new MilestoneTracker();
		tracker.checkMilestones({ totalXP: 5000 });
		const second = tracker.checkMilestones({ totalXP: 5000 });
		expect(second).toHaveLength(0);
	});

	it('returns empty for stats below thresholds', () => {
		const tracker = new MilestoneTracker();
		expect(tracker.checkMilestones({ totalXP: 10 })).toHaveLength(0);
		expect(tracker.checkMilestones({ questionsAnswered: 5 })).toHaveLength(0);
	});

	describe('getNextMilestones', () => {
		it('returns next milestones for each category', () => {
			const tracker = new MilestoneTracker();
			const next = tracker.getNextMilestones({
				totalXP: 500,
				questionsAnswered: 50,
				perfectScores: 2
			});
			expect(next.length).toBeGreaterThanOrEqual(3);
		});

		it('calculates progress correctly', () => {
			const tracker = new MilestoneTracker();
			const next = tracker.getNextMilestones({ totalXP: 500 });
			const xpMilestone = next.find((m) => m.type === 'xp');
			expect(xpMilestone).toBeDefined();
			expect(xpMilestone!.progress).toBeCloseTo(500 / 1000, 2);
		});
	});
});

describe('getDailyGoalProgress', () => {
	it('calculates progress correctly', () => {
		const progress = getDailyGoalProgress(50, 100);
		expect(progress.progress).toBe(0.5);
		expect(progress.achieved).toBe(false);
		expect(progress.remaining).toBe(50);
	});

	it('marks achieved when goal met', () => {
		const progress = getDailyGoalProgress(100, 100);
		expect(progress.achieved).toBe(true);
		expect(progress.remaining).toBe(0);
	});

	it('handles exceeding goal', () => {
		const progress = getDailyGoalProgress(150, 100);
		expect(progress.achieved).toBe(true);
		expect(progress.remaining).toBe(0);
		expect(progress.progress).toBe(1.5);
	});

	it('uses default recommended goal', () => {
		const progress = getDailyGoalProgress(50);
		expect(progress.goal).toBe(DAILY_GOALS.RECOMMENDED_XP);
	});
});
