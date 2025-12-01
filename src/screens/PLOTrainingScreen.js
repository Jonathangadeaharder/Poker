/**
 * PLO (Pot Limit Omaha) Interactive Training Screen
 * Specialized training for PLO strategy with interactive features
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PLO_QUESTIONS, PLO_CONCEPTS } from '../data/ploQuestions';

export default function PLOTrainingScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const question = PLO_QUESTIONS[currentQuestion];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + question.points);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: question.id,
        correct: isCorrect,
        answer,
      },
    ]);
  };

  const nextQuestion = () => {
    if (currentQuestion < PLO_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      Alert.alert(
        'PLO Training Complete!',
        `Score: ${score}/${PLO_QUESTIONS.reduce((sum, q) => sum + q.points, 0)}\nAccuracy: ${Math.round((answeredQuestions.filter(a => a.correct).length / answeredQuestions.length) * 100)}%`,
        [
          { text: 'Review', onPress: () => {} },
          { text: 'Restart', onPress: resetQuiz },
          { text: 'Exit', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  const getButtonStyle = (answer) => {
    if (!showExplanation) {
      return styles.answerButton;
    }

    if (answer === question.correctAnswer) {
      return [styles.answerButton, styles.correctAnswer];
    }

    if (answer === selectedAnswer && answer !== question.correctAnswer) {
      return [styles.answerButton, styles.incorrectAnswer];
    }

    return [styles.answerButton, styles.disabledAnswer];
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PLO Training</Text>
        <Text style={styles.progress}>
          Question {currentQuestion + 1}/{PLO_QUESTIONS.length}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score} XP</Text>
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{question.category.replace('plo_', '').toUpperCase()}</Text>
          <Text style={styles.difficultyText}>{question.difficulty}</Text>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {question.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(answer)}
              onPress={() => handleAnswer(answer)}
              disabled={showExplanation}
            >
              <Text
                style={[
                  styles.answerText,
                  showExplanation && answer === question.correctAnswer && styles.correctAnswerText,
                  showExplanation && answer === selectedAnswer && answer !== question.correctAnswer && styles.incorrectAnswerText,
                ]}
              >
                {answer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>
              {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={nextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion < PLO_QUESTIONS.length - 1 ? 'Next Question' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* PLO Concepts Reference */}
      {!showExplanation && (
        <View style={styles.conceptsSection}>
          <Text style={styles.sectionTitle}>💡 PLO Key Concepts</Text>

          <TouchableOpacity style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Hand Rankings</Text>
            <Text style={styles.conceptPreview}>
              Premium: AAxx double-suited, High rundowns...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Wrap Draws</Text>
            <Text style={styles.conceptPreview}>
              8+ outs to straight = most powerful draws...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Blockers</Text>
            <Text style={styles.conceptPreview}>
              More important than Hold'em for bluffs...
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#9c27b0',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 10,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  questionCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9c27b0',
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 26,
    marginBottom: 20,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  correctAnswer: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectAnswer: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  disabledAnswer: {
    opacity: 0.5,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  correctAnswerText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  incorrectAnswerText: {
    color: '#c62828',
    fontWeight: '600',
  },
  explanationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f7ff',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  conceptsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  conceptCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  conceptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9c27b0',
    marginBottom: 5,
  },
  conceptPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
