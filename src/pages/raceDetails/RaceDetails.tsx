import {Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {colors} from "../../utils/color";
import {text} from "../../utils/dictionary-management";
import {setIsLocked, setMyRace, setSelectedHeats, setSelectedMode, setSelectedPage} from "../../store/global.slice";
import {HeatModel, PagesNameEnum} from "../../models";
import moment from "moment";
import {useEffect, useMemo, useState} from "react";
import {HeatDisplayRow} from "./components/HeatDisplayRow";
import {HeatStateEnum} from "../../models/heatState.enum";
import {db, deleteHeatNameFromSqlite, updateHeatNameIntoSqlite} from "../../utils/db-service";
import {uploadRaceToNetworkDb} from "../../utils/nework-service";

export const RaceDetails = () => {
    const dispatch = useAppDispatch()
    const {myRace, isLocked, clientId,selectedHeats,isSelectedMode} = useAppSelector(state => state.global);
    const styles = StyleSheet.create({
        container: {
            height: "100%", width: "100%", alignItems: "center", paddingTop: 25
        }, headerWrapper: {
            paddingHorizontal: 10,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center"
        },
        timeWrapper: {
            marginTop: 8, alignItems: "center", backgroundColor: colors.primary, width: "100%", paddingVertical: 10
        }, editButtonStyle: {
            fontSize: 18, color: isLocked ? colors.lightGrey : colors.primary
        },

        backStyle: {
            fontSize: 18, color: colors.primary
        }, syncTime: {
            fontSize: 35, color: colors.white, fontWeight: "bold"
        }, bottomViewStyle: {
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: colors.lightGrey,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingVertical: "2%"
        },selectedModeStyle:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap:20
        },


        addHeatButton: {
            backgroundColor: colors.primary,
            width: 45,
            height: 45,
            position: "relative",
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }, lockIcon: {
            display:"flex",
            justifyContent:"center",
            position: "relative", // bottom: 12, left: 20
        }


        , plusText: {
            color: colors.white, fontSize: 30
        }, heatsWrapper: {
            display: "flex", flexDirection: "column", gap: 10
        }
    });

    const [nowTime, setNowTime] = useState(new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            const dateNow = new Date();
            setNowTime(dateNow.getTime())
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const syncTime = useMemo(() => {
        return moment(myRace.gapMills + nowTime).format("HH:mm:ss")
    }, [nowTime])


    const addHeats = async () => {
        const newHeat: HeatModel = {
            raceId: myRace.raceId,
            heatId: myRace.heats.length + 1,
            startTime: "00:00:00.00",
            name: "heat",
            heatStateNum: HeatStateEnum.ready,
            creationTime: (new Date()).getTime()
        }
        const heatsArray: HeatModel[] = [...myRace.heats];
        heatsArray.push(newHeat)
        await dispatch(setMyRace({...myRace, heats: heatsArray}))
        uploadRaceToNetworkDb(myRace)


        db.transaction(tx => {
            tx.executeSql(`insert into sqliteHeatTable (heatId,raceId,startTime, name,heatStateNum,creationTime) values (?,?,?,?,?,?)`, [newHeat.heatId, newHeat.raceId, newHeat.startTime, newHeat.name, newHeat.heatStateNum, newHeat.creationTime]);
            tx.executeSql("select * from sqliteHeatTable", [], (_, {rows}) => console.log(JSON.stringify(rows), "heats"));
        }, () => {
        },);
    }

    useEffect(() => {
        if (myRace.clientId === clientId) {
            dispatch(setIsLocked(false))
        } else {
            dispatch(setIsLocked(true))
        }
    }, [])



    const ownerRace: boolean = myRace.clientId === clientId;
const closeSelectedMode=()=>{
    dispatch(setSelectedMode(false));
    dispatch(setSelectedHeats([]))
}
    const deleteHeats=()=>{
        let newHeatList:HeatModel[]=[]
        myRace.heats.forEach((heat)=>{
            if (!selectedHeats.includes(heat.heatId)){
                newHeatList.push(heat)
            }
        })
        dispatch(setMyRace({...myRace,heats:newHeatList}))
        deleteHeatNameFromSqlite(selectedHeats)
        uploadRaceToNetworkDb(myRace)
    }
    return <View style={styles.container}>
        <View style={styles.headerWrapper}>
            <Pressable onPress={() => dispatch(setSelectedPage(PagesNameEnum.menu))}>
                <Text style={styles.backStyle}>{text.back}</Text>
            </Pressable>
            <Text>{myRace.name}</Text>
            <Pressable onPress={() => !isLocked && dispatch(setSelectedPage(PagesNameEnum.editTime))}>
                <Text style={styles.editButtonStyle}>{text.edit}</Text>
            </Pressable>
        </View>
        <View style={styles.timeWrapper}>
            <Text style={styles.syncTime}>{syncTime}</Text>
        </View>
        <ScrollView style={styles.heatsWrapper}>
            {myRace.heats.map((heat, index) => {
                return <HeatDisplayRow key={index} heat={heat} index={index + 1} />
            })}
        </ScrollView>
        <View style={styles.bottomViewStyle}>
            <TouchableOpacity style={styles.lockIcon} onPress={() => ownerRace && dispatch(setIsLocked(!isLocked))}>
                {isLocked ?
                    <Image style={{width: 30, height: 40}} source={require("../../assets/icons/lockIcon.png")}/> :
                    <Image style={{width: 30, height: 40}} source={require("../../assets/icons/unlockIcon.png")}/>}
            </TouchableOpacity>
            {isSelectedMode && <View style={styles.selectedModeStyle}>
            <TouchableOpacity onPress={deleteHeats} style={{display:"flex",justifyContent:"center"}}>
               <Image style={{width: 30, height: 40}} source={require("../../assets/icons/delete-icon.png")}/>
           </TouchableOpacity>
            <View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:colors.primary}} >selected {selectedHeats?.length}</Text>
            </View>
            <TouchableOpacity onPress={closeSelectedMode} style={{display:"flex",justifyContent:"center"}}>
               <Image style={{width: 30, height: 30}} source={require("../../assets/icons/cancel-icon.png")}/>
           </TouchableOpacity>
            </View>}



            <TouchableOpacity style={styles.addHeatButton} onPress={addHeats}>
                <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
        </View>

    </View>
}