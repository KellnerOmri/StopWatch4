import React from 'react';
import {
    Linking,
    Platform,
    Pressable,
    Share,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeatModel } from '../../../models';
import moment from 'moment/moment';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { HeatStateEnum } from '../../../models/heatState.enum';
import { setIsLocked, setMyRace, setSelectedHeats, setSelectedMode } from '../../../store/global.slice';
import { updateHeatStartTimeIntoSqlite } from '../../../utils/db-service';
import { uploadRaceToNetworkDb } from '../../../utils/nework-service';
import { Audio } from 'expo-av';
import { useTheme } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Card } from '../../../components/shared/Card';
import { ThemedText } from '../../../components/shared/ThemedText';

export const HeatDisplayRow: React.FC<{ heat: HeatModel; index: number; ownerRace: boolean }> = ({
    heat,
    index,
    ownerRace,
}) => {
    const { myRace, isLocked, isSelectedMode, selectedHeats } = useAppSelector(state => state.global);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isHeatSelected = selectedHeats.includes(heat.heatId);

    const calculateHeatCreationTime = (startTime: string) => {
        const [hours, minutes, seconds, millisecond] = startTime.split(/[:.]/);
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        date.setSeconds(parseInt(seconds));
        date.setMilliseconds(parseInt(millisecond));
        return date.getTime();
    };

    const getTimer = (): string => {
        const heatCreationTime = calculateHeatCreationTime(heat.startTime);
        const dateNow = new Date();
        if (heat.heatStateNum === HeatStateEnum.ready || heat.heatStateNum === HeatStateEnum.stop) {
            return '00:00:00';
        }
        return moment.utc(dateNow.getTime() + myRace.gapMills - heatCreationTime).format('HH:mm:ss');
    };

    const getStartTimeText = (): string => {
        if (heat.heatStateNum === HeatStateEnum.ready || heat.heatStateNum === HeatStateEnum.stop) {
            return '00:00:00.00';
        }
        return heat.startTime;
    };

    const getActionName = (): string => {
        return heat.heatStateNum === HeatStateEnum.running ? t.reset : t.start;
    };

    const changeHeatAction = (heatState: HeatStateEnum): HeatStateEnum => {
        return heatState === HeatStateEnum.running ? HeatStateEnum.ready : HeatStateEnum.running;
    };

    const getStartTime = (): string => {
        const dateNow = new Date();
        return moment(myRace.gapMills + dateNow.getTime()).format('HH:mm:ss.SS');
    };

    const onActionPressed = async () => {
        if (!ownerRace || (isLocked && heat.heatStateNum !== HeatStateEnum.ready)) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(t.pleaseUnlockFirst, ToastAndroid.SHORT);
            } else {
                Alert.alert(t.pleaseUnlockFirst);
            }
            return;
        }
        const newHeatsList: HeatModel[] = [];
        myRace.heats.forEach((h) => {
            if (h.heatId === heat.heatId) {
                const newStartTime = getStartTime();
                const newHeatStateNum = changeHeatAction(h.heatStateNum);
                newHeatsList.push({
                    raceId: h.raceId,
                    heatId: h.heatId,
                    startTime: newStartTime,
                    name: h.name,
                    heatStateNum: newHeatStateNum,
                    creationTime: h.creationTime,
                });
                updateHeatStartTimeIntoSqlite(newStartTime, newHeatStateNum, heat.heatId);
            } else {
                newHeatsList.push(h);
            }
        });
        const newRace = { ...myRace, heats: newHeatsList };
        await dispatch(setMyRace(newRace));
        uploadRaceToNetworkDb(newRace);
        if (heat.heatStateNum !== HeatStateEnum.running) {
            dispatch(setIsLocked(true));
            playSound().then();
        }
    };

    const shareText = async () => {
        const message = `${heat.name} ${heat.startTime}`;
        const whatsappUrl = `whatsapp://send?&text=${message}`;
        const supported = await Linking.canOpenURL(whatsappUrl);
        if (supported) {
            await Linking.openURL(whatsappUrl);
        } else {
            await Share.share({ message });
        }
    };

    const playSound = async () => {
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('../../../assets/sounds/gunshut.mp3'));
            await soundObject.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    const heatSelectedForRemove = () => {
        if (isSelectedMode) {
            let newSelectedHeats: number[] = [...selectedHeats];
            if (isHeatSelected) {
                const heatIndex = newSelectedHeats.indexOf(heat.heatId);
                newSelectedHeats.splice(heatIndex, 1);
                if (newSelectedHeats.length === 0) {
                    dispatch(setSelectedMode(false));
                }
            } else {
                newSelectedHeats.push(heat.heatId);
            }
            dispatch(setSelectedHeats(newSelectedHeats));
        }
    };

    const onLongPress = () => {
        if (isSelectedMode || isLocked) {
            dispatch(setSelectedMode(false));
            dispatch(setSelectedHeats([]));
        } else {
            dispatch(setSelectedMode(true));
            dispatch(setSelectedHeats([heat.heatId]));
        }
    };

    const isRunning = heat.heatStateNum === HeatStateEnum.running;
    const isDisabled = !ownerRace || (isLocked && heat.heatStateNum !== HeatStateEnum.ready);

    const actionColor = isDisabled
        ? theme.colors.textTertiary
        : isRunning
        ? theme.colors.danger
        : theme.colors.success;

    const actionBg = isDisabled
        ? theme.colors.surfaceSecondary
        : isRunning
        ? theme.colors.danger + '18'
        : theme.colors.success + '18';

    return (
        <Pressable onLongPress={onLongPress} delayLongPress={500} onPress={heatSelectedForRemove}>
            <Card
                style={[
                    styles.card,
                    isHeatSelected && {
                        backgroundColor: theme.colors.primaryContainer,
                        borderColor: theme.colors.primary,
                        borderWidth: 1.5,
                    },
                ]}
            >
                <View style={styles.row}>
                    {/* Index badge */}
                    <View style={[styles.indexBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                        <ThemedText variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                            {index}
                        </ThemedText>
                    </View>

                    {/* Center content */}
                    <View style={styles.center}>
                        <ThemedText variant="body" style={{ fontWeight: '500' }}>
                            {heat.name !== 'heat' ? heat.name : ''}
                        </ThemedText>
                        <ThemedText
                            variant="body"
                            style={{ fontFamily: 'Menlo', fontSize: 18 }}
                            color={theme.colors.textPrimary}
                        >
                            {getTimer()}
                        </ThemedText>
                        <ThemedText variant="caption" color={theme.colors.textTertiary}>
                            {getStartTimeText()}
                        </ThemedText>
                    </View>

                    {/* Share button */}
                    <TouchableOpacity onPress={shareText} style={styles.shareButton}>
                        <Ionicons name="share-outline" size={20} color={theme.colors.textTertiary} />
                    </TouchableOpacity>

                    {/* Action button */}
                    {ownerRace && (
                        <TouchableOpacity
                            onPress={onActionPressed}
                            style={[styles.actionButton, { backgroundColor: actionBg }]}
                        >
                            <ThemedText
                                variant="button"
                                color={actionColor}
                                style={{ fontSize: 14 }}
                            >
                                {getActionName()}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indexBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    center: {
        flex: 1,
        gap: 2,
    },
    shareButton: {
        padding: 8,
        marginRight: 8,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
