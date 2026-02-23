import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface BackButtonProps {
    onPress: () => void;
    label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, label }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
            <Text style={[styles.text, { color: theme.colors.primary }]}>
                {label ?? t.back}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    text: {
        fontSize: 17,
        fontWeight: '400',
    },
});
