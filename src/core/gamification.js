/**
 * Gamification System
 * Basierend auf Duolingo/Khan Academy Best Practices
 * - XP System (Experience Points)
 * - Levels & Progression
 * - Daily Streaks (Flame)
 * - Achievements/Badges
 */

// XP Rewards für verschiedene Aktivitäten
export const XP_REWARDS = {
  // Training Sessions
  DRILL_COMPLETED: 10,
  VIDEO_WATCHED: 5,
  LIVE_SESSION_COMPLETED: 20,
  REVIEW_SESSION: 15,
  THEORY_STUDIED: 8,

  // Mini-Games
  QUIZ_PERFECT: 25,         // 100% richtig
  QUIZ_GOOD: 15,            // 80%+ richtig
  QUIZ_COMPLETED: 10,       // Beliebig abgeschlossen
  SPEED_DRILL_FAST: 30,     // Unter 30s pro Frage
  SPEED_DRILL_NORMAL: 20,

  // Spaced Repetition
  CARD_REVIEW_EASY: 3,
  CARD_REVIEW_GOOD: 2,
  CARD_REVIEW_HARD: 1,

  // Milestones
  DAILY_GOAL_REACHED: 50,
  WEEK_COMPLETED: 100,
  STREAK_MILESTONE_7: 100,
  STREAK_MILESTONE_30: 500,
  STREAK_MILESTONE_100: 2000,

  // Perfect Performance
  PERFECT_WEEK: 200,
  FLAWLESS_QUIZ_STREAK_5: 100,
};

// Level System (Logarithmic Progression wie in RPGs)
export const LEVELS = {
  1: { xpRequired: 0, title: 'Poker Novice', icon: '🌱' },
  2: { xpRequired: 100, title: 'Enthusiast', icon: '🔰' },
  3: { xpRequired: 250, title: 'Student', icon: '📚' },
  4: { xpRequired: 500, title: 'Apprentice', icon: '🎓' },
  5: { xpRequired: 1000, title: 'Skilled Player', icon: '⭐' },
  6: { xpRequired: 2000, title: 'Expert', icon: '💎' },
  7: { xpRequired: 4000, title: 'Master', icon: '👑' },
  8: { xpRequired: 7000, title: 'GTO Warrior', icon: '⚔️' },
  9: { xpRequired: 12000, title: 'Pro', icon: '🏆' },
  10: { xpRequired: 20000, title: 'Legend', icon: '🔥' },
};

export function calculateLevel(totalXP) {
  let currentLevel = 1;
  let xpForNextLevel = LEVELS[2].xpRequired;

  for (let level = 1; level <= 10; level++) {
    if (totalXP >= LEVELS[level].xpRequired) {
      currentLevel = level;
      xpForNextLevel = LEVELS[level + 1]?.xpRequired || LEVELS[10].xpRequired;
    } else {
      break;
    }
  }

  return {
    level: currentLevel,
    xpForNextLevel,
    xpInCurrentLevel: totalXP - LEVELS[currentLevel].xpRequired,
    xpNeededForNext: xpForNextLevel - totalXP,
    progress: (totalXP - LEVELS[currentLevel].xpRequired) / (xpForNextLevel - LEVELS[currentLevel].xpRequired),
    levelData: LEVELS[currentLevel],
  };
}

