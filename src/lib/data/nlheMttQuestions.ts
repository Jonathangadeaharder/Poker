import type { QuizQuestion } from './miniGames';
import rawData from './nlheMttQuestions.json';
import { fromTuples, withExplanations } from './questionFactory';

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
		'Without specific reads, double-barreling and giving up river is often optimal. River bluffs work when you rep specific hands credibly. Random bluffs = chip spew.',
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
		'Without specific reads or improving equity, double-barreling with air is usually -EV. Give up and save chips for better spots.',
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

export const NLHE_MTT_QUESTIONS: QuizQuestion[] = withExplanations(
	fromTuples(rawData),
	EXPLANATIONS
);

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
