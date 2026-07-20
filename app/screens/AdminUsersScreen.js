// app/screens/AdminUsersScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';
import { AdminStyles, Theme } from '../styles';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { Colors, Sizes } = Theme;

export default function AdminUsersScreen({ navigation, route }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadTokenAndFetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, sortBy]);

  const loadTokenAndFetchUsers = async () => {
    try {
      let adminToken;
      if (Platform.OS === 'web') {
        adminToken = localStorage.getItem('adminToken') || await AsyncStorage.getItem('adminToken');
      } else {
        adminToken = await AsyncStorage.getItem('adminToken');
      }
      
      if (adminToken) {
        setToken(adminToken);
        fetchUsers(adminToken);
      } else {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => navigation.navigate('AdminLogin') }
        ]);
      }
    } catch (error) {
      console.error('Error loading token:', error);
      Alert.alert('Error', 'Failed to load session');
    }
  };

  const fetchUsers = async (authToken) => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const regularUsers = response.data.users.filter(user => user.role !== 'admin');
        setUsers(regularUsers);
        setFilteredUsers(regularUsers);
      } else {
        Alert.alert('Error', response.data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert('Access Denied', 'Your session has expired', [
          { text: 'OK', onPress: () => navigation.navigate('AdminLogin') }
        ]);
      } else {
        Alert.alert('Error', 'Failed to fetch users');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (token) {
      fetchUsers(token);
    }
  };

  const filterAndSortUsers = () => {
    let result = [...users];
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.truckNumber && user.truckNumber.toLowerCase().includes(query)) ||
        (user.company && user.company.toLowerCase().includes(query))
      );
    }
    
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'trips':
        result.sort((a, b) => b.totalTrips - a.totalTrips);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    setFilteredUsers(result);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleMakeAdmin = async () => {
    if (!selectedUser) return;
    
    Alert.alert(
      'Make Admin',
      `Are you sure you want to make ${selectedUser.name} an admin?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Make Admin', 
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              
              const response = await axios.put(
                `${API_URL}/admin/users/${selectedUser._id}/role`,
                { role: 'admin' },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (response.data.success) {
                Alert.alert('Success', `${selectedUser.name} is now an admin`);
                setUsers(users.filter(user => user._id !== selectedUser._id));
                setModalVisible(false);
              } else {
                Alert.alert('Error', response.data.error);
              }
            } catch (error) {
              console.error('Make admin error:', error);
              Alert.alert('Error', 'Failed to update user role');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleViewReports = (user) => {
    navigation.navigate('AdminUserReports', { userId: user._id, userName: user.name });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              
              const response = await axios.delete(
                `${API_URL}/admin/users/${selectedUser._id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (response.data.success) {
                Alert.alert('Success', 'User deleted successfully');
                setUsers(users.filter(user => user._id !== selectedUser._id));
                setModalVisible(false);
              } else {
                Alert.alert('Error', response.data.error);
              }
            } catch (error) {
              console.error('Delete user error:', error);
              Alert.alert('Error', 'Failed to delete user');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return Colors.accentRed;
      case 'medium': return '#F59E0B';
      case 'low': return '#059669';
      default: return Colors.textSecondary;
    }
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <View style={AdminStyles.loadingContainer}>
        <View style={AdminStyles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={AdminStyles.loadingText}>Loading users...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={AdminStyles.safeArea}>
      {/* Header */}
      <View style={AdminStyles.header}>
        <View style={AdminStyles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
          <View>
            <Text style={AdminStyles.welcomeText}>Manage</Text>
            <Text style={AdminStyles.adminName}>Users</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={AdminStyles.notificationButton}>
          <Ionicons name="refresh" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={AdminStyles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryBlue]}
            tintColor={Colors.primaryBlue}
          />
        }
      >
        {/* Search Bar */}
        <View style={{ padding: Sizes.lg }}>
          <View style={AdminStyles.usersSearchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={AdminStyles.usersSearchInput}
              placeholder="Search users by name, email, truck number..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Sort Options */}
        <View style={AdminStyles.usersSortContainer}>
          <Text style={AdminStyles.usersSortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 'recent', label: 'Most Recent', icon: 'time-outline' },
              { id: 'name', label: 'Name A-Z', icon: 'text-outline' },
              { id: 'trips', label: 'Most Trips', icon: 'car-outline' },
            ].map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  AdminStyles.usersFilterButton,
                  sortBy === option.id && AdminStyles.usersFilterActive
                ]}
                onPress={() => setSortBy(option.id)}
              >
                <Ionicons 
                  name={option.icon} 
                  size={16} 
                  color={sortBy === option.id ? Colors.textWhite : Colors.textPrimary} 
                />
                <Text style={[
                  AdminStyles.usersFilterText,
                  sortBy === option.id && { color: Colors.textWhite }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <View style={AdminStyles.usersEmptyState}>
            <Ionicons name="people-outline" size={60} color={Colors.borderMedium} />
            <Text style={AdminStyles.usersEmptyTitle}>No users found</Text>
            <Text style={AdminStyles.usersEmptyText}>
              {searchQuery ? 'Try a different search term' : 'No regular users in the system'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Sizes.lg }}>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user._id}
                style={AdminStyles.usersUserCard}
                onPress={() => handleUserPress(user)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* User Avatar */}
                  <View style={AdminStyles.usersUserAvatar}>
                    <Text style={AdminStyles.usersAvatarText}>
                      {getUserInitials(user.name)}
                    </Text>
                  </View>

                  {/* User Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={AdminStyles.usersUserName}>{user.name}</Text>
                    
                    <Text style={AdminStyles.usersUserEmail}>{user.email}</Text>

                    {/* User Details */}
                    <View style={AdminStyles.usersUserDetails}>
                      {user.truckNumber ? (
                        <View style={AdminStyles.usersDetailItem}>
                          <FontAwesome5 name="truck" size={12} color={Colors.textSecondary} />
                          <Text style={AdminStyles.usersDetailText}>{user.truckNumber}</Text>
                        </View>
                      ) : null}

                      {user.totalTrips > 0 ? (
                        <View style={AdminStyles.usersDetailItem}>
                          <Ionicons name="car-outline" size={12} color={Colors.textSecondary} />
                          <Text style={AdminStyles.usersDetailText}>{user.totalTrips} trips</Text>
                        </View>
                      ) : null}

                      {user.company ? (
                        <View style={AdminStyles.usersDetailItem}>
                          <Ionicons name="business-outline" size={12} color={Colors.textSecondary} />
                          <Text style={AdminStyles.usersDetailText}>{user.company}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </View>

                {/* Footer */}
                <View style={AdminStyles.usersUserFooter}>
                  <Text style={AdminStyles.usersJoinDate}>Joined {formatDate(user.createdAt)}</Text>

                  <TouchableOpacity 
                    style={AdminStyles.usersViewReportsButton}
                    onPress={() => handleViewReports(user)}
                  >
                    <Text style={AdminStyles.usersViewReportsText}>View Reports</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={AdminStyles.bottomSpacing} />
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={AdminStyles.usersModalOverlay}>
          <View style={AdminStyles.usersModalContainer}>
            {selectedUser && (
              <>
                {/* Modal Header */}
                <View style={AdminStyles.usersModalHeader}>
                  <Text style={AdminStyles.usersModalTitle}>User Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* User Info */}
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '90%' }}>
                  <View style={AdminStyles.usersModalAvatarContainer}>
                    <View style={AdminStyles.usersModalAvatar}>
                      <Text style={AdminStyles.usersModalAvatarText}>
                        {getUserInitials(selectedUser.name)}
                      </Text>
                    </View>
                    <Text style={AdminStyles.usersModalUserName}>{selectedUser.name}</Text>
                    <Text style={AdminStyles.usersModalUserEmail}>{selectedUser.email}</Text>
                  </View>

                  {/* User Stats */}
                  <View style={AdminStyles.usersModalStats}>
                    <View style={AdminStyles.usersStatItem}>
                      <Text style={[AdminStyles.usersStatNumber, { color: Colors.primaryBlue }]}>
                        {selectedUser.totalTrips || 0}
                      </Text>
                      <Text style={AdminStyles.usersStatLabel}>Trips</Text>
                    </View>

                    <View style={AdminStyles.usersStatDivider} />

                    <View style={AdminStyles.usersStatItem}>
                      <Text style={[AdminStyles.usersStatNumber, { color: Colors.accentRed }]}>
                        {selectedUser.accidentReports?.length || 0}
                      </Text>
                      <Text style={AdminStyles.usersStatLabel}>Reports</Text>
                    </View>

                    <View style={AdminStyles.usersStatDivider} />

                    <View style={AdminStyles.usersStatItem}>
                      <Text style={[AdminStyles.usersStatNumber, { color: Colors.deepNavy }]}>
                        {selectedUser.safetyScore || 100}
                      </Text>
                      <Text style={AdminStyles.usersStatLabel}>Safety</Text>
                    </View>
                  </View>

                  {/* User Details */}
                  <View style={AdminStyles.usersModalDetails}>
                    <Text style={AdminStyles.usersDetailsTitle}>Details</Text>
                    <View style={AdminStyles.usersDetailsContainer}>
                      {selectedUser.truckNumber ? (
                        <View style={AdminStyles.usersDetailRow}>
                          <Text style={AdminStyles.usersDetailLabel}>Truck Number</Text>
                          <Text style={AdminStyles.usersDetailValue}>{selectedUser.truckNumber}</Text>
                        </View>
                      ) : null}

                      {selectedUser.company ? (
                        <View style={AdminStyles.usersDetailRow}>
                          <Text style={AdminStyles.usersDetailLabel}>Company</Text>
                          <Text style={AdminStyles.usersDetailValue}>{selectedUser.company}</Text>
                        </View>
                      ) : null}

                      {selectedUser.licenseNumber ? (
                        <View style={AdminStyles.usersDetailRow}>
                          <Text style={AdminStyles.usersDetailLabel}>License #</Text>
                          <Text style={AdminStyles.usersDetailValue}>{selectedUser.licenseNumber}</Text>
                        </View>
                      ) : null}

                      <View style={AdminStyles.usersDetailRow}>
                        <Text style={AdminStyles.usersDetailLabel}>Member Since</Text>
                        <Text style={AdminStyles.usersDetailValue}>{formatDate(selectedUser.createdAt)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={AdminStyles.usersActionButtons}>
                    <TouchableOpacity
                      style={[AdminStyles.usersActionButton, { backgroundColor: Colors.primaryBlue }]}
                      onPress={handleMakeAdmin}
                      disabled={actionLoading}
                    >
                      <Text style={AdminStyles.usersActionButtonText}>
                        {actionLoading ? 'Processing...' : 'Make Admin'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[AdminStyles.usersActionButton, { backgroundColor: Colors.accentRed }]}
                      onPress={handleDeleteUser}
                      disabled={actionLoading}
                    >
                      <Text style={AdminStyles.usersActionButtonText}>Delete User</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={AdminStyles.usersViewReportsButtonModal}
                    onPress={() => handleViewReports(selectedUser)}
                  >
                    <Text style={AdminStyles.usersViewReportsTextModal}>View Accident Reports</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}