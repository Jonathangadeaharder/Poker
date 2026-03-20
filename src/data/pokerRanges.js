/**
 * GTO-basierte Preflop Ranges für 6-Max Cash Games (100bb)
 * Basierend auf KISS-Ranges (Smart Poker Study)
 */

// Position Definitionen
export const POSITIONS = {
  UTG: 'Under The Gun',
  MP: 'Middle Position',
  CO: 'Cutoff',
  BTN: 'Button',
  SB: 'Small Blind',
  BB: 'Big Blind',
};

// RFI (Raise First In) Ranges für 6-Max Cash Game
export const RFI_RANGES = {
  UTG: {
    position: 'UTG',
    percentage: '15%',
    hands: [
      // Premium Pairs
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
      // Premium Broadway
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo',
      // Strong Suited Connectors
      'KQs', 'KJs', 'KTs',
      'QJs', 'JTs',
      // Medium Pairs
      '88', '77',
      // Suited Aces
      'A5s', 'A4s', 'A3s', 'A2s',
    ],
    description: 'Sehr tight aus früher Position. Premium hands + suited aces für implied odds.',
  },
  MP: {
    position: 'MP',
    percentage: '18%',
    hands: [
      // Alle UTG Hände +
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs',
      'KQs', 'KQo', 'KJs', 'KTs',
      'QJs', 'QTs', 'JTs', 'T9s',
      'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    ],
    description: 'Erweiterte Range. Mehr suited connectors und medium pairs.',
  },
  CO: {
    position: 'CO',
    percentage: '25%',
    hands: [
      // Premium
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44',
      // Broadway
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo',
      'KQs', 'KQo', 'KJs', 'KJo', 'KTs',
      'QJs', 'QJo', 'QTs', 'JTs', 'J9s', 'T9s', '98s',
      // Suited Aces
      'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
      // Suited Kings
      'K9s',
    ],
    description: 'Late position - deutlich mehr hands. Suited connectors werden profitabel.',
  },
  BTN: {
    position: 'BTN',
    percentage: '45%',
    hands: [
      // Fast alle Paare
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
      // Alle Broadway Combos
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9o', 'A8o',
      'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo', 'K9s',
      'QJs', 'QJo', 'QTs', 'QTo', 'Q9s',
      'JTs', 'JTo', 'J9s', 'J8s',
      'T9s', 'T8s', '98s', '97s', '87s', '76s', '65s',
      // Suited Aces
      'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
      // Suited Kings & Queens
      'K9s', 'K8s', 'K7s', 'Q9s', 'Q8s',
    ],
    description: 'Button = beste Position. Fast 50% Range. Maximale Aggression.',
  },
  SB: {
    position: 'SB',
    percentage: '35%',
    hands: [
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9s', 'A8s',
      'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo', 'K9s',
      'QJs', 'QJo', 'QTs', 'Q9s',
      'JTs', 'J9s', 'T9s', '98s', '87s', '76s',
      'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    ],
    description: 'SB vs BB heads-up. Weite Range, aber vorsichtig (out of position postflop).',
  },
};

// 3-Bet Ranges (gegen Late Position Opens)
export const THREE_BET_RANGES = {
  LINEAR: {
    type: 'Linear/Merged',
    usage: 'Gegen passive Spieler (selten 4-bet)',
    hands: [
      // Value Hände
      'AA', 'KK', 'QQ', 'JJ', 'TT',
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs',
      'KQs',
    ],
    description: 'Keine Bluffs. Nur Value gegen Spieler die zu viel callen und nie 4-betten.',
  },
  POLAR: {
    type: 'Polarized',
    usage: 'Gegen aggressive Spieler (4-bet häufig)',
    valueHands: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    bluffHands: ['A5s', 'A4s', 'A3s', 'A2s', 'K5s', 'Q5s'],
    description: 'GTO-Strategie: Nuts + Blocker-Bluffs. A5s blockt AA/AK des Gegners.',
  },
};

// Cold Calling Ranges (vs. Raises)
export const COLD_CALL_RANGES = {
  IP: {
    type: 'In Position (CO/BTN)',
    hands: [
      // Medium Pairs (Set Mining mit 10x Rule)
      '99', '88', '77', '66', '55', '44', '33', '22',
      // Suited Connectors & Broadway
      'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s',
      // Offsuit Broadway (selektiv)
      'AJo', 'KQo',
    ],
    description: '10x Rule für Pairs. Suited connectors für implied odds in position.',
  },
  OOP: {
    type: 'Out of Position (Blinds)',
    hands: [
      // Nur sehr starke Hände - Rest wird 3-bet oder gefoldet
      '99', '88', '77',
      'AJs', 'KQs', 'QJs', 'JTs',
    ],
    description: 'Sehr tight aus den Blinds. Meiste Hände entweder 3-bet oder fold.',
  },
};

export default {
  POSITIONS,
  RFI_RANGES,
  THREE_BET_RANGES,
  COLD_CALL_RANGES,
};
