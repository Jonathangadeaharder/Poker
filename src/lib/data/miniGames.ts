/**
 * Mini-Games for interactive poker training
 * Inspired by Duolingo's bite-sized lessons
 *
 * Types:
 * 1. Range Quiz (Multiple Choice)
 * 2. Speed Drills (fast yes/no decisions)
 * 3. Push/Fold Trainer (Interactive scenarios)
 * 4. Hand Evaluation (Evaluate hands)
 */

import { COMMON_LEAKS } from './exploitativeStrategies';
import type { Position } from './pokerRanges';
import { RFI_RANGES } from './pokerRanges';
import { PUSH_FOLD_CHARTS } from './pushFoldCharts';

export interface QuizQuestion {
	id: string;
	category: string;
	difficulty: string;
	question: string;
	answers: string[];
	correctAnswer: string;
	explanation: string;
	points: number;
	context?: Record<string, string>;
}

export interface SpeedDrill {
	id: string;
	hand: string;
	position: string;
	question: string;
	correctAnswer: string;
	timeLimit: number;
	points: number;
	speedBonus: number;
}

export interface ScenarioOption {
	action: string;
	correct: boolean;
	feedback: string;
	xp: number;
}

export interface Scenario {
	id: string;
	title: string;
	description: string;
	position?: string;
	yourHand?: string;
	potSize?: string;
	question: string;
	options: ScenarioOption[];
	flop?: string;
	action?: string;
}

export function generateRangeQuiz(position: Position, difficulty = 'easy'): QuizQuestion {
	const range = RFI_RANGES[position];
	const allPositions = Object.keys(RFI_RANGES) as Position[];

	const questionTypes = [
		{
			question: `Which RFI range is correct for ${range.position}?`,
			correct: range.percentage,
			wrong: [
				RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
				RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
				`${Math.floor(Math.random() * 30 + 10)}%`
			]
		},
		{
			question: `Should KQo be played as RFI from ${position}?`,
			correct: range.hands.includes('KQo') ? 'Yes' : 'No',
			wrong: range.hands.includes('KQo')
				? ['No', 'Sometimes', 'Only suited']
				: ['Yes', 'Always', 'Mostly']
		}
	];

	const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

	const uniqueWrong = [...new Set(selectedType.wrong)].filter((a) => a !== selectedType.correct);
	while (uniqueWrong.length < 3) {
		const candidate = `${Math.floor(Math.random() * 30 + 10)}%`;
		if (candidate !== selectedType.correct && !uniqueWrong.includes(candidate)) {
			uniqueWrong.push(candidate);
		}
	}
	const allAnswers = [selectedType.correct, ...uniqueWrong.slice(0, 3)].sort(
		() => Math.random() - 0.5
	);

	return {
		id: `range_${position}_${Math.random().toString(36).slice(2, 9)}`,
		category: 'ranges',
		difficulty,
		question: selectedType.question,
		answers: allAnswers,
		correctAnswer: selectedType.correct,
		explanation: range.description,
		points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
	};
}

export function generatePushFoldQuiz(stackSize: string, difficulty = 'medium'): QuizQuestion {
	const chart = PUSH_FOLD_CHARTS[stackSize];
	const positions = Object.keys(chart.openShove);
	const selectedPos = positions[Math.floor(Math.random() * positions.length)];
	const posData = chart.openShove[selectedPos];

	const testHands = ['AA', '22', 'AKo', 'A2s', 'KQo', '76s', 'J9o', 'T8s'];
	const selectedHand = testHands[Math.floor(Math.random() * testHands.length)];

	const isInRange = Array.isArray(posData.hands)
		? posData.hands.includes(selectedHand)
		: Math.random() > 0.5;

	return {
		id: `pushfold_${stackSize}_${selectedPos}_${Math.random().toString(36).slice(2, 9)}`,
		category: 'push_fold',
		difficulty,
		question: `${selectedHand} from ${selectedPos} with ${chart.stackSize}?\nOpen-shove or fold?`,
		answers: ['Shove', 'Fold', 'Min-Raise', 'Limp'].sort(() => Math.random() - 0.5),
		correctAnswer: isInRange ? 'Shove' : 'Fold',
		explanation: `${posData.position}: ${posData.range} range\n${posData.description}`,
		points: 15,
		context: {
			stackSize: chart.stackSize,
			position: selectedPos,
			hand: selectedHand
		}
	};
}

