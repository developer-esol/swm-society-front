/**
 * COLOR REFERENCE GUIDE - SWM Society Front
 * 
 * This file serves as a comprehensive reference for all colors used in the application.
 * It maps colors found in pages to their theme equivalents and identifies areas for improvement.
 * 
 * Last Updated: December 2, 2025
 */

// ============================================
// ACTIVE THEME COLORS (From src/theme/index.tsx)
// ============================================

export const THEME_COLORS = {
  // Button Colors
  BUTTON_PRIMARY: '#dc2626',          // Red - Main CTA button
  BUTTON_PRIMARY_HOVER: '#b91c1c',    // Dark Red - Hover state
  BUTTON_DISABLED: '#9ca3af',         // Gray - Disabled state

  // Text Colors
  TEXT_PRIMARY: '#000000',            // Black - Main text
  TEXT_SECONDARY: '#ffffff',          // White - Inverse text
  TEXT_DISABLED: '#6b7280',           // Gray - Disabled/secondary text
  TEXT_DARK: '#1f2937',               // Dark Gray - Headings
  TEXT_GRAY: '#374151',               // Gray - Secondary text
  TEXT_LIGHT_GRAY: '#666',            // Light Gray - Subtle text

  // Background Colors
  BG_DEFAULT: '#ffffff',              // White - Main background
  BG_PAPER: '#ffffff',                // White - Card background
  BG_LIGHT: '#f9fafb',                // Off-White - Light sections
  BG_LIGHTER: '#f3f4f6',              // Light Gray - Alternate rows

  // Border Colors
  BORDER_DEFAULT: '#e5e7eb',          // Light Gray - Borders
  BORDER_LIGHT: '#e0e0e0',            // Light Gray - Subtle borders

  // Input Colors
  INPUT_BG: '#ffffff',                // White - Input background

  // Icon Colors
  ICON_PRIMARY: '#d32f2f',            // Red - Icons

  // Overlay Colors
  OVERLAY_DARK: '#000000',            // Black - Dark overlay
  OVERLAY_DARK_HOVER: '#1a1a1a',      // Almost Black - Hover
  OVERLAY_GRAY: '#cccccc',            // Gray - Gray overlay
};

// ============================================
// HARDCODED COLORS FOUND IN PAGES
// ============================================

export const HARDCODED_COLORS = {
  // Status Colors (YourOrdersPage.tsx)
  STATUS_DELIVERED: '#10b981',        // Green
  STATUS_SHIPPED: '#f59e0b',          // Amber
  STATUS_PROCESSING: '#3b82f6',       // Blue
  STATUS_CANCELLED: '#ef4444',        // Red
  STATUS_DEFAULT: '#6b7280',          // Gray

  // Brand/Product Colors (YourOrdersPage.tsx - Color Mapping)
  COLOR_ORANGE: '#ea580c',            // Orange
  COLOR_BLUE: '#3b82f6',              // Blue
  COLOR_RED: '#dc2626',               // Red
  COLOR_BLACK: '#000000',             // Black
  COLOR_WHITE: '#ffffff',             // White
  COLOR_GREEN: '#10b981',             // Green
  COLOR_PURPLE: '#a855f7',            // Purple

  // Expiring Soon Box (LoyaltyWalletPage.tsx)
  EXPIRING_BG: '#fff8cbff',           // Warm Yellow
  EXPIRING_BORDER: '#fcd34d',         // Yellow
  EXPIRING_TEXT_DARK: '#92400e',      // Dark Brown
  EXPIRING_TEXT_ACCENT: '#ea580c',    // Orange
  EXPIRING_TEXT_SECONDARY: '#b45309', // Brown

  // Gradient (LoyaltyWalletPage.tsx)
  GRADIENT_DARK_RED: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',

  // Card Colors (LoyaltyWalletPage.tsx)
  REWARD_CHIP_BG: '#fef2f2',          // Very Light Red

  // MUI Theme References (Incorrect Usage)
  // These should be replaced with theme colors
  MUI_GREY_50: '#f9fafb',             // Should use colors.background.light
  MUI_GREY_100: '#f3f4f6',            // Should use colors.background.lighter
  MUI_GREY_200: '#e5e7eb',            // Should use colors.border.default
  MUI_GREY_300: '#d1d5db',            // Should use colors.border.light
  MUI_GREY_500: '#6b7280',            // Should use colors.text.disabled
  MUI_GREY_600: '#4b5563',            // Not in use
  MUI_GREY_700: '#374151',            // Should use colors.text.gray
};

