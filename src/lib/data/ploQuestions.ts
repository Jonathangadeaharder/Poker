import type { QuizQuestion } from './miniGames';
import { fromTuples, withExplanations } from './questionFactory';

const Q: [string, string, string, string, string, ...string[]][] = [
	['plo_1', 'plo_preflop', 'easy', 'What makes a strong PLO starting hand?', 'Four connected cards with two suits', 'Four high cards regardless of suits', 'Any hand with an Ace', 'Four cards of the same suit'],
	['plo_2', 'plo_preflop', 'medium', 'What is "dangler" in PLO?', 'Both A and B', "A card that doesn't connect with other three", 'A high card without suit connection', 'The worst card in your hand'],
	['plo_3', 'plo_preflop', 'hard', 'From the BTN in PLO, which hand is stronger?', 'JT98 double-suited', 'KKJ9 double-suited', 'AAT2 rainbow', 'QQT9 single-suited'],
	['plo_4', 'plo_equity', 'medium', 'Pre-flop in PLO, AA vs random hand has what equity?', '65%', "85% (like in Hold'em)", '70%', '80%'],
	['plo_5', 'plo_equity', 'hard', 'You have nut flush draw + pair on flop. Approximately how many outs?', '18-20 outs (redraw considerations)', '9 outs (flush)', '11 outs (flush + pair)', '14 outs'],
	['plo_6', 'plo_postflop', 'easy', 'On a paired board in PLO, what is the main danger?', 'Full houses', 'Straights', 'Flushes', 'Two pair'],
	['plo_7', 'plo_postflop', 'medium', 'You flop top set. Board: K73 rainbow. What is your main concern?', 'Opponents with wrap straight draws', 'Getting outdrawn by overpairs', 'Flush draws', 'Lower sets'],
	['plo_8', 'plo_postflop', 'hard', 'Flop: AKQ (two spades). You have AKQ2 (no spades). Correct play?', 'Check/call - way behind most ranges', 'Bet for value - you have top two', 'Check/fold - too vulnerable', 'Bet/fold - for thin value'],
	['plo_9', 'plo_draws', 'medium', 'What is a "wrap" straight draw?', 'All of the above', '4 cards to a straight', '8+ outs to make straight', '13+ outs (double wrap)'],
	['plo_10', 'plo_draws', 'hard', 'You have JT98ds. Flop: Q76. How many clean outs?', '13 outs (wrap)', '17 outs (wrap + backdoors)', '20 outs', '8 outs'],
	['plo_11', 'plo_position', 'easy', 'Position in PLO is:', 'More important than NLH', 'Less important than NLH', 'Equally important', 'Not important'],
	['plo_12', 'plo_position', 'medium', 'From UTG in PLO cash game, you should raise:', '10-15% of hands', '20-25% of hands', '30% of hands', '5-10% of hands'],
	['plo_13', 'plo_advanced', 'hard', 'Board runs out KQJT2 (two spades). You have A987 (two diamonds). Correct play?', 'Check - vulnerable to higher straight', 'Bet large - you have Ace-high straight', 'Small bet - for thin value', "Check/call - can't bet for value"],
	['plo_14', 'plo_advanced', 'hard', 'What does "having the idiot end" mean in PLO?', 'Bottom straight on connected board', 'Low flush on monotone board', 'Weak full house on paired board', 'All of the above'],
	['plo_15', 'plo_betting', 'medium', 'Standard c-bet size in PLO single-raised pot:', '50-66% pot', '33% pot (like NLH)', '75-100% pot', '25% pot'],
	['plo_16', 'plo_betting', 'hard', 'You pot flop, pot turn, river bricks. SPR = 1. Best size?', 'Pot bet (100%)', 'Overbet pot (150%+)', 'Check - too polarized', 'Small bet (33%)'],
	['plo_17', 'plo_tournament', 'medium', 'In PLO tournaments vs cash games, you should:', 'Play tighter preflop', 'Play looser preflop', 'Same ranges', 'Only play AAxx'],
	['plo_18', 'plo_tournament', 'hard', 'PLO MTT late stage (20bb), BTN opens pot. You have AAJ2ds in BB. Correct play?', 'Call and see flop', '3-bet pot (commit 40% stack)', '4-bet shove', 'Fold'],
	['plo_19', 'plo_mistakes', 'easy', 'Biggest mistake new PLO players make:', 'All of the above', 'Overvaluing AAxx', 'Undervaluing position', 'Playing too many hands'],
	['plo_20', 'plo_mistakes', 'medium', 'You hold KKxx. Flop comes AQ7 rainbow. What is the problem?', 'All of the above', 'Reverse implied odds', 'You rarely improve to best hand', 'Opponent likely has Ace'],
	['plo_21', 'plo_advanced', 'hard', 'What is a "double-suited" hand advantage over single-suited?', '~4-5% equity edge', '~2% equity edge', '~8-10% equity edge', '~1% equity edge'],
	['plo_22', 'plo_ranges', 'medium', 'From the BTN, which rundown is weakest?', '9876 rainbow', 'JT98 double-suited', '8765 double-suited', 'T987 single-suited'],
	['plo_23', 'plo_postflop', 'hard', 'Monotone flop (K92 all spades), you have KKT8 (one spade). What is your strategy?', 'Check/give up - flush likely out there', 'Bet for protection - you have top set', 'Small bet/fold - for information', 'Check/call - way behind vs flush'],
	['plo_24', 'plo_equity', 'medium', 'Flop equity realization in PLO is affected most by:', 'Position', 'Hand strength', 'Stack depth', 'All equally important'],
	['plo_25', 'plo_advanced', 'hard', 'Against tight 3-bettor, you should 4-bet bluff with:', 'Weak AAxx (blocks their AA)', 'Strong rundowns JT98ds', 'Small pairs with Broadway blockers', "None - don't bluff vs tight 3-bettors"]
];

