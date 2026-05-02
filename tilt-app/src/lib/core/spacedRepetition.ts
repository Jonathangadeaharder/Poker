/**
 * Spaced Repetition Engine
 * Based on SM-2 Algorithm (SuperMemo 2)
 *
 * Research shows: 90% retention is optimal for long-term learning
 * SM-2 is the gold standard for SRS (Spaced Repetition Systems)
 */

/**
 * SM-2 Algorithm Implementation
 *
 * Three main properties:
 * - n: Repetition number (how many times correctly repeated)
 * - EF: Easiness Factor (2.5 start, 1.3 minimum)
 * - I: Inter-repetition interval (in days)
 */

export const DIFFICULTY_RATINGS = {
	AGAIN: 0, // Completely wrong - card back to learning queue
	HARD: 1, // Difficult - smaller interval
	GOOD: 2, // Good - normal interval
	EASY: 3 // Easy - larger interval
} as const;

export type QualityRating = (typeof DIFFICULTY_RATINGS)[keyof typeof DIFFICULTY_RATINGS];

export interface ReviewResult {
	n: number;
	ef: number;
	interval: number;
	nextReview: Date;
	success: boolean;
}

export interface DeckStats {
	total: number;
	due: number;
	newCards: number;
	learning: number;
	mastered: number;
	avgRetention: number;
}

export interface SessionStats {
	newCards: number;
	reviews: number;
	correct: number;
	startTime: Date;
}

export interface SessionSummary extends SessionStats {
	duration: number;
	accuracy: number;
	endTime: Date;
}

export class Card {
	id: string;
	front: string;
	back: string;
	category: string;
	tags: string[];
	n: number;
	ef: number;
	interval: number;
	nextReview: Date;
	lastReviewed: Date | null;
	totalReviews: number;
	correctReviews: number;
	streakCorrect: number;
	created: Date;

	constructor(id: string, front: string, back: string, category: string, tags: string[] = []) {
		this.id = id;
		this.front = front;
		this.back = back;
		this.category = category;
		this.tags = tags;

		// SM-2 Properties
		this.n = 0; // Repetition count
		this.ef = 2.5; // Easiness Factor
		this.interval = 0; // Days until next review
		this.nextReview = new Date(); // Next review date
		this.lastReviewed = null;

		// Stats
		this.totalReviews = 0;
		this.correctReviews = 0;
		this.streakCorrect = 0;
		this.created = new Date();
	}

	/**
	 * SM-2 Algorithm Core
	 * @param quality - 0 (Again) to 3 (Easy)
	 * @returns Updated card properties
	 */
	review(quality: QualityRating): ReviewResult {
		this.totalReviews++;
		this.lastReviewed = new Date();

		// Calculate new EF
		// Formula: EF' = EF + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02))
		// Simplified for our 0-3 scale:
		const efDelta = 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02);
		this.ef = Math.max(1.3, this.ef + efDelta); // Minimum EF = 1.3 (Anki standard)

		// Update repetition count and interval
		if (quality < DIFFICULTY_RATINGS.GOOD) {
			// Failed - reset to learning phase
			this.n = 0;
			this.interval = 0;
			this.streakCorrect = 0;
			this.nextReview = new Date(); // Review again immediately
		} else {
			// Passed
			this.correctReviews++;
			this.streakCorrect++;

			if (this.n === 0) {
				this.interval = 1; // First successful review: 1 day
			} else if (this.n === 1) {
				this.interval = 6; // Second successful review: 6 days
			} else {
				this.interval = Math.round(this.interval * this.ef);
			}

			this.n++;

			// Calculate next review date
			const next = new Date();
			next.setDate(next.getDate() + this.interval);
			this.nextReview = next;
		}

		return {
			n: this.n,
			ef: this.ef,
			interval: this.interval,
			nextReview: this.nextReview,
			success: quality >= DIFFICULTY_RATINGS.GOOD
		};
	}

	isDue(currentDate: Date = new Date()): boolean {
		return this.nextReview <= currentDate;
	}

	getRetentionRate(): number {
		return this.totalReviews > 0 ? this.correctReviews / this.totalReviews : 0;
	}
}

/**
 * Deck Manager - manages collections of Cards
 */
