// app/screens/AccidentHistoryScreen.js - UPDATED
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReportStyles, Theme } from '../styles';
import { API_URL } from '../config/api'; // Import your API_URL

const { Colors } = Theme;

export default function AccidentHistoryScreen({ navigation, route }) {
  const { user } = route.params;
  const [reports, setReports] = useState([]);
  const [localReports, setLocalReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('🚨 AccidentHistoryScreen mounted');
    console.log('👤 User:', user.id, user.email);
    fetchAccidentReports();
    loadLocalReports();
  }, []);

  const fetchAccidentReports = async () => {
    console.log('\n📡 FETCHING ACCIDENT REPORTS FROM SERVER...');
    console.log(`🌐 URL: ${API_URL}/accident-reports/user/${user.id}`);
    
    try {
      const response = await fetch(`${API_URL}/accident-reports/user/${user.id}`);
      
      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server response:', data);
        
        if (data.success) {
          console.log(`✅ Found ${data.data?.length || 0} reports on server`);
          setReports(data.data || []);
        } else {
          console.log('❌ Server error:', data.error);
          Alert.alert('Error', data.error || 'Failed to load accident reports');
        }
      } else {
        console.error('❌ HTTP error:', response.status);
        Alert.alert('Connection Error', 'Cannot connect to server.');
      }
    } catch (error) {
      console.error('🔥 Network error:', error);
      // Don't show alert here - we'll show combined results with local reports
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadLocalReports = async () => {
    try {
      const localReportsJson = await AsyncStorage.getItem('localAccidentReports');
      const allLocalReports = localReportsJson ? JSON.parse(localReportsJson) : [];
      
      // Filter local reports for this specific user
      const userLocalReports = allLocalReports.filter(
        report => report.userId === user.id || !report.userId
      );
      
      console.log('📱 Found local reports for user:', userLocalReports.length);
      setLocalReports(userLocalReports);
    } catch (error) {
      console.error('❌ Error loading local reports:', error);
      setLocalReports([]);
    }
  };

  const refreshReports = async () => {
    console.log('🔄 Refreshing reports...');
    setRefreshing(true);
    await Promise.all([fetchAccidentReports(), loadLocalReports()]);
  };

  const submitLocalReport = async (localReport, index) => {
    try {
      console.log('📤 Submitting local report:', localReport);
      
      const reportData = {
        userId: user.id,
        driver: localReport.driver || user.name,
        truckNumber: localReport.truckNumber || user.truckNumber,
        accidentType: localReport.accidentType,
        location: localReport.location,
        date: localReport.date,
        time: localReport.time,
        description: localReport.description,
        injuries: localReport.injuries,
        vehicleDamage: localReport.vehicleDamage,
        otherDamage: localReport.otherDamage,
        witnesses: localReport.witnesses,
        weatherConditions: localReport.weatherConditions,
        roadConditions: localReport.roadConditions,
        coordinates: localReport.coordinates,
        locationAccuracy: localReport.locationAccuracy,
      };

      const response = await fetch(`${API_URL}/accident-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove from local storage
          const allLocalReportsJson = await AsyncStorage.getItem('localAccidentReports');
          let allLocalReports = allLocalReportsJson ? JSON.parse(allLocalReportsJson) : [];
          
          // Remove the submitted report
          allLocalReports = allLocalReports.filter((_, i) => i !== index);
          await AsyncStorage.setItem('localAccidentReports', JSON.stringify(allLocalReports));
          
          // Update state
          await loadLocalReports();
          await fetchAccidentReports();
          
          Alert.alert('Success', 'Report submitted successfully!');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Error submitting local report:', error);
      return false;
    }
  };

  const submitAllLocalReports = async () => {
    if (localReports.length === 0) {
      Alert.alert('No Local Reports', 'You have no unsent reports');
      return;
    }

    Alert.alert(
      'Submit Local Reports',
      `You have ${localReports.length} unsent report(s). Submit them now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit All', 
          onPress: async () => {
            setLoading(true);
            let successCount = 0;
            
            for (let i = 0; i < localReports.length; i++) {
              const success = await submitLocalReport(localReports[i], i);
              if (success) successCount++;
            }
            
            setLoading(false);
            Alert.alert(
              'Complete',
              `Submitted ${successCount} out of ${localReports.length} reports successfully.`
            );
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#3B82F6';
      case 'under_review': return '#8B5CF6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const allReports = [...reports, ...localReports.map((report, index) => ({
    ...report,
    _id: `local_${index}`,
    reportNumber: `LOCAL-${index + 1}`,
    status: 'draft',
    severity: 'low',
    isLocal: true,
    date: report.date || report.submittedAt
  }))];

  if (loading) {
    return (
      <SafeAreaView style={ReportStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={{ marginTop: 20, color: Colors.textSecondary }}>
            Loading accident history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ReportStyles.container}>
      {/* Header */}
      <View style={ReportStyles.header}>
        <TouchableOpacity 
          style={ReportStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={ReportStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={ReportStyles.headerTitle}>Accident History</Text>
        
        <TouchableOpacity 
          style={ReportStyles.backButton}
          onPress={refreshReports}
        >
          <Text style={ReportStyles.backIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={ReportStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshReports}
            colors={[Colors.primaryBlue]}
          />
        }
      >
        {/* Debug Info */}
        <View style={{ 
          backgroundColor: '#F3F4F6', 
          padding: 10, 
          margin: 10, 
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: Colors.primaryBlue
        }}>
          <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: 'bold' }}>
            📊 Reports Summary:
          </Text>
          <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
            Server Reports: {reports.length}
          </Text>
          <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
            Local Reports: {localReports.length}
          </Text>
          <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
            Total: {allReports.length}
          </Text>
        </View>

        {localReports.length > 0 && (
          <View style={{ 
            backgroundColor: '#FEF3C7', 
            padding: 15, 
            margin: 10, 
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#F59E0B'
          }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#92400E', marginBottom: 8 }}>
              ⚠️ Unsent Reports
            </Text>
            <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 12 }}>
              You have {localReports.length} report(s) saved locally. Submit them when you have internet connection.
            </Text>
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#D97706',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 6,
                alignSelf: 'flex-start'
              }}
              onPress={submitAllLocalReports}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                📤 Submit All Local Reports
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {allReports.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 50 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>📝</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10 }}>
              No Accident Reports
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 30 }}>
              You haven't submitted any accident reports yet.
            </Text>
            
            <TouchableOpacity 
              style={[ReportStyles.submitButton, { marginTop: 10 }]}
              onPress={() => navigation.navigate('ReportAccident', { user })}
            >
              <Text style={ReportStyles.submitButtonText}>Report New Accident</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              marginHorizontal: 10
            }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
                {allReports.length} report{allReports.length !== 1 ? 's' : ''} total
              </Text>
              
              <TouchableOpacity onPress={refreshReports}>
                <Text style={{ color: Colors.primaryBlue, fontSize: 12 }}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>

            {allReports.map((report, index) => (
              <TouchableOpacity
                key={report._id || index}
                style={[
                  ReportStyles.section,
                  { 
                    marginBottom: 15,
                    marginHorizontal: 10,
                    borderLeftWidth: 4,
                    borderLeftColor: getSeverityColor(report.severity),
                    opacity: report.isLocal ? 0.8 : 1
                  }
                ]}
                onPress={() => {
                  if (report.isLocal) {
                    Alert.alert('Local Report', 'This report is saved locally and needs to be submitted.');
                  } else {
                    navigation.navigate('ReportDetails', { report });
                  }
                }}
              >
                {report.isLocal && (
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: '#F59E0B',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4
                  }}>
                    <Text style={{ fontSize: 10, color: 'white', fontWeight: '600' }}>
                      LOCAL
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: Colors.textPrimary,
                      marginBottom: 5
                    }}>
                      {report.accidentType ? 
                        report.accidentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : 
                        'Unknown Type'}
                    </Text>
                    
                    <Text style={{ 
                      fontSize: 12, 
                      color: Colors.primaryBlue,
                      fontWeight: '600',
                      marginBottom: 5
                    }}>
                      #{report.reportNumber || `LOCAL-${index + 1}`}
                    </Text>
                    
                    <Text style={{ 
                      fontSize: 12, 
                      color: Colors.textSecondary,
                      marginBottom: 10
                    }}>
                      📍 {(() => {
                        // Safely handle location string
                        const locationStr = report.location || report.location?.rawString || '';
                        if (typeof locationStr === 'string' && locationStr.length > 0) {
                          return locationStr.substring(0, 50) + '...';
                        }
                        return 'No location specified';
                      })()}
                    </Text>
                    
                    <Text style={{ 
                      fontSize: 12, 
                      color: Colors.textSecondary,
                      marginBottom: 5
                    }}>
                      📅 {formatDate(report.date)}
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    {!report.isLocal && (
                      <>
                        <View style={{ 
                          backgroundColor: getStatusColor(report.status),
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          borderRadius: 12,
                          marginBottom: 5
                        }}>
                          <Text style={{ 
                            fontSize: 10, 
                            color: Colors.textWhite,
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {report.status?.replace('_', ' ') || 'unknown'}
                          </Text>
                        </View>
                        
                        <View style={{ 
                          backgroundColor: getSeverityColor(report.severity),
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          borderRadius: 12
                        }}>
                          <Text style={{ 
                            fontSize: 10, 
                            color: Colors.textWhite,
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {report.severity || 'low'}
                          </Text>
                        </View>
                      </>
                    )}
                    {report.isLocal && (
                      <TouchableOpacity 
                        style={{ 
                          backgroundColor: '#10B981',
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6
                        }}
                        onPress={() => submitLocalReport(report, index)}
                      >
                        <Text style={{ 
                          fontSize: 10, 
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          SUBMIT
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                {report.description && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: Colors.textSecondary,
                    marginTop: 10,
                    fontStyle: 'italic'
                  }}>
                    "{report.description.substring(0, 80)}..."
                  </Text>
                )}
                
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginTop: 15,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: Colors.borderLight
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary, marginRight: 15 }}>
                      {report.injuries ? '🤕 Injuries' : '✅ No Injuries'}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                      {report.vehicleDamage ? '🚗 Damage' : '✅ No Damage'}
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                    {report.isLocal ? 'Tap to submit →' : 'View Details →'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}