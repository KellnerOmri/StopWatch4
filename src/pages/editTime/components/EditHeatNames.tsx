import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {colors} from "../../../utils/color";
import React, {useCallback, useState} from "react";
import {debounce} from "lodash";
import {updateHeatNameIntoSqlite} from "../../../utils/db-service";
import {HeatModel} from "../../../models";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {setMyRace} from "../../../store/global.slice";
export const EditHeatNames = () => {
    const dispatch = useAppDispatch()
    const {myRace} = useAppSelector(state => state.global);
    const localHeats:HeatModel[] = [...myRace.heats]

    const styles = StyleSheet.create({
        container: {
            paddingTop: 25,
        }, heatRowStyle: {
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems:"center",
            height:40,
            gap:10,
            marginBottom:30
        }, input: {
            borderColor: colors.primary,
            borderRadius: 4,
            borderWidth: 1,
            flex: 1,
            padding: 5,
            textAlign: "center",
            color: colors.dark,
            fontSize:20
        },scrollView:{
            display:"flex",
            flexDirection:"column",
            gap:10
        },heatIndex:{
            fontSize:20,
            width:"10%"
        }
    });

    const debounceOnChangeText = useCallback(
        debounce((text:string,heatId:number,index) => {
            let newLocalHeats = [...myRace.heats];
            let newHeat:HeatModel = {...myRace.heats[index],name:text}
            newLocalHeats.splice(index,1,newHeat);
            dispatch(setMyRace({...myRace, heats: newLocalHeats}))
            updateHeatNameIntoSqlite(text,heatId)
        }, 600),
        []
    );

    return <View style={styles.container}>
        <ScrollView
            scrollEnabled={true}
            horizontal={false} showsVerticalScrollIndicator={false}
        >
            {localHeats.map((heat, index) => {
                const [localTextState,setLocalTextState] = useState(heat.name)
                return <SafeAreaView style={styles.heatRowStyle} key={index}>
                    <Text style={styles.heatIndex}>{index}</Text>
                    <TextInput
                        onChangeText={(text) => {
                            setLocalTextState(text)
                            debounceOnChangeText(text,heat.heatId,index);
                        }}
                        style={styles.input}
                        value={localTextState}
                    />
                </SafeAreaView>
            })}
        </ScrollView>
    </View>
}