import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Header} from "./components/Header";
import {MenuButton} from "./components/MenuButton";
import {PagesNameEnum, RaceModel} from "../../models";
import {useAppDispatch} from "../../app/hooks";
import {setMyRace, setSelectedPage} from "../../store/global.slice";
import {db} from "../../utils/db-service";

export const Menu = () => {
    const dispatch = useAppDispatch();
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "98%",
            width: "100%",
            alignItems: "center"
        }, wrapper: {
            display: "flex", width: "100%", alignItems: 'center', justifyContent: 'center',
        }, buttonsWrapper: {
            width: "100%", alignItems: "center", marginTop: "25%", display: "flex", flexDirection: "column", gap: 20
        }
    });
    const setSelectedPageFunction = (pageName: PagesNameEnum) => {
        dispatch(setSelectedPage(pageName))
    }

    const LoadLastRace = () => {
        db.transaction(tx => {
            tx.executeSql("select * from sqliteRaceTable", [], (_, {rows}) => {
                // const res = JSON.stringify(rows._array[0])
                const res = rows._array[0]

                tx.executeSql("select * from sqliteHeatTable", [], (_, {rows}) => {
                    const heatRes = rows._array

                    const LastRace: RaceModel = {
                        raceId: res.raceId,
                        gapMills: res.gapMills,
                        name: res.name,
                        creationTime: res.creationTime,
                        heats: heatRes,
                        clientId: res.clientId
                    }
                    dispatch(setMyRace(LastRace))
                    dispatch(setSelectedPage(PagesNameEnum.raceDetails))
                })


            });
        }, () => {
        },);


    }
    const packageJson = require('../../../package.json');
    const version = packageJson.version;
    return <View style={styles.container}>
        <View style={styles.wrapper}>
            <Header/>
            <View style={styles.buttonsWrapper}>
                <MenuButton title={"Start new race"}
                            selectedPage={() => setSelectedPageFunction(PagesNameEnum.startNewRace)}/>
                <MenuButton title={"Load last race"} selectedPage={LoadLastRace}/>
                <MenuButton title={"Import race"}
                            selectedPage={() => setSelectedPageFunction(PagesNameEnum.importRace)}/>
            </View>
        </View>
        <View><Image source={require("../../../assets/stopwatchimage.png")}/></View>
        <Text>Version {version}</Text>
    </View>
}