/**
 * Gamification System
 * Based on Duolingo/Khan Academy Best Practices
 * - XP System (Experience Points)
 * - Levels & Progression
 * - Daily Streaks (Flame)
 * - Achievements/Badges
 */

export const XP_REWARDS = {
	DRILL_COMPLETED: 10,
	VIDEO_WATCHED: 5,
	LIVE_SESSION_COMPLETED: 20,
	REVIEW_SESSION: 15,
	THEORY_STUDIED: 8,
	QUIZ_PERFECT: 25,
	QUIZ_GOOD: 15,
	QUIZ_COMPLETED: 10,
	SPEED_DRILL_FAST: 30,
	SPEED_DRILL_NORMAL: 20,
	CARD_REVIEW_EASY: 3,
	CARD_REVIEW_GOOD: 2,
	CARD_REVIEW_HARD: 1,
	DAILY_GOAL_REACHED: 50,
	WEEK_COMPLETED: 100,
	STREAK_MILESTONE_7: 100,
	STREAK_MILESTONE_30: 500,
	STREAK_MILESTONE_100: 2000,
	PERFECT_WEEK: 200,
	FLAWLESS_QUIZ_STREAK_5: 100
} as const;

export interface LevelData {
	xpRequired: number;
	title: string;
	icon: string;
}

export const LEVELS: Record<number, LevelData> = {
	1: { xpRequired: 0, title: 'Poker Novice', icon: '\u{1F331}' },
	2: { xpRequired: 100, title: 'Enthusiast', icon: '\u{1F7F0}' },
	3: { xpRequired: 250, title: 'Student', icon: '\u{1F4DA}' },
	4: { xpRequired: 500, title: 'Apprentice', icon: '\u{1F393}' },
	5: { xpRequired: 1000, title: 'Skilled Player', icon: '\u2B50' },
	6: { xpRequired: 2000, title: 'Expert', icon: '\u{1F48E}' },
	7: { xpRequired: 4000, title: 'Master', icon: '\u{1F451}' },
	8: { xpRequired: 7000, title: 'GTO Warrior', icon: '\u2694\uFE0F' },
	9: { xpRequired: 12000, title: 'Pro', icon: '\u{1F3C6}' },
	10: { xpRequired: 20000, title: 'Legend', icon: '\u{1F525}' }
};

export interface LevelResult {
	level: number;
	xpForNextLevel: number;
	xpInCurrentLevel: number;
	xpNeededForNext: number;
	progress: number;
	levelData: LevelData;
}

export function calculateLevel(totalXP: number): LevelResult {
	let currentLevel = 1;

	for (let level = 1; level <= 10; level++) {
		if (totalXP >= LEVELS[level].xpRequired) {
			currentLevel = level;
		} else {
			break;
		}
	}

	const nextLevelData = LEVELS[currentLevel + 1];
	const xpForNextLevel = nextLevelData ? nextLevelData.xpRequired : LEVELS[currentLevel].xpRequired;
	const xpInCurrentLevel = totalXP - LEVELS[currentLevel].xpRequired;
	const xpRange = xpForNextLevel - LEVELS[currentLevel].xpRequired;

	return {
		level: currentLevel,
		xpForNextLevel: nextLevelData ? xpForNextLevel : totalXP,
		xpInCurrentLevel,
		xpNeededForNext: Math.max(0, xpForNextLevel - totalXP),
		progress: !nextLevelData ? 1 : xpRange === 0 ? 0 : xpInCurrentLevel / xpRange,
		levelData: LEVELS[currentLevel]
	};
}

