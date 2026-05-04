import type { QuizQuestion } from './miniGames';
import { buildQuestions, makeQuestion } from './questionFactory';

const q = makeQuestion;

const RAW_QUESTIONS: QuizQuestion[] = [
	// EARLY STAGE (100+ BB)
	q(
		'mtt_1',
		'mtt_early',
		'easy',
		'In early stage (100bb), your main goal is:',
		'Accumulate chips aggressively',
		'Survive to later stages',
		'Play tight and preserve stack',
		'See cheap flops and hit big hands'
	),
	q(
		'mtt_2',
		'mtt_early',
		'medium',
		'Early stage, villain limps from MP. You have AJ on BTN. Best play?',
		'ISO-raise to 5x BB',
		'Limp behind - see cheap flop',
		'Fold - dominated too often',
		'Min-raise to 2.5x BB'
	),
	q(
		'mtt_3',
		'mtt_early',
		'medium',
		'150bb effective, you raise BTN with 98s. BB calls. Flop: K73 (two spades). BB checks. What sizing?',
		'Bet 33% pot',
		'Check behind - missed',
		'Bet 50% pot',
		'Bet 75% pot'
	),
	q(
		'mtt_4',
		'mtt_early',
		'hard',
		'You open UTG, BTN 3-bets, blinds fold. You have JJ (100bb). Correct play?',
		'Call - see flop in position',
		'4-bet to 2.5x their 3-bet',
		'Fold - face overcards too often',
		'4-bet shove 100bb'
	),
	// MIDDLE STAGE (30-60 BB)
	q(
		'mtt_5',
		'mtt_middle',
		'easy',
		'Middle stage (40bb), antes in play. Your strategy should adjust by:',
		'Opening wider - more to win',
		'Playing tighter - more at risk',
		'Same strategy',
		'Only play premiums'
	),
	q(
		'mtt_6',
		'mtt_middle',
		'medium',
		'35bb stack, you open BTN with KQo. SB shoves 25bb. Blinds 500/1000, ante 100. Call or fold?',
		'Call - getting good odds',
		'Fold - need stronger hand',
		'Call - dominating his range',
		'Fold - too much variance'
	),
	q(
		'mtt_7',
		'mtt_middle',
		'hard',
		'40bb stack, CO opens 2.5bb, you 3-bet BTN to 7bb with A5s. CO calls. Flop: K92 (rainbow). CO checks. Best play?',
		'Bet 4bb (33% pot)',
		'Check back - missed completely',
		'Bet 6bb (50% pot)',
		'Bet 9bb (75% pot)'
	),
	q(
		'mtt_8',
		'mtt_middle',
		'hard',
		'50bb, MP opens 2.2bb, BTN calls, you call BB with 98s. Flop: Q94 (pot 7.6bb). MP bets 4bb, BTN folds. Your play?',
		'Fold - weak kicker, no draws',
		'Call - 2nd pair decent',
		'Raise to 12bb - semi-bluff',
		'Shove 48bb'
	),
	// LATE STAGE (20-30 BB)
	q(
		'mtt_9',
		'mtt_late',
		'easy',
		'Late stage (20bb), when should you consider limping?',
		'Never - always raise or fold',
		'With small pairs from SB',
		'With speculative hands in EP',
		'Frequently to see cheap flops'
	),
	q(
		'mtt_10',
		'mtt_late',
		'medium',
		'22bb stack, folds to you in SB with KTo. BB has 18bb. Correct play?',
		'Shove 22bb',
		'Limp - see cheap flop',
		'Min-raise to 2bb',
		'Raise to 2.5bb'
	),
	q(
		'mtt_11',
		'mtt_late',
		'hard',
		'25bb, CO opens 2.2bb (22bb behind). You have AQs on BTN (25bb). Best play?',
		'3-bet shove 25bb',
		'Call - see flop with position',
		'3-bet to 6bb',
		'Fold - avoid domination'
	),
	q(
		'mtt_12',
		'mtt_late',
		'hard',
		'20bb, MP opens 2.5bb, folds to you in BB with TT. Villain has 35bb. Your play?',
		'3-bet shove 20bb',
		'Call - set mine',
		'3-bet to 7.5bb',
		'Fold'
	),
	// PUSH/FOLD STAGE (< 20 BB)
	q(
		'mtt_13',
		'mtt_push_fold',
		'easy',
		'At what stack depth does push/fold strategy become most important?',
		'15bb',
		'30bb',
		'20bb',
		'10bb'
	),
	q(
		'mtt_14',
		'mtt_push_fold',
		'medium',
		'12bb in CO, folds to you with QJo. Correct play?',
		'Shove 12bb',
		'Fold - need stronger',
		'Min-raise 2bb',
		'Raise to 2.5bb'
	),
	q(
		'mtt_15',
		'mtt_push_fold',
		'hard',
		'10bb in BTN, SB (8bb) and BB (12bb). Folds to you, you have A7o. Correct play?',
		'Shove 10bb',
		'Fold - weak ace',
		'Min-raise 2bb',
		'Raise to 2.5bb'
	),
	q(
		'mtt_16',
		'mtt_push_fold',
		'hard',
		'8bb in BB, BTN shoves 15bb. You have KQo. Pot odds require 40% equity to call. Your play?',
		'Call - KQ strong enough',
		'Fold - need better hand',
		'Call - priced in',
		'Fold - variance too high'
	),
	// BUBBLE PLAY
	q(
		'mtt_17',
		'mtt_bubble',
		'easy',
		'On the bubble, the correct strategy is generally:',
		'Apply pressure on medium stacks',
		'Play very tight - wait for money',
		'Go all-in every hand',
		'Min-cash is the goal'
	),
	q(
		'mtt_18',
		'mtt_bubble',
		'medium',
		'You have 25bb on bubble (avg 30bb). MP (40bb) opens 2.5bb, folds to you in BB with 99. Correct play?',
		'3-bet to 7.5bb',
		'Fold - protect stack on bubble',
		'Call - see flop',
		'3-bet shove 25bb'
	),
	q(
		'mtt_19',
		'mtt_bubble',
		'hard',
		'Bubble: You (50bb), shortstack (7bb) in SB, BB (30bb). Folds to you in CO with A5s. Play?',
		'Raise 3bb - larger to pressure BB',
		'Fold - shortstack about to bust',
		'Raise 2.5bb - standard open',
		'Limp - avoid shortstack'
	),
	q(
		'mtt_20',
		'mtt_bubble',
		'hard',
		'Stone bubble (1 from money), you (15bb) in BB, BTN (40bb) shoves. You have AJs. Call or fold?',
		'Fold - ICM pressure huge',
		'Fold - min-cash secured by waiting',
		'Call - AJs too strong to fold',
		'Call - chip EV positive'
	),
	// FINAL TABLE
	q(
		'mtt_21',
		'mtt_final_table',
		'medium',
		'At final table, ICM pressure is:',
		'Much higher than bubble',
		'Same as bubble',
		'Lower than bubble',
		'Irrelevant - chip EV only'
	),
	q(
		'mtt_22',
		'mtt_final_table',
		'hard',
		'Final table (9 left), you (20bb, 5th in chips). Shortstack (5bb) shoves UTG, folds to you in BTN with AKo. Call?',
		'Call - AK is premium',
		'Fold - let shortstacks battle',
		'Call - dominating range',
		'Fold - ICM considerations'
	),
	q(
		'mtt_23',
		'mtt_final_table',
		'hard',
		'FT, 6 players left. You (15bb, 4th), chipleader (60bb) on BTN, you in SB with KQs. Chipleader opens 2.5bb. Play?',
		'Fold - avoid big stack',
		'3-bet to 7bb',
		'3-bet shove 15bb',
		'Call'
	),
	// ADDITIONAL ADVANCED MTT QUESTIONS
	q(
		'mtt_24',
		'mtt_icm',
		'hard',
		'What is the primary difference between chip EV and ICM calculations?',
		'ICM values survival over accumulation',
		'Chip EV is always more profitable',
		'ICM only matters on bubble',
		'No significant difference'
	),
	q(
		'mtt_25',
		'mtt_ranges',
		'medium',
		'From UTG with 30bb, your opening range should be approximately:',
		'15-18%',
		'8-10%',
		'20-22%',
		'25%+'
	),
	q(
		'mtt_26',
		'mtt_postflop',
		'hard',
		'You open BTN (40bb), BB calls. Flop: A72 (heads up, pot 7bb). BB checks. Your AKo. What size?',
		'Bet 2bb (33% pot)',
		'Check - way ahead',
		'Bet 3.5bb (50% pot)',
		'Bet 5bb (75% pot)'
	),
	q(
		'mtt_27',
		'mtt_strategy',
		'medium',
		'In MTT vs cash games, your red line (non-showdown winnings) should be:',
		'Much higher - more aggression needed',
		'Lower - tighter play',
		'Same as cash',
		'Irrelevant stat for MTTs'
	),
	q(
		'mtt_28',
		'mtt_bubble',
		'medium',
		'On bubble, you have 10bb (shortest at table). Best strategy?',
		'Shove or fold aggressively',
		'Min-raise to see flops',
		'Wait for premium hands',
		'Fold to money'
	),
	q(
		'mtt_29',
		'mtt_final_table',
		'hard',
		'3-handed, you (30bb), villain1 (40bb), villain2 (30bb). Villain1 shoves button, you in SB with 88. Call?',
		'Call - 88 strong 3-handed',
		'Fold - avoid flip',
		'Call - getting great odds',
		'Fold - wait for better spot'
	),
	q(
		'mtt_30',
		'mtt_early',
		'medium',
		'120bb deep, you raise BTN with QJs, BB calls (100bb). Flop: KT3 (one spade). BB checks. Your play?',
		'Bet 33% pot - c-bet',
		'Check - weak hand',
		'Bet 50% pot',
		'Bet 75% pot'
	),
	// Stack preservation questions
	q(
		'mtt_31',
		'mtt_middle',
		'medium',
		'45bb, you open CO with AQo. BTN 3-bets to 10bb (55bb behind). Correct play?',
		'Fold - avoid big pot OOP',
		'Call - position is bad for you',
		'4-bet to 24bb',
		'4-bet shove 45bb'
	),
	q(
		'mtt_32',
		'mtt_late',
		'hard',
		'28bb, BTN (25bb) opens 2.5bb, you in BB with AA. What is optimal play?',
		'3-bet to 7bb',
		'Call - trap',
		'3-bet shove 28bb',
		'Flat call - see flop'
	),
	q(
		'mtt_33',
		'mtt_push_fold',
		'medium',
		'14bb in MP, folds to you with 88. Correct play?',
		'Shove 14bb',
		'Fold - too weak for shove',
		'Raise to 2.5bb',
		'Limp'
	),
	q(
		'mtt_34',
		'mtt_final_table',
		'hard',
		'Heads up, you (60bb), villain (40bb). You on BTN with 76s. Correct play?',
		'Raise to 2.5bb',
		'Fold - weak hand',
		'Limp',
		'Raise to 2bb'
	),
	// Blind stealing questions
	q(
		'mtt_35',
		'mtt_middle',
		'easy',
		'What is a "resteal"?',
		'3-betting vs late position opener',
		'Stealing blinds from late position',
		'Calling a steal attempt',
		'Opening from blinds'
	),
	q(
		'mtt_36',
		'mtt_middle',
		'medium',
		'35bb in BB, BTN (40bb) opens 2.2bb. You have K9s. Resteal shove or fold?',
		'Fold - not strong enough',
		'Call - see flop',
		'Shove 35bb - resteal',
		'3-bet to 7bb'
	),
	q(
		'mtt_37',
		'mtt_late',
		'hard',
		'22bb, BTN opens 2.2bb (28bb behind), you in SB with ATo. BB is tight (30bb). Best play?',
		'3-bet shove 22bb',
		'Fold',
		'Call - see flop',
		'3-bet to 6.5bb'
	),
	// River play
	q(
		'mtt_38',
		'mtt_postflop',
		'hard',
		'You bluff turn, villain calls. River bricks. Pot = 30bb, you have 40bb behind. Optimal river play?',
		'Give up - he called turn',
		'Bet 15bb (50% pot)',
		'Shove 40bb (130% pot)',
		'Bet 20bb (66% pot)'
	),
	q(
		'mtt_39',
		'mtt_postflop',
		'medium',
		'You have top pair on river. Villain bets 60% pot. Your hand beats bluffs, loses to value. Correct play?',
		'Call if villain capable of bluffing',
		'Call - bluff-catchers should call',
		'Fold - if he bets he has it',
		'Raise - for thin value'
	),
	// Pay jump considerations
	q(
		'mtt_40',
		'mtt_icm',
		'hard',
		"FT, 5 players left, you're 5th in chips (12bb). 4th place pays $5k, 3rd pays $8k. Best strategy?",
		'Play push/fold aggressively',
		'Survive to next pay jump',
		'Ladder by waiting',
		'Shove every hand'
	),
	// Range construction
	q(
		'mtt_41',
		'mtt_ranges',
		'medium',
		'From BTN with 35bb and antes, optimal opening range is approximately:',
		'45%',
		'25%',
		'35%',
		'55%'
	),
	q(
		'mtt_42',
		'mtt_ranges',
		'hard',
		'25bb, CO opens 2.2bb, you are on BTN. Optimal 3-betting range?',
		'Polarized (premiums + bluffs)',
		'Linear (strong hands only)',
		'Merged (premiums + good hands)',
		'Never 3-bet at 25bb'
	),
	// Ante dynamics
	q(
		'mtt_43',
		'mtt_strategy',
		'medium',
		'With antes vs without antes, your late position opening range should be:',
		'Much wider',
		'Much tighter',
		'Slightly tighter',
		'Same'
	),
	q(
		'mtt_44',
		'mtt_middle',
		'medium',
		'Big blind ante vs button ante - how does strategy change?',
		'BB should defend wider',
		'No difference',
		'Steals are more profitable',
		'BTN should open tighter'
	),
	// Multi-way pots
	q(
		'mtt_45',
		'mtt_postflop',
		'medium',
		'In multi-way pots, you should generally:',
		'C-bet less often - someone hit',
		'C-bet more often - more to win',
		'Same frequency as heads-up',
		'Always c-bet as preflop raiser'
	),
	q(
		'mtt_46',
		'mtt_postflop',
		'hard',
		'You raise BTN, both blinds call. Flop: 952 (pot 9bb). Checked to you. You have AKo. Best play?',
		'Bet 3bb (33%)',
		'Check - missed completely',
		'Bet 5bb (55%)',
		'Bet 7bb (75%)'
	),
	// Shortstack all-in ranges
	q(
		'mtt_47',
		'mtt_push_fold',
		'medium',
		'With 7bb on BTN (antes in play), you should shove approximately:',
		'60% of hands',
		'30% of hands',
		'45% of hands',
		'75% of hands'
	),
	q(
		'mtt_48',
		'mtt_push_fold',
		'hard',
		'9bb in SB, folds to you, BB has 12bb with QTo. Shove or fold?',
		'Shove - strong enough',
		'Fold - need better',
		'Min-raise - see flop',
		'Limp'
	),
	// Calling shoves
	q(
		'mtt_49',
		'mtt_push_fold',
		'medium',
		'BTN (8bb) shoves, you in BB (25bb) with A9o. Pot gives you 2.3:1 odds. Call or fold?',
		'Call - priced in',
		'Fold - need stronger',
		'Fold - too much variance',
		'Call - dominating range'
	),
	q(
		'mtt_50',
		'mtt_push_fold',
		'hard',
		'MP (10bb) shoves, you in BB (30bb) with 55. Getting 2:1 odds. Call?',
		'Call - getting correct odds',
		'Call - pairs play well',
		'Fold - likely racing',
		'Fold - protect stack'
	),
	// Squeeze play
	q(
		'mtt_51',
		'mtt_strategy',
		'medium',
		'What is a "squeeze play"?',
		'3-betting after open and call(s)',
		'4-betting preflop',
		'Shoving over limpers',
		'Calling a 3-bet in position'
	),
	q(
		'mtt_52',
		'mtt_middle',
		'hard',
		'40bb, CO opens 2.5bb, BTN calls, you in SB with AJs. Best play?',
		'3-bet to 10bb - squeeze',
		'Fold - multiway trouble',
		'Call - see flop in multiway',
		'Shove 40bb'
	),
	// Table dynamics
	q(
		'mtt_53',
		'mtt_strategy',
		'medium',
		'At a tight table, you should:',
		'Open wider - more fold equity',
		'Play tight - wait for premiums',
		'Same strategy',
		'Limp more - see cheap flops'
	),
	q(
		'mtt_54',
		'mtt_strategy',
		'hard',
		'At aggressive 3-betting table, how should you adjust?',
		'Open tighter - avoid 3-bets',
		'Open wider - fight back',
		'4-bet lighter - counter aggression',
		'Limp more'
	),
	// Blind vs blind
	q(
		'mtt_55',
		'mtt_strategy',
		'medium',
		'SB vs BB (both 30bb), what % should SB open-raise?',
		'65%',
		'30%',
		'50%',
		'80%'
	),
	q(
		'mtt_56',
		'mtt_strategy',
		'hard',
		'BB vs SB open (30bb), you should defend approximately:',
		'45%',
		'30%',
		'60%',
		'75%'
	),
	// Stack management
	q(
		'mtt_57',
		'mtt_strategy',
		'medium',
		'Most dangerous stack size in MTT is approximately:',
		'15-25bb',
		'5-10bb',
		'30-40bb',
		'50bb+'
	),
	q(
		'mtt_58',
		'mtt_strategy',
		'hard',
		'With 18bb, you open BTN to 2.2bb. BB shoves 22bb. You have AKo. Call or fold?',
		'Call - AK too strong',
		'Fold - avoid flip',
		'Call - slightly profitable',
		'Fold - preserve stack'
	),
	// Satellite strategy
	q(
		'mtt_59',
		'mtt_satellite',
		'medium',
		'In satellites (multiple equal prizes), correct strategy is:',
		'Much tighter - survival focus',
		'Same as regular MTT',
		'More aggressive - need chips',
		'Push/fold earlier'
	),
	q(
		'mtt_60',
		'mtt_satellite',
		'hard',
		'Satellite bubble, you have 25bb (avg 20bb). All spots pay equally. How tight should you play?',
		'Very tight - preserve stack',
		'Same as chip EV',
		'Slightly tighter',
		'Aggressive - others tight'
	),
	// Turn play
	q(
		'mtt_61',
		'mtt_postflop',
		'hard',
		'You c-bet flop with air, villain calls. Turn checks to you again. Pot = 12bb, 25bb behind. Optimal play?',
		'Give up - he called flop',
		'Barrel 8bb (66% pot)',
		'Shove 25bb',
		'Small bet 4bb (33%)'
	),
	q(
		'mtt_62',
		'mtt_postflop',
		'medium',
		'You c-bet flop with top pair, villain calls. Turn is a scare card. Pot = 15bb. Best play?',
		'Bet 5bb - control pot',
		'Check - scare card appeared',
		'Bet 10bb - protect hand',
		'Shove'
	),
	// Early stage exploitation
	q(
		'mtt_63',
		'mtt_early',
		'hard',
		'150bb, recreational player opens 5x BB from EP. You on BTN with 88. Best exploitative play?',
		'Call - set mine with odds',
		'Fold - facing strong range',
		'3-bet to 15bb',
		'Shove 150bb'
	),
	q(
		'mtt_64',
		'mtt_early',
		'medium',
		'Early stage, passive player limps from EP. You have KJs in MP. Optimal play?',
		'ISO-raise to 5x BB',
		'Limp behind - see flop',
		'Fold',
		'Min-raise'
	),
	// Final questions
	q(
		'mtt_65',
		'mtt_mindset',
		'easy',
		'Most important skill for MTT success is:',
		'Patience and discipline',
		'Preflop hand selection',
		'Reading opponents',
		'Aggression'
	),
	q(
		'mtt_66',
		'mtt_strategy',
		'medium',
		'Average MTT ROI (return on investment) for winning players is approximately:',
		'20-30%',
		'5-10%',
		'40-50%',
		'60%+'
	),
	q(
		'mtt_67',
		'mtt_icm',
		'hard',
		'Which situation has highest ICM pressure?',
		'Final table bubble (10th place)',
		'Bubble of 1000-player MTT',
		'3-handed at final table',
		'Satellite bubble with 5bb stack'
	)
];

