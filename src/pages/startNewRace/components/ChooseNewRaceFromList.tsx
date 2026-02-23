import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RaceDescriptionModel } from '../../../models/RaceDescription.model';
import { setMyRace, setSelectedPage } from '../../../store/global.slice';
import { HeatModel, PagesNameEnum, RaceModel } from '../../../models';
import { createRaceId } from '../../../utils/general';
import { createSqliteTables, db, dropSqliteTables, setRaceIdIntoLocalStorage } from '../../../utils/db-service';
import { SqliteRaceModel } from '../../../models/Sqlite.models';
import { getHeatsForStartRace, getRacesForStartRace, uploadRaceToNetworkDb } from '../../../utils/nework-service';
import { useTheme } from '../../../theme/ThemeContext';
import { Card } from '../../../components/shared/Card';
import { ThemedText } from '../../../components/shared/ThemedText';

export const ChooseNewRaceFromList = () => {
    const { racesList, clientId, storageRaceId } = useAppSelector(state => state.global);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getRacesForStartRace(setLoading).then();
    }, []);

    const createNewRace = async (selectedRace: RaceDescriptionModel) => {
        const raceName = selectedRace?.description ?? 'New Race';
        await setRaceIdIntoLocalStorage(storageRaceId + 1);
        const raceId = createRaceId(clientId, storageRaceId);
        await dropSqliteTables();
        await createSqliteTables();
        const heatsByComp: HeatModel[] | undefined = await getHeatsForStartRace(selectedRace.comp, raceId);
        const newSqliteRaceModel: SqliteRaceModel = {
            raceId: raceId,
            name: raceName,
            gapMills: 0,
            clientId: clientId,
            creationTime: new Date().getTime(),
        };
        if (raceName === null) return false;
        db.runSync(
            `insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`,
            [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name, newSqliteRaceModel.clientId, newSqliteRaceModel.creationTime]
        );

        if (heatsByComp && heatsByComp.length > 0) {
            db.withTransactionSync(() => {
                heatsByComp.forEach((heat) => {
                    db.runSync(
                        `insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`,
                        [heat.heatId, heat.raceId, heat.startTime, heat.name, heat.heatStateNum, heat.creationTime]
                    );
                });
            });
        }

        const newRace: RaceModel = {
            raceId: raceId,
            clientId: clientId,
            creationTime: new Date().getTime(),
            name: raceName,
            gapMills: 0.0,
            heats: heatsByComp ? heatsByComp : [],
        };
        await dispatch(setMyRace(newRace));
        uploadRaceToNetworkDb(newRace);
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {racesList.map((race: RaceDescriptionModel, index) => (
                <TouchableOpacity key={index} onPress={() => createNewRace(race)} activeOpacity={0.7}>
                    <Card style={styles.card}>
                        <View style={styles.row}>
                            <ThemedText variant="body" style={styles.raceName}>
                                {race?.description ? race.description : 'empty'}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                        </View>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    raceName: {
        flex: 1,
    },
});
