/**
 * Tests for Spaced Repetition System
 */

import {
  DIFFICULTY_RATINGS,
  Card,
  Deck,
  StudySession,
} from '../src/core/spacedRepetition';

describe('Spaced Repetition System', () => {
  describe('Card', () => {
    let card;

    beforeEach(() => {
      card = new Card(
        'test_1',
        'What is the UTG RFI range?',
        '15%: AA-77, AK-AJ...',
        'ranges',
        ['rfi', 'utg']
      );
    });

    it('should initialize with correct defaults', () => {
      expect(card.n).toBe(0);
      expect(card.ef).toBe(2.5);
      expect(card.interval).toBe(0);
      expect(card.totalReviews).toBe(0);
    });

    it('should update on GOOD review', () => {
      const result = card.review(DIFFICULTY_RATINGS.GOOD);
      expect(result.success).toBe(true);
      expect(card.n).toBe(1);
      expect(card.interval).toBe(1); // First review = 1 day
      expect(card.totalReviews).toBe(1);
      expect(card.correctReviews).toBe(1);
    });

    it('should reset on AGAIN review', () => {
      card.review(DIFFICULTY_RATINGS.GOOD);
      card.review(DIFFICULTY_RATINGS.GOOD);
      expect(card.n).toBe(2);

      const result = card.review(DIFFICULTY_RATINGS.AGAIN);
      expect(result.success).toBe(false);
      expect(card.n).toBe(0);
      expect(card.interval).toBe(0);
      expect(card.streakCorrect).toBe(0);
    });

    it('should calculate intervals correctly', () => {
      card.review(DIFFICULTY_RATINGS.GOOD); // n=1, interval=1
      card.review(DIFFICULTY_RATINGS.GOOD); // n=2, interval=6
      expect(card.interval).toBe(6);

      card.review(DIFFICULTY_RATINGS.GOOD); // n=3, interval=6*EF
      expect(card.interval).toBeGreaterThan(6);
    });

    it('should adjust EF based on difficulty', () => {
      const initialEF = card.ef;
      card.review(DIFFICULTY_RATINGS.EASY);
      expect(card.ef).toBeGreaterThan(initialEF);

      const beforeHard = card.ef;
      card.review(DIFFICULTY_RATINGS.HARD);
      expect(card.ef).toBeLessThan(beforeHard);
    });

    it('should maintain minimum EF of 1.3', () => {
      // Review with HARD many times
      for (let i = 0; i < 20; i++) {
        card.review(DIFFICULTY_RATINGS.HARD);
      }
      expect(card.ef).toBeGreaterThanOrEqual(1.3);
    });

    it('should determine if card is due', () => {
      expect(card.isDue()).toBe(true); // New card

      card.review(DIFFICULTY_RATINGS.GOOD);
      expect(card.isDue()).toBe(false); // Due tomorrow
    });

    it('should calculate retention rate', () => {
      card.review(DIFFICULTY_RATINGS.GOOD);
      card.review(DIFFICULTY_RATINGS.GOOD);
      card.review(DIFFICULTY_RATINGS.AGAIN);

      const rate = card.getRetentionRate();
      expect(rate).toBeCloseTo(0.667, 2);
    });
  });

  describe('Deck', () => {
    let deck;

    beforeEach(() => {
      deck = new Deck('Test Deck', 'Test deck for unit tests');
    });

    it('should initialize empty', () => {
      expect(deck.cards.length).toBe(0);
    });

    it('should add cards', () => {
      const card = new Card('1', 'Q', 'A', 'test');
      deck.addCard(card);
      expect(deck.cards.length).toBe(1);
    });

    it('should get new cards', () => {
      const card1 = new Card('1', 'Q1', 'A1', 'test');
      const card2 = new Card('2', 'Q2', 'A2', 'test');
      deck.addCard(card1);
      deck.addCard(card2);

      const newCards = deck.getNewCards();
      expect(newCards.length).toBe(2);
    });

    it('should get due cards', () => {
      const card = new Card('1', 'Q', 'A', 'test');
      deck.addCard(card);

      const dueCards = deck.getDueCards();
      expect(dueCards.length).toBe(1);
    });

    it('should get learning cards', () => {
      const card = new Card('1', 'Q', 'A', 'test');
      deck.addCard(card);
      card.review(DIFFICULTY_RATINGS.GOOD); // Now it's a learning card

      const learningCards = deck.getLearningCards();
      expect(learningCards.length).toBe(1);
    });

    it('should calculate stats correctly', () => {
      const card1 = new Card('1', 'Q1', 'A1', 'test');
      const card2 = new Card('2', 'Q2', 'A2', 'test');
      deck.addCard(card1);
      deck.addCard(card2);

      card1.review(DIFFICULTY_RATINGS.GOOD);
      card1.review(DIFFICULTY_RATINGS.GOOD);
      card2.review(DIFFICULTY_RATINGS.AGAIN);

      const stats = deck.getStats();
      expect(stats.total).toBe(2);
      expect(stats.due).toBe(1); // card2 is due (failed)
      expect(stats.learning).toBe(1); // card1 is learning
      expect(stats.avgRetention).toBeLessThan(100);
    });
  });

  describe('StudySession', () => {
    let deck, session;

    beforeEach(() => {
      deck = new Deck('Test', 'Test');
      for (let i = 0; i < 15; i++) {
        deck.addCard(new Card(`${i}`, `Q${i}`, `A${i}`, 'test'));
      }
      session = new StudySession(deck, 5, 10);
    });

    it('should start session with correct card count', () => {
      const result = session.startSession();
      expect(result.totalCards).toBeGreaterThan(0);
      expect(result.newCards).toBeLessThanOrEqual(5);
    });

    it('should get current card', () => {
      session.startSession();
      const card = session.getCurrentCard();
      expect(card).not.toBeNull();
    });

    it('should submit answer and move to next', () => {
      session.startSession();
      const result = session.submitAnswer(DIFFICULTY_RATINGS.GOOD);
      expect(result.success).toBe(true);
      expect(session.sessionStats.correct).toBe(1);
    });

    it('should complete session', () => {
      session.startSession();
      while (session.getCurrentCard()) {
        session.submitAnswer(DIFFICULTY_RATINGS.GOOD);
      }
      const summary = session.getSessionSummary();
      expect(summary.duration).toBeGreaterThanOrEqual(0);
      expect(summary.accuracy).toBeGreaterThan(0);
    });
  });
});
