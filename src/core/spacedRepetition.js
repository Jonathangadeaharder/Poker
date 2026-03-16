/**
 * Spaced Repetition Engine
 * Basierend auf SM-2 Algorithm (SuperMemo 2)
 *
 * Forschung zeigt: 90% Retention ist optimal für langfristiges Lernen
 * SM-2 ist der Gold-Standard für SRS (Spaced Repetition Systems)
 */

/**
 * SM-2 Algorithm Implementation
 *
 * Drei Haupt-Properties:
 * - n: Repetition number (wie oft korrekt wiederholt)
 * - EF: Easiness Factor (2.5 start, 1.3 minimum)
 * - I: Inter-repetition interval (in Tagen)
 */

export const DIFFICULTY_RATINGS = {
  AGAIN: 0,    // Komplett falsch - Karte zurück in Learning Queue
  HARD: 1,     // Schwierig - kleineres Interval
  GOOD: 2,     // Gut - normales Interval
  EASY: 3,     // Einfach - größeres Interval
};

export class Card {
  constructor(id, front, back, category, tags = []) {
    this.id = id;
    this.front = front;        // Frage (z.B. "UTG RFI Range bei 100bb?")
    this.back = back;          // Antwort (z.B. "15%: AA-77, AK-AJ, KQs-KTs...")
    this.category = category;  // 'ranges', 'push_fold', 'exploits', etc.
    this.tags = tags;

    // SM-2 Properties
    this.n = 0;                // Repetition count
    this.ef = 2.5;             // Easiness Factor
    this.interval = 0;         // Days until next review
    this.nextReview = new Date(); // Next review date
    this.lastReviewed = null;

    // Stats
    this.totalReviews = 0;
    this.correctReviews = 0;
    this.streakCorrect = 0;
    this.created = new Date();
  }

  /**
   * SM-2 Algorithm Core
   * @param {number} quality - 0 (Again) to 3 (Easy)
   * @returns {Object} - Updated card properties
   */
  review(quality) {
    this.totalReviews++;
    this.lastReviewed = new Date();

    // Calculate new EF
    // Formula: EF' = EF + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02))
    // Simplified for our 0-3 scale:
    const efDelta = 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02);
    this.ef = Math.max(1.3, this.ef + efDelta); // Minimum EF = 1.3 (Anki standard)

    // Update repetition count and interval
    if (quality < DIFFICULTY_RATINGS.GOOD) {
      // Failed - reset to learning phase
      this.n = 0;
      this.interval = 0;
      this.streakCorrect = 0;
      this.nextReview = new Date(); // Review again immediately
    } else {
      // Passed
      this.correctReviews++;
      this.streakCorrect++;

      if (this.n === 0) {
        this.interval = 1; // First successful review: 1 day
      } else if (this.n === 1) {
        this.interval = 6; // Second successful review: 6 days
      } else {
        this.interval = Math.round(this.interval * this.ef);
      }

      this.n++;

      // Calculate next review date
      const next = new Date();
      next.setDate(next.getDate() + this.interval);
      this.nextReview = next;
    }

    return {
      n: this.n,
      ef: this.ef,
      interval: this.interval,
      nextReview: this.nextReview,
      success: quality >= DIFFICULTY_RATINGS.GOOD,
    };
  }

  isDue(currentDate = new Date()) {
    return this.nextReview <= currentDate;
  }

  getRetentionRate() {
    return this.totalReviews > 0 ? this.correctReviews / this.totalReviews : 0;
  }
}

/**
 * Deck Manager - verwaltet Collections von Cards
 */
export class Deck {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.cards = [];
    this.created = new Date();
  }

  addCard(card) {
    this.cards.push(card);
  }

  getDueCards(currentDate = new Date()) {
    return this.cards.filter(card => card.isDue(currentDate));
  }

  getNewCards() {
    return this.cards.filter(card => card.totalReviews === 0);
  }

  getLearningCards() {
    return this.cards.filter(card => card.n < 2 && card.totalReviews > 0);
  }

  getStats() {
    const total = this.cards.length;
    const due = this.getDueCards().length;
    const newCards = this.getNewCards().length;
    const learning = this.getLearningCards().length;
    const mastered = this.cards.filter(card => card.n >= 5).length;

    const totalReviews = this.cards.reduce((sum, card) => sum + card.totalReviews, 0);
    const correctReviews = this.cards.reduce((sum, card) => sum + card.correctReviews, 0);
    const avgRetention = totalReviews > 0 ? correctReviews / totalReviews : 0;

    return {
      total,
      due,
      newCards,
      learning,
      mastered,
      avgRetention: Math.round(avgRetention * 100),
    };
  }
}