export interface AchievementRequirement {
	type: string;
	count: number;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	xpReward: number;
	requirement: AchievementRequirement;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
	FIRST_STEPS: {
		id: 'first_steps',
		title: 'First Steps',
		description: 'Complete your first training session',
		icon: '\u{1F3AF}',
		xpReward: 50,
		requirement: { type: 'sessionsCompleted', count: 1 }
	},
	DEDICATED_LEARNER: {
		id: 'dedicated_learner',
		title: 'Dedicated Learner',
		description: 'Complete 10 training sessions',
		icon: '📖',
		xpReward: 100,
		requirement: { type: 'sessionsCompleted', count: 10 }
	},
	POKER_SCHOLAR: {
		id: 'poker_scholar',
		title: 'Poker Scholar',
		description: 'Complete all 7 days of the training plan',
		icon: '🎓',
		xpReward: 500,
		requirement: { type: 'trainingPlanCompleted', count: 1 }
	},
	WEEK_WARRIOR: {
		id: 'week_warrior',
		title: '7-Day Streak',
		description: 'Train 7 days in a row',
		icon: '🔥',
		xpReward: 200,
		requirement: { type: 'currentStreak', count: 7 }
	},
	MONTH_MASTER: {
		id: 'month_master',
		title: '30-Day Streak',
		description: 'Train 30 days in a row',
		icon: '💪',
		xpReward: 1000,
		requirement: { type: 'currentStreak', count: 30 }
	},
	UNSTOPPABLE: {
		id: 'unstoppable',
		title: 'Unstoppable',
		description: 'Train 100 days in a row',
		icon: '⚡',
		xpReward: 5000,
		requirement: { type: 'currentStreak', count: 100 }
	},
	QUIZ_ROOKIE: {
		id: 'quiz_rookie',
		title: 'Quiz Rookie',
		description: 'Complete your first quiz',
		icon: '❓',
		xpReward: 25,
		requirement: { type: 'quizzesCompleted', count: 1 }
	},
	PERFECT_SCORE: {
		id: 'perfect_score',
		title: 'Perfect!',
		description: 'Score 100% in a quiz',
		icon: '💯',
		xpReward: 100,
		requirement: { type: 'perfectQuizzes', count: 1 }
	},
	QUIZ_MASTER: {
		id: 'quiz_master',
		title: 'Quiz Master',
		description: 'Score 100% in 5 quizzes in a row',
		icon: '🏆',
		xpReward: 300,
		requirement: { type: 'perfectQuizStreak', count: 5 }
	},
	RANGE_EXPLORER: {
		id: 'range_explorer',
		title: 'Range Explorer',
		description: 'Study all 6 positions',
		icon: '🗺️',
		xpReward: 150,
		requirement: { type: 'positionsStudied', count: 6 }
	},
	PUSH_FOLD_PRO: {
		id: 'push_fold_pro',
		title: 'Push/Fold Pro',
		description: 'Master all 3 stack sizes',
		icon: '📊',
		xpReward: 200,
		requirement: { type: 'stackSizesMastered', count: 3 }
	},
	EXPLOIT_HUNTER: {
		id: 'exploit_hunter',
		title: 'Exploit Hunter',
		description: 'Study all 5 common leaks',
		icon: '🎯',
		xpReward: 150,
		requirement: { type: 'leaksStudied', count: 5 }
	},
	LIGHTNING_FAST: {
		id: 'lightning_fast',
		title: 'Lightning Fast',
		description: 'Answer 10 questions in under 5 seconds each',
		icon: '⚡',
		xpReward: 200,
		requirement: { type: 'speedDrillsFast', count: 10 }
	}
};

export interface StreakStatus {
	emoji: string;
	message: string;
}

