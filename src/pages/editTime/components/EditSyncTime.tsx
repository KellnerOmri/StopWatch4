import {Pressable, StyleSheet, Text, View} from "react-native";
import {TimePicker} from "./TimePicker";
import {text} from "../../../utils/dictionary-management";
import React, {useState} from "react";
import {colors} from "../../../utils/color";
import {updateRaceGapMilsIntoSqlite} from "../../../utils/db-service";
import {setMyRace, setSelectedPage} from "../../../store/global.slice";
import {PagesNameEnum} from "../../../models";
import moment from "moment/moment";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {uploadRaceToNetworkDb} from "../../../utils/nework-service";


export const EditSyncTime = () => {
    const dispatch = useAppDispatch()
    const {myRace} = useAppSelector(state => state.global);

    const styles = StyleSheet.create({
        container:{
            height: "100%",
            width: "100%",
            paddingTop: 25,
            paddingHorizontal: 20,
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"
        },
        bodyWrapper: {
            height:"91%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        },
        timePickerWrapper: {
            height: "70%",
            display: "flex",
            flexDirection: "row",
            justifyContent:"space-between",
        },
        timeTextWrapper: {
            width: "100%",
            alignItems: "center",
        },
        timeTextStyle: {
            fontSize: 35,
        },
        setTimeButton: {
            backgroundColor: colors.primary,
            width: "100%",
            alignItems: "center",
            borderTopRightRadius:35,
            borderTopLeftRadius:35,
        },
        buttonTextStyle:{
            color:colors.white,
            fontSize: 35,
        }
    });

    const now = moment();
    const time = now.format('HH:mm:ss');

    const [hourNow,mimNow,secNow] = time.split(":")

    const [selectedHour, setSelectedHour] = useState(hourNow);
    const [selectedMinute, setSelectedMinute] = useState(mimNow);
    const [selectedSecond, setSelectedSecond] = useState(secNow);



    const syncTime = async () => {
        const dateObj = new Date();
        const dateNow = new Date();

        dateObj.setHours(Number(selectedHour));
        dateObj.setMinutes(Number(selectedMinute));
        dateObj.setSeconds(Number(selectedSecond));

        const newGapMills = dateObj.getTime()-dateNow.getTime()
        updateRaceGapMilsIntoSqlite(myRace.raceId,newGapMills)
        await dispatch(setMyRace({...myRace,gapMills:newGapMills}))
        uploadRaceToNetworkDb(myRace)
        dispatch(setSelectedPage(PagesNameEnum.raceDetails))
    }


    const hours = Array.from({length: 24}, (_, i) => i).map((num) => num > 9 ? `${num}` : `0${num}`); // 0 to 23
    const minutes = Array.from({length: 60}, (_, i) => i).map((num) => num > 9 ? `${num}` : `0${num}`); // 0 to 59
    const seconds = Array.from({length: 60}, (_, i) => i).map((num) => num > 9 ? `${num}` : `0${num}`); // 0 to 59

    return <View style={styles.container}>
        <View style={styles.bodyWrapper}>
            <View style={styles.timePickerWrapper}>
                <TimePicker header={text.hours} numberArray={hours} selectedNumber={selectedHour}
                            setSelectedNumber={setSelectedHour}/>
                <TimePicker header={text.minutes} numberArray={minutes} selectedNumber={selectedMinute}
                            setSelectedNumber={setSelectedMinute}/>
                <TimePicker header={text.seconds} numberArray={seconds} selectedNumber={selectedSecond}
                            setSelectedNumber={setSelectedSecond}/>
            </View>
            <View style={styles.timeTextWrapper}>
                <Text style={styles.timeTextStyle}>{selectedHour}:{selectedMinute}:{selectedSecond}</Text>
            </View>
            <View style={styles.setTimeButton}>
                <Pressable onPress={()=>syncTime()}>
                    <Text style={styles.buttonTextStyle}>{text.setTime}</Text>
                </Pressable>
            </View>
        </View>

    </View>
}