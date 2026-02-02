/**
 * ErrorMessage Component
 * Standardized error display with retry functionality
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

export function ErrorMessage({
  error,
  onRetry,
  title = 'Something went wrong',
  style,
}) {
  const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred';

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{errorMessage}</Text>

          {onRetry && (
            <Button
              mode="contained"
              onPress={onRetry}
              style={styles.button}
            >
              Try Again
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    maxWidth: 400,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});

export default ErrorMessage;
