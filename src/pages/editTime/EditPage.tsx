import {Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../utils/color";
import {text} from "../../utils/dictionary-management";
import { setSelectedPage} from "../../store/global.slice";
import {PagesNameEnum} from "../../models";
import {useAppDispatch} from "../../app/hooks";
import React, {useState} from "react";
import {EditSyncTime} from "./components/EditSyncTime";
import {EditHeatNames} from "./components/EditHeatNames";

export const EditPage = () => {
    const dispatch = useAppDispatch()

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            width: "100%",
            paddingTop: 25,
            paddingHorizontal:20
        },
        backStyle: {
            fontSize: 18,
            color: colors.primary

        },editMenuWrapper:{
            marginTop:20,
            display:"flex",
            flexDirection:"row",
            width:"100%",
            justifyContent:"space-around",
        },
        categorySelected:{
            width:"50%",
            backgroundColor:colors.primary,
            alignItems:"center",
            borderTopLeftRadius:20,
            borderTopRightRadius:20,

        },
        textSelected:{
            color:colors.white
        },
        categoryNotSelected:{
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            width:"50%",
            backgroundColor:colors.lightGrey,
            alignItems:"center"
        },
        textNotSelected:{
            color:colors.dark
        },
    });
const [isSyncSelected,setIsSyncSelected]=useState(false)
    return <View style={styles.container}>
            <Pressable onPress={() => dispatch(setSelectedPage(PagesNameEnum.raceDetails))}>
                <Text style={styles.backStyle}>{text.back}</Text>
            </Pressable>
            <View style={styles.editMenuWrapper}>
                <TouchableOpacity style={isSyncSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsSyncSelected(true)}><Text style={isSyncSelected?styles.textSelected:styles.textNotSelected}>Sync time</Text></TouchableOpacity>
                <TouchableOpacity style={!isSyncSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsSyncSelected(false)}><Text style={!isSyncSelected?styles.textSelected:styles.textNotSelected}>Edit heats name</Text></TouchableOpacity>
            </View>
        {isSyncSelected ? <EditSyncTime />
        :<EditHeatNames/>}
    </View>
}