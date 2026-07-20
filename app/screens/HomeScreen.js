// app/screens/HomeScreen.js - COMPLETE UPDATED VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { HomeStyles, Theme } from '../styles';

const { Colors } = Theme;

export default function HomeScreen({ navigation, route }) {
  // Get user data from navigation params
  const user = route.params?.user || {
    name: 'Driver Name',
    email: 'driver@example.com',
    truckNumber: 'TRK-7890',
    licenseNumber: 'CDL-123456',
    totalTrips: 0,
    company: 'Logistics Inc.',
    safetyScore: 100,
    accidentReports: []
  };

 const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, tasks  // dashboard, calendar, tasks

  // Sample trucking data
  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, title: 'Deliver to Warehouse A', location: 'Chicago, IL', time: '08:00 AM', status: 'pending', priority: 'high' },
    { id: 2, title: 'Pickup from Factory B', location: 'Detroit, MI', time: '02:00 PM', status: 'pending', priority: 'medium' },
    { id: 3, title: 'Maintenance Check', location: 'Service Center', time: 'Tomorrow', status: 'scheduled', priority: 'low' },
  ]);

  const [recentTrips, setRecentTrips] = useState([
    { id: 1, date: '2024-01-15', from: 'NYC', to: 'Boston', distance: '215 mi', hours: '4.5 hrs' },
    { id: 2, date: '2024-01-14', from: 'Philly', to: 'DC', distance: '140 mi', hours: '3.0 hrs' },
    { id: 3, date: '2024-01-13', from: 'Baltimore', to: 'Richmond', distance: '150 mi', hours: '3.2 hrs' },
  ]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleProfile = () => {
    navigation.navigate('Profile', { user });
  };

  const handleReportAccident = () => {
    navigation.navigate('ReportAccident', { user });
  };

  const handleViewAccidentHistory = () => {
    navigation.navigate('AccidentHistory', { user });
  };

  const handleViewCalendar = () => {
    navigation.navigate('Calendar', { user });
  };

  const handleViewJobTasks = () => {
    navigation.navigate('JobTasks');
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Dashboard View
  const renderDashboard = () => (
    <ScrollView style={HomeStyles.contentScroll} showsVerticalScrollIndicator={false}>
      {/* Welcome Card */}
      <View style={HomeStyles.welcomeCard}>
        <Text style={HomeStyles.welcomeTitle}>Good Morning, {user.name.split(' ')[0]}! 🚚</Text>
        <Text style={HomeStyles.welcomeSubtitle}>Ready for today's routes?</Text>
        
        <View style={HomeStyles.quickStats}>
          <View style={HomeStyles.statItem}>
            <Text style={HomeStyles.statNumber}>8</Text>
            <Text style={HomeStyles.statLabel}>Hours Driven</Text>
          </View>
          <View style={HomeStyles.statDivider} />
          <View style={HomeStyles.statItem}>
            <Text style={HomeStyles.statNumber}>320</Text>
            <Text style={HomeStyles.statLabel}>Miles Today</Text>
          </View>
          <View style={HomeStyles.statDivider} />
          <View style={HomeStyles.statItem}>
            <Text style={HomeStyles.statNumber}>{user.accidentReports?.length || 0}</Text>
            <Text style={HomeStyles.statLabel}>Accident Reports</Text>
          </View>
        </View>

        {/* Safety Score Badge */}
        <View style={{ 
          backgroundColor: user.safetyScore >= 80 ? '#D1FAE5' : 
                         user.safetyScore >= 60 ? '#FEF3C7' : '#FEE2E2',
          borderRadius: 12,
          padding: 12,
          marginTop: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: 'bold',
              color: user.safetyScore >= 80 ? '#065F46' : 
                     user.safetyScore >= 60 ? '#92400E' : '#991B1B'
            }}>
              Safety Score: {user.safetyScore || 100}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              color: user.safetyScore >= 80 ? '#047857' : 
                     user.safetyScore >= 60 ? '#B45309' : '#B91C1C',
              marginTop: 2
            }}>
              {user.safetyScore >= 80 ? 'Excellent' : 
               user.safetyScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Text>
          </View>
          <Text style={{ fontSize: 24 }}>
            {user.safetyScore >= 80 ? '⭐' : 
             user.safetyScore >= 60 ? '⚠️' : '🚨'}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={HomeStyles.section}>
        <Text style={HomeStyles.sectionTitle}>Quick Actions</Text>
        <View style={HomeStyles.actionsGrid}>
          <TouchableOpacity style={HomeStyles.actionCard} onPress={handleReportAccident}>
            <Text style={HomeStyles.actionIcon}>🚨</Text>
            <Text style={HomeStyles.actionText}>Report Accident</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={HomeStyles.actionCard} onPress={handleViewAccidentHistory}>
            <Text style={HomeStyles.actionIcon}>📋</Text>
            <Text style={HomeStyles.actionText}>Accident History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={HomeStyles.actionCard} onPress={handleViewCalendar}>
            <Text style={HomeStyles.actionIcon}>📅</Text>
            <Text style={HomeStyles.actionText}>Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={HomeStyles.actionCard} onPress={() => setActiveTab('tasks')}>
            <Text style={HomeStyles.actionIcon}>🚛</Text>
            <Text style={HomeStyles.actionText}>Job Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Tasks */}
      <View style={HomeStyles.section}>
        <View style={HomeStyles.sectionHeader}>
          <Text style={HomeStyles.sectionTitle}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => setActiveTab('tasks')}>
            <Text style={HomeStyles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingTasks.slice(0, 3).map(task => (
          <TouchableOpacity key={task.id} style={HomeStyles.taskCard}>
            <View style={HomeStyles.taskHeader}>
              <Text style={HomeStyles.taskTitle}>{task.title}</Text>
              <View style={[
                HomeStyles.priorityBadge,
                task.priority === 'high' && HomeStyles.priorityHigh,
                task.priority === 'medium' && HomeStyles.priorityMedium,
                task.priority === 'low' && HomeStyles.priorityLow,
              ]}>
                <Text style={HomeStyles.priorityText}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={HomeStyles.taskLocation}>📍 {task.location}</Text>
            <Text style={HomeStyles.taskTime}>⏰ {task.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Trips */}
      <View style={HomeStyles.section}>
        <View style={HomeStyles.sectionHeader}>
          <Text style={HomeStyles.sectionTitle}>Recent Trips</Text>
          <TouchableOpacity>
            <Text style={HomeStyles.seeAll}>View History →</Text>
          </TouchableOpacity>
        </View>
        
        {recentTrips.slice(0, 2).map(trip => (
          <View key={trip.id} style={HomeStyles.tripCard}>
            <View style={HomeStyles.tripRoute}>
              <Text style={HomeStyles.tripFrom}>🚚 {trip.from}</Text>
              <Text style={HomeStyles.tripArrow}>→</Text>
              <Text style={HomeStyles.tripTo}>📍 {trip.to}</Text>
            </View>
            <View style={HomeStyles.tripDetails}>
              <Text style={HomeStyles.tripDetail}>📏 {trip.distance}</Text>
              <Text style={HomeStyles.tripDetail}>⏱️ {trip.hours}</Text>
              <Text style={HomeStyles.tripDetail}>📅 {trip.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Job Tasks Tab
  const renderJobTasks = () => (
    <ScrollView style={HomeStyles.contentScroll} showsVerticalScrollIndicator={false}>
      <View style={HomeStyles.section}>
        <Text style={HomeStyles.sectionTitle}>Job Tasks</Text>
        
        {/* Current Job */}
        <View style={HomeStyles.jobCard}>
          <Text style={HomeStyles.jobStatus}>🚛 ACTIVE JOB</Text>
          <Text style={HomeStyles.jobTitle}>Chicago to Detroit Delivery</Text>
          
          <View style={HomeStyles.jobProgress}>
            <View style={HomeStyles.progressBar}>
              <View style={[HomeStyles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={HomeStyles.progressText}>65% Complete</Text>
          </View>
          
          <View style={HomeStyles.jobDetails}>
            <View style={HomeStyles.jobDetail}>
              <Text style={HomeStyles.jobDetailLabel}>From</Text>
              <Text style={HomeStyles.jobDetailValue}>Chicago, IL</Text>
            </View>
            <View style={HomeStyles.jobDetail}>
              <Text style={HomeStyles.jobDetailLabel}>To</Text>
              <Text style={HomeStyles.jobDetailValue}>Detroit, MI</Text>
            </View>
            <View style={HomeStyles.jobDetail}>
              <Text style={HomeStyles.jobDetailLabel}>ETA</Text>
              <Text style={HomeStyles.jobDetailValue}>4:30 PM</Text>
            </View>
          </View>
          
          <TouchableOpacity style={HomeStyles.updateButton}>
            <Text style={HomeStyles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        </View>
        
        {/* Task Checklist */}
        <View style={HomeStyles.checklistCard}>
          <Text style={HomeStyles.checklistTitle}>Pre-Trip Checklist</Text>
          {[
            'Inspect tires and brakes',
            'Check fluid levels',
            'Test lights and signals',
            'Secure cargo',
            'Review route plan',
            'Check weather conditions'
          ].map((task, index) => (
            <TouchableOpacity key={index} style={HomeStyles.checklistItem}>
              <View style={HomeStyles.checkbox}>
                <Text style={HomeStyles.checkboxText}>✓</Text>
              </View>
              <Text style={HomeStyles.checklistText}>{task}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={HomeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={HomeStyles.header}>
        <View>
          <Text style={HomeStyles.headerTitle}>Trucker Pro</Text>
          <Text style={HomeStyles.headerSubtitle}>{user.truckNumber}</Text>
        </View>
        <TouchableOpacity 
          style={HomeStyles.profileButton}
          onPress={handleProfile}
        >
          <View style={HomeStyles.avatar}>
            <Text style={HomeStyles.avatarText}>{getUserInitials()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content based on active tab */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'tasks' && renderJobTasks()}

      {/* Bottom Navigation - Updated for 4 tabs */}
      <View style={HomeStyles.bottomNav}>
        <TouchableOpacity 
          style={HomeStyles.navButton}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[HomeStyles.navIcon, activeTab === 'dashboard' && HomeStyles.navIconActive]}>🏠</Text>
          <Text style={[HomeStyles.navText, activeTab === 'dashboard' && HomeStyles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={HomeStyles.navButton}
          onPress={handleReportAccident}
        >
          <Text style={[HomeStyles.navIcon, activeTab === 'accident' && HomeStyles.navIconActive]}>🚨</Text>
          <Text style={[HomeStyles.navText, activeTab === 'accident' && HomeStyles.navTextActive]}>Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={HomeStyles.navButton}
          onPress={handleViewAccidentHistory}
        >
          <Text style={[HomeStyles.navIcon, activeTab === 'history' && HomeStyles.navIconActive]}>📋</Text>
          <Text style={[HomeStyles.navText, activeTab === 'history' && HomeStyles.navTextActive]}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={HomeStyles.navButton}
          onPress={handleViewCalendar}
        >
          <Text style={HomeStyles.navIcon}>📅</Text>
          <Text style={HomeStyles.navText}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={HomeStyles.navButton}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[HomeStyles.navIcon, activeTab === 'tasks' && HomeStyles.navIconActive]}>🚛</Text>
          <Text style={[HomeStyles.navText, activeTab === 'tasks' && HomeStyles.navTextActive]}>Tasks</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}