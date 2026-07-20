// app/styles/componentStyles.js - Complete updated version
import { StyleSheet } from 'react-native';
import { BaseStyles } from './baseStyles';
import { Theme } from '../config/theme';

const { Colors, Sizes } = Theme;

export const AuthStyles = {
  // Login Screen specific
  demoButton: BaseStyles.buttonTertiary,
  demoButtonText: BaseStyles.buttonTextTertiary,
  testButton: BaseStyles.buttonSecondary,
  testButtonText: BaseStyles.buttonTextSecondary,
  
  // Registration specific
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: BaseStyles.divider.marginVertical,
    paddingTop: BaseStyles.divider.marginVertical,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  loginLink: {
    color: Colors.primaryBlue,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  
  // Forgot Password specific
  debugInfo: StyleSheet.flatten([
    BaseStyles.infoBox,
    BaseStyles.infoInfo,
  ]),
  debugTitle: {
    ...BaseStyles.infoTitle,
    color: Colors.deepNavy,
  },
  debugText: {
    ...BaseStyles.infoText,
    color: Colors.secondaryBlue,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: Colors.secondaryBlue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
};



export const FormStyles = {
  // Form-specific styles that extend base
  formContainer: {
    ...BaseStyles.card,
    marginBottom: 20,
  },
  formTitle: BaseStyles.title,
  formSubtitle: BaseStyles.subtitle,
  formInputGroup: BaseStyles.inputGroup,
  formLabel: BaseStyles.label,
  formInput: BaseStyles.input,
  formButton: BaseStyles.buttonPrimary,
  formButtonText: BaseStyles.buttonTextPrimary,
};

// Add to your HomeStyles object in componentStyles.js
export const HomeStyles = {
  // Keep existing styles but update for trucking theme
  
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header - Updated for trucking
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.md,
    paddingBottom: Sizes.md,
    backgroundColor: Colors.deepNavy,
  },
  headerTitle: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: Sizes.small,
    color: Colors.lightBlue,
    marginTop: 2,
  },
  welcomeText: {
    fontSize: Sizes.body,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  userName: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  profileButton: {
    padding: Sizes.xs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  avatarText: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  
  // Content Scroll
  contentScroll: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
  },
  
  // Welcome Card
  welcomeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  welcomeTitle: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
  },
  welcomeSubtitle: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
    marginBottom: Sizes.lg,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.xs,
  },
  statLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
  
  // Sections
  section: {
    marginBottom: Sizes.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  sectionTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
  },
  sectionSubtitle: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
    marginBottom: Sizes.md,
  },
  seeAll: {
    color: Colors.primaryBlue,
    fontSize: Sizes.small,
    fontWeight: '600',
  },
  
  // Quick Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    width: '48%',
    marginBottom: Sizes.md,
    alignItems: 'center',
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Sizes.sm,
    color: Colors.primaryBlue,
  },
  actionText: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  // Task Cards
  taskCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.xs,
  },
  taskTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Sizes.sm,
  },
  priorityBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadiusSm,
    minWidth: 60,
    alignItems: 'center',
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
  },
  priorityLow: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  priorityText: {
    fontSize: Sizes.tiny,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  taskLocation: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  taskTime: {
    fontSize: Sizes.small,
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  
  // Trip Cards
  tripCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  tripFrom: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tripArrow: {
    fontSize: Sizes.h4,
    color: Colors.textSecondary,
    marginHorizontal: Sizes.sm,
  },
  tripTo: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripDetail: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  
  // Report Accident Styles
  formCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emergencyButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.md,
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: Sizes.sm,
  },
  emergencyText: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  formNote: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    fontStyle: 'italic',
  },
  formButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    alignItems: 'center',
  },
  formButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.body,
    fontWeight: 'bold',
  },
  reportCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.xs,
  },
  reportType: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Sizes.sm,
  },
  severityBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadiusSm,
    minWidth: 60,
    alignItems: 'center',
  },
  severityHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  severityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
  },
  severityLow: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  severityText: {
    fontSize: Sizes.tiny,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  reportLocation: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  reportDate: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  reportStatus: {
    fontSize: Sizes.small,
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  
  // Task History Styles
  filterScroll: {
    marginBottom: Sizes.lg,
  },
  filterButton: {
    backgroundColor: Colors.veryLightBlue,
    borderRadius: 20,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.sm,
    marginRight: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  filterActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.deepNavy,
  },
  filterText: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  historyCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.xs,
  },
  historyTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Sizes.sm,
  },
  statusBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadiusSm,
    minWidth: 80,
    alignItems: 'center',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
  },
  statusScheduled: {
    backgroundColor: '#DBEAFE',
    borderColor: Colors.primaryBlue,
  },
  statusText: {
    fontSize: Sizes.tiny,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  historyLocation: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  historyTime: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.sm,
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: Colors.primaryBlue,
    fontSize: Sizes.small,
    fontWeight: '600',
  },
  
  // Calendar Styles
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  calendarNav: {
    fontSize: Sizes.h4,
    color: Colors.primaryBlue,
    fontWeight: 'bold',
  },
  calendarMonth: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.sm,
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontSize: Sizes.body,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Sizes.xl,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.sm,
    borderRadius: 20,
  },
  calendarDayToday: {
    backgroundColor: Colors.primaryBlue,
  },
  calendarDayEvent: {
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  calendarDayText: {
    fontSize: Sizes.body,
    color: Colors.textPrimary,
  },
  calendarDayTextToday: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryBlue,
    position: 'absolute',
    bottom: 2,
  },
  eventsList: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  eventsTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.md,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primaryBlue,
    marginRight: Sizes.md,
  },
  eventDotImportant: {
    backgroundColor: Colors.accentRed,
  },
  eventTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  
  // Job Tasks Styles
  jobCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  jobStatus: {
    fontSize: Sizes.small,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.sm,
  },
  jobTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.lg,
  },
  jobProgress: {
    marginBottom: Sizes.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.veryLightBlue,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Sizes.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.lg,
  },
  jobDetail: {
    alignItems: 'center',
    flex: 1,
  },
  jobDetailLabel: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  jobDetailValue: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  updateButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    alignItems: 'center',
  },
  updateButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.body,
    fontWeight: 'bold',
  },
  checklistCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  checklistTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  checkboxText: {
    fontSize: Sizes.body,
    color: Colors.primaryBlue,
    fontWeight: 'bold',
  },
  checklistText: {
    fontSize: Sizes.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  
  // Bottom Navigation (Updated for 5 tabs)
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: Sizes.xs,
    paddingVertical: Sizes.sm,
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: Colors.textSecondary,
  },
  navIconActive: {
    color: Colors.primaryBlue,
  },
  navText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  navTextActive: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
};

