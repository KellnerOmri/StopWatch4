import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScrollView = Animated.ScrollView;
import { useTheme } from '../../../theme/ThemeContext';
import { ThemedText } from '../../../components/shared/ThemedText';

interface TimePickerProps {
    header: string;
    numberArray: string[];
    selectedNumber: string;
    setSelectedNumber: (value: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ numberArray, setSelectedNumber, selectedNumber, header }) => {
    const { theme } = useTheme();
    const scrollViewRef: any = useRef(null);
    const selectedIndex = numberArray.indexOf(selectedNumber);

    React.useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: (selectedIndex - 3) * 48, animated: true });
        }
    }, []);

    const INFINITY_MULTIPLIER = 2;
    const getInfiniteData = () => {
        const infiniteData = [];
        for (let i = 0; i < INFINITY_MULTIPLIER; i++) {
            infiniteData.push(...numberArray);
        }
        return infiniteData;
    };

    return (
        <View style={styles.container}>
            <ThemedText variant="caption" style={[styles.header, { color: theme.colors.textSecondary }]}>
                {header}
            </ThemedText>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {getInfiniteData().map((number, index) => {
                    const isSelected = number === selectedNumber;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedNumber(number)}
                            style={[
                                styles.item,
                                {
                                    backgroundColor: isSelected ? theme.colors.primaryContainer : 'transparent',
                                    borderRadius: theme.borderRadius.sm,
                                },
                            ]}
                        >
                            <ThemedText
                                variant="body"
                                color={isSelected ? theme.colors.primary : theme.colors.textTertiary}
                                style={[
                                    styles.itemText,
                                    isSelected && { fontWeight: '700' },
                                ]}
                            >
                                {number}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    item: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginHorizontal: 4,
        marginVertical: 2,
    },
    itemText: {
        fontSize: 20,
    },
});
