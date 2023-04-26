import {store} from "../app/store";
import {Menu} from "./menu/Menu";
import {StartNewRace} from "./startNewRace/StartNewRace";
import {Provider} from "react-redux";
import React from "react";
import {I18nManager, Platform, StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {PagesNameEnum} from "../models";
import {setSelectedPage} from "../store/global.slice";
import {RaceDetails} from "./raceDetails/RaceDetails";
import {EditPage} from "./editTime/EditPage";
import {ImportRace} from "./importRace/ImportRace";


export default function AppPageController() {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);

    const {selectedPage} = useAppSelector(state => state.global);

    const renderPage = () => {
        switch (selectedPage) {
            case PagesNameEnum.startNewRace:
            {
                return <StartNewRace/>
            }
            case PagesNameEnum.importRace: {
                return <ImportRace/>
            }
            case PagesNameEnum.menu: {
                return <Menu/>
            }
            case PagesNameEnum.raceDetails: {
                return <RaceDetails/>
            }
            case PagesNameEnum.editTime: {
                return <EditPage/>
            }
            default:{
                return <View><Text>default</Text></View>
            }
        }
    }

    return (
        <Provider store={store}>
            <View style={styles.container}>
                {renderPage()}
            </View>
        </Provider>

    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop:Platform.OS === 'android'?"5%":"10%",
        direction:"ltr",
        textAlign:"left",
    },
});
