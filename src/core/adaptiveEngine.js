/**
 * Adaptive Learning Engine
 * Dynamic difficulty adjustment based on user performance
 * Integrates with Spaced Repetition for optimal learning
 */

import { DIFFICULTY_RATINGS } from './spacedRepetition';

/**
 * Difficulty Levels
 */
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

/**
 * Performance Metrics
 */
export class PerformanceTracker {
  constructor() {
    this.history = [];
    this.currentStreak = 0;
    this.longestStreak = 0;
  }

  /**
   * Record answer
   */
  recordAnswer(questionId, correct, timeSpent, difficulty) {
    const entry = {
      questionId,
      correct,
      timeSpent,
      difficulty,
      timestamp: new Date(),
    };

    this.history.push(entry);

    // Update streaks
    if (correct) {
      this.currentStreak++;
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    } else {
      this.currentStreak = 0;
    }

    // Keep only last 100 entries
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }

    return entry;
  }

  /**
   * Get accuracy for recent N questions
   */
  getRecentAccuracy(count = 10) {
    const recent = this.history.slice(-count);
    if (recent.length === 0) return 0;

    const correct = recent.filter(e => e.correct).length;
    return correct / recent.length;
  }

  /**
   * Get accuracy by difficulty
   */
  getAccuracyByDifficulty(difficulty, count = 20) {
    const filtered = this.history
      .filter(e => e.difficulty === difficulty)
      .slice(-count);

    if (filtered.length === 0) return null;

    const correct = filtered.filter(e => e.correct).length;
    return correct / filtered.length;
  }

  /**
   * Get average time by difficulty
   */
  getAverageTimeByDifficulty(difficulty, count = 20) {
    const filtered = this.history
      .filter(e => e.difficulty === difficulty)
      .slice(-count);

    if (filtered.length === 0) return null;

    const totalTime = filtered.reduce((sum, e) => sum + e.timeSpent, 0);
    return totalTime / filtered.length;
  }

  /**
   * Get learning velocity (improvement rate)
   */
  getLearningVelocity() {
    if (this.history.length < 20) return 0;

    // Compare recent 10 vs previous 10
    const recent10 = this.history.slice(-10);
    const previous10 = this.history.slice(-20, -10);

    const recentAccuracy = recent10.filter(e => e.correct).length / 10;
    const previousAccuracy = previous10.filter(e => e.correct).length / 10;

    return recentAccuracy - previousAccuracy; // Positive = improving
  }

  /**
   * Get weak topics
   */
  getWeakTopics() {
    const topicPerformance = {};

    this.history.forEach(entry => {
      const topic = entry.difficulty; // Could also track by category
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }

      topicPerformance[topic].total++;
      if (entry.correct) {
        topicPerformance[topic].correct++;
      }
    });

    // Return topics with < 70% accuracy
    return Object.entries(topicPerformance)
      .filter(([topic, stats]) => {
        const accuracy = stats.correct / stats.total;
        return accuracy < 0.7 && stats.total >= 5;
      })
      .map(([topic, stats]) => ({
        topic,
        accuracy: stats.correct / stats.total,
        attempts: stats.total,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }
}

/**
 * Adaptive Difficulty Engine
 */
export class AdaptiveEngine {
  constructor(performanceTracker) {
    this.tracker = performanceTracker;
    this.currentDifficulty = DIFFICULTY_LEVELS.EASY;
    this.difficultyHistory = [];
  }

  /**
   * Get recommended difficulty level
   */
  getRecommendedDifficulty() {
    const recentAccuracy = this.tracker.getRecentAccuracy(10);
    const learningVelocity = this.tracker.getLearningVelocity();

    // Not enough data yet
    if (this.tracker.history.length < 5) {
      return DIFFICULTY_LEVELS.EASY;
    }

    // Determine difficulty based on performance
    let recommendedDifficulty;

    if (recentAccuracy >= 0.85 && learningVelocity >= 0) {
      // Doing very well - increase difficulty
      recommendedDifficulty = this.increaseDifficulty(this.currentDifficulty);
    } else if (recentAccuracy <= 0.50) {
      // Struggling - decrease difficulty
      recommendedDifficulty = this.decreaseDifficulty(this.currentDifficulty);
    } else {
      // Performing adequately - maintain difficulty
      recommendedDifficulty = this.currentDifficulty;
    }

    // Update difficulty if changed
    if (recommendedDifficulty !== this.currentDifficulty) {
      this.difficultyHistory.push({
        from: this.currentDifficulty,
        to: recommendedDifficulty,
        reason: this.getDifficultyChangeReason(recentAccuracy, learningVelocity),
        timestamp: new Date(),
      });

      this.currentDifficulty = recommendedDifficulty;
    }

    return recommendedDifficulty;
  }

  /**
   * Increase difficulty level
   */
  increaseDifficulty(current) {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const currentIndex = levels.indexOf(current);
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  /**
   * Decrease difficulty level
   */
  decreaseDifficulty(current) {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const currentIndex = levels.indexOf(current);
    return levels[Math.max(currentIndex - 1, 0)];
  }

  /**
   * Get reason for difficulty change
   */
  getDifficultyChangeReason(accuracy, velocity) {
    if (accuracy >= 0.85) {
      return 'Excellent performance - ready for more challenge';
    } else if (accuracy <= 0.50) {
      return 'Need more practice at easier level';
    } else if (velocity > 0.2) {
      return 'Rapid improvement - increasing difficulty';
    } else if (velocity < -0.2) {
      return 'Performance declining - adjusting difficulty';
    }
    return 'Maintaining optimal challenge level';
  }

  /**
   * Get question selection weights
   * Returns probability distribution for question selection
   */
  getQuestionSelectionWeights() {
    const weakTopics = this.tracker.getWeakTopics();
    const recentAccuracy = this.tracker.getRecentAccuracy(10);

    // Base weights
    const weights = {
      [DIFFICULTY_LEVELS.BEGINNER]: 0.05,
      [DIFFICULTY_LEVELS.EASY]: 0.20,
      [DIFFICULTY_LEVELS.MEDIUM]: 0.50,
      [DIFFICULTY_LEVELS.HARD]: 0.20,
      [DIFFICULTY_LEVELS.EXPERT]: 0.05,
    };

    // Adjust based on current performance
    if (recentAccuracy < 0.5) {
      // Struggling - focus on easier questions
      weights[DIFFICULTY_LEVELS.BEGINNER] = 0.20;
      weights[DIFFICULTY_LEVELS.EASY] = 0.50;
      weights[DIFFICULTY_LEVELS.MEDIUM] = 0.25;
      weights[DIFFICULTY_LEVELS.HARD] = 0.05;
      weights[DIFFICULTY_LEVELS.EXPERT] = 0;
    } else if (recentAccuracy > 0.85) {
      // Excelling - focus on harder questions
      weights[DIFFICULTY_LEVELS.BEGINNER] = 0;
      weights[DIFFICULTY_LEVELS.EASY] = 0.10;
      weights[DIFFICULTY_LEVELS.MEDIUM] = 0.30;
      weights[DIFFICULTY_LEVELS.HARD] = 0.40;
      weights[DIFFICULTY_LEVELS.EXPERT] = 0.20;
    }

    // Boost weak topics
    if (weakTopics.length > 0) {
      weakTopics.forEach(topic => {
        if (weights[topic.topic]) {
          weights[topic.topic] *= 1.5; // 50% boost for weak areas
        }
      });

      // Normalize weights to sum to 1
      const total = Object.values(weights).reduce((a, b) => a + b, 0);
      Object.keys(weights).forEach(key => {
        weights[key] /= total;
      });
    }

    return weights;
  }

  /**
   * Select next question difficulty
   */
  selectNextQuestionDifficulty() {
    const weights = this.getQuestionSelectionWeights();

    // Weighted random selection
    const random = Math.random();
    let cumulative = 0;

    for (const [difficulty, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return difficulty;
      }
    }

    // Fallback
    return this.currentDifficulty;
  }

  /**
   * Get personalized learning path
   */
  getPersonalizedLearningPath() {
    const weakTopics = this.tracker.getWeakTopics();
    const recommendedDifficulty = this.getRecommendedDifficulty();
    const recentAccuracy = this.tracker.getRecentAccuracy(10);

    return {
      currentDifficulty: this.currentDifficulty,
      recommendedDifficulty,
      recentAccuracy,
      weakTopics: weakTopics.slice(0, 3), // Top 3 weak topics
      focusAreas: this.getFocusAreas(weakTopics, recentAccuracy),
      nextSteps: this.getNextSteps(weakTopics, recentAccuracy),
    };
  }

  /**
   * Get focus areas for learning
   */
  getFocusAreas(weakTopics, accuracy) {
    const areas = [];

    if (accuracy < 0.6) {
      areas.push({
        area: 'Fundamentals',
        priority: 'HIGH',
        description: 'Focus on building strong foundation',
      });
    }

    weakTopics.slice(0, 2).forEach(topic => {
      areas.push({
        area: topic.topic,
        priority: 'MEDIUM',
        description: `Improve from ${Math.round(topic.accuracy * 100)}% accuracy`,
      });
    });

    if (this.tracker.currentStreak >= 5) {
      areas.push({
        area: 'Advanced Topics',
        priority: 'LOW',
        description: 'Ready to explore more complex concepts',
      });
    }

    return areas;
  }

  /**
   * Get recommended next steps
   */
  getNextSteps(weakTopics, accuracy) {
    const steps = [];

    if (weakTopics.length > 0) {
      steps.push(`Practice ${weakTopics[0].topic} questions (${weakTopics[0].attempts} attempts so far)`);
    }

    if (accuracy < 0.7) {
      steps.push('Review fundamental concepts before proceeding');
      steps.push('Take breaks between study sessions');
    } else {
      steps.push('Continue current pace - making good progress!');
      if (this.currentDifficulty !== DIFFICULTY_LEVELS.EXPERT) {
        steps.push('Ready to try more challenging questions');
      }
    }

    return steps;
  }
}

/**
 * Integration with Spaced Repetition
 */
export class AdaptiveSRSIntegration {
  constructor(adaptiveEngine, srsDecks) {
    this.adaptiveEngine = adaptiveEngine;
    this.srsDecks = srsDecks;
  }

  /**
   * Get recommended cards based on both SRS and adaptive engine
   */
  getRecommendedCards(count = 10) {
    const recommendedCards = [];

    // Get due cards from SRS
    const dueCards = [];
    this.srsDecks.forEach(deck => {
      dueCards.push(...deck.getDueCards());
    });

    // Get weak topics from adaptive engine
    const weakTopics = this.adaptiveEngine.tracker.getWeakTopics();
    const weakTopicNames = weakTopics.map(t => t.topic);

    // Prioritize cards:
    // 1. Due cards in weak topics (highest priority)
    // 2. Due cards in general
    // 3. New cards in weak topics
    // 4. New cards matching current difficulty

    const prioritized = dueCards.sort((a, b) => {
      const aIsWeak = weakTopicNames.includes(a.category);
      const bIsWeak = weakTopicNames.includes(b.category);

      if (aIsWeak && !bIsWeak) return -1;
      if (!aIsWeak && bIsWeak) return 1;

      // Sort by interval (cards due soonest first)
      return a.interval - b.interval;
    });

    recommendedCards.push(...prioritized.slice(0, count));

    // Fill remaining slots with new cards
    if (recommendedCards.length < count) {
      const newCards = [];
      this.srsDecks.forEach(deck => {
        newCards.push(...deck.getNewCards());
      });

      const recommendedDifficulty = this.adaptiveEngine.currentDifficulty;

      // Filter new cards by difficulty and weak topics
      const filteredNew = newCards
        .filter(card => {
          const matchesDifficulty = !card.difficulty || card.difficulty === recommendedDifficulty;
          const isWeakTopic = weakTopicNames.includes(card.category);
          return matchesDifficulty || isWeakTopic;
        })
        .slice(0, count - recommendedCards.length);

      recommendedCards.push(...filteredNew);
    }

    return recommendedCards;
  }

  /**
   * Process card review with adaptive tracking
   */
  processCardReview(card, quality, timeSpent) {
    // Update SRS
    const srsResult = card.review(quality);

    // Update adaptive engine
    this.adaptiveEngine.tracker.recordAnswer(
      card.id,
      quality >= DIFFICULTY_RATINGS.GOOD,
      timeSpent,
      card.category
    );

    // Get new recommendations
    const newDifficulty = this.adaptiveEngine.getRecommendedDifficulty();

    return {
      srsResult,
      adaptiveUpdate: {
        newDifficulty,
        accuracyTrend: this.adaptiveEngine.tracker.getRecentAccuracy(10),
      },
    };
  }
}

export default {
  DIFFICULTY_LEVELS,
  PerformanceTracker,
  AdaptiveEngine,
  AdaptiveSRSIntegration,
};
