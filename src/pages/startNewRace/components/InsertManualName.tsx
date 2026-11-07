import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform, ToastAndroid, Alert, StyleSheet } from 'react-native';
import { useAppDispatch } from '../../../app/hooks';
import { createSqliteTables, db, dropSqliteTables } from '../../../utils/db-service';
import { createRaceId, MissingClientIdError } from '../../../utils/general';
import { SqliteRaceModel } from '../../../models/Sqlite.models';
import { uploadRaceToNetworkDb } from '../../../utils/nework-service';
import { PagesNameEnum, RaceModel } from '../../../models';
import { setMyRace, setSelectedPage } from '../../../store/global.slice';
import { useTheme } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ThemedText } from '../../../components/shared/ThemedText';

export const InsertManualName = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [manualName, setManualName] = useState('');
    const isCreatingRef = useRef(false);

    const createNewRace = async () => {
        if (isCreatingRef.current) return;
        const showMessage = (message: string) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show(message, ToastAndroid.SHORT);
            } else {
                Alert.alert(message);
            }
        };
        if (manualName === '') {
            showMessage(t.pleaseEnterRaceName);
            return;
        }

        isCreatingRef.current = true;
        try {
            const raceName = manualName;
            let raceId: number;
            let clientId: number;
            try {
                ({ raceId, clientId } = await createRaceId());
            } catch (e) {
                if (e instanceof MissingClientIdError) {
                    showMessage(t.noClientIdTryAgain);
                    return;
                }
                throw e;
            }
            await dropSqliteTables();
            await createSqliteTables();
            const newSqliteRaceModel: SqliteRaceModel = {
                raceId: raceId,
                name: raceName,
                gapMills: 0,
                clientId: clientId,
                creationTime: new Date().getTime(),
            };
            db.runSync(
                `insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`,
                [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name, newSqliteRaceModel.clientId, newSqliteRaceModel.creationTime]
            );
            const newRace: RaceModel = {
                raceId: raceId,
                clientId: clientId,
                creationTime: new Date().getTime(),
                name: raceName,
                gapMills: 0.0,
                heats: [],
            };
            await dispatch(setMyRace(newRace));
            uploadRaceToNetworkDb(newRace);
            dispatch(setSelectedPage(PagesNameEnum.raceDetails));
        } finally {
            isCreatingRef.current = false;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <TextInput
                    onChangeText={setManualName}
                    placeholder={t.insertRaceName}
                    placeholderTextColor={theme.colors.textTertiary}
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.colors.inputBackground,
                            borderColor: theme.colors.inputBorder,
                            color: theme.colors.textPrimary,
                        },
                    ]}
                    value={manualName}
                />
            </View>
            <TouchableOpacity
                onPress={createNewRace}
                activeOpacity={0.8}
                style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
            >
                <ThemedText variant="button" color={theme.colors.onPrimary}>
                    {t.createNewRace}
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
    inputWrapper: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    createButton: {
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 40,
    },
});
