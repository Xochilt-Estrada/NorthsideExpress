// app/screens/CalendarScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { Colors, Sizes } = Theme;

const CalendarScreen = ({ navigation, route }) => {
  const user = route.params?.user || { name: 'Driver' };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventType, setNewEventType] = useState('maintenance');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, list

  // Load events from storage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Save events whenever they change
  useEffect(() => {
    saveEvents();
  }, [events]);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem('calendarEvents');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        // Sample events for demo
        const sampleEvents = generateSampleEvents();
        setEvents(sampleEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const saveEvents = async () => {
    try {
      await AsyncStorage.setItem('calendarEvents', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const generateSampleEvents = () => {
    const today = new Date();
    const sampleEvents = [];
    const eventTypes = ['maintenance', 'training', 'inspection', 'deadline'];
    const titles = [
      'Truck Maintenance', 'Safety Training', 'Vehicle Inspection', 
      'Delivery Deadline', 'Oil Change', 'Brake Check', 'Route Planning',
      'Driver Meeting', 'Cargo Loading', 'Fuel Stop'
    ];

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + Math.floor(Math.random() * 30) - 10);
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      sampleEvents.push({
        id: Date.now() + i,
        date: getDateString(date),
        title: `${title} ${i + 1}`,
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        type: type,
        location: `Location ${i + 1}`,
        description: `Event description for ${title.toLowerCase()}`
      });
    }
    return sampleEvents;
  };

  // Helper functions
  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const isToday = (day) => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear() &&
           day === today.getDate();
  };

  const hasEvent = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(e => e.date === dateStr);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const getEventsForToday = () => {
    const today = getDateString(new Date());
    return events.filter(e => e.date === today);
  };

  const getEventsForWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'maintenance': return '#3B82F6';
      case 'training': return '#8B5CF6';
      case 'inspection': return '#10B981';
      case 'deadline': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'maintenance': return '🔧';
      case 'training': return '📚';
      case 'inspection': return '🔍';
      case 'deadline': return '⏰';
      default: return '📌';
    }
  };

  const getEventBgColor = (type) => {
    switch(type) {
      case 'maintenance': return '#EFF6FF';
      case 'training': return '#F5F3FF';
      case 'inspection': return '#ECFDF5';
      case 'deadline': return '#FEF2F2';
      default: return '#F3F4F6';
    }
  };

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handlers
  const handleDayPress = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    setSelectedDate(day);
    setSelectedEvent(null);
    setShowEventDetailModal(true);
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    const newEvent = {
      id: Date.now(),
      date: dateStr,
      title: newEventTitle.trim(),
      time: newEventTime || '12:00 PM',
      type: newEventType,
      location: '',
      description: '',
    };
    
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventType('maintenance');
    setShowEventModal(false);
    Alert.alert('Success', 'Event added to calendar!');
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEvents(events.filter(e => e.id !== eventId));
            if (events.filter(e => e.id !== eventId).length === 0) {
              setShowEventDetailModal(false);
            }
            Alert.alert('Success', 'Event deleted successfully');
          }
        }
      ]
    );
  };

  const getDayEventsCount = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr).length;
  };

  // Render Month View
  const renderMonthView = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && 
                          currentDate.getFullYear() === new Date().getFullYear();

    return (
      <View style={styles.monthView}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <View style={styles.calendarNavRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.calendarMonthText}>{getMonthYear(currentDate)}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          {!isCurrentMonth && (
            <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Days of Week */}
        <View style={styles.dayHeaders}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.dayHeaderText}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: firstDay }, (_, i) => (
            <View key={`empty-${i}`} style={styles.calendarDay} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isTodayDay = isToday(day);
            const dayCount = getDayEventsCount(day);
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.calendarDay,
                  isTodayDay && styles.todayDay,
                  dayCount > 0 && styles.dayWithEvent,
                  selectedDate === day && styles.selectedDay
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[
                  styles.dayNumber,
                  isTodayDay && styles.todayDayText,
                  selectedDate === day && styles.selectedDayText
                ]}>
                  {day}
                </Text>
                {dayCount > 0 && (
                  <View style={styles.eventDotContainer}>
                    {dayEvents.slice(0, 3).map((event, index) => (
                      <View 
                        key={index} 
                        style={[styles.eventDot, { backgroundColor: getEventColor(event.type) }]}
                      />
                    ))}
                    {dayCount > 3 && (
                      <Text style={styles.moreEventsText}>+{dayCount - 3}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Event Types</Text>
          <View style={styles.legendRow}>
            {['maintenance', 'training', 'inspection', 'deadline'].map(type => (
              <View key={type} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: getEventColor(type) }]} />
                <Text style={styles.legendText}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Render List View
  const renderListView = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    const groupedEvents = sortedEvents.reduce((groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});

    const dates = Object.keys(groupedEvents).sort();

    return (
      <View style={styles.listView}>
        {dates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>No Events</Text>
            <Text style={styles.emptyStateText}>
              Tap the + button to add your first event
            </Text>
          </View>
        ) : (
          dates.map(date => (
            <View key={date} style={styles.listGroup}>
              <View style={styles.listGroupHeader}>
                <Text style={styles.listGroupDate}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
                <View style={styles.listGroupBadge}>
                  <Text style={styles.listGroupBadgeText}>
                    {groupedEvents[date].length} events
                  </Text>
                </View>
              </View>
              {groupedEvents[date].map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.listCard}
                  onPress={() => {
                    setSelectedEvent(event);
                    setShowEventDetailModal(true);
                  }}
                >
                  <View style={[styles.listCardIndicator, { backgroundColor: getEventColor(event.type) }]} />
                  <View style={styles.listCardContent}>
                    <View style={styles.listCardHeader}>
                      <Text style={styles.listCardEmoji}>{getEventIcon(event.type)}</Text>
                      <Text style={styles.listCardTitle}>{event.title}</Text>
                    </View>
                    <Text style={styles.listCardTime}>⏰ {event.time}</Text>
                    <View style={styles.listCardFooter}>
                      <View style={[styles.eventTypeBadge, { backgroundColor: getEventColor(event.type) }]}>
                        <Text style={styles.eventTypeText}>{event.type}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </View>
    );
  };

  // Event Detail Modal
  const renderEventDetailModal = () => {
    const dateStr = selectedDate ? 
      `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` : 
      null;
    const dayEvents = dateStr ? events.filter(e => e.date === dateStr) : [];
    const eventToShow = selectedEvent || (dayEvents.length > 0 ? dayEvents[0] : null);

    if (!eventToShow && dayEvents.length === 0) {
      return (
        <Modal
          visible={showEventDetailModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEventDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedDate && `${selectedDate} ${getMonthYear(currentDate)}`}
                </Text>
                <TouchableOpacity onPress={() => setShowEventDetailModal(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events for this day</Text>
                <TouchableOpacity 
                  style={styles.addEventButton}
                  onPress={() => {
                    setShowEventDetailModal(false);
                    setShowEventModal(true);
                  }}
                >
                  <Text style={styles.addEventButtonText}>➕ Add Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    const eventsToShow = selectedEvent ? [selectedEvent] : dayEvents;

    return (
      <Modal
        visible={showEventDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowEventDetailModal(false);
          setSelectedEvent(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedEvent ? 'Event Details' : `${selectedDate} ${getMonthYear(currentDate)}`}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowEventDetailModal(false);
                setSelectedEvent(null);
              }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedEvent ? (
              // Single Event View
              <View style={styles.eventDetailContainer}>
                <View style={[styles.eventDetailHeader, { backgroundColor: getEventBgColor(selectedEvent.type) }]}>
                  <Text style={styles.eventDetailEmoji}>{getEventIcon(selectedEvent.type)}</Text>
                  <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                </View>
                <View style={styles.eventDetailInfo}>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                    <Text style={styles.eventDetailText}>
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                    <Text style={styles.eventDetailText}>{selectedEvent.time}</Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <View style={[styles.eventTypeBadgeDetail, { backgroundColor: getEventColor(selectedEvent.type) }]}>
                      <Text style={styles.eventTypeText}>{selectedEvent.type}</Text>
                    </View>
                  </View>
                  {selectedEvent.location && (
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="location-outline" size={20} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{selectedEvent.location}</Text>
                    </View>
                  )}
                  {selectedEvent.description && (
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{selectedEvent.description}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteEventButtonFull}
                  onPress={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  <Text style={styles.deleteEventButtonText}>Delete Event</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Multiple Events View
              <FlatList
                data={dayEvents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.eventCard}
                    onPress={() => setSelectedEvent(item)}
                  >
                    <View style={[styles.eventCardIndicator, { backgroundColor: getEventColor(item.type) }]} />
                    <View style={styles.eventCardContent}>
                      <View style={styles.eventCardHeader}>
                        <Text style={styles.eventCardEmoji}>{getEventIcon(item.type)}</Text>
                        <Text style={styles.eventCardTitle}>{item.title}</Text>
                      </View>
                      <Text style={styles.eventCardTime}>⏰ {item.time}</Text>
                      <View style={styles.eventCardFooter}>
                        <View style={[styles.eventTypeBadge, { backgroundColor: getEventColor(item.type) }]}>
                          <Text style={styles.eventTypeText}>{item.type}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.deleteEventButton}
                          onPress={() => handleDeleteEvent(item.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Add Event Modal
  const renderAddEventModal = () => {
    const dateStr = selectedDate ? 
      `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` : 
      'No date selected';

    return (
      <Modal
        visible={showEventModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Event</Text>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addEventForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Event Title *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter event title..."
                  placeholderTextColor="#9CA3AF"
                  value={newEventTitle}
                  onChangeText={setNewEventTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Time</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter time (e.g., 10:00 AM)"
                  placeholderTextColor="#9CA3AF"
                  value={newEventTime}
                  onChangeText={setNewEventTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Event Type</Text>
                <View style={styles.typeSelector}>
                  {['maintenance', 'training', 'inspection', 'deadline'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newEventType === type && styles.typeOptionSelected,
                        { borderColor: getEventColor(type) }
                      ]}
                      onPress={() => setNewEventType(type)}
                    >
                      <Text style={styles.typeOptionEmoji}>{getEventIcon(type)}</Text>
                      <Text style={[
                        styles.typeOptionText,
                        newEventType === type && styles.typeOptionTextSelected
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.formDate}>
                📅 Date: {dateStr}
              </Text>

              <TouchableOpacity 
                style={styles.saveEventButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.saveEventButtonText}>Save Event</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const getUserInitials = () => {
    if (!user?.name) return 'D';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 Calendar</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (selectedDate) {
              setShowEventModal(true);
            } else {
              setSelectedDate(new Date().getDate());
              setShowEventModal(true);
            }
          }}
        >
          <Ionicons name="add" size={28} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.viewModeTabs}>
        <TouchableOpacity 
          style={[styles.viewModeTab, viewMode === 'month' && styles.viewModeTabActive]}
          onPress={() => setViewMode('month')}
        >
          <Text style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.viewModeTab, viewMode === 'list' && styles.viewModeTabActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'month' ? renderMonthView() : renderListView()}
      </ScrollView>

      {/* Modals */}
      {renderEventDetailModal()}
      {renderAddEventModal()}
    </SafeAreaView>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    padding: 4,
  },

  // View Mode Tabs
  viewModeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  viewModeTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  viewModeTabActive: {
    backgroundColor: '#3B82F6',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  // Calendar Styles
  monthView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  todayButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 40,
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
    marginBottom: 4,
    borderRadius: 8,
  },
  todayDay: {
    backgroundColor: '#3B82F6',
  },
  dayWithEvent: {
    backgroundColor: '#F9FAFB',
  },
  selectedDay: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#6D28D9',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  todayDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  eventDotContainer: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  moreEventsText: {
    fontSize: 8,
    color: '#6B7280',
    marginLeft: 2,
  },
  legendContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
  },

  // List View Styles
  listView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listGroup: {
    marginBottom: 16,
  },
  listGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listGroupDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listGroupBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  listGroupBadgeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  listCardIndicator: {
    width: 6,
  },
  listCardContent: {
    flex: 1,
    padding: 12,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listCardEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  listCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  listCardTime: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  listCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Event Card
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  eventCardIndicator: {
    width: 6,
  },
  eventCardContent: {
    flex: 1,
    padding: 12,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventCardEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  eventCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  eventCardTime: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  eventCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  deleteEventButton: {
    padding: 4,
  },

  // Event Detail Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eventDetailContainer: {
    paddingVertical: 8,
  },
  eventDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventDetailEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  eventDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eventDetailInfo: {
    paddingHorizontal: 4,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDetailText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  eventTypeBadgeDetail: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deleteEventButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteEventButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noEventsText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  addEventButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addEventButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Add Event Form
  addEventForm: {
    paddingVertical: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  typeOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
  },
  typeOptionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  typeOptionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#1F2937',
    fontWeight: '600',
  },
  formDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  saveEventButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveEventButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
};

export default CalendarScreen;