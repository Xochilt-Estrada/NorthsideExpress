// app/screens/ResetPasswordScreen.js
import React, { useState, useEffect } from 'react';
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

export default function ResetPasswordScreen({ route, navigation }) {
  const { resetToken } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (resetToken) {
      verifyResetToken();
    } else {
      Alert.alert('Error', 'No reset token provided');
      navigation.goBack();
    }
  }, [resetToken]);

  const verifyResetToken = async () => {
    try {
      console.log('🔐 Verifying token with API:', API_URL);
      const response = await axios.get(
        `${API_URL}/auth/verify-reset-token/${resetToken}`
      );

      setIsValidating(false);
      
      if (response.data.success && response.data.isValid) {
        setTokenValid(true);
        setUserEmail(response.data.user.email);
      } else {
        setTokenValid(false);
        Alert.alert(
          'Invalid Token',
          'This password reset link is invalid or has expired.',
          [{ text: 'OK', onPress: () => navigation.navigate('ForgotPassword') }]
        );
      }
    } catch (error) {
      setIsValidating(false);
      setTokenValid(false);
      console.error('Token verification error:', error);
      Alert.alert('Error', 'Failed to verify reset token. API URL: ' + API_URL);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Resetting password with API:', API_URL);
      const response = await axios.put(
        `${API_URL}/auth/reset-password/${resetToken}`,
        { password }
      );

      setIsLoading(false);

      if (response.data.success) {
        Alert.alert(
          'Success!',
          'Your password has been reset successfully!',
          [
            {
              text: 'Login Now',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.error || 'Failed to reset password');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Reset password error:', error);
      
      if (error.response) {
        Alert.alert('Error', error.response.data?.error || 'Server error');
      } else if (error.request) {
        Alert.alert('Connection Error', 'Cannot connect to server');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isValidating) {
    return (
      <View style={BaseStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBrown} />
        <Text style={BaseStyles.loadingText}>Verifying reset token...</Text>
      </View>
    );
  }

  if (!tokenValid) {
    return (
      <View style={BaseStyles.errorContainer}>
        <Text style={BaseStyles.errorIcon}>❌</Text>
        <Text style={BaseStyles.errorTitle}>Invalid Reset Link</Text>
        <Text style={BaseStyles.errorText}>
          This password reset link is invalid or has expired.
        </Text>
        <TouchableOpacity
          style={BaseStyles.errorButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={BaseStyles.errorButtonText}>Request New Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            <Text style={BaseStyles.logoText}>New Password</Text>
            <Text style={BaseStyles.logoSubtext}>Brew & Bean Café</Text>
          </View>

          <View style={BaseStyles.card}>
            <Text style={BaseStyles.title}>Create New Password</Text>
            <Text style={BaseStyles.subtitle}>
              Reset password for: {userEmail}
            </Text>

            <View style={BaseStyles.platformInfo}>
              <Text style={BaseStyles.platformText}>
                Platform: {Platform.OS.toUpperCase()}
              </Text>
              <Text style={BaseStyles.apiUrlText}>
                API: {API_URL}
              </Text>
            </View>

            {/* New Password Input */}
            <View style={BaseStyles.inputGroup}>
              <View style={BaseStyles.passwordLabelContainer}>
                <Text style={BaseStyles.label}>New Password</Text>
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Text style={BaseStyles.showHideText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={BaseStyles.passwordContainer}>
                <TextInput
                  style={[BaseStyles.input, BaseStyles.passwordInput]}
                  placeholder="Enter new password (min. 6 characters)"
                  placeholderTextColor={Colors.lightBrown}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={BaseStyles.eyeButton}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={BaseStyles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={BaseStyles.inputGroup}>
              <View style={BaseStyles.passwordLabelContainer}>
                <Text style={BaseStyles.label}>Confirm Password</Text>
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <Text style={BaseStyles.showHideText}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={BaseStyles.passwordContainer}>
                <TextInput
                  style={[BaseStyles.input, BaseStyles.passwordInput]}
                  placeholder="Re-enter your new password"
                  placeholderTextColor={Colors.lightBrown}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={BaseStyles.eyeButton}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Text style={BaseStyles.eyeIcon}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[BaseStyles.buttonPrimary, isLoading && BaseStyles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={BaseStyles.buttonTextPrimary}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* Security Info */}
            <View style={[BaseStyles.infoBox, BaseStyles.infoSuccess]}>
              <Text style={[BaseStyles.infoTitle, { color: '#2E7D32' }]}>
                🔒 Password Requirements:
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.success }]}>
                • Minimum 6 characters
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.success }]}>
                • Use a mix of letters and numbers
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.success }]}>
                • Avoid common passwords
              </Text>
            </View>

            <TouchableOpacity
              style={BaseStyles.link}
              onPress={() => navigation.goBack()}
            >
              <Text style={BaseStyles.linkText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

