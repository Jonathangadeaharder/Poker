/**
 * PLO (Pot Limit Omaha) Question Pool
 * Comprehensive training questions for PLO strategy
 */

export const PLO_QUESTIONS = [
  // Hand Selection & Preflop
  {
    id: 'plo_1',
    category: 'plo_preflop',
    difficulty: 'easy',
    question: 'What makes a strong PLO starting hand?',
    answers: [
      'Four connected cards with two suits',
      'Four high cards regardless of suits',
      'Any hand with an Ace',
      'Four cards of the same suit'
    ],
    correctAnswer: 'Four connected cards with two suits',
    explanation: 'Strong PLO hands have connectivity (run potential), double-suited (flush potential), and high cards. AAxx double-suited is premium, but rundowns like JT98ds are also very strong.',
    points: 10,
  },
  {
    id: 'plo_2',
    category: 'plo_preflop',
    difficulty: 'medium',
    question: 'What is "dangler" in PLO?',
    answers: [
      'A card that doesn\'t connect with other three',
      'A high card without suit connection',
      'The worst card in your hand',
      'Both A and B'
    ],
    correctAnswer: 'Both A and B',
    explanation: 'A dangler is a card that doesn\'t work with your other cards. For example, in AAK2 with two diamonds, the 2♣ is a dangler. It reduces your hand\'s strength significantly.',
    points: 15,
  },
  {
    id: 'plo_3',
    category: 'plo_preflop',
    difficulty: 'hard',
    question: 'From the BTN in PLO, which hand is stronger?',
    answers: [
      'KKJ9 double-suited',
      'JT98 double-suited',
      'AAT2 rainbow',
      'QQT9 single-suited'
    ],
    correctAnswer: 'JT98 double-suited',
    explanation: 'JT98ds is a premium rundown with massive playability. It makes straights more often than pairs make sets. KKxx has reverse implied odds. Rundowns > Big pairs in PLO.',
    points: 20,
  },

  // Equity & Odds
  {
    id: 'plo_4',
    category: 'plo_equity',
    difficulty: 'medium',
    question: 'Pre-flop in PLO, AA vs random hand has what equity?',
    answers: [
      '85% (like in Hold\'em)',
      '70%',
      '65%',
      '80%'
    ],
    correctAnswer: '65%',
    explanation: 'AA is much weaker preflop in PLO than NLH. AA vs random is ~65%, not 85%. PLO is a game of small edges. AA vs JT98ds is nearly 60/40.',
    points: 15,
  },
  {
    id: 'plo_5',
    category: 'plo_equity',
    difficulty: 'hard',
    question: 'You have nut flush draw + pair on flop. Approximately how many outs?',
    answers: [
      '9 outs (flush)',
      '11 outs (flush + pair)',
      '18-20 outs (redraw considerations)',
      '14 outs'
    ],
    correctAnswer: '18-20 outs (redraw considerations)',
    explanation: 'In PLO, you need to count redraws. 9 flush outs + 2 trip outs + possible straight outs + pair improving to full house. Always consider opponent\'s redraws too!',
    points: 20,
  },

  // Postflop Strategy
  {
    id: 'plo_6',
    category: 'plo_postflop',
    difficulty: 'easy',
    question: 'On a paired board in PLO, what is the main danger?',
    answers: [
      'Full houses',
      'Straights',
      'Flushes',
      'Two pair'
    ],
    correctAnswer: 'Full houses',
    explanation: 'Paired boards make full houses very common in PLO. Your overpair or two pair is often crushed. Be very careful betting strongly on paired boards without trips+.',
    points: 10,
  },
  {
    id: 'plo_7',
    category: 'plo_postflop',
    difficulty: 'medium',
    question: 'You flop top set. Board: K♠7♥3♦. What\'s your main concern?',
    answers: [
      'Getting outdrawn by overpairs',
      'Opponents with wrap straight draws',
      'Flush draws',
      'Lower sets'
    ],
    correctAnswer: 'Opponents with wrap straight draws',
    explanation: 'Wrap draws (like JT98, QJ96) can have 20 outs against your set on dry boards. In PLO, always consider wrap potential. Your set is strong but vulnerable.',
    points: 15,
  },
  {
    id: 'plo_8',
    category: 'plo_postflop',
    difficulty: 'hard',
    question: 'Flop: A♠K♦Q♠. You have AKQ2 (no spades). Correct play?',
    answers: [
      'Bet for value - you have top two',
      'Check/call - way behind most ranges',
      'Check/fold - too vulnerable',
      'Bet/fold - for thin value'
    ],
    correctAnswer: 'Check/call - way behind most ranges',
    explanation: 'Top two on AKQ is weak in PLO. Opponents have many straights (JTxx), sets, two-pair + draws. You\'re often behind and don\'t improve much. Pot control is key.',
    points: 20,
  },

  // Drawing Hands
  {
    id: 'plo_9',
    category: 'plo_draws',
    difficulty: 'medium',
    question: 'What is a "wrap" straight draw?',
    answers: [
      '4 cards to a straight',
      '8+ outs to make straight',
      '13+ outs (double wrap)',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'Wrap = multiple ways to make straights. Example: JT98 on 7-6-2 makes straight with any 9, T, 5, or 4 (13 outs!). Most powerful draws in PLO.',
    points: 15,
  },
  {
    id: 'plo_10',
    category: 'plo_draws',
    difficulty: 'hard',
    question: 'You have JT98ds. Flop: Q♠7♦6♣. How many clean outs?',
    answers: [
      '13 outs (wrap)',
      '17 outs (wrap + backdoors)',
      '20 outs',
      '8 outs'
    ],
    correctAnswer: '13 outs (wrap)',
    explanation: 'Any 9, T, 8, or 5 makes the straight = 13 outs. (4+3+3+3, accounting for board cards). This is a massive draw - favorite against most made hands!',
    points: 20,
  },

  // Position & Aggression
  {
    id: 'plo_11',
    category: 'plo_position',
    difficulty: 'easy',
    question: 'Position in PLO is:',
    answers: [
      'More important than NLH',
      'Less important than NLH',
      'Equally important',
      'Not important'
    ],
    correctAnswer: 'More important than NLH',
    explanation: 'Position is CRITICAL in PLO. Pots are bigger, decisions are harder, and drawing hands benefit massively from acting last. Play tighter from early position.',
    points: 10,
  },
  {
    id: 'plo_12',
    category: 'plo_position',
    difficulty: 'medium',
    question: 'From UTG in PLO cash game, you should raise:',
    answers: [
      '20-25% of hands',
      '10-15% of hands',
      '30% of hands',
      '5-10% of hands'
    ],
    correctAnswer: '10-15% of hands',
    explanation: 'PLO ranges are tighter than you think. Premium double-suited hands, AAxx, strong rundowns only. Avoid dangler hands and weak unsuited rundowns from EP.',
    points: 15,
  },

  // Blockers & GTO
  {
    id: 'plo_13',
    category: 'plo_advanced',
    difficulty: 'hard',
    question: 'Board runs out K♠Q♦J♥T♣2♠. You have A♥9♥8♦7♦. Correct play?',
    answers: [
      'Bet large - you have Ace-high straight',
      'Check - vulnerable to higher straight',
      'Small bet - for thin value',
      'Check/call - can\'t bet for value'
    ],
    correctAnswer: 'Check - vulnerable to higher straight',
    explanation: 'KQJT board = Broadway straight is common. Your Ace-high straight is often chopped or crushed. In PLO, straight over straight is common. Check and pot control.',
    points: 20,
  },
  {
    id: 'plo_14',
    category: 'plo_advanced',
    difficulty: 'hard',
    question: 'What does "having the idiot end" mean in PLO?',
    answers: [
      'Bottom straight on connected board',
      'Low flush on monotone board',
      'Weak full house on paired board',
      'All of the above'
    ],
    correctAnswer: 'Bottom straight on connected board',
    explanation: 'Having bottom straight is "idiot end". Example: You have 65 on 987. Any T makes better straight. Dangerous situation in PLO - often lose big pots.',
    points: 20,
  },

  // Bet Sizing
  {
    id: 'plo_15',
    category: 'plo_betting',
    difficulty: 'medium',
    question: 'Standard c-bet size in PLO single-raised pot:',
    answers: [
      '33% pot (like NLH)',
      '50-66% pot',
      '75-100% pot',
      '25% pot'
    ],
    correctAnswer: '50-66% pot',
    explanation: 'PLO c-bets are larger than NLH. 50-66% pot is standard because: draws are stronger, equity runs closer, and you need to charge draws appropriately.',
    points: 15,
  },
  {
    id: 'plo_16',
    category: 'plo_betting',
    difficulty: 'hard',
    question: 'You pot flop, pot turn, river bricks. SPR = 1. Best size?',
    answers: [
      'Overbet pot (150%+)',
      'Pot bet (100%)',
      'Check - too polarized',
      'Small bet (33%)'
    ],
    correctAnswer: 'Pot bet (100%)',
    explanation: 'With SPR ~1, just get it in. Overbetting is unnecessary and allows opponent to fold too much. Pot bet or shove remaining stack. Simple and effective.',
    points: 20,
  },

  // Tournament PLO
  {
    id: 'plo_17',
    category: 'plo_tournament',
    difficulty: 'medium',
    question: 'In PLO tournaments vs cash games, you should:',
    answers: [
      'Play tighter preflop',
      'Play looser preflop',
      'Same ranges',
      'Only play AAxx'
    ],
    correctAnswer: 'Play tighter preflop',
    explanation: 'Tournament PLO = tighter ranges. Can\'t reload, ICM matters, and you want to avoid big flips. Prioritize strong double-suited hands and premium rundowns.',
    points: 15,
  },
  {
    id: 'plo_18',
    category: 'plo_tournament',
    difficulty: 'hard',
    question: 'PLO MTT late stage (20bb), BTN opens pot. You have AAJ2ds in BB. Correct play?',
    answers: [
      '3-bet pot (commit 40% stack)',
      'Call and see flop',
      '4-bet shove',
      'Fold'
    ],
    correctAnswer: 'Call and see flop',
    explanation: 'AAxx is not as strong in PLO. With 20bb, 3-betting pot commits you to a flip. Calling keeps options open and allows you to flop sets or nut draws.',
    points: 20,
  },

  // Common Mistakes
  {
    id: 'plo_19',
    category: 'plo_mistakes',
    difficulty: 'easy',
    question: 'Biggest mistake new PLO players make:',
    answers: [
      'Overvaluing AAxx',
      'Undervaluing position',
      'Playing too many hands',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'New PLO players: overplay AAxx (it\'s only 65% vs random!), don\'t respect position enough, and play way too loose. Tighten up and value position!',
    points: 10,
  },
  {
    id: 'plo_20',
    category: 'plo_mistakes',
    difficulty: 'medium',
    question: 'You hold KKxx. Flop comes AQ7 rainbow. What\'s the problem?',
    answers: [
      'Reverse implied odds',
      'You rarely improve to best hand',
      'Opponent likely has Ace',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'KK on Ace-high board = disaster. You\'re beat by any Ace (common in ranges), rarely improve, and when you do hit a King, you make second pair or lose to two-pair.',
    points: 15,
  },

  // Additional Advanced PLO Questions
  {
    id: 'plo_21',
    category: 'plo_advanced',
    difficulty: 'hard',
    question: 'What is a "double-suited" hand advantage over single-suited?',
    answers: [
      '~2% equity edge',
      '~4-5% equity edge',
      '~8-10% equity edge',
      '~1% equity edge'
    ],
    correctAnswer: '~4-5% equity edge',
    explanation: 'Double-suited hands have approximately 4-5% more equity than single-suited equivalents. Two flush draws > one flush draw. Prioritize double-suited holdings.',
    points: 20,
  },
  {
    id: 'plo_22',
    category: 'plo_ranges',
    difficulty: 'medium',
    question: 'From the BTN, which rundown is weakest?',
    answers: [
      'JT98 double-suited',
      '8765 double-suited',
      'T987 single-suited',
      '9876 rainbow'
    ],
    correctAnswer: '9876 rainbow',
    explanation: 'Rainbow rundowns are significantly weaker. No flush potential, and 9876 makes second-best straights often. Always prefer double-suited holdings.',
    points: 15,
  },
  {
    id: 'plo_23',
    category: 'plo_postflop',
    difficulty: 'hard',
    question: 'Monotone flop (K♠9♠2♠), you have K♥K♦T♠8♦. What\'s your strategy?',
    answers: [
      'Bet for protection - you have top set',
      'Check/give up - flush likely out there',
      'Small bet/fold - for information',
      'Check/call - way behind vs flush'
    ],
    correctAnswer: 'Check/give up - flush likely out there',
    explanation: 'Monotone flops hit many ranges. Your set without the flush is often beat. Even if ahead now, you have only ~20% equity vs flush + redraw. Check and give up usually.',
    points: 20,
  },
  {
    id: 'plo_24',
    category: 'plo_equity',
    difficulty: 'medium',
    question: 'Flop equity realization in PLO is affected most by:',
    answers: [
      'Position',
      'Hand strength',
      'Stack depth',
      'All equally important'
    ],
    correctAnswer: 'Position',
    explanation: 'Position is king for equity realization. In position you can control pot size, see opponents\' actions, and realize equity efficiently. OOP equity realization is terrible.',
    points: 15,
  },
  {
    id: 'plo_25',
    category: 'plo_advanced',
    difficulty: 'hard',
    question: 'Against tight 3-bettor, you should 4-bet bluff with:',
    answers: [
      'Weak AAxx (blocks their AA)',
      'Strong rundowns JT98ds',
      'Small pairs with Broadway blockers',
      'None - don\'t bluff vs tight 3-bettors'
    ],
    correctAnswer: 'Weak AAxx (blocks their AA)',
    explanation: 'AA2x or AA3x rainbow makes excellent 4-bet bluffs. You block their AA premium hands, and when called you still have decent equity with aces. Smart blocker play.',
    points: 20,
  },
];

// PLO-specific concepts for deeper learning
export const PLO_CONCEPTS = {
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
    strategy: 'With big wraps, you can play very aggressively. You\'re often a favorite vs made hands.'
  },

  BLOCKERS: {
    title: 'Blockers in PLO',
    importance: 'Even more important than Hold\'em',
    examples: [
      'Holding A♠ on K♠Q♠5♠ board blocks nut flush',
      'Holding J or 9 on T-8-7 blocks many straight combos',
      'Holding AA blocks opponent\'s AAxx premium hands'
    ],
    application: 'Use blockers for bluffs, thin value bets, and reading opponent ranges'
  },

  COMMON_LEAKS: {
    overplaying_aces: 'AAxx is good but not invincible. Don\'t go broke with bare aces.',
    ignoring_position: 'Never limp from EP. Position is critical for seeing all actions.',
    chasing_draws: 'Not all draws are equal. Straight-to-lower-straight is dangerous.',
    playing_danglers: 'Hands like AAK2 rainbow are much weaker than they look.',
    overvaluing_two_pair: 'Two pair on wet boards is often behind or has terrible equity.'
  }
};

export default {
  PLO_QUESTIONS,
  PLO_CONCEPTS,
};