const EXPLANATIONS: Record<string, string> = {
	mtt_1:
		"Early in tournaments with deep stacks, play to accumulate. Small edges matter. Don't be passive - build a stack for later pressure situations.",
	mtt_2:
		'Isolation raise with position is profitable. Size it larger than normal (5x+) against limpers to deny them odds. AJ is strong enough to iso-raise.',
	mtt_3:
		'You have flush draw + backdoor straight. Small bet is profitable with range advantage and equity. No need to bet large with drawing hand.',
	mtt_4:
		'JJ vs BTN 3-bet range is ahead but vulnerable. Calling allows you to play post-flop and avoid commitment preflop. 4-betting commits you to flip/crushed scenario.',
	mtt_5:
		'Antes increase dead money in pot, making steals more profitable. Open wider, especially from late position. 30-40% BTN opening range is normal.',
	mtt_6:
		'You risk 25bb to win ~28bb (25 + 1.5 + 0.1 + 0.9). Need ~47% equity. KQo has ~45%+ vs most shoving ranges. Close call, slightly profitable.',
	mtt_7:
		'As 3-bettor you have range advantage on K-high board. Small bet works great - he folds often, and you have backdoor nut flush draw. Efficient bluff.',
	mtt_8:
		"Second pair weak kicker in 3-way pot is trouble. MP's range hits this board hard. You need to improve to win, and draws are limited. Fold.",
	mtt_9:
		"At 20bb, it's raise or fold. Limping gives away information and allows opponents to realize equity too easily. Stay aggressive.",
	mtt_10:
		'With 22bb in SB, min-raising commits you awkwardly. Shoving with KTo is profitable vs BB defend range. Simple and effective.',
	mtt_11:
		'At 25bb, small 3-bets are awkward. Shoving is better: puts maximum pressure, avoids difficult post-flop spots, and AQs has great equity vs calling range.',
	mtt_12:
		'TT vs MP open has great equity. With 20bb, shoving is cleaner than 3-betting small (which commits you). You get folds and have equity when called.',
	mtt_13:
		'Below 15bb, push/fold becomes dominant strategy. Post-flop play becomes too risky with shallow SPR. Know your push/fold charts.',
	mtt_14:
		"QJo from CO with 12bb is clear shove. Opens ~40%+ from CO, QJ is well above that threshold. Don't min-raise at this depth.",
	mtt_15:
		"A7o from BTN with 10bb is mandatory shove. Both blinds are short and can't call light. You have great fold equity plus equity when called.",
	mtt_16:
		"KQo has ~43% equity vs average BTN shoving range. You need 40% to call profitably. Clear call. Don't fold hands this strong.",
	mtt_17:
		"Bubble is time to apply pressure, especially on medium stacks who can't afford to bust. Big stacks should steal aggressively. Medium stacks play tight.",
	mtt_18:
		"Don't be too passive on bubble with strong hands. 99 is ahead of opening range. Small 3-bet applies pressure without committing stack.",
	mtt_19:
		'With shortstack in SB, BB might play tighter. Raise larger to put pressure on BB. A5s is strong enough to open from CO.',
	mtt_20:
		'On stone bubble with 15bb (not desperate), folding AJs can be correct due to ICM. If you bust, you get 0. Waiting has massive value. ICM > chip EV.',
	mtt_21:
		'Final table ICM is extreme. Each pay jump is significant. Survival value is huge. Play tighter than chip-EV suggests, especially with medium stack.',
	mtt_22:
		"AK is too strong to fold even at FT. Shortstack desperate, you have huge equity edge. Don't overdo ICM - still need to accumulate with strong hands.",
	mtt_23:
		'At FT with medium stack, avoid confrontations with chipleader when you can. KQs is strong but not strong enough to risk tournament life against wide range.',
	mtt_24:
		'ICM (Independent Chip Model) assigns non-linear value to chips. Losing chips hurts more than gaining them helps. Survival has huge value in ICM spots.',
	mtt_25:
		'15-18% is standard UTG opening range at 30bb: 99+, ATs+, AJo+, KQs, some suited Broadway. Antes make ranges slightly wider than cash games.',
	mtt_26:
		'With top pair top kicker on dry board, small bet is optimal. Gets value from worse aces and draws. Larger bets fold out too many worse hands.',
	mtt_27:
		'MTTs require more aggression and stealing than cash games. You must accumulate chips. Positive red line is crucial for tournament success.',
	mtt_28:
		'With 10bb as short stack on bubble, push hard. You need to accumulate or bust trying. Waiting bleeds you to death. Others will avoid you (ICM).',
	mtt_29:
		"3-handed, 88 is very strong. BTN shoving wide, you have equity edge. Don't be too nitty 3-handed - ranges are wide.",
	mtt_30:
		'You have gutshot + backdoor flush. Small c-bet is profitable with range advantage. Efficient bluff with equity.',
	mtt_31:
		'AQo vs BTN 3-bet out of position at 45bb is tricky. Calling creates awkward postflop. 4-betting commits too much. Folding is fine here.',
	mtt_32:
		'With AA at 28bb, small 3-bet builds pot while keeping worse hands in. Shoving folds out hands that might stack off postflop. Optimize value.',
	mtt_33:
		'88 from MP with 14bb is clear shove. Opens 20%+ from MP, 88 is premium at this stack depth. Simple and effective.',
	mtt_34:
		'Heads up, 76s is strong. Raise (almost) every BTN. Stay aggressive. Limping gives up initiative.',
	mtt_35:
		'Resteal = 3-betting vs suspected steal attempt (usually BTN/CO opens). Take advantage of their wide opening ranges.',
	mtt_36:
		'K9s is not quite strong enough to resteal vs BTN with 35bb. Need AT+, KQ+, or pairs typically. K9s can call sometimes but folding is fine.',
	mtt_37:
		'With tight BB, you have isolation opportunity. ATo with 22bb vs BTN steal is great resteal shove. Fold equity + equity when called = profitable.',
	mtt_38:
		'Without specific reads, double-barrebling and giving up river is often optimal. River bluffs work when you rep specific hands credibly. Random bluffs = chip spew.',
	mtt_39:
		"Bluff-catcher decision depends on opponent's bluffing frequency. If villain never bluffs, fold. If villain bluffs enough, call. Read-dependent.",
	mtt_40:
		"With 12bb as shortstack, you can't wait for pay jumps. Need to accumulate or bust. Ladder abuse only works with 5-8bb (true shortstack).",
	mtt_41:
		'45% BTN opening range is standard with antes at 35bb. Very wide: all pairs, all Ax, most Kx, suited broadways, connectors. Position + antes = open wide.',
	mtt_42:
		'At 25bb, 3-bets are often all-in or pot-committing. Polarized range is best: QQ+/AK for value, some suited Ax for bluffs. Avoid medium hands like TT/AQ.',
	mtt_43:
		'Antes add significant dead money, making steals more profitable. Open 40-50% from BTN with antes vs 30-35% without. Steal aggressively.',
	mtt_44:
		'With BB posting ante, BB gets better pot odds to defend (more chips invested). Defend slightly wider. Steals are also more profitable (more in pot).',
	mtt_45:
		'Multi-way pots = someone likely hit. C-bet only with strong hands or very good boards for your range. Reduce bluffing frequency significantly.',
	mtt_46:
		'On dry board multiway, small c-bet with AK high is fine. You have two overcards and represent range advantage. Keep pot small.',
	mtt_47:
		'With 7bb and antes, BTN shoving range is very wide: ~60%. All pairs, all Ax, most Kx, many Qx, suited connectors. Massive fold equity.',
	mtt_48:
		'QTo from SB with 9bb is clear shove. SB vs BB with 9bb shoves ~65% of hands. QTo is well above threshold.',
	mtt_49:
		'Need 30% equity at 2.3:1 odds. A9o has ~38% vs BTN 8bb shoving range. Easy call with decent ace.',
	mtt_50:
		'Need 33% equity at 2:1. 55 has ~45% vs MP 10bb shoving range (wider than you think). Comfortable call.',
	mtt_51:
		"Squeeze = 3-betting when there's an opener and caller(s). Takes advantage of weak calls and applies maximum pressure. Very profitable in MTTs.",
	mtt_52:
		'Perfect squeeze spot: AJs is strong, opener may have weak hand, caller is capped. Squeeze to 10bb puts huge pressure. Very profitable.',
	mtt_53:
		'Tight tables = more stealing opportunities. Open wider, especially from late position. Exploit passive players by stealing liberally.',
	mtt_54:
		"Against aggressive 3-bettors, tighten opening range and be ready to 4-bet/call with strong hands. Avoid opening hands that can't handle pressure.",
	mtt_55:
		'SB should open ~60-70% vs BB. Very wide range: all pairs, all Ax, most Kx, suited hands, connectors. Position + stealing BB = open wide.',
	mtt_56:
		'BB defends ~45% vs SB open. Getting great pot odds but OOP. Defend with pairs, broadways, suited hands, connectors. Fold weak offsuit hands.',
	mtt_57:
		'15-25bb is awkward: too deep to push/fold, too shallow for comfort postflop. Difficult decisions abound. Requires careful navigation.',
	mtt_58:
		"AK vs BB shove from BTN is always a call. You have equity advantage vs their range. Don't be too nitty with premiums.",
	mtt_59:
		'Satellites reward survival over chip accumulation. Play tighter, especially near bubble. Avoid marginal spots. Goal is to survive, not win.',
	mtt_60:
		"With above-average stack in satellite on bubble, play VERY tight. Let shortstacks bust each other. Avoid confrontations. You're nearly qualified.",
	mtt_61:
		'Without specific reads or improving equity, double-barrebling with air is usually -EV. Give up and save chips for better spots.',
	mtt_62:
		'With made hand on scare turn, small bet is often best. Gets value from worse, does not commit too much if behind. Pot control with showdown value.',
	mtt_63:
		'Large preflop raise + 150bb deep = set mining paradise. When you flop set you can win huge pot. Calling has great implied odds.',
	mtt_64:
		'Isolate weak limpers with position. KJs is strong enough to iso-raise. Size it larger (5x+) to play heads-up against limper.',
	mtt_65:
		"MTTs require extreme patience - you'll play for hours. Discipline to avoid marginal spots is crucial. Technical skills matter, but mindset is foundation.",
	mtt_66:
		'20-30% ROI is excellent for regular MTTs. High variance + large fields = difficult to sustain huge ROIs. Even 15% ROI is very profitable.',
	mtt_67:
		'Final table bubble has extreme ICM. Pay jump from 10th to 9th is huge. More pressure than regular bubble or 3-handed (where you must play).'
};

