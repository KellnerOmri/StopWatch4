import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemedText } from '../../../components/shared/ThemedText';
import { Card } from '../../../components/shared/Card';

interface MenuButtonProps {
    title: string;
    selectedPage: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    accentColor: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ title, selectedPage, iconName, accentColor }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity onPress={selectedPage} activeOpacity={0.7}>
            <Card style={styles.card}>
                <View style={styles.row}>
                    <View style={[styles.iconCircle, { backgroundColor: accentColor + '20' }]}>
                        <Ionicons name={iconName} size={22} color={accentColor} />
                    </View>
                    <ThemedText variant="body" style={styles.label}>{title}</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    label: {
        flex: 1,
        fontWeight: '500',
    },
});
