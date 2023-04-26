import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, { useState} from "react";
import {colors} from "../../utils/color";
import {PagesNameEnum} from "../../models";
import {useAppDispatch} from "../../app/hooks";
import {setSelectedPage} from "../../store/global.slice";
import {text} from "../../utils/dictionary-management";
import {InsertManualName} from "./components/InsertManualName";
import {ChooseNewRaceFromList} from "./components/ChooseNewRaceFromList";

export const StartNewRace = () => {
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
    const [isManuallyNameSelected,setIsManuallyNameSelected]=useState(false)
    return <View style={styles.container}>
        <Pressable onPress={() => dispatch(setSelectedPage(PagesNameEnum.menu))}>
            <Text style={styles.backStyle}>{text.back}</Text>
        </Pressable>
        <View style={styles.editMenuWrapper}>
            <TouchableOpacity style={isManuallyNameSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsManuallyNameSelected(true)}><Text style={isManuallyNameSelected?styles.textSelected:styles.textNotSelected}>צור אירוע ידנית</Text></TouchableOpacity>
            <TouchableOpacity style={!isManuallyNameSelected?styles.categorySelected:styles.categoryNotSelected} onPress={()=>setIsManuallyNameSelected(false)}><Text style={!isManuallyNameSelected?styles.textSelected:styles.textNotSelected}>צור אירוע מרשימה</Text></TouchableOpacity>
        </View>
        {isManuallyNameSelected ? <InsertManualName/>
            :<ChooseNewRaceFromList/>}
    </View>
}