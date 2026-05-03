/**
 * Push/Fold Charts for MTT Short Stack Play
 * Based on Nash Equilibrium and ICM-neutral spots
 */

export interface PositionPushData {
	position: string;
	range: string;
	hands: string[];
	description: string;
}

export interface ReShoveData {
	scenario: string;
	range: string;
	hands: string[];
	description: string;
}

export interface StackChart {
	stackSize: string;
	scenario: string;
	openShove: Record<string, PositionPushData>;
	reShove: Record<string, ReShoveData>;
}

function pos(position: string, range: string, hands: string[], description: string): PositionPushData {
	return { position, range, hands, description };
}

function reshove(scenario: string, range: string, hands: string[], description: string): ReShoveData {
	return { scenario, range, hands, description };
}

const PAIRS_20BB = ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22'];
const SUITED_AX = ['AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s'];
const OFFSUIT_AX_WIDE = ['AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o'];
const OFFSUIT_AX_MED = ['AKo','AQo','AJo','ATo'];
const OFFSUIT_AX_TIGHT = ['AKo','AQo','AJs','AJo','ATs','ATo','A9s'];
const K_Q_BROADWAY = ['KQs','KQo','KJs','KJo','KTs','KTo','K9s','K9o','K8s','K7s','QJs','QJo','QTs','QTo','Q9s','Q8s'];
const CONNECTORS = ['JTs','JTo','J9s','J8s','T9s','T8s','98s','97s','87s','76s'];

export const PUSH_FOLD_CHARTS: Record<string, StackChart> = {
	// 20BB Stack
	TWENTY_BB: {
		stackSize: '20bb',
		scenario: 'Early/Mid Tournament',
		openShove: {
			BTN: pos('Button', '52%',
				[...PAIRS_20BB, ...SUITED_AX, ...OFFSUIT_AX_WIDE, ...K_Q_BROADWAY, ...CONNECTORS],
				'Button vs SB+BB: Very wide range. Maximum pressure.'),
			CO: pos('Cutoff', '38%',
				[...PAIRS_20BB, ...SUITED_AX, ...OFFSUIT_AX_MED,
					'KQs','KQo','KJs','KJo','KTs','KTo','K9s','K8s',
					'QJs','QJo','QTs','Q9s','JTs','J9s','T9s','98s','87s'],
				'CO: Wide range, but tighter than BTN.'),
			MP: pos('Middle Position', '22%',
				[...PAIRS_20BB, 'AKs','AKo','AQs','AQo','AJs','AJo','ATs',
					'A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
					'KQs','KJs','KTs','QJs','JTs'],
				'MP: Significantly tighter. Many players behind us.'),
			UTG: pos('Under the Gun', '15%',
				[...PAIRS_20BB, 'AKs','AKo','AQs','AQo','AJs','ATs',
					'A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs'],
				'UTG: Very tight. Premium hands + suited aces.')
		},
		reShove: {
			vsUTG: reshove('Hero in BB vs UTG Open-Shove', '12%',
				['AA','KK','QQ','JJ','TT','AKs','AKo','AQs'],
				'Very tight vs UTG shove. Only premium hands.'),
			vsCO: reshove('Hero in BB vs CO Open-Shove', '20%',
				['AA','KK','QQ','JJ','TT','99','88','77',
					'AKs','AKo','AQs','AQo','AJs','AJo','ATs','KQs'],
				'Slightly wider vs CO. Medium pairs become profitable.'),
			vsBTN: reshove('Hero in BB vs BTN Open-Shove', '28%',
				['AA','KK','QQ','JJ','TT','99','88','77','66','55',
					'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s',
					'KQs','KJs','KTs','QJs'],
				'Wide defense vs BTN. He shoves very wide.')
		}
	},

	// 15BB Stack
	FIFTEEN_BB: {
		stackSize: '15bb',
		scenario: 'Mid/Late Tournament - Critical Phase',
		openShove: {
			BTN: pos('Button', '58%',
				['All pairs', 'All Ax', 'All suited Kx', 'All suited Qx (Q2s+)',
					'All suited connectors', 'K9o+', 'Q9o+', 'J9o+', 'T8o+'],
				'Nearly 60% range from Button. Extreme aggression.'),
			CO: pos('Cutoff', '44%',
				['All pairs', 'All Ax', 'K7s+', 'K9o+', 'Q8s+', 'QTo+',
					'J8s+', 'JTo', 'T8s+', '98s', '87s', '76s'],
				'CO at 15bb: Very aggressive, but not as wide as BTN.'),
			MP: pos('Middle Position', '28%',
				['Pairs: 55+', 'Ax: A2s+, A7o+', 'Broadways: KQs, KJs, KTs, KQo', 'QJs, JTs'],
				'MP: Moderate range. Balance between aggression and caution.')
		},
		reShove: {
			vsBTN: reshove('Hero in SB vs BTN Open-Shove', '35%',
				['All pairs', 'Ax: A2+', 'Kx: K8s+, KTo+', 'Qx: QTs+, QJo', 'JTs'],
				'SB vs BTN at 15bb: Call very wide, as BTN shoves extremely wide.')
		}
	},

	// 10BB Stack
	TEN_BB: {
		stackSize: '10bb',
		scenario: 'Late Tournament - Push/Fold Only',
		openShove: {
			BTN: pos('Button', '68%',
				['All pairs', 'All Ax', 'Almost all Kx', 'Almost all suited hands',
					'Many offsuit connectors'],
				'At 10bb from Button: Push almost any two cards.'),
			CO: pos('Cutoff', '52%',
				['All pairs', 'All Ax', 'K2s+, K8o+', 'Q6s+, QTo+', 'J8s+', 'T8s+', '98s'],
				'CO: Over 50% range.'),
			MP: pos('Middle Position', '35%',
				['Pairs: 22+', 'Ax: All', 'Kx: K9s+, KJo+', 'QJs+', 'JTs'],
				'MP: Still wide, but more selective.')
		},
		reShove: {
			vsBTN: reshove('Hero in BB vs BTN Shove', '45%',
				['Almost all pairs', 'Ax: A2+', 'Kx: K6s+, K9o+', 'Qx: Q9s+, QTo+', 'Broadway: JTs+'],
				'BB vs BTN at 10bb: Call extremely wide. BTN shoves 68%.')
		}
	}
};

// ICM Adjustments (Simplified)
export const ICM_GUIDELINES = {
	BUBBLE: {
		scenario: 'Bubble Play (close to the money)',
		adjustment: 'TIGHT',
		description: 'Folding has positive EV. Play 30-40% tighter than normal.',
		keyPoints: [
			'Medium Stacks: Maximize fold equity against short stacks',
			'Short Stacks: Push wider than normal (others fold too much)',
			'Big Stacks: Put pressure on small stacks'
		]
	},
	FINAL_TABLE: {
		scenario: 'Final Table (close to big prizes)',
		adjustment: 'VERY TIGHT (except Big Stack)',
		description: 'Each place = big pay jump. Survival is valuable.',
		keyPoints: [
			'Short Stack as Medium Stack: Wait for other eliminations',
			'Big Stack: Aggressive against Medium Stacks',
			'3-4 players left: Return to chip-EV strategy'
		]
	}
};