// ============================================
// COLOR USAGE BY FILE
// ============================================

export const COLORS_BY_FILE = {
  'CommunityPage.tsx': {
    status: 'UPDATED',
    colors: [
      'colors.button.primary',
      'colors.button.primaryHover',
      'colors.background.default',
      'colors.background.lighter',
      'colors.text.primary',
    ],
    hardcoded: [],
  },

  'LoyaltyWalletPage.tsx': {
    status: 'PARTIALLY_UPDATED',
    colors: [
      'colors.background.paper',
      'colors.border.default',
      'colors.text.disabled',
      'colors.background.lighter',
      'colors.button.primary',
      'colors.button.primaryHover',
      'colors.button.primaryDisabled',
    ],
    hardcoded: [
      '#fff8cbff (expiring box)',
      '#fcd34d (expiring border)',
      '#92400e (expiring text)',
      '#ea580c (expiring accent)',
      '#b45309 (expiring secondary)',
      'linear-gradient (dark red gradient)',
      '#6b7280 (text colors)',
      '#10b981 (trend up icon)',
      '#1f2937 (heading colors)',
      '#059669 (text colors)',
      '#fef2f2 (reward chip)',
    ],
    recommendations: [
      'Replace #6b7280 with colors.text.disabled',
      'Replace #1f2937 with colors.text.dark',
      'Create status color constants',
      'Extract brand colors to theme',
    ],
  },

  'ProductDetailsPage.tsx': {
    status: 'UPDATED',
    colors: [
      'colors.button.primary',
      'colors.button.primaryHover',
    ],
    hardcoded: [],
  },

  'ShopPage.tsx': {
    status: 'MOSTLY_UPDATED',
    colors: [
      'colors.background.lighter',
      'colors.border.light',
      'colors.text.primary',
      'colors.background.light',
      'colors.border.default',
      'colors.button.primary',
      'colors.text.secondary',
      'colors.text.gray',
    ],
    hardcoded: [
      '"white" (background)',
      '"text.secondary" (incorrect MUI reference)',
    ],
    recommendations: [
      'Replace "white" with colors.background.default',
      'Fix MUI theme references',
    ],
  },

  'ThomasMushetStoryPage.tsx': {
    status: 'NEEDS_UPDATE',
    colors: [],
    hardcoded: [
      '"white" (background)',
    ],
    recommendations: [
      'Replace "white" with colors.background.default',
    ],
  },

  'WishlistPage.tsx': {
    status: 'PARTIALLY_UPDATED',
    colors: [
      'colors.button.primary',
      'colors.text.secondary',
      'colors.button.primaryHover',
      'colors.background.lighter',
      'colors.border.default',
      'colors.button.primaryDisabled',
    ],
    hardcoded: [
      '"black" (text)',
      '"grey.600", "grey.500" (text colors)',
      'rgba(0,0,0,0.05) (overlay)',
    ],
    recommendations: [
      'Replace "black" with colors.text.primary',
      'Replace "grey.*" with colors.text.disabled',
      'Create overlay color in theme',
    ],
  },

  'YourOrdersPage.tsx': {
    status: 'PARTIALLY_UPDATED',
    colors: [
      'colors.background.default',
      'colors.text.primary',
      'colors.border.default',
      'colors.background.lighter',
    ],
    hardcoded: [
      '#10b981 (delivered status)',
      '#f59e0b (shipped status)',
      '#3b82f6 (processing status)',
      '#ef4444 (cancelled status)',
      '#ea580c (orange color)',
      '#3b82f6 (blue color)',
      '#dc2626 (red color)',
      '#000000 (black color)',
      '#ffffff (white color)',
      '#10b981 (green color)',
      '#a855f7 (purple color)',
      '#6b7280 (text colors)',
      '#9ca3af (text colors)',
    ],
    recommendations: [
      'Extract status colors to theme constants',
      'Extract product color mapping to constants',
      'Replace #6b7280 with colors.text.disabled',
      'Replace #9ca3af with colors.button.primaryDisabled',
    ],
  },

  'YourPostsPage.tsx': {
    status: 'UPDATED',
    colors: [
      'colors.background.default',
      'colors.text.primary',
      'colors.button.primary',
      'colors.text.secondary',
      'colors.button.primaryHover',
      'colors.text.dark',
      'colors.border.default',
    ],
    hardcoded: [
      '#dc2626 (like button colors)',
    ],
    recommendations: [
      'Replace #dc2626 with colors.button.primary',
    ],
  },
};

