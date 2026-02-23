import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateRaceGapMilsIntoSqlite } from '../../../utils/db-service';
import { setMyRace, setSelectedPage } from '../../../store/global.slice';
import { PagesNameEnum } from '../../../models';
import { uploadRaceToNetworkDb } from '../../../utils/nework-service';
import { useTheme } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ThemedText } from '../../../components/shared/ThemedText';
import { Card } from '../../../components/shared/Card';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2); // 2

const HOURS = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const MINUTES = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const SECONDS = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

// Padding items so the first/last real item can be centered
const PADDING = Array.from({ length: CENTER_INDEX }, () => '');

interface WheelColumnProps {
    data: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ data, selectedIndex, onSelect }) => {
    const { theme } = useTheme();
    const listRef = useRef<FlatList>(null);

    const paddedData = [...PADDING, ...data, ...PADDING];

    const onScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = e.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(index, data.length - 1));
        onSelect(clamped);
        listRef.current?.scrollToOffset({ offset: clamped * ITEM_HEIGHT, animated: true });
    }, [data.length, onSelect]);

    React.useEffect(() => {
        setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: selectedIndex * ITEM_HEIGHT, animated: false });
        }, 50);
    }, []);

    const renderItem = useCallback(({ item, index: flatIndex }: { item: string; index: number }) => {
        if (item === '') {
            return <View style={{ height: ITEM_HEIGHT }} />;
        }
        const dataIndex = flatIndex - CENTER_INDEX;
        const isSelected = dataIndex === selectedIndex;
        const distance = Math.abs(dataIndex - selectedIndex);
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.45 : 0.2;

        return (
            <View style={[styles.wheelItem, { height: ITEM_HEIGHT }]}>
                <ThemedText
                    variant="body"
                    color={isSelected ? theme.colors.textPrimary : theme.colors.textTertiary}
                    style={{
                        fontSize: 22,
                        fontWeight: isSelected ? '700' : '400',
                        opacity,
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {item}
                </ThemedText>
            </View>
        );
    }, [selectedIndex, theme]);

    return (
        <View style={styles.columnWrapper}>
            <FlatList
                ref={listRef}
                data={paddedData}
                renderItem={renderItem}
                keyExtractor={(_, i) => `${i}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={onScrollEnd}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
            />
        </View>
    );
};

export const EditSyncTime = () => {
    const dispatch = useAppDispatch();
    const { myRace } = useAppSelector(state => state.global);
    const { theme } = useTheme();
    const { t } = useLanguage();

    const now = new Date();
    const [hour, setHour] = useState(now.getHours());
    const [minute, setMinute] = useState(now.getMinutes());
    const [second, setSecond] = useState(now.getSeconds());

    const formattedTime = `${HOURS[hour]}:${MINUTES[minute]}:${SECONDS[second]}`;

    const syncTime = async () => {
        const dateObj = new Date();
        const dateNow = new Date();
        dateObj.setHours(hour);
        dateObj.setMinutes(minute);
        dateObj.setSeconds(second);
        dateObj.setMilliseconds(0);
        const newGapMills = dateObj.getTime() - dateNow.getTime();
        updateRaceGapMilsIntoSqlite(myRace.raceId, newGapMills);
        await dispatch(setMyRace({ ...myRace, gapMills: newGapMills }));
        uploadRaceToNetworkDb(myRace);
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerArea}>
                <Card style={styles.timeCard}>
                    <View style={[styles.timeDisplay, {
                        backgroundColor: theme.colors.timerBackground,
                        borderRadius: theme.borderRadius.md,
                    }]}>
                        <ThemedText variant="timer" color={theme.colors.timerText} style={{ fontSize: 40 }}>
                            {formattedTime}
                        </ThemedText>
                    </View>
                </Card>

                {/* Labels row */}
                <View style={styles.labelsRow}>
                    <ThemedText variant="caption" style={[styles.columnLabel, { color: theme.colors.textSecondary }]}>{t.hours}</ThemedText>
                    <ThemedText variant="caption" style={[styles.columnLabel, { color: theme.colors.textSecondary }]}>{t.minutes}</ThemedText>
                    <ThemedText variant="caption" style={[styles.columnLabel, { color: theme.colors.textSecondary }]}>{t.seconds}</ThemedText>
                </View>

                {/* Picker */}
                <View style={[styles.pickerContainer, {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    borderColor: theme.colors.border,
                    borderWidth: StyleSheet.hairlineWidth,
                }]}>
                    {/* Selection highlight bar — always at the center row */}
                    <View
                        style={[styles.selectionBar, {
                            backgroundColor: theme.colors.primaryContainer,
                            borderRadius: theme.borderRadius.sm,
                            top: CENTER_INDEX * ITEM_HEIGHT,
                            height: ITEM_HEIGHT,
                        }]}
                        pointerEvents="none"
                    />

                    {/* Colon separators — aligned to center row */}
                    <View style={[styles.colonOverlay, { top: CENTER_INDEX * ITEM_HEIGHT, height: ITEM_HEIGHT }]} pointerEvents="none">
                        <ThemedText variant="heading2" color={theme.colors.textPrimary} style={styles.colon}>:</ThemedText>
                        <ThemedText variant="heading2" color={theme.colors.textPrimary} style={styles.colon}>:</ThemedText>
                    </View>

                    {/* Three wheel columns */}
                    <View style={[styles.columnsRow, { height: PICKER_HEIGHT }]}>
                        <WheelColumn data={HOURS} selectedIndex={hour} onSelect={setHour} />
                        <WheelColumn data={MINUTES} selectedIndex={minute} onSelect={setMinute} />
                        <WheelColumn data={SECONDS} selectedIndex={second} onSelect={setSecond} />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={syncTime}
                activeOpacity={0.8}
                style={[styles.setTimeButton, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl }]}
            >
                <ThemedText variant="button" color={theme.colors.onPrimary} style={{ fontSize: 18 }}>
                    {t.setTime}
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    pickerArea: {
    },
    timeCard: {
        marginBottom: 24,
    },
    timeDisplay: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    labelsRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    columnLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    pickerContainer: {
        overflow: 'hidden',
    },
    selectionBar: {
        position: 'absolute',
        left: 8,
        right: 8,
        zIndex: 0,
    },
    colonOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 3,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    colon: {
        fontWeight: '700',
        fontSize: 22,
    },
    columnsRow: {
        flexDirection: 'row',
        zIndex: 1,
    },
    columnWrapper: {
        flex: 1,
    },
    wheelItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    setTimeButton: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 32,
        marginBottom: 24,
    },
});