/**
 * Vorgefertigte Decks für Poker Training
 */
export function createPokerDecks() {
  const decks = [];

  // Deck 1: Preflop Ranges (Cash Game)
  const rangeDeck = new Deck(
    'Preflop Ranges (6-Max)',
    'GTO-basierte RFI Ranges für alle Positionen'
  );

  // Beispiel-Karten (vollständige Implementation würde alle Ranges enthalten)
  rangeDeck.addCard(new Card(
    'rfi_utg',
    'UTG RFI Range bei 100bb?\n(Prozentsatz + Beispiel-Hände)',
    '15%\nAA-77, AKs-AJs, AKo-AJo, KQs-KTs, QJs-JTs, A5s-A2s',
    'ranges',
    ['rfi', 'utg', 'cash-game']
  ));

  rangeDeck.addCard(new Card(
    'rfi_btn',
    'BTN RFI Range bei 100bb?\n(Prozentsatz)',
    '45%\nFast alle Pairs, alle Ax, suited broadways, suited connectors, viele offsuit combos',
    'ranges',
    ['rfi', 'btn', 'cash-game']
  ));

  rangeDeck.addCard(new Card(
    '3bet_linear',
    'Wann verwendest du eine LINEAR 3-Bet Range?',
    'Gegen passive Spieler die:\n- Selten 4-betten (<5%)\n- Oft die 3-Bet callen\n→ Merged Range: TT+, AQ+, KQs (keine Bluffs)',
    'ranges',
    ['3-bet', 'theory']
  ));

  decks.push(rangeDeck);

  // Deck 2: Push/Fold Charts (MTT)
  const pushFoldDeck = new Deck(
    'Push/Fold Charts (MTT)',
    'Nash Equilibrium Ranges für Short Stack Play'
  );

  pushFoldDeck.addCard(new Card(
    'pushfold_btn_20bb',
    'BTN Open-Shove Range bei 20bb?',
    '52%\nAlle Pairs, alle Ax, suited Kx, viele suited connectors',
    'push_fold',
    ['20bb', 'btn', 'mtt']
  ));

  pushFoldDeck.addCard(new Card(
    'pushfold_utg_10bb',
    'UTG Open-Shove Range bei 10bb?',
    '35%\nAlle Pairs, alle Ax, K9s+, KJo+, QJs+, JTs',
    'push_fold',
    ['10bb', 'utg', 'mtt']
  ));

  decks.push(pushFoldDeck);

  // Deck 3: Exploitative Strategies
  const exploitDeck = new Deck(
    'Exploitative Strategies',
    'GTO-informierte Exploits gegen häufige Leaks'
  );

  exploitDeck.addCard(new Card(
    'exploit_limper',
    'Gegner limpt vor dir (2-3 Limper).\nWas ist der optimale Exploit?',
    'ISO-RAISE:\n- Size: 3x + 1x pro Limper (4x-7x BB)\n- Range: Linear (22+, A2+, K9+, suited)\n- Postflop: ABC Poker, selten bluffen\nExpected: +15-25bb/100',
    'exploits',
    ['limper', 'iso-raise']
  ));

  exploitDeck.addCard(new Card(
    'exploit_calling_station',
    'Gegner ist eine Calling Station (foldet <40% auf C-Bets).\nWelche Anpassung?',
    'STOP BLUFFS:\n- C-Bet nur Value (Top Pair+)\n- Size: GRÖßER (75% pot statt 33%)\n- Triple barrel mit Nuts\nExpected: +10-15bb/100',
    'exploits',
    ['calling-station', 'c-bet']
  ));

  exploitDeck.addCard(new Card(
    'exploit_fit_or_fold',
    'Gegner spielt Fit-or-Fold (foldet >60% auf C-Bets).\nOptimaler Exploit?',
    'C-BET 100%:\n- Jede Hand, auch Air\n- Size: 33% pot (klein)\n- Triple barrel auf dry boards\nExpected: +12-20bb/100',
    'exploits',
    ['fit-or-fold', 'c-bet']
  ));

  decks.push(exploitDeck);

  // Deck 4: Concepts & Theory
  const theoryDeck = new Deck(
    'Concepts & Theory',
    'Fundamentale Poker-Konzepte und Theorie'
  );

  theoryDeck.addCard(new Card(
    'theory_10x_rule',
    'Was ist die 10x Rule?\nWann wendest du sie an?',
    'SET MINING RULE:\n- Calle mit kleinen Pairs (22-66) nur wenn:\n- Effektive Stacks ≥ 10x Call-Betrag\nBeispiel: Raise 6bb → brauchst ≥60bb Stack\nWarum: ~12% to flop set, 10x = genug implied odds',
    'theory',
    ['set-mining', 'implied-odds']
  ));

  theoryDeck.addCard(new Card(
    'theory_blocker',
    'Warum ist A5s die perfekte 3-Bet Bluff Hand?\n(Blocker-Konzept)',
    'BLOCKER-EFFEKT:\n- Dein Ass blockt AA (50% weniger combos: 3 statt 6)\n- Dein Ass blockt AK (25% weniger combos: 9 statt 12)\n- Deine 5 blockt NICHT die Folds (KQs, QJs, 99, TT)\n→ Gegner hat weniger Nuts, gleich viel Folds',
    'theory',
    ['blocker', '3-bet']
  ));

  theoryDeck.addCard(new Card(
    'theory_icm',
    'Was ist ICM?\nWarum ist es wichtig bei Turnieren?',
    'ICM = Independent Chip Model:\n- Chips haben NON-LINEAR value\n- Der letzte Chip ist wertvoller als der erste\n- Folden kann +EV sein (bei Bubble)\n→ Spiele TIGHTER als Chip-EV nahe der Bubble/Final Table',
    'theory',
    ['icm', 'mtt', 'tournament']
  ));

  decks.push(theoryDeck);

  return decks;
}

