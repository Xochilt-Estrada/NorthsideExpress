// app/screens/RegisterScreen.js
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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const testBackendConnection = async () => {
    console.log('Testing connection to backend...');
    try {
      const baseUrl = API_URL.replace('/api', '');
      const response = await axios.get(baseUrl);
      console.log('✅ Backend reachable:', response.data);
      Alert.alert('✅ Success', 'Backend is reachable!');
    } catch (error) {
      console.error('❌ Cannot reach backend:', error.message);
      Alert.alert('❌ Failed', `Cannot reach backend: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
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

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Registering:', email);
      console.log('🌐 API URL:', API_URL); 
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });

      setIsLoading(false);

      if (response.data.success) {
        console.log('✅ Registration successful:', response.data);
        Alert.alert(
          'Account Created!',
          `Welcome to Brew & Bean, ${response.data.user.name}!`,
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', response.data.error || 'Something went wrong');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      
      if (error.response) {
        Alert.alert('Registration Failed', error.response.data?.error || 'Server error');
      } else if (error.request) {
        Alert.alert('Connection Error', 'Cannot connect to server');
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
          <Text style={BaseStyles.coffeeIconBg}>☕</Text>
        </View>

        <View style={BaseStyles.content}>
          {/* Logo Section */}
          <View style={BaseStyles.logoContainer}>
            <Text style={BaseStyles.logoIcon}>☕</Text>
            <Text style={BaseStyles.logoText}>Brew & Bean</Text>
            <Text style={BaseStyles.logoSubtext}>Create Account</Text>
          </View>

          {/* Registration Form */}
          <View style={BaseStyles.card}>
            <Text style={BaseStyles.title}>Join Our Café</Text>
            <Text style={BaseStyles.subtitle}>Create your account to start ordering</Text>

            <View style={BaseStyles.platformInfo}>
              <Text style={BaseStyles.platformText}>
                Platform: {Platform.OS.toUpperCase()}
              </Text>
              <Text style={BaseStyles.apiUrlText}>
                API: {API_URL}
              </Text>
            </View>

            {/* Name Input */}
            <View style={BaseStyles.inputGroup}>
              <Text style={BaseStyles.label}>Full Name</Text>
              <TextInput
                style={BaseStyles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.lightBrown}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            {/* Email Input */}
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

            {/* Password Input with Toggle */}
            <View style={BaseStyles.inputGroup}>
              <View style={BaseStyles.passwordLabelContainer}>
                <Text style={BaseStyles.label}>Password</Text>
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Text style={BaseStyles.showHideText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={BaseStyles.passwordContainer}>
                <TextInput
                  style={[BaseStyles.input, BaseStyles.passwordInput]}
                  placeholder="Create a password (min. 6 characters)"
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

            {/* Confirm Password Input with Toggle */}
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
                  placeholder="Re-enter your password"
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

            {/* Register Button */}
            <TouchableOpacity
              style={[BaseStyles.buttonPrimary, isLoading && BaseStyles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={BaseStyles.buttonTextPrimary}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Test Backend Button */}
            <TouchableOpacity
              style={[AuthStyles.testButton, isLoading && BaseStyles.buttonDisabled]}
              onPress={testBackendConnection}
              disabled={isLoading}
            >
              <Text style={AuthStyles.testButtonText}>Test Backend Connection</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={AuthStyles.loginContainer}>
              <Text style={AuthStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={AuthStyles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Info */}
            <View style={[BaseStyles.infoBox, BaseStyles.infoWarning]}>
              <Text style={[BaseStyles.infoTitle, { color: Colors.primaryBrown }]}>
                💡 Demo Notes:
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Use any email (must include @ and .)
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Password must be 6+ characters
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Passwords must match
              </Text>
              <Text style={[BaseStyles.infoText, { color: Colors.secondaryBrown }]}>
                • Try: test@test.com / test123
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