export function calculateStreak(
	lastActiveDate: string | Date | null,
	currentDate: Date = new Date()
): number {
	if (!lastActiveDate) return 0;

	let last: Date;
	if (typeof lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(lastActiveDate)) {
		const [y, m, d] = lastActiveDate.split('-').map(Number);
		last = new Date(y, m - 1, d);
	} else {
		last = new Date(lastActiveDate);
	}
	const current = new Date(currentDate);

	last.setHours(0, 0, 0, 0);
	current.setHours(0, 0, 0, 0);

	return Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function isStreakActive(lastActiveDate: string | Date | null): boolean {
	const diff = calculateStreak(lastActiveDate);
	return diff <= 1;
}

export function getStreakStatus(currentStreak: number): StreakStatus {
	if (currentStreak === 0) return { emoji: '\u{1F634}', message: 'Start your streak!' };
	if (currentStreak < 3) return { emoji: '\u{1F331}', message: 'Getting started!' };
	if (currentStreak < 7) return { emoji: '\u{1F525}', message: 'Hot!' };
	if (currentStreak < 30) return { emoji: '\u{1F4AA}', message: 'Strong!' };
	if (currentStreak < 100) return { emoji: '\u26A1', message: 'Unstoppable!' };
	return { emoji: '\u{1F451}', message: 'Legendary!' };
}

export function getStreakColor(currentStreak: number): string {
	if (currentStreak === 0) return '#9e9e9e';
	if (currentStreak < 7) return '#ff9800';
	if (currentStreak < 30) return '#ff5722';
	if (currentStreak < 100) return '#f44336';
	return '#d500f9';
}

export const DAILY_GOALS = {
	MIN_XP: 50,
	RECOMMENDED_XP: 100,
	HARDCORE_XP: 200
} as const;

export interface DailyGoalProgress {
	xpToday: number;
	goal: number;
	progress: number;
	achieved: boolean;
	remaining: number;
}

export function getDailyGoalProgress(
	xpToday: number,
	goal: number = DAILY_GOALS.RECOMMENDED_XP
): DailyGoalProgress {
	const safeGoal = goal > 0 ? goal : 1;
	return {
		xpToday,
		goal,
		progress: xpToday / safeGoal,
		achieved: xpToday >= goal,
		remaining: Math.max(0, goal - xpToday)
	};
}

export interface UserStats {
	sessionsCompleted?: number;
	currentStreak?: number;
	quizzesCompleted?: number;
	perfectQuizzes?: number;
	perfectQuizStreak?: number;
	positionsStudied?: number;
	stackSizesMastered?: number;
	leaksStudied?: number;
	speedDrillsFast?: number;
	trainingPlanCompleted?: number;
	totalXP?: number;
	questionsAnswered?: number;
	perfectScores?: number;
	[key: string]: number | undefined;
}

export class AchievementManager {
	private unlockedAchievements: Set<string>;
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: reserved for future use
	private progress: Record<string, unknown>;

	constructor() {
		this.unlockedAchievements = new Set();
		this.progress = {};
	}

	checkAchievements(stats: UserStats): Achievement[] {
		const newlyUnlocked: Achievement[] = [];

		for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
			if (this.unlockedAchievements.has(key)) continue;

			if (this.checkRequirement(achievement.requirement, stats)) {
				this.unlockedAchievements.add(key);
				newlyUnlocked.push(achievement);
			}
		}

		return newlyUnlocked;
	}

	private checkRequirement(requirement: AchievementRequirement, stats: UserStats): boolean {
		const { type, count } = requirement;
		const value = stats[type as keyof UserStats];
		return typeof value === 'number' && value >= count;
	}

	getProgress(
		achievementId: string,
		stats: UserStats
	): { current: number; required: number; percentage: number; unlocked: boolean } | null {
		const achievement =
			ACHIEVEMENTS[achievementId] ??
			Object.values(ACHIEVEMENTS).find((a) => a.id === achievementId);
		if (!achievement) return null;

		const { type, count } = achievement.requirement;
		const current = (stats[type as keyof UserStats] as number) || 0;

		return {
			current,
			required: count,
			percentage: Math.min((current / count) * 100, 100),
			unlocked: this.unlockedAchievements.has(achievementId)
		};
	}

	getUnlockedAchievements(): Achievement[] {
		return Array.from(this.unlockedAchievements).map((id) => ACHIEVEMENTS[id]);
	}

	getLockedAchievements(
		stats: UserStats
	): (Achievement & { progress: ReturnType<AchievementManager['getProgress']> })[] {
		return Object.entries(ACHIEVEMENTS)
			.filter(([id]) => !this.unlockedAchievements.has(id))
			.map(([id, achievement]) => ({
				...achievement,
				progress: this.getProgress(id, stats)
			}));
	}
}

export interface Milestone {
	threshold: number;
	reward: number;
	title: string;
	icon: string;
}

