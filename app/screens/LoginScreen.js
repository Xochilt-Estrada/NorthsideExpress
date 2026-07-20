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
import { BaseStyles, AuthStyles, Theme } from '../styles';

const { Colors } = Theme;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      setIsLoading(false);
      
      if (response.data.success) {
        navigation.navigate('Home', {user: response.data.user});
      } else {
        Alert.alert('Error', response.data.error || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      
      if (error.response) {
        Alert.alert('Login Failed', error.response.data.error || 'Invalid credentials');
      } else if (error.request) {
        Alert.alert('Connection Error', 'Cannot connect to server. Please try again later.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupPress = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={BaseStyles.container}
    >
      {/* Coffee-themed Background */}
      <View style={BaseStyles.background}>
        <Text style={BaseStyles.coffeeIconBg}>☕</Text>
      </View>

      {/* Wrap content in ScrollView */}
      <ScrollView 
        contentContainerStyle={BaseStyles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={BaseStyles.content}>
          {/* Logo Section */}
          <View style={BaseStyles.logoContainer}>
            <Text style={BaseStyles.logoIcon}>🚚</Text>
            <Text style={BaseStyles.logoText}>Northside Express</Text>
            <Text style={BaseStyles.logoSubtext}>Trucking</Text>
          </View>

          {/* Login Card */}
          <View style={BaseStyles.card}>
            <Text style={BaseStyles.title}>Welcome Back</Text>
            <Text style={BaseStyles.subtitle}>Sign in to your account</Text>

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
                  placeholder="Enter your password"
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
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[BaseStyles.buttonPrimary, isLoading && BaseStyles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={BaseStyles.buttonTextPrimary}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={BaseStyles.link}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={BaseStyles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={BaseStyles.divider}>
              <View style={BaseStyles.dividerLine} />
              <Text style={BaseStyles.dividerText}>or</Text>
              <View style={BaseStyles.dividerLine} />
            </View>

            {/* Signup Link */}
            <View style={AuthStyles.loginContainer}>
              <Text style={AuthStyles.loginText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignupPress} disabled={isLoading}>
                <Text style={AuthStyles.loginLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[BaseStyles.link, { marginTop: 20 }]}
              onPress={() => navigation.navigate('AdminLogin')}
              disabled={isLoading}
            >
              <Text style={[BaseStyles.linkText, { color: Colors.darkBrown, fontWeight: 'bold' }]}>
                Admin Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}