import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { HeatModel } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setMyRace } from '../../../store/global.slice';
import { db, updateHeatNameIntoSqlite } from '../../../utils/db-service';
import { useTheme } from '../../../theme/ThemeContext';
import { Card } from '../../../components/shared/Card';
import { ThemedText } from '../../../components/shared/ThemedText';
import { HeatStateEnum } from '../../../models/heatState.enum';
import { uploadRaceToNetworkDb } from '../../../utils/nework-service';
import { useLanguage } from '../../../i18n/LanguageContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const HeatRow = ({ heat, index, onNameChange, onDelete }: {
    heat: HeatModel;
    index: number;
    onNameChange: (text: string) => void;
    onDelete: () => void;
}) => {
    const { theme } = useTheme();
    const [localTextState, setLocalTextState] = useState(heat.name);

    return (
        <Card style={styles.heatCard}>
            <View style={styles.row}>
                <View style={[styles.indexBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                    <ThemedText variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                        {index}
                    </ThemedText>
                </View>
                <TextInput
                    onChangeText={(text) => {
                        setLocalTextState(text);
                        onNameChange(text);
                    }}
                    style={[
                        styles.input,
                        {
                            color: theme.colors.textPrimary,
                            borderBottomColor: theme.colors.border,
                        },
                    ]}
                    placeholderTextColor={theme.colors.textTertiary}
                    value={localTextState}
                />
                {heat.heatStateNum === HeatStateEnum.ready && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

export const EditHeatNames = () => {
    const dispatch = useAppDispatch();
    const { myRace } = useAppSelector(state => state.global);
    const { theme } = useTheme();
    const { t } = useLanguage();
    const scrollViewRef = useRef<ScrollView>(null);

    const deleteHeat = async (heatId: number) => {
        const newHeats = myRace.heats.filter(h => h.heatId !== heatId);
        await dispatch(setMyRace({ ...myRace, heats: newHeats }));
        uploadRaceToNetworkDb(myRace);
        db.runSync(`delete from sqliteHeatTable where heatId = ?`, [heatId]);
    };

    const addHeat = async () => {
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
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView ref={scrollViewRef} scrollEnabled={true} horizontal={false} showsVerticalScrollIndicator={false}>
                {myRace.heats.map((heat, index) => (
                    <HeatRow
                        key={heat.heatId}
                        heat={heat}
                        index={index}
                        onNameChange={(text) => {
                            updateHeatNameIntoSqlite(text, heat.heatId);
                            let newLocalHeats = [...myRace.heats];
                            let newHeat: HeatModel = { ...myRace.heats[index], name: text };
                            newLocalHeats.splice(index, 1, newHeat);
                            dispatch(setMyRace({ ...myRace, heats: newLocalHeats }));
                        }}
                        onDelete={() => deleteHeat(heat.heatId)}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={addHeat}
                activeOpacity={0.8}
                style={[styles.addButton, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
            >
                <Ionicons name="add-circle-outline" size={22} color={theme.colors.onPrimary} />
                <ThemedText variant="button" color={theme.colors.onPrimary} style={styles.addButtonText}>
                    {t.addHeat}
                </ThemedText>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heatCard: {
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
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 8,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    addButtonText: {
        marginLeft: 8,
    },
});
