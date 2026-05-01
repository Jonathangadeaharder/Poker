/**
 * Onboarding Screen
 * Interactive tutorial and demo for new users
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sessionManager } from '../utils/sessionManager';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Welcome to Poker Training',
    description: 'Learn poker strategy the smart way with gamified, bite-sized lessons inspired by Duolingo.',
    icon: '🎮',
    color: '#007AFF',
  },
  {
    id: '2',
    title: 'Earn XP & Level Up',
    description: 'Complete quizzes, maintain streaks, and unlock achievements as you master poker concepts.',
    icon: '⭐',
    color: '#4caf50',
  },
  {
    id: '3',
    title: 'Spaced Repetition Learning',
    description: 'Our scientifically-proven algorithm ensures you remember what you learn long-term.',
    icon: '🧠',
    color: '#9c27b0',
  },
  {
    id: '4',
    title: 'Multiple Game Types',
    description: 'Master NLH cash games, tournaments, PLO, and exploitative strategies.',
    icon: '🃏',
    color: '#ff9800',
  },
  {
    id: '5',
    title: 'Track Your Progress',
    description: 'Detailed analytics show your improvement over time and identify weak areas.',
    icon: '📊',
    color: '#f44336',
  },
  {
    id: '6',
    title: 'Ready to Start?',
    description: 'Complete your first quiz and begin your journey to poker mastery!',
    icon: '🚀',
    color: '#00bcd4',
  },
];

export default function OnboardingScreen({ navigation, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [demoXP, setDemoXP] = useState(0);
  const [demoStreak, setDemoStreak] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const xpAnimation = useRef(new Animated.Value(0)).current;

  // Record activity when user interacts
  useEffect(() => {
    sessionManager.recordActivity();
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Mark onboarding as completed
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }

    if (onComplete) {
      onComplete();
    }
    navigation.replace('MainApp');
  };

  const handleDemoXPClick = () => {
    const newXP = demoXP + 10;
    setDemoXP(newXP);

    // Animate XP gain
    Animated.sequence([
      Animated.timing(xpAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(xpAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDemoStreakClick = () => {
    setDemoStreak(demoStreak + 1);
  };

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.color }]}>
      <View style={styles.slideContent}>
        <Text style={styles.slideIcon}>{item.icon}</Text>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {ONBOARDING_SLIDES.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {renderPagination()}

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleComplete}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={scrollTo}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_SLIDES.length - 1 ? "Let's Go!" : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Demo Interactive Elements */}
      {currentIndex === 1 && (
        <View style={styles.demoContainer}>
          <Animated.View
            style={[
              styles.xpBadge,
              {
                transform: [
                  {
                    scale: xpAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.xpBadgeText}>XP: {demoXP}</Text>
          </Animated.View>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoXPClick}
          >
            <Text style={styles.demoButtonText}>Earn +10 XP! ✨</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentIndex === 2 && (
        <View style={styles.demoContainer}>
          <View style={styles.streakDemo}>
            <Text style={styles.streakDemoText}>
              {demoStreak > 0 ? `${demoStreak} Day Streak! 🔥` : 'Start Your Streak! 🔥'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoStreakClick}
          >
            <Text style={styles.demoButtonText}>Practice Today</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentIndex === 4 && (
        <View style={styles.demoContainer}>
          <View style={styles.progressDemo}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>75% Accuracy - Excellent! 📊</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideIcon: {
    fontSize: 100,
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  slideDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  nextButton: {
    backgroundColor: '#fff',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 15,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  xpBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  xpBadgeText: {
    color: '#4caf50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakDemo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  streakDemoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressDemo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    width: width * 0.8,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