// ============================================
// REPLACEMENT RULES
// ============================================

export const REPLACEMENT_RULES = {
  '#dc2626': { theme: 'colors.button.primary', context: 'Primary button color' },
  '#b91c1c': { theme: 'colors.button.primaryHover', context: 'Button hover state' },
  '#9ca3af': { theme: 'colors.button.primaryDisabled', context: 'Disabled button' },
  
  '#000000': { theme: 'colors.text.primary', context: 'Black text' },
  '#ffffff': { theme: 'colors.text.secondary or colors.background.default', context: 'White text or background' },
  '#6b7280': { theme: 'colors.text.disabled', context: 'Gray text' },
  '#1f2937': { theme: 'colors.text.dark', context: 'Dark heading text' },
  '#374151': { theme: 'colors.text.gray', context: 'Gray text' },
  '#666': { theme: 'colors.text.gray', context: 'Light gray text' },
  
  '#ffffff (bg)': { theme: 'colors.background.default', context: 'White background' },
  '#f9fafb': { theme: 'colors.background.light', context: 'Off-white background' },
  '#f3f4f6': { theme: 'colors.background.lighter', context: 'Light gray background' },
  
  '#e5e7eb': { theme: 'colors.border.default', context: 'Light gray border' },
  '#e0e0e0': { theme: 'colors.border.light', context: 'Gray border' },
  '#d1d5db': { theme: 'colors.border.default', context: 'Border' },
  
  '"white"': { theme: 'colors.background.default', context: 'MUI theme reference to white' },
  '"black"': { theme: 'colors.text.primary', context: 'MUI theme reference to black' },
  '"text.secondary"': { theme: 'colors.text.disabled', context: 'MUI incorrect reference' },
  '"grey.600"': { theme: 'colors.text.disabled', context: 'MUI gray reference' },
  '"grey.500"': { theme: 'colors.text.disabled', context: 'MUI gray reference' },
};

// ============================================
// STATUS COLORS (TO BE EXTRACTED)
// ============================================

export const STATUS_COLORS = {
  DELIVERED: '#10b981',   // Green
  SHIPPED: '#f59e0b',     // Amber
  PROCESSING: '#3b82f6',  // Blue
  CANCELLED: '#ef4444',   // Red
  DEFAULT: '#6b7280',     // Gray
};

export const PRODUCT_COLORS_MAP = {
  Orange: '#ea580c',
  Blue: '#3b82f6',
  Red: '#dc2626',
  Black: '#000000',
  White: '#ffffff',
  Green: '#10b981',
  Purple: '#a855f7',
};

// ============================================
// STATISTICS
// ============================================

export const STATISTICS = {
  total_files_audited: 7,
  files_updated: 3,
  files_partially_updated: 6,
  files_needs_update: 2,
  files_not_audited: 7,
  total_hardcoded_colors: 48,
  unique_hardcoded_colors: 16,
};
