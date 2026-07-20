// app/screens/ReportAccidentScreen.js - COMPLETE VERSION
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Platform,
  Switch,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { BaseStyles, ReportStyles, Theme } from '../styles';
import { API_URL } from '../config/api';
import * as Location from 'expo-location';

const { Colors } = Theme;

export default function ReportAccidentScreen({ navigation, route }) {
  const user = route.params?.user || {
    name: 'Driver Name',
    truckNumber: 'TRK-7890',
  };

  const [accidentType, setAccidentType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [description, setDescription] = useState('');
  const [injuries, setInjuries] = useState(false);
  const [vehicleDamage, setVehicleDamage] = useState(false);
  const [otherDamage, setOtherDamage] = useState(false);
  const [witnesses, setWitnesses] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [roadConditions, setRoadConditions] = useState('');
  const [photos, setPhotos] = useState([]);
  
  // Location states
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  const accidentTypes = [
    { id: 'collision', label: 'Collision with Vehicle', emoji: '🚗' },
    { id: 'pedestrian', label: 'Pedestrian Incident', emoji: '🚶' },
    { id: 'object', label: 'Object Impact', emoji: '🪨' },
    { id: 'rollover', label: 'Rollover', emoji: '🔄' },
    { id: 'fire', label: 'Fire', emoji: '🔥' },
    { id: 'mechanical', label: 'Mechanical Failure', emoji: '🔧' },
    { id: 'tire', label: 'Tire Blowout', emoji: '💥' },
    { id: 'other', label: 'Other', emoji: '❓' },
  ];

  const weatherOptions = [
    { id: 'clear', label: 'Clear', emoji: '☀️' },
    { id: 'rain', label: 'Rain', emoji: '🌧️' },
    { id: 'snow', label: 'Snow', emoji: '❄️' },
    { id: 'fog', label: 'Fog', emoji: '🌫️' },
    { id: 'wind', label: 'Windy', emoji: '💨' },
  ];

  const roadConditionOptions = [
    { id: 'dry', label: 'Dry', emoji: '🛣️' },
    { id: 'wet', label: 'Wet', emoji: '💦' },
    { id: 'icy', label: 'Icy', emoji: '🧊' },
    { id: 'snowy', label: 'Snowy', emoji: '⛄' },
    { id: 'construction', label: 'Construction Zone', emoji: '🚧' },
  ];

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'web') {
      setLocationPermission('granted');
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Accurate location is important for accident reporting. Please enable location services.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationPermission('denied');
    }
  };

  const handleUseCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      handleWebGeolocation();
      return;
    }

    // Check permission first
    if (locationPermission !== 'granted') {
      Alert.alert(
        'Location Access Required',
        'Please grant location permission to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: checkLocationPermission }
        ]
      );
      return;
    }

    setIsGettingLocation(true);
    
    try {
      // Get current position with high accuracy for accident reporting
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 20000, // 20 seconds timeout
      });

      const { latitude, longitude, accuracy } = locationData.coords;
      setCurrentCoordinates({ latitude, longitude });
      setLocationAccuracy(accuracy);
      
      // Reverse geocode to get address
      const address = await getAddressFromCoordinates(latitude, longitude);
      
      // Format location string
      const locationString = formatLocationString(address, latitude, longitude, accuracy);
      setLocation(locationString);
      
      Alert.alert(
        'Location Acquired',
        `📍 Location captured successfully!\n\nAccuracy: ${accuracy ? Math.round(accuracy) + ' meters' : 'High'}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        `Unable to get current location: ${error.message}\n\nPlease enter location manually or try again.`,
        [
          { text: 'Enter Manually' },
          { text: 'Try Again', onPress: handleUseCurrentLocation }
        ]
      );
      
      // Fallback
      setLocation('Location acquisition failed. Please describe location manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (geocode && geocode[0]) {
        const address = geocode[0];
        const parts = [];
        
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.region) parts.push(address.region);
        if (address.postalCode) parts.push(address.postalCode);
        
        return parts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const formatLocationString = (address, lat, lng, accuracy) => {
    const parts = [];
    
    if (address) {
      parts.push(address);
    }
    
    // Include GPS coordinates
    parts.push(`GPS: ${lat.toFixed(6)}° N, ${lng.toFixed(6)}° W`);
    
    // Add accuracy if available
    if (accuracy) {
      parts.push(`Accuracy: ${Math.round(accuracy)}m`);
    }
    
    // Add timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    parts.push(`Captured: ${timeString}`);
    
    return parts.join(' • ');
  };

  const handleWebGeolocation = () => {
    if (!navigator.geolocation) {
      Alert.alert('Geolocation not supported', 'Your browser does not support geolocation.');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentCoordinates({ latitude, longitude });
        setLocationAccuracy(accuracy);
        
        const locationString = `GPS: ${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° W • Accuracy: ${Math.round(accuracy)}m • Captured from browser`;
        setLocation(locationString);
        
        Alert.alert(
          'Location Acquired',
          `GPS coordinates captured successfully!`,
          [{ text: 'OK' }]
        );
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Web geolocation error:', error);
        Alert.alert(
          'Location Error',
          `Failed to get location: ${error.message}`,
          [{ text: 'OK' }]
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Call 911 immediately for emergencies involving:\n• Serious injuries\n• Fire\n• Hazardous materials\n• Blocked roadways',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', style: 'destructive', onPress: () => {
          if (Platform.OS === 'web') {
            window.open('tel:911');
          } else {
            Alert.alert('Emergency', 'Please call 911 from your phone');
          }
        }}
      ]
    );
  };

  const handleOpenInMaps = () => {
    if (!currentCoordinates) {
      Alert.alert('No Location', 'Please get location first.');
      return;
    }

    const { latitude, longitude } = currentCoordinates;
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}&z=17`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}&z=17`,
      web: `https://www.google.com/maps?q=${latitude},${longitude}&z=17`
    });

    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open maps app.');
      console.error('Error opening maps:', err);
    });
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Add Photo',
      'Take a photo or select from gallery',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => {
          setPhotos(prev => [...prev, `photo-${Date.now()}`]);
          Alert.alert('Photo Added', 'Photo has been added to your report');
        }},
        { text: 'Choose from Gallery', onPress: () => {
          setPhotos(prev => [...prev, `gallery-${Date.now()}`]);
          Alert.alert('Photo Added', 'Photo has been added to your report');
        }}
      ]
    );
  };

  const handleSubmitReport = async () => {
    if (!accidentType || !location || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const reportData = {
      userId: user.id,
      driver: user.name,
      truckNumber: user.truckNumber || 'TRK-7890',
      accidentType,
      location,
      date,
      time,
      description,
      injuries,
      vehicleDamage,
      otherDamage,
      witnesses,
      weatherConditions,
      roadConditions,
      coordinates: currentCoordinates,
      locationAccuracy,
      submittedAt: new Date().toISOString(),
    };

    console.log('🚨 SUBMITTING ACCIDENT REPORT:');
    console.log('📱 User ID:', user.id);
    console.log('🌐 API URL:', `${API_URL}/accident-reports`);
    console.log('📦 Report Data:', JSON.stringify(reportData, null, 2));

    try {
      const API_FULL_URL = `${API_URL}/accident-reports`;
      console.log('🌐 Full URL:', API_FULL_URL);

      const response = await fetch(API_FULL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);

      if (data.success) {
        Alert.alert(
          '✅ Report Submitted Successfully!',
          `Report Number: ${data.data.report.reportNumber}\n\n` +
          `This accident report has been saved to your account.`,
          [
            { 
              text: 'View History', 
              onPress: () => {
                navigation.navigate('AccidentHistory', { user });
              }
            },
            { 
              text: 'Done', 
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert(
          '❌ Submission Failed',
          data.error || 'Failed to submit accident report',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('🔥 NETWORK ERROR:', error);
      
      Alert.alert(
        '🌐 Network Error',
        'Unable to connect to server. Would you like to save locally and submit later?',
        [
          { 
            text: 'Save Locally', 
            onPress: saveReportLocally 
          },
          { 
            text: 'Try Again', 
            onPress: handleSubmitReport 
          },
          { 
            text: 'Cancel', 
            style: 'cancel'
          }
        ]
      );
    }
  };

  const saveReportLocally = () => {
    try {
      const localReport = {
        driver: user.name,
        truckNumber: user.truckNumber,
        accidentType,
        location,
        date,
        time,
        description,
        injuries,
        vehicleDamage,
        otherDamage,
        witnesses,
        weatherConditions,
        roadConditions,
        coordinates: currentCoordinates,
        submittedAt: new Date().toISOString(),
        localSave: true,
        localSaveTimestamp: Date.now()
      };

      console.log('💾 SAVING REPORT LOCALLY:');
      console.log('📦 Local report data:', localReport);
      
      // For web, use localStorage
      const savedReports = JSON.parse(localStorage.getItem('localAccidentReports') || '[]');
      savedReports.push(localReport);
      localStorage.setItem('localAccidentReports', JSON.stringify(savedReports));
      
      console.log('✅ Saved locally. Total local reports:', savedReports.length);

      Alert.alert(
        '💾 Saved Locally',
        `Report saved locally (#${savedReports.length}).\n\n` +
        'Please submit it when you have internet connection.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error saving locally:', error);
      Alert.alert('Error', 'Failed to save report locally');
    }
  };

  return (
    <SafeAreaView style={ReportStyles.container}>
      <View style={ReportStyles.header}>
        <TouchableOpacity 
          style={ReportStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={ReportStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={ReportStyles.headerTitle}>Report Accident</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={ReportStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Emergency Section */}
        <View style={ReportStyles.emergencySection}>
          <Text style={ReportStyles.emergencyTitle}>🚨 EMERGENCY</Text>
          <Text style={ReportStyles.emergencySubtitle}>
            If there are injuries, fire, or hazardous materials, call 911 immediately
          </Text>
          <TouchableOpacity 
            style={ReportStyles.emergencyButton}
            onPress={handleEmergencyCall}
          >
            <Text style={ReportStyles.emergencyButtonText}>CALL 911 NOW</Text>
          </TouchableOpacity>
          <Text style={ReportStyles.emergencyNote}>
            Only proceed with this form for non-emergency incidents
          </Text>
        </View>

        {/* Accident Details */}
        <View style={ReportStyles.section}>
          <Text style={ReportStyles.sectionTitle}>Accident Details</Text>
          
          {/* Accident Type */}
          <View style={ReportStyles.inputGroup}>
            <Text style={ReportStyles.label}>
              Accident Type <Text style={ReportStyles.required}>*</Text>
            </Text>
            <View style={ReportStyles.typeGrid}>
              {accidentTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    ReportStyles.typeButton,
                    accidentType === type.id && ReportStyles.typeButtonSelected
                  ]}
                  onPress={() => setAccidentType(type.id)}
                >
                  <Text style={ReportStyles.typeEmoji}>{type.emoji}</Text>
                  <Text style={[
                    ReportStyles.typeText,
                    accidentType === type.id && ReportStyles.typeTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={ReportStyles.inputGroup}>
            <View style={ReportStyles.labelRow}>
              <Text style={ReportStyles.label}>
                Location <Text style={ReportStyles.required}>*</Text>
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                  onPress={handleUseCurrentLocation}
                  disabled={isGettingLocation}
                  style={{ marginRight: 10 }}
                >
                  <Text style={[
                    ReportStyles.locationLink,
                    isGettingLocation && { color: Colors.textSecondary, opacity: 0.7 }
                  ]}>
                    {isGettingLocation ? '📍 Getting Location...' : '📍 Use Current Location'}
                  </Text>
                </TouchableOpacity>
                
                {isGettingLocation && (
                  <ActivityIndicator size="small" color={Colors.primaryBlue} />
                )}
              </View>
            </View>
            
            <TextInput
              style={ReportStyles.textInput}
              placeholder="e.g., I-95 Northbound, Exit 45, Mile Marker 120"
              placeholderTextColor={Colors.textLight}
              value={location}
              onChangeText={setLocation}
              multiline
              numberOfLines={3}
            />
            
            {currentCoordinates && (
              <TouchableOpacity 
                onPress={handleOpenInMaps}
                style={{ marginTop: 8, alignSelf: 'flex-start' }}
              >
                <Text style={[ReportStyles.locationLink, { fontSize: 12 }]}>
                  🗺️ View on Map
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Location Accuracy Indicator */}
            {locationAccuracy && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginTop: 8,
                padding: 6,
                backgroundColor: locationAccuracy < 50 ? '#D1FAE5' : 
                               locationAccuracy < 100 ? '#FEF3C7' : '#FEE2E2',
                borderRadius: 6,
                alignSelf: 'flex-start'
              }}>
                <Text style={{ 
                  fontSize: 11, 
                  color: locationAccuracy < 50 ? '#065F46' : 
                         locationAccuracy < 100 ? '#92400E' : '#991B1B',
                  fontWeight: '600'
                }}>
                  {locationAccuracy < 50 ? '📍 High Accuracy' : 
                   locationAccuracy < 100 ? '📍 Medium Accuracy' : '📍 Low Accuracy'}
                  {locationAccuracy && ` (${Math.round(locationAccuracy)}m)`}
                </Text>
              </View>
            )}
          </View>

          {/* Date & Time */}
          <View style={ReportStyles.row}>
            <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={ReportStyles.label}>Date</Text>
              <TextInput
                style={ReportStyles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[ReportStyles.inputGroup, { flex: 1 }]}>
              <Text style={ReportStyles.label}>Time</Text>
              <TextInput
                style={ReportStyles.textInput}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM AM/PM"
              />
            </View>
          </View>

          {/* Description */}
          <View style={ReportStyles.inputGroup}>
            <Text style={ReportStyles.label}>
              Description <Text style={ReportStyles.required}>*</Text>
            </Text>
            <TextInput
              style={[ReportStyles.textInput, ReportStyles.textArea]}
              placeholder="Provide a detailed description of what happened..."
              placeholderTextColor={Colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Damage & Injuries */}
        <View style={ReportStyles.section}>
          <Text style={ReportStyles.sectionTitle}>Damage & Injuries</Text>
          
          <View style={ReportStyles.checklist}>
            <View style={ReportStyles.checkItem}>
              <Text style={ReportStyles.checkLabel}>Injuries Involved</Text>
              <Switch
                value={injuries}
                onValueChange={setInjuries}
                trackColor={{ false: Colors.borderMedium, true: Colors.accentRed }}
                thumbColor={Colors.textWhite}
              />
            </View>
            
            <View style={ReportStyles.checkItem}>
              <Text style={ReportStyles.checkLabel}>Vehicle Damage</Text>
              <Switch
                value={vehicleDamage}
                onValueChange={setVehicleDamage}
                trackColor={{ false: Colors.borderMedium, true: Colors.primaryBlue }}
                thumbColor={Colors.textWhite}
              />
            </View>
            
            <View style={ReportStyles.checkItem}>
              <Text style={ReportStyles.checkLabel}>Other Property Damage</Text>
              <Switch
                value={otherDamage}
                onValueChange={setOtherDamage}
                trackColor={{ false: Colors.borderMedium, true: Colors.primaryBlue }}
                thumbColor={Colors.textWhite}
              />
            </View>
          </View>

          {/* Witnesses */}
          <View style={ReportStyles.inputGroup}>
            <Text style={ReportStyles.label}>Witnesses (if any)</Text>
            <TextInput
              style={[ReportStyles.textInput, ReportStyles.textArea]}
              placeholder="Names and contact information of witnesses..."
              placeholderTextColor={Colors.textLight}
              value={witnesses}
              onChangeText={setWitnesses}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Conditions */}
        <View style={ReportStyles.section}>
          <Text style={ReportStyles.sectionTitle}>Conditions</Text>
          
          {/* Weather */}
          <View style={ReportStyles.inputGroup}>
            <Text style={ReportStyles.label}>Weather Conditions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ReportStyles.conditionsScroll}>
              {weatherOptions.map(weather => (
                <TouchableOpacity
                  key={weather.id}
                  style={[
                    ReportStyles.conditionButton,
                    weatherConditions === weather.id && ReportStyles.conditionButtonSelected
                  ]}
                  onPress={() => setWeatherConditions(weather.id)}
                >
                  <Text style={ReportStyles.conditionEmoji}>{weather.emoji}</Text>
                  <Text style={[
                    ReportStyles.conditionText,
                    weatherConditions === weather.id && ReportStyles.conditionTextSelected
                  ]}>
                    {weather.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Road Conditions */}
          <View style={ReportStyles.inputGroup}>
            <Text style={ReportStyles.label}>Road Conditions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ReportStyles.conditionsScroll}>
              {roadConditionOptions.map(road => (
                <TouchableOpacity
                  key={road.id}
                  style={[
                    ReportStyles.conditionButton,
                    roadConditions === road.id && ReportStyles.conditionButtonSelected
                  ]}
                  onPress={() => setRoadConditions(road.id)}
                >
                  <Text style={ReportStyles.conditionEmoji}>{road.emoji}</Text>
                  <Text style={[
                    ReportStyles.conditionText,
                    roadConditions === road.id && ReportStyles.conditionTextSelected
                  ]}>
                    {road.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Photos */}
        <View style={ReportStyles.section}>
          <Text style={ReportStyles.sectionTitle}>Photos</Text>
          <Text style={ReportStyles.sectionSubtitle}>
            Add photos of damage, scene, and conditions
          </Text>
          
          <TouchableOpacity 
            style={ReportStyles.photoButton}
            onPress={handleTakePhoto}
          >
            <Text style={ReportStyles.photoIcon}>📷</Text>
            <Text style={ReportStyles.photoText}>Add Photo</Text>
          </TouchableOpacity>
          
          {photos.length > 0 && (
            <View style={ReportStyles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={ReportStyles.photoThumbnail}>
                  <Text style={ReportStyles.photoThumbnailText}>Photo {index + 1}</Text>
                  <TouchableOpacity 
                    style={ReportStyles.removePhoto}
                    onPress={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                  >
                    <Text style={ReportStyles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={ReportStyles.submitSection}>
          <TouchableOpacity 
            style={ReportStyles.submitButton}
            onPress={handleSubmitReport}
          >
            <Text style={ReportStyles.submitButtonText}>Submit Accident Report</Text>
          </TouchableOpacity>
          
          <Text style={ReportStyles.disclaimer}>
            By submitting, you confirm this information is accurate to the best of your knowledge.
            False reports may result in disciplinary action.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}