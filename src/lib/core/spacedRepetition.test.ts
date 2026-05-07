import { beforeEach, describe, expect, it } from 'vitest';
import { Card, createPokerDecks, Deck, DIFFICULTY_RATINGS, StudySession } from './spacedRepetition';

let card: Card;
let deck: Deck;
let session: StudySession;

beforeEach(() => {
	card = new Card('test_1', 'What is GTO?', 'Game Theory Optimal', 'theory', ['gto']);
	deck = new Deck('Test Deck', 'A test deck');
	for (let i = 0; i < 5; i++) {
		deck.addCard(new Card(`c${i}`, `front ${i}`, `back ${i}`, 'test'));
	}
	session = new StudySession(deck, 3, 5);
});

describe('DIFFICULTY_RATINGS', () => {
	it('defines AGAIN=0, HARD=1, GOOD=2, EASY=3', () => {
		expect(DIFFICULTY_RATINGS.AGAIN).toBe(0);
		expect(DIFFICULTY_RATINGS.HARD).toBe(1);
		expect(DIFFICULTY_RATINGS.GOOD).toBe(2);
		expect(DIFFICULTY_RATINGS.EASY).toBe(3);
	});
});

describe('Card', () => {
	it('initializes with default SM-2 values', () => {
		expect(card.n).toBe(0);
		expect(card.ef).toBe(2.5);
		expect(card.interval).toBe(0);
		expect(card.totalReviews).toBe(0);
		expect(card.correctReviews).toBe(0);
		expect(card.streakCorrect).toBe(0);
		expect(card.lastReviewed).toBeNull();
	});

	it('stores metadata correctly', () => {
		expect(card.id).toBe('test_1');
		expect(card.front).toBe('What is GTO?');
		expect(card.back).toBe('Game Theory Optimal');
		expect(card.category).toBe('theory');
		expect(card.tags).toEqual(['gto']);
	});

	describe('review - SM-2 algorithm', () => {
		it('resets on AGAIN (quality 0)', () => {
			card.n = 3;
			card.interval = 10;
			const result = card.review(DIFFICULTY_RATINGS.AGAIN);
			expect(result.success).toBe(false);
			expect(card.n).toBe(0);
			expect(card.interval).toBe(0);
			expect(card.streakCorrect).toBe(0);
		});

		it('sets interval to 1 on first GOOD review', () => {
			const result = card.review(DIFFICULTY_RATINGS.GOOD);
			expect(result.success).toBe(true);
			expect(card.n).toBe(1);
			expect(card.interval).toBe(1);
			expect(card.correctReviews).toBe(1);
		});

		it('sets interval to 6 on second GOOD review', () => {
			card.review(DIFFICULTY_RATINGS.GOOD);
			const result = card.review(DIFFICULTY_RATINGS.GOOD);
			expect(card.n).toBe(2);
			expect(card.interval).toBe(6);
		});

		it('multiplies interval by EF on subsequent reviews', () => {
			card.review(DIFFICULTY_RATINGS.GOOD); // n=1, interval=1
			card.review(DIFFICULTY_RATINGS.GOOD); // n=2, interval=6
			const result = card.review(DIFFICULTY_RATINGS.GOOD); // n=3, interval = round(6 * ef)
			expect(card.n).toBe(3);
			expect(card.interval).toBe(Math.round(6 * card.ef));
		});

		it('decreases EF on HARD review', () => {
			const initialEf = card.ef;
			card.review(DIFFICULTY_RATINGS.HARD);
			expect(card.ef).toBeLessThan(initialEf);
		});

		it('increases EF on EASY review', () => {
			const initialEf = card.ef;
			card.review(DIFFICULTY_RATINGS.EASY);
			expect(card.ef).toBeGreaterThan(initialEf);
		});

		it('never drops EF below 1.3', () => {
			for (let i = 0; i < 20; i++) {
				card.review(DIFFICULTY_RATINGS.AGAIN);
			}
			expect(card.ef).toBeGreaterThanOrEqual(1.3);
		});

		it('increments totalReviews', () => {
			card.review(DIFFICULTY_RATINGS.GOOD);
			expect(card.totalReviews).toBe(1);
			card.review(DIFFICULTY_RATINGS.AGAIN);
			expect(card.totalReviews).toBe(2);
		});

		it('tracks streakCorrect', () => {
			card.review(DIFFICULTY_RATINGS.GOOD);
			card.review(DIFFICULTY_RATINGS.GOOD);
			expect(card.streakCorrect).toBe(2);
			card.review(DIFFICULTY_RATINGS.AGAIN);
			expect(card.streakCorrect).toBe(0);
		});

		it('sets nextReview date after successful review', () => {
			card.review(DIFFICULTY_RATINGS.GOOD);
			expect(card.nextReview).toBeInstanceOf(Date);
		});

		it('returns ReviewResult with correct shape', () => {
			const result = card.review(DIFFICULTY_RATINGS.GOOD);
			expect(result).toHaveProperty('n');
			expect(result).toHaveProperty('ef');
			expect(result).toHaveProperty('interval');
			expect(result).toHaveProperty('nextReview');
			expect(result).toHaveProperty('success');
		});
	});

	describe('isDue', () => {
		it('returns true for new cards', () => {
			expect(card.isDue()).toBe(true);
		});

		it('returns false when nextReview is in the future', () => {
			card.review(DIFFICULTY_RATINGS.GOOD); // interval = 1 day
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() - 1);
			expect(card.isDue(tomorrow)).toBe(false);
		});

		it('returns true when nextReview has passed', () => {
			card.review(DIFFICULTY_RATINGS.GOOD); // interval = 1 day
			const future = new Date();
			future.setDate(future.getDate() + 2);
			expect(card.isDue(future)).toBe(true);
		});
	});

	describe('getRetentionRate', () => {
		it('returns 0 for new cards', () => {
			expect(card.getRetentionRate()).toBe(0);
		});

		it('calculates correct retention rate', () => {
			card.review(DIFFICULTY_RATINGS.GOOD); // correct
			card.review(DIFFICULTY_RATINGS.AGAIN); // incorrect
			card.review(DIFFICULTY_RATINGS.GOOD); // correct
			expect(card.getRetentionRate()).toBeCloseTo(2 / 3, 2);
		});
	});
});

