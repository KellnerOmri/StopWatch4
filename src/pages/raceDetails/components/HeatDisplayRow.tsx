import {colors} from "../../../utils/color";
import {
    Image,
    Linking,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import React from "react";
import {HeatModel} from "../../../models";
import moment from "moment/moment";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {HeatStateEnum} from "../../../models/heatState.enum";
import {setIsLocked, setMyRace, setSelectedHeats, setSelectedMode} from "../../../store/global.slice";
import {updateHeatStartTimeIntoSqlite} from "../../../utils/db-service";
import {uploadRaceToNetworkDb} from "../../../utils/nework-service";

import {Audio} from 'expo-av';


export const HeatDisplayRow: React.FC<{ heat: HeatModel,index:number ,ownerRace:boolean}> = ({heat,index,ownerRace}) => {
    const {myRace,isLocked,isSelectedMode,selectedHeats} = useAppSelector(state => state.global);
    const dispatch = useAppDispatch()
    const isHeatSelected = selectedHeats.includes(heat.heatId)

    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            borderColor: colors.darkGrey,
            borderBottomWidth: 1,
            paddingBottom: 8,
            backgroundColor:isHeatSelected?colors.darkGrey:colors.white
        }, rowContainer: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: ownerRace ?"5%":"10%",
        }, headerStyle: {
            borderBottomWidth:0.5,
            borderColor:colors.darkGrey,
            fontSize: 18
        }, timesWrapper: {
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }, timeWrapper: {
            borderRadius:12,
            width: "80%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: colors.primary
        }, timeText: {
            fontSize: 18, color: colors.white
        }, heatNumber: {
            width: "10%"
        }, actionContainer: {
            backgroundColor:(!ownerRace) || ( isLocked && heat.heatStateNum !== HeatStateEnum.ready)?colors.lightGrey:heat.heatStateNum===HeatStateEnum.running?"red":"green",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            width: "25%",
            paddingVertical:20,
            borderRadius: 4
        }
    });
    const calculateHeatCreationTime = (startTime: string) => {
        const [hours, minutes, seconds,millisecond] = startTime.split(/[:.]/);
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        date.setSeconds(parseInt(seconds));
        date.setMilliseconds(parseInt(millisecond));
        const millisecsSince1970 = date.getTime();
        return millisecsSince1970
    }

    const getTimer = (): string => {
        const heatCreationTime = calculateHeatCreationTime(heat.startTime)
        const dateNow = new Date();
        if (heat.heatStateNum === HeatStateEnum.ready || heat.heatStateNum === HeatStateEnum.stop) {
            return "00:00:00"
        }
        return moment.utc((dateNow.getTime()+myRace.gapMills)-heatCreationTime).format("HH:mm:ss")
    }
    const getStartTimeText = (): string => {
        if (heat.heatStateNum === HeatStateEnum.ready || heat.heatStateNum === HeatStateEnum.stop) {
            return "00:00:00.00"
        }
        return heat.startTime
    }
    const getActionName = (): string => {
        return heat.heatStateNum === HeatStateEnum.running ? "Reset" : "Start"
    }

    const changeHeatAction = (heatState: HeatStateEnum): HeatStateEnum => {
        if (heatState === HeatStateEnum.running) {
            return HeatStateEnum.ready
        } else {
            return HeatStateEnum.running
        }
    }

    const getStartTime=():string=>{
        const dateNow = new Date();
        return moment(myRace.gapMills + dateNow.getTime()).format("HH:mm:ss.SS")
    }
    const onActionPressed = async () => {
        if ((!ownerRace) || (isLocked && heat.heatStateNum !== HeatStateEnum.ready)){
            if (Platform.OS === 'android') {
                ToastAndroid.show("please unlock first", ToastAndroid.SHORT);
            }
            return
        }
        const newHeatsList: HeatModel[] = []
        myRace.heats.forEach((h) => {
            if (h.heatId === heat.heatId) {
                const newStartTime = getStartTime()
                const newHeatStateNum = changeHeatAction(h.heatStateNum)
                newHeatsList.push({
                    raceId: h.raceId,
                    heatId: h.heatId,
                    startTime: newStartTime,
                    name: h.name,
                    heatStateNum: newHeatStateNum,
                    creationTime: h.creationTime
                })
                updateHeatStartTimeIntoSqlite(newStartTime,newHeatStateNum,heat.heatId)
            } else {
                newHeatsList.push(h);
            }
        })
        const newRace = {...myRace,heats:newHeatsList}
        await dispatch(setMyRace(newRace))
        uploadRaceToNetworkDb(newRace)
        if (heat.heatStateNum!==HeatStateEnum.running){
            dispatch(setIsLocked(true))
            playSound().then()
        }
    }


    const shareText = async () => {
        const url = `whatsapp://send?&text=${heat.name} ${heat.startTime}`;
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

    const playSound = async () => {
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require("../../../assets/sounds/gunshut.mp3"));
            await soundObject.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    const heatSelectedForRemove=()=>{
        if (isSelectedMode){
            let newSelectedHeats:number[]=[...selectedHeats]
            if (isHeatSelected){
                const heatIndex = newSelectedHeats.indexOf(heat.heatId)
                newSelectedHeats.splice(heatIndex,1);
                if (newSelectedHeats.length===0){
                    dispatch(setSelectedMode(false))
                }
            }else {
                newSelectedHeats.push(heat.heatId)
            }
        dispatch(setSelectedHeats(newSelectedHeats))
        }
    }

    const onLongPress=()=>{
        if (isSelectedMode || isLocked){
            dispatch(setSelectedMode(false))
            dispatch(setSelectedHeats([]))
        }else {
            dispatch(setSelectedMode(true))
            dispatch(setSelectedHeats([heat.heatId]))
        }
    }

    return <Pressable onLongPress={onLongPress} delayLongPress={500} style={styles.container} onPress={heatSelectedForRemove}>
        <SafeAreaView style={styles.rowContainer}>
            <TouchableOpacity  onPress={shareText} >
                <Image source={require("../../../assets/icons/shareImage.png")} style={{width:25,height:25}}/>
            </TouchableOpacity>
            <View style={styles.timesWrapper}>
                <Text style={styles.headerStyle}>{heat.name!=="heat"?heat.name:""}</Text>
                <View style={styles.timeWrapper}><Text style={styles.timeText}>{getTimer()}</Text></View>
                <View style={styles.timeWrapper}><Text style={styles.timeText}>{getStartTimeText()}</Text></View>
            </View>
            <Text style={styles.heatNumber}>{index}</Text>
            {ownerRace && <TouchableOpacity onPress={() => onActionPressed()}
                               style={styles.actionContainer}><Text>{getActionName()}</Text></TouchableOpacity>}
        </SafeAreaView>
    </Pressable>

}