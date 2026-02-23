export interface Theme {
    colors: {
        background: string;
        surface: string;
        surfaceSecondary: string;
        primary: string;
        primaryContainer: string;
        onPrimary: string;
        success: string;
        danger: string;
        warning: string;
        border: string;
        shadow: string;
        textPrimary: string;
        textSecondary: string;
        textTertiary: string;
        timerBackground: string;
        timerText: string;
        bottomBar: string;
        inputBackground: string;
        inputBorder: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    typography: {
        heading1: { fontSize: number; fontWeight: string };
        heading2: { fontSize: number; fontWeight: string };
        body: { fontSize: number; fontWeight: string };
        caption: { fontSize: number; fontWeight: string };
        timer: { fontSize: number; fontWeight: string; fontFamily: string };
        button: { fontSize: number; fontWeight: string };
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
}

export const lightTheme: Theme = {
    colors: {
        background: '#F5F5F7',
        surface: '#FFFFFF',
        surfaceSecondary: '#F0F0F3',
        primary: '#2563EB',
        primaryContainer: '#DBEAFE',
        onPrimary: '#FFFFFF',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
        border: '#E2E8F0',
        shadow: 'rgba(0,0,0,0.08)',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        timerBackground: '#1E3A5F',
        timerText: '#FFFFFF',
        bottomBar: '#FFFFFF',
        inputBackground: '#F8FAFC',
        inputBorder: '#E2E8F0',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    typography: {
        heading1: { fontSize: 28, fontWeight: '700' },
        heading2: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        caption: { fontSize: 13, fontWeight: '400' },
        timer: { fontSize: 48, fontWeight: '600', fontFamily: 'Menlo' },
        button: { fontSize: 16, fontWeight: '600' },
    },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
};

export const darkTheme: Theme = {
    colors: {
        background: '#0F172A',
        surface: '#1E293B',
        surfaceSecondary: '#273548',
        primary: '#3B82F6',
        primaryContainer: '#1E3A5F',
        onPrimary: '#FFFFFF',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#FBBF24',
        border: '#334155',
        shadow: 'rgba(0,0,0,0.3)',
        textPrimary: '#F1F5F9',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        timerBackground: '#0C2340',
        timerText: '#FFFFFF',
        bottomBar: '#1E293B',
        inputBackground: '#273548',
        inputBorder: '#334155',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    typography: {
        heading1: { fontSize: 28, fontWeight: '700' },
        heading2: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        caption: { fontSize: 13, fontWeight: '400' },
        timer: { fontSize: 48, fontWeight: '600', fontFamily: 'Menlo' },
        button: { fontSize: 16, fontWeight: '600' },
    },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
};