export function generateExploitQuiz(difficulty = 'hard'): QuizQuestion {
	const leakKeys = Object.keys(COMMON_LEAKS);
	const selectedKey = leakKeys[Math.floor(Math.random() * leakKeys.length)];
	const leak = COMMON_LEAKS[selectedKey];

	return {
		id: `exploit_${selectedKey}_${Math.random().toString(36).slice(2, 9)}`,
		category: 'exploits',
		difficulty,
		question: `Opponent shows this leak:\n"${leak.leak}"\n\nWhich adjustment is optimal?`,
		answers: [...new Set([leak.exploit.action, 'Play GTO', 'Bluff more', 'Fold more'])].sort(
			() => Math.random() - 0.5
		),
		correctAnswer: leak.exploit.action,
		explanation: `${leak.exploit.action}\n\n${leak.exploit.postflop || leak.exploit.range || ''}\n\nExpected: ${leak.exploit.expectedWinRate}`,
		points: 20,
		context: {
			leak: selectedKey,
			severity: leak.severity
		}
	};
}

export function generateMixedQuiz(count = 10, difficulty = 'mixed'): QuizQuestion[] {
	const quiz: QuizQuestion[] = [];
	const types = ['range', 'pushfold', 'exploit'] as const;

	for (let i = 0; i < count; i++) {
		const type = types[Math.floor(Math.random() * types.length)];
		const diff =
			difficulty === 'mixed'
				? (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)]
				: difficulty;

		let question: QuizQuestion;
		switch (type) {
			case 'range': {
				const positions = Object.keys(RFI_RANGES) as Position[];
				const pos = positions[Math.floor(Math.random() * positions.length)];
				question = generateRangeQuiz(pos, diff);
				break;
			}
			case 'pushfold': {
				const stacks = Object.keys(PUSH_FOLD_CHARTS);
				const stack = stacks[Math.floor(Math.random() * stacks.length)];
				question = generatePushFoldQuiz(stack, diff);
				break;
			}
			default:
				question = generateExploitQuiz(diff);
				break;
		}

		quiz.push(question);
	}

	return quiz;
}

export function generateHandDecision(position: Position, timeLimit = 5): SpeedDrill {
	const range = RFI_RANGES[position];
	const allHands = [
		'AA',
		'KK',
		'QQ',
		'JJ',
		'TT',
		'99',
		'88',
		'77',
		'66',
		'55',
		'44',
		'33',
		'22',
		'AKs',
		'AKo',
		'AQs',
		'AQo',
		'AJs',
		'AJo',
		'ATs',
		'ATo',
		'KQs',
		'KQo',
		'KJs',
		'KJo',
		'KTs',
		'KTo',
		'QJs',
		'QJo',
		'QTs',
		'JTs',
		'J9s',
		'T9s',
		'98s',
		'87s',
		'76s',
		'A5s',
		'A4s',
		'A3s',
		'A2s'
	];

	const testHand = allHands[Math.floor(Math.random() * allHands.length)];
	const shouldRaise = range.hands.includes(testHand);

	return {
		id: `speed_${position}_${testHand}_${Math.random().toString(36).slice(2, 9)}`,
		hand: testHand,
		position,
		question: `${testHand} from ${position}?\nRaise or fold?`,
		correctAnswer: shouldRaise ? 'RAISE' : 'FOLD',
		timeLimit,
		points: 5,
		speedBonus: 10
	};
}

export function generateSpeedDrill(position: Position, count = 20, timeLimit = 5): SpeedDrill[] {
	const drills: SpeedDrill[] = [];
	for (let i = 0; i < count; i++) {
		drills.push(generateHandDecision(position, timeLimit));
	}
	return drills;
}

