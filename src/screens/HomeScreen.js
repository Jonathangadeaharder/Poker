import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider } from 'react-native-paper';
import { TRAINING_PATHS } from '../data/trainingPlan';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.mainTitle}>Poker Training Pro</Title>
          <Paragraph style={styles.subtitle}>
            Rigorose GTO-basierte Trainings-App für No-Limit Hold'em
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Wähle deinen Pfad</Title>
        <Paragraph style={styles.sectionText}>
          Beide Pfade sind 40-Stunden-Intensivprogramme. Wähle basierend auf deinem Ziel:
        </Paragraph>
      </View>

      {/* Pfad A: Cash Game */}
      <Card style={[styles.pathCard, { borderLeftColor: TRAINING_PATHS.CASH_GAME.color }]}>
        <Card.Content>
          <View style={styles.pathHeader}>
            <Title style={styles.pathTitle}>{TRAINING_PATHS.CASH_GAME.name}</Title>
            <Chip mode="outlined" style={styles.chip}>Schwerer</Chip>
          </View>
          <Paragraph style={styles.pathSubtitle}>{TRAINING_PATHS.CASH_GAME.subtitle}</Paragraph>
          <Divider style={styles.divider} />
          <Paragraph style={styles.pathDescription}>
            {TRAINING_PATHS.CASH_GAME.description}
          </Paragraph>
          <View style={styles.targetContainer}>
            <Paragraph style={styles.targetLabel}>Ziel:</Paragraph>
            <Paragraph style={styles.targetText}>{TRAINING_PATHS.CASH_GAME.target}</Paragraph>
          </View>
          <View style={styles.keyPoints}>
            <Title style={styles.keyPointsTitle}>Fokus:</Title>
            <Paragraph style={styles.bullet}>• Postflop-Spiel & Range-Vorteil</Paragraph>
            <Paragraph style={styles.bullet}>• Exploitative Strategien (Limper, Calling Stations)</Paragraph>
            <Paragraph style={styles.bullet}>• C-Bet Matrix (HU vs MW)</Paragraph>
            <Paragraph style={styles.bullet}>• 3-Bet Ranges (Linear vs Polar)</Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Training', { path: 'CASH_GAME' })}
            style={[styles.button, { backgroundColor: TRAINING_PATHS.CASH_GAME.color }]}
          >
            Starte Pfad A
          </Button>
        </Card.Actions>
      </Card>

      {/* Pfad B: MTT */}
      <Card style={[styles.pathCard, { borderLeftColor: TRAINING_PATHS.MTT.color }]}>
        <Card.Content>
          <View style={styles.pathHeader}>
            <Title style={styles.pathTitle}>{TRAINING_PATHS.MTT.name}</Title>
            <Chip mode="outlined" style={styles.chip}>Einfacher</Chip>
          </View>
          <Paragraph style={styles.pathSubtitle}>{TRAINING_PATHS.MTT.subtitle}</Paragraph>
          <Divider style={styles.divider} />
          <Paragraph style={styles.pathDescription}>
            {TRAINING_PATHS.MTT.description}
          </Paragraph>
          <View style={styles.targetContainer}>
            <Paragraph style={styles.targetLabel}>Ziel:</Paragraph>
            <Paragraph style={styles.targetText}>{TRAINING_PATHS.MTT.target}</Paragraph>
          </View>
          <View style={styles.keyPoints}>
            <Title style={styles.keyPointsTitle}>Fokus:</Title>
            <Paragraph style={styles.bullet}>• Stack-Tiefen-Triumvirat (Deep/Medium/Short)</Paragraph>
            <Paragraph style={styles.bullet}>• Push/Fold Meisterschaft (20bb, 15bb, 10bb)</Paragraph>
            <Paragraph style={styles.bullet}>• ICM Grundlagen (Bubble & Final Table)</Paragraph>
            <Paragraph style={styles.bullet}>• Re-Steal & 3-Bet Shove Strategy</Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Training', { path: 'MTT' })}
            style={[styles.button, { backgroundColor: TRAINING_PATHS.MTT.color }]}
          >
            Starte Pfad B
          </Button>
        </Card.Actions>
      </Card>

      {/* Quick Access */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Schnellzugriff</Title>
      </View>

      <View style={styles.quickAccess}>
        <Button
          mode="outlined"
          icon="grid"
          onPress={() => navigation.navigate('Ranges')}
          style={styles.quickButton}
        >
          Range Trainer
        </Button>
        <Button
          mode="outlined"
          icon="chart-line"
          onPress={() => navigation.navigate('Push/Fold')}
          style={styles.quickButton}
        >
          Push/Fold Charts
        </Button>
        <Button
          mode="outlined"
          icon="target"
          onPress={() => navigation.navigate('Exploits')}
          style={styles.quickButton}
        >
          Exploits Guide
        </Button>
      </View>

      {/* Critical Note */}
      <Card style={styles.noteCard}>
        <Card.Content>
          <Title style={styles.noteTitle}>⚠️ Kritische Empfehlung</Title>
          <Paragraph style={styles.noteText}>
            Diese App ist ein Lern- und Referenz-Tool. Für maximale Effizienz nutze zusätzlich
            professionelle GTO-Trainer wie:
          </Paragraph>
          <Paragraph style={styles.toolsList}>
            • GTO Wizard ($29-49/mo){'\n'}
            • DTO Poker ($25-40/mo){'\n'}
            • PokerCoaching.com ($49/mo)
          </Paragraph>
          <Paragraph style={styles.noteFooter}>
            Diese Tools bieten KI-Gegner, Hand-History-Analyse und kontextbezogenes Feedback,
            das weit über einfache Quiz-Apps hinausgeht.
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
  welcomeCard: {
    margin: 16,
    backgroundColor: '#2d5f3f',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pathCard: {
    margin: 16,
    marginTop: 8,
    borderLeftWidth: 4,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  chip: {
    marginLeft: 8,
  },
  pathSubtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 12,
  },
  pathDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  targetContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5f3f',
  },
  keyPoints: {
    marginTop: 8,
  },
  keyPointsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  button: {
    flex: 1,
    margin: 8,
  },
  quickAccess: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickButton: {
    marginBottom: 8,
  },
  noteCard: {
    margin: 16,
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 8,
    lineHeight: 20,
  },
  toolsList: {
    fontSize: 13,
    color: '#856404',
    fontFamily: 'monospace',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  noteFooter: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footer: {
    height: 40,
  },
});
