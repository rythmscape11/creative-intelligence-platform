/**
 * Aureon One Dashboard Theme Tokens
 * 
 * Consistent design system for all logged-in dashboard screens.
 */

export const dashboardTheme = {
    // Backgrounds
    colors: {
        // Main backgrounds
        bgApp: '#050709',
        bgSidebar: '#050709',
        bgHeader: '#0B0C10',
        bgCard: '#111827',
        bgCardHover: '#1F2933',
        bgInput: '#0F1419',

        // Text
        textPrimary: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textTertiary: '#6B7280',
        textMuted: '#4B5563',

        // Brand accents
        aureonGold: '#F1C40F',
        aureonGoldHover: '#D4AC0D',
        marsRed: '#B3001B',
        marsRedHover: '#8E0016',
        signalRed: '#A81B24',

        // Borders
        borderDefault: '#1F2937',
        borderSubtle: '#111827',
        borderActive: '#F1C40F',

        // States
        success: '#10B981',
        successBg: '#10B98120',
        warning: '#F59E0B',
        warningBg: '#F59E0B20',
        error: '#EF4444',
        errorBg: '#EF444420',
        info: '#3B82F6',
        infoBg: '#3B82F620',
    },

    // Typography
    fonts: {
        heading: "'Space Grotesk', sans-serif",
        body: "'Inter', sans-serif",
    },

    // Font sizes
    fontSize: {
        pageTitle: '24px',
        sectionTitle: '20px',
        cardTitle: '16px',
        body: '14px',
        small: '12px',
        label: '11px',
    },

    // Spacing
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },

    // Border radius
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },

    // Sidebar
    sidebar: {
        widthExpanded: '260px',
        widthCollapsed: '72px',
    },
} as const;

// CSS custom properties for Tailwind integration
export const dashboardCssVars = `
:root {
    --dashboard-bg-app: #050709;
    --dashboard-bg-sidebar: #050709;
    --dashboard-bg-header: #0B0C10;
    --dashboard-bg-card: #111827;
    --dashboard-bg-card-hover: #1F2933;
    --dashboard-text-primary: #FFFFFF;
    --dashboard-text-secondary: #9CA3AF;
    --dashboard-text-tertiary: #6B7280;
    --dashboard-aureon-gold: #F1C40F;
    --dashboard-mars-red: #B3001B;
    --dashboard-border: #1F2937;
}
`;

export default dashboardTheme;
