import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ProgressBar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { QuizGenerator } from '../data/miniGames';
import soundManager, { SOUND_EVENTS } from '../core/soundManager';
import { XP_REWARDS } from '../core/gamification';

export default function QuizGameScreen({ route, navigation }) {
  const { category = 'mixed', difficulty = 'mixed', questionCount = 10 } = route.params || {};

  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate quiz
    const generatedQuiz = QuizGenerator.generateMixedQuiz(questionCount, difficulty);
    setQuiz(generatedQuiz);
  }, []);

  const currentQuestion = quiz[currentIndex];
  const progress = quiz.length > 0 ? (currentIndex + 1) / quiz.length : 0;

  const handleAnswer = async (answer) => {
    if (showFeedback) return; // Already answered

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      const xpGained = currentQuestion.points;
      setTotalXP(totalXP + xpGained);
      await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
    } else {
      await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 >= quiz.length) {
      // Quiz complete
      setIsComplete(true);

      // Check for perfect score
      if (score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0) === quiz.length) {
        await soundManager.playSound(SOUND_EVENTS.QUIZ_PERFECT);
        setTotalXP(totalXP + XP_REWARDS.QUIZ_PERFECT);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (quiz.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Generiere Quiz...</Title>
      </View>
    );
  }

  if (isComplete) {
    const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
    const accuracy = (finalScore / quiz.length) * 100;
    const isPerfect = accuracy === 100;

    return (
      <ScrollView style={styles.container}>
        <Card style={styles.resultsCard}>
          <Card.Content>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsEmoji}>
                {isPerfect ? '🏆' : accuracy >= 80 ? '⭐' : accuracy >= 60 ? '👍' : '📚'}
              </Text>
              <Title style={styles.resultsTitle}>
                {isPerfect ? 'Perfekt!' : accuracy >= 80 ? 'Sehr gut!' : accuracy >= 60 ? 'Gut gemacht!' : 'Weiter üben!'}
              </Title>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.stat}>
                <Title style={styles.statValue}>{finalScore}/{quiz.length}</Title>
                <Paragraph style={styles.statLabel}>Richtig</Paragraph>
              </View>
              <View style={styles.stat}>
                <Title style={[styles.statValue, { color: '#2d5f3f' }]}>
                  {accuracy.toFixed(0)}%
                </Title>
                <Paragraph style={styles.statLabel}>Genauigkeit</Paragraph>
              </View>
              <View style={styles.stat}>
                <Title style={[styles.statValue, { color: '#ffd700' }]}>
                  +{totalXP + (isPerfect ? XP_REWARDS.QUIZ_PERFECT : 0)}
                </Title>
                <Paragraph style={styles.statLabel}>XP</Paragraph>
              </View>
            </View>

            {isPerfect && (
              <Card style={styles.bonusCard}>
                <Card.Content>
                  <Paragraph style={styles.bonusText}>
                    🎉 Perfect Score Bonus: +{XP_REWARDS.QUIZ_PERFECT} XP!
                  </Paragraph>
                </Card.Content>
              </Card>
            )}

            <View style={styles.buttonsRow}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.halfButton}
              >
                Fertig
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  // Restart quiz
                  const newQuiz = QuizGenerator.generateMixedQuiz(questionCount, difficulty);
                  setQuiz(newQuiz);
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setScore(0);
                  setTotalXP(0);
                  setIsComplete(false);
                }}
                style={styles.halfButton}
                buttonColor="#2d5f3f"
              >
                Nochmal
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {quiz.length}
          </Text>
          <ProgressBar
            progress={progress}
            color="#2d5f3f"
            style={styles.progressBar}
          />
        </View>
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>{score} ✓</Text>
        </View>
      </View>

      <ScrollView style={styles.quizContent}>
        {/* Question Card */}
        <Card style={styles.questionCard}>
          <Card.Content>
            <Chip mode="outlined" style={styles.categoryChip}>
              {currentQuestion.category}
            </Chip>
            <Title style={styles.question}>{currentQuestion.question}</Title>
          </Card.Content>
        </Card>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === currentQuestion.correctAnswer;
            const showCorrect = showFeedback && isCorrect;
            const showWrong = showFeedback && isSelected && !isCorrect;

            return (
              <Button
                key={index}
                mode={isSelected ? 'contained' : 'outlined'}
                onPress={() => handleAnswer(answer)}
                disabled={showFeedback}
                style={[
                  styles.answerButton,
                  showCorrect && styles.correctButton,
                  showWrong && styles.wrongButton,
                ]}
                buttonColor={
                  showCorrect ? '#4caf50' :
                  showWrong ? '#f44336' :
                  isSelected ? '#2d5f3f' :
                  undefined
                }
                textColor={
                  showCorrect || showWrong ? '#fff' :
                  isSelected ? '#fff' :
                  '#1a1a1a'
                }
              >
                {showCorrect && '✓ '}
                {showWrong && '✗ '}
                {answer}
              </Button>
            );
          })}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <Card style={[
            styles.feedbackCard,
            selectedAnswer === currentQuestion.correctAnswer
              ? styles.correctFeedback
              : styles.wrongFeedback
          ]}>
            <Card.Content>
              <Title style={styles.feedbackTitle}>
                {selectedAnswer === currentQuestion.correctAnswer
                  ? '✅ Richtig!'
                  : '❌ Falsch'}
              </Title>
              <Paragraph style={styles.feedbackText}>
                {currentQuestion.explanation}
              </Paragraph>
              <Button
                mode="contained"
                onPress={handleNext}
                style={styles.nextButton}
                buttonColor="#2d5f3f"
              >
                {currentIndex + 1 >= quiz.length ? 'Ergebnis ansehen' : 'Nächste Frage'}
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressInfo: {
    flex: 1,
    marginHorizontal: 12,
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
  scoreChip: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  quizContent: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    marginBottom: 24,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  question: {
    fontSize: 20,
    lineHeight: 28,
  },
  answersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  answerButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  correctButton: {
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  wrongButton: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  feedbackCard: {
    marginBottom: 24,
  },
  correctFeedback: {
    backgroundColor: '#e8f5e9',
  },
  wrongFeedback: {
    backgroundColor: '#ffebee',
  },
  feedbackTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 8,
  },
  // Results
  resultsCard: {
    margin: 16,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  bonusCard: {
    backgroundColor: '#fff3e0',
    marginBottom: 24,
  },
  bonusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
});
