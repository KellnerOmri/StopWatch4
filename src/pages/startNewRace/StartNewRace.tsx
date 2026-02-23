import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PagesNameEnum } from '../../models';
import { useAppDispatch } from '../../app/hooks';
import { setSelectedPage } from '../../store/global.slice';
import { InsertManualName } from './components/InsertManualName';
import { ChooseNewRaceFromList } from './components/ChooseNewRaceFromList';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { TabBar } from '../../components/shared/TabBar';
import { ThemedText } from '../../components/shared/ThemedText';
import { useLanguage } from '../../i18n/LanguageContext';

export const StartNewRace = () => {
    const dispatch = useAppDispatch();
    const { t } = useLanguage();
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <ScreenContainer>
            <BackButton onPress={() => dispatch(setSelectedPage(PagesNameEnum.menu))} />
            <ThemedText variant="heading1" style={styles.title}>
                {t.createNewRace}
            </ThemedText>
            <TabBar
                tabs={[t.createManually, t.createFromList]}
                selectedIndex={selectedTab}
                onSelect={setSelectedTab}
            />
            <View style={styles.content}>
                {selectedTab === 0 ? <InsertManualName /> : <ChooseNewRaceFromList />}
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: 12,
        marginBottom: 20,
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
});