export const ProfileStyles = {
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.primaryBlue,
  },
  backButton: {
    padding: Sizes.xs,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  editButton: {
    padding: Sizes.sm,
  },
  editButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.body,
    fontWeight: '600',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    padding: Sizes.lg,
  },
  
  // Profile Card
  profileCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.sm,
    borderWidth: 3,
    borderColor: Colors.textWhite,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  changePhotoButton: {
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.md,
    backgroundColor: Colors.veryLightBlue,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  changePhotoText: {
    color: Colors.primaryBlue,
    fontSize: Sizes.small,
    fontWeight: '600',
  },
  
  // Info Sections
  infoSection: {
    marginBottom: Sizes.lg,
  },
  sectionLabel: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
    opacity: 0.8,
  },
  infoText: {
    fontSize: Sizes.h4,
    color: Colors.textDark,
    fontWeight: '500',
  },
  emailNote: {
    fontSize: Sizes.tiny,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: Sizes.xs,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    borderRadius: Sizes.borderRadius,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    fontSize: Sizes.body,
    backgroundColor: Colors.inputBackground,
    color: Colors.textPrimary,
  },
  
  // Save Button
  saveButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.md,
    alignItems: 'center',
    marginTop: Sizes.sm,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.body,
    fontWeight: 'bold',
  },
  
  // Stats Card
  statsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statsTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.sm,
  },
  statLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
  
  // Preferences Card
  preferencesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  preferencesTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.lg,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  preferenceLabel: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  preferenceDescription: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  
  // Actions Card
  actionsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionsTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: Sizes.md,
    width: 30,
    color: Colors.secondaryBlue,
  },
  actionText: {
    fontSize: Sizes.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  actionArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  
  // Danger Card
  dangerCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dangerTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.accentRed,
    marginBottom: Sizes.lg,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  dangerIcon: {
    fontSize: 24,
    marginRight: Sizes.md,
    width: 30,
    color: Colors.accentRed,
  },
  dangerText: {
    fontSize: Sizes.body,
    color: Colors.accentRed,
    flex: 1,
    fontWeight: '600',
  },
  
  // App Info
  appInfo: {
    alignItems: 'center',
    paddingVertical: Sizes.xl,
  },
  appName: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.sm,
  },
  appVersion: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  appCopyright: {
    fontSize: Sizes.tiny,
    color: Colors.textLight,
  },
};