describe('Deck', () => {
	it('initializes correctly', () => {
		expect(deck.name).toBe('Test Deck');
		expect(deck.description).toBe('A test deck');
		expect(deck.cards).toHaveLength(0);
	});

	it('adds cards', () => {
		const card = new Card('c1', 'front', 'back', 'test');
		deck.addCard(card);
		expect(deck.cards).toHaveLength(1);
	});

	it('returns due cards', () => {
		const card1 = new Card('c1', 'front', 'back', 'test');
		const card2 = new Card('c2', 'front', 'back', 'test');
		card2.nextReview = new Date('2099-01-01'); // Not due
		deck.addCard(card1);
		deck.addCard(card2);
		expect(deck.getDueCards()).toHaveLength(1);
	});

	it('returns new cards (never reviewed)', () => {
		const card1 = new Card('c1', 'front', 'back', 'test');
		const card2 = new Card('c2', 'front', 'back', 'test');
		card2.totalReviews = 1; // Has been reviewed
		deck.addCard(card1);
		deck.addCard(card2);
		expect(deck.getNewCards()).toHaveLength(1);
	});

	it('returns learning cards (n < 2 and reviewed)', () => {
		const card1 = new Card('c1', 'front', 'back', 'test');
		card1.totalReviews = 1;
		card1.n = 1;
		const card2 = new Card('c2', 'front', 'back', 'test');
		card2.totalReviews = 5;
		card2.n = 5;
		deck.addCard(card1);
		deck.addCard(card2);
		expect(deck.getLearningCards()).toHaveLength(1);
	});

	describe('getStats', () => {
		it('returns correct stats for empty deck', () => {
			const stats = deck.getStats();
			expect(stats.total).toBe(0);
			expect(stats.due).toBe(0);
			expect(stats.newCards).toBe(0);
		});

		it('returns correct stats with cards', () => {
			deck.addCard(new Card('c1', 'front', 'back', 'test'));
			deck.addCard(new Card('c2', 'front', 'back', 'test'));
			const stats = deck.getStats();
			expect(stats.total).toBe(2);
			expect(stats.newCards).toBe(2);
		});
	});
});

describe('StudySession', () => {
	it('initializes with correct params', () => {
		expect(session.newCardsPerSession).toBe(3);
		expect(session.reviewsPerSession).toBe(5);
	});

	it('starts session with cards', () => {
		const info = session.startSession();
		expect(info.totalCards).toBeGreaterThan(0);
		expect(info.newCards).toBeGreaterThan(0);
	});

	it('returns current card', () => {
		session.startSession();
		expect(session.getCurrentCard()).not.toBeNull();
	});

	it('returns null when session is complete', () => {
		session.startSession();
		while (session.getCurrentCard()) {
			session.submitAnswer(DIFFICULTY_RATINGS.GOOD);
		}
		expect(session.getCurrentCard()).toBeNull();
		expect(session.submitAnswer(DIFFICULTY_RATINGS.GOOD)).toBeNull();
	});

	it('tracks session stats', () => {
		session.startSession();
		session.submitAnswer(DIFFICULTY_RATINGS.GOOD);
		const summary = session.getSessionSummary();
		expect(summary.correct).toBe(1);
		expect(summary.accuracy).toBe(100);
	});

	it('calculates summary correctly', () => {
		session.startSession();
		session.submitAnswer(DIFFICULTY_RATINGS.GOOD);
		session.submitAnswer(DIFFICULTY_RATINGS.AGAIN);
		const summary = session.getSessionSummary();
		expect(summary.accuracy).toBe(50);
		expect(summary.duration).toBeGreaterThanOrEqual(0);
	});
});

describe('createPokerDecks', () => {
	it('creates 4 decks', () => {
		const decks = createPokerDecks();
		expect(decks).toHaveLength(4);
	});

	it('each deck has cards', () => {
		const decks = createPokerDecks();
		for (const deck of decks) {
			expect(deck.cards.length).toBeGreaterThan(0);
		}
	});

	it('decks have correct names', () => {
		const decks = createPokerDecks();
		const names = decks.map((d) => d.name);
		expect(names).toContain('Preflop Ranges (6-Max)');
		expect(names).toContain('Push/Fold Charts (MTT)');
		expect(names).toContain('Exploitative Strategies');
		expect(names).toContain('Concepts & Theory');
	});

	it('all cards have unique ids', () => {
		const decks = createPokerDecks();
		const ids = new Set<string>();
		for (const deck of decks) {
			for (const card of deck.cards) {
				ids.add(card.id);
			}
		}
		// No duplicates
		const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
		expect(ids.size).toBe(totalCards);
	});
});
