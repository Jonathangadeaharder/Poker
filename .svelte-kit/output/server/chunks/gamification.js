//#region src/lib/core/gamification.ts
/**
* Gamification System
* Based on Duolingo/Khan Academy Best Practices
* - XP System (Experience Points)
* - Levels & Progression
* - Daily Streaks (Flame)
* - Achievements/Badges
*/
var XP_REWARDS = {
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
	STREAK_MILESTONE_100: 2e3,
	PERFECT_WEEK: 200,
	FLAWLESS_QUIZ_STREAK_5: 100
};
var LEVELS = {
	1: {
		xpRequired: 0,
		title: "Poker Novice",
		icon: "🌱"
	},
	2: {
		xpRequired: 100,
		title: "Enthusiast",
		icon: "🟰"
	},
	3: {
		xpRequired: 250,
		title: "Student",
		icon: "📚"
	},
	4: {
		xpRequired: 500,
		title: "Apprentice",
		icon: "🎓"
	},
	5: {
		xpRequired: 1e3,
		title: "Skilled Player",
		icon: "⭐"
	},
	6: {
		xpRequired: 2e3,
		title: "Expert",
		icon: "💎"
	},
	7: {
		xpRequired: 4e3,
		title: "Master",
		icon: "👑"
	},
	8: {
		xpRequired: 7e3,
		title: "GTO Warrior",
		icon: "⚔️"
	},
	9: {
		xpRequired: 12e3,
		title: "Pro",
		icon: "🏆"
	},
	10: {
		xpRequired: 2e4,
		title: "Legend",
		icon: "🔥"
	}
};
function calculateLevel(totalXP) {
	let currentLevel = 1;
	for (let level = 1; level <= 10; level++) if (totalXP >= LEVELS[level].xpRequired) currentLevel = level;
	else break;
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
var ACHIEVEMENTS = {
	FIRST_STEPS: {
		id: "first_steps",
		title: "First Steps",
		description: "Complete your first training session",
		icon: "🎯",
		xpReward: 50,
		requirement: {
			type: "sessionsCompleted",
			count: 1
		}
	},
	DEDICATED_LEARNER: {
		id: "dedicated_learner",
		title: "Dedicated Learner",
		description: "Complete 10 training sessions",
		icon: "📖",
		xpReward: 100,
		requirement: {
			type: "sessionsCompleted",
			count: 10
		}
	},
	POKER_SCHOLAR: {
		id: "poker_scholar",
		title: "Poker Scholar",
		description: "Complete all 7 days of the training plan",
		icon: "🎓",
		xpReward: 500,
		requirement: {
			type: "trainingPlanCompleted",
			count: 1
		}
	},
	WEEK_WARRIOR: {
		id: "week_warrior",
		title: "7-Day Streak",
		description: "Train 7 days in a row",
		icon: "🔥",
		xpReward: 200,
		requirement: {
			type: "currentStreak",
			count: 7
		}
	},
	MONTH_MASTER: {
		id: "month_master",
		title: "30-Day Streak",
		description: "Train 30 days in a row",
		icon: "💪",
		xpReward: 1e3,
		requirement: {
			type: "currentStreak",
			count: 30
		}
	},
	UNSTOPPABLE: {
		id: "unstoppable",
		title: "Unstoppable",
		description: "Train 100 days in a row",
		icon: "⚡",
		xpReward: 5e3,
		requirement: {
			type: "currentStreak",
			count: 100
		}
	},
	QUIZ_ROOKIE: {
		id: "quiz_rookie",
		title: "Quiz Rookie",
		description: "Complete your first quiz",
		icon: "❓",
		xpReward: 25,
		requirement: {
			type: "quizzesCompleted",
			count: 1
		}
	},
	PERFECT_SCORE: {
		id: "perfect_score",
		title: "Perfect!",
		description: "Score 100% in a quiz",
		icon: "💯",
		xpReward: 100,
		requirement: {
			type: "perfectQuizzes",
			count: 1
		}
	},
	QUIZ_MASTER: {
		id: "quiz_master",
		title: "Quiz Master",
		description: "Score 100% in 5 quizzes in a row",
		icon: "🏆",
		xpReward: 300,
		requirement: {
			type: "perfectQuizStreak",
			count: 5
		}
	},
	RANGE_EXPLORER: {
		id: "range_explorer",
		title: "Range Explorer",
		description: "Study all 6 positions",
		icon: "🗺️",
		xpReward: 150,
		requirement: {
			type: "positionsStudied",
			count: 6
		}
	},
	PUSH_FOLD_PRO: {
		id: "push_fold_pro",
		title: "Push/Fold Pro",
		description: "Master all 3 stack sizes",
		icon: "📊",
		xpReward: 200,
		requirement: {
			type: "stackSizesMastered",
			count: 3
		}
	},
	EXPLOIT_HUNTER: {
		id: "exploit_hunter",
		title: "Exploit Hunter",
		description: "Study all 5 common leaks",
		icon: "🎯",
		xpReward: 150,
		requirement: {
			type: "leaksStudied",
			count: 5
		}
	},
	LIGHTNING_FAST: {
		id: "lightning_fast",
		title: "Lightning Fast",
		description: "Answer 10 questions in under 5 seconds each",
		icon: "⚡",
		xpReward: 200,
		requirement: {
			type: "speedDrillsFast",
			count: 10
		}
	}
};
var AchievementManager = class {
	unlockedAchievements;
	progress;
	constructor() {
		this.unlockedAchievements = /* @__PURE__ */ new Set();
		this.progress = {};
	}
	checkAchievements(stats) {
		const newlyUnlocked = [];
		for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
			if (this.unlockedAchievements.has(key)) continue;
			if (this.checkRequirement(achievement.requirement, stats)) {
				this.unlockedAchievements.add(key);
				newlyUnlocked.push(achievement);
			}
		}
		return newlyUnlocked;
	}
	checkRequirement(requirement, stats) {
		const { type, count } = requirement;
		const value = stats[type];
		return typeof value === "number" && value >= count;
	}
	getProgress(achievementId, stats) {
		const achievement = ACHIEVEMENTS[achievementId] ?? Object.values(ACHIEVEMENTS).find((a) => a.id === achievementId);
		if (!achievement) return null;
		const { type, count } = achievement.requirement;
		const current = stats[type] || 0;
		return {
			current,
			required: count,
			percentage: Math.min(current / count * 100, 100),
			unlocked: this.unlockedAchievements.has(achievementId)
		};
	}
	getUnlockedAchievements() {
		return Array.from(this.unlockedAchievements).map((id) => ACHIEVEMENTS[id]);
	}
	getLockedAchievements(stats) {
		return Object.entries(ACHIEVEMENTS).filter(([id]) => !this.unlockedAchievements.has(id)).map(([id, achievement]) => ({
			...achievement,
			progress: this.getProgress(id, stats)
		}));
	}
};
//#endregion
export { calculateLevel as i, AchievementManager as n, XP_REWARDS as r, ACHIEVEMENTS as t };
