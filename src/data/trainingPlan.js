/**
 * 40-Stunden Intensiv-Trainingsplan
 * Pfad A: 6-Max Cash Game Spezialist
 * Pfad B: MTT Spezialist
 */

export const TRAINING_PATHS = {
  CASH_GAME: {
    id: 'cash',
    name: 'Pfad A: 6-Max Cash Game Spezialist',
    subtitle: '100bb Deep Stack',
    difficulty: 'Schwerer, breiteres Skill-Set',
    target: '2-5bb/100 Win-Rate bei NL5/NL10',
    description: 'Komplexeste Form von NLHE. Robusteste Grundlage für zukünftiges Lernen.',
    color: '#2d5f3f',
  },
  MTT: {
    id: 'mtt',
    name: 'Pfad B: MTT Spezialist',
    subtitle: 'Variable Stack-Tiefen',
    difficulty: 'Einfacher, schnellere Lernkurve',
    target: 'Profitabel in $1-$5 Turnieren',
    description: 'Fokus auf Stack-Tiefenstrategie und Push/Fold-Meisterschaft.',
    color: '#c41e3a',
  },
};

export const TRAINING_SCHEDULE = {
  CASH_GAME: [
    {
      day: 1,
      title: 'Tag 1-2: Grundlagen',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'GTO-Trainer: RFI Ranges',
          description: 'Open-Raising-Ranges aus allen 6 Positionen (UTG bis BB)',
          objectives: [
            'UTG (15%) auswendig lernen',
            'MP (18%) auswendig lernen',
            'CO (25%) auswendig lernen',
            'BTN (45%) auswendig lernen',
            'SB/BB Ranges verstehen',
          ],
          tools: 'GTO Wizard / DTO Poker',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Video: Postflop-Grundlagen',
          description: 'Range-Vorteil & C-Betting (HU vs MW)',
          objectives: [
            'Was ist Range-Vorteil?',
            'Wann hat PFR Range-Vorteil?',
            'HU C-Bet: 80% @ 33% pot',
            'MW C-Bet: 40% @ 50% pot',
          ],
          resources: [
            'Run It Once (Free)',
            'PokerCoaching.com',
            'YouTube: Poker Strategy Channels',
          ],
          completed: false,
        },
        {
          hours: 2,
          type: 'play',
          title: 'Live Play: NL5 6-Max',
          description: '2 Tische, 200-300 Hände',
          objectives: [
            'Wende RFI Ranges konsequent an',
            'Markiere schwierige Spots',
            'Notiere alle Limper-Spots',
          ],
          stakes: 'NL5 (2c/5c)',
          tables: 2,
          completed: false,
        },
        {
          hours: 1.5,
          type: 'review',
          title: 'Hand Review',
          description: 'Analysiere alle Hände im GTO-Tool',
          objectives: [
            'Upload Hände zu GTO Wizard',
            'Identifiziere alle RFI-Fehler',
            'Notiere EV-Verluste',
            'Erstelle Lernkarten für Fehler',
          ],
          completed: false,
        },
      ],
    },
    {
      day: 2,
      title: 'Tag 1-2: Grundlagen (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'GTO-Trainer: RFI Ranges (Wiederholung)',
          description: 'Vertiefung und Schnelligkeitstraining',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Video: Board-Texturen',
          description: 'Dry vs Wet Boards, Equity-Verteilung',
          completed: false,
        },
        {
          hours: 2,
          type: 'play',
          title: 'Live Play: NL5 6-Max',
          description: '2 Tische, Fokus auf C-Bet-Entscheidungen',
          completed: false,
        },
        {
          hours: 1.5,
          type: 'review',
          title: 'Hand Review',
          description: 'Fokus: C-Bet Spots (HU vs MW)',
          completed: false,
        },
      ],
    },
    {
      day: 3,
      title: 'Tag 3-4: Kernstrategie - Exploits',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'GTO-Trainer: 3-Bet Defense',
          description: 'Wann callen/folden vs 3-Bet',
          objectives: [
            'Calling Range vs 3-Bet',
            '4-Bet Range (value)',
            'Fold Range',
            'Position-Adjustments',
          ],
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Exploitative Modul 1: Limper-Zerstörung',
          description: 'Das #1 Micro-Stakes Leak',
          objectives: [
            'Isolation Raise Sizing (4x-7x)',
            'Linear Range Construction',
            'Postflop ABC vs Limper',
            'Expected Win-Rate: +15-25bb/100',
          ],
          completed: false,
        },
        {
          hours: 2,
          type: 'play',
          title: 'Live Play: NL5 6-Max',
          description: 'JAGEN von Limper-Spots',
          objectives: [
            'Jeder Limper = ISO-Raise',
            'Tracke Win-Rate aus Limper-Pots',
            'Notiere Postflop-Ergebnisse',
          ],
          completed: false,
        },
        {
          hours: 1.5,
          type: 'review',
          title: 'Hand Review',
          description: 'Fokus: 3-Bet Defense & Limper-Exploits',
          objectives: [
            'Wurden alle Limper isoliert?',
            'War Sizing korrekt? (4x-7x)',
            'Postflop Bluff-Frequency vs Limper?',
            'Wurden Calling Stations erkannt?',
          ],
          completed: false,
        },
      ],
    },
    {
      day: 4,
      title: 'Tag 3-4: Kernstrategie (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Wiederholung: 3-Bet Defense + RFI',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Exploitative Modul 2: Calling Stations & Fit-or-Fold',
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'Live Play mit aktivem Exploit-Tracking',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Hand Review: Exploit-Anwendung',
          completed: false,
        },
      ],
    },
    {
      day: 5,
      title: 'Tag 5-6: Fortgeschritten',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: '3-Bet Ranges (Linear vs Polar)',
          description: 'Wann merged 3-betten, wann polarisiert',
          objectives: [
            'Linear Range: vs Passive (no 4-bet)',
            'Polar Range: vs Aggressive (4-bet häufig)',
            'Blocker-Konzept: A5s, K5s',
          ],
          completed: false,
        },
        {
          hours: 1,
          type: 'theory',
          title: 'Theorie: Blocker & Implied Odds',
          description: 'Das "Warum" hinter Advanced Concepts',
          objectives: [
            'Blocker-Mathematik (A5s blockt AA/AK)',
            '10x Rule für Set Mining',
            'Range-Morphologie verstehen',
          ],
          completed: false,
        },
        {
          hours: 2,
          type: 'play',
          title: 'Live Play: NL5 6-Max',
          description: 'Integration aller Konzepte',
          completed: false,
        },
        {
          hours: 1.5,
          type: 'review',
          title: 'Deep Review',
          description: 'Wurden Exploits korrekt angewendet?',
          objectives: [
            'Exploit-Matrix Check (alle 5 Leaks)',
            'Set Mining: 10x Rule befolgt?',
            'Linear vs Polar 3-Bet korrekt?',
          ],
          completed: false,
        },
      ],
    },
    {
      day: 6,
      title: 'Tag 5-6: Fortgeschritten (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Schwachstellen-Training',
          description: 'Fokus auf schwächste Bereiche der Woche',
          completed: false,
        },
        {
          hours: 1,
          type: 'theory',
          title: 'Range vs Range Analysis',
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'Live Play mit Meta-Awareness',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Wöchentliche Statistik-Analyse',
          completed: false,
        },
      ],
    },
    {
      day: 7,
      title: 'Tag 7: Integration & Assessment',
      totalHours: 7.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Final Drill: Schwächste Spots',
          description: 'Identifiziere und trainiere Top 3 Leaks',
          completed: false,
        },
        {
          hours: 4,
          type: 'play',
          title: 'Lange Live-Session',
          description: '4 Tische NL5, 600+ Hände',
          objectives: [
            'Konsequente RFI-Anwendung',
            'Alle Exploits aktiv nutzen',
            'Mental Game fokussiert bleiben',
            'Tracke Win-Rate live',
          ],
          completed: false,
        },
        {
          hours: 1.5,
          type: 'assessment',
          title: 'Wochenanalyse & Woche-2-Plan',
          description: 'Identifiziere 5 teuerste Fehler',
          objectives: [
            'Review: Gesamt Win-Rate',
            'EV-Verlust pro Kategorie',
            'Top 5 Leaks für Woche 2',
            'Erstelle fokussierten Lernplan',
          ],
          completed: false,
        },
      ],
    },
  ],

  MTT: [
    {
      day: 1,
      title: 'Tag 1-2: Grundlagen - Deep Stack',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'RFI Ranges (100bb, 60bb, 40bb)',
          description: 'Multi-Stack RFI Training',
          objectives: [
            '100bb: Gleich wie Cash Game',
            '60bb: Leicht tighter',
            '40bb: Deutlich tighter',
          ],
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Das Stack-Tiefen Triumvirat',
          description: 'Deep (75bb+) / Medium (30-60bb) / Short (<25bb)',
          objectives: [
            '75bb+: Cash-Game-Style',
            '30-60bb: Re-Steal & 3-Bet Shove Phase',
            '<25bb: Pure Push/Fold',
          ],
          completed: false,
        },
        {
          hours: 2,
          type: 'play',
          title: 'Live Play: $1-$3 MTTs',
          description: '4 Tische, Fokus auf Early Stages',
          completed: false,
        },
        {
          hours: 1.5,
          type: 'review',
          title: 'Hand Review',
          description: 'RFI-Fehler bei verschiedenen Stacks',
          completed: false,
        },
      ],
    },
    {
      day: 2,
      title: 'Tag 1-2: Grundlagen (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'RFI Deep Dive + Ante-Adjustments',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'MTT-spezifische Konzepte',
          description: 'Antes, Bubble, Pay Jumps',
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'Live MTT Play',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Review mit Stack-Focus',
          completed: false,
        },
      ],
    },
    {
      day: 3,
      title: 'Tag 3-4: Push/Fold Meisterschaft (20bb)',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Push/Fold Charts (20bb)',
          description: 'Open-Shove & Re-Shove Ranges',
          objectives: [
            'BTN 20bb Open-Shove: 52%',
            'CO 20bb Open-Shove: 38%',
            'MP 20bb Open-Shove: 22%',
            'UTG 20bb Open-Shove: 15%',
            'Re-Shove vs BTN: 28%',
            'Re-Shove vs CO: 20%',
          ],
          tools: 'DTO Poker / ICMizer',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Medium Stack Strategy (30-60bb)',
          description: 'Re-Steal & 3-Bet Shoving',
          objectives: [
            'Wann 3-Bet Shove statt Call?',
            'Re-Steal vs Late Position Opens',
            'Stack-preservation vs Aggression',
          ],
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'MTT Play - Short Stack Focus',
          description: 'Spiele bis <25bb, dann Late-Reg neue Turniere',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Push/Fold Error Analysis',
          description: 'Jeder <25bb Fehler ist kritisch',
          completed: false,
        },
      ],
    },
    {
      day: 4,
      title: 'Tag 3-4: Push/Fold (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Push/Fold Speed Training',
          description: 'Schnelle Entscheidungsfindung',
          completed: false,
        },
        {
          hours: 1,
          type: 'video',
          title: 'Common Short-Stack Mistakes',
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'MTT Grind',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Deep Review aller <30bb Spots',
          completed: false,
        },
      ],
    },
    {
      day: 5,
      title: 'Tag 5-6: Ultra-Short Stacks + ICM',
      totalHours: 13,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Push/Fold (15bb & 10bb)',
          description: 'Extreme Short-Stack Situations',
          objectives: [
            'BTN 15bb: 58%',
            'BTN 10bb: 68%',
            'Defense Ranges extrem weit',
          ],
          completed: false,
        },
        {
          hours: 1,
          type: 'theory',
          title: 'ICM Grundlagen',
          description: 'Warum Folden +EV sein kann',
          objectives: [
            'ICM Basics: Non-linear chip value',
            'Bubble Play: Fold Equity maximieren',
            'Final Table ICM',
            'Wann zurück zu Chip-EV?',
          ],
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'MTT Play - ICM Awareness',
          description: 'Identifiziere Bubble & Final Table Spots',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'ICM Spot Identification',
          completed: false,
        },
      ],
    },
    {
      day: 6,
      title: 'Tag 5-6: Fortgeschritten (Fortsetzung)',
      totalHours: 6.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Schwächste Push/Fold Spots',
          completed: false,
        },
        {
          hours: 1,
          type: 'theory',
          title: 'Advanced ICM Situations',
          completed: false,
        },
        {
          hours: 2.5,
          type: 'play',
          title: 'MTT Grind',
          completed: false,
        },
        {
          hours: 1,
          type: 'review',
          title: 'Wöchentliche ROI-Analyse',
          completed: false,
        },
      ],
    },
    {
      day: 7,
      title: 'Tag 7: Integration & Tournament Play',
      totalHours: 7.5,
      modules: [
        {
          hours: 2,
          type: 'drill',
          title: 'Final Push/Fold Drilling',
          description: 'Random Stack Sizes (8-25bb)',
          completed: false,
        },
        {
          hours: 4,
          type: 'play',
          title: 'Tournament Marathon',
          description: '4-6 Turniere simultan',
          objectives: [
            'Konsequente Stack-Strategie',
            'ICM-Awareness bei Bubble',
            'Push/Fold perfekt ausführen',
            'Deep Run anstreben',
          ],
          completed: false,
        },
        {
          hours: 1.5,
          type: 'assessment',
          title: 'Wochenanalyse',
          description: 'ROI, ITM%, Average Finish',
          objectives: [
            'Gesamt-ROI berechnen',
            'ITM% (Ziel: >15%)',
            'Bubble-Performance',
            'Top 5 Fehler für Woche 2',
          ],
          completed: false,
        },
      ],
    },
  ],
};

