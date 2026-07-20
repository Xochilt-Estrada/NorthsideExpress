// app/config/api.js - KEEPING MOBILE WORKING, FIXING WEB
import { Platform } from 'react-native';

const getLocalIP = () => {
  return '10.0.0.6'; // Your computer's IP
};

export const API_CONFIG = {
  development: {
    androidEmulator: 'http://10.0.2.2:5001/api',
    iosSimulator: 'http://localhost:5001/api',
    web: 'http://localhost:5001/api', // Web needs localhost
    realDevice: `http://${getLocalIP()}:5001/api`  // Mobile needs IP
  },
  production: {
    default: 'https://your-production-api.com/api'
  }
};

// SIMPLE FIX: Separate web from mobile
export const getApiUrl = () => {
  if (__DEV__) {
    // For WEB - use localhost
    if (Platform.OS === 'web') {
      console.log('🌐 Using WEB URL (localhost)');
      return API_CONFIG.development.web;
    }
    
    // For MOBILE (iOS or Android) - use real device IP
    // This keeps your phone working
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      console.log('📱 Using REAL DEVICE URL with IP:', getLocalIP());
      return API_CONFIG.development.realDevice;
    }
    
    // Default fallback
    return API_CONFIG.development.realDevice;
  }
  
  // Production
  return API_CONFIG.production.default;
};

export const API_URL = getApiUrl();