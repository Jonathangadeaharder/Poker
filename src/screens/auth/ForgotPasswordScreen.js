/**
 * Forgot Password Screen
 * Password reset request flow
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { validateEmail } from '../../utils/validation';
import apiClient from '../../services/apiClient';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handle password reset request
   */
  const handleResetRequest = async () => {
    setError('');
    setSuccess(false);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return;
    }

    setLoading(true);

    try {
      const result = await apiClient.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        includeAuth: false,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(
          result.error || 'Failed to send reset email. Please try again.'
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Sending reset email..." />;
  }

  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.instructionsText}>
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </Text>

            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            >
              Back to Login
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setSuccess(false);
                setEmail('');
              }}
              style={styles.resendButton}
            >
              Didn't receive email? Try again
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries, we'll send you reset instructions
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!error}
              disabled={loading}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              placeholder="Enter your email address"
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleResetRequest}
              disabled={loading || !email}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              Send Reset Link
            </Button>

            {/* Back to Login */}
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
              style={styles.backToLoginButton}
              icon="arrow-left"
            >
              Back to Login
            </Button>
          </Card.Content>
        </Card>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Trouble accessing your account?</Text>
          <Text style={styles.helpText}>
            • Make sure you're using the email you registered with
          </Text>
          <Text style={styles.helpText}>
            • Check your spam folder if you don't see the email
          </Text>
          <Text style={styles.helpText}>
            • Contact support if you need additional help
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  backToLoginButton: {
    marginTop: 16,
  },
  helpContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 4,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendButton: {
    marginTop: 8,
  },
});
