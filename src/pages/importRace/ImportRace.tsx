import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setMyRace, setSelectedPage } from '../../store/global.slice';
import { PagesNameEnum, RaceModel } from '../../models';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getRacesForImportRace } from '../../utils/nework-service';
import { createSqliteTables, db, dropSqliteTables } from '../../utils/db-service';
import { SqliteRaceModel } from '../../models/Sqlite.models';
import moment from 'moment';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { Card } from '../../components/shared/Card';
import { ThemedText } from '../../components/shared/ThemedText';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const ImportRace = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState(true);
    const [raceListForImport, setRaceListForImport] = useState<RaceModel[]>([]);
    const { clientId } = useAppSelector(state => state.global);
    const { theme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        getRacesForImportRace(setLoading, setRaceListForImport).then();
    }, []);

    const importRace = async (race: RaceModel) => {
        await dropSqliteTables();
        await createSqliteTables();
        const newSqliteRaceModel: SqliteRaceModel = {
            raceId: race.raceId,
            name: race.name,
            gapMills: race.gapMills,
            clientId: race.clientId,
            creationTime: race.creationTime,
        };
        db.runSync(
            `insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`,
            [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name, newSqliteRaceModel.clientId, newSqliteRaceModel.creationTime]
        );

        if (race.heats.length > 0) {
            db.withTransactionSync(() => {
                race.heats.forEach((heat) => {
                    db.runSync(
                        `insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`,
                        [heat.heatId, heat.raceId, heat.startTime, heat.name, heat.heatStateNum, heat.creationTime]
                    );
                });
            });
        }

        dispatch(setMyRace(race));
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
    };

    return (
        <ScreenContainer>
            <View style={styles.headerRow}>
                <BackButton onPress={() => dispatch(setSelectedPage(PagesNameEnum.raceDetails))} />
                <ThemedText variant="heading2" style={styles.title}>
                    {t.importRaceTitle}
                </ThemedText>
                <View style={styles.placeholder} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                >
                    {raceListForImport.map((race, index) => {
                        const isOwner = race.clientId === clientId;
                        return (
                            <TouchableOpacity key={index} onPress={() => importRace(race)} activeOpacity={0.7}>
                                <Card style={styles.card}>
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardContent}>
                                            <ThemedText variant="body" style={{ fontWeight: '500' }}>
                                                {race.name}
                                            </ThemedText>
                                            <View style={styles.metaRow}>
                                                <ThemedText variant="caption">
                                                    {moment(race.creationTime).format('DD/MM/YY')}
                                                </ThemedText>
                                                {isOwner && (
                                                    <View style={[styles.ownerPill, { backgroundColor: theme.colors.primaryContainer }]}>
                                                        <ThemedText variant="caption" color={theme.colors.primary} style={{ fontSize: 11 }}>
                                                            {t.owner}
                                                        </ThemedText>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
    },
    placeholder: {
        width: 60,
    },
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
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
        gap: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ownerPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
});
