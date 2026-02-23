import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setIsLocked, setMyRace, setSelectedHeats, setSelectedMode, setSelectedPage } from '../../store/global.slice';
import { HeatModel, PagesNameEnum } from '../../models';
import moment from 'moment';
import { HeatDisplayRow } from './components/HeatDisplayRow';
import { HeatStateEnum } from '../../models/heatState.enum';
import { db, deleteHeatNameFromSqlite } from '../../utils/db-service';
import { uploadRaceToNetworkDb } from '../../utils/nework-service';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { ThemedText } from '../../components/shared/ThemedText';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const RaceDetails = () => {
    const dispatch = useAppDispatch();
    const { myRace, isLocked, clientId, selectedHeats, isSelectedMode } = useAppSelector(state => state.global);
    const { theme } = useTheme();
    const { t } = useLanguage();
    const ownerRace: boolean = myRace.clientId === clientId;
    const [refreshTime, setRefreshTime] = useState(false);
    const [nowTime, setNowTime] = useState(new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setNowTime(new Date().getTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const syncTime = useMemo(() => {
        return moment(myRace.gapMills + nowTime).format('HH:mm:ss');
    }, [nowTime, refreshTime]);

    const refreshPage = () => {
        setRefreshTime(!refreshTime);
    };

    const addHeats = async () => {
        const newHeat: HeatModel = {
            raceId: myRace.raceId,
            heatId: myRace.heats.length + 1,
            startTime: '00:00:00.00',
            name: 'heat',
            heatStateNum: HeatStateEnum.ready,
            creationTime: new Date().getTime(),
        };
        const heatsArray: HeatModel[] = [...myRace.heats];
        heatsArray.push(newHeat);
        await dispatch(setMyRace({ ...myRace, heats: heatsArray }));
        uploadRaceToNetworkDb(myRace);
        db.runSync(
            `insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`,
            [newHeat.heatId, newHeat.raceId, newHeat.startTime, newHeat.name, newHeat.heatStateNum, newHeat.creationTime]
        );
    };

    useEffect(() => {
        if (myRace.clientId === clientId) {
            dispatch(setIsLocked(false));
        } else {
            dispatch(setIsLocked(true));
        }
    }, []);

    const closeSelectedMode = () => {
        dispatch(setSelectedMode(false));
        dispatch(setSelectedHeats([]));
    };

    const deleteHeats = () => {
        let newHeatList: HeatModel[] = [];
        myRace.heats.forEach((heat) => {
            if (!selectedHeats.includes(heat.heatId)) {
                newHeatList.push(heat);
            }
        });
        dispatch(setMyRace({ ...myRace, heats: newHeatList }));
        deleteHeatNameFromSqlite(selectedHeats);
        uploadRaceToNetworkDb(myRace);
        dispatch(setSelectedMode(false));
    };

    return (
        <ScreenContainer noPadding>
            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
                <BackButton onPress={() => dispatch(setSelectedPage(PagesNameEnum.menu))} />
                <ThemedText variant="heading2" numberOfLines={1} style={styles.raceName}>
                    {myRace.name}
                </ThemedText>
                <TouchableOpacity
                    onPress={() => ownerRace && dispatch(setSelectedPage(PagesNameEnum.editTime))}
                    disabled={!ownerRace}
                >
                    <ThemedText
                        variant="body"
                        color={ownerRace ? theme.colors.primary : theme.colors.textTertiary}
                    >
                        {t.edit}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* Timer Display */}
            <View style={[styles.timerCard, {
                backgroundColor: theme.colors.timerBackground,
                marginHorizontal: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
            }]}>
                <ThemedText
                    variant="timer"
                    color={theme.colors.timerText}
                    style={styles.timerText}
                >
                    {syncTime}
                </ThemedText>
                <ThemedText variant="caption" color={theme.colors.timerText} style={{ opacity: 0.7 }}>
                    {t.synchronized}
                </ThemedText>
            </View>

            {/* Heat List */}
            <ScrollView
                style={[styles.heatList, { paddingHorizontal: theme.spacing.md }]}
                showsVerticalScrollIndicator={false}
            >
                {myRace.heats.map((heat, index) => (
                    <HeatDisplayRow key={index} heat={heat} index={index + 1} ownerRace={ownerRace} />
                ))}
                <View style={styles.scrollPadding} />
            </ScrollView>

            {/* Bottom Bar */}
            {ownerRace && (
                <View style={[styles.bottomBar, {
                    backgroundColor: theme.colors.bottomBar,
                    borderTopColor: theme.colors.border,
                    shadowColor: theme.colors.shadow,
                }]}>
                    {isSelectedMode ? (
                        <View style={styles.selectedModeRow}>
                            <TouchableOpacity onPress={deleteHeats} style={styles.bottomAction}>
                                <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                            </TouchableOpacity>
                            <ThemedText variant="body" color={theme.colors.primary}>
                                {selectedHeats?.length} {t.selected}
                            </ThemedText>
                            <TouchableOpacity onPress={closeSelectedMode} style={styles.bottomAction}>
                                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.normalModeRow}>
                            <TouchableOpacity
                                onPress={() => ownerRace && dispatch(setIsLocked(!isLocked))}
                                style={[styles.circleButton, { backgroundColor: theme.colors.surfaceSecondary }]}
                            >
                                <Ionicons
                                    name={isLocked ? 'lock-closed' : 'lock-open'}
                                    size={20}
                                    color={isLocked ? theme.colors.warning : theme.colors.success}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={refreshPage}
                                style={[styles.circleButton, { backgroundColor: theme.colors.surfaceSecondary }]}
                            >
                                <Ionicons name="refresh" size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={addHeats}
                                style={[styles.fabButton, { backgroundColor: theme.colors.primary }]}
                            >
                                <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
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
    raceName: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    timerCard: {
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 8,
    },
    timerText: {
        letterSpacing: 2,
    },
    heatList: {
        flex: 1,
        marginTop: 16,
    },
    scrollPadding: {
        height: 100,
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: 28,
        borderTopWidth: StyleSheet.hairlineWidth,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
    },
    normalModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    circleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomAction: {
        padding: 8,
    },
});