export const MILESTONES: Record<string, Milestone[]> = {
	TOTAL_XP: [
		{ threshold: 1000, reward: 100, title: '1K XP Milestone', icon: '\u{1F3AF}' },
		{ threshold: 5000, reward: 500, title: '5K XP Milestone', icon: '\u2B50' },
		{ threshold: 10000, reward: 1000, title: '10K XP Milestone', icon: '\u{1F48E}' },
		{ threshold: 25000, reward: 2500, title: '25K XP Milestone', icon: '\u{1F451}' },
		{ threshold: 50000, reward: 5000, title: '50K XP Milestone', icon: '\u{1F3C6}' }
	],
	TOTAL_QUESTIONS: [
		{ threshold: 100, reward: 50, title: '100 Questions', icon: '\u{1F4DD}' },
		{ threshold: 500, reward: 250, title: '500 Questions', icon: '\u{1F4DA}' },
		{ threshold: 1000, reward: 500, title: '1000 Questions', icon: '\u{1F393}' },
		{ threshold: 2500, reward: 1000, title: '2500 Questions', icon: '\u{1F9E0}' }
	],
	PERFECT_SCORES: [
		{ threshold: 5, reward: 100, title: '5 Perfect Scores', icon: '\u{1F4AF}' },
		{ threshold: 25, reward: 500, title: '25 Perfect Scores', icon: '\u{1F31F}' },
		{ threshold: 100, reward: 2000, title: '100 Perfect Scores', icon: '\u2728' }
	]
};

export class MilestoneTracker {
	private reachedMilestones: Set<string>;

	constructor() {
		this.reachedMilestones = new Set();
	}

	checkMilestones(stats: UserStats): (Milestone & { type: string })[] {
		const newMilestones: (Milestone & { type: string })[] = [];

		for (const milestone of MILESTONES.TOTAL_XP) {
			const key = `xp_${milestone.threshold}`;
			if (!this.reachedMilestones.has(key) && (stats.totalXP ?? 0) >= milestone.threshold) {
				this.reachedMilestones.add(key);
				newMilestones.push({ ...milestone, type: 'xp' });
			}
		}

		for (const milestone of MILESTONES.TOTAL_QUESTIONS) {
			const key = `questions_${milestone.threshold}`;
			if (
				!this.reachedMilestones.has(key) &&
				(stats.questionsAnswered ?? 0) >= milestone.threshold
			) {
				this.reachedMilestones.add(key);
				newMilestones.push({ ...milestone, type: 'questions' });
			}
		}

		for (const milestone of MILESTONES.PERFECT_SCORES) {
			const key = `perfect_${milestone.threshold}`;
			if (!this.reachedMilestones.has(key) && (stats.perfectScores ?? 0) >= milestone.threshold) {
				this.reachedMilestones.add(key);
				newMilestones.push({ ...milestone, type: 'perfect' });
			}
		}

		return newMilestones;
	}

	getNextMilestones(stats: UserStats): (Milestone & { type: string; progress: number })[] {
		const next: (Milestone & { type: string; progress: number })[] = [];

		const nextXP = MILESTONES.TOTAL_XP.find((m) => m.threshold > (stats.totalXP ?? 0));
		if (nextXP) {
			next.push({
				...nextXP,
				type: 'xp',
				progress: nextXP.threshold > 0 ? (stats.totalXP ?? 0) / nextXP.threshold : 0
			});
		}

		const nextQ = MILESTONES.TOTAL_QUESTIONS.find(
			(m) => m.threshold > (stats.questionsAnswered ?? 0)
		);
		if (nextQ) {
			next.push({
				...nextQ,
				type: 'questions',
				progress: (stats.questionsAnswered ?? 0) / nextQ.threshold
			});
		}

		const nextP = MILESTONES.PERFECT_SCORES.find((m) => m.threshold > (stats.perfectScores ?? 0));
		if (nextP) {
			next.push({
				...nextP,
				type: 'perfect',
				progress: (stats.perfectScores ?? 0) / nextP.threshold
			});
		}

		return next;
	}
}
