import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';
import { BaseStyles, AdminStyles, Theme } from '../styles';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { Colors, Sizes } = Theme;

export default function AdminDashboardScreen({ route, navigation }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccidents: 0,
    activeUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentAccidents: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log('📊 Admin Dashboard loaded');
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      let adminToken, adminData;
      
      if (Platform.OS === 'web') {
        adminToken = localStorage.getItem('adminToken') || await AsyncStorage.getItem('adminToken');
        adminData = localStorage.getItem('adminData') || await AsyncStorage.getItem('adminData');
      } else {
        adminToken = await AsyncStorage.getItem('adminToken');
        adminData = await AsyncStorage.getItem('adminData');
      }
      
      if (adminToken && adminData) {
        setToken(adminToken);
        setAdmin(JSON.parse(adminData));
        fetchAdminStats(adminToken);
      } else {
        navigation.navigate('AdminLogin');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      navigation.navigate('AdminLogin');
    }
  };

  const fetchAdminStats = async (authToken) => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        Alert.alert('Error', response.data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert('Access Denied', 'Your session has expired', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('AdminLogin')
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to fetch admin statistics');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (token) {
      fetchAdminStats(token);
    }
  };

  const handleViewUsers = () => {
    navigation.navigate('AdminUsers');
  };

  const handleViewReports = () => {
    navigation.navigate('AdminAccidentReports');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('adminToken');
            await AsyncStorage.removeItem('adminData');
            if (Platform.OS === 'web') {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminData');
            }
            navigation.navigate('AdminLogin');
          }
        }
      ]
    );
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <View style={AdminStyles.loadingContainer}>
        <View style={AdminStyles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={AdminStyles.loadingText}>Loading dashboard...</Text>
          <Text style={AdminStyles.loadingSubtext}>Brew & Bean Café Admin</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={AdminStyles.safeArea}>
      {/* Header */}
      <View style={AdminStyles.header}>
        <View style={AdminStyles.headerLeft}>
          <View style={AdminStyles.adminAvatar}>
            <Text style={AdminStyles.avatarText}>
              {admin?.name?.charAt(0) || 'A'}
            </Text>
          </View>
          <View>
            <Text style={AdminStyles.welcomeText}>Welcome back,</Text>
            <Text style={AdminStyles.adminName}>{admin?.name || 'Admin'}</Text>
          </View>
        </View>
        <TouchableOpacity style={AdminStyles.notificationButton} onPress={() => {}}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textWhite} />
          <View style={AdminStyles.notificationBadge}>
            <Text style={AdminStyles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView 
        style={AdminStyles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryBlue]}
            tintColor={Colors.primaryBlue}
          />
        }
      >
        {/* Stats Overview */}
        <View style={AdminStyles.statsSection}>
          <View style={AdminStyles.sectionHeader}>
            <Text style={AdminStyles.sectionTitle}>Dashboard Overview</Text>
            <Text style={AdminStyles.sectionSubtitle}>Today's statistics</Text>
          </View>
          
          <View style={AdminStyles.statsGrid}>
            {/* Total Users Card */}
            <View style={[AdminStyles.statCard, AdminStyles.card1]}>
              <View style={AdminStyles.statIconContainer}>
                <FontAwesome5 name="users" size={20} color="#4F46E5" />
              </View>
              <Text style={AdminStyles.statNumber}>{stats.totalUsers || 0}</Text>
              <Text style={AdminStyles.statLabel}>Total Users</Text>
              <View style={AdminStyles.statTrend}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={AdminStyles.trendText}>12% from last month</Text>
              </View>
            </View>

            {/* Accident Reports Card */}
            <View style={[AdminStyles.statCard, AdminStyles.card2]}>
              <View style={AdminStyles.statIconContainer}>
                <MaterialIcons name="report-problem" size={20} color="#DC2626" />
              </View>
              <Text style={AdminStyles.statNumber}>{stats.totalAccidents || 0}</Text>
              <Text style={AdminStyles.statLabel}>Accident Reports</Text>
              <View style={AdminStyles.statTrend}>
                <Ionicons name="trending-down" size={16} color="#10B981" />
                <Text style={AdminStyles.trendText}>8% decrease</Text>
              </View>
            </View>

            {/* Active Users Card */}
            <View style={[AdminStyles.statCard, AdminStyles.card3]}>
              <View style={AdminStyles.statIconContainer}>
                <Ionicons name="person-circle-outline" size={20} color="#059669" />
              </View>
              <Text style={AdminStyles.statNumber}>{stats.activeUsers || 0}</Text>
              <Text style={AdminStyles.statLabel}>Active Users</Text>
              <View style={AdminStyles.statTrend}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={AdminStyles.trendText}>24% increase</Text>
              </View>
            </View>

            {/* Admin Users Card */}
            <View style={[AdminStyles.statCard, AdminStyles.card4]}>
              <View style={AdminStyles.statIconContainer}>
                <FontAwesome5 name="crown" size={20} color="#F59E0B" />
              </View>
              <Text style={AdminStyles.statNumber}>{stats.adminUsers || 0}</Text>
              <Text style={AdminStyles.statLabel}>Admin Users</Text>
              <View style={AdminStyles.statTrend}>
                <Text style={AdminStyles.trendText}>No change</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={AdminStyles.actionsSection}>
          <View style={AdminStyles.sectionHeader}>
            <Text style={AdminStyles.sectionTitle}>Quick Actions</Text>
            <Text style={AdminStyles.sectionSubtitle}>Manage your system</Text>
          </View>
          
          <View style={AdminStyles.actionsGrid}>
            <TouchableOpacity style={AdminStyles.actionCard} onPress={handleViewUsers}>
              <View style={[AdminStyles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="people-outline" size={24} color="#1D4ED8" />
              </View>
              <Text style={AdminStyles.actionTitle}>Manage Users</Text>
              <Text style={AdminStyles.actionDescription}>View and manage all users</Text>
            </TouchableOpacity>

            <TouchableOpacity style={AdminStyles.actionCard} onPress={handleViewReports}>
              <View style={[AdminStyles.actionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="report" size={24} color="#DC2626" />
              </View>
              <Text style={AdminStyles.actionTitle}>View Reports</Text>
              <Text style={AdminStyles.actionDescription}>Review accident reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={AdminStyles.actionCard} onPress={() => {}}>
              <View style={[AdminStyles.actionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="stats-chart-outline" size={24} color="#059669" />
              </View>
              <Text style={AdminStyles.actionTitle}>Analytics</Text>
              <Text style={AdminStyles.actionDescription}>System performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={AdminStyles.actionCard} onPress={() => {}}>
              <View style={[AdminStyles.actionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="settings-outline" size={24} color="#D97706" />
              </View>
              <Text style={AdminStyles.actionTitle}>Settings</Text>
              <Text style={AdminStyles.actionDescription}>System configuration</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        {stats.recentAccidents && stats.recentAccidents.length > 0 && (
          <View style={AdminStyles.activitySection}>
            <View style={AdminStyles.sectionHeader}>
              <Text style={AdminStyles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={handleViewReports}>
                <Text style={AdminStyles.seeAllButton}>See All →</Text>
              </TouchableOpacity>
            </View>
            
            <View style={AdminStyles.activityList}>
              {stats.recentAccidents.slice(0, 3).map((report, index) => (
                <TouchableOpacity key={index} style={AdminStyles.activityItem}>
                  <View style={AdminStyles.activityIcon}>
                    <MaterialIcons 
                      name="warning" 
                      size={20} 
                      color={index === 0 ? "#DC2626" : "#F59E0B"} 
                    />
                  </View>
                  <View style={AdminStyles.activityContent}>
                    <Text style={AdminStyles.activityTitle}>
                      {report.driver || 'Unknown Driver'} - {report.accidentType || 'Accident'}
                    </Text>
                    <Text style={AdminStyles.activityDescription} numberOfLines={1}>
                      {report.location?.rawString || 'No location specified'}
                    </Text>
                    <Text style={AdminStyles.activityTime}>
                      {report.date ? new Date(report.date).toLocaleDateString() : 'No date'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* System Information */}
        <View style={AdminStyles.infoSection}>
          <View style={AdminStyles.sectionHeader}>
            <Text style={AdminStyles.sectionTitle}>System Information</Text>
          </View>
          
          <View style={AdminStyles.infoGrid}>
            <View style={AdminStyles.infoItem}>
              <Text style={AdminStyles.infoLabel}>Admin Role</Text>
              <Text style={AdminStyles.infoValue}>{admin?.role || 'Admin'}</Text>
            </View>
            
            <View style={AdminStyles.infoItem}>
              <Text style={AdminStyles.infoLabel}>Email</Text>
              <Text style={AdminStyles.infoValue}>{admin?.email || 'Not available'}</Text>
            </View>
            
            <View style={AdminStyles.infoItem}>
              <Text style={AdminStyles.infoLabel}>Regular Users</Text>
              <Text style={AdminStyles.infoValue}>{stats.regularUsers || 0}</Text>
            </View>
            
            <View style={AdminStyles.infoItem}>
              <Text style={AdminStyles.infoLabel}>Session Status</Text>
              <View style={AdminStyles.statusBadge}>
                <View style={AdminStyles.statusDot} />
                <Text style={AdminStyles.statusText}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={AdminStyles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={AdminStyles.bottomNav}>
        <TouchableOpacity 
          style={[AdminStyles.navButton, activeTab === 'overview' && AdminStyles.navButtonActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="grid-outline" 
            size={22} 
            color={activeTab === 'overview' ? Colors.primaryBlue : '#9CA3AF'} 
          />
          <Text style={[AdminStyles.navText, activeTab === 'overview' && AdminStyles.navTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[AdminStyles.navButton, activeTab === 'users' && AdminStyles.navButtonActive]}
          onPress={handleViewUsers}
        >
          <Ionicons 
            name="people-outline" 
            size={22} 
            color={activeTab === 'users' ? Colors.primaryBlue : '#9CA3AF'} 
          />
          <Text style={[AdminStyles.navText, activeTab === 'users' && AdminStyles.navTextActive]}>
            Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[AdminStyles.navButton, activeTab === 'reports' && AdminStyles.navButtonActive]}
          onPress={handleViewReports}
        >
          <MaterialIcons 
            name="report" 
            size={22} 
            color={activeTab === 'reports' ? Colors.primaryBlue : '#9CA3AF'} 
          />
          <Text style={[AdminStyles.navText, activeTab === 'reports' && AdminStyles.navTextActive]}>
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[AdminStyles.navButton, activeTab === 'settings' && AdminStyles.navButtonActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons 
            name="settings-outline" 
            size={22} 
            color={activeTab === 'settings' ? Colors.primaryBlue : '#9CA3AF'} 
          />
          <Text style={[AdminStyles.navText, activeTab === 'settings' && AdminStyles.navTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// No inline styles needed! We're using AdminStyles from our style system