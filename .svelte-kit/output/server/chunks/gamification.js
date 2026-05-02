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
		progress: !nextLevelData || xpRange === 0 ? 1 : xpInCurrentLevel / xpRange,
		levelData: LEVELS[currentLevel]
	};
}
//#endregion
export { calculateLevel as n, XP_REWARDS as t };
