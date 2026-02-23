import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, noPadding }) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    padding: noPadding ? 0 : theme.spacing.md,
                    shadowColor: theme.colors.shadow,
                    borderColor: theme.colors.border,
                    borderWidth: StyleSheet.hairlineWidth,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
});
