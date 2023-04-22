import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, ToastAndroid,
    View
} from "react-native";
import React, { useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {colors} from "../../../utils/color";
import {createSqliteTables, db, dropSqliteTables, setRaceIdIntoLocalStorage} from "../../../utils/db-service";
import {createRaceId} from "../../../utils/general";
import {SqliteRaceModel} from "../../../models/Sqlite.models";
import { uploadRaceToNetworkDb} from "../../../utils/nework-service";
import {PagesNameEnum, RaceModel} from "../../../models";
import {setMyRace, setSelectedPage} from "../../../store/global.slice";
import {text} from "../../../utils/dictionary-management";

export const InsertManualName=()=>{
    const {clientId, storageRaceId} = useAppSelector(state => state.global);
    const dispatch = useAppDispatch()
    const [manualName, setManualName] = useState("");
    const styles = StyleSheet.create({
        container: {
            height: "50%", width: "100%",display:"flex",flexDirection:"column",justifyContent:"flex-end"
        }, pageWrapper: {
             display: "flex", justifyContent: "space-between", alignItems: "center"
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

    const createNewRace = async () => {
        if (manualName === ""){
            if (Platform.OS === 'android') {
                ToastAndroid.show("נא להכניס שם אירוע", ToastAndroid.SHORT);
            }
            return
        }

        const text = manualName !== "" ? manualName : "מרוץ 4 ספורט";
        await setRaceIdIntoLocalStorage(storageRaceId + 1)
        const raceId = createRaceId(clientId, storageRaceId)
        await dropSqliteTables()
        await createSqliteTables()
        const newSqliteRaceModel: SqliteRaceModel = {
            raceId: raceId, name: text, gapMills: 0,clientId:clientId,creationTime:(new Date()).getTime()
        }
        if (text === null || text === "") {
            return false;
        }
        db.transaction(tx => {
            tx.executeSql(`insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`, [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name,newSqliteRaceModel.clientId,newSqliteRaceModel.creationTime]);
            tx.executeSql("select * from sqliteRaceTable", [], (_, {rows}) => console.log(JSON.stringify(rows),"startRace"));
        }, () => {
        },);
        const newRace: RaceModel = {
            raceId: raceId, clientId: clientId, creationTime: (new Date()).getTime(), name: text, gapMills: 0.0, heats: []
        }
        await dispatch(setMyRace(newRace))
        uploadRaceToNetworkDb(newRace)
        dispatch(setSelectedPage(PagesNameEnum.raceDetails))
    }

    return <View style={styles.container}>
        <View style={styles.pageWrapper}>
                <SafeAreaView style={{width: "100%"}}>
                    <View style={styles.flexRow}>
                        <TextInput
                            onChangeText={(text) => setManualName(text)}
                            placeholder={text.InsertRaceName}
                            style={styles.input}
                            value={manualName}
                        />
                    </View>
                </SafeAreaView>
                <Pressable style={styles.createNewRaceWrapper} onPress={() => createNewRace()}>
                    <Text style={styles.createNewRaceText}>{text.createNewRace}</Text>
                </Pressable>
            </View>
    </View>
}