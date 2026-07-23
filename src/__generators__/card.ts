import fc from 'fast-check';

export type Suit = 'h' | 'd' | 'c' | 's';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
	suit: Suit;
	rank: Rank;
}

export const SUITS: Suit[] = ['h', 'd', 'c', 's'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export const cardArb: fc.Arbitrary<Card> = fc.record({
	suit: fc.constantFrom(...SUITS),
	rank: fc.constantFrom(...RANKS)
});

export const deckArb: fc.Arbitrary<Card[]> = fc.shuffledSubarray(
	SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank }))),
	{ minLength: 52, maxLength: 52 }
);

export const handArb = (count: 2 | 5 | 7): fc.Arbitrary<Card[]> =>
	fc.shuffledSubarray(
		SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank }))),
		{ minLength: count, maxLength: count }
	);

export const boardArb: fc.Arbitrary<Card[]> = fc.integer({ min: 0, max: 5 }).chain((count) =>
	fc.shuffledSubarray(
		SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank }))),
		{ minLength: count, maxLength: count }
	)
);
