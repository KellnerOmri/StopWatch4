import {store} from "../app/store";
import {Menu} from "./menu/Menu";
import {StartNewRace} from "./startNewRace/StartNewRace";
import {Provider} from "react-redux";
import React from "react";
import {I18nManager, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from "../app/hooks";
import {PagesNameEnum} from "../models";
import {RaceDetails} from "./raceDetails/RaceDetails";
import {EditPage} from "./editTime/EditPage";
import {ImportRace} from "./importRace/ImportRace";
import {Settings} from "./settings/Settings";
import {useTheme} from "../theme/ThemeContext";

export default function AppPageController() {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);

    const {selectedPage} = useAppSelector(state => state.global);
    const {theme} = useTheme();

    const renderPage = () => {
        switch (selectedPage) {
            case PagesNameEnum.startNewRace:
                return <StartNewRace/>
            case PagesNameEnum.importRace:
                return <ImportRace/>
            case PagesNameEnum.menu:
                return <Menu/>
            case PagesNameEnum.raceDetails:
                return <RaceDetails/>
            case PagesNameEnum.editTime:
                return <EditPage/>
            case PagesNameEnum.settings:
                return <Settings/>
            default:
                return <View><Text>default</Text></View>
        }
    }

    return (
        <Provider store={store}>
            <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
                {renderPage()}
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        direction: "ltr",
    },
});