export class Deck {
	name: string;
	description: string;
	cards: Card[];
	created: Date;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
		this.cards = [];
		this.created = new Date();
	}

	addCard(card: Card): void {
		this.cards.push(card);
	}

	getDueCards(currentDate: Date = new Date()): Card[] {
		return this.cards.filter((card) => card.isDue(currentDate));
	}

	getNewCards(): Card[] {
		return this.cards.filter((card) => card.totalReviews === 0);
	}

	getLearningCards(): Card[] {
		return this.cards.filter((card) => card.n < 2 && card.totalReviews > 0);
	}

	getStats(): DeckStats {
		const total = this.cards.length;
		const due = this.getDueCards().length;
		const newCards = this.getNewCards().length;
		const learning = this.getLearningCards().length;
		const mastered = this.cards.filter((card) => card.n >= 5).length;

		const totalReviews = this.cards.reduce((sum, card) => sum + card.totalReviews, 0);
		const correctReviews = this.cards.reduce((sum, card) => sum + card.correctReviews, 0);
		const avgRetention = totalReviews > 0 ? correctReviews / totalReviews : 0;

		return {
			total,
			due,
			newCards,
			learning,
			mastered,
			avgRetention: Math.round(avgRetention * 100)
		};
	}
}

/**
 * Pre-built poker decks
 */
export function createPokerDecks(): Deck[] {
	const decks: Deck[] = [];

	// Deck 1: Preflop Ranges (Cash Game)
	const rangeDeck = new Deck('Preflop Ranges (6-Max)', 'GTO-based RFI ranges for all positions');

	rangeDeck.addCard(
		new Card(
			'rfi_utg',
			'UTG RFI Range at 100bb?\n(Percentage + example hands)',
			'15%\nAA-77, AKs-AJs, AKo-AJo, KQs-KTs, QJs-JTs, A5s-A2s',
			'ranges',
			['rfi', 'utg', 'cash-game']
		)
	);

	rangeDeck.addCard(
		new Card(
			'rfi_btn',
			'BTN RFI Range at 100bb?\n(Percentage)',
			'45%\nAll pairs, all Ax, suited broadways, suited connectors, many offsuit combos',
			'ranges',
			['rfi', 'btn', 'cash-game']
		)
	);

	rangeDeck.addCard(
		new Card(
			'3bet_linear',
			'When do you use a LINEAR 3-Bet range?',
			'Against passive players who:\n- Rarely 4-bet (<5%)\n- Often call the 3-bet\n- Merged Range: TT+, AQ+, KQs (no bluffs)',
			'ranges',
			['3-bet', 'theory']
		)
	);

	decks.push(rangeDeck);

	// Deck 2: Push/Fold Charts (MTT)
	const pushFoldDeck = new Deck(
		'Push/Fold Charts (MTT)',
		'Nash Equilibrium ranges for short stack play'
	);

	pushFoldDeck.addCard(
		new Card(
			'pushfold_btn_20bb',
			'BTN Open-Shove Range at 20bb?',
			'52%\nAll pairs, all Ax, suited Kx, many suited connectors',
			'push_fold',
			['20bb', 'btn', 'mtt']
		)
	);

	pushFoldDeck.addCard(
		new Card(
			'pushfold_utg_10bb',
			'UTG Open-Shove Range at 10bb?',
			'35%\nAll pairs, all Ax, K9s+, KJo+, QJs+, JTs',
			'push_fold',
			['10bb', 'utg', 'mtt']
		)
	);

	decks.push(pushFoldDeck);

	// Deck 3: Exploitative Strategies
	const exploitDeck = new Deck(
		'Exploitative Strategies',
		'GTO-informed exploits against common leaks'
	);

	exploitDeck.addCard(
		new Card(
			'exploit_limper',
			'Opponent limps before you (2-3 limpers).\nWhat is the optimal exploit?',
			'ISO-RAISE:\n- Size: 3x + 1x per limper (4x-7x BB)\n- Range: Linear (22+, A2+, K9+, suited)\n- Postflop: ABC poker, rarely bluff\nExpected: +15-25bb/100',
			'exploits',
			['limper', 'iso-raise']
		)
	);

	exploitDeck.addCard(
		new Card(
			'exploit_calling_station',
			'Opponent is a calling station (folds <40% to C-Bets).\nWhich adjustment?',
			'STOP BLUFFS:\n- C-bet only value (top pair+)\n- Size: LARGER (75% pot instead of 33%)\n- Triple barrel with nuts\nExpected: +10-15bb/100',
			'exploits',
			['calling-station', 'c-bet']
		)
	);

	exploitDeck.addCard(
		new Card(
			'exploit_fit_or_fold',
			'Opponent plays fit-or-fold (folds >60% to C-Bets).\nOptimal exploit?',
			'C-BET 100%:\n- Every hand, even air\n- Size: 33% pot (small)\n- Triple barrel on dry boards\nExpected: +12-20bb/100',
			'exploits',
			['fit-or-fold', 'c-bet']
		)
	);

	decks.push(exploitDeck);

	// Deck 4: Concepts & Theory
	const theoryDeck = new Deck('Concepts & Theory', 'Fundamental poker concepts and theory');

	theoryDeck.addCard(
		new Card(
			'theory_10x_rule',
			'What is the 10x Rule?\nWhen do you apply it?',
			'SET MINING RULE:\n- Call with small pairs (22-66) only if:\n- Effective stacks >= 10x call amount\nExample: Raise 6bb -> need >=60bb stack\nWhy: ~12% to flop set, 10x = enough implied odds',
			'theory',
			['set-mining', 'implied-odds']
		)
	);

	theoryDeck.addCard(
		new Card(
			'theory_blocker',
			'Why is A5s the perfect 3-bet bluff hand?\n(Blocker concept)',
			'BLOCKER EFFECT:\n- Your Ace blocks AA (50% fewer combos: 3 vs 6)\n- Your Ace blocks AK (25% fewer combos: 9 vs 12)\n- Your 5 does NOT block the folds (KQs, QJs, 99, TT)\n- Opponent has fewer nuts, same amount of folds',
			'theory',
			['blocker', '3-bet']
		)
	);

	theoryDeck.addCard(
		new Card(
			'theory_icm',
			'What is ICM?\nWhy is it important in tournaments?',
			'ICM = Independent Chip Model:\n- Chips have NON-LINEAR value\n- The last chip is worth more than the first\n- Folding can be +EV (at bubble)\n- Play TIGHTER than chip-EV near bubble/Final Table',
			'theory',
			['icm', 'mtt', 'tournament']
		)
	);

	decks.push(theoryDeck);

	return decks;
}

