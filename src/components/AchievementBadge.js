import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Modal } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

export default function AchievementUnlocked({ visible, achievement, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!achievement) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Card style={styles.card}>
            <Card.Content style={styles.content}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{achievement.icon}</Text>
                <View style={styles.glow} />
              </View>

              <Title style={styles.title}>Achievement Unlocked!</Title>
              <Title style={styles.achievementTitle}>{achievement.title}</Title>
              <Paragraph style={styles.description}>
                {achievement.description}
              </Paragraph>

              <View style={styles.reward}>
                <Text style={styles.rewardText}>
                  +{achievement.xpReward} XP
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={onClose}
                style={styles.button}
                buttonColor="#2d5f3f"
              >
                Awesome!
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export function AchievementList({ achievements, unlockedIds = [] }) {
  return (
    <View style={styles.list}>
      {achievements.map((achievement) => {
        const unlocked = unlockedIds.includes(achievement.id);
        return (
          <Card
            key={achievement.id}
            style={[
              styles.listCard,
              !unlocked && styles.lockedCard,
            ]}
          >
            <Card.Content style={styles.listContent}>
              <Text style={[styles.listIcon, !unlocked && styles.lockedIcon]}>
                {unlocked ? achievement.icon : '🔒'}
              </Text>
              <View style={styles.listInfo}>
                <Title style={[styles.listTitle, !unlocked && styles.lockedText]}>
                  {achievement.title}
                </Title>
                <Paragraph style={[styles.listDescription, !unlocked && styles.lockedText]}>
                  {achievement.description}
                </Paragraph>
                <Text style={styles.listReward}>
                  {achievement.xpReward} XP
                </Text>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffd700',
    opacity: 0.3,
    borderRadius: 50,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5f3f',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  reward: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  button: {
    width: '100%',
  },
  // Achievement List
  list: {
    gap: 12,
  },
  listCard: {
    marginBottom: 8,
  },
  lockedCard: {
    opacity: 0.5,
  },
  listContent: {
    flexDirection: 'row',
    gap: 16,
  },
  listIcon: {
    fontSize: 40,
  },
  lockedIcon: {
    opacity: 0.3,
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  listReward: {
    fontSize: 12,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  lockedText: {
    color: '#999',
  },
});
