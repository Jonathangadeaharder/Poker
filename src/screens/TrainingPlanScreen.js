import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ProgressBar,
  IconButton,
  Divider,
  List,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAINING_SCHEDULE, TRAINING_PATHS } from '../data/trainingPlan';

export default function TrainingPlanScreen({ route }) {
  const [selectedPath, setSelectedPath] = useState(route?.params?.path || 'CASH_GAME');
  const [expandedDay, setExpandedDay] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadProgress();
  }, [selectedPath]);

  useEffect(() => {
    calculateProgress();
  }, [completedModules]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(`progress_${selectedPath}`);
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (newCompleted) => {
    try {
      await AsyncStorage.setItem(`progress_${selectedPath}`, JSON.stringify(newCompleted));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateProgress = () => {
    const schedule = TRAINING_SCHEDULE[selectedPath];
    let totalModules = 0;
    let completed = 0;

    schedule.forEach((day, dayIndex) => {
      day.modules.forEach((module, moduleIndex) => {
        totalModules++;
        const key = `${dayIndex}-${moduleIndex}`;
        if (completedModules[key]) {
          completed++;
        }
      });
    });

    setProgress(totalModules > 0 ? completed / totalModules : 0);
  };

  const toggleModule = (dayIndex, moduleIndex) => {
    const key = `${dayIndex}-${moduleIndex}`;
    const newCompleted = {
      ...completedModules,
      [key]: !completedModules[key],
    };
    setCompletedModules(newCompleted);
    saveProgress(newCompleted);
  };

  const resetProgress = async () => {
    setCompletedModules({});
    try {
      await AsyncStorage.removeItem(`progress_${selectedPath}`);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'drill':
        return 'target';
      case 'video':
        return 'play-circle';
      case 'play':
        return 'cards-playing-outline';
      case 'review':
        return 'chart-line';
      case 'theory':
        return 'book-open-variant';
      case 'assessment':
        return 'clipboard-check';
      default:
        return 'circle';
    }
  };

  const getModuleColor = (type) => {
    switch (type) {
      case 'drill':
        return '#c41e3a';
      case 'video':
        return '#2196F3';
      case 'play':
        return '#2d5f3f';
      case 'review':
        return '#FF9800';
      case 'theory':
        return '#9C27B0';
      case 'assessment':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const schedule = TRAINING_SCHEDULE[selectedPath];
  const currentPath = TRAINING_PATHS[selectedPath];

  return (
    <ScrollView style={styles.container}>
      {/* Path Selector */}
      <Card style={styles.selectorCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Trainingspfad</Title>
          <View style={styles.pathSelector}>
            <Button
              mode={selectedPath === 'CASH_GAME' ? 'contained' : 'outlined'}
              onPress={() => setSelectedPath('CASH_GAME')}
              style={styles.pathButton}
              buttonColor={selectedPath === 'CASH_GAME' ? '#2d5f3f' : undefined}
            >
              Pfad A: Cash
            </Button>
            <Button
              mode={selectedPath === 'MTT' ? 'contained' : 'outlined'}
              onPress={() => setSelectedPath('MTT')}
              style={styles.pathButton}
              buttonColor={selectedPath === 'MTT' ? '#c41e3a' : undefined}
            >
              Pfad B: MTT
            </Button>
          </View>
          <Paragraph style={styles.pathDescription}>{currentPath.description}</Paragraph>
        </Card.Content>
      </Card>

      {/* Progress Overview */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Title style={styles.cardTitle}>Fortschritt</Title>
            <Chip>{Math.round(progress * 100)}%</Chip>
          </View>
          <ProgressBar progress={progress} color={currentPath.color} style={styles.progressBar} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Paragraph style={styles.statLabel}>Gesamt</Paragraph>
              <Title style={styles.statValue}>40h</Title>
            </View>
            <View style={styles.stat}>
              <Paragraph style={styles.statLabel}>Abgeschlossen</Paragraph>
              <Title style={styles.statValue}>
                {Math.round(progress * 40)}h
              </Title>
            </View>
            <View style={styles.stat}>
              <Paragraph style={styles.statLabel}>Verbleibend</Paragraph>
              <Title style={styles.statValue}>
                {40 - Math.round(progress * 40)}h
              </Title>
            </View>
          </View>
          <Button mode="outlined" onPress={resetProgress} style={styles.resetButton}>
            Fortschritt zurücksetzen
          </Button>
        </Card.Content>
      </Card>

      {/* Training Schedule */}
      <View style={styles.scheduleContainer}>
        <Title style={styles.scheduleTitle}>7-Tage Trainingsplan</Title>
        {schedule.map((day, dayIndex) => {
          const dayKey = dayIndex;
          const isExpanded = expandedDay === dayKey;
          const dayModules = day.modules;
          const completedInDay = dayModules.filter(
            (_, moduleIndex) => completedModules[`${dayIndex}-${moduleIndex}`]
          ).length;

          return (
            <Card key={dayKey} style={styles.dayCard}>
              <Card.Content>
                <View style={styles.dayHeader}>
                  <View style={styles.dayTitleContainer}>
                    <Title style={styles.dayTitle}>{day.title}</Title>
                    <Paragraph style={styles.dayHours}>{day.totalHours}h</Paragraph>
                  </View>
                  <Chip mode="outlined">
                    {completedInDay}/{dayModules.length}
                  </Chip>
                  <IconButton
                    icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                    onPress={() => setExpandedDay(isExpanded ? null : dayKey)}
                  />
                </View>
              </Card.Content>

              {isExpanded && (
                <>
                  <Divider />
                  {dayModules.map((module, moduleIndex) => {
                    const moduleKey = `${dayIndex}-${moduleIndex}`;
                    const isCompleted = completedModules[moduleKey];

                    return (
                      <List.Item
                        key={moduleIndex}
                        title={module.title}
                        description={`${module.hours}h • ${module.description}`}
                        left={(props) => (
                          <List.Icon
                            {...props}
                            icon={getModuleIcon(module.type)}
                            color={getModuleColor(module.type)}
                          />
                        )}
                        right={(props) => (
                          <IconButton
                            {...props}
                            icon={isCompleted ? 'check-circle' : 'circle-outline'}
                            iconColor={isCompleted ? '#4CAF50' : '#ccc'}
                            onPress={() => toggleModule(dayIndex, moduleIndex)}
                          />
                        )}
                        style={[
                          styles.moduleItem,
                          isCompleted && styles.moduleCompleted,
                        ]}
                      />
                    );
                  })}
                </>
              )}
            </Card>
          );
        })}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  selectorCard: {
    margin: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pathSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pathButton: {
    flex: 1,
  },
  pathDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5f3f',
  },
  resetButton: {
    marginTop: 8,
  },
  scheduleContainer: {
    paddingHorizontal: 16,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dayCard: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTitleContainer: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayHours: {
    fontSize: 13,
    color: '#666',
  },
  moduleItem: {
    paddingVertical: 8,
  },
  moduleCompleted: {
    backgroundColor: '#f0f8f0',
  },
  footer: {
    height: 40,
  },
});