const EXPLANATIONS: Record<string, string> = {
	plo_1: 'Strong PLO hands have connectivity (run potential), double-suited (flush potential), and high cards. AAxx double-suited is premium, but rundowns like JT98ds are also very strong.',
	plo_2: "A dangler is a card that doesn't work with your other cards. For example, in AAK2 with two diamonds, the 2c is a dangler. It reduces your hand's strength significantly.",
	plo_3: 'JT98ds is a premium rundown with massive playability. It makes straights more often than pairs make sets. KKxx has reverse implied odds. Rundowns > Big pairs in PLO.',
	plo_4: 'AA is much weaker preflop in PLO than NLH. AA vs random is ~65%, not 85%. PLO is a game of small edges. AA vs JT98ds is nearly 60/40.',
	plo_5: "In PLO, you need to count redraws. 9 flush outs + 2 trip outs + possible straight outs + pair improving to full house. Always consider opponent's redraws too!",
	plo_6: 'Paired boards make full houses very common in PLO. Your overpair or two pair is often crushed. Be very careful betting strongly on paired boards without trips+.',
	plo_7: 'Wrap draws (like JT98, QJ96) can have 20 outs against your set on dry boards. In PLO, always consider wrap potential. Your set is strong but vulnerable.',
	plo_8: "Top two on AKQ is weak in PLO. Opponents have many straights (JTxx), sets, two-pair + draws. You're often behind and don't improve much. Pot control is key.",
	plo_9: 'Wrap = multiple ways to make straights. Example: JT98 on 7-6-2 makes straight with any 9, T, 5, or 4 (13 outs!). Most powerful draws in PLO.',
	plo_10: 'Any 9, T, 8, or 5 makes the straight = 13 outs. (4+3+3+3, accounting for board cards). This is a massive draw - favorite against most made hands!',
	plo_11: 'Position is CRITICAL in PLO. Pots are bigger, decisions are harder, and drawing hands benefit massively from acting last. Play tighter from early position.',
	plo_12: 'PLO ranges are tighter than you think. Premium double-suited hands, AAxx, strong rundowns only. Avoid dangler hands and weak unsuited rundowns from EP.',
	plo_13: 'KQJT board = Broadway straight is common. Your Ace-high straight is often chopped or crushed. In PLO, straight over straight is common. Check and pot control.',
	plo_14: 'Having bottom straight is "idiot end". Example: You have 65 on 987. Any T makes better straight. Dangerous situation in PLO - often lose big pots.',
	plo_15: 'PLO c-bets are larger than NLH. 50-66% pot is standard because: draws are stronger, equity runs closer, and you need to charge draws appropriately.',
	plo_16: 'With SPR ~1, just get it in. Overbetting is unnecessary and allows opponent to fold too much. Pot bet or shove remaining stack. Simple and effective.',
	plo_17: "Tournament PLO = tighter ranges. Can't reload, ICM matters, and you want to avoid big flips. Prioritize strong double-suited hands and premium rundowns.",
	plo_18: 'AAxx is not as strong in PLO. With 20bb, 3-betting pot commits you to a flip. Calling keeps options open and allows you to flop sets or nut draws.',
	plo_19: "New PLO players: overplay AAxx (it's only 65% vs random!), don't respect position enough, and play way too loose. Tighten up and value position!",
	plo_20: "KK on Ace-high board = disaster. You're beat by any Ace (common in ranges), rarely improve, and when you do hit a King, you make second pair or lose to two-pair.",
	plo_21: 'Double-suited hands have approximately 4-5% more equity than single-suited equivalents. Two flush draws > one flush draw. Prioritize double-suited holdings.',
	plo_22: 'Rainbow rundowns are significantly weaker. No flush potential, and 9876 makes second-best straights often. Always prefer double-suited holdings.',
	plo_23: 'Monotone flops hit many ranges. Your set without the flush is often beat. Even if ahead now, you have only ~20% equity vs flush + redraw. Check and give up usually.',
	plo_24: "Position is king for equity realization. In position you can control pot size, see opponents' actions, and realize equity efficiently. OOP equity realization is terrible.",
	plo_25: 'AA2x or AA3x rainbow makes excellent 4-bet bluffs. You block their AA premium hands, and when called you still have decent equity with aces. Smart blocker play.'
};

export const PLO_QUESTIONS: QuizQuestion[] = withExplanations(fromTuples(Q), EXPLANATIONS);

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
		premium: ['AAxx double-suited (especially with connectedness)', 'KKxx double-suited with high cards', 'High rundowns: JT98, QJT9, KQJx double-suited'],
		strong: ['AAxx single-suited', 'AKQJ, AKJT double-suited', 'Medium rundowns: T987, 9876 double-suited', 'QQxx, JJxx double-suited'],
		marginal: ['Single-suited Broadway cards', 'Pairs with decent sidecard', 'Lower rundowns: 7654, 6543 double-suited'],
		trash: ['Dangler hands (AAK2 with no suits)', 'Rainbow hands with no connectivity', 'Low pairs with no other value (5522 rainbow)']
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
		strategy: "With big wraps, you can play very aggressively. You're often a favorite vs made hands."
	},

	BLOCKERS: {
		title: 'Blockers in PLO',
		importance: "Even more important than Hold'em",
		examples: ['Holding As on KsQs5s board blocks nut flush', 'Holding J or 9 on T-8-7 blocks many straight combos', 'Holding AA blocks opponent AAxx premium hands'],
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
