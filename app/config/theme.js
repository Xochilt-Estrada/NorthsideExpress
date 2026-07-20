// app/config/theme.js
export const Colors = {
  // New Blue Theme - Pastel Blue to Navy
  primaryBlue: '#1E3A8A',      // Navy Blue
  secondaryBlue: '#3B82F6',    // Medium Blue
  lightBlue: '#60A5FA',        // Light Blue
  pastelBlue: '#93C5FD',       // Pastel Blue
  veryLightBlue: '#DBEAFE',    // Very Light Blue
  
  // Backgrounds (White and Light Blues)
  background: '#FFFFFF',       // Pure White
  cardBackground: '#F8FAFC',   // Off-white with blue tint
  inputBackground: '#F1F5F9',  // Light blue-gray
  
  // Accents (Keeping some for variety)
  accentOrange: '#FB923C',     // Warm orange for calls to action
  accentBlue: '#2563EB',       // Bright blue
  accentGreen: '#10B981',      // Green for success
  accentRed: '#EF4444',        // Red for errors
  
  // Borders (Blue-based)
  borderLight: '#E2E8F0',      // Light blue border
  borderMedium: '#CBD5E1',     // Medium blue border
  borderDark: '#94A3B8',       // Darker blue border
  
  // Text
  textPrimary: '#1E293B',      // Dark blue-gray
  textSecondary: '#475569',    // Medium blue-gray
  textLight: '#64748B',        // Light blue-gray
  textWhite: '#FFFFFF',        // White
  textDark: '#0F172A',         // Very dark blue
  
  // Status (Blue-themed)
  success: '#10B981',          // Green (kept for visibility)
  error: '#EF4444',            // Red (kept for visibility)
  warning: '#F59E0B',          // Amber
  info: '#3B82F6',             // Blue
  
  // Additional blues for gradients
  deepNavy: '#1E40AF',         // Deep Navy
  skyBlue: '#0EA5E9',          // Sky Blue
  powderBlue: '#BFDBFE',       // Powder Blue
};

export const Fonts = {
  regular: 'System',
  bold: 'System',
  monospace: 'monospace',
};

export const Sizes = {
  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  small: 14,
  tiny: 12,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  
  // Border Radius
  borderRadiusSm: 8,
  borderRadius: 12,
  borderRadiusLg: 16,
  borderRadiusXl: 24,
  
  // Shadows
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
};

export const Theme = {
  Colors,
  Fonts,
  Sizes,
};