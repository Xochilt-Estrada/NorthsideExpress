// app/screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { BaseStyles, AuthStyles, FormStyles, Theme } from '../styles';

const { Colors } = Theme;

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [resetUrl, setResetUrl] = useState('');

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📧 Sending forgot password request to:', API_URL);
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });

      setIsLoading(false);

      if (response.data.success) {
        // Mobile app: Use the token directly from response
        if (response.data.token) {
          const resetToken = response.data.token;
          setResetToken(resetToken);
          
          Alert.alert(
            'Reset Link Generated',
            'A password reset token has been generated. Click OK to go to the reset screen.',
            [
              {
                text: 'Go to Reset Screen',
                onPress: () => navigation.navigate('ResetPassword', { 
                  resetToken: resetToken 
                })
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          
          // Also show debug info if available
          if (response.data.debug) {
            console.log('🔐 Reset Token:', response.data.debug.resetToken);
            console.log('🔗 Web Test URL:', response.data.debug.webTestUrl);
            setResetUrl(response.data.debug.webTestUrl);
          }
        } else {
          Alert.alert(
            'Check Your Email',
            'If your email exists in our system, you will receive password reset instructions.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      } else {
        Alert.alert('Error', response.data.error || 'Something went wrong');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Forgot password error:', error);
      
      if (error.response) {
        Alert.alert('Error', error.response.data?.error || 'Server error');
      } else if (error.request) {
        Alert.alert('Connection Error', 'Cannot connect to server. Make sure backend is running!');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={BaseStyles.container}
    >
      <ScrollView contentContainerStyle={BaseStyles.scrollContent}>
        <View style={BaseStyles.background}>
          <Text style={[BaseStyles.coffeeIconBg, { fontSize: 60 }]}>🔐</Text>
        </View>

        <View style={BaseStyles.content}>
          <View style={BaseStyles.logoContainer}>
            <Text style={BaseStyles.logoIcon}>☕</Text>
            <Text style={BaseStyles.logoText}>Reset Password</Text>
            <Text style={BaseStyles.logoSubtext}>Brew & Bean Café</Text>
          </View>

          <View style={BaseStyles.card}>
            <Text style={BaseStyles.title}>Forgot Password?</Text>
            <Text style={BaseStyles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <View style={BaseStyles.platformInfo}>
              <Text style={BaseStyles.platformText}>
                Platform: {Platform.OS.toUpperCase()}
              </Text>
              <Text style={BaseStyles.apiUrlText}>
                API: {API_URL}
              </Text>
            </View>

            <View style={BaseStyles.inputGroup}>
              <Text style={BaseStyles.label}>Email Address</Text>
              <TextInput
                style={BaseStyles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.lightBrown}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[BaseStyles.buttonPrimary, isLoading && BaseStyles.buttonDisabled]}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={BaseStyles.buttonTextPrimary}>Send Reset Instructions</Text>
              )}
            </TouchableOpacity>

            {resetToken && (
              <View style={[BaseStyles.infoBox, BaseStyles.infoInfo]}>
                <Text style={[BaseStyles.infoTitle, { color: '#1565C0' }]}>
                  🔧 Development Mode:
                </Text>
                <Text style={[BaseStyles.infoText, { 
                  color: '#1976D2',
                  fontFamily: 'monospace',
                  fontSize: 12 
                }]}>
                  Token: {resetToken.substring(0, 30)}...
                </Text>
                <TouchableOpacity
                  style={AuthStyles.copyButton}
                  onPress={() => {
                    // Copy to clipboard functionality would go here
                    Alert.alert('Copied', 'Token copied to clipboard');
                  }}
                >
                  <Text style={AuthStyles.copyButtonText}>Copy Token</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={BaseStyles.link}
              onPress={() => navigation.goBack()}
            >
              <Text style={BaseStyles.linkText}>← Back to Login</Text>
            </TouchableOpacity>

            <View style={[BaseStyles.infoBox, BaseStyles.infoWarning]}>
              <Text style={[BaseStyles.infoTitle, { color: Colors.primaryBrown }]}>
                💡 Note:
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Reset tokens expire in 10 minutes
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Check backend console for the reset link
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • In production, links are sent via email
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// REMOVE THE ENTIRE StyleSheet.create SECTION