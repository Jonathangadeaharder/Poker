/**
 * 40-Hour Intensive Training Plan
 * Path A: 6-Max Cash Game Specialist
 * Path B: MTT Specialist
 */

export interface TrainingPath {
	id: string;
	name: string;
	subtitle: string;
	difficulty: string;
	target: string;
	description: string;
	color: string;
}

export interface Module {
	hours: number;
	type: string;
	title: string;
	description?: string;
	objectives?: string[];
	resources?: string[];
	stakes?: string;
	tables?: number;
	tools?: string;
	completed: boolean;
}

export interface DaySchedule {
	day: number;
	title: string;
	totalHours: number;
	modules: Module[];
}

export const TRAINING_PATHS: Record<string, TrainingPath> = {
	CASH_GAME: {
		id: 'cash',
		name: 'Path A: 6-Max Cash Game Specialist',
		subtitle: '100bb Deep Stack',
		difficulty: 'Harder, broader skill set',
		target: '2-5bb/100 win rate at NL5/NL10',
		description: 'Most complex form of NLHE. Most robust foundation for future learning.',
		color: '#2d5f3f'
	},
	MTT: {
		id: 'mtt',
		name: 'Path B: MTT Specialist',
		subtitle: 'Variable stack depths',
		difficulty: 'Easier, faster learning curve',
		target: 'Profitable in $1-$5 tournaments',
		description: 'Focus on stack depth strategy and push/fold mastery.',
		color: '#c41e3a'
	}
};

