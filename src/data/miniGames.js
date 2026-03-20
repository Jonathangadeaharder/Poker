/**
 * Mini-Games für interaktives Poker-Training
 * Inspiriert von Duolingo's bite-sized lessons
 *
 * Typen:
 * 1. Range Quiz (Multiple Choice)
 * 2. Speed Drills (schnelle Ja/Nein Entscheidungen)
 * 3. Push/Fold Trainer (Interaktive Szenarien)
 * 4. Hand Evaluation (Bewerte Hände)
 */

import { RFI_RANGES } from './pokerRanges';
import { PUSH_FOLD_CHARTS } from './pushFoldCharts';
import { COMMON_LEAKS } from './exploitativeStrategies';

/**
 * Quiz Generator - erstellt Multiple Choice Fragen
 */
export class QuizGenerator {
  static generateRangeQuiz(position, difficulty = 'easy') {
    const range = RFI_RANGES[position];
    const allPositions = Object.keys(RFI_RANGES);

    // Verschiedene Frage-Typen
    const questionTypes = [
      // Typ 1: Welche Range ist korrekt?
      {
        question: `Welche RFI-Range ist korrekt für ${range.position}?`,
        correct: range.percentage,
        wrong: [
          RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
          RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
          `${Math.floor(Math.random() * 30 + 10)}%`,
        ],
      },
      // Typ 2: Sollte Hand gespielt werden?
      {
        question: `Sollte KQo aus ${position} als RFI gespielt werden?`,
        correct: range.hands.includes('KQo') ? 'Ja' : 'Nein',
        wrong: range.hands.includes('KQo') ? ['Nein', 'Manchmal', 'Nur suited'] : ['Ja', 'Immer', 'Meist'],
      },
    ];

    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    // Shuffle wrong answers mit correct
    const allAnswers = [selectedType.correct, ...selectedType.wrong.slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    return {
      id: `range_${position}_${Date.now()}`,
      category: 'ranges',
      difficulty,
      question: selectedType.question,
      answers: allAnswers,
      correctAnswer: selectedType.correct,
      explanation: range.description,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
    };
  }

  static generatePushFoldQuiz(stackSize, difficulty = 'medium') {
    const chart = PUSH_FOLD_CHARTS[stackSize];
    const positions = Object.keys(chart.openShove);
    const selectedPos = positions[Math.floor(Math.random() * positions.length)];
    const posData = chart.openShove[selectedPos];

    const testHands = ['AA', '22', 'AKo', 'A2s', 'KQo', '76s', 'J9o', 'T8s'];
    const selectedHand = testHands[Math.floor(Math.random() * testHands.length)];

    const isInRange = Array.isArray(posData.hands)
      ? posData.hands.includes(selectedHand)
      : Math.random() > 0.5; // Fallback für string ranges

    return {
      id: `pushfold_${stackSize}_${selectedPos}_${Date.now()}`,
      category: 'push_fold',
      difficulty,
      question: `${selectedHand} vom ${selectedPos} mit ${chart.stackSize}?\nOpen-Shove oder Fold?`,
      answers: ['Shove', 'Fold', 'Min-Raise', 'Limp'].sort(() => Math.random() - 0.5),
      correctAnswer: isInRange ? 'Shove' : 'Fold',
      explanation: `${posData.position}: ${posData.range} Range\n${posData.description}`,
      points: 15,
      context: {
        stackSize: chart.stackSize,
        position: selectedPos,
        hand: selectedHand,
      },
    };
  }

  static generateExploitQuiz(difficulty = 'hard') {
    const leakKeys = Object.keys(COMMON_LEAKS);
    const selectedKey = leakKeys[Math.floor(Math.random() * leakKeys.length)];
    const leak = COMMON_LEAKS[selectedKey];

    return {
      id: `exploit_${selectedKey}_${Date.now()}`,
      category: 'exploits',
      difficulty,
      question: `Gegner zeigt folgendes Leak:\n"${leak.leak}"\n\nWelche Anpassung ist optimal?`,
      answers: [
        leak.exploit.action,
        'Spiele GTO',
        'Bluffe mehr',
        'Folde häufiger',
      ].sort(() => Math.random() - 0.5),
      correctAnswer: leak.exploit.action,
      explanation: `${leak.exploit.action}\n\n${leak.exploit.postflop || leak.exploit.range || ''}\n\nExpected: ${leak.exploit.expectedWinRate}`,
      points: 20,
      context: {
        leak: selectedKey,
        severity: leak.severity,
      },
    };
  }

  static generateMixedQuiz(count = 10, difficulty = 'mixed') {
    const quiz = [];
    const types = ['range', 'pushfold', 'exploit'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const diff = difficulty === 'mixed'
        ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
        : difficulty;

      let question;
      switch (type) {
        case 'range':
          const positions = Object.keys(RFI_RANGES);
          const pos = positions[Math.floor(Math.random() * positions.length)];
          question = this.generateRangeQuiz(pos, diff);
          break;
        case 'pushfold':
          const stacks = Object.keys(PUSH_FOLD_CHARTS);
          const stack = stacks[Math.floor(Math.random() * stacks.length)];
          question = this.generatePushFoldQuiz(stack, diff);
          break;
        case 'exploit':
          question = this.generateExploitQuiz(diff);
          break;
      }

      quiz.push(question);
    }

    return quiz;
  }
}

/**
 * Speed Drill Generator - schnelle Ja/Nein Entscheidungen
 */
export class SpeedDrillGenerator {
  static generateHandDecision(position, timeLimit = 5) {
    const range = RFI_RANGES[position];
    const allHands = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo',
                      'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo',
                      'QJs', 'QJo', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s',
                      'A5s', 'A4s', 'A3s', 'A2s'];

