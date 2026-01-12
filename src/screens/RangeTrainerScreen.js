import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  List,
  SegmentedButtons,
} from 'react-native-paper';
import { RFI_RANGES, POSITIONS, THREE_BET_RANGES, COLD_CALL_RANGES } from '../data/pokerRanges';

export default function RangeTrainerScreen() {
  const [selectedCategory, setSelectedCategory] = useState('RFI');
  const [selectedPosition, setSelectedPosition] = useState('UTG');
  const [showHands, setShowHands] = useState(false);

  const renderRFIRanges = () => {
    const range = RFI_RANGES[selectedPosition];

    return (
      <View>
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.rangeHeader}>
              <Title style={styles.rangeTitle}>{range.position}</Title>
              <Chip mode="flat" style={styles.percentChip}>
                {range.percentage}
              </Chip>
            </View>
            <Paragraph style={styles.rangeDescription}>{range.description}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.handsCard}>
          <Card.Content>
            <View style={styles.handsTitleRow}>
              <Title style={styles.handsTitle}>Hände</Title>
              <Button
                mode="outlined"
                onPress={() => setShowHands(!showHands)}
                compact
              >
                {showHands ? 'Verbergen' : 'Anzeigen'}
              </Button>
            </View>

            {showHands && (
              <View style={styles.handsGrid}>
                {range.hands.map((hand, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={styles.handChip}
                    textStyle={styles.handText}
                  >
                    {hand}
                  </Chip>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Position Selector */}
        <Card style={styles.selectorCard}>
          <Card.Content>
            <Title style={styles.selectorTitle}>Position wählen</Title>
            <View style={styles.positionGrid}>
              {Object.keys(RFI_RANGES).map((pos) => (
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
      </View>
    );
  };

  const render3BetRanges = () => {
    return (
      <View>
        <Card style={styles.strategyCard}>
          <Card.Content>
            <Title style={styles.strategyTitle}>Linear/Merged Range</Title>
            <Chip mode="outlined" style={styles.usageChip}>
              {THREE_BET_RANGES.LINEAR.usage}
            </Chip>
            <Divider style={styles.divider} />
            <Paragraph style={styles.strategyDescription}>
              {THREE_BET_RANGES.LINEAR.description}
            </Paragraph>
            <Title style={styles.handsSubtitle}>Hände:</Title>
            <View style={styles.handsGrid}>
              {THREE_BET_RANGES.LINEAR.hands.map((hand, index) => (
                <Chip key={index} mode="flat" style={styles.handChip}>
                  {hand}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.strategyCard}>
          <Card.Content>
            <Title style={styles.strategyTitle}>Polarized Range</Title>
            <Chip mode="outlined" style={styles.usageChip}>
              {THREE_BET_RANGES.POLAR.usage}
            </Chip>
            <Divider style={styles.divider} />
            <Paragraph style={styles.strategyDescription}>
              {THREE_BET_RANGES.POLAR.description}
            </Paragraph>

            <Title style={styles.handsSubtitle}>Value Hände:</Title>
            <View style={styles.handsGrid}>
              {THREE_BET_RANGES.POLAR.valueHands.map((hand, index) => (
                <Chip key={index} mode="flat" style={[styles.handChip, styles.valueChip]}>
                  {hand}
                </Chip>
              ))}
            </View>

            <Title style={styles.handsSubtitle}>Bluff Hände (Blocker):</Title>
            <View style={styles.handsGrid}>
              {THREE_BET_RANGES.POLAR.bluffHands.map((hand, index) => (
                <Chip key={index} mode="flat" style={[styles.handChip, styles.bluffChip]}>
                  {hand}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.noteCard}>
          <Card.Content>
            <Title style={styles.noteTitle}>💡 Wann welche Range?</Title>
            <Paragraph style={styles.noteText}>
              <Paragraph style={styles.bold}>Linear:</Paragraph> Gegen passive Spieler, die selten 4-betten.
              {'\n\n'}
              <Paragraph style={styles.bold}>Polarisiert:</Paragraph> Gegen aggressive Spieler, die häufig 4-betten.
              {'\n\n'}
              Bei Micro-Stakes: Fast immer LINEAR verwenden!
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderColdCallRanges = () => {
    return (
      <View>
        <Card style={styles.strategyCard}>
          <Card.Content>
            <Title style={styles.strategyTitle}>
              {COLD_CALL_RANGES.IP.type}
            </Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.strategyDescription}>
              {COLD_CALL_RANGES.IP.description}
            </Paragraph>
            <Title style={styles.handsSubtitle}>Hände:</Title>
            <View style={styles.handsGrid}>
              {COLD_CALL_RANGES.IP.hands.map((hand, index) => (
                <Chip key={index} mode="flat" style={styles.handChip}>
                  {hand}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.strategyCard}>
          <Card.Content>
            <Title style={styles.strategyTitle}>
              {COLD_CALL_RANGES.OOP.type}
            </Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.strategyDescription}>
              {COLD_CALL_RANGES.OOP.description}
            </Paragraph>
            <Title style={styles.handsSubtitle}>Hände:</Title>
            <View style={styles.handsGrid}>
              {COLD_CALL_RANGES.OOP.hands.map((hand, index) => (
                <Chip key={index} mode="flat" style={styles.handChip}>
                  {hand}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.noteCard}>
          <Card.Content>
            <Title style={styles.noteTitle}>⚠️ 10x Rule für Set Mining</Title>
            <Paragraph style={styles.noteText}>
              Calle mit kleinen Pairs (22-66) nur wenn:{'\n\n'}
              Effektive Stacks ≥ 10x Call-Betrag{'\n\n'}
              Beispiel: Gegner raised 6bb → Du brauchst ≥60bb Stack
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.mainTitle}>Range Trainer</Title>
          <Paragraph style={styles.subtitle}>
            GTO-basierte Preflop-Ranges für 6-Max Cash Games (100bb)
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.categorySelector}>
        <SegmentedButtons
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          buttons={[
            { value: 'RFI', label: 'RFI' },
            { value: '3BET', label: '3-Bet' },
            { value: 'CALL', label: 'Cold Call' },
          ]}
        />
      </View>

      <View style={styles.content}>
        {selectedCategory === 'RFI' && renderRFIRanges()}
        {selectedCategory === '3BET' && render3BetRanges()}
        {selectedCategory === 'CALL' && renderColdCallRanges()}
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
  headerCard: {
    margin: 16,
    backgroundColor: '#2d5f3f',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  categorySelector: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  infoCard: {
    marginBottom: 12,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rangeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentChip: {
    backgroundColor: '#2d5f3f',
  },
  rangeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  handsCard: {
    marginBottom: 12,
  },
  handsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  handsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  handText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  selectorCard: {
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  positionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  positionButton: {
    minWidth: 80,
  },
  strategyCard: {
    marginBottom: 12,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  usageChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  strategyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  handsSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  valueChip: {
    backgroundColor: '#c8e6c9',
  },
  bluffChip: {
    backgroundColor: '#ffcdd2',
  },
  noteCard: {
    marginBottom: 12,
    backgroundColor: '#e3f2fd',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    height: 40,
  },
});