// Add to your componentStyles.js
export const ReportStyles = {
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.deepNavy,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    padding: Sizes.xs,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    padding: Sizes.lg,
  },
  
  // Emergency Section
  emergencySection: {
    backgroundColor: '#FEE2E2',
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.xl,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: Sizes.sm,
  },
  emergencySubtitle: {
    fontSize: Sizes.small,
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.xl,
    marginBottom: Sizes.md,
  },
  emergencyButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyNote: {
    fontSize: Sizes.small,
    color: '#991B1B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Sections
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    marginBottom: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.md,
  },
  sectionSubtitle: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.md,
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: Sizes.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  label: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.accentRed,
  },
  locationLink: {
    color: Colors.primaryBlue,
    fontSize: Sizes.small,
    fontWeight: '600',
  },
  
  // Text Inputs
  textInput: {
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    borderRadius: Sizes.borderRadiusLg,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    fontSize: Sizes.body,
    backgroundColor: Colors.inputBackground,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  // Row Layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Accident Type Grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadius,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  typeButtonSelected: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.deepNavy,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: Sizes.xs,
  },
  typeText: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  typeTextSelected: {
    color: Colors.textWhite,
  },
  
  // Checklist
  checklist: {
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.lg,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  checkLabel: {
    fontSize: Sizes.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  
  // Conditions
  conditionsScroll: {
    marginHorizontal: -Sizes.xs,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadius,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    marginRight: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  conditionButtonSelected: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.deepNavy,
  },
  conditionEmoji: {
    fontSize: 16,
    marginRight: Sizes.xs,
  },
  conditionText: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  conditionTextSelected: {
    color: Colors.textWhite,
  },
  
  // Photos
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderStyle: 'dashed',
    marginBottom: Sizes.md,
  },
  photoIcon: {
    fontSize: 24,
    marginRight: Sizes.sm,
    color: Colors.primaryBlue,
  },
  photoText: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Sizes.sm,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
  },
  photoThumbnailText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
  },
  removePhoto: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    backgroundColor: Colors.accentRed,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  
  // Submit Section
  submitSection: {
    marginBottom: Sizes.xl,
  },
  submitButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    alignItems: 'center',
    marginBottom: Sizes.md,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.h4,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
};

