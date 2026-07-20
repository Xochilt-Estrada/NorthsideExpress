// app/screens/JobTasksScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { ReportStyles, HomeStyles, Theme } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const { Colors } = Theme;

export default function JobTasksScreen({ navigation, route }) {
  const { user } = route.params || { name: 'Driver', truckNumber: 'TRK-7890' };
  
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  
  // New task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    priority: 'medium',
    status: 'pending',
    type: 'delivery',
    estimatedHours: '',
    distance: '',
  });
  
  // Task types
  const taskTypes = [
    { id: 'delivery', label: 'Delivery', emoji: '📦', color: '#3B82F6' },
    { id: 'pickup', label: 'Pickup', emoji: '🚚', color: '#10B981' },
    { id: 'maintenance', label: 'Maintenance', emoji: '🔧', color: '#F59E0B' },
    { id: 'inspection', label: 'Inspection', emoji: '🔍', color: '#8B5CF6' },
    { id: 'training', label: 'Training', emoji: '📚', color: '#EC4899' },
    { id: 'meeting', label: 'Meeting', emoji: '👥', color: '#6366F1' },
  ];
  
  const priorities = [
    { id: 'critical', label: 'Critical', color: '#DC2626', emoji: '🚨' },
    { id: 'high', label: 'High', color: '#EA580C', emoji: '⚠️' },
    { id: 'medium', label: 'Medium', color: '#D97706', emoji: '📋' },
    { id: 'low', label: 'Low', color: '#059669', emoji: '📄' },
  ];
  
  const statuses = [
    { id: 'pending', label: 'Pending', color: '#6B7280', emoji: '⏳' },
    { id: 'in_progress', label: 'In Progress', color: '#3B82F6', emoji: '🚛' },
    { id: 'completed', label: 'Completed', color: '#10B981', emoji: '✅' },
    { id: 'delayed', label: 'Delayed', color: '#F59E0B', emoji: '⏰' },
    { id: 'cancelled', label: 'Cancelled', color: '#DC2626', emoji: '❌' },
  ];

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Try to load from AsyncStorage (for demo)
      const savedTasks = await AsyncStorage.getItem('jobTasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Filter tasks for this user
        const userTasks = parsedTasks.filter(task => 
          task.userId === user.id || !task.userId
        );
        setTasks(userTasks);
      } else {
        // Load sample tasks for demo
        const sampleTasks = getSampleTasks();
        setTasks(sampleTasks);
        await AsyncStorage.setItem('jobTasks', JSON.stringify(sampleTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Fallback to sample tasks
      setTasks(getSampleTasks());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSampleTasks = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      {
        id: '1',
        userId: user.id,
        title: 'Chicago to Detroit Delivery',
        description: 'Deliver automotive parts from Chicago warehouse to Detroit assembly plant',
        type: 'delivery',
        priority: 'high',
        status: 'in_progress',
        location: 'Detroit, MI',
        startLocation: 'Chicago, IL',
        date: today.toISOString().split('T')[0],
        time: '08:00 AM',
        estimatedHours: '6',
        distance: '280 mi',
        progress: 65,
        checklist: [
          { id: '1', task: 'Inspect cargo security', completed: true },
          { id: '2', task: 'Check tire pressure', completed: true },
          { id: '3', task: 'Review route plan', completed: true },
          { id: '4', task: 'Fuel check', completed: false },
          { id: '5', task: 'Weather check', completed: false },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: user.id,
        title: 'Monthly Maintenance Check',
        description: 'Routine maintenance and safety inspection at service center',
        type: 'maintenance',
        priority: 'medium',
        status: 'pending',
        location: 'Service Center - Chicago',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00 AM',
        estimatedHours: '2',
        checklist: [
          { id: '1', task: 'Oil change', completed: false },
          { id: '2', task: 'Brake inspection', completed: false },
          { id: '3', task: 'Light check', completed: false },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        userId: user.id,
        title: 'Safety Training Session',
        description: 'Quarterly safety training and certification renewal',
        type: 'training',
        priority: 'low',
        status: 'pending',
        location: 'Training Center',
        date: nextWeek.toISOString().split('T')[0],
        time: '02:00 PM',
        estimatedHours: '3',
        checklist: [],
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.date) {
      Alert.alert('Missing Information', 'Please fill in at least title and date');
      return;
    }

    const task = {
      id: Date.now().toString(),
      userId: user.id,
      ...newTask,
      createdAt: new Date().toISOString(),
      checklist: [],
    };

    try {
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      await AsyncStorage.setItem('jobTasks', JSON.stringify(updatedTasks));
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        priority: 'medium',
        status: 'pending',
        type: 'delivery',
        estimatedHours: '',
        distance: '',
      });
      Alert.alert('Success', 'Task added successfully!');
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      setTasks(updatedTasks);
      await AsyncStorage.setItem('jobTasks', JSON.stringify(updatedTasks));
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTasks = tasks.filter(task => task.id !== taskId);
              setTasks(updatedTasks);
              await AsyncStorage.setItem('jobTasks', JSON.stringify(updatedTasks));
              if (selectedTask?.id === taskId) {
                setShowTaskModal(false);
                setSelectedTask(null);
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const toggleChecklistItem = async (taskId, itemId) => {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedChecklist = task.checklist?.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ) || [];
          
          // Calculate progress based on completed checklist items
          const completedCount = updatedChecklist.filter(item => item.completed).length;
          const totalCount = updatedChecklist.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          
          return { 
            ...task, 
            checklist: updatedChecklist,
            progress,
            status: progress === 100 ? 'completed' : task.status
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      await AsyncStorage.setItem('jobTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTaskType = (typeId) => {
    return taskTypes.find(t => t.id === typeId) || taskTypes[0];
  };

  const getPriority = (priorityId) => {
    return priorities.find(p => p.id === priorityId) || priorities[2];
  };

  const getStatus = (statusId) => {
    return statuses.find(s => s.id === statusId) || statuses[0];
  };

  const getTasksByDate = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const todayTasks = tasks.filter(task => task.date === today);
    const tomorrowTasks = tasks.filter(task => task.date === tomorrowStr);
    const upcomingTasks = tasks.filter(task => task.date > tomorrowStr);
    const pastTasks = tasks.filter(task => task.date < today);
    
    return { todayTasks, tomorrowTasks, upcomingTasks, pastTasks };
  };

  const { todayTasks, tomorrowTasks, upcomingTasks, pastTasks } = getTasksByDate();

  const renderTaskCard = (task) => {
    const taskType = getTaskType(task.type);
    const priority = getPriority(task.priority);
    const status = getStatus(task.status);
    
    return (
      <TouchableOpacity
        key={task.id}
        style={[
          ReportStyles.section,
          {
            marginBottom: 12,
            marginHorizontal: 10,
            borderLeftWidth: 4,
            borderLeftColor: taskType.color,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
        onPress={() => {
          setSelectedTask(task);
          setShowTaskModal(true);
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>{taskType.emoji}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, flex: 1 }}>
                {task.title}
              </Text>
            </View>
            
            {task.description && (
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 8 }}>
                {task.description.length > 60 ? task.description.substring(0, 60) + '...' : task.description}
              </Text>
            )}
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginRight: 12 }}>
                📍 {task.location || 'No location'}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                📅 {formatDate(task.date)} {task.time && `• ${task.time}`}
              </Text>
            </View>
            
            {task.distance && (
              <Text style={{ fontSize: 12, color: Colors.primaryBlue, fontWeight: '600' }}>
                📏 {task.distance} • ⏱️ {task.estimatedHours || '?'} hrs
              </Text>
            )}
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{
              backgroundColor: priority.color,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 12,
              marginBottom: 4,
            }}>
              <Text style={{ fontSize: 10, color: 'white', fontWeight: '600' }}>
                {priority.emoji} {priority.label}
              </Text>
            </View>
            
            <View style={{
              backgroundColor: status.color,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 12,
            }}>
              <Text style={{ fontSize: 10, color: 'white', fontWeight: '600' }}>
                {status.emoji} {status.label.replace('_', ' ')}
              </Text>
            </View>
            
            {task.progress !== undefined && task.status !== 'completed' && (
              <View style={{ marginTop: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, color: Colors.textSecondary, marginBottom: 2 }}>
                  {task.progress}%
                </Text>
                <View style={{
                  width: 60,
                  height: 4,
                  backgroundColor: Colors.borderLight,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    width: `${task.progress}%`,
                    height: '100%',
                    backgroundColor: taskType.color,
                    borderRadius: 2,
                  }} />
                </View>
              </View>
            )}
          </View>
        </View>
        
        {task.checklist && task.checklist.length > 0 && (
          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>
              Checklist: {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
            </Text>
            {task.checklist.slice(0, 2).map(item => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: item.completed ? '#10B981' : Colors.borderMedium,
                  backgroundColor: item.completed ? '#10B981' : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                  {item.completed && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
                </View>
                <Text style={{
                  fontSize: 11,
                  color: item.completed ? Colors.textSecondary : Colors.textPrimary,
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.7 : 1,
                }}>
                  {item.task}
                </Text>
              </View>
            ))}
            {task.checklist.length > 2 && (
              <Text style={{ fontSize: 10, color: Colors.primaryBlue, marginTop: 4 }}>
                +{task.checklist.length - 2} more items...
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTaskModal = () => {
    if (!selectedTask) return null;
    
    const taskType = getTaskType(selectedTask.type);
    const priority = getPriority(selectedTask.priority);
    const status = getStatus(selectedTask.status);
    
    return (
      <Modal
        visible={showTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: Colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '90%',
            padding: 20,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary }}>
                Task Details
              </Text>
              <TouchableOpacity onPress={() => setShowTaskModal(false)}>
                <Text style={{ fontSize: 24, color: Colors.textSecondary }}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 28, marginRight: 12 }}>{taskType.emoji}</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, flex: 1 }}>
                    {selectedTask.title}
                  </Text>
                </View>
                
                {selectedTask.description && (
                  <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 16, lineHeight: 20 }}>
                    {selectedTask.description}
                  </Text>
                )}
                
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <View style={{ 
                    backgroundColor: priority.color,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                  }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      {priority.emoji} {priority.label}
                    </Text>
                  </View>
                  <View style={{ 
                    backgroundColor: status.color,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      {status.emoji} {status.label.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                
                <View style={ReportStyles.inputGroup}>
                  <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Location</Text>
                  <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                    📍 {selectedTask.location || 'No location specified'}
                  </Text>
                </View>
                
                <View style={ReportStyles.row}>
                  <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Date</Text>
                    <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                      📅 {formatDate(selectedTask.date)}
                    </Text>
                  </View>
                  <View style={[ReportStyles.inputGroup, { flex: 1 }]}>
                    <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Time</Text>
                    <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                      ⏰ {selectedTask.time || 'Not specified'}
                    </Text>
                  </View>
                </View>
                
                {(selectedTask.startLocation || selectedTask.distance || selectedTask.estimatedHours) && (
                  <View style={ReportStyles.row}>
                    {selectedTask.startLocation && (
                      <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={[ReportStyles.label, { marginBottom: 8 }]}>From</Text>
                        <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                          🚚 {selectedTask.startLocation}
                        </Text>
                      </View>
                    )}
                    {selectedTask.distance && (
                      <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Distance</Text>
                        <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                          📏 {selectedTask.distance}
                        </Text>
                      </View>
                    )}
                    {selectedTask.estimatedHours && (
                      <View style={[ReportStyles.inputGroup, { flex: 1 }]}>
                        <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Estimated Time</Text>
                        <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                          ⏱️ {selectedTask.estimatedHours} hours
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                
                {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                  <View style={ReportStyles.inputGroup}>
                    <Text style={[ReportStyles.label, { marginBottom: 12 }]}>
                      Checklist ({selectedTask.checklist.filter(item => item.completed).length}/{selectedTask.checklist.length})
                    </Text>
                    {selectedTask.checklist.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          paddingVertical: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.borderLight,
                        }}
                        onPress={() => toggleChecklistItem(selectedTask.id, item.id)}
                      >
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: item.completed ? '#10B981' : Colors.borderMedium,
                          backgroundColor: item.completed ? '#10B981' : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12,
                        }}>
                          {item.completed && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
                        </View>
                        <Text style={{
                          fontSize: 14,
                          color: item.completed ? Colors.textSecondary : Colors.textPrimary,
                          textDecorationLine: item.completed ? 'line-through' : 'none',
                          flex: 1,
                          opacity: item.completed ? 0.7 : 1,
                        }}>
                          {item.task}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {selectedTask.progress !== undefined && (
                  <View style={ReportStyles.inputGroup}>
                    <Text style={[ReportStyles.label, { marginBottom: 8 }]}>Progress</Text>
                    <View style={{ 
                      height: 20, 
                      backgroundColor: Colors.borderLight, 
                      borderRadius: 10,
                      overflow: 'hidden',
                      marginBottom: 8,
                    }}>
                      <View style={{
                        width: `${selectedTask.progress}%`,
                        height: '100%',
                        backgroundColor: taskType.color,
                        borderRadius: 10,
                      }} />
                    </View>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary, textAlign: 'center' }}>
                      {selectedTask.progress}% Complete
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.accentRed,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    flex: 1,
                    marginRight: 8,
                  }}
                  onPress={() => handleDeleteTask(selectedTask.id)}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                    Delete Task
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primaryBlue,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    flex: 1,
                    marginLeft: 8,
                  }}
                  onPress={() => {
                    setShowTaskModal(false);
                    // Here you could navigate to an edit screen or show edit modal
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                    Edit Task
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.textSecondary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginTop: 12,
                }}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderNewTaskModal = () => (
    <Modal
      visible={showNewTaskModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNewTaskModal(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: Colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '90%',
          padding: 20,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary }}>
              Add New Task
            </Text>
            <TouchableOpacity onPress={() => setShowNewTaskModal(false)}>
              <Text style={{ fontSize: 24, color: Colors.textSecondary }}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={[ReportStyles.textInput, { marginBottom: 12 }]}
              placeholder="Task Title *"
              placeholderTextColor={Colors.textLight}
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
            />
            
            <TextInput
              style={[ReportStyles.textInput, ReportStyles.textArea, { marginBottom: 12, height: 80 }]}
              placeholder="Description"
              placeholderTextColor={Colors.textLight}
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
              multiline
            />
            
            <TextInput
              style={[ReportStyles.textInput, { marginBottom: 12 }]}
              placeholder="Location"
              placeholderTextColor={Colors.textLight}
              value={newTask.location}
              onChangeText={(text) => setNewTask({...newTask, location: text})}
            />
            
            <View style={ReportStyles.row}>
              <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={ReportStyles.label}>Date</Text>
                <TextInput
                  style={ReportStyles.textInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textLight}
                  value={newTask.date}
                  onChangeText={(text) => setNewTask({...newTask, date: text})}
                />
              </View>
              <View style={[ReportStyles.inputGroup, { flex: 1 }]}>
                <Text style={ReportStyles.label}>Time</Text>
                <TextInput
                  style={ReportStyles.textInput}
                  placeholder="HH:MM AM/PM"
                  placeholderTextColor={Colors.textLight}
                  value={newTask.time}
                  onChangeText={(text) => setNewTask({...newTask, time: text})}
                />
              </View>
            </View>
            
            <View style={ReportStyles.inputGroup}>
              <Text style={ReportStyles.label}>Task Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginTop: 8 }}>
                {taskTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 8,
                        backgroundColor: newTask.type === type.id ? type.color + '20' : Colors.borderLight,
                        borderWidth: 1,
                        borderColor: newTask.type === type.id ? type.color : 'transparent',
                      },
                    ]}
                    onPress={() => setNewTask({...newTask, type: type.id})}
                  >
                    <Text style={{ fontSize: 16, marginRight: 6 }}>{type.emoji}</Text>
                    <Text style={{ 
                      fontSize: 12, 
                      fontWeight: newTask.type === type.id ? '600' : '400',
                      color: newTask.type === type.id ? type.color : Colors.textPrimary,
                    }}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={ReportStyles.inputGroup}>
              <Text style={ReportStyles.label}>Priority</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginTop: 8 }}>
                {priorities.map(priority => (
                  <TouchableOpacity
                    key={priority.id}
                    style={[
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 8,
                        backgroundColor: newTask.priority === priority.id ? priority.color + '20' : Colors.borderLight,
                        borderWidth: 1,
                        borderColor: newTask.priority === priority.id ? priority.color : 'transparent',
                      },
                    ]}
                    onPress={() => setNewTask({...newTask, priority: priority.id})}
                  >
                    <Text style={{ 
                      fontSize: 12, 
                      fontWeight: newTask.priority === priority.id ? '600' : '400',
                      color: newTask.priority === priority.id ? priority.color : Colors.textPrimary,
                    }}>
                      {priority.emoji} {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={ReportStyles.row}>
              <View style={[ReportStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={ReportStyles.label}>Distance (optional)</Text>
                <TextInput
                  style={ReportStyles.textInput}
                  placeholder="e.g., 280 mi"
                  placeholderTextColor={Colors.textLight}
                  value={newTask.distance}
                  onChangeText={(text) => setNewTask({...newTask, distance: text})}
                />
              </View>
              <View style={[ReportStyles.inputGroup, { flex: 1 }]}>
                <Text style={ReportStyles.label}>Est. Hours (optional)</Text>
                <TextInput
                  style={ReportStyles.textInput}
                  placeholder="e.g., 6"
                  placeholderTextColor={Colors.textLight}
                  value={newTask.estimatedHours}
                  onChangeText={(text) => setNewTask({...newTask, estimatedHours: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryBlue,
                paddingVertical: 14,
                borderRadius: 8,
                marginTop: 20,
                marginBottom: 10,
              }}
              onPress={handleAddTask}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
                Add Task
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: Colors.textSecondary,
                paddingVertical: 14,
                borderRadius: 8,
              }}
              onPress={() => setShowNewTaskModal(false)}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={ReportStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={{ marginTop: 20, color: Colors.textSecondary }}>
            Loading tasks...
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
        <Text style={ReportStyles.headerTitle}>Job Tasks</Text>
        
        <TouchableOpacity 
          style={ReportStyles.backButton}
          onPress={() => setShowNewTaskModal(true)}
        >
          <Text style={ReportStyles.backIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={ReportStyles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryBlue]}
          />
        }
      >
        {/* Stats Overview */}
        <View style={{ 
          backgroundColor: '#F3F4F6', 
          padding: 16, 
          margin: 10, 
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.primaryBlue }}>
              {tasks.length}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
              Total Tasks
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
              {tasks.filter(t => t.status === 'completed').length}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
              Completed
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B' }}>
              {todayTasks.length}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
              Today
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8B5CF6' }}>
              {tasks.filter(t => t.priority === 'critical' || t.priority === 'high').length}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
              High Priority
            </Text>
          </View>
        </View>

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary }}>
                Today's Tasks ({todayTasks.length})
              </Text>
              <Text style={{ fontSize: 12, color: Colors.primaryBlue }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            {todayTasks.map(renderTaskCard)}
          </View>
        )}

        {/* Tomorrow's Tasks */}
        {tomorrowTasks.length > 0 && (
          <View style={{ marginHorizontal: 10, marginTop: todayTasks.length > 0 ? 30 : 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary }}>
                Tomorrow ({tomorrowTasks.length})
              </Text>
            </View>
            {tomorrowTasks.map(renderTaskCard)}
          </View>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <View style={{ marginHorizontal: 10, marginTop: (todayTasks.length > 0 || tomorrowTasks.length > 0) ? 30 : 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary }}>
                Upcoming ({upcomingTasks.length})
              </Text>
            </View>
            {upcomingTasks.map(renderTaskCard)}
          </View>
        )}

        {/* Past Tasks */}
        {pastTasks.length > 0 && (
          <View style={{ marginHorizontal: 10, marginTop: 30, marginBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary }}>
                Past Tasks ({pastTasks.length})
              </Text>
            </View>
            {pastTasks.map(renderTaskCard)}
          </View>
        )}

        {tasks.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, paddingBottom: 40 }}>
            <Text style={{ fontSize: 36, marginBottom: 16 }}>📋</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 }}>
              No Tasks Yet
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 30, maxWidth: '80%' }}>
              You don't have any job tasks scheduled yet. Add your first task to get started!
            </Text>
            
            <TouchableOpacity 
              style={{
                backgroundColor: Colors.primaryBlue,
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 8,
              }}
              onPress={() => setShowNewTaskModal(true)}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                + Add First Task
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Task Floating Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: Colors.primaryBlue,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => setShowNewTaskModal(true)}
      >
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>

      {renderTaskModal()}
      {renderNewTaskModal()}
    </SafeAreaView>
  );
}