// Achievement System
export const ACHIEVEMENTS = {
  // Learning Achievements
  FIRST_STEPS: {
    id: 'first_steps',
    title: 'Erste Schritte',
    description: 'Schließe deine erste Training Session ab',
    icon: '🎯',
    xpReward: 50,
    requirement: { type: 'sessions_completed', count: 1 },
  },
  DEDICATED_LEARNER: {
    id: 'dedicated_learner',
    title: 'Engagierter Schüler',
    description: 'Schließe 10 Training Sessions ab',
    icon: '📖',
    xpReward: 100,
    requirement: { type: 'sessions_completed', count: 10 },
  },
  POKER_SCHOLAR: {
    id: 'poker_scholar',
    title: 'Poker-Gelehrter',
    description: 'Schließe alle 7 Tage des Trainingsplans ab',
    icon: '🎓',
    xpReward: 500,
    requirement: { type: 'training_plan_completed', count: 1 },
  },

  // Streak Achievements
  WEEK_WARRIOR: {
    id: 'week_warrior',
    title: '7-Tage Streak',
    description: 'Trainiere 7 Tage am Stück',
    icon: '🔥',
    xpReward: 200,
    requirement: { type: 'streak', count: 7 },
  },
  MONTH_MASTER: {
    id: 'month_master',
    title: '30-Tage Streak',
    description: 'Trainiere 30 Tage am Stück',
    icon: '💪',
    xpReward: 1000,
    requirement: { type: 'streak', count: 30 },
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    title: 'Unaufhaltsam',
    description: 'Trainiere 100 Tage am Stück',
    icon: '⚡',
    xpReward: 5000,
    requirement: { type: 'streak', count: 100 },
  },

  // Quiz Achievements
  QUIZ_ROOKIE: {
    id: 'quiz_rookie',
    title: 'Quiz-Neuling',
    description: 'Schließe dein erstes Quiz ab',
    icon: '❓',
    xpReward: 25,
    requirement: { type: 'quizzes_completed', count: 1 },
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    title: 'Perfekt!',
    description: 'Erreiche 100% in einem Quiz',
    icon: '💯',
    xpReward: 100,
    requirement: { type: 'perfect_quizzes', count: 1 },
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    title: 'Quiz-Meister',
    description: 'Erreiche 5x hintereinander 100% in Quizzes',
    icon: '🏅',
    xpReward: 300,
    requirement: { type: 'perfect_quiz_streak', count: 5 },
  },

  // Range Mastery
  RANGE_EXPLORER: {
    id: 'range_explorer',
    title: 'Range-Entdecker',
    description: 'Studiere alle 6 Positionen',
    icon: '🗺️',
    xpReward: 150,
    requirement: { type: 'positions_studied', count: 6 },
  },
  PUSH_FOLD_PRO: {
    id: 'push_fold_pro',
    title: 'Push/Fold Profi',
    description: 'Meistere alle 3 Stack-Größen',
    icon: '📊',
    xpReward: 200,
    requirement: { type: 'stack_sizes_mastered', count: 3 },
  },

  // Exploit Master
  EXPLOIT_HUNTER: {
    id: 'exploit_hunter',
    title: 'Exploit-Jäger',
    description: 'Studiere alle 5 häufigen Leaks',
    icon: '🎯',
    xpReward: 150,
    requirement: { type: 'leaks_studied', count: 5 },
  },

  // Speed Achievements
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    title: 'Blitzschnell',
    description: 'Beantworte 10 Fragen in unter 5 Sekunden pro Frage',
    icon: '⚡',
    xpReward: 200,
    requirement: { type: 'speed_drills_fast', count: 10 },
  },
};

// Streak System
export class StreakManager {
  static calculateStreak(lastActiveDate, currentDate = new Date()) {
    if (!lastActiveDate) return 0;

    const last = new Date(lastActiveDate);
    const current = new Date(currentDate);

    // Normalize to midnight
    last.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((current - last) / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  static isStreakActive(lastActiveDate) {
    const diff = this.calculateStreak(lastActiveDate);
    return diff <= 1; // Today or yesterday = active
  }

  static getStreakStatus(currentStreak) {
    if (currentStreak === 0) return { emoji: '😴', message: 'Starte deine Streak!' };
    if (currentStreak < 3) return { emoji: '🌱', message: 'Am Anfang!' };
    if (currentStreak < 7) return { emoji: '🔥', message: 'Heiß!' };
    if (currentStreak < 30) return { emoji: '💪', message: 'Stark!' };
    if (currentStreak < 100) return { emoji: '⚡', message: 'Unaufhaltsam!' };
    return { emoji: '👑', message: 'Legendär!' };
  }

  static getStreakColor(currentStreak) {
    if (currentStreak === 0) return '#9e9e9e';
    if (currentStreak < 7) return '#ff9800';
    if (currentStreak < 30) return '#ff5722';
    if (currentStreak < 100) return '#f44336';
    return '#d500f9';
  }
}

// Daily Goal System
export const DAILY_GOALS = {
  MIN_XP: 50,           // Minimum XP für Daily Goal
  RECOMMENDED_XP: 100,  // Empfohlenes Daily Goal
  HARDCORE_XP: 200,     // Für ambitionierte Spieler
};

export function getDailyGoalProgress(xpToday, goal = DAILY_GOALS.RECOMMENDED_XP) {
  return {
    xpToday,
    goal,
    progress: xpToday / goal,
    achieved: xpToday >= goal,
    remaining: Math.max(0, goal - xpToday),
  };
}

// Leaderboard (Optional - Local Highscores)
export class Leaderboard {
  static getLocalHighscores() {
    return {
      totalXP: 0,
      longestStreak: 0,
      perfectQuizzes: 0,
      fastestSpeedDrill: Infinity,
    };
  }

  static updateHighscore(category, value) {
    // Update local highscore
    return true;
  }
}

export default {
  XP_REWARDS,
  LEVELS,
  ACHIEVEMENTS,
  calculateLevel,
  StreakManager,
  DAILY_GOALS,
  getDailyGoalProgress,
  Leaderboard,
};
