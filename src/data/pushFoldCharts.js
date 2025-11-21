/**
 * Push/Fold Charts für MTT Short Stack Play
 * Basierend auf Nash Equilibrium und ICM-neutralen Spots
 */

// Push/Fold für verschiedene Stack-Größen
export const PUSH_FOLD_CHARTS = {
  // 20BB Stack
  TWENTY_BB: {
    stackSize: '20bb',
    scenario: 'Early/Mid Tournament',
    openShove: {
      BTN: {
        position: 'Button',
        range: '52%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9s', 'A9o', 'A8s', 'A8o', 'A7s', 'A7o', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
          'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo', 'K9s', 'K9o', 'K8s', 'K7s',
          'QJs', 'QJo', 'QTs', 'QTo', 'Q9s', 'Q8s',
          'JTs', 'JTo', 'J9s', 'J8s',
          'T9s', 'T8s', '98s', '97s', '87s', '76s',
        ],
        description: 'Button vs SB+BB: Sehr weite Range. Maximaler Druck.',
      },
      CO: {
        position: 'Cutoff',
        range: '38%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
          'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo', 'K9s', 'K8s',
          'QJs', 'QJo', 'QTs', 'Q9s',
          'JTs', 'J9s', 'T9s', '98s', '87s',
        ],
        description: 'CO: Breite Range, aber tighter als BTN.',
      },
      MP: {
        position: 'Middle Position',
        range: '22%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
          'KQs', 'KJs', 'KTs',
          'QJs', 'JTs',
        ],
        description: 'MP: Deutlich tighter. Viele Spieler hinter uns.',
      },
      UTG: {
        position: 'Under the Gun',
        range: '15%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'ATs',
          'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
          'KQs',
        ],
        description: 'UTG: Sehr tight. Premium hands + suited aces.',
      },
    },
    reShove: {
      vsUTG: {
        scenario: 'Hero in BB vs UTG Open-Shove',
        range: '12%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT',
          'AKs', 'AKo', 'AQs',
        ],
        description: 'Sehr tight vs UTG shove. Nur premium hands.',
      },
      vsCO: {
        scenario: 'Hero in BB vs CO Open-Shove',
        range: '20%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs',
          'KQs',
        ],
        description: 'Etwas weiter vs CO. Medium pairs werden profitabel.',
      },
      vsBTN: {
        scenario: 'Hero in BB vs BTN Open-Shove',
        range: '28%',
        hands: [
          'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
          'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9s',
          'KQs', 'KJs', 'KTs',
          'QJs',
        ],
        description: 'Weite Defense vs BTN. Er shoved sehr breit.',
      },
    },
  },

  // 15BB Stack
  FIFTEEN_BB: {
    stackSize: '15bb',
    scenario: 'Mid/Late Tournament - Kritische Phase',
    openShove: {
      BTN: {
        position: 'Button',
        range: '58%',
        hands: [
          'Alle Pairs',
          'Alle Ax',
          'Alle suited Kx',
          'Alle suited Qx (Q2s+)',
          'Alle suited connectors',
          'K9o+', 'Q9o+', 'J9o+', 'T8o+',
        ],
        description: 'Fast 60% Range vom Button. Extreme Aggression.',
      },
      CO: {
        position: 'Cutoff',
        range: '44%',
        hands: [
          'Alle Pairs',
          'Alle Ax',
          'K7s+', 'K9o+',
          'Q8s+', 'QTo+',
          'J8s+', 'JTo',
          'T8s+', '98s', '87s', '76s',
        ],
        description: 'CO bei 15bb: Sehr aggressiv, aber nicht ganz so weit wie BTN.',
      },
      MP: {
        position: 'Middle Position',
        range: '28%',
        hands: [
          'Pairs: 55+',
          'Ax: A2s+, A7o+',
          'Broadways: KQs, KJs, KTs, KQo',
          'QJs, JTs',
        ],
        description: 'MP: Moderate Range. Balance zwischen Aggression und Vorsicht.',
      },
    },
    reShove: {
      vsBTN: {
        scenario: 'Hero in SB vs BTN Open-Shove',
        range: '35%',
        hands: [
          'Alle Pairs',
          'Ax: A2+',
          'Kx: K8s+, KTo+',
          'Qx: QTs+, QJo',
          'JTs',
        ],
        description: 'SB vs BTN bei 15bb: Call sehr weit, da BTN extrem breit shoved.',
      },
    },
  },

  // 10BB Stack
  TEN_BB: {
    stackSize: '10bb',
    scenario: 'Late Tournament - Push/Fold Only',
    openShove: {
      BTN: {
        position: 'Button',
        range: '68%',
        hands: ['ALLE Paare', 'ALLE Ax', 'Fast alle Kx', 'Fast alle suited hands', 'Viele offsuit connectors'],
        description: 'Bei 10bb vom Button: Push almost any two cards.',
      },
      CO: {
        position: 'Cutoff',
        range: '52%',
        hands: ['Alle Paare', 'Alle Ax', 'K2s+, K8o+', 'Q6s+, QTo+', 'J8s+', 'T8s+', '98s'],
        description: 'CO: Über 50% Range.',
      },
      MP: {
        position: 'Middle Position',
        range: '35%',
        hands: ['Pairs: 22+', 'Ax: Alle', 'Kx: K9s+, KJo+', 'QJs+', 'JTs'],
        description: 'MP: Immer noch breit, aber selektiver.',
      },
    },
    reShove: {
      vsBTN: {
        scenario: 'Hero in BB vs BTN Shove',
        range: '45%',
        hands: ['Fast alle Paare', 'Ax: A2+', 'Kx: K6s+, K9o+', 'Qx: Q9s+, QTo+', 'Broadway: JTs+'],
        description: 'BB vs BTN bei 10bb: Call extrem weit. BTN shoved 68%.',
      },
    },
  },
};

// ICM Adjustments (Vereinfacht)
export const ICM_GUIDELINES = {
  BUBBLE: {
    scenario: 'Bubble Play (kurz vor dem Geld)',
    adjustment: 'TIGHT',
    description: 'Folden hat positiven EV. Spiele 30-40% tighter als normal.',
    keyPoints: [
      'Medium Stacks: Maximiere Fold Equity gegen Short Stacks',
      'Short Stacks: Push weiter als normal (andere folden zu viel)',
      'Big Stacks: Setze kleine Stacks unter Druck',
    ],
  },
  FINAL_TABLE: {
    scenario: 'Final Table (nahe den großen Prizes)',
    adjustment: 'SEHR TIGHT (außer Big Stack)',
    description: 'Jeder Platz = großer Pay Jump. Überleben ist wertvoll.',
    keyPoints: [
      'Short Stack als Medium Stack: Warte auf andere Eliminations',
      'Big Stack: Aggressive gegen Medium Stacks',
      '3-4 Spieler übrig: Zurück zu Chip-EV Strategie',
    ],
  },
};

export default {
  PUSH_FOLD_CHARTS,
  ICM_GUIDELINES,
};