/**
 * Session Manager - organisiert Lern-Sessions
 */
export class StudySession {
  constructor(deck, newCardsPerSession = 10, reviewsPerSession = 20) {
    this.deck = deck;
    this.newCardsPerSession = newCardsPerSession;
    this.reviewsPerSession = reviewsPerSession;
    this.cardsToday = [];
    this.currentIndex = 0;
    this.sessionStats = {
      newCards: 0,
      reviews: 0,
      correct: 0,
      startTime: new Date(),
    };
  }

  startSession() {
    // Hole Due Cards + einige New Cards
    const dueCards = this.deck.getDueCards();
    const newCards = this.deck.getNewCards().slice(0, this.newCardsPerSession);

    // Mische die Karten
    this.cardsToday = [...dueCards, ...newCards].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;

    return {
      totalCards: this.cardsToday.length,
      dueCards: dueCards.length,
      newCards: newCards.length,
    };
  }

  getCurrentCard() {
    if (this.currentIndex >= this.cardsToday.length) return null;
    return this.cardsToday[this.currentIndex];
  }

  submitAnswer(quality) {
    const card = this.getCurrentCard();
    if (!card) return null;

    const result = card.review(quality);

    // Update session stats
    if (card.totalReviews === 1) {
      this.sessionStats.newCards++;
    } else {
      this.sessionStats.reviews++;
    }

    if (result.success) {
      this.sessionStats.correct++;
    }

    this.currentIndex++;

    return {
      ...result,
      remaining: this.cardsToday.length - this.currentIndex,
    };
  }

  getSessionSummary() {
    const duration = (new Date() - this.sessionStats.startTime) / 1000 / 60; // minutes
    const accuracy = this.sessionStats.reviews > 0
      ? this.sessionStats.correct / (this.sessionStats.newCards + this.sessionStats.reviews)
      : 0;

    return {
      ...this.sessionStats,
      duration: Math.round(duration),
      accuracy: Math.round(accuracy * 100),
      endTime: new Date(),
    };
  }
}

export default {
  DIFFICULTY_RATINGS,
  Card,
  Deck,
  createPokerDecks,
  StudySession,
};
