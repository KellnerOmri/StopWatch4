import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {colors} from "../../../utils/color";
import React, {useCallback} from "react";
import {debounce} from "lodash";
import {updateHeatNameIntoSqlite} from "../../../utils/db-service";
import {HeatModel} from "../../../models";
export const EditHeatNames:React.FC<{localHeats:HeatModel[],setLocalHeats:any}> = ({localHeats, setLocalHeats}) => {
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
    const debounceOnChangeText = useCallback(
        debounce((text:string,heatId:number) => {
            updateHeatNameIntoSqlite(text,heatId)
        }, 600),
        []
    );

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
                            setLocalHeats(newLocalHeats)
                            debounceOnChangeText(text,heat.heatId);
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