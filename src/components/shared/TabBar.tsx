import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface TabBarProps {
    tabs: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, selectedIndex, onSelect }) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surfaceSecondary,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.xs,
                },
            ]}
        >
            {tabs.map((tab, index) => {
                const isSelected = index === selectedIndex;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(index)}
                        style={[
                            styles.tab,
                            {
                                backgroundColor: isSelected ? theme.colors.surface : 'transparent',
                                borderRadius: theme.borderRadius.md,
                                shadowColor: isSelected ? theme.colors.shadow : 'transparent',
                                shadowOffset: isSelected ? { width: 0, height: 2 } : { width: 0, height: 0 },
                                shadowOpacity: isSelected ? 1 : 0,
                                shadowRadius: isSelected ? 4 : 0,
                                elevation: isSelected ? 2 : 0,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                {
                                    color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
                                    fontWeight: isSelected ? '600' : '400',
                                },
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 14,
    },
});
