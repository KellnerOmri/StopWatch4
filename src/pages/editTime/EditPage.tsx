import {Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../utils/color";
import {text} from "../../utils/dictionary-management";
import {setMyRace, setSelectedPage} from "../../store/global.slice";
import {HeatModel, PagesNameEnum} from "../../models";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import React, {useState} from "react";
import {EditSyncTime} from "./components/EditSyncTime";
import {EditHeatNames} from "./components/EditHeatNames";
import {uploadRaceToNetworkDb} from "../../utils/nework-service";

export const EditPage = () => {
    const dispatch = useAppDispatch()
    const {myRace} = useAppSelector(state => state.global);

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
    const [localHeats,setLocalHeats] = useState<HeatModel[]>([...myRace.heats])


    const onBackPress= async ()=>{
        await dispatch(setMyRace({...myRace, heats: localHeats}))
        dispatch(setSelectedPage(PagesNameEnum.raceDetails))
        uploadRaceToNetworkDb(myRace)
    }
    return <View style={styles.container}>
            <Pressable onPress={()=>onBackPress()}>
                <Text style={styles.backStyle}>{text.back}</Text>
            </Pressable>
            <View style={styles.editMenuWrapper}>
                <TouchableOpacity style={isSyncSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsSyncSelected(true)}><Text style={isSyncSelected?styles.textSelected:styles.textNotSelected}>Sync time</Text></TouchableOpacity>
                <TouchableOpacity style={!isSyncSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsSyncSelected(false)}><Text style={!isSyncSelected?styles.textSelected:styles.textNotSelected}>Edit heats name</Text></TouchableOpacity>
            </View>
        {isSyncSelected ? <EditSyncTime />
        :<EditHeatNames localHeats={localHeats} setLocalHeats={setLocalHeats}/>}
    </View>
}