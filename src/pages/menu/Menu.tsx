import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './components/Header';
import { MenuButton } from './components/MenuButton';
import { PagesNameEnum, RaceModel } from '../../models';
import { useAppDispatch } from '../../app/hooks';
import { setMyRace, setSelectedPage } from '../../store/global.slice';
import { db } from '../../utils/db-service';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { ThemedText } from '../../components/shared/ThemedText';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const Menu = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const { t } = useLanguage();

    const setSelectedPageFunction = (pageName: PagesNameEnum) => {
        dispatch(setSelectedPage(pageName));
    };

    const LoadLastRace = () => {
        const raceRows = db.getAllSync<any>('select * from sqliteRaceTable');
        if (raceRows.length === 0) return;
        const res = raceRows[0];
        const heatRes = db.getAllSync<any>('select * from sqliteHeatTable');

        const LastRace: RaceModel = {
            raceId: res.raceId,
            gapMills: res.gapMills,
            name: res.name,
            creationTime: res.creationTime,
            heats: heatRes,
            clientId: res.clientId,
        };
        dispatch(setMyRace(LastRace));
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
    };

    const packageJson = require('../../../package.json');
    const version = packageJson.version;

    return (
        <ScreenContainer>
            <View style={styles.topBar}>
                <View style={styles.placeholder} />
                <TouchableOpacity
                    onPress={() => setSelectedPageFunction(PagesNameEnum.settings)}
                    style={[styles.settingsButton, { backgroundColor: theme.colors.surfaceSecondary }]}
                >
                    <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.headerArea}>
                <Header />
            </View>

            <View style={styles.buttonsWrapper}>
                <MenuButton
                    title={t.startNewRace}
                    selectedPage={() => setSelectedPageFunction(PagesNameEnum.startNewRace)}
                    iconName="play-circle"
                    accentColor="#2563EB"
                />
                <MenuButton
                    title={t.loadLastRace}
                    selectedPage={LoadLastRace}
                    iconName="reload-circle"
                    accentColor="#16A34A"
                />
                <MenuButton
                    title={t.importRace}
                    selectedPage={() => setSelectedPageFunction(PagesNameEnum.importRace)}
                    iconName="cloud-download"
                    accentColor="#7C3AED"
                />
            </View>

            <View style={styles.bottom}>
                <ThemedText variant="caption">
                    {t.version} {version}
                </ThemedText>
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    placeholder: {
        width: 40,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerArea: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 48,
    },
    buttonsWrapper: {
        width: '100%',
    },
    bottom: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingBottom: 24,
    },
});