export const NLHE_MTT_QUESTIONS: QuizQuestion[] = buildQuestions(RAW_QUESTIONS, EXPLANATIONS);

export interface MttStageInfo {
	early: string;
	middle: string;
	late: string;
	push_fold: string;
	bubble: string;
	final_table: string;
}

export interface IcmBasics {
	concept: string;
	losing_chips: string;
	application: string;
	example: string;
}

export interface StackSizes {
	deep: string;
	mid: string;
	awkward: string;
	short: string;
	critical: string;
}

export interface MttConcepts {
	STAGES: MttStageInfo;
	ICM_BASICS: IcmBasics;
	STACK_SIZES: StackSizes;
}

export const MTT_CONCEPTS: MttConcepts = {
	STAGES: {
		early: '100bb+: Accumulate chips, see flops, avoid big flips',
		middle: '30-60bb: Steal aggressively, apply pressure, widen ranges',
		late: '20-30bb: Push/fold considerations, ICM awareness',
		push_fold: '<20bb: Chart-based shoving, clear decisions',
		bubble: 'Survival value peaks, exploit medium stacks',
		final_table: 'Extreme ICM, pay jumps massive'
	},

	ICM_BASICS: {
		concept: 'Chips have non-linear value in tournaments',
		losing_chips: 'Hurts more than gaining chips helps',
		application: 'Play tighter in high ICM spots (bubble, FT)',
		example: 'Folding AK on stone bubble can be correct'
	},

	STACK_SIZES: {
		deep: '50bb+: Postflop poker, small ball',
		mid: '25-50bb: Mixed strategy, watch SPR',
		awkward: '15-25bb: Most difficult depth',
		short: '10-15bb: Push/fold dominant',
		critical: '<10bb: Pure push/fold'
	}
};