    const testHand = allHands[Math.floor(Math.random() * allHands.length)];
    const shouldRaise = range.hands.includes(testHand);

    return {
      id: `speed_${position}_${testHand}_${Date.now()}`,
      hand: testHand,
      position: position,
      question: `${testHand} vom ${position}?\nRaise oder Fold?`,
      correctAnswer: shouldRaise ? 'RAISE' : 'FOLD',
      timeLimit,
      points: 5,
      speedBonus: 10, // Extra points wenn in <3s beantwortet
    };
  }

  static generateSpeedDrill(position, count = 20, timeLimit = 5) {
    const drills = [];
    for (let i = 0; i < count; i++) {
      drills.push(this.generateHandDecision(position, timeLimit));
    }
    return drills;
  }
}

/**
 * Interactive Scenario - komplexere Entscheidungsbäume
 */
export class ScenarioGenerator {
  static generateLimperScenario() {
    const scenarios = [
      {
        id: 'limper_1',
        title: 'Limper am Tisch',
        description: '2 Spieler limpen vor dir (2bb + 2bb)',
        position: 'CO',
        yourHand: 'A♠9♠',
        potSize: '7bb (2bb + 2bb + 1bb SB + 2bb BB)',
        question: 'Was machst du?',
        options: [
          {
            action: 'ISO-Raise auf 7bb',
            correct: true,
            feedback: '✅ Perfekt! 3x (3bb) + 2x Limper (4bb) = 7bb\nLineare Range, ABC Postflop.',
            xp: 25,
          },
          {
            action: 'Over-Limp (calle 2bb)',
            correct: false,
            feedback: '❌ Zu passiv. Du verschenkst Fold Equity.\nOver-limping ist nur profitabel mit kleinen Pairs in Position.',
            xp: 0,
          },
          {
            action: 'Fold',
            correct: false,
            feedback: '❌ Viel zu tight! A9s ist eine starke ISO-Hand.\nVerpasse einen +EV spot.',
            xp: 0,
          },
          {
            action: 'Min-Raise auf 4bb',
            correct: false,
            feedback: '❌ Sizing zu klein. Gibst Limpern zu gute Odds.\nKorrekt: 3x + 1x pro Limper.',
            xp: 5,
          },
        ],
      },
      {
        id: 'calling_station_1',
        title: 'Calling Station',
        description: 'Villain callt 80% der C-Bets, foldet fast nie',
        flop: 'K♥7♣2♦',
        yourHand: 'A♠Q♠',
        action: 'Du raised Preflop, Villain callt. Pot: 20bb',
        question: 'Was machst du auf diesem Flop?',
        options: [
          {
            action: 'Check (aufgeben)',
            correct: true,
            feedback: '✅ Richtig! Du hast Ace-High (nichts).\nGegen Calling Station: STOP BLUFFS.\nCheck/Fold ist hier korrekt.',
            xp: 20,
          },
          {
            action: 'C-Bet 7bb (33% pot)',
            correct: false,
            feedback: '❌ Bluff gegen Calling Station ist -EV.\nEr callt mit jedem Pair, manchmal auch Ace-High.\nBurn Chips.',
            xp: 0,
          },
          {
            action: 'C-Bet 15bb (75% pot)',
            correct: false,
            feedback: '❌ SEHR schlecht. Großer Bluff gegen jemanden der nie foldet?\nReine Chip-Spende.',
            xp: 0,
          },
        ],
      },
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  static generateMultiStepScenario() {
    // Komplexeres Szenario mit mehreren Entscheidungen
    return {
      id: 'multi_1',
      title: 'Tournament Hand (20bb)',
      steps: [
        {
          step: 1,
          situation: 'UTG (20bb) opens to 2.5bb',
          yourPosition: 'BTN (20bb)',
          yourHand: 'A♥J♥',
          question: 'Preflop Action?',
          options: ['Fold', '3-Bet Shove (20bb)', 'Call'],
          correctAnswer: '3-Bet Shove (20bb)',
          explanation: 'Bei 20bb ist 3-Bet Shove > Call.\nAJs ist zu stark zum folden, aber ein Call kreiert awkward SPR.',
        },
      ],
    };
  }
}

/**
 * Daily Challenge Generator
 */
export class DailyChallengeGenerator {
  static generateDailyChallenge(date = new Date()) {
    const dayOfMonth = date.getDate();
    const challengeTypes = [
      {
        type: 'perfect_quiz',
        title: '🎯 Perfektionist',
        description: 'Beantworte 10 Fragen perfekt (100%)',
        goal: 10,
        reward: { xp: 100, badge: 'Daily Perfectionist' },
      },
      {
        type: 'speed_master',
        title: '⚡ Speedster',
        description: 'Beantworte 20 Fragen in unter 60 Sekunden',
        goal: { questions: 20, timeLimit: 60 },
        reward: { xp: 150, badge: 'Speed Demon' },
      },
      {
        type: 'range_master',
        title: '📊 Range-Meister',
        description: 'Studiere alle 6 Positionen heute',
        goal: 6,
        reward: { xp: 80, badge: 'Range Scholar' },
      },
      {
        type: 'exploit_hunter',
        title: '🎯 Leak-Jäger',
        description: 'Lerne über alle 5 Exploits',
        goal: 5,
        reward: { xp: 120, badge: 'Exploit Expert' },
      },
    ];

    // Rotiere Challenges basierend auf Tag
    return challengeTypes[dayOfMonth % challengeTypes.length];
  }
}

export default {
  QuizGenerator,
  SpeedDrillGenerator,
  ScenarioGenerator,
  DailyChallengeGenerator,
};
