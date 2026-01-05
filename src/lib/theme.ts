/**
 * Aureon One - Theme Configuration
 * 
 * Brand colors, typography, and spacing tokens for consistent design.
 */

// ==================== BRAND COLORS ====================

export const colors = {
    // Primary Brand Colors (Legacy - Aureon Gold/Red)
    aureonGold: '#F1C40F',
    marsRed: '#B3001B',
    signalRed: '#A81B24',

    // Soft Midnight Palette (Soothing, Modern)
    softMidnight: {
        primary: '#3B82F6',       // Blue-500 - Main CTA
        primaryHover: '#2563EB',  // Blue-600 - Hover state
        accent: '#A78BFA',        // Violet-400 - Secondary accent
        background: '#0F172A',    // Slate-900 - Main background
        backgroundLight: '#1E293B', // Slate-800 - Lighter sections
        text: '#F1F5F9',          // Slate-100 - Primary text
        textMuted: '#94A3B8',     // Slate-400 - Secondary text
        textDim: '#64748B',       // Slate-500 - Tertiary text
    },

    // Neutrals
    midnightCharcoal: '#0A0A0A',
    pureWhite: '#FFFFFF',

    // Extended Neutrals
    charcoal: {
        50: '#F8F9FA',
        100: '#E9ECEF',
        200: '#DEE2E6',
        300: '#CED4DA',
        400: '#ADB5BD',
        500: '#6C757D',
        600: '#495057',
        700: '#343A40',
        800: '#212529',
        900: '#0A0A0A',
    },

    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
} as const;

// ==================== TYPOGRAPHY ====================

export const typography = {
    fontFamily: {
        primary: '"Inter", system-ui, -apple-system, sans-serif',
        heading: '"Space Grotesk", "Inter", system-ui, sans-serif',
        mono: '"JetBrains Mono", "Fira Code", monospace',
    },

    fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
        '6xl': '3.75rem',   // 60px
        '7xl': '4.5rem',    // 72px
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    lineHeight: {
        tight: '1.1',
        snug: '1.2',
        normal: '1.5',
        relaxed: '1.625',
    },

    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
} as const;

// ==================== SPACING ====================

export const spacing = {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
} as const;

// ==================== BREAKPOINTS ====================

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ==================== SHADOWS ====================

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.2)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.25)',
    glow: {
        gold: '0 0 40px rgba(241, 196, 15, 0.3)',
        red: '0 0 40px rgba(179, 0, 27, 0.3)',
    },
} as const;

// ==================== BORDERS ====================

export const borders = {
    radius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
    },
} as const;

// ==================== TRANSITIONS ====================

export const transitions = {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
} as const;

// ==================== THEME OBJECT ====================

export const theme = {
    colors,
    typography,
    spacing,
    breakpoints,
    shadows,
    borders,
    transitions,
} as const;

export default theme;
