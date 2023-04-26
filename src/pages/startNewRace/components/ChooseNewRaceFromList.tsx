import {
    ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {RaceDescriptionModel} from "../../../models/RaceDescription.model";
import {setMyRace, setSelectedPage} from "../../../store/global.slice";
import {HeatModel, PagesNameEnum, RaceModel} from "../../../models";
import {createRaceId} from "../../../utils/general";
import {colors} from "../../../utils/color";
import {createSqliteTables, db, dropSqliteTables, setRaceIdIntoLocalStorage} from "../../../utils/db-service";
import {SqliteRaceModel} from "../../../models/Sqlite.models";
import {getHeatsForStartRace, getRacesForStartRace, uploadRaceToNetworkDb} from "../../../utils/nework-service";

export const ChooseNewRaceFromList = () => {
    const {racesList, clientId, storageRaceId} = useAppSelector(state => state.global);
    const dispatch = useAppDispatch()
    const [isLoading, setLoading] = useState(true);
    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: 20, height: "100%", width: "100%",
        }, pageWrapper: {
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "90%",
            paddingBottom: "10%"
        }, pickerContainer: {
            backgroundColor: colors.primary, width: "100%", color: colors.white
        }, chooseText: {
            color: colors.white, fontSize: 20
        }, bottomWrapper: {
            width: "100%"
        }, createNewRaceWrapper: {
            backgroundColor: colors.primary, alignItems: "center", width: "100%", padding: 10
        }, createNewRaceText: {
            fontSize: 20, color: colors.white,
        }, input: {
            borderColor: colors.primary,
            borderRadius: 4,
            borderWidth: 1,
            flex: 1,
            padding: 10,
            marginBottom: 12,
            textAlign: "center",
            color: colors.dark
        }, flexRow: {
            width: "100%", flexDirection: "row"
        },
    });

    useEffect(() => {
        getRacesForStartRace(setLoading).then()
    }, [])

    const createNewRace = async (selectedRace: RaceDescriptionModel) => {
        const text = selectedRace?.description ?? "מרוץ 4 ספורט";
        await setRaceIdIntoLocalStorage(storageRaceId + 1)
        const raceId = createRaceId(clientId, storageRaceId)
        await dropSqliteTables()
        await createSqliteTables()
        const heatsByComp:HeatModel[]|undefined = await getHeatsForStartRace(selectedRace.comp, raceId)
        const newSqliteRaceModel: SqliteRaceModel = {
            raceId: raceId, name: text, gapMills: 0, clientId: clientId, creationTime: (new Date()).getTime()
        }
        if (text === null) {
            return false;
        }
        db.transaction(tx => {
            tx.executeSql(`insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`, [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name, newSqliteRaceModel.clientId, newSqliteRaceModel.creationTime]);
        }, () => {
        },);

        if (heatsByComp && heatsByComp.length > 0) {
            db.transaction(tx => {
                heatsByComp.forEach((heat) => {
                    tx.executeSql(`insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`, [heat.heatId, heat.raceId, heat.startTime, heat.name, heat.heatStateNum, heat.creationTime]);
                })
            }, () => {
            },);
        }

        const newRace: RaceModel = {
            raceId: raceId,
            clientId: clientId,
            creationTime: (new Date()).getTime(),
            name: text,
            gapMills: 0.0,
            heats: heatsByComp ? heatsByComp : []
        }
        await dispatch(setMyRace(newRace))
        uploadRaceToNetworkDb(newRace)
        dispatch(setSelectedPage(PagesNameEnum.raceDetails))
    }

    return <View style={styles.container}>
        <View style={styles.pageWrapper}>
            {isLoading ? <ActivityIndicator/> : <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                {racesList.map((race: RaceDescriptionModel, index) => {
                    return <TouchableOpacity
                        key={index}
                        onPress={() => createNewRace(race)}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderBottomWidth: 1,
                            borderColor: colors.primary,
                            marginHorizontal: 8,
                            alignItems: "center"
                        }}
                    >
                        <Text key={index} style={{
                            fontSize: 20,
                            textAlign: "center"
                        }}>{race?.description ? race.description : "empty"}</Text>
                    </TouchableOpacity>
                })}
            </ScrollView>}
        </View>
    </View>
}