// Replace the entire AdminStyles section at the end of componentStyles.js
export const AdminStyles = StyleSheet.create({
  // Safe Area & Containers
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Loading States
  loadingContainer: BaseStyles.loadingContainer,
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    ...BaseStyles.loadingText,
    color: Colors.primaryBlue,
  },
  loadingSubtext: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.deepNavy,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  welcomeText: {
    fontSize: Sizes.small,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  adminName: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  notificationButton: {
    position: 'relative',
    padding: Sizes.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: Sizes.xs,
    right: Sizes.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.deepNavy,
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  
  // Section Styles
  sectionHeader: {
    marginBottom: Sizes.lg,
  },
  sectionTitle: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
  },
  sectionSubtitle: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
  },
  
  // Stats Section
  statsSection: {
    padding: Sizes.lg,
    paddingTop: Sizes.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: 0.05,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    width: 40,
    height: 40,
    borderRadius: Sizes.borderRadiusLg,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
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
    marginBottom: Sizes.sm,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    marginLeft: Sizes.xs,
  },
  
  // Actions Section
  actionsSection: {
    padding: Sizes.lg,
    paddingTop: 0,
  },
  actionsGrid: HomeStyles.actionsGrid,
  actionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.lg,
    width: '48%',
    marginBottom: Sizes.md,
    alignItems: 'center',
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: Sizes.borderRadiusLg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  actionTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Activity Section
  activitySection: {
    padding: Sizes.lg,
    paddingTop: 0,
  },
  seeAllButton: {
    fontSize: Sizes.small,
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: Sizes.borderRadius,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
  },
  activityDescription: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  activityTime: {
    fontSize: Sizes.tiny,
    color: Colors.textLight,
  },
  
  // Info Section
  infoSection: {
    padding: Sizes.lg,
    paddingTop: 0,
  },
  infoGrid: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.deepNavy,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginRight: Sizes.xs,
  },
  statusText: {
    fontSize: Sizes.tiny,
    fontWeight: '600',
    color: '#059669',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: Sizes.xs,
    paddingVertical: Sizes.sm,
    flex: 1,
  },
  navButtonActive: {
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
  },
  navText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  navTextActive: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  
  // Bottom Spacing
  bottomSpacing: {
    height: 100,
  },

    // NEW USERS SCREEN STYLES
  usersSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadiusLg,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
  },
  usersSearchInput: {
    flex: 1,
    marginLeft: Sizes.sm,
    fontSize: Sizes.body,
    color: Colors.textPrimary,
  },
  usersSortContainer: {
    paddingHorizontal: Sizes.lg,
    marginBottom: Sizes.md,
  },
  usersSortLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.sm,
  },
  usersFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.veryLightBlue,
    borderRadius: 20,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.sm,
    marginRight: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  usersFilterActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.deepNavy,
  },
  usersFilterText: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: Sizes.xs,
  },
  usersEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.xl,
    marginTop: Sizes.xl,
  },
  usersEmptyTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: Sizes.md,
    marginBottom: Sizes.sm,
  },
  usersEmptyText: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  usersUserCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  usersUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  usersAvatarText: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  usersUserName: {
    fontSize: Sizes.body,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: 2,
  },
  usersUserEmail: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  usersUserDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Sizes.xs,
  },
  usersDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Sizes.md,
    marginBottom: Sizes.xs,
  },
  usersDetailText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  usersUserFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.sm,
    paddingTop: Sizes.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  usersJoinDate: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
  },
  usersViewReportsButton: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadius,
  },
  usersViewReportsText: {
    fontSize: Sizes.tiny,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  usersModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  usersModalContainer: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: Sizes.borderRadiusXl,
    borderTopRightRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    maxHeight: '80%',
  },
  usersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  usersModalTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.deepNavy,
  },
  usersModalAvatarContainer: {
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  usersModalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  usersModalAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  usersModalUserName: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.deepNavy,
    marginBottom: Sizes.xs,
  },
  usersModalUserEmail: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
  },
  usersModalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
  },
  usersStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  usersStatNumber: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    marginBottom: Sizes.sm,
  },
  usersStatLabel: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  usersStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
  usersModalDetails: {
    marginBottom: Sizes.lg,
  },
  usersDetailsTitle: {
    fontSize: Sizes.body,
    fontWeight: '600',
    color: Colors.deepNavy,
    marginBottom: Sizes.md,
  },
  usersDetailsContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
  },
  usersDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  usersDetailLabel: {
    color: Colors.textSecondary,
    fontSize: Sizes.small,
  },
  usersDetailValue: {
    fontWeight: '600',
    fontSize: Sizes.small,
    color: Colors.textPrimary,
  },
  usersActionButtons: {
    flexDirection: 'row',
    marginBottom: Sizes.lg,
  },
  usersActionButton: {
    flex: 1,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    alignItems: 'center',
    marginHorizontal: Sizes.xs,
    opacity: 1,
  },
  usersActionButtonText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
    fontSize: Sizes.small,
  },
  usersViewReportsButtonModal: {
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  usersViewReportsTextModal: {
    color: Colors.primaryBlue,
    fontWeight: 'bold',
    fontSize: Sizes.small,
  },

  // USER REPORTS SCREEN STYLES
  userReportsEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.xl,
    marginTop: Sizes.xl,
  },
  userReportsEmptyTitle: {
    fontSize: Sizes.h4,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: Sizes.md,
    marginBottom: Sizes.sm,
  },
  userReportsEmptyText: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userReportsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userReportsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  userReportsInfo: {
    flex: 1,
    marginLeft: Sizes.md,
  },
  userReportsType: {
    fontSize: Sizes.body,
    fontWeight: 'bold',
    color: Colors.deepNavy,
  },
  userReportsDate: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
  },
  userReportsSeverityBadge: {
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.borderRadius,
    borderWidth: 1,
  },
  userReportsSeverityText: {
    fontSize: Sizes.tiny,
    fontWeight: 'bold',
  },
  userReportsLocation: {
    fontSize: Sizes.small,
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  userReportsDescription: {
    fontSize: Sizes.small,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  userReportsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.sm,
    paddingTop: Sizes.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  userReportsFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userReportsFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  userReportsFooterText: {
    fontSize: Sizes.tiny,
    marginLeft: 4,
  },
  userReportsWeatherText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
  },
});