import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

type Variant = 'heading1' | 'heading2' | 'body' | 'caption' | 'timer' | 'button';

interface ThemedTextProps {
    variant?: Variant;
    color?: string;
    style?: TextStyle | TextStyle[];
    children: React.ReactNode;
    numberOfLines?: number;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
    variant = 'body',
    color,
    style,
    children,
    numberOfLines,
}) => {
    const { theme } = useTheme();

    const variantStyle = theme.typography[variant];
    const defaultColor =
        variant === 'caption' ? theme.colors.textSecondary : theme.colors.textPrimary;

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[
                {
                    fontSize: variantStyle.fontSize,
                    fontWeight: variantStyle.fontWeight as TextStyle['fontWeight'],
                    fontFamily: 'fontFamily' in variantStyle ? (variantStyle as any).fontFamily : undefined,
                    color: color ?? defaultColor,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
};
