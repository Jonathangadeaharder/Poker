import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Divider, Switch, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XPBar from '../components/XPBar';
import StreakFlame from '../components/StreakFlame';
import { AchievementList } from '../components/AchievementBadge';
import { ACHIEVEMENTS } from '../core/gamification';
import soundManager from '../core/soundManager';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    totalXP: 1250, // Demo data
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date(),
    totalSessions: 23,
    perfectQuizzes: 3,
    unlockedAchievements: ['first_steps', 'week_warrior', 'quiz_rookie'],
  });

  const [settings, setSettings] = useState({
    soundEnabled: true,
    hapticsEnabled: true,
    darkMode: false,
  });

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      if (saved) {
        const loadedSettings = JSON.parse(saved);
        setSettings(loadedSettings);
        soundManager.setEnabled(loadedSettings.soundEnabled);
        soundManager.setHapticsEnabled(loadedSettings.hapticsEnabled);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      soundManager.setEnabled(newSettings.soundEnabled);
      soundManager.setHapticsEnabled(newSettings.hapticsEnabled);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const achievementsList = Object.values(ACHIEVEMENTS);

  return (
    <ScrollView style={styles.container}>
      {/* XP & Level */}
      <Card style={styles.card}>
        <Card.Content>
          <XPBar totalXP={profile.totalXP} showDetails={true} />
        </Card.Content>
      </Card>

      {/* Streak */}
      <StreakFlame
        currentStreak={profile.currentStreak}
        lastActiveDate={profile.lastActiveDate}
      />

      {/* Stats Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>📊 Statistiken</Title>
          <Divider style={styles.divider} />

          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Title style={styles.statValue}>{profile.totalSessions}</Title>
              <Paragraph style={styles.statLabel}>Sessions</Paragraph>
            </View>
            <View style={styles.stat}>
              <Title style={styles.statValue}>{profile.perfectQuizzes}</Title>
              <Paragraph style={styles.statLabel}>Perfect Quizzes</Paragraph>
            </View>
            <View style={styles.stat}>
              <Title style={styles.statValue}>{profile.longestStreak}</Title>
              <Paragraph style={styles.statLabel}>Längste Streak</Paragraph>
            </View>
            <View style={styles.stat}>
              <Title style={styles.statValue}>{profile.unlockedAchievements.length}</Title>
              <Paragraph style={styles.statLabel}>Achievements</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Achievements */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>🏆 Achievements</Title>
          <Paragraph style={styles.sectionSubtitle}>
            {profile.unlockedAchievements.length} / {achievementsList.length} freigeschaltet
          </Paragraph>
          <Divider style={styles.divider} />

          <AchievementList
            achievements={achievementsList}
            unlockedIds={profile.unlockedAchievements}
          />
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>⚙️ Einstellungen</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Sound-Effekte"
            description="Spiele Sounds bei Aktionen"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => saveSettings({ ...settings, soundEnabled: value })}
              />
            )}
          />

          <List.Item
            title="Haptisches Feedback"
            description="Vibrationen bei Aktionen"
            left={(props) => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(value) => saveSettings({ ...settings, hapticsEnabled: value })}
              />
            )}
          />

          <List.Item
            title="Dark Mode"
            description="Dunkles Design (Coming Soon)"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => saveSettings({ ...settings, darkMode: value })}
                disabled
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>ℹ️ Über</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.aboutText}>
            <Paragraph style={styles.bold}>Poker Training Pro v1.0</Paragraph>
            {'\n\n'}
            Rigorose GTO-basierte Trainings-App mit:
            {'\n'}- Spaced Repetition (SM-2 Algorithm)
            {'\n'}- Gamification (XP, Levels, Streaks)
            {'\n'}- Interactive Mini-Games
            {'\n'}- 40h Intensiv-Trainingsplan
            {'\n\n'}
            <Paragraph style={styles.bold}>Basierend auf:</Paragraph>
            {'\n'}- Duolingo's Gamification Best Practices
            {'\n'}- Anki's SM-2 Spaced Repetition
            {'\n'}- Modern Mobile UX/UI (2025)
            {'\n'}- Educational Game Design Research
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d5f3f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    height: 40,
  },
});
