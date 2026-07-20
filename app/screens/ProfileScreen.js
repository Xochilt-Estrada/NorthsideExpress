// app/screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Switch,
  Platform
} from 'react-native';
import { ProfileStyles, Theme } from '../styles';
import axios from 'axios'; // ADD THIS LINE
import { API_URL } from '../config/api'; // This should work now

const { Colors } = Theme;

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user || {
    name: 'Coffee Lover',
    email: 'user@example.com',
    favoriteDrink: 'Latte',
    totalOrders: 5,
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedFavoriteDrink, setEditedFavoriteDrink] = useState(user.favoriteDrink || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderUpdatesEnabled, setOrderUpdatesEnabled] = useState(true);
  const [promoEmailsEnabled, setPromoEmailsEnabled] = useState(false);

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully!',
      [{ text: 'OK', onPress: () => setIsEditing(false) }]
    );
    
    console.log('Profile updated:', {
      name: editedName,
      favoriteDrink: editedFavoriteDrink,
    });
  };

  const handleLogout = () => {
    console.log('🟢 handleLogout function called');
    
    // For web, use window.confirm
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        console.log('🚪 User confirmed logout on web');
        // Clear any web storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
        }
        navigation.navigate('Login');
      } else {
        console.log('❌ User cancelled logout');
      }
    } else {
      // For mobile
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => console.log('Cancel pressed') },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: () => {
              console.log('Logout pressed');
              navigation.navigate('Login');
            }
          }
        ]
      );
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature is coming soon!',
      [{ text: 'OK' }]
    );
  };

const handleDeleteAccount = () => {
  console.log('🟢 Delete Account button clicked!');
  
  // For WEB - use window.prompt instead
  if (Platform.OS === 'web') {
    const confirmation = window.prompt(
      'Delete Account\n\n' +
      'This action is permanent and cannot be undone.\n\n' +
      'To confirm, please type "delete my account" below:'
    );
    
    if (!confirmation || confirmation.trim().toLowerCase() !== 'delete my account') {
      Alert.alert('Invalid Confirmation', 'Please type "delete my account" exactly to confirm.');
      return;
    }
    
    const password = window.prompt('Enter Password\n\nPlease enter your password to confirm account deletion:', '');
    
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    
    Alert.alert(
      'Final Confirmation',
      'Are you absolutely sure? This will:\n\n• Permanently delete your account\n• Remove all your data\n• Cancel any pending orders\n• This action cannot be undone',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Delete Permanently', style: 'destructive', onPress: () => deleteAccount(password, confirmation) }
      ]
    );
  } else {
    // For mobile - use Alert.prompt
    Alert.prompt(
      'Delete Account',
      'This action is permanent and cannot be undone.\n\nTo confirm, please type "delete my account" below:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async (confirmation) => {
            if (!confirmation || confirmation.trim().toLowerCase() !== 'delete my account') {
              Alert.alert(
                'Invalid Confirmation',
                'Please type "delete my account" exactly to confirm.',
                [{ text: 'OK' }]
              );
              return;
            }
            
            Alert.prompt(
              'Enter Password',
              'Please enter your password to confirm account deletion:',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Delete Account',
                  style: 'destructive',
                  onPress: async (password) => {
                    if (!password) {
                      Alert.alert('Error', 'Password is required');
                      return;
                    }
                    
                    Alert.alert(
                      'Final Confirmation',
                      'Are you absolutely sure? This will:\n\n• Permanently delete your account\n• Remove all your data\n• Cancel any pending orders\n• This action cannot be undone',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'Yes, Delete Permanently',
                          style: 'destructive',
                          onPress: () => deleteAccount(password, confirmation)
                        }
                      ]
                    );
                  }
                }
              ],
              'secure-text'
            );
          }
        }
      ],
      'plain-text',
      ''
    );
  }
};

