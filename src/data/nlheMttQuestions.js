/**
 * NLHE MTT (No-Limit Hold'em Multi-Table Tournament) Question Pool
 * Comprehensive training questions covering all stages of tournament play
 * 65+ questions covering early, middle, late, bubble, and final table play
 */

export const NLHE_MTT_QUESTIONS = [
  // EARLY STAGE (100+ BB)
  {
    id: 'mtt_1',
    category: 'mtt_early',
    difficulty: 'easy',
    question: 'In early stage (100bb), your main goal is:',
    answers: [
      'Accumulate chips aggressively',
      'Survive to later stages',
      'Play tight and preserve stack',
      'See cheap flops and hit big hands'
    ],
    correctAnswer: 'Accumulate chips aggressively',
    explanation: 'Early in tournaments with deep stacks, play to accumulate. Small edges matter. Don\'t be passive - build a stack for later pressure situations.',
    points: 10,
  },
  {
    id: 'mtt_2',
    category: 'mtt_early',
    difficulty: 'medium',
    question: 'Early stage, villain limps from MP. You have A♥J♦ on BTN. Best play?',
    answers: [
      'Limp behind - see cheap flop',
      'ISO-raise to 5x BB',
      'Fold - dominated too often',
      'Min-raise to 2.5x BB'
    ],
    correctAnswer: 'ISO-raise to 5x BB',
    explanation: 'Isolation raise with position is profitable. Size it larger than normal (5x+) against limpers to deny them odds. AJ is strong enough to iso-raise.',
    points: 15,
  },

  {
    id: 'mtt_3',
    category: 'mtt_early',
    difficulty: 'medium',
    question: '150bb effective, you raise BTN with 9♠8♠. BB calls. Flop: K♦7♠3♠. BB checks. What sizing?',
    answers: [
      'Check behind - missed',
      'Bet 33% pot',
      'Bet 50% pot',
      'Bet 75% pot'
    ],
    correctAnswer: 'Bet 33% pot',
    explanation: 'You have flush draw + backdoor straight. Small bet is profitable with range advantage and equity. Don\'t need to bet large with drawing hand.',
    points: 15,
  },

  {
    id: 'mtt_4',
    category: 'mtt_early',
    difficulty: 'hard',
    question: 'You open UTG, BTN 3-bets, blinds fold. You have JJ (100bb). Correct play?',
    answers: [
      'Call - see flop in position',
      '4-bet to 2.5x their 3-bet',
      'Fold - face overcards too often',
      '4-bet shove 100bb'
    ],
    correctAnswer: 'Call - see flop in position',
    explanation: 'JJ vs BTN 3-bet range is ahead but vulnerable. Calling allows you to play post-flop and avoid commitment preflop. 4-betting commits you to flip/crushed scenario.',
    points: 20,
  },

  // MIDDLE STAGE (30-60 BB)
  {
    id: 'mtt_5',
    category: 'mtt_middle',
    difficulty: 'easy',
    question: 'Middle stage (40bb), antes in play. Your strategy should adjust by:',
    answers: [
      'Playing tighter - more at risk',
      'Opening wider - more to win',
      'Same strategy',
      'Only play premiums'
    ],
    correctAnswer: 'Opening wider - more to win',
    explanation: 'Antes increase dead money in pot, making steals more profitable. Open wider, especially from late position. 30-40% BTN opening range is normal.',
    points: 10,
  },

  {
    id: 'mtt_6',
    category: 'mtt_middle',
    difficulty: 'medium',
    question: '35bb stack, you open BTN with K♣Q♦. SB shoves 25bb. Blinds 500/1000, ante 100. Call or fold?',
    answers: [
      'Call - getting good odds',
      'Fold - need stronger hand',
      'Call - dominating his range',
      'Fold - too much variance'
    ],
    correctAnswer: 'Call - getting good odds',
    explanation: 'You risk 25bb to win ~28bb (25 + 1.5 + 0.1 + 0.9). Need ~47% equity. KQo has ~45%+ vs most shoving ranges. Close call, slightly profitable.',
    points: 15,
  },

  {
    id: 'mtt_7',
    category: 'mtt_middle',
    difficulty: 'hard',
    question: '40bb stack, CO opens 2.5bb, you 3-bet BTN to 7bb with A♥5♥. CO calls. Flop: K♠9♣2♥. CO checks. Best play?',
    answers: [
      'Check back - missed completely',
      'Bet 4bb (33% pot)',
      'Bet 6bb (50% pot)',
      'Bet 9bb (75% pot)'
    ],
    correctAnswer: 'Bet 4bb (33% pot)',
    explanation: 'As 3-bettor you have range advantage on K-high board. Small bet works great - he folds often, and you have backdoor nut flush draw. Efficient bluff.',
    points: 20,
  },

  {
    id: 'mtt_8',
    category: 'mtt_middle',
    difficulty: 'hard',
    question: '50bb, MP opens 2.2bb, BTN calls, you call BB with 9♠8♠. Flop: Q♦9♥4♠ (pot 7.6bb). MP bets 4bb, BTN folds. Your play?',
    answers: [
      'Fold - weak kicker, no draws',
      'Call - 2nd pair decent',
      'Raise to 12bb - semi-bluff',
      'Shove 48bb'
    ],
    correctAnswer: 'Fold - weak kicker, no draws',
    explanation: 'Second pair weak kicker in 3-way pot is trouble. MP\'s range hits this board hard. You need to improve to win, and draws are limited. Fold.',
    points: 20,
  },

  // LATE STAGE (20-30 BB)
  {
    id: 'mtt_9',
    category: 'mtt_late',
    difficulty: 'easy',
    question: 'Late stage (20bb), when should you consider limping?',
    answers: [
      'Never - always raise or fold',
      'With small pairs from SB',
      'With speculative hands in EP',
      'Frequently to see cheap flops'
    ],
    correctAnswer: 'Never - always raise or fold',
    explanation: 'At 20bb, it\'s raise or fold. Limping gives away information and allows opponents to realize equity too easily. Stay aggressive.',
    points: 10,
  },

  {
    id: 'mtt_10',
    category: 'mtt_late',
    difficulty: 'medium',
    question: '22bb stack, folds to you in SB with K♥T♦. BB has 18bb. Correct play?',
    answers: [
      'Limp - see cheap flop',
      'Min-raise to 2bb',
      'Raise to 2.5bb',
      'Shove 22bb'
    ],
    correctAnswer: 'Shove 22bb',
    explanation: 'With 22bb in SB, min-raising commits you awkwardly. Shoving with KTo is profitable vs BB defend range. Simple and effective.',
    points: 15,
  },

  {
    id: 'mtt_11',
    category: 'mtt_late',
    difficulty: 'hard',
    question: '25bb, CO opens 2.2bb (22bb behind). You have A♣Q♣ on BTN (25bb). Best play?',
    answers: [
      'Call - see flop with position',
      '3-bet to 6bb',
      '3-bet shove 25bb',
      'Fold - avoid domination'
    ],
    correctAnswer: '3-bet shove 25bb',
    explanation: 'At 25bb, small 3-bets are awkward. Shoving is better: puts maximum pressure, avoids difficult post-flop spots, and AQs has great equity vs calling range.',
    points: 20,
  },

  {
    id: 'mtt_12',
    category: 'mtt_late',
    difficulty: 'hard',
    question: '20bb, MP opens 2.5bb, folds to you in BB with T♠T♣. Villain has 35bb. Your play?',
    answers: [
      'Call - set mine',
      '3-bet to 7.5bb',
      '3-bet shove 20bb',
      'Fold'
    ],
    correctAnswer: '3-bet shove 20bb',
    explanation: 'TT vs MP open has great equity. With 20bb, shoving is cleaner than 3-betting small (which commits you). You get folds and have equity when called.',
    points: 20,
  },

  // PUSH/FOLD STAGE (< 20 BB)
  {
    id: 'mtt_13',
    category: 'mtt_push_fold',
    difficulty: 'easy',
    question: 'At what stack depth does push/fold strategy become most important?',
    answers: [
      '30bb',
      '20bb',
      '15bb',
      '10bb'
    ],
    correctAnswer: '15bb',
    explanation: 'Below 15bb, push/fold becomes dominant strategy. Post-flop play becomes too risky with shallow SPR. Know your push/fold charts.',
    points: 10,
  },

  {
    id: 'mtt_14',
    category: 'mtt_push_fold',
    difficulty: 'medium',
    question: '12bb in CO, folds to you with Q♠J♦. Correct play?',
    answers: [
      'Fold - need stronger',
      'Min-raise 2bb',
      'Shove 12bb',
      'Raise to 2.5bb'
    ],
    correctAnswer: 'Shove 12bb',
    explanation: 'QJo from CO with 12bb is clear shove. Opens ~40%+ from CO, QJ is well above that threshold. Don\'t min-raise at this depth.',
    points: 15,
  },

  {
    id: 'mtt_15',
    category: 'mtt_push_fold',
    difficulty: 'hard',
    question: '10bb in BTN, SB (8bb) and BB (12bb). Folds to you, you have A♥7♦. Correct play?',
    answers: [
      'Fold - weak ace',
      'Min-raise 2bb',
      'Shove 10bb',
      'Raise to 2.5bb'
    ],
    correctAnswer: 'Shove 10bb',
    explanation: 'A7o from BTN with 10bb is mandatory shove. Both blinds are short and can\'t call light. You have great fold equity plus equity when called.',
    points: 20,
  },

  {
    id: 'mtt_16',
    category: 'mtt_push_fold',
    difficulty: 'hard',
    question: '8bb in BB, BTN shoves 15bb. You have K♦Q♠. Pot odds require 40% equity to call. Your play?',
    answers: [
      'Fold - need better hand',
      'Call - KQ strong enough',
      'Call - priced in',
      'Fold - variance too high'
    ],
    correctAnswer: 'Call - KQ strong enough',
    explanation: 'KQo has ~43% equity vs average BTN shoving range. You need 40% to call profitably. Clear call. Don\'t fold hands this strong.',
    points: 20,
  },

  // BUBBLE PLAY
  {
    id: 'mtt_17',
    category: 'mtt_bubble',
    difficulty: 'easy',
    question: 'On the bubble, the correct strategy is generally:',
    answers: [
      'Play very tight - wait for money',
      'Apply pressure on medium stacks',
      'Go all-in every hand',
      'Min-cash is the goal'
    ],
    correctAnswer: 'Apply pressure on medium stacks',
    explanation: 'Bubble is time to apply pressure, especially on medium stacks who can\'t afford to bust. Big stacks should steal aggressively. Medium stacks play tight.',
    points: 10,
  },

  {
    id: 'mtt_18',
    category: 'mtt_bubble',
    difficulty: 'medium',
    question: 'You have 25bb on bubble (avg 30bb). MP (40bb) opens 2.5bb, folds to you in BB with 9♥9♣. Correct play?',
    answers: [
      'Fold - protect stack on bubble',
      'Call - see flop',
      '3-bet to 7.5bb',
      '3-bet shove 25bb'
    ],
    correctAnswer: '3-bet to 7.5bb',
    explanation: 'Don\'t be too passive on bubble with strong hands. 99 is ahead of opening range. Small 3-bet applies pressure without committing stack.',
    points: 15,
  },

  {
    id: 'mtt_19',
    category: 'mtt_bubble',
    difficulty: 'hard',
    question: 'Bubble: You (50bb), shortstack (7bb) in SB, BB (30bb). Folds to you in CO with A♦5♦. Play?',
    answers: [
      'Fold - shortstack about to bust',
      'Raise 2.5bb - standard open',
      'Raise 3bb - larger to pressure BB',
      'Limp - avoid shortstack'
    ],
    correctAnswer: 'Raise 3bb - larger to pressure BB',
    explanation: 'With shortstack in SB, BB might play tighter. Raise larger to put pressure on BB. A5s is strong enough to open from CO.',
    points: 20,
  },

  {
    id: 'mtt_20',
    category: 'mtt_bubble',
    difficulty: 'hard',
    question: 'Stone bubble (1 from money), you (15bb) in BB, BTN (40bb) shoves. You have A♠J♠. Call or fold?',
    answers: [
      'Fold - min-cash secured by waiting',
      'Call - AJs too strong to fold',
      'Fold - ICM pressure huge',
      'Call - chip EV positive'
    ],
    correctAnswer: 'Fold - ICM pressure huge',
    explanation: 'On stone bubble with 15bb (not desperate), folding AJs can be correct due to ICM. If you bust, you get 0. Waiting has massive value. ICM > chip EV.',
    points: 20,
  },

  // FINAL TABLE
  {
    id: 'mtt_21',
    category: 'mtt_final_table',
    difficulty: 'medium',
    question: 'At final table, ICM pressure is:',
    answers: [
      'Same as bubble',
      'Much higher than bubble',
      'Lower than bubble',
      'Irrelevant - chip EV only'
    ],
    correctAnswer: 'Much higher than bubble',
    explanation: 'Final table ICM is extreme. Each pay jump is significant. Survival value is huge. Play tighter than chip-EV suggests, especially with medium stack.',
    points: 15,
  },

  {
    id: 'mtt_22',
    category: 'mtt_final_table',
    difficulty: 'hard',
    question: 'Final table (9 left), you (20bb, 5th in chips). Shortstack (5bb) shoves UTG, folds to you in BTN with A♣K♦. Call?',
    answers: [
      'Call - AK is premium',
      'Fold - let shortstacks battle',
      'Call - dominating range',
      'Fold - ICM considerations'
    ],
    correctAnswer: 'Call - AK is premium',
    explanation: 'AK is too strong to fold even at FT. Shortstack desperate, you have huge equity edge. Don\'t overdo ICM - still need to accumulate with strong hands.',
    points: 20,
  },

  {
    id: 'mtt_23',
    category: 'mtt_final_table',
    difficulty: 'hard',
    question: 'FT, 6 players left. You (15bb, 4th), chipleader (60bb) on BTN, you in SB with K♥Q♥. Chipleader opens 2.5bb. Play?',
    answers: [
      'Fold - avoid big stack',
      '3-bet to 7bb',
      '3-bet shove 15bb',
      'Call'
    ],
    correctAnswer: 'Fold - avoid big stack',
    explanation: 'At FT with medium stack, avoid confrontations with chipleader when you can. KQs is strong but not strong enough to risk tournament life against wide range.',
    points: 20,
  },

  // ADDITIONAL ADVANCED MTT QUESTIONS
  {
    id: 'mtt_24',
    category: 'mtt_icm',
    difficulty: 'hard',
    question: 'What is the primary difference between chip EV and ICM calculations?',
    answers: [
      'ICM values survival over accumulation',
      'Chip EV is always more profitable',
      'ICM only matters on bubble',
      'No significant difference'
    ],
    correctAnswer: 'ICM values survival over accumulation',
    explanation: 'ICM (Independent Chip Model) assigns non-linear value to chips. Losing chips hurts more than gaining them helps. Survival has huge value in ICM spots.',
    points: 20,
  },

  {
    id: 'mtt_25',
    category: 'mtt_ranges',
    difficulty: 'medium',
    question: 'From UTG with 30bb, your opening range should be approximately:',
    answers: [
      '8-10%',
      '15-18%',
      '20-22%',
      '25%+'
    ],
    correctAnswer: '15-18%',
    explanation: '15-18% is standard UTG opening range at 30bb: 99+, ATs+, AJo+, KQs, some suited Broadway. Antes make ranges slightly wider than cash games.',
    points: 15,
  },

  {
    id: 'mtt_26',
    category: 'mtt_postflop',
    difficulty: 'hard',
    question: 'You open BTN (40bb), BB calls. Flop: A♠7♣2♥ (heads up, pot 7bb). BB checks. Your A♥K♦. What size?',
    answers: [
      'Check - way ahead',
      'Bet 2bb (33% pot)',
      'Bet 3.5bb (50% pot)',
      'Bet 5bb (75% pot)'
    ],
    correctAnswer: 'Bet 2bb (33% pot)',
    explanation: 'With top pair top kicker on dry board, small bet is optimal. Gets value from worse aces and draws. Larger bets fold out too many worse hands.',
    points: 20,
  },

  {
    id: 'mtt_27',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'In MTT vs cash games, your red line (non-showdown winnings) should be:',
    answers: [
      'Much higher - more aggression needed',
      'Lower - tighter play',
      'Same as cash',
      'Irrelevant stat for MTTs'
    ],
    correctAnswer: 'Much higher - more aggression needed',
    explanation: 'MTTs require more aggression and stealing than cash games. You must accumulate chips. Positive red line is crucial for tournament success.',
    points: 15,
  },

  {
    id: 'mtt_28',
    category: 'mtt_bubble',
    difficulty: 'medium',
    question: 'On bubble, you have 10bb (shortest at table). Best strategy?',
    answers: [
      'Shove or fold aggressively',
      'Min-raise to see flops',
      'Wait for premium hands',
      'Fold to money'
    ],
    correctAnswer: 'Shove or fold aggressively',
    explanation: 'With 10bb as short stack on bubble, push hard. You need to accumulate or bust trying. Waiting bleeds you to death. Others will avoid you (ICM).',
    points: 15,
  },

  {
    id: 'mtt_29',
    category: 'mtt_final_table',
    difficulty: 'hard',
    question: '3-handed, you (30bb), villain1 (40bb), villain2 (30bb). Villain1 shoves button, you in SB with 8♥8♣. Call?',
    answers: [
      'Call - 88 strong 3-handed',
      'Fold - avoid flip',
      'Call - getting great odds',
      'Fold - wait for better spot'
    ],
    correctAnswer: 'Call - 88 strong 3-handed',
    explanation: '3-handed, 88 is very strong. BTN shoving wide, you have equity edge. Don\'t be too nitty 3-handed - ranges are wide.',
    points: 20,
  },

  {
    id: 'mtt_30',
    category: 'mtt_early',
    difficulty: 'medium',
    question: '120bb deep, you raise BTN with Q♠J♠, BB calls (100bb). Flop: K♥T♣3♠. BB checks. Your play?',
    answers: [
      'Check - weak hand',
      'Bet 33% pot - c-bet',
      'Bet 50% pot',
      'Bet 75% pot'
    ],
    correctAnswer: 'Bet 33% pot - c-bet',
    explanation: 'You have gutshot + backdoor flush. Small c-bet is profitable with range advantage. Efficient bluff with equity.',
    points: 15,
  },

  // Stack preservation questions
  {
    id: 'mtt_31',
    category: 'mtt_middle',
    difficulty: 'medium',
    question: '45bb, you open CO with A♦Q♦. BTN 3-bets to 10bb (55bb behind). Correct play?',
    answers: [
      'Call - position is bad for you',
      '4-bet to 24bb',
      'Fold - avoid big pot OOP',
      '4-bet shove 45bb'
    ],
    correctAnswer: 'Fold - avoid big pot OOP',
    explanation: 'AQo vs BTN 3-bet out of position at 45bb is tricky. Calling creates awkward postflop. 4-betting commits too much. Folding is fine here.',
    points: 15,
  },

  {
    id: 'mtt_32',
    category: 'mtt_late',
    difficulty: 'hard',
    question: '28bb, BTN (25bb) opens 2.5bb, you in BB with A♠A♣. What\'s optimal play?',
    answers: [
      'Call - trap',
      '3-bet to 7bb',
      '3-bet shove 28bb',
      'Flat call - see flop'
    ],
    correctAnswer: '3-bet to 7bb',
    explanation: 'With AA at 28bb, small 3-bet builds pot while keeping worse hands in. Shoving folds out hands that might stack off postflop. Optimize value.',
    points: 20,
  },

  {
    id: 'mtt_33',
    category: 'mtt_push_fold',
    difficulty: 'medium',
    question: '14bb in MP, folds to you with 8♠8♣. Correct play?',
    answers: [
      'Fold - too weak for shove',
      'Raise to 2.5bb',
      'Shove 14bb',
      'Limp'
    ],
    correctAnswer: 'Shove 14bb',
    explanation: '88 from MP with 14bb is clear shove. Opens 20%+ from MP, 88 is premium at this stack depth. Simple and effective.',
    points: 15,
  },

  {
    id: 'mtt_34',
    category: 'mtt_final_table',
    difficulty: 'hard',
    question: 'Heads up, you (60bb), villain (40bb). You on BTN with 7♥6♥. Correct play?',
    answers: [
      'Fold - weak hand',
      'Limp',
      'Raise to 2bb',
      'Raise to 2.5bb'
    ],
    correctAnswer: 'Raise to 2.5bb',
    explanation: 'Heads up, 76s is strong. Raise (almost) every BTN. Stay aggressive. Limping gives up initiative.',
    points: 20,
  },

  // Blind stealing questions
  {
    id: 'mtt_35',
    category: 'mtt_middle',
    difficulty: 'easy',
    question: 'What is a "resteal"?',
    answers: [
      'Stealing blinds from late position',
      '3-betting vs late position opener',
      'Calling a steal attempt',
      'Opening from blinds'
    ],
    correctAnswer: '3-betting vs late position opener',
    explanation: 'Resteal = 3-betting vs suspected steal attempt (usually BTN/CO opens). Take advantage of their wide opening ranges.',
    points: 10,
  },

  {
    id: 'mtt_36',
    category: 'mtt_middle',
    difficulty: 'medium',
    question: '35bb in BB, BTN (40bb) opens 2.2bb. You have K♣9♣. Resteal shove or fold?',
    answers: [
      'Fold - not strong enough',
      'Call - see flop',
      'Shove 35bb - resteal',
      '3-bet to 7bb'
    ],
    correctAnswer: 'Fold - not strong enough',
    explanation: 'K9s is not quite strong enough to resteal vs BTN with 35bb. Need AT+, KQ+, or pairs typically. K9s can call sometimes but folding is fine.',
    points: 15,
  },

  {
    id: 'mtt_37',
    category: 'mtt_late',
    difficulty: 'hard',
    question: '22bb, BTN opens 2.2bb (28bb behind), you in SB with A♦T♠. BB is tight (30bb). Best play?',
    answers: [
      'Fold',
      'Call - see flop',
      '3-bet to 6.5bb',
      '3-bet shove 22bb'
    ],
    correctAnswer: '3-bet shove 22bb',
    explanation: 'With tight BB, you have isolation opportunity. ATo with 22bb vs BTN steal is great resteal shove. Fold equity + equity when called = profitable.',
    points: 20,
  },

  // River play
  {
    id: 'mtt_38',
    category: 'mtt_postflop',
    difficulty: 'hard',
    question: 'You bluff turn, villain calls. River bricks. Pot = 30bb, you have 40bb behind. Optimal river play?',
    answers: [
      'Give up - he called turn',
      'Bet 15bb (50% pot)',
      'Shove 40bb (130% pot)',
      'Bet 20bb (66% pot)'
    ],
    correctAnswer: 'Give up - he called turn',
    explanation: 'Without specific reads, double-barreling and giving up river is often optimal. River bluffs work when you rep specific hands credibly. Random bluffs = chip spew.',
    points: 20,
  },

  {
    id: 'mtt_39',
    category: 'mtt_postflop',
    difficulty: 'medium',
    question: 'You have top pair on river. Villain bets 60% pot. Your hand beats bluffs, loses to value. Correct play?',
    answers: [
      'Call - bluff-catchers should call',
      'Fold - if he bets he has it',
      'Raise - for thin value',
      'Call if villain capable of bluffing'
    ],
    correctAnswer: 'Call if villain capable of bluffing',
    explanation: 'Bluff-catcher decision depends on opponent\'s bluffing frequency. If villain never bluffs, fold. If villain bluffs enough, call. Read-dependent.',
    points: 15,
  },

  // Pay jump considerations
  {
    id: 'mtt_40',
    category: 'mtt_icm',
    difficulty: 'hard',
    question: 'FT, 5 players left, you\'re 5th in chips (12bb). 4th place pays $5k, 3rd pays $8k. Best strategy?',
    answers: [
      'Play push/fold aggressively',
      'Survive to next pay jump',
      'Ladder by waiting',
      'Shove every hand'
    ],
    correctAnswer: 'Play push/fold aggressively',
    explanation: 'With 12bb as shortstack, you can\'t wait for pay jumps. Need to accumulate or bust. Ladder abuse only works with 5-8bb (true shortstack).',
    points: 20,
  },

  // Range construction
  {
    id: 'mtt_41',
    category: 'mtt_ranges',
    difficulty: 'medium',
    question: 'From BTN with 35bb and antes, optimal opening range is approximately:',
    answers: [
      '25%',
      '35%',
      '45%',
      '55%'
    ],
    correctAnswer: '45%',
    explanation: '45% BTN opening range is standard with antes at 35bb. Very wide: all pairs, all Ax, most Kx, suited broadways, connectors. Position + antes = open wide.',
    points: 15,
  },

  {
    id: 'mtt_42',
    category: 'mtt_ranges',
    difficulty: 'hard',
    question: '25bb, CO opens 2.2bb, you\'re on BTN. Optimal 3-betting range?',
    answers: [
      'Polarized (premiums + bluffs)',
      'Linear (strong hands only)',
      'Merged (premiums + good hands)',
      'Never 3-bet at 25bb'
    ],
    correctAnswer: 'Polarized (premiums + bluffs)',
    explanation: 'At 25bb, 3-bets are often all-in or pot-committing. Polarized range is best: QQ+/AK for value, some suited Ax for bluffs. Avoid medium hands like TT/AQ.',
    points: 20,
  },

  // Ante dynamics
  {
    id: 'mtt_43',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'With antes vs without antes, your late position opening range should be:',
    answers: [
      'Much tighter',
      'Slightly tighter',
      'Same',
      'Much wider'
    ],
    correctAnswer: 'Much wider',
    explanation: 'Antes add significant dead money, making steals more profitable. Open 40-50% from BTN with antes vs 30-35% without. Steal aggressively.',
    points: 15,
  },

  {
    id: 'mtt_44',
    category: 'mtt_middle',
    difficulty: 'medium',
    question: 'Big blind ante vs button ante - how does strategy change?',
    answers: [
      'No difference',
      'BB should defend wider',
      'Steals are more profitable',
      'BTN should open tighter'
    ],
    correctAnswer: 'BB should defend wider',
    explanation: 'With BB posting ante, BB gets better pot odds to defend (more chips invested). Defend slightly wider. Steals are also more profitable (more in pot).',
    points: 15,
  },

  // Multi-way pots
  {
    id: 'mtt_45',
    category: 'mtt_postflop',
    difficulty: 'medium',
    question: 'In multi-way pots, you should generally:',
    answers: [
      'C-bet more often - more to win',
      'C-bet less often - someone hit',
      'Same frequency as heads-up',
      'Always c-bet as preflop raiser'
    ],
    correctAnswer: 'C-bet less often - someone hit',
    explanation: 'Multi-way pots = someone likely hit. C-bet only with strong hands or very good boards for your range. Reduce bluffing frequency significantly.',
    points: 15,
  },

  {
    id: 'mtt_46',
    category: 'mtt_postflop',
    difficulty: 'hard',
    question: 'You raise BTN, both blinds call. Flop: 9♠5♣2♥ (pot 9bb). Checked to you. You have A♥K♦. Best play?',
    answers: [
      'Check - missed completely',
      'Bet 3bb (33%)',
      'Bet 5bb (55%)',
      'Bet 7bb (75%)'
    ],
    correctAnswer: 'Bet 3bb (33%)',
    explanation: 'On dry board multiway, small c-bet with AK high is fine. You have two overcards and represent range advantage. Keep pot small.',
    points: 20,
  },

  // Shortstack all-in ranges
  {
    id: 'mtt_47',
    category: 'mtt_push_fold',
    difficulty: 'medium',
    question: 'With 7bb on BTN (antes in play), you should shove approximately:',
    answers: [
      '30% of hands',
      '45% of hands',
      '60% of hands',
      '75% of hands'
    ],
    correctAnswer: '60% of hands',
    explanation: 'With 7bb and antes, BTN shoving range is very wide: ~60%. All pairs, all Ax, most Kx, many Qx, suited connectors. Massive fold equity.',
    points: 15,
  },

  {
    id: 'mtt_48',
    category: 'mtt_push_fold',
    difficulty: 'hard',
    question: '9bb in SB, folds to you, BB has 12bb with Q♦T♠. Shove or fold?',
    answers: [
      'Shove - strong enough',
      'Fold - need better',
      'Min-raise - see flop',
      'Limp'
    ],
    correctAnswer: 'Shove - strong enough',
    explanation: 'QTo from SB with 9bb is clear shove. SB vs BB with 9bb shoves ~65% of hands. QTo is well above threshold.',
    points: 20,
  },

  // Calling shoves
  {
    id: 'mtt_49',
    category: 'mtt_push_fold',
    difficulty: 'medium',
    question: 'BTN (8bb) shoves, you in BB (25bb) with A♣9♦. Pot gives you 2.3:1 odds. Call or fold?',
    answers: [
      'Fold - need stronger',
      'Call - priced in',
      'Fold - too much variance',
      'Call - dominating range'
    ],
    correctAnswer: 'Call - priced in',
    explanation: 'Need 30% equity at 2.3:1 odds. A9o has ~38% vs BTN 8bb shoving range. Easy call with decent ace.',
    points: 15,
  },

  {
    id: 'mtt_50',
    category: 'mtt_push_fold',
    difficulty: 'hard',
    question: 'MP (10bb) shoves, you in BB (30bb) with 5♥5♣. Getting 2:1 odds. Call?',
    answers: [
      'Call - pairs play well',
      'Fold - likely racing',
      'Call - getting correct odds',
      'Fold - protect stack'
    ],
    correctAnswer: 'Call - getting correct odds',
    explanation: 'Need 33% equity at 2:1. 55 has ~45% vs MP 10bb shoving range (wider than you think). Comfortable call.',
    points: 20,
  },

  // Squeeze play
  {
    id: 'mtt_51',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'What is a "squeeze play"?',
    answers: [
      '3-betting after open and call(s)',
      '4-betting preflop',
      'Shoving over limpers',
      'Calling a 3-bet in position'
    ],
    correctAnswer: '3-betting after open and call(s)',
    explanation: 'Squeeze = 3-betting when there\'s an opener and caller(s). Takes advantage of weak calls and applies maximum pressure. Very profitable in MTTs.',
    points: 15,
  },

  {
    id: 'mtt_52',
    category: 'mtt_middle',
    difficulty: 'hard',
    question: '40bb, CO opens 2.5bb, BTN calls, you in SB with A♥J♥. Best play?',
    answers: [
      'Fold - multiway trouble',
      'Call - see flop in multiway',
      '3-bet to 10bb - squeeze',
      'Shove 40bb'
    ],
    correctAnswer: '3-bet to 10bb - squeeze',
    explanation: 'Perfect squeeze spot: AJs is strong, opener may have weak hand, caller is capped. Squeeze to 10bb puts huge pressure. Very profitable.',
    points: 20,
  },

  // Table dynamics
  {
    id: 'mtt_53',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'At a tight table, you should:',
    answers: [
      'Play tight - wait for premiums',
      'Open wider - more fold equity',
      'Same strategy',
      'Limp more - see cheap flops'
    ],
    correctAnswer: 'Open wider - more fold equity',
    explanation: 'Tight tables = more stealing opportunities. Open wider, especially from late position. Exploit passive players by stealing liberally.',
    points: 15,
  },

  {
    id: 'mtt_54',
    category: 'mtt_strategy',
    difficulty: 'hard',
    question: 'At aggressive 3-betting table, how should you adjust?',
    answers: [
      'Open wider - fight back',
      'Open tighter - avoid 3-bets',
      '4-bet lighter - counter aggression',
      'Limp more'
    ],
    correctAnswer: 'Open tighter - avoid 3-bets',
    explanation: 'Against aggressive 3-bettors, tighten opening range and be ready to 4-bet/call with strong hands. Avoid opening hands that can\'t handle pressure.',
    points: 20,
  },

  // Blind vs blind
  {
    id: 'mtt_55',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'SB vs BB (both 30bb), what % should SB open-raise?',
    answers: [
      '30%',
      '50%',
      '65%',
      '80%'
    ],
    correctAnswer: '65%',
    explanation: 'SB should open ~60-70% vs BB. Very wide range: all pairs, all Ax, most Kx, suited hands, connectors. Position + stealing BB = open wide.',
    points: 15,
  },

  {
    id: 'mtt_56',
    category: 'mtt_strategy',
    difficulty: 'hard',
    question: 'BB vs SB open (30bb), you should defend approximately:',
    answers: [
      '30%',
      '45%',
      '60%',
      '75%'
    ],
    correctAnswer: '45%',
    explanation: 'BB defends ~45% vs SB open. Getting great pot odds but OOP. Defend with pairs, broadways, suited hands, connectors. Fold weak offsuit hands.',
    points: 20,
  },

  // Stack management
  {
    id: 'mtt_57',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'Most dangerous stack size in MTT is approximately:',
    answers: [
      '5-10bb',
      '15-25bb',
      '30-40bb',
      '50bb+'
    ],
    correctAnswer: '15-25bb',
    explanation: '15-25bb is awkward: too deep to push/fold, too shallow for comfort postflop. Difficult decisions abound. Requires careful navigation.',
    points: 15,
  },

  {
    id: 'mtt_58',
    category: 'mtt_strategy',
    difficulty: 'hard',
    question: 'With 18bb, you open BTN to 2.2bb. BB shoves 22bb. You have A♠K♣. Call or fold?',
    answers: [
      'Call - AK too strong',
      'Fold - avoid flip',
      'Call - slightly profitable',
      'Fold - preserve stack'
    ],
    correctAnswer: 'Call - AK too strong',
    explanation: 'AK vs BB shove from BTN is always a call. You have equity advantage vs their range. Don\'t be too nitty with premiums.',
    points: 20,
  },

  // Satellite strategy
  {
    id: 'mtt_59',
    category: 'mtt_satellite',
    difficulty: 'medium',
    question: 'In satellites (multiple equal prizes), correct strategy is:',
    answers: [
      'Same as regular MTT',
      'Much tighter - survival focus',
      'More aggressive - need chips',
      'Push/fold earlier'
    ],
    correctAnswer: 'Much tighter - survival focus',
    explanation: 'Satellites reward survival over chip accumulation. Play tighter, especially near bubble. Avoid marginal spots. Goal is to survive, not win.',
    points: 15,
  },

  {
    id: 'mtt_60',
    category: 'mtt_satellite',
    difficulty: 'hard',
    question: 'Satellite bubble, you have 25bb (avg 20bb). All spots pay equally. How tight should you play?',
    answers: [
      'Same as chip EV',
      'Slightly tighter',
      'Very tight - preserve stack',
      'Aggressive - others tight'
    ],
    correctAnswer: 'Very tight - preserve stack',
    explanation: 'With above-average stack in satellite on bubble, play VERY tight. Let shortstacks bust each other. Avoid confrontations. You\'re nearly qualified.',
    points: 20,
  },

  // Turn play
  {
    id: 'mtt_61',
    category: 'mtt_postflop',
    difficulty: 'hard',
    question: 'You c-bet flop with air, villain calls. Turn checks to you again. Pot = 12bb, 25bb behind. Optimal play?',
    answers: [
      'Give up - he called flop',
      'Barrel 8bb (66% pot)',
      'Shove 25bb',
      'Small bet 4bb (33%)'
    ],
    correctAnswer: 'Give up - he called flop',
    explanation: 'Without specific reads or improving equity, double-barreling with air is usually -EV. Give up and save chips for better spots.',
    points: 20,
  },

  {
    id: 'mtt_62',
    category: 'mtt_postflop',
    difficulty: 'medium',
    question: 'You c-bet flop with top pair, villain calls. Turn is a scare card. Pot = 15bb. Best play?',
    answers: [
      'Check - scare card appeared',
      'Bet 10bb - protect hand',
      'Shove',
      'Bet 5bb - control pot'
    ],
    correctAnswer: 'Bet 5bb - control pot',
    explanation: 'With made hand on scare turn, small bet is often best. Gets value from worse, doesn\'t commit too much if behind. Pot control with showdown value.',
    points: 15,
  },

  // Early stage exploitation
  {
    id: 'mtt_63',
    category: 'mtt_early',
    difficulty: 'hard',
    question: '150bb, recreational player opens 5x BB from EP. You on BTN with 8♠8♣. Best exploitative play?',
    answers: [
      'Fold - facing strong range',
      'Call - set mine with odds',
      '3-bet to 15bb',
      'Shove 150bb'
    ],
    correctAnswer: 'Call - set mine with odds',
    explanation: 'Large preflop raise + 150bb deep = set mining paradise. When you flop set you can win huge pot. Calling has great implied odds.',
    points: 20,
  },

  {
    id: 'mtt_64',
    category: 'mtt_early',
    difficulty: 'medium',
    question: 'Early stage, passive player limps from EP. You have K♠J♠ in MP. Optimal play?',
    answers: [
      'Limp behind - see flop',
      'Fold',
      'ISO-raise to 5x BB',
      'Min-raise'
    ],
    correctAnswer: 'ISO-raise to 5x BB',
    explanation: 'Isolate weak limpers with position. KJs is strong enough to iso-raise. Size it larger (5x+) to play heads-up against limper.',
    points: 15,
  },

  // Final questions
  {
    id: 'mtt_65',
    category: 'mtt_mindset',
    difficulty: 'easy',
    question: 'Most important skill for MTT success is:',
    answers: [
      'Preflop hand selection',
      'Reading opponents',
      'Patience and discipline',
      'Aggression'
    ],
    correctAnswer: 'Patience and discipline',
    explanation: 'MTTs require extreme patience - you\'ll play for hours. Discipline to avoid marginal spots is crucial. Technical skills matter, but mindset is foundation.',
    points: 10,
  },

  {
    id: 'mtt_66',
    category: 'mtt_strategy',
    difficulty: 'medium',
    question: 'Average MTT ROI (return on investment) for winning players is approximately:',
    answers: [
      '5-10%',
      '20-30%',
      '40-50%',
      '60%+'
    ],
    correctAnswer: '20-30%',
    explanation: '20-30% ROI is excellent for regular MTTs. High variance + large fields = difficult to sustain huge ROIs. Even 15% ROI is very profitable.',
    points: 15,
  },

  {
    id: 'mtt_67',
    category: 'mtt_icm',
    difficulty: 'hard',
    question: 'Which situation has highest ICM pressure?',
    answers: [
      'Bubble of 1000-player MTT',
      'Final table bubble (10th place)',
      '3-handed at final table',
      'Satellite bubble with 5bb stack'
    ],
    correctAnswer: 'Final table bubble (10th place)',
    explanation: 'Final table bubble has extreme ICM. Pay jump from 10th to 9th is huge. More pressure than regular bubble or 3-handed (where you must play).',
    points: 20,
  },
];

// MTT Concepts for deeper study
export const MTT_CONCEPTS = {
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

export default {
  NLHE_MTT_QUESTIONS,
  MTT_CONCEPTS,
};
