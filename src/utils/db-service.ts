import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const db: SQLiteDatabase = openDatabaseSync('stopWatchDb');
import {store} from "../app/store";
import {setClientId, setStorageRaceId} from "../store/global.slice";
import {HeatStateEnum} from "../models/heatState.enum";
const dispatch = store.dispatch
export  const dropSqliteTables=  ()=>{
    db.execSync("DROP TABLE IF EXISTS sqliteRaceTable;");
    db.execSync("DROP TABLE IF EXISTS sqliteHeatTable;");
}
export const createSqliteTables=()=>{
    db.execSync(
        "create table if not exists sqliteRaceTable (raceId integer primary key not null, gapMills int, name text,clientId integer,creationTime integer);"
    );
    db.execSync(
        "create table if not exists sqliteHeatTable (heatId integer primary key not null,raceId integer, startTime text, name text,heatStateNum int,creationTime integer);"
    );
}
export const getClientIdFromLocalStorage= async ()=>{
    try {
        const value = await AsyncStorage.getItem("storageClientId5" )
        if (value!== null){
        }
        return value !== null ? JSON.parse(value) : null;
    } catch(e) {} 
}
export const setClientIdIntoLocalStorage = async ( value:number) => {
    try {
        await AsyncStorage.setItem("storageClientId5", JSON.stringify(value))
        dispatch(setClientId(value))
    } catch (e) {
    }
}



export const getRaceIdFromLocalStorage= async ()=>{
    try {
        const value = await AsyncStorage.getItem("storageRaceId" )
        if (value!== null){
            dispatch(setStorageRaceId(JSON.parse(value)))
        }else {
            await setRaceIdIntoLocalStorage(1)
            dispatch(setStorageRaceId(1))
        }
    } catch(e) {}
}
export const setRaceIdIntoLocalStorage = async ( value:number) => {
    try {
        await AsyncStorage.setItem("storageRaceId", JSON.stringify(value))
    } catch (e) {
        // handle error
    }
}

export const updateRaceGapMilsIntoSqlite=(raceId:number,gapMills:number)=>{
    db.runSync("update sqliteRaceTable set gapMills = ? where raceId = ?;", [gapMills, raceId]);
}


export const updateHeatStartTimeIntoSqlite=(startTime:string,heatStateNum:HeatStateEnum,heatId:number)=>{
    db.runSync("update sqliteHeatTable set startTime = ?,heatStateNum=? where heatId = ?;", [startTime, heatStateNum, heatId]);
}

export const updateHeatNameIntoSqlite=(name:string,heatId:number)=>{
    db.runSync("update sqliteHeatTable set name = ? where heatId = ?;", [name, heatId]);
}
export const deleteHeatNameFromSqlite = (heatIdArray: number[]) => {
    const ids = heatIdArray.join(',');
    db.execSync('DELETE FROM sqliteHeatTable WHERE heatId IN (' + ids + ')');
};











