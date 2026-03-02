/**
 * Enhanced Analytics Dashboard
 * Charts, graphs, and detailed performance metrics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, all
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    // Mock data - replace with actual data from AsyncStorage/API
    setAnalyticsData({
      xpProgress: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          data: [45, 60, 38, 75, 90, 55, 80],
        }],
      },
      accuracyTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [65, 72, 78, 85],
        }],
      },
      categoryPerformance: [
        { name: 'Ranges', population: 85, color: '#4caf50', legendFontColor: '#333' },
        { name: 'Push/Fold', population: 72, color: '#2196f3', legendFontColor: '#333' },
        { name: 'Exploits', population: 68, color: '#ff9800', legendFontColor: '#333' },
        { name: 'PLO', population: 55, color: '#9c27b0', legendFontColor: '#333' },
        { name: 'MTT', population: 78, color: '#f44336', legendFontColor: '#333' },
      ],
      difficultyDistribution: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          data: [120, 85, 45],
        }],
      },
      stats: {
        totalQuestions: 250,
        averageAccuracy: 76,
        currentStreak: 5,
        longestStreak: 12,
        totalXP: 3450,
        level: 6,
        studyTime: 840, // minutes
        fastestAnswer: 3.2, // seconds
      },
    });
  };

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  if (!analyticsData) {
    return (
      <View style={styles.container}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Performance Analytics</Text>
        <Text style={styles.subtitle}>Track your learning progress</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range.id}
            style={[
              styles.timeRangeButton,
              timeRange === range.id && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange(range.id)}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range.id && styles.timeRangeTextActive,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analyticsData.stats.totalQuestions}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analyticsData.stats.averageAccuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analyticsData.stats.currentStreak}🔥</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>Lv {analyticsData.stats.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* XP Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily XP Progress</Text>
        <LineChart
          data={analyticsData.xpProgress}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLines={false}
        />
      </View>

      {/* Accuracy Trend */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Accuracy Improvement</Text>
        <LineChart
          data={analyticsData.accuracyTrend}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withVerticalLines={false}
          fromZero
        />
        <Text style={styles.chartHint}>
          📈 +{analyticsData.accuracyTrend.datasets[0].data[3] -
                analyticsData.accuracyTrend.datasets[0].data[0]}% improvement
        </Text>
      </View>

      {/* Category Performance */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Performance by Category</Text>
        <PieChart
          data={analyticsData.categoryPerformance}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>

      {/* Difficulty Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Questions by Difficulty</Text>
        <BarChart
          data={analyticsData.difficultyDistribution}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.7,
          }}
          style={styles.chart}
          withInnerLines={false}
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStats}>
        <Text style={styles.sectionTitle}>Study Statistics</Text>

        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Total Study Time</Text>
          <Text style={styles.statRowValue}>
            {Math.floor(analyticsData.stats.studyTime / 60)}h {analyticsData.stats.studyTime % 60}m
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Longest Streak</Text>
          <Text style={styles.statRowValue}>
            {analyticsData.stats.longestStreak} days 🔥
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Fastest Answer</Text>
          <Text style={styles.statRowValue}>
            {analyticsData.stats.fastestAnswer}s ⚡
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Total XP Earned</Text>
          <Text style={styles.statRowValue}>
            {analyticsData.stats.totalXP.toLocaleString()} ✨
          </Text>
        </View>
      </View>

      {/* Learning Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Learning Insights</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.insightText}>
            Your accuracy has improved by 20% this month. Keep up the great work!
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🎯</Text>
          <Text style={styles.insightText}>
            Focus on PLO concepts - currently your weakest category at 55%.
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>⭐</Text>
          <Text style={styles.insightText}>
            You're on a 5-day streak! Just 2 more days to unlock the Week Warrior badge.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    borderRadius: 12,
  },
  chartHint: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 10,
    fontWeight: '600',
  },
  additionalStats: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statRowLabel: {
    fontSize: 14,
    color: '#666',
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  insightsContainer: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
