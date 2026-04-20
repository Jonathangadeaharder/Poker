/**
 * Hand History Upload Screen
 * Upload and analyze poker hand histories
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import apiClient from '../services/apiClient';

export default function HandHistoryScreen({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [handHistories, setHandHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('pokerstars');

  const supportedFormats = [
    { id: 'pokerstars', name: 'PokerStars', extension: '.txt' },
    { id: 'ggpoker', name: 'GGPoker', extension: '.txt' },
    { id: '888poker', name: '888poker', extension: '.txt' },
    { id: 'partypoker', name: 'partypoker', extension: '.txt' },
    { id: 'winamax', name: 'Winamax', extension: '.txt' },
  ];

  useEffect(() => {
    loadHandHistories();
  }, []);

  /**
   * Load hand history list
   */
  const loadHandHistories = async () => {
    setLoading(true);
    const result = await apiClient.getHandHistoryList();

    if (result.success) {
      setHandHistories(result.data.hands || []);
    } else {
      console.log('Failed to load hand histories:', result.error);
    }

    setLoading(false);
  };

  /**
   * Pick and upload hand history file
   */
  const pickAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') {
        return;
      }

      // Verify file
      if (!result.name.endsWith('.txt')) {
        Alert.alert('Error', 'Please select a .txt file');
        return;
      }

      // Confirm upload
      Alert.alert(
        'Upload Hand History',
        `File: ${result.name}\nFormat: ${selectedFormat}\n\nProceed with upload?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upload',
            onPress: () => uploadFile(result),
          },
        ]
      );

    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  /**
   * Upload file to server
   */
  const uploadFile = async (file) => {
    setUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('handHistory', {
        uri: file.uri,
        type: 'text/plain',
        name: file.name,
      });
      formData.append('format', selectedFormat);

      const result = await apiClient.uploadHandHistory(file, selectedFormat);

      if (result.success) {
        Alert.alert(
          'Success',
          `Hand history uploaded!\n\n${result.data.handsFound} hands found.\nAnalysis will be available shortly.`
        );

        // Reload list
        loadHandHistories();
      } else {
        Alert.alert('Upload Failed', result.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  /**
   * View hand analysis
   */
  const viewHandAnalysis = async (handId) => {
    navigation.navigate('HandAnalysis', { handId });
  };

  /**
   * Request AI analysis
   */
  const requestAnalysis = async (handId) => {
    Alert.alert(
      'Request Analysis',
      'Choose analysis type:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'GTO Analysis',
          onPress: async () => {
            const result = await apiClient.requestHandAnalysis(handId, 'gto');
            if (result.success) {
              Alert.alert('Success', 'GTO analysis queued! Check back in a few minutes.');
            }
          },
        },
        {
          text: 'Exploitative Analysis',
          onPress: async () => {
            const result = await apiClient.requestHandAnalysis(handId, 'exploitative');
            if (result.success) {
              Alert.alert('Success', 'Exploitative analysis queued!');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hand History Analyzer</Text>
        <Text style={styles.subtitle}>
          Upload your hand histories for detailed analysis
        </Text>
      </View>

      {/* Format Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Poker Room Format:</Text>
        <View style={styles.formatGrid}>
          {supportedFormats.map(format => (
            <TouchableOpacity
              key={format.id}
              style={[
                styles.formatButton,
                selectedFormat === format.id && styles.formatButtonSelected,
              ]}
              onPress={() => setSelectedFormat(format.id)}
            >
              <Text
                style={[
                  styles.formatButtonText,
                  selectedFormat === format.id && styles.formatButtonTextSelected,
                ]}
              >
                {format.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
        onPress={pickAndUploadFile}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.uploadButtonText}>📄 Upload Hand History</Text>
            <Text style={styles.uploadButtonSubtext}>Select .txt file</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>How to export hand histories:</Text>
        <Text style={styles.instructionsText}>
          <Text style={styles.bold}>PokerStars:</Text> Lobby → Tools → Instant Hand History →
          Request hands → Download .txt file{'\n\n'}
          <Text style={styles.bold}>GGPoker:</Text> My Game → Hand History → Export →
          Select date range{'\n\n'}
          <Text style={styles.bold}>888poker:</Text> Lobby → My Account → Hand History →
          Download
        </Text>
      </View>

      {/* Hand History List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Hand Histories</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : handHistories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hand histories uploaded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Upload your first hand history to get started!
            </Text>
          </View>
        ) : (
          handHistories.map(hand => (
            <View key={hand.id} style={styles.handCard}>
              <View style={styles.handCardHeader}>
                <Text style={styles.handCardTitle}>{hand.fileName}</Text>
                <Text style={styles.handCardDate}>
                  {new Date(hand.uploadedAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.handCardStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Hands</Text>
                  <Text style={styles.statValue}>{hand.handsCount}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Format</Text>
                  <Text style={styles.statValue}>{hand.format}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Status</Text>
                  <Text style={[
                    styles.statValue,
                    hand.analyzed ? styles.statusAnalyzed : styles.statusPending,
                  ]}>
                    {hand.analyzed ? 'Analyzed' : 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={styles.handCardActions}>
                {hand.analyzed ? (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => viewHandAnalysis(hand.id)}
                  >
                    <Text style={styles.actionButtonText}>View Analysis</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => requestAnalysis(hand.id)}
                  >
                    <Text style={styles.actionButtonTextSecondary}>
                      Request Analysis
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  formatButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  formatButtonTextSelected: {
    color: '#fff',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  instructionsBox: {
    backgroundColor: '#fff9e6',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  loader: {
    marginVertical: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  handCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  handCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  handCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  handCardDate: {
    fontSize: 12,
    color: '#999',
  },
  handCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusAnalyzed: {
    color: '#4caf50',
  },
  statusPending: {
    color: '#ff9800',
  },
  handCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