export const TRAINING_SCHEDULE: Record<string, DaySchedule[]> = {
	CASH_GAME: [
		{
			day: 1,
			title: 'Day 1-2: Fundamentals',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'GTO Trainer: RFI Ranges',
					description: 'Open-raising ranges from all 6 positions (UTG to BB)',
					objectives: [
						'UTG (15%) memorize',
						'MP (18%) memorize',
						'CO (25%) memorize',
						'BTN (45%) memorize',
						'SB/BB ranges understand'
					],
					tools: 'GTO Wizard / DTO Poker',
					completed: false
				},
				{
					hours: 1,
					type: 'video',
					title: 'Video: Postflop Fundamentals',
					description: 'Range advantage & C-betting (HU vs MW)',
					objectives: [
						'What is range advantage?',
						'When does PFR have range advantage?',
						'HU C-Bet: 80% @ 33% pot',
						'MW C-Bet: 40% @ 50% pot'
					],
					resources: [
						'Run It Once (Free)',
						'PokerCoaching.com',
						'YouTube: Poker Strategy Channels'
					],
					completed: false
				},
				{
					hours: 2,
					type: 'play',
					title: 'Live Play: NL5 6-Max',
					description: '2 tables, 200-300 hands',
					objectives: [
						'Apply RFI ranges consistently',
						'Mark difficult spots',
						'Note all limper spots'
					],
					stakes: 'NL5 (2c/5c)',
					tables: 2,
					completed: false
				},
				{
					hours: 1.5,
					type: 'review',
					title: 'Hand Review',
					description: 'Analyze all hands in GTO tool',
					objectives: [
						'Upload hands to GTO Wizard',
						'Identify all RFI errors',
						'Note EV losses',
						'Create learning cards for errors'
					],
					completed: false
				}
			]
		},
		{
			day: 2,
			title: 'Day 1-2: Fundamentals (Continued)',
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'GTO Trainer: RFI Ranges (Repeat)',
					description: 'Deepening and speed training',
					completed: false
				},
				{
					hours: 1,
					type: 'video',
					title: 'Video: Board Textures',
					description: 'Dry vs wet boards, equity distribution',
					completed: false
				},
				{
					hours: 2,
					type: 'play',
					title: 'Live Play: NL5 6-Max',
					description: '2 tables, focus on C-Bet decisions',
					completed: false
				},
				{
					hours: 1.5,
					type: 'review',
					title: 'Hand Review',
					description: 'Focus: C-Bet spots (HU vs MW)',
					completed: false
				}
			]
		},
		{
			day: 3,
			title: 'Day 3-4: Core Strategy - Exploits',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'GTO Trainer: 3-Bet Defense',
					description: 'When to call/fold vs 3-Bet',
					objectives: [
						'Calling range vs 3-Bet',
						'4-Bet range (value)',
						'Fold range',
						'Position adjustments'
					],
					completed: false
				},
				{
					hours: 1,
					type: 'video',
					title: 'Exploitative Module 1: Limper Destruction',
					description: 'The #1 micro-stakes leak',
					objectives: [
						'Isolation raise sizing (4x-7x)',
						'Linear range construction',
						'Postflop ABC vs limper',
						'Expected win rate: +15-25bb/100'
					],
					completed: false
				},
				{
					hours: 2,
					type: 'play',
					title: 'Live Play: NL5 6-Max',
					description: 'HUNTING for limper spots',
					completed: false
				},
				{
					hours: 1.5,
					type: 'review',
					title: 'Hand Review',
					description: 'Focus: 3-Bet defense & limper exploits',
					objectives: [
						'Were all limpers isolated?',
						'Was sizing correct? (4x-7x)',
						'Postflop bluff frequency vs limper?',
						'Were calling stations identified?'
					],
					completed: false
				}
			]
		},
		{
			day: 4,
			title: 'Day 3-4: Core Strategy (Continued)',
			totalHours: 6.5,
			modules: [
				{ hours: 2, type: 'drill', title: 'Review: 3-Bet Defense + RFI', completed: false },
				{
					hours: 1,
					type: 'video',
					title: 'Exploitative Module 2: Calling Stations & Fit-or-Fold',
					completed: false
				},
				{
					hours: 2.5,
					type: 'play',
					title: 'Live play with active exploit tracking',
					completed: false
				},
				{ hours: 1, type: 'review', title: 'Hand Review: Exploit application', completed: false }
			]
		},
		{
			day: 5,
			title: 'Day 5-6: Advanced',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: '3-Bet Ranges (Linear vs Polar)',
					description: 'When to merged 3-bet, when polarized',
					objectives: [
						'Linear range: vs passive (no 4-bet)',
						'Polar range: vs aggressive (4-bet frequent)',
						'Blocker concept: A5s, K5s'
					],
					completed: false
				},
				{
					hours: 1,
					type: 'theory',
					title: 'Theory: Blockers & Implied Odds',
					description: 'The "why" behind advanced concepts',
					objectives: [
						'Blocker math (A5s blocks AA/AK)',
						'10x Rule for set mining',
						'Range morphology understanding'
					],
					completed: false
				},
				{
					hours: 2,
					type: 'play',
					title: 'Live Play: NL5 6-Max',
					description: 'Integration of all concepts',
					completed: false
				},
				{
					hours: 1.5,
					type: 'review',
					title: 'Deep Review',
					description: 'Were exploits correctly applied?',
					objectives: [
						'Exploit Matrix check (all 5 leaks)',
						'Set mining: 10x Rule followed?',
						'Linear vs polar 3-bet correct?'
					],
					completed: false
				}
			]
		},
		{
			day: 6,
			title: 'Day 5-6: Advanced (Continued)',
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Weakness training',
					description: 'Focus on weakest areas of the week',
					completed: false
				},
				{ hours: 1, type: 'theory', title: 'Range vs Range Analysis', completed: false },
				{ hours: 2.5, type: 'play', title: 'Live play with meta-awareness', completed: false },
				{ hours: 1, type: 'review', title: 'Weekly statistics analysis', completed: false }
			]
		},
		{
			day: 7,
			title: 'Day 7: Integration & Assessment',
			totalHours: 7.5,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Final Drill: Weakest spots',
					description: 'Identify and train top 3 leaks',
					completed: false
				},
				{
					hours: 4,
					type: 'play',
					title: 'Long live session',
					description: '4 tables NL5, 600+ hands',
					objectives: [
						'Consistent RFI application',
						'All exploits actively used',
						'Mental game stay focused',
						'Track win rate live'
					],
					completed: false
				},
				{
					hours: 1.5,
					type: 'assessment',
					title: 'Weekly analysis & week 2 plan',
					description: 'Identify 5 most expensive errors',
					objectives: [
						'Review: Total win rate',
						'EV loss per category',
						'Top 5 leaks for week 2',
						'Create focused learning plan'
					],
					completed: false
				}
			]
		}
	],

	MTT: [
		{
			day: 1,
			title: 'Day 1-2: Fundamentals - Deep Stack',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'RFI Ranges (100bb, 60bb, 40bb)',
					description: 'Multi-stack RFI training',
					objectives: [
						'100bb: Same as cash game',
						'60bb: Slightly tighter',
						'40bb: Significantly tighter'
					],
					completed: false
				},
				{
					hours: 1,
					type: 'video',
					title: 'The Stack Depth Triumvirate',
					description: 'Deep (75bb+) / Medium (30-60bb) / Short (<25bb)',
					objectives: [
						'75bb+: Cash-game-style',
						'30-60bb: Re-steal & 3-bet shove phase',
						'<25bb: Pure push/fold'
					],
					completed: false
				},
				{
					hours: 2,
					type: 'play',
					title: 'Live Play: $1-$3 MTTs',
					description: '4 tables, focus on early stages',
					completed: false
				},
				{
					hours: 1.5,
					type: 'review',
					title: 'Hand Review',
					description: 'RFI errors at various stacks',
					completed: false
				}
			]
		},
		{
			day: 2,
			title: 'Day 1-2: Fundamentals (Continued)',
			totalHours: 6.5,
			modules: [
				{ hours: 2, type: 'drill', title: 'RFI Deep Dive + Ante adjustments', completed: false },
				{
					hours: 1,
					type: 'video',
					title: 'MTT-specific concepts',
					description: 'Antes, bubble, pay jumps',
					completed: false
				},
				{ hours: 2.5, type: 'play', title: 'Live MTT Play', completed: false },
				{ hours: 1, type: 'review', title: 'Review with stack focus', completed: false }
			]
		},
		{
			day: 3,
			title: 'Day 3-4: Push/Fold Mastery (20bb)',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Push/Fold Charts (20bb)',
					description: 'Open-shove & re-shove ranges',
					objectives: [
						'BTN 20bb open-shove: 52%',
						'CO 20bb open-shove: 38%',
						'MP 20bb open-shove: 22%',
						'UTG 20bb open-shove: 15%',
						'Re-shove vs BTN: 28%',
						'Re-shove vs CO: 20%'
					],
					tools: 'DTO Poker / ICMizer',
					completed: false
				},
				{
					hours: 1,
					type: 'video',
					title: 'Medium Stack Strategy (30-60bb)',
					description: 'Re-steal & 3-bet shoving',
					objectives: [
						'When to 3-bet shove instead of call?',
						'Re-steal vs late position opens',
						'Stack-preservation vs aggression'
					],
					completed: false
				},
				{
					hours: 2.5,
					type: 'play',
					title: 'MTT Play - Short Stack Focus',
					description: 'Play until <25bb, then late-reg new tournaments',
					completed: false
				},
				{
					hours: 1,
					type: 'review',
					title: 'Push/Fold error analysis',
					description: 'Every <25bb error is critical',
					completed: false
				}
			]
		},
		{
			day: 4,
			title: 'Day 3-4: Push/Fold (Continued)',
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Push/Fold speed training',
					description: 'Fast decision making',
					completed: false
				},
				{ hours: 1, type: 'video', title: 'Common short-stack mistakes', completed: false },
				{ hours: 2.5, type: 'play', title: 'MTT Grind', completed: false },
				{ hours: 1, type: 'review', title: 'Deep review of all <30bb spots', completed: false }
			]
		},
		{
			day: 5,
			title: 'Day 5-6: Ultra-Short Stacks + ICM',
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Push/Fold (15bb & 10bb)',
					description: 'Extreme short-stack situations',
					objectives: ['BTN 15bb: 58%', 'BTN 10bb: 68%', 'Defense ranges extremely wide'],
					completed: false
				},
				{
					hours: 1,
					type: 'theory',
					title: 'ICM Fundamentals',
					description: 'Why folding can be +EV',
					objectives: [
						'ICM basics: Non-linear chip value',
						'Bubble play: Maximize fold equity',
						'Final table ICM',
						'When to return to chip-EV?'
					],
					completed: false
				},
				{
					hours: 2.5,
					type: 'play',
					title: 'MTT Play - ICM awareness',
					description: 'Identify bubble & final table spots',
					completed: false
				},
				{ hours: 1, type: 'review', title: 'ICM spot identification', completed: false }
			]
		},
		{
			day: 6,
			title: 'Day 5-6: Advanced (Continued)',
			totalHours: 6.5,
			modules: [
				{ hours: 2, type: 'drill', title: 'Weakest push/fold spots', completed: false },
				{ hours: 1, type: 'theory', title: 'Advanced ICM situations', completed: false },
				{ hours: 2.5, type: 'play', title: 'MTT Grind', completed: false },
				{ hours: 1, type: 'review', title: 'Weekly ROI analysis', completed: false }
			]
		},
		{
			day: 7,
			title: 'Day 7: Integration & Tournament Play',
			totalHours: 7.5,
			modules: [
				{
					hours: 2,
					type: 'drill',
					title: 'Final push/fold drilling',
					description: 'Random stack sizes (8-25bb)',
					completed: false
				},
				{
					hours: 4,
					type: 'play',
					title: 'Tournament marathon',
					description: '4-6 tournaments simultaneously',
					objectives: [
						'Consistent stack strategy',
						'ICM awareness at bubble',
						'Push/fold perfectly executed',
						'Aim for deep run'
					],
					completed: false
				},
				{
					hours: 1.5,
					type: 'assessment',
					title: 'Weekly analysis',
					description: 'ROI, ITM%, Average finish',
					objectives: [
						'Calculate total ROI',
						'ITM% (target: >15%)',
						'Bubble performance',
						'Top 5 errors for week 2'
					],
					completed: false
				}
			]
		}
	]
};

