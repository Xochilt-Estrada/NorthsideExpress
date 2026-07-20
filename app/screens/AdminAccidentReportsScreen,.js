// app/screens/AdminAccidentReportsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { BaseStyles, AdminStyles, Theme } from '../styles';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

const { Colors, Sizes } = Theme;

export default function AdminAccidentReportsScreen({ navigation, route }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    dateRange: 'all',
  });
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    underReview: 0,
    resolved: 0,
    critical: 0,
  });

  useEffect(() => {
    console.log('📊 Admin Accident Reports Screen loaded');
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      let adminToken;
      
      if (Platform.OS === 'web') {
        adminToken = localStorage.getItem('adminToken') || await AsyncStorage.getItem('adminToken');
      } else {
        adminToken = await AsyncStorage.getItem('adminToken');
      }
      
      if (adminToken) {
        setToken(adminToken);
        fetchAccidentReports(adminToken);
      } else {
        navigation.navigate('AdminLogin');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      navigation.navigate('AdminLogin');
    }
  };

  const fetchAccidentReports = async (authToken) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/accident-reports`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add debug logging to see the data structure
      console.log('📊 Accident reports data:', data);
      if (data.reports && data.reports.length > 0) {
        console.log('📊 First report:', data.reports[0]);
      }
      
      if (data.success) {
        console.log(`✅ Fetched ${data.reports?.length || 0} accident reports`);
        const cleanedReports = cleanReportData(data.reports || []);
        setReports(cleanedReports);
        setFilteredReports(cleanedReports);
        calculateStats(cleanedReports);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch accident reports');
      }
    } catch (error) {
      console.error('Fetch reports error:', error);
      
      if (error.message.includes('401') || error.message.includes('403')) {
        Alert.alert('Access Denied', 'Your session has expired', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('AdminLogin')
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to fetch accident reports. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Add this function to clean up report data
  const cleanReportData = (reports) => {
    if (!reports || !Array.isArray(reports)) return [];
    
    return reports.map((report, index) => {
      // Handle different data formats from your screenshots
      let cleanedReport = { ...report };
      
      // Extract driver name from various formats
      if (typeof cleanedReport.driver === 'string') {
        // Handle formats like "Driver: Xochilt Estrada (email@example.com)"
        const driverMatch = cleanedReport.driver.match(/(?:Driver:\s*)?([^(]+)(?:\(([^)]+)\))?/);
        if (driverMatch) {
          cleanedReport.driverName = driverMatch[1].trim();
          cleanedReport.driverEmail = driverMatch[2] ? driverMatch[2].trim() : '';
        }
      }
      
      // Clean up accident type (remove "YXochilt Estrada - " prefix)
      if (typeof cleanedReport.accidentType === 'string') {
        cleanedReport.accidentType = cleanedReport.accidentType.replace(/^Y[^-]+-\s*/, '');
      }
      
      // Ensure we have an ID
      cleanedReport.id = cleanedReport._id || cleanedReport.id || `report-${index}`;
      
      return cleanedReport;
    });
  };

  const calculateStats = (reportsList) => {
    const statsData = {
      total: reportsList.length,
      submitted: reportsList.filter(r => r.status === 'submitted').length,
      underReview: reportsList.filter(r => r.status === 'under_review').length,
      resolved: reportsList.filter(r => r.status === 'resolved').length,
      critical: reportsList.filter(r => r.severity === 'critical').length,
    };
    setStats(statsData);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (token) {
      fetchAccidentReports(token);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      applyFilters(reports);
      return;
    }
    
    const filtered = reports.filter(report => {
      const searchLower = query.toLowerCase();
      const driverName = report.driverName || report.driver || report.user?.name || '';
      const driverEmail = report.driverEmail || report.user?.email || '';
      const location = report.location?.rawString || report.location || '';
      
      return (
        driverName.toLowerCase().includes(searchLower) ||
        driverEmail.toLowerCase().includes(searchLower) ||
        (report.truckNumber?.toLowerCase().includes(searchLower)) ||
        (report.reportNumber?.toLowerCase().includes(searchLower)) ||
        (report.accidentType?.toLowerCase().includes(searchLower)) ||
        location.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredReports(filtered);
  };

  const applyFilters = (reportList = reports) => {
    let filtered = [...reportList];
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    
    // Apply severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(report => report.severity === filters.severity);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date || report.createdAt);
        return reportDate >= startDate;
      });
    }
    
    setFilteredReports(filtered);
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    // Wait for state to update then apply filters
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const viewReportDetails = (report) => {
    console.log('Viewing report details:', report);
    setSelectedReport(report);
    setModalVisible(true);
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      Alert.alert(
        'Update Status',
        `Change report status to ${newStatus.replace('_', ' ')}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: async () => {
              const response = await fetch(`${API_URL}/accident-reports/${reportId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
              });
              
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  Alert.alert('Success', 'Report status updated');
                  fetchAccidentReports(token); // Refresh data
                  setModalVisible(false);
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error updating report status:', error);
      Alert.alert('Error', 'Failed to update report status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#3B82F6'; // Blue
      case 'under_review': return '#8B5CF6'; // Purple
      case 'resolved': return '#10B981'; // Green
      case 'closed': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#DC2626'; // Red
      case 'high': return '#EA580C'; // Orange
      case 'medium': return '#D97706'; // Amber
      case 'low': return '#059669'; // Emerald
      default: return '#6B7280'; // Gray
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'alert-circle';
      case 'high': return 'alert-triangle';
      case 'medium': return 'alert';
      case 'low': return 'info';
      default: return 'help-circle';
    }
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={AdminStyles.safeArea}>
        <View style={AdminStyles.loadingContainer}>
          <View style={AdminStyles.loadingContent}>
            <ActivityIndicator size="large" color={Colors.primaryBlue} />
            <Text style={AdminStyles.loadingText}>Loading accident reports...</Text>
            <Text style={AdminStyles.loadingSubtext}>Brew & Bean Café Admin</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={AdminStyles.safeArea}>
      {/* Header */}
      <View style={AdminStyles.header}>
        <TouchableOpacity 
          style={AdminStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={AdminStyles.adminName}>Accident Reports</Text>
          <Text style={AdminStyles.welcomeText}>Manage driver incident reports</Text>
        </View>
        <TouchableOpacity 
          style={AdminStyles.notificationButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name={refreshing ? "refresh" : "refresh-outline"} 
            size={24} 
            color={Colors.textWhite} 
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports by driver, truck, location..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.card1]}>
            <View style={styles.statIconContainer}>
              <MaterialIcons name="report-problem" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          
          <View style={[styles.statCard, styles.card2]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="warning" size={20} color="#DC2626" />
            </View>
            <Text style={styles.statNumber}>{stats.critical}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          
          <View style={[styles.statCard, styles.card3]}>
            <View style={styles.statIconContainer}>
              <Feather name="eye" size={20} color="#059669" />
            </View>
            <Text style={styles.statNumber}>{stats.underReview}</Text>
            <Text style={styles.statLabel}>Under Review</Text>
          </View>
          
          <View style={[styles.statCard, styles.card4]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={AdminStyles.sectionHeader}>
            <Text style={AdminStyles.sectionTitle}>Filters</Text>
            <Text style={AdminStyles.sectionSubtitle}>Narrow down results</Text>
          </View>
          
          <View style={styles.filtersContainer}>
            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {['all', 'submitted', 'under_review', 'resolved', 'closed'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      filters.status === status && styles.filterButtonActive,
                      { backgroundColor: filters.status === status ? getStatusColor(status) : Colors.backgroundLight }
                    ]}
                    onPress={() => handleFilterChange('status', status)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filters.status === status && styles.filterButtonTextActive
                    ]}>
                      {status.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Severity Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Severity</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.filterButton,
                      filters.severity === severity && styles.filterButtonActive,
                      { backgroundColor: filters.severity === severity ? getSeverityColor(severity) : Colors.backgroundLight }
                    ]}
                    onPress={() => handleFilterChange('severity', severity)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filters.severity === severity && styles.filterButtonTextActive
                    ]}>
                      {severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Date Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {['all', 'today', 'week', 'month'].map(dateRange => (
                  <TouchableOpacity
                    key={dateRange}
                    style={[
                      styles.filterButton,
                      filters.dateRange === dateRange && styles.filterButtonActive,
                    ]}
                    onPress={() => handleFilterChange('dateRange', dateRange)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filters.dateRange === dateRange && styles.filterButtonTextActive
                    ]}>
                      {dateRange}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <View style={AdminStyles.sectionHeader}>
            <Text style={AdminStyles.sectionTitle}>
              Accident Reports ({filteredReports.length})
            </Text>
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setFilters({ status: 'all', severity: 'all', dateRange: 'all' });
              setFilteredReports(reports);
            }}>
              <Text style={styles.clearFilters}>Clear Filters</Text>
            </TouchableOpacity>
          </View>

          {filteredReports.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="report-off" size={60} color={Colors.textLight} />
              <Text style={styles.emptyStateTitle}>No Reports Found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery || Object.values(filters).some(f => f !== 'all') 
                  ? 'Try changing your search or filters'
                  : 'No accident reports have been submitted yet'}
              </Text>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {filteredReports.map((report, index) => (
                <TouchableOpacity
                  key={report.id || index}
                  style={styles.reportCard}
                  onPress={() => viewReportDetails(report)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reportHeader}>
                    <View style={styles.reportTitleContainer}>
                      <MaterialIcons 
                        name={getSeverityIcon(report.severity)} 
                        size={20} 
                        color={getSeverityColor(report.severity)} 
                      />
                      <Text style={styles.reportTitle} numberOfLines={1}>
                        {report.driverName || report.driver || 'Unknown Driver'} - {report.accidentType || 'Accident'}
                      </Text>
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(report.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {report.status?.replace('_', ' ') || 'unknown'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportDetails}>
                    <View style={styles.detailRow}>
                      <Feather name="truck" size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        Truck: {report.truckNumber || 'Not specified'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Feather name="map-pin" size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {report.location?.rawString || report.location || 'Location not specified'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Feather name="calendar" size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {formatDate(report.date)}
                      </Text>
                    </View>
                    
                    {(report.driverEmail || report.user?.email) && (
                      <View style={styles.detailRow}>
                        <Feather name="mail" size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>
                          {report.driverEmail || report.user?.email}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.reportFooter}>
                    <Text style={styles.reportId}>
                      Report #{report.reportNumber || 'N/A'}
                    </Text>
                    
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(report.severity) }
                    ]}>
                      <Text style={styles.severityText}>
                        {report.severity || 'low'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={AdminStyles.bottomSpacing} />
      </ScrollView>

      {/* Report Details Modal - CHANGED TO WHITE BACKGROUND */}
      <Modal
        animationType="slide"
        transparent={false} // Changed to false for white background
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalContainer}>
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Accident Report Details</Text>
                  <View style={{ width: 24 }} /> 
                </View>

                <ScrollView 
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Report Overview */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Report Overview</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Report Number</Text>
                        <Text style={styles.detailValue}>
                          {selectedReport.reportNumber || 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={[
                          styles.statusBadge,
                          styles.modalBadge,
                          { backgroundColor: getStatusColor(selectedReport.status) }
                        ]}>
                          <Text style={styles.statusText}>
                            {selectedReport.status?.replace('_', ' ') || 'unknown'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Severity</Text>
                        <View style={[
                          styles.severityBadge,
                          styles.modalBadge,
                          { backgroundColor: getSeverityColor(selectedReport.severity) }
                        ]}>
                          <Text style={styles.severityText}>
                            {selectedReport.severity || 'low'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Date & Time</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(selectedReport.date)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Driver Information */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Driver Information</Text>
                    <View style={styles.driverInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {(selectedReport.driverName?.charAt(0) || selectedReport.driver?.charAt(0) || 'D').toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.driverName}>
                          {selectedReport.driverName || selectedReport.driver || 'Unknown Driver'}
                        </Text>
                        {(selectedReport.driverEmail || selectedReport.user?.email) && (
                          <Text style={styles.driverEmail}>
                            {selectedReport.driverEmail || selectedReport.user?.email}
                          </Text>
                        )}
                        <Text style={styles.driverDetail}>
                          Truck: {selectedReport.truckNumber || 'Not specified'}
                          {selectedReport.user?.company && ` | Company: ${selectedReport.user.company}`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Accident Details */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Accident Details</Text>
                    
                    <View style={styles.detailItemFull}>
                      <Text style={styles.detailLabel}>Accident Type</Text>
                      <Text style={styles.detailValue}>
                        {selectedReport.accidentType || 'Not specified'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailItemFull}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>
                        {selectedReport.location?.rawString || selectedReport.location || 'Location not specified'}
                      </Text>
                      {selectedReport.location?.latitude && (
                        <Text style={styles.coordinates}>
                          GPS: {selectedReport.location.latitude?.toFixed(6)}, 
                          {selectedReport.location.longitude?.toFixed(6)}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.detailItemFull}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={[styles.detailValue, styles.descriptionText]}>
                        {selectedReport.description || 'No description provided'}
                      </Text>
                    </View>
                  </View>

                  {/* Damage & Conditions */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Damage & Conditions</Text>
                    
                    <View style={styles.conditionsGrid}>
                      <View style={[
                        styles.conditionItem,
                        selectedReport.injuries && styles.conditionItemCritical
                      ]}>
                        <Text style={styles.conditionLabel}>Injuries</Text>
                        <Text style={styles.conditionValue}>
                          {selectedReport.injuries ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.conditionItem,
                        selectedReport.vehicleDamage && styles.conditionItemWarning
                      ]}>
                        <Text style={styles.conditionLabel}>Vehicle Damage</Text>
                        <Text style={styles.conditionValue}>
                          {selectedReport.vehicleDamage ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.conditionItem,
                        selectedReport.otherDamage && styles.conditionItemWarning
                      ]}>
                        <Text style={styles.conditionLabel}>Other Damage</Text>
                        <Text style={styles.conditionValue}>
                          {selectedReport.otherDamage ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      
                      {selectedReport.witnesses && (
                        <View style={styles.conditionItemFull}>
                          <Text style={styles.conditionLabel}>Witnesses</Text>
                          <Text style={styles.conditionValue}>
                            {selectedReport.witnesses}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {selectedReport.weatherConditions && (
                      <View style={styles.detailItemFull}>
                        <Text style={styles.detailLabel}>Weather Conditions</Text>
                        <Text style={styles.detailValue}>
                          {selectedReport.weatherConditions}
                        </Text>
                      </View>
                    )}
                    
                    {selectedReport.roadConditions && (
                      <View style={styles.detailItemFull}>
                        <Text style={styles.detailLabel}>Road Conditions</Text>
                        <Text style={styles.detailValue}>
                          {selectedReport.roadConditions}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Actions</Text>
                    <View style={styles.actionButtons}>
                      {selectedReport.status !== 'resolved' && (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.resolveButton]}
                          onPress={() => updateReportStatus(selectedReport._id, 'resolved')}
                        >
                          <Ionicons name="checkmark-circle" size={20} color="white" />
                          <Text style={styles.actionButtonText}>Mark as Resolved</Text>
                        </TouchableOpacity>
                      )}
                      
                      {selectedReport.status !== 'under_review' && selectedReport.status !== 'resolved' && (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.reviewButton]}
                          onPress={() => updateReportStatus(selectedReport._id, 'under_review')}
                        >
                          <Ionicons name="eye" size={20} color="white" />
                          <Text style={styles.actionButtonText}>Mark Under Review</Text>
                        </TouchableOpacity>
                      )}
                      
                      {selectedReport.status !== 'closed' && selectedReport.status !== 'resolved' && (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.closeActionButton]}
                          onPress={() => updateReportStatus(selectedReport._id, 'closed')}
                        >
                          <Ionicons name="archive" size={20} color="white" />
                          <Text style={styles.actionButtonText}>Close Report</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Styles specific to this screen
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadiusLg,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: Sizes.md,
    fontSize: Sizes.body,
    color: Colors.textPrimary,
    padding: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.lg,
    marginBottom: Sizes.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card1: {
    borderTopWidth: 4,
    borderTopColor: '#4F46E5',
  },
  card2: {
    borderTopWidth: 4,
    borderTopColor: '#DC2626',
  },
  card3: {
    borderTopWidth: 4,
    borderTopColor: '#059669',
  },
  card4: {
    borderTopWidth: 4,
    borderTopColor: '#F59E0B',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  statNumber: {
    fontSize: Sizes.h2,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
  },
  statLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  filterSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginHorizontal: Sizes.lg,
    marginBottom: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filtersContainer: {
    marginTop: Sizes.sm,
  },
  filterGroup: {
    marginBottom: Sizes.md,
  },
  filterLabel: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: -Sizes.xs,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    marginHorizontal: Sizes.xs,
    marginBottom: Sizes.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: Colors.textWhite,
  },
  reportsSection: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.xl,
  },
  clearFilters: {
    fontSize: Sizes.small,
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Sizes.xl,
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emptyStateTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: Sizes.md,
    marginBottom: Sizes.sm,
  },
  emptyStateText: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  reportCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.sm,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Sizes.sm,
  },
  reportTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: Sizes.sm,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadiusSm,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: Sizes.tiny,
    color: Colors.textWhite,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reportDetails: {
    marginBottom: Sizes.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.xs,
  },
  detailText: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginLeft: Sizes.xs,
    flex: 1,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Sizes.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reportId: {
    fontSize: Sizes.tiny,
    color: Colors.textLight,
  },
  severityBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadiusSm,
    minWidth: 60,
    alignItems: 'center',
  },
  severityText: {
    fontSize: Sizes.tiny,
    color: Colors.textWhite,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Modal Styles - WHITE BACKGROUND
  modalSafeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.backgroundWhite,
  },
  modalTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: Sizes.xs,
  },
  modalBody: {
    flex: 1,
    padding: Sizes.lg,
    backgroundColor: Colors.backgroundWhite,
  },
  modalSection: {
    marginBottom: Sizes.xl,
    backgroundColor: Colors.backgroundWhite,
  },
  modalSectionTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.md,
    paddingBottom: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Sizes.xs,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: Sizes.xs,
    marginBottom: Sizes.md,
  },
  detailItemFull: {
    marginBottom: Sizes.md,
  },
  detailLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: Sizes.body,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  modalBadge: {
    alignSelf: 'flex-start',
    marginTop: Sizes.xs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  avatarText: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.lg,
    borderRadius: Sizes.borderRadiusLg,
  },
  driverName: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  driverEmail: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  driverDetail: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  coordinates: {
    fontSize: Sizes.small,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: Sizes.xs,
  },
  descriptionText: {
    lineHeight: 22,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Sizes.xs,
    marginBottom: Sizes.md,
  },
  conditionItem: {
    width: '33.33%',
    paddingHorizontal: Sizes.xs,
    marginBottom: Sizes.sm,
    padding: Sizes.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.borderRadius,
    alignItems: 'center',
  },
  conditionItemCritical: {
    backgroundColor: '#FEE2E2',
  },
  conditionItemWarning: {
    backgroundColor: '#FEF3C7',
  },
  conditionItemFull: {
    width: '100%',
    padding: Sizes.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.borderRadius,
  },
  conditionLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
    textAlign: 'center',
  },
  conditionValue: {
    fontSize: Sizes.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Sizes.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderRadius: Sizes.borderRadius,
    marginHorizontal: Sizes.xs,
    marginBottom: Sizes.sm,
    flex: 1,
    minWidth: '45%',
  },
  resolveButton: {
    backgroundColor: '#10B981',
  },
  reviewButton: {
    backgroundColor: '#8B5CF6',
  },
  closeActionButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    fontSize: Sizes.small,
    color: Colors.textWhite,
    fontWeight: '600',
    marginLeft: Sizes.xs,
  },
});