// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './app/screens/ResetPasswordScreen';
import HomeScreen from './app/screens/HomeScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import ReportAccidentScreen from './app/screens/ReportAccidentScreen';
import AccidentHistoryScreen from './app/screens/AccidentHistoryScreen';
import AdminLoginScreen from './app/screens/AdminLoginScreen';
import AdminDashboardScreen from './app/screens/AdminDashboardScreen';
import AdminAccidentReportsScreen from './app/screens/AdminAccidentReportsScreen,';
import AdminUsersScreen from './app/screens/AdminUsersScreen';
import CalendarScreen from './app/screens/CalendarScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ReportAccident" component={ReportAccidentScreen} />
        <Stack.Screen name="AccidentHistory" component={AccidentHistoryScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen}/>
        <Stack.Screen name="AdminAccidentReports" component={AdminAccidentReportsScreen}/>
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen}/>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}