// Tools & Resources
export const RECOMMENDED_TOOLS = {
	GTO_TRAINERS: [
		{
			name: 'GTO Wizard',
			url: 'https://gtowizard.com',
			price: '$29-49/mo',
			best_for: 'Cash Game & MTT, most comprehensive solution',
			features: ['Hand Trainer', 'Range Explorer', 'Hand History Analysis', 'Quiz Mode']
		},
		{
			name: 'DTO Poker',
			url: 'https://dtopoker.com',
			price: '$25-40/mo',
			best_for: 'Tournaments & Push/Fold',
			features: ['MTT Solver', 'Push/Fold Trainer', 'ICM Calculator']
		},
		{
			name: 'PokerCoaching',
			url: 'https://pokercoaching.com',
			price: '$49/mo',
			best_for: 'Videos + Training',
			features: ['Video Library', 'Hand Reviews', 'Community']
		}
	],
	TRACKING: [
		{
			name: 'PokerTracker 4',
			type: 'HUD & Tracker',
			price: '$99 (lifetime)',
			features: ['Hand History Import', 'Stats', 'Leak Finder']
		},
		{
			name: "Hold'em Manager 3",
			type: 'HUD & Tracker',
			price: '$60-100',
			features: ['Real-time HUD', 'Reports', 'Hand Replayer']
		}
	]
};