export function generateLimperScenario(): Scenario {
	const scenarios: Scenario[] = [
		{
			id: 'limper_1',
			title: 'Limpers at the table',
			description: '2 players limp before you (2bb + 2bb)',
			position: 'CO',
			yourHand: 'A9s',
			potSize: '7bb (2bb + 2bb + 1bb SB + 2bb BB)',
			question: 'What do you do?',
			options: [
				{
					action: 'ISO-Raise to 7bb',
					correct: true,
					feedback: 'Perfect! 3x (3bb) + 2x limpers (4bb) = 7bb. Linear range, ABC postflop.',
					xp: 25
				},
				{
					action: 'Over-limp (call 2bb)',
					correct: false,
					feedback:
						'Too passive. You give up fold equity. Over-limping is only profitable with small pairs in position.',
					xp: 0
				},
				{
					action: 'Fold',
					correct: false,
					feedback: 'Way too tight! A9s is a strong ISO hand. You miss a +EV spot.',
					xp: 0
				},
				{
					action: 'Min-raise to 4bb',
					correct: false,
					feedback: 'Sizing too small. Gives limpers too good odds. Correct: 3x + 1x per limper.',
					xp: 5
				}
			]
		},
		{
			id: 'calling_station_1',
			title: 'Calling Station',
			description: 'Villain calls 80% of C-Bets, almost never folds',
			flop: 'K72r',
			yourHand: 'AQs',
			action: 'You raise preflop, villain calls. Pot: 20bb',
			question: 'What do you do on this flop?',
			options: [
				{
					action: 'Check (give up)',
					correct: true,
					feedback:
						'Correct! You have Ace-high (nothing). Against calling station: STOP BLUFFS. Check/fold is correct here.',
					xp: 20
				},
				{
					action: 'C-Bet 7bb (33% pot)',
					correct: false,
					feedback:
						'Bluff against calling station is -EV. He calls with every pair, sometimes even Ace-high. Burn chips.',
					xp: 0
				},
				{
					action: 'C-Bet 15bb (75% pot)',
					correct: false,
					feedback: 'Very bad. Big bluff against someone who never folds? Pure chip donation.',
					xp: 0
				}
			]
		}
	];

	return scenarios[Math.floor(Math.random() * scenarios.length)];
}

export function generateMultiStepScenario() {
	return {
		id: 'multi_1',
		title: 'Tournament Hand (20bb)',
		steps: [
			{
				step: 1,
				situation: 'UTG (20bb) opens to 2.5bb',
				yourPosition: 'BTN (20bb)',
				yourHand: 'AJs',
				question: 'Preflop action?',
				options: ['Fold', '3-Bet Shove (20bb)', 'Call'],
				correctAnswer: '3-Bet Shove (20bb)',
				explanation:
					'At 20bb, 3-bet shove > call. AJs is too strong to fold, but calling creates awkward SPR.'
			}
		]
	};
}

export function generateDailyChallenge(date = new Date()) {
	const dayOfMonth = date.getDate();
	const challengeTypes = [
		{
			type: 'perfect_quiz',
			title: 'Perfectionist',
			description: 'Answer 10 questions perfectly (100%)',
			goal: 10,
			reward: { xp: 100, badge: 'Daily Perfectionist' }
		},
		{
			type: 'speed_master',
			title: 'Speedster',
			description: 'Answer 20 questions in under 60 seconds',
			goal: { questions: 20, timeLimit: 60 },
			reward: { xp: 150, badge: 'Speed Demon' }
		},
		{
			type: 'range_master',
			title: 'Range Master',
			description: 'Study all 6 positions today',
			goal: 6,
			reward: { xp: 80, badge: 'Range Scholar' }
		},
		{
			type: 'exploit_hunter',
			title: 'Leak Hunter',
			description: 'Learn about all 5 exploits',
			goal: 5,
			reward: { xp: 120, badge: 'Exploit Expert' }
		}
	];

	return challengeTypes[dayOfMonth % challengeTypes.length];
}
