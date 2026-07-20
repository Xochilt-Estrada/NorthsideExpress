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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';
import { BaseStyles, AuthStyles, Theme } from '../styles';

const { Colors } = Theme;

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 



const handleAdminLogin = async () => {
  console.log('🔍 === DEBUG START ===');
  console.log('Platform:', Platform.OS);
  console.log('API_URL from config:', API_URL);
  console.log('Full login URL:', `${API_URL}/auth/admin/login`);
  console.log('=== DEBUG END ===');

  if (!email.trim() || !password.trim()) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  setIsLoading(true);
  
  try {
    const response = await axios.post(`${API_URL}/auth/admin/login`, {
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
    
    console.log('✅ Login response received:', response.data);
    
    if (response.data.success) {
      console.log('🎉 Login successful! Storing data...');
      
      // STORE THE ADMIN TOKEN AND DATA
      await AsyncStorage.setItem('adminToken', response.data.token);
      await AsyncStorage.setItem('adminData', JSON.stringify(response.data.user));
      
      // For WEB: Also store in localStorage
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.user));
        console.log('💾 Saved to localStorage');
      }
      
      console.log('🗺️ Navigating to AdminDashboard...');
      
      // FIX: Don't use Alert.alert() for success on web - it blocks navigation
      // Instead, navigate immediately and show a toast/snackbar if needed
      
      // Clear the form
      setEmail('');
      setPassword('');
      
      // Navigate directly without Alert
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard' }],
      });
      
    } else {
      Alert.alert('Error', response.data.error || 'Admin login failed');
    }
  } catch (error) {
    setIsLoading(false);
    console.error('🔥 Login error:', error);
    
    if (error.response) {
      if (error.response.status === 403) {
        Alert.alert('Access Denied', error.response.data.error || 'Admin privileges required');
      } else {
        Alert.alert('Login Failed', error.response.data.error || 'Invalid credentials');
      }
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

  const handleRegularLogin = () => {
    navigation.navigate('Login');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={BaseStyles.container}
    >
      {/* Coffee-themed Background */}
      <View style={BaseStyles.background}>
        <Text style={BaseStyles.coffeeIconBg}>👑</Text>
      </View>

      {/* Wrap content in ScrollView */}
      <ScrollView 
        contentContainerStyle={BaseStyles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={BaseStyles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
            <Text style={{ color: Colors.darkBrown, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={BaseStyles.logoContainer}>
            <Text style={BaseStyles.logoIcon}>👑</Text>
            <Text style={BaseStyles.logoText}>Brew & Bean</Text>
            <Text style={BaseStyles.logoSubtext}>Admin Panel</Text>
          </View>

          {/* Login Card */}
          <View style={BaseStyles.card}>
            <Text style={BaseStyles.title}>Admin Access</Text>
            <Text style={BaseStyles.subtitle}>Restricted area - authorized personnel only</Text>

            {/* Email Input */}
            <View style={BaseStyles.inputGroup}>
              <Text style={BaseStyles.label}>Admin Email</Text>
              <TextInput
                style={BaseStyles.input}
                placeholder="admin@brewbean.com"
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
                <Text style={BaseStyles.label}>Admin Password</Text>
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Text style={BaseStyles.showHideText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={BaseStyles.passwordContainer}>
                <TextInput
                  style={[BaseStyles.input, BaseStyles.passwordInput]}
                  placeholder="Enter admin password"
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

            {/* Admin Login Button */}
            <TouchableOpacity
              style={[BaseStyles.buttonPrimary, isLoading && BaseStyles.buttonDisabled]}
              onPress={handleAdminLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={BaseStyles.buttonTextPrimary}>Admin Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={BaseStyles.divider}>
              <View style={BaseStyles.dividerLine} />
              <Text style={BaseStyles.dividerText}>or</Text>
              <View style={BaseStyles.dividerLine} />
            </View>

            {/* Regular User Login Link */}
            <View style={AuthStyles.loginContainer}>
              <Text style={AuthStyles.loginText}>Regular user? </Text>
              <TouchableOpacity onPress={handleRegularLogin} disabled={isLoading}>
                <Text style={AuthStyles.loginLink}>User Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}