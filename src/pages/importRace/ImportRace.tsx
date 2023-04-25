import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../utils/color";
import {text} from "../../utils/dictionary-management";
import {setMyRace, setSelectedPage} from "../../store/global.slice";
import {PagesNameEnum, RaceModel} from "../../models";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import React, {useEffect, useState} from "react";
import {getRacesForImportRace} from "../../utils/nework-service";
import {createSqliteTables, db, dropSqliteTables} from "../../utils/db-service";
import {SqliteRaceModel} from "../../models/Sqlite.models";
import moment from "moment";

export const ImportRace = () => {
    const dispatch = useAppDispatch()
    const [isLoading, setLoading] = useState(true);
    const [raceListForImport, setRaceListForImport] = useState<RaceModel[]>([]);
    const {myRace, clientId} = useAppSelector(state => state.global);

    useEffect(() => {
        getRacesForImportRace(setLoading, setRaceListForImport).then()
    }, [])

    const styles = StyleSheet.create({
        container: {
            height: "100%", width: "100%", paddingTop: 25, paddingHorizontal: 20
        }, backStyle: {
            width: "100%", fontSize: 18, color: colors.primary
        }, scrollViewStyle: {
            marginTop: "10%", height: "80%"
        }, header: {
            alignItems: "center", width: "100%", display: "flex", flexDirection: "row",
        }, title: {
            fontSize: 20,
            color: colors.primary,
            flex: 1,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    });

    const importRace = async (race: RaceModel) => {
        console.log(race,"race");
        await dropSqliteTables()
        await createSqliteTables()
        const newSqliteRaceModel: SqliteRaceModel = {
            raceId: race.raceId,
            name: race.name,
            gapMills: race.gapMills,
            clientId: race.clientId,
            creationTime: race.creationTime
        }
        db.transaction(tx => {
            tx.executeSql(`insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`, [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name, newSqliteRaceModel.clientId, newSqliteRaceModel.creationTime]);
            tx.executeSql("select * from sqliteRaceTable", [], (_, {rows}) => console.log(JSON.stringify(rows), "importRace"));
        }, () => {
        },);

        if (race.heats.length > 0) {
            db.transaction(tx => {
                race.heats.forEach((heat) => {
                    tx.executeSql(`insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`, [heat.heatId, heat.raceId, heat.startTime, heat.name, heat.heatStateNum, heat.creationTime]);
                })
                tx.executeSql("select * from sqliteHeatTable", [], (_, {rows}) => console.log(JSON.stringify(rows), "heats"));
            }, () => {
            },);
        }

        dispatch(setMyRace(race))
        dispatch(setSelectedPage(PagesNameEnum.raceDetails))
    }
    return <View style={styles.container}>
        <View style={styles.header}>
            <Pressable style={{flex: 1, display: "flex"}}
                       onPress={() => dispatch(setSelectedPage(PagesNameEnum.raceDetails))}>
                <Text style={styles.backStyle}>{text.back}</Text>
            </Pressable>
            <Text
                style={styles.title}>Import
                race</Text>
            <Text style={{flex: 1}}></Text>

        </View>
        <View>
            {isLoading ? <ActivityIndicator style={{marginTop: "50%"}}/> :
                <ScrollView style={styles.scrollViewStyle} horizontal={false} showsVerticalScrollIndicator={false}>
                    {raceListForImport.map((race, index) => (<TouchableOpacity
                        key={index}
                        onPress={() => importRace(race)}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderBottomWidth: 1,
                            borderColor: colors.primary,
                            marginHorizontal: 8,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <Text style={{color: colors.primary}}>{race.clientId === clientId ? "owner" : ""}</Text>
                        <View>
                            <Text style={{fontSize: 20, textAlign: "right"}}>
                                {race.name}
                            </Text>
                            <Text style={{
                                color: colors.darkGrey,
                                textAlign: "right"
                            }}>{moment(race.creationTime).format("DD/MM/yy")}</Text>
                        </View>

                    </TouchableOpacity>))}
                </ScrollView>}
        </View>
    </View>
}