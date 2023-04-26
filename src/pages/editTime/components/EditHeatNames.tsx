import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
// import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {colors} from "../../../utils/color";
import React from "react";
// import {setMyRace} from "../../../store/global.slice";
// import {debounce} from "lodash";
import {updateHeatNameIntoSqlite} from "../../../utils/db-service";
// import {uploadRaceToNetworkDb} from "../../../utils/nework-service";
import {HeatModel} from "../../../models";
export const EditHeatNames:React.FC<{localHeats:HeatModel[],setLocalHeats:any}> = ({localHeats, setLocalHeats}) => {
    // const dispatch = useAppDispatch()
    // const {myRace} = useAppSelector(state => state.global);
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
            gap:10
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

    return <View style={styles.container}>
        <ScrollView
            horizontal={false} showsVerticalScrollIndicator={false}>
            <View style={{height:"100%",display:"flex",flexDirection:"column",gap:10}}>
            {localHeats.map((heat, index) => {
                return <View style={styles.heatRowStyle} key={index}>
                    <Text style={styles.heatIndex}>{index}</Text>
                    <TextInput
                        onChangeText={(text) => {
                            let newLocalHeats = [...localHeats];
                            newLocalHeats[index].name = text;
                            updateHeatNameIntoSqlite(text,heat.heatId)
                            setLocalHeats(newLocalHeats)
                        }}
                        style={styles.input}
                        value={localHeats[index].name}
                    />
                </View>
            })}
            </View>
        </ScrollView>
    </View>
}