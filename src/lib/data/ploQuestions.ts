import type { QuizQuestion } from './miniGames';
import rawData from './ploQuestions.json';
import { fromTuples, withExplanations } from './questionFactory';

const EXPLANATIONS: Record<string, string> = {
	plo_1:
		'Strong PLO hands have connectivity (run potential), double-suited (flush potential), and high cards. AAxx double-suited is premium, but rundowns like JT98ds are also very strong.',
	plo_2:
		"A dangler is a card that doesn't work with your other cards. For example, in AAK2 with two diamonds, the 2c is a dangler. It reduces your hand's strength significantly.",
	plo_3:
		'JT98ds is a premium rundown with massive playability. It makes straights more often than pairs make sets. KKxx has reverse implied odds. Rundowns > Big pairs in PLO.',
	plo_4:
		'AA is much weaker preflop in PLO than NLH. AA vs random is ~65%, not 85%. PLO is a game of small edges. AA vs JT98ds is nearly 60/40.',
	plo_5:
		"In PLO, you need to count redraws. 9 flush outs + 2 trip outs + possible straight outs + pair improving to full house. Always consider opponent's redraws too!",
	plo_6:
		'Paired boards make full houses very common in PLO. Your overpair or two pair is often crushed. Be very careful betting strongly on paired boards without trips+.',
	plo_7:
		'Wrap draws (like JT98, QJ96) can have 20 outs against your set on dry boards. In PLO, always consider wrap potential. Your set is strong but vulnerable.',
	plo_8:
		"Top two on AKQ is weak in PLO. Opponents have many straights (JTxx), sets, two-pair + draws. You're often behind and don't improve much. Pot control is key.",
	plo_9:
		'Wrap = multiple ways to make straights. Example: JT98 on 7-6-2 makes straight with any 9, T, 5, or 4 (13 outs!). Most powerful draws in PLO.',
	plo_10:
		'Any 9, T, 8, or 5 makes the straight = 13 outs. (4+3+3+3, accounting for board cards). This is a massive draw - favorite against most made hands!',
	plo_11:
		'Position is CRITICAL in PLO. Pots are bigger, decisions are harder, and drawing hands benefit massively from acting last. Play tighter from early position.',
	plo_12:
		'PLO ranges are tighter than you think. Premium double-suited hands, AAxx, strong rundowns only. Avoid dangler hands and weak unsuited rundowns from EP.',
	plo_13:
		'KQJT board = Broadway straight is common. Your Ace-high straight is often chopped or crushed. In PLO, straight over straight is common. Check and pot control.',
	plo_14:
		'Having bottom straight is "idiot end". Example: You have 65 on 987. Any T makes better straight. Dangerous situation in PLO - often lose big pots.',
	plo_15:
		'PLO c-bets are larger than NLH. 50-66% pot is standard because: draws are stronger, equity runs closer, and you need to charge draws appropriately.',
	plo_16:
		'With SPR ~1, just get it in. Overbetting is unnecessary and allows opponent to fold too much. Pot bet or shove remaining stack. Simple and effective.',
	plo_17:
		"Tournament PLO = tighter ranges. Can't reload, ICM matters, and you want to avoid big flips. Prioritize strong double-suited hands and premium rundowns.",
	plo_18:
		'AAxx is not as strong in PLO. With 20bb, 3-betting pot commits you to a flip. Calling keeps options open and allows you to flop sets or nut draws.',
	plo_19:
		"New PLO players: overplay AAxx (it's only 65% vs random!), don't respect position enough, and play way too loose. Tighten up and value position!",
	plo_20:
		"KK on Ace-high board = disaster. You're beat by any Ace (common in ranges), rarely improve, and when you do hit a King, you make second pair or lose to two-pair.",
	plo_21:
		'Double-suited hands have approximately 4-5% more equity than single-suited equivalents. Two flush draws > one flush draw. Prioritize double-suited holdings.',
	plo_22:
		'Rainbow rundowns are significantly weaker. No flush potential, and 9876 makes second-best straights often. Always prefer double-suited holdings.',
	plo_23:
		'Monotone flops hit many ranges. Your set without the flush is often beat. Even if ahead now, you have only ~20% equity vs flush + redraw. Check and give up usually.',
	plo_24:
		"Position is king for equity realization. In position you can control pot size, see opponents' actions, and realize equity efficiently. OOP equity realization is terrible.",
	plo_25:
		'AA2x or AA3x rainbow makes excellent 4-bet bluffs. You block their AA premium hands, and when called you still have decent equity with aces. Smart blocker play.'
};

export const PLO_QUESTIONS: QuizQuestion[] = withExplanations(fromTuples(rawData), EXPLANATIONS);

export interface PloConceptTier {
	title: string;
	strong: string[];
	marginal: string[];
	trash: string[];
	premium: string[];
}

export interface WrapExample {
	hand: string;
	flop: string;
	outs: string;
	equity: string;
}

export interface PloConcepts {
	HAND_RANKINGS: PloConceptTier & { title: string };
	WRAP_DRAWS: {
		title: string;
		definition: string;
		examples: WrapExample[];
		strategy: string;
	};
	BLOCKERS: {
		title: string;
		importance: string;
		examples: string[];
		application: string;
	};
	COMMON_LEAKS: Record<string, string>;
}

export const PLO_CONCEPTS: PloConcepts = {
	HAND_RANKINGS: {
		title: 'PLO Hand Strength Tiers',
		premium: [
			'AAxx double-suited (especially with connectedness)',
			'KKxx double-suited with high cards',
			'High rundowns: JT98, QJT9, KQJx double-suited'
		],
		strong: [
			'AAxx single-suited',
			'AKQJ, AKJT double-suited',
			'Medium rundowns: T987, 9876 double-suited',
			'QQxx, JJxx double-suited'
		],
		marginal: [
			'Single-suited Broadway cards',
			'Pairs with decent sidecard',
			'Lower rundowns: 7654, 6543 double-suited'
		],
		trash: [
			'Dangler hands (AAK2 with no suits)',
			'Rainbow hands with no connectivity',
			'Low pairs with no other value (5522 rainbow)'
		]
	},

	WRAP_DRAWS: {
		title: 'Understanding Wrap Straight Draws',
		definition: 'A draw where 8 or more cards complete your straight',
		examples: [
			{
				hand: 'JT98',
				flop: '7-6-2',
				outs: '13 outs (any 9, T, 5, or 4)',
				equity: '~54% to make straight by river'
			},
			{
				hand: 'KQJ9',
				flop: 'T-8-3',
				outs: '20 outs (any K, Q, J, 9, 7, or 6)',
				equity: '~67% to make straight by river'
			}
		],
		strategy:
			"With big wraps, you can play very aggressively. You're often a favorite vs made hands."
	},

	BLOCKERS: {
		title: 'Blockers in PLO',
		importance: "Even more important than Hold'em",
		examples: [
			'Holding As on KsQs5s board blocks nut flush',
			'Holding J or 9 on T-8-7 blocks many straight combos',
			'Holding AA blocks opponent AAxx premium hands'
		],
		application: 'Use blockers for bluffs, thin value bets, and reading opponent ranges'
	},

	COMMON_LEAKS: {
		overplaying_aces: "AAxx is good but not invincible. Don't go broke with bare aces.",
		ignoring_position: 'Never limp from EP. Position is critical for seeing all actions.',
		chasing_draws: 'Not all draws are equal. Straight-to-lower-straight is dangerous.',
		playing_danglers: 'Hands like AAK2 rainbow are much weaker than they look.',
		overvaluing_two_pair: 'Two pair on wet boards is often behind or has terrible equity.'
	}
};