// Tools & Resources
export const RECOMMENDED_TOOLS = {
  GTO_TRAINERS: [
    {
      name: 'GTO Wizard',
      url: 'https://gtowizard.com',
      price: '$29-49/mo',
      best_for: 'Cash Game & MTT, umfassendste Lösung',
      features: ['Hand Trainer', 'Range Explorer', 'Hand History Analysis', 'Quiz Mode'],
    },
    {
      name: 'DTO Poker',
      url: 'https://dtopoker.com',
      price: '$25-40/mo',
      best_for: 'Turniere & Push/Fold',
      features: ['MTT Solver', 'Push/Fold Trainer', 'ICM Calculator'],
    },
    {
      name: 'PokerCoaching',
      url: 'https://pokercoaching.com',
      price: '$49/mo',
      best_for: 'Videos + Training',
      features: ['Video Library', 'Hand Reviews', 'Community'],
    },
  ],
  TRACKING: [
    {
      name: 'PokerTracker 4',
      type: 'HUD & Tracker',
      price: '$99 (lifetime)',
      features: ['Hand History Import', 'Stats', 'Leak Finder'],
    },
    {
      name: 'Hold\'em Manager 3',
      type: 'HUD & Tracker',
      price: '$60-100',
      features: ['Real-time HUD', 'Reports', 'Hand Replayer'],
    },
  ],
};

export default {
  TRAINING_PATHS,
  TRAINING_SCHEDULE,
  RECOMMENDED_TOOLS,
};
