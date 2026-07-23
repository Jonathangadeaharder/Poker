import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { boardArb, cardArb, deckArb, handArb, RANKS, SUITS } from './card';

describe('PBT Generators Smoke & Probability Invariants', () => {
	it('cardArb produces valid suit and rank', () => {
		fc.assert(
			fc.property(cardArb, (card) => {
				expect(SUITS).toContain(card.suit);
				expect(RANKS).toContain(card.rank);
			})
		);
	});

	it('deckArb generates 52 unique valid cards', () => {
		fc.assert(
			fc.property(deckArb, (deck) => {
				expect(deck.length).toBe(52);
				const cardKeys = new Set(deck.map((c) => `${c.rank}${c.suit}`));
				expect(cardKeys.size).toBe(52);
			})
		);
	});

	it('handArb generates exact requested hand size without duplicate cards', () => {
		for (const count of [2, 5, 7] as const) {
			fc.assert(
				fc.property(handArb(count), (hand) => {
					expect(hand.length).toBe(count);
					const keys = new Set(hand.map((c) => `${c.rank}${c.suit}`));
					expect(keys.size).toBe(count);
				})
			);
		}
	});

	it('boardArb generates 0 to 5 cards without duplicates', () => {
		fc.assert(
			fc.property(boardArb, (board) => {
				expect(board.length).toBeGreaterThanOrEqual(0);
				expect(board.length).toBeLessThanOrEqual(5);
				const keys = new Set(board.map((c) => `${c.rank}${c.suit}`));
				expect(keys.size).toBe(board.length);
			})
		);
	});

	it('pot odds calculation satisfies non-negativity and probability bounds', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 1000 }),
				fc.integer({ min: 1, max: 1000 }),
				(callAmount, potSize) => {
					const potOdds = callAmount / (potSize + callAmount);
					expect(potOdds).toBeGreaterThan(0);
					expect(potOdds).toBeLessThan(1);
				}
			)
		);
	});

	it('strategy weights sum to 1.0 within floating point tolerance', () => {
		fc.assert(
			fc.property(
				fc.record({
					fold: fc.float({ min: 0, max: 1, noNaN: true }),
					call: fc.float({ min: 0, max: 1, noNaN: true }),
					raise: fc.float({ min: 0, max: 1, noNaN: true })
				}),
				(weights) => {
					const total = weights.fold + weights.call + weights.raise;
					if (total > 0) {
						const normalized = {
							fold: weights.fold / total,
							call: weights.call / total,
							raise: weights.raise / total
						};
						const sum = normalized.fold + normalized.call + normalized.raise;
						expect(sum).toBeCloseTo(1.0, 5);
					}
				}
			)
		);
	});
});