/**
 * Session Manager - organizes study sessions
 */
export class StudySession {
	deck: Deck;
	newCardsPerSession: number;
	reviewsPerSession: number;
	cardsToday: Card[];
	currentIndex: number;
	sessionStats: SessionStats;

	constructor(deck: Deck, newCardsPerSession = 10, reviewsPerSession = 20) {
		this.deck = deck;
		this.newCardsPerSession = newCardsPerSession;
		this.reviewsPerSession = reviewsPerSession;
		this.cardsToday = [];
		this.currentIndex = 0;
		this.sessionStats = {
			newCards: 0,
			reviews: 0,
			correct: 0,
			startTime: new Date()
		};
	}

	startSession(): { totalCards: number; dueCards: number; newCards: number } {
		// Get due cards + some new cards
		const dueCards = this.deck.getDueCards();
		const newCards = this.deck.getNewCards().slice(0, this.newCardsPerSession);

		// Shuffle (Fisher-Yates)
		this.cardsToday = [...dueCards, ...newCards];
		for (let i = this.cardsToday.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cardsToday[i], this.cardsToday[j]] = [this.cardsToday[j], this.cardsToday[i]];
		}
		this.currentIndex = 0;

		return {
			totalCards: this.cardsToday.length,
			dueCards: dueCards.length,
			newCards: newCards.length
		};
	}

	getCurrentCard(): Card | null {
		if (this.currentIndex >= this.cardsToday.length) return null;
		return this.cardsToday[this.currentIndex];
	}

	submitAnswer(quality: QualityRating): (ReviewResult & { remaining: number }) | null {
		const card = this.getCurrentCard();
		if (!card) return null;

		const result = card.review(quality);

		// Update session stats
		if (card.totalReviews === 1) {
			this.sessionStats.newCards++;
		} else {
			this.sessionStats.reviews++;
		}

		if (result.success) {
			this.sessionStats.correct++;
		}

		this.currentIndex++;

		return {
			...result,
			remaining: this.cardsToday.length - this.currentIndex
		};
	}

	getSessionSummary(): SessionSummary {
		const duration = (new Date().getTime() - this.sessionStats.startTime.getTime()) / 1000 / 60; // minutes
		const total = this.sessionStats.newCards + this.sessionStats.reviews;
		const accuracy = total > 0 ? this.sessionStats.correct / total : 0;

		return {
			...this.sessionStats,
			duration: Math.round(duration),
			accuracy: Math.round(accuracy * 100),
			endTime: new Date()
		};
	}
}
