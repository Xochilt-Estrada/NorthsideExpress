// app/styles/baseStyles.js - Update colors
import { StyleSheet } from 'react-native';
import { Theme } from '../config/theme';

const { Colors, Sizes, Fonts } = Theme;

export const BaseStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    justifyContent: 'center',
    paddingVertical: Sizes.xl,
  },
  
  // Background Elements
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.03,
    backgroundColor: Colors.pastelBlue,
  },
  coffeeIconBg: {
    position: 'absolute',
    top: 100,
    right: 30,
    fontSize: 80,
    color: Colors.lightBlue,
    opacity: 0.2,
    transform: [{ rotate: '15deg' }],
  },
  
  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: Sizes.sm,
    color: Colors.primaryBlue,
  },
  logoText: {
    fontSize: Sizes.h2,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: Sizes.h4,
    color: Colors.secondaryBlue,
    fontStyle: 'italic',
  },
  
  // Cards
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizes.borderRadiusXl,
    padding: Sizes.lg,
    shadowColor: Colors.primaryBlue,
    shadowOffset: Sizes.shadowOffset,
    shadowOpacity: Sizes.shadowOpacity,
    shadowRadius: Sizes.shadowRadius,
    elevation: Sizes.elevation,
    marginBottom: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  
  // Typography
  title: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
    marginBottom: Sizes.xl,
    lineHeight: 24,
  },
  label: {
    fontSize: Sizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: Sizes.lg,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    borderRadius: Sizes.borderRadiusLg,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    fontSize: Sizes.body,
    backgroundColor: Colors.inputBackground,
    color: Colors.textPrimary,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.lg,
    alignItems: 'center',
    marginTop: Sizes.sm,
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.md,
    alignItems: 'center',
    marginTop: Sizes.sm,
  },
  buttonTertiary: {
    backgroundColor: Colors.veryLightBlue,
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.md,
    alignItems: 'center',
    marginTop: Sizes.sm,
    borderWidth: 1.5,
    borderColor: Colors.lightBlue,
  },
  buttonDisabled: {
    backgroundColor: Colors.borderMedium,
    opacity: 0.6,
  },
  buttonTextPrimary: {
    color: Colors.textWhite,
    fontSize: Sizes.h4,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: Colors.textWhite,
    fontSize: Sizes.body,
    fontWeight: '600',
  },
  buttonTextTertiary: {
    color: Colors.primaryBlue,
    fontSize: Sizes.body,
    fontWeight: '600',
  },
  
  // Links
  link: {
    alignSelf: 'center',
    marginTop: Sizes.lg,
    padding: Sizes.sm,
  },
  linkText: {
    color: Colors.primaryBlue,
    fontSize: Sizes.body,
    fontWeight: '600',
  },
  
  // Dividers
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizes.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    marginHorizontal: Sizes.md,
    color: Colors.textSecondary,
    fontSize: Sizes.small,
  },
  
  // Info Boxes
  infoBox: {
    marginTop: Sizes.lg,
    padding: Sizes.md,
    borderRadius: Sizes.borderRadius,
    borderWidth: 1,
  },
  infoSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  infoWarning: {
    backgroundColor: Colors.veryLightBlue,
    borderColor: Colors.lightBlue,
  },
  infoInfo: {
    backgroundColor: '#DBEAFE',
    borderColor: Colors.pastelBlue,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: Sizes.sm,
  },
  infoText: {
    fontSize: Sizes.small,
    marginBottom: Sizes.xs,
  },
  
  // Status
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.lg,
    paddingVertical: Sizes.sm,
    backgroundColor: Colors.inputBackground,
    borderRadius: Sizes.borderRadius,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Sizes.sm,
  },
  statusText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    fontFamily: Fonts.monospace,
  },
  
  // Platform Info (for debugging)
  platformInfo: {
    backgroundColor: Colors.inputBackground,
    padding: Sizes.sm,
    borderRadius: Sizes.borderRadiusSm,
    marginBottom: Sizes.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondaryBlue,
  },
  platformText: {
    fontSize: Sizes.tiny,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  apiUrlText: {
    fontSize: 10,
    color: Colors.textLight,
    fontFamily: Fonts.monospace,
    marginTop: Sizes.xs,
  },
  
  // Password Input Specific
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  showHideText: {
    color: Colors.primaryBlue,
    fontSize: Sizes.small,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: Sizes.md,
    top: Sizes.md,
    padding: Sizes.xs,
  },
  eyeIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Sizes.lg,
    fontSize: Sizes.body,
    color: Colors.textPrimary,
  },
  
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Sizes.lg,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Sizes.lg,
    color: Colors.accentRed,
  },
  errorTitle: {
    fontSize: Sizes.h3,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  errorText: {
    fontSize: Sizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.xl,
  },
  errorButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Sizes.borderRadiusLg,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.xl,
  },
  errorButtonText: {
    color: Colors.textWhite,
    fontSize: Sizes.h4,
    fontWeight: 'bold',
  },
});