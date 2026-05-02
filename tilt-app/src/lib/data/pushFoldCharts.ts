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

// Push/Fold for various stack sizes
export const PUSH_FOLD_CHARTS: Record<string, StackChart> = {
	// 20BB Stack
	TWENTY_BB: {
		stackSize: '20bb',
		scenario: 'Early/Mid Tournament',
		openShove: {
			BTN: {
				position: 'Button',
				range: '52%',
				hands: [
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
					'A9s',
					'A9o',
					'A8s',
					'A8o',
					'A7s',
					'A7o',
					'A6s',
					'A5s',
					'A4s',
					'A3s',
					'A2s',
					'KQs',
					'KQo',
					'KJs',
					'KJo',
					'KTs',
					'KTo',
					'K9s',
					'K9o',
					'K8s',
					'K7s',
					'QJs',
					'QJo',
					'QTs',
					'QTo',
					'Q9s',
					'Q8s',
					'JTs',
					'JTo',
					'J9s',
					'J8s',
					'T9s',
					'T8s',
					'98s',
					'97s',
					'87s',
					'76s'
				],
				description: 'Button vs SB+BB: Very wide range. Maximum pressure.'
			},
			CO: {
				position: 'Cutoff',
				range: '38%',
				hands: [
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
					'A9s',
					'A8s',
					'A7s',
					'A6s',
					'A5s',
					'A4s',
					'A3s',
					'A2s',
					'KQs',
					'KQo',
					'KJs',
					'KJo',
					'KTs',
					'KTo',
					'K9s',
					'K8s',
					'QJs',
					'QJo',
					'QTs',
					'Q9s',
					'JTs',
					'J9s',
					'T9s',
					'98s',
					'87s'
				],
				description: 'CO: Wide range, but tighter than BTN.'
			},
			MP: {
				position: 'Middle Position',
				range: '22%',
				hands: [
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
					'AKs',
					'AKo',
					'AQs',
					'AQo',
					'AJs',
					'AJo',
					'ATs',
					'A9s',
					'A8s',
					'A7s',
					'A6s',
					'A5s',
					'A4s',
					'A3s',
					'A2s',
					'KQs',
					'KJs',
					'KTs',
					'QJs',
					'JTs'
				],
				description: 'MP: Significantly tighter. Many players behind us.'
			},
			UTG: {
				position: 'Under the Gun',
				range: '15%',
				hands: [
					'AA',
					'KK',
					'QQ',
					'JJ',
					'TT',
					'99',
					'88',
					'77',
					'AKs',
					'AKo',
					'AQs',
					'AQo',
					'AJs',
					'ATs',
					'A9s',
					'A8s',
					'A7s',
					'A6s',
					'A5s',
					'A4s',
					'A3s',
					'A2s',
					'KQs'
				],
				description: 'UTG: Very tight. Premium hands + suited aces.'
			}
		},
		reShove: {
			vsUTG: {
				scenario: 'Hero in BB vs UTG Open-Shove',
				range: '12%',
				hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs'],
				description: 'Very tight vs UTG shove. Only premium hands.'
			},
			vsCO: {
				scenario: 'Hero in BB vs CO Open-Shove',
				range: '20%',
				hands: [
					'AA',
					'KK',
					'QQ',
					'JJ',
					'TT',
					'99',
					'88',
					'77',
					'AKs',
					'AKo',
					'AQs',
					'AQo',
					'AJs',
					'AJo',
					'ATs',
					'KQs'
				],
				description: 'Slightly wider vs CO. Medium pairs become profitable.'
			},
			vsBTN: {
				scenario: 'Hero in BB vs BTN Open-Shove',
				range: '28%',
				hands: [
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
					'AKs',
					'AKo',
					'AQs',
					'AQo',
					'AJs',
					'AJo',
					'ATs',
					'ATo',
					'A9s',
					'KQs',
					'KJs',
					'KTs',
					'QJs'
				],
				description: 'Wide defense vs BTN. He shoves very wide.'
			}
		}
	},

	// 15BB Stack
	FIFTEEN_BB: {
		stackSize: '15bb',
		scenario: 'Mid/Late Tournament - Critical Phase',
		openShove: {
			BTN: {
				position: 'Button',
				range: '58%',
				hands: [
					'All pairs',
					'All Ax',
					'All suited Kx',
					'All suited Qx (Q2s+)',
					'All suited connectors',
					'K9o+',
					'Q9o+',
					'J9o+',
					'T8o+'
				],
				description: 'Nearly 60% range from Button. Extreme aggression.'
			},
			CO: {
				position: 'Cutoff',
				range: '44%',
				hands: [
					'All pairs',
					'All Ax',
					'K7s+',
					'K9o+',
					'Q8s+',
					'QTo+',
					'J8s+',
					'JTo',
					'T8s+',
					'98s',
					'87s',
					'76s'
				],
				description: 'CO at 15bb: Very aggressive, but not as wide as BTN.'
			},
			MP: {
				position: 'Middle Position',
				range: '28%',
				hands: ['Pairs: 55+', 'Ax: A2s+, A7o+', 'Broadways: KQs, KJs, KTs, KQo', 'QJs, JTs'],
				description: 'MP: Moderate range. Balance between aggression and caution.'
			}
		},
		reShove: {
			vsBTN: {
				scenario: 'Hero in SB vs BTN Open-Shove',
				range: '35%',
				hands: ['All pairs', 'Ax: A2+', 'Kx: K8s+, KTo+', 'Qx: QTs+, QJo', 'JTs'],
				description: 'SB vs BTN at 15bb: Call very wide, as BTN shoves extremely wide.'
			}
		}
	},

	// 10BB Stack
	TEN_BB: {
		stackSize: '10bb',
		scenario: 'Late Tournament - Push/Fold Only',
		openShove: {
			BTN: {
				position: 'Button',
				range: '68%',
				hands: [
					'All pairs',
					'All Ax',
					'Almost all Kx',
					'Almost all suited hands',
					'Many offsuit connectors'
				],
				description: 'At 10bb from Button: Push almost any two cards.'
			},
			CO: {
				position: 'Cutoff',
				range: '52%',
				hands: ['All pairs', 'All Ax', 'K2s+, K8o+', 'Q6s+, QTo+', 'J8s+', 'T8s+', '98s'],
				description: 'CO: Over 50% range.'
			},
			MP: {
				position: 'Middle Position',
				range: '35%',
				hands: ['Pairs: 22+', 'Ax: All', 'Kx: K9s+, KJo+', 'QJs+', 'JTs'],
				description: 'MP: Still wide, but more selective.'
			}
		},
		reShove: {
			vsBTN: {
				scenario: 'Hero in BB vs BTN Shove',
				range: '45%',
				hands: [
					'Almost all pairs',
					'Ax: A2+',
					'Kx: K6s+, K9o+',
					'Qx: Q9s+, QTo+',
					'Broadway: JTs+'
				],
				description: 'BB vs BTN at 10bb: Call extremely wide. BTN shoves 68%.'
			}
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
