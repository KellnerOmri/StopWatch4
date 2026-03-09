import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setIsLocked, setMyRace, setSelectedPage } from '../../store/global.slice';
import { HeatModel, PagesNameEnum } from '../../models';
import { HeatStateEnum } from '../../models/heatState.enum';
import { updateHeatStartTimeIntoSqlite } from '../../utils/db-service';
import { getGunshots, GunTimeModel, uploadRaceToNetworkDb } from '../../utils/nework-service';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { ThemedText } from '../../components/shared/ThemedText';
import { Card } from '../../components/shared/Card';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const ManualStart = () => {
    const dispatch = useAppDispatch();
    const { myRace, manualStartHeatId } = useAppSelector(state => state.global);
    const { theme } = useTheme();
    const { t } = useLanguage();

    const heat = myRace.heats.find(h => h.heatId === manualStartHeatId);

    const [startTime, setStartTime] = useState('');
    const timeRangeOptions = [
        { label: '10 min', minutes: 10 },
        { label: '20 min', minutes: 20 },
        { label: '30 min', minutes: 30 },
        { label: '1 hour', minutes: 60 },
        { label: '2 hours', minutes: 120 },
        { label: '24 hours', minutes: 1440 },
    ];

    const [selectedRange, setSelectedRange] = useState(10);
    const [customMinutes, setCustomMinutes] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [gunTimes, setGunTimes] = useState<GunTimeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [gunTimesLoaded, setGunTimesLoaded] = useState(false);

    useEffect(() => {
        loadGunTimes(selectedRange);
    }, []);

    const loadGunTimes = async (minutes: number) => {
        setLoading(true);
        const times = await getGunshots(minutes * 60);
        setGunTimes(times);
        setGunTimesLoaded(true);
        setLoading(false);
    };

    const onSelectRange = (minutes: number) => {
        setIsCustom(false);
        setSelectedRange(minutes);
        loadGunTimes(minutes);
    };

    const onSelectCustom = () => {
        setIsCustom(true);
        setSelectedRange(0);
    };

    const onApplyCustom = () => {
        const mins = parseInt(customMinutes) || 10;
        setSelectedRange(mins);
        loadGunTimes(mins);
    };

    const isTimeInGunList = (time: string): boolean => {
        return gunTimes.some(gt => gt.time === time || gt.time.startsWith(time) || time.startsWith(gt.time));
    };

    const applyManualStart = (timeValue: string) => {
        if (!heat) return;

        const newHeatsList: HeatModel[] = myRace.heats.map(h => {
            if (h.heatId === manualStartHeatId) {
                return {
                    ...h,
                    startTime: timeValue,
                    heatStateNum: HeatStateEnum.running,
                };
            }
            return h;
        });

        updateHeatStartTimeIntoSqlite(timeValue, HeatStateEnum.running, manualStartHeatId);
        const newRace = { ...myRace, heats: newHeatsList };
        dispatch(setMyRace(newRace));
        uploadRaceToNetworkDb(newRace);
        dispatch(setIsLocked(true));
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
    };

    const onConfirm = () => {
        if (!startTime.trim()) return;

        if (gunTimesLoaded && !isTimeInGunList(startTime)) {
            Alert.alert(
                t.manualStart,
                t.timeNotInGunList,
                [
                    { text: t.cancel, style: 'cancel' },
                    { text: t.ok, onPress: () => applyManualStart(startTime) },
                ]
            );
        } else {
            applyManualStart(startTime);
        }
    };

    const formatStartTime = (text: string): string => {
        const digits = text.replace(/\D/g, '');
        let result = '';
        let pos = 0;
        for (let i = 0; i < digits.length && pos < 8; i++) {
            const d = parseInt(digits[i]);
            // HH: first digit 0-2, second digit 0-9 (0-3 if first is 2)
            if (pos === 0 && d > 2) continue;
            if (pos === 1 && result[0] === '2' && d > 3) continue;
            // mm: first digit 0-5, second digit 0-9
            if (pos === 2 && d > 5) continue;
            // ss: first digit 0-5, second digit 0-9
            if (pos === 4 && d > 5) continue;

            if (pos === 2 || pos === 4) result += ':';
            if (pos === 6) result += '.';
            result += digits[i];
            pos++;
        }
        return result;
    };

    const onStartTimeChange = (text: string) => {
        setStartTime(formatStartTime(text));
    };

    const onSelectGunTime = (gunTime: GunTimeModel) => {
        setStartTime(gunTime.time);
    };

    return (
        <ScreenContainer noPadding>
            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
                <BackButton onPress={() => dispatch(setSelectedPage(PagesNameEnum.raceDetails))} />
                <ThemedText variant="heading2" style={styles.title}>
                    {t.manualStart}
                </ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={{ paddingHorizontal: theme.spacing.md }} showsVerticalScrollIndicator={false}>
                {/* Heat info */}
                {heat && (
                    <Card style={styles.section}>
                        <ThemedText variant="body" style={{ fontWeight: '600' }}>
                            {heat.name !== 'heat' ? heat.name : `Heat ${manualStartHeatId}`}
                        </ThemedText>
                    </Card>
                )}

                {/* Time range picker */}
                <Card style={styles.section}>
                    <ThemedText variant="caption" color={theme.colors.textSecondary} style={styles.label}>
                        {t.sinceMinutes}
                    </ThemedText>
                    <View style={styles.chipRow}>
                        {timeRangeOptions.map((option) => (
                            <TouchableOpacity
                                key={option.minutes}
                                onPress={() => onSelectRange(option.minutes)}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: !isCustom && selectedRange === option.minutes
                                            ? theme.colors.primary
                                            : theme.colors.surfaceSecondary,
                                        borderColor: !isCustom && selectedRange === option.minutes
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                    },
                                ]}
                            >
                                <ThemedText
                                    variant="caption"
                                    color={!isCustom && selectedRange === option.minutes
                                        ? theme.colors.onPrimary
                                        : theme.colors.textPrimary}
                                    style={{ fontWeight: '600' }}
                                >
                                    {option.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={onSelectCustom}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isCustom
                                        ? theme.colors.primary
                                        : theme.colors.surfaceSecondary,
                                    borderColor: isCustom
                                        ? theme.colors.primary
                                        : theme.colors.border,
                                },
                            ]}
                        >
                            <ThemedText
                                variant="caption"
                                color={isCustom ? theme.colors.onPrimary : theme.colors.textPrimary}
                                style={{ fontWeight: '600' }}
                            >
                                {t.custom}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                    {isCustom && (
                        <View style={[styles.sinceRow, { marginTop: 10 }]}>
                            <TextInput
                                style={[styles.input, {
                                    color: theme.colors.textPrimary,
                                    backgroundColor: theme.colors.surfaceSecondary,
                                    borderColor: theme.colors.border,
                                    flex: 1,
                                }]}
                                value={customMinutes}
                                onChangeText={setCustomMinutes}
                                keyboardType="numeric"
                                placeholder={t.minutes}
                                placeholderTextColor={theme.colors.textTertiary}
                            />
                            <TouchableOpacity
                                onPress={onApplyCustom}
                                style={[styles.loadButton, { backgroundColor: theme.colors.primary }]}
                            >
                                <ThemedText variant="button" color={theme.colors.onPrimary} style={{ fontSize: 13 }}>
                                    {t.loadGunTimes}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </Card>

                {/* Start time input */}
                <Card style={styles.section}>
                    <ThemedText variant="caption" color={theme.colors.textSecondary} style={styles.label}>
                        {t.enterStartTime}
                    </ThemedText>
                    <TextInput
                        style={[styles.input, styles.timeInput, {
                            color: theme.colors.textPrimary,
                            backgroundColor: theme.colors.surfaceSecondary,
                            borderColor: theme.colors.border,
                        }]}
                        value={startTime}
                        onChangeText={onStartTimeChange}
                        placeholder="HH:mm:ss.SS"
                        placeholderTextColor={theme.colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={11}
                    />
                    <TouchableOpacity
                        onPress={onConfirm}
                        disabled={!startTime.trim()}
                        style={[
                            styles.confirmButton,
                            {
                                backgroundColor: startTime.trim() ? theme.colors.success : theme.colors.surfaceSecondary,
                            },
                        ]}
                    >
                        <ThemedText
                            variant="button"
                            color={startTime.trim() ? '#fff' : theme.colors.textTertiary}
                        >
                            {t.ok}
                        </ThemedText>
                    </TouchableOpacity>
                </Card>

                {/* Gun times list */}
                <Card style={styles.section}>
                    <ThemedText variant="caption" color={theme.colors.textSecondary} style={styles.label}>
                        {t.selectGunTime}
                    </ThemedText>
                    {loading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 16 }} />
                    ) : gunTimes.length === 0 && gunTimesLoaded ? (
                        <ThemedText variant="body" color={theme.colors.textTertiary} style={{ textAlign: 'center', marginVertical: 16 }}>
                            {t.noGunTimesFound}
                        </ThemedText>
                    ) : (
                        gunTimes.map((gunTime) => (
                            <TouchableOpacity
                                key={gunTime.id}
                                onPress={() => onSelectGunTime(gunTime)}
                                style={[
                                    styles.gunTimeRow,
                                    {
                                        backgroundColor: startTime === gunTime.time
                                            ? theme.colors.primaryContainer
                                            : 'transparent',
                                        borderBottomColor: theme.colors.border,
                                    },
                                ]}
                            >
                                <ThemedText
                                    variant="body"
                                    style={{ fontFamily: 'Menlo', fontSize: 16 }}
                                    color={startTime === gunTime.time ? theme.colors.primary : theme.colors.textPrimary}
                                >
                                    {gunTime.time}
                                </ThemedText>
                            </TouchableOpacity>
                        ))
                    )}
                </Card>

                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    section: {
        marginTop: 12,
    },
    label: {
        marginBottom: 8,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    sinceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
    },
    timeInput: {
        fontFamily: 'Menlo',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 14,
    },
    loadButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },
    confirmButton: {
        marginTop: 12,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    gunTimeRow: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
    },
});
