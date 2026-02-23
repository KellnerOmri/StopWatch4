import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ScreenContainerProps {
    children: ReactNode;
    noPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, noPadding }) => {
    const { theme, isDarkMode } = useTheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: noPadding ? 0 : theme.spacing.md,
                },
            ]}
        >
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
