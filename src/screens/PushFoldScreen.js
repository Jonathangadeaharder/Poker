import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import { PUSH_FOLD_CHARTS, ICM_GUIDELINES } from '../data/pushFoldCharts';

export default function PushFoldScreen() {
  const [selectedStack, setSelectedStack] = useState('TWENTY_BB');
  const [selectedAction, setSelectedAction] = useState('openShove');
  const [selectedPosition, setSelectedPosition] = useState('BTN');

  const getStackColor = (stack) => {
    switch (stack) {
      case 'TWENTY_BB':
        return '#4CAF50';
      case 'FIFTEEN_BB':
        return '#FF9800';
      case 'TEN_BB':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const renderChart = () => {
    const stackData = PUSH_FOLD_CHARTS[selectedStack];

    if (selectedAction === 'openShove') {
      const positionData = stackData.openShove[selectedPosition];

      return (
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Title style={styles.chartTitle}>{positionData.position}</Title>
              <Chip
                mode="flat"
                style={[styles.rangeChip, { backgroundColor: getStackColor(selectedStack) }]}
                textStyle={{ color: '#fff', fontWeight: 'bold' }}
              >
                {positionData.range}
              </Chip>
            </View>
            <Paragraph style={styles.chartDescription}>{positionData.description}</Paragraph>
            <Divider style={styles.divider} />

            <Title style={styles.handsTitle}>Hände ({positionData.range}):</Title>
            <View style={styles.handsContainer}>
              {Array.isArray(positionData.hands) ? (
                <View style={styles.handsGrid}>
                  {positionData.hands.map((hand, index) => (
                    <Chip key={index} mode="outlined" style={styles.handChip}>
                      {hand}
                    </Chip>
                  ))}
                </View>
              ) : (
                <Paragraph style={styles.rangeDescription}>{positionData.hands}</Paragraph>
              )}
            </View>
          </Card.Content>
        </Card>
      );
    } else {
      // Re-Shove
      const reShovePositions = Object.keys(stackData.reShove || {});

      return (
        <View>
          {reShovePositions.map((pos) => {
            const posData = stackData.reShove[pos];
            return (
              <Card key={pos} style={styles.chartCard}>
                <Card.Content>
                  <View style={styles.chartHeader}>
                    <Title style={styles.chartTitle}>{posData.scenario}</Title>
                    <Chip
                      mode="flat"
                      style={[styles.rangeChip, { backgroundColor: getStackColor(selectedStack) }]}
                      textStyle={{ color: '#fff', fontWeight: 'bold' }}
                    >
                      {posData.range}
                    </Chip>
                  </View>
                  <Paragraph style={styles.chartDescription}>{posData.description}</Paragraph>
                  <Divider style={styles.divider} />

                  <View style={styles.handsGrid}>
                    {posData.hands.map((hand, index) => (
                      <Chip key={index} mode="outlined" style={styles.handChip}>
                        {hand}
                      </Chip>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      );
    }
  };

  const currentStack = PUSH_FOLD_CHARTS[selectedStack];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.mainTitle}>Push/Fold Charts</Title>
          <Paragraph style={styles.subtitle}>
            Nash Equilibrium-basierte Ranges für MTT Short-Stack Play
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Stack Size Selector */}
      <Card style={styles.selectorCard}>
        <Card.Content>
          <Title style={styles.selectorTitle}>Stack-Größe</Title>
          <View style={styles.stackButtons}>
            {Object.keys(PUSH_FOLD_CHARTS).map((stackKey) => {
              const stack = PUSH_FOLD_CHARTS[stackKey];
              return (
                <Button
                  key={stackKey}
                  mode={selectedStack === stackKey ? 'contained' : 'outlined'}
                  onPress={() => setSelectedStack(stackKey)}
                  style={styles.stackButton}
                  buttonColor={selectedStack === stackKey ? getStackColor(stackKey) : undefined}
                >
                  {stack.stackSize}
                </Button>
              );
            })}
          </View>
          <Chip mode="outlined" style={styles.scenarioChip}>
            {currentStack.scenario}
          </Chip>
        </Card.Content>
      </Card>

      {/* Action Selector */}
      <View style={styles.actionSelector}>
        <SegmentedButtons
          value={selectedAction}
          onValueChange={setSelectedAction}
          buttons={[
            { value: 'openShove', label: 'Open-Shove' },
            { value: 'reShove', label: 'Re-Shove' },
          ]}
        />
      </View>

      {/* Position Selector (nur für Open-Shove) */}
      {selectedAction === 'openShove' && (
        <Card style={styles.positionCard}>
          <Card.Content>
            <Title style={styles.selectorTitle}>Position</Title>
            <View style={styles.positionGrid}>
              {Object.keys(currentStack.openShove).map((pos) => (
                <Button
                  key={pos}
                  mode={selectedPosition === pos ? 'contained' : 'outlined'}
                  onPress={() => setSelectedPosition(pos)}
                  style={styles.positionButton}
                  buttonColor={selectedPosition === pos ? '#2d5f3f' : undefined}
                  compact
                >
                  {pos}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Chart Display */}
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>

      {/* ICM Guidelines */}
      <Card style={styles.icmCard}>
        <Card.Content>
          <Title style={styles.icmTitle}>📊 ICM-Adjustments</Title>
          <Divider style={styles.divider} />

          <Title style={styles.icmSubtitle}>
            {ICM_GUIDELINES.BUBBLE.scenario}
          </Title>
          <Chip mode="outlined" style={styles.adjustmentChip}>
            Spiele {ICM_GUIDELINES.BUBBLE.adjustment}
          </Chip>
          <Paragraph style={styles.icmDescription}>
            {ICM_GUIDELINES.BUBBLE.description}
          </Paragraph>
          {ICM_GUIDELINES.BUBBLE.keyPoints.map((point, index) => (
            <Paragraph key={index} style={styles.keyPoint}>
              • {point}
            </Paragraph>
          ))}

          <Divider style={styles.divider} />

          <Title style={styles.icmSubtitle}>
            {ICM_GUIDELINES.FINAL_TABLE.scenario}
          </Title>
          <Chip mode="outlined" style={styles.adjustmentChip}>
            Spiele {ICM_GUIDELINES.FINAL_TABLE.adjustment}
          </Chip>
          <Paragraph style={styles.icmDescription}>
            {ICM_GUIDELINES.FINAL_TABLE.description}
          </Paragraph>
          {ICM_GUIDELINES.FINAL_TABLE.keyPoints.map((point, index) => (
            <Paragraph key={index} style={styles.keyPoint}>
              • {point}
            </Paragraph>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.noteCard}>
        <Card.Content>
          <Title style={styles.noteTitle}>⚠️ Wichtig</Title>
          <Paragraph style={styles.noteText}>
            Diese Charts sind für Chip-EV Situationen (pre-bubble, keine extremen Pay Jumps).
            {'\n\n'}
            Bei Bubble und Final Table: Spiele TIGHTER als diese Charts (siehe ICM-Adjustments).
            {'\n\n'}
            Als Big Stack: Spiele aggressiver gegen Medium Stacks.
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
  headerCard: {
    margin: 16,
    backgroundColor: '#c41e3a',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ffebee',
    marginTop: 4,
  },
  selectorCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stackButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stackButton: {
    flex: 1,
  },
  scenarioChip: {
    alignSelf: 'flex-start',
  },
  actionSelector: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  positionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  positionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  positionButton: {
    minWidth: 70,
  },
  chartContainer: {
    paddingHorizontal: 16,
  },
  chartCard: {
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rangeChip: {
    marginLeft: 8,
  },
  chartDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  handsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  handsContainer: {
    marginTop: 8,
  },
  handsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  handChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  rangeDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  icmCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#e8f5e9',
  },
  icmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  icmSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adjustmentChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  icmDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  keyPoint: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
  },
  noteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff3cd',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 22,
  },
  footer: {
    height: 40,
  },
});
