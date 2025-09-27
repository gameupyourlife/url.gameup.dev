/**
 * Unified Analytics Color System - Pink Theme
 * Provides consistent pink-based colors for charts and analytics components
 * that work across light/dark themes and maintain accessibility
 */

export interface AnalyticsColorPalette {
  primary: string
  primaryLight: string
  secondary: string
  secondaryLight: string
  success: string
  successLight: string
  warning: string
  warningLight: string
  info: string
  infoLight: string
  error: string
  errorLight: string
  text: string
  textMuted: string
  background: string
  backgroundMuted: string
  border: string
  borderMuted: string
}

/**
 * Get the unified pink-themed color palette based on theme
 */
export function getAnalyticsColors(isDark: boolean): AnalyticsColorPalette {
  if (isDark) {
    return {
      // Primary pinks - main brand colors (matching globals.css)
      primary: '#d1477a',        // oklch(0.75 0.12 350) from globals.css
      primaryLight: '#e879a0',   // lighter pink
      
      // Secondary grays - supporting elements
      secondary: '#94a3b8',      // slate-400
      secondaryLight: '#cbd5e1', // slate-300
      
      // Success greens - positive metrics
      success: '#4ade80',        // green-400
      successLight: '#86efac',   // green-300
      
      // Warning - muted pink/orange for important data
      warning: '#f59e9e',        // rose-300 equivalent
      warningLight: '#fecaca',   // rose-200 equivalent
      
      // Info - subtle pink variations
      info: '#f3b4d1',           // pink-300 equivalent
      infoLight: '#fce7f3',      // pink-100 equivalent
      
      // Error reds - negative metrics
      error: '#f87171',          // red-400
      errorLight: '#fca5a5',     // red-300
      
      // Text colors
      text: '#f1f5f9',           // slate-100
      textMuted: '#94a3b8',      // slate-400
      
      // Background colors
      background: '#0f172a',     // slate-900
      backgroundMuted: '#1e293b', // slate-800
      
      // Border colors
      border: '#334155',         // slate-700
      borderMuted: '#475569',    // slate-600
    }
  } else {
    return {
      // Primary pinks - main brand colors (matching globals.css)
      primary: '#b54675',        // oklch(0.65 0.15 350) from globals.css
      primaryLight: '#d1477a',   // lighter pink
      
      // Secondary grays - supporting elements
      secondary: '#64748b',      // slate-500
      secondaryLight: '#94a3b8', // slate-400
      
      // Success greens - positive metrics
      success: '#22c55e',        // green-500
      successLight: '#4ade80',   // green-400
      
      // Warning - rose tones for important data
      warning: '#f43f5e',        // rose-500
      warningLight: '#fb7185',   // rose-400
      
      // Info - subtle pink variations
      info: '#ec4899',           // pink-500
      infoLight: '#f472b6',      // pink-400
      
      // Error reds - negative metrics
      error: '#ef4444',          // red-500
      errorLight: '#f87171',     // red-400
      
      // Text colors
      text: '#0f172a',           // slate-900
      textMuted: '#64748b',      // slate-500
      
      // Background colors
      background: '#ffffff',     // white
      backgroundMuted: '#f8fafc', // slate-50
      
      // Border colors
      border: '#e2e8f0',         // slate-200
      borderMuted: '#cbd5e1',    // slate-300
    }
  }
}

/**
 * Chart-specific color arrays for multi-series data - pink theme variations
 */
export function getChartColorSeries(isDark: boolean): string[] {
  const colors = getAnalyticsColors(isDark)
  return [
    colors.primary,      // Main pink
    colors.success,      // Green for positive metrics
    colors.primaryLight, // Light pink variation
    colors.warning,      // Rose/pink warning
    colors.info,         // Pink info
    colors.secondary,    // Gray for neutral
    colors.successLight, // Light green
    colors.warningLight, // Light rose
  ]
}

/**
 * Device type specific colors - pink theme variations only
 */
export function getDeviceColors(isDark: boolean) {
  const colors = getAnalyticsColors(isDark)
  return {
    mobile: colors.primary,      // Main pink for mobile
    desktop: colors.primaryLight, // Light pink for desktop
    tablet: colors.info,         // Lighter pink for tablet
    unknown: colors.secondary,   // Gray for unknown
  }
}

/**
 * Traffic quality colors - pink theme
 */
export function getTrafficColors(isDark: boolean) {
  const colors = getAnalyticsColors(isDark)
  return {
    human: colors.primary,    // Pink for human traffic
    bot: colors.secondary,    // Gray for bot traffic
  }
}

/**
 * Status badge colors - using pink theme
 */
export function getStatusColors(isDark: boolean) {
  const colors = getAnalyticsColors(isDark)
  return {
    active: colors.success,   // Green for active (positive)
    inactive: colors.secondary, // Gray for inactive
    error: colors.error,      // Red for error
    warning: colors.warning,  // Rose for warning
  }
}