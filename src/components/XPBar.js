import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { calculateLevel, LEVELS } from '../core/gamification';

export default function XPBar({ totalXP, showDetails = true, compact = false }) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const levelData = calculateLevel(totalXP);
  const progress = Number.isFinite(levelData.progress)
    ? Math.min(Math.max(levelData.progress, 0), 1)
    : 1;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLevel}>
          {levelData.levelData.icon} Lv.{levelData.level}
        </Text>
        <View style={styles.compactBarContainer}>
          <ProgressBar
            progress={progress}
            color="#ffd700"
            style={styles.compactBar}
          />
        </View>
        <Text style={styles.compactXP}>{totalXP} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showDetails && (
        <View style={styles.header}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelIcon}>{levelData.levelData.icon}</Text>
            <View>
              <Text style={styles.levelNumber}>Level {levelData.level}</Text>
              <Text style={styles.levelTitle}>{levelData.levelData.title}</Text>
            </View>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpCurrent}>{levelData.xpInCurrentLevel}</Text>
            <Text style={styles.xpSeparator}>/</Text>
            <Text style={styles.xpNext}>
              {levelData.xpForNextLevel - LEVELS[levelData.level].xpRequired}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.barContainer}>
        <ProgressBar
          progress={progress}
          color="#ffd700"
          style={styles.progressBar}
        />
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {showDetails && (
        <Text style={styles.xpRemaining}>
          {levelData.xpNeededForNext} XP bis Level {levelData.level + 1}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelIcon: {
    fontSize: 32,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  levelTitle: {
    fontSize: 14,
    color: '#666',
  },
  xpInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  xpCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  xpSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 4,
  },
  xpNext: {
    fontSize: 16,
    color: '#666',
  },
  barContainer: {
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: 24,
  },
  progressFill: {
    position: 'absolute',
    height: 24,
    backgroundColor: '#ffd700',
    borderRadius: 12,
  },
  xpRemaining: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactLevel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  compactBarContainer: {
    flex: 1,
    height: 8,
  },
  compactBar: {
    height: 8,
    borderRadius: 4,
  },
  compactXP: {
    fontSize: 12,
    color: '#666',
    minWidth: 60,
    textAlign: 'right',
  },
});
