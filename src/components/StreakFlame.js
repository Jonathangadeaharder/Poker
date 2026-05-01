import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { StreakManager } from '../core/gamification';

export default function StreakFlame({ currentStreak, lastActiveDate, onPress, compact = false }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const status = StreakManager.getStreakStatus(currentStreak);
  const color = StreakManager.getStreakColor(currentStreak);

  useEffect(() => {
    // Pulsing animation für aktive Streaks
    if (currentStreak > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentStreak]);

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.compactContainer}>
        <Animated.Text
          style={[
            styles.compactEmoji,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {status.emoji}
        </Animated.Text>
        <Text style={[styles.compactNumber, { color }]}>
          {currentStreak}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, { borderLeftColor: color }]}>
        <Card.Content style={styles.content}>
          <Animated.View
            style={[
              styles.emojiContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.emoji}>{status.emoji}</Text>
          </Animated.View>

          <View style={styles.info}>
            <View style={styles.row}>
              <Text style={styles.label}>Streak</Text>
              <Text style={[styles.number, { color }]}>
                {currentStreak} {currentStreak === 1 ? 'Tag' : 'Tage'}
              </Text>
            </View>
            <Text style={styles.message}>{status.message}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
  },
  emoji: {
    fontSize: 36,
  },
  info: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  compactEmoji: {
    fontSize: 20,
  },
  compactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