const deleteAccount = async (password, confirmation) => {
  try {
    Alert.alert(
      'Deleting Account',
      'Please wait while we securely delete your account...'
    );
    
    const response = await axios.delete(`${API_URL}/auth/delete-account`, {
      data: {
        email: user.email,
        password: password,
        confirmation: confirmation
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      Alert.alert(
        'Account Deleted',
        response.data.message || 'Your account has been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen and clear any stored tokens
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
              });
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', response.data.error || 'Failed to delete account');
    }
  } catch (error) {
    console.error('Delete account error:', error);
    
    if (error.response) {
      Alert.alert(
        'Deletion Failed',
        error.response.data?.error || 'Could not delete account'
      );
    } else if (error.request) {
      Alert.alert(
        'Connection Error',
        'Cannot connect to server. Please check your internet connection.'
      );
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }
};

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  // Get user's initials for avatar
  const getUserInitials = () => {
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={ProfileStyles.container}>
      {/* Header */}
      <View style={ProfileStyles.header}>
        <TouchableOpacity 
          style={ProfileStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={ProfileStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={ProfileStyles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={ProfileStyles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={ProfileStyles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={ProfileStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={ProfileStyles.profileCard}>
          <View style={ProfileStyles.avatarContainer}>
            <View style={ProfileStyles.avatar}>
              <Text style={ProfileStyles.avatarText}>
                {getUserInitials()}
              </Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={ProfileStyles.changePhotoButton}>
                <Text style={ProfileStyles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* User Info */}
          <View style={ProfileStyles.infoSection}>
            <Text style={ProfileStyles.sectionLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={ProfileStyles.textInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textLight}
              />
            ) : (
              <Text style={ProfileStyles.infoText}>{user.name}</Text>
            )}
          </View>

          <View style={ProfileStyles.infoSection}>
            <Text style={ProfileStyles.sectionLabel}>Email</Text>
            <Text style={ProfileStyles.infoText}>{user.email}</Text>
            <Text style={ProfileStyles.emailNote}>Email cannot be changed</Text>
          </View>

          <View style={ProfileStyles.infoSection}>
            <Text style={ProfileStyles.sectionLabel}>Start Date</Text>
            {isEditing ? (
              <TextInput
                style={ProfileStyles.textInput}
                value={editedFavoriteDrink}
                onChangeText={setEditedFavoriteDrink}
                placeholder="e.g., Latte, Cappuccino, etc."
                placeholderTextColor={Colors.textLight}
              />
            ) : (
              <Text style={ProfileStyles.infoText}>
                {user.favoriteDrink || 'Not set'}
              </Text>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={ProfileStyles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={ProfileStyles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={ProfileStyles.statsCard}>
          <Text style={ProfileStyles.statsTitle}>Your Stats</Text>
          <View style={ProfileStyles.statsGrid}>
            <View style={ProfileStyles.statItem}>
              <Text style={ProfileStyles.statNumber}>{user.totalOrders}</Text>
              <Text style={ProfileStyles.statLabel}>Total Orders</Text>
            </View>
            <View style={ProfileStyles.statDivider} />
            <View style={ProfileStyles.statItem}>
              <Text style={ProfileStyles.statNumber}>{memberSince}</Text>
              <Text style={ProfileStyles.statLabel}>Member Since</Text>
            </View>
            <View style={ProfileStyles.statDivider} />
            <View style={ProfileStyles.statItem}>
              <Text style={ProfileStyles.statNumber}>⭐ 4.8</Text>
              <Text style={ProfileStyles.statLabel}>Avg. Rating</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={ProfileStyles.preferencesCard}>
          <Text style={ProfileStyles.preferencesTitle}>Preferences</Text>
          
          <View style={ProfileStyles.preferenceItem}>
            <View>
              <Text style={ProfileStyles.preferenceLabel}>Push Notifications</Text>
              <Text style={ProfileStyles.preferenceDescription}>Receive order updates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.borderMedium, true: Colors.primaryBlue }}
              thumbColor={Colors.textWhite}
            />
          </View>

          <View style={ProfileStyles.preferenceItem}>
            <View>
              <Text style={ProfileStyles.preferenceLabel}>Order Updates</Text>
              <Text style={ProfileStyles.preferenceDescription}>When your order is ready</Text>
            </View>
            <Switch
              value={orderUpdatesEnabled}
              onValueChange={setOrderUpdatesEnabled}
              trackColor={{ false: Colors.borderMedium, true: Colors.primaryBlue }}
              thumbColor={Colors.textWhite}
            />
          </View>

          <View style={ProfileStyles.preferenceItem}>
            <View>
              <Text style={ProfileStyles.preferenceLabel}>Promotional Emails</Text>
              <Text style={ProfileStyles.preferenceDescription}>Special offers & deals</Text>
            </View>
            <Switch
              value={promoEmailsEnabled}
              onValueChange={setPromoEmailsEnabled}
              trackColor={{ false: Colors.borderMedium, true: Colors.primaryBlue }}
              thumbColor={Colors.textWhite}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={ProfileStyles.actionsCard}>
          <Text style={ProfileStyles.actionsTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={ProfileStyles.actionButton}
            onPress={handleChangePassword}
          >
            <Text style={ProfileStyles.actionIcon}>🔐</Text>
            <Text style={ProfileStyles.actionText}>Change Password</Text>
            <Text style={ProfileStyles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={ProfileStyles.actionButton}
            onPress={() => Alert.alert('Payment Methods', 'Coming soon!')}
          >
            <Text style={ProfileStyles.actionIcon}>💳</Text>
            <Text style={ProfileStyles.actionText}>Payment Methods</Text>
            <Text style={ProfileStyles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={ProfileStyles.actionButton}
            onPress={() => Alert.alert('Order History', 'Coming soon!')}
          >
            <Text style={ProfileStyles.actionIcon}>📋</Text>
            <Text style={ProfileStyles.actionText}>Order History</Text>
            <Text style={ProfileStyles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={ProfileStyles.actionButton}
            onPress={() => Alert.alert('Help & Support', 'Coming soon!')}
          >
            <Text style={ProfileStyles.actionIcon}>❓</Text>
            <Text style={ProfileStyles.actionText}>Help & Support</Text>
            <Text style={ProfileStyles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={ProfileStyles.dangerCard}>
          <Text style={ProfileStyles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={ProfileStyles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={ProfileStyles.dangerIcon}>🗑️</Text>
            <Text style={ProfileStyles.dangerText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[ProfileStyles.dangerButton, ProfileStyles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={ProfileStyles.dangerIcon}>🚪</Text>
            <Text style={ProfileStyles.dangerText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={ProfileStyles.appInfo}>
          <Text style={ProfileStyles.appName}>Northside Express</Text>
          <Text style={ProfileStyles.appVersion}>Version 1.0.0</Text>
          <Text style={ProfileStyles.appCopyright}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

