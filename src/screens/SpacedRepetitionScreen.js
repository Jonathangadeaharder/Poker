import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import { createPokerDecks, StudySession, DIFFICULTY_RATINGS } from '../core/spacedRepetition';
import soundManager, { SOUND_EVENTS } from '../core/soundManager';
import { XP_REWARDS } from '../core/gamification';

export default function SpacedRepetitionScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [session, setSession] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);

  const flipAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Load decks
    const pokerDecks = createPokerDecks();
    setDecks(pokerDecks);
  }, []);

  const startSession = (deck) => {
    const newSession = new StudySession(deck, 5, 20);
    const sessionInfo = newSession.startSession();
    setSession(newSession);
    setSelectedDeck(deck);
    setCurrentCard(newSession.getCurrentCard());
    setShowAnswer(false);
    console.log('Session started:', sessionInfo);
  };

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: showAnswer ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowAnswer(!showAnswer);
  };

  const handleRating = async (rating) => {
    if (!session || !currentCard) return;

    const result = session.submitAnswer(rating);

    // Play sound
    if (result.success) {
      await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
    } else {
      await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
    }

    // Check if session complete
    const nextCard = session.getCurrentCard();
    if (!nextCard) {
      // Session complete
      const summary = session.getSessionSummary();
      setSessionStats(summary);
      setCurrentCard(null);
    } else {
      setCurrentCard(nextCard);
      setShowAnswer(false);
      flipAnim.setValue(0);
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Deck Selection Screen
  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Spaced Repetition</Title>
          <Paragraph style={styles.headerSubtitle}>
            Lerne mit dem SM-2 Algorithmus - 90% Retention optimal!
          </Paragraph>
        </View>

        {decks.map((deck) => {
          const stats = deck.getStats();
          return (
            <Card key={deck.name} style={styles.deckCard}>
              <Card.Content>
                <Title style={styles.deckTitle}>{deck.name}</Title>
                <Paragraph style={styles.deckDescription}>
                  {deck.description}
                </Paragraph>

                <View style={styles.deckStats}>
                  <View style={styles.deckStat}>
                    <Title style={styles.deckStatNumber}>{stats.total}</Title>
                    <Paragraph style={styles.deckStatLabel}>Total</Paragraph>
                  </View>
                  <View style={styles.deckStat}>
                    <Title style={[styles.deckStatNumber, { color: '#f44336' }]}>
                      {stats.due}
                    </Title>
                    <Paragraph style={styles.deckStatLabel}>Fällig</Paragraph>
                  </View>
                  <View style={styles.deckStat}>
                    <Title style={[styles.deckStatNumber, { color: '#2196F3' }]}>
                      {stats.newCards}
                    </Title>
                    <Paragraph style={styles.deckStatLabel}>Neu</Paragraph>
                  </View>
                  <View style={styles.deckStat}>
                    <Title style={[styles.deckStatNumber, { color: '#4CAF50' }]}>
                      {stats.avgRetention}%
                    </Title>
                    <Paragraph style={styles.deckStatLabel}>Retention</Paragraph>
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={() => startSession(deck)}
                  style={styles.startButton}
                  buttonColor="#2d5f3f"
                  disabled={stats.due === 0 && stats.newCards === 0}
                >
                  {stats.due > 0 || stats.newCards > 0 ? 'Starte Session' : 'Nichts fällig'}
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </View>
    );
  }

  // Session Complete Screen
  if (sessionStats) {
    const xpGained = sessionStats.newCards * XP_REWARDS.CARD_REVIEW_GOOD +
                     sessionStats.correct * XP_REWARDS.CARD_REVIEW_EASY;

    return (
      <View style={styles.container}>
        <Card style={styles.resultsCard}>
          <Card.Content>
            <Title style={styles.resultsTitle}>Session Abgeschlossen! 🎉</Title>

            <View style={styles.resultsGrid}>
              <View style={styles.resultStat}>
                <Title style={styles.resultValue}>{sessionStats.newCards}</Title>
                <Paragraph style={styles.resultLabel}>Neue Karten</Paragraph>
              </View>
              <View style={styles.resultStat}>
                <Title style={styles.resultValue}>{sessionStats.reviews}</Title>
                <Paragraph style={styles.resultLabel}>Reviews</Paragraph>
              </View>
              <View style={styles.resultStat}>
                <Title style={[styles.resultValue, { color: '#2e7d32' }]}>
                  {sessionStats.accuracy}%
                </Title>
                <Paragraph style={styles.resultLabel}>Genauigkeit</Paragraph>
              </View>
              <View style={styles.resultStat}>
                <Title style={[styles.resultValue, { color: '#ffd700' }]}>
                  +{xpGained}
                </Title>
                <Paragraph style={styles.resultLabel}>XP</Paragraph>
              </View>
            </View>

            <Paragraph style={styles.durationText}>
              Dauer: {sessionStats.duration} Minuten
            </Paragraph>

            <View style={styles.buttonsRow}>
              <Button
                mode="outlined"
                onPress={() => {
                  setSession(null);
                  setSelectedDeck(null);
                  setSessionStats(null);
                }}
                style={styles.halfButton}
              >
                Zurück
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  setSessionStats(null);
                  startSession(selectedDeck);
                }}
                style={styles.halfButton}
                buttonColor="#2d5f3f"
              >
                Nochmal
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  // Active Session Screen
  const progress = session.cardsToday.length > 0
    ? session.currentIndex / session.cardsToday.length
    : 0;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => {
            setSession(null);
            setSelectedDeck(null);
          }}
        />
        <View style={styles.progressInfo}>
          <Paragraph style={styles.progressText}>
            {session.currentIndex + 1} / {session.cardsToday.length}
          </Paragraph>
          <ProgressBar
            progress={progress}
            color="#2d5f3f"
            style={styles.progressBar}
          />
        </View>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.flashcard,
            { transform: [{ rotateY: frontInterpolate }] },
            !showAnswer && styles.flashcardFront,
          ]}
        >
          <Card style={styles.flashcardContent}>
            <Card.Content>
              <Paragraph style={styles.cardLabel}>FRAGE</Paragraph>
              <Title style={styles.cardText}>{currentCard?.front}</Title>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View
          style={[
            styles.flashcard,
            styles.flashcardBack,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <Card style={styles.flashcardContent}>
            <Card.Content>
              <Paragraph style={styles.cardLabel}>ANTWORT</Paragraph>
              <Paragraph style={styles.cardText}>{currentCard?.back}</Paragraph>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>

      {/* Actions */}
      {!showAnswer ? (
        <Button
          mode="contained"
          onPress={flipCard}
          style={styles.showAnswerButton}
          buttonColor="#2d5f3f"
        >
          Antwort anzeigen
        </Button>
      ) : (
        <View style={styles.ratingButtons}>
          <Button
            mode="outlined"
            onPress={() => handleRating(DIFFICULTY_RATINGS.AGAIN)}
            style={[styles.ratingButton, styles.againButton]}
            textColor="#f44336"
          >
            Nochmal
            {'\n'}(0d)
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleRating(DIFFICULTY_RATINGS.HARD)}
            style={[styles.ratingButton, styles.hardButton]}
            textColor="#ff9800"
          >
            Schwer
            {'\n'}({Math.round(currentCard.interval * 0.8)}d)
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleRating(DIFFICULTY_RATINGS.GOOD)}
            style={[styles.ratingButton, styles.goodButton]}
            textColor="#4caf50"
          >
            Gut
            {'\n'}({currentCard.n === 0 ? '1d' : currentCard.n === 1 ? '6d' : `${currentCard.interval}d`})
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleRating(DIFFICULTY_RATINGS.EASY)}
            style={[styles.ratingButton, styles.easyButton]}
            textColor="#2196F3"
          >
            Einfach
            {'\n'}({Math.round(currentCard.interval * 1.3)}d)
          </Button>
        </View>
      )}

      <Paragraph style={styles.helpText}>
        {!showAnswer
          ? 'Versuche dich zu erinnern, dann zeige die Antwort'
          : 'Wie leicht war es, sich zu erinnern?'}
      </Paragraph>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deckCard: {
    marginBottom: 16,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deckDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  deckStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  deckStat: {
    alignItems: 'center',
  },
  deckStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deckStatLabel: {
    fontSize: 11,
    color: '#666',
  },
  startButton: {
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flashcard: {
    width: '100%',
    height: 300,
    backfaceVisibility: 'hidden',
  },
  flashcardFront: {
    position: 'absolute',
  },
  flashcardBack: {
    position: 'absolute',
  },
  flashcardContent: {
    height: '100%',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  showAnswerButton: {
    marginVertical: 24,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 24,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 8,
  },
  againButton: {
    borderColor: '#f44336',
  },
  hardButton: {
    borderColor: '#ff9800',
  },
  goodButton: {
    borderColor: '#4caf50',
  },
  easyButton: {
    borderColor: '#2196F3',
  },
  helpText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Results
  resultsCard: {
    marginTop: 40,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  resultStat: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
});
