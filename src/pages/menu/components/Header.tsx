import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

export const Header = () => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Ionicons name="timer-outline" size={40} color={theme.colors.primary} />
            <View style={styles.titleRow}>
                <Text style={[styles.titleLight, { color: theme.colors.textPrimary }]}>Stop</Text>
                <Text style={[styles.titleBold, { color: theme.colors.primary }]}>Watch</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    titleLight: {
        fontSize: 32,
        fontWeight: '300',
        letterSpacing: -0.5,
    },
    titleBold: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
});
