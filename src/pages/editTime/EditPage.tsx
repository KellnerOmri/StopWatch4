import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { setSelectedPage } from '../../store/global.slice';
import { PagesNameEnum } from '../../models';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { EditSyncTime } from './components/EditSyncTime';
import { EditHeatNames } from './components/EditHeatNames';
import { uploadRaceToNetworkDb } from '../../utils/nework-service';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { TabBar } from '../../components/shared/TabBar';
import { ThemedText } from '../../components/shared/ThemedText';
import { useLanguage } from '../../i18n/LanguageContext';

export const EditPage = () => {
    const dispatch = useAppDispatch();
    const { myRace } = useAppSelector(state => state.global);
    const { t } = useLanguage();
    const [selectedTab, setSelectedTab] = useState(0);

    const onBackPress = async () => {
        dispatch(setSelectedPage(PagesNameEnum.raceDetails));
        uploadRaceToNetworkDb(myRace);
    };

    return (
        <ScreenContainer>
            <View style={styles.headerRow}>
                <BackButton onPress={onBackPress} />
                <ThemedText variant="heading2">{t.edit}</ThemedText>
                <View style={styles.placeholder} />
            </View>
            <TabBar
                tabs={[t.syncTime, t.editHeatsName]}
                selectedIndex={selectedTab}
                onSelect={setSelectedTab}
            />
            <View style={styles.content}>
                {selectedTab === 0 ? <EditSyncTime /> : <EditHeatNames />}
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    placeholder: {
        width: 60,
    },
    content: {
        flex: 1,
        marginTop: 16,
    },
});
