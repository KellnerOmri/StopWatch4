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
import React, {useEffect, useState} from "react";
import {colors} from "../../utils/color";
import {Picker} from "@react-native-picker/picker";
import {PagesNameEnum, RaceModel} from "../../models";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setMyRace, setSelectedPage} from "../../store/global.slice";
import {text} from "../../utils/dictionary-management";
import {RaceDescriptionModel} from "../../models/RaceDescription.model";
import {getRacesForStartRace, uploadRaceToNetworkDb} from "../../utils/nework-service";
import {createRaceId} from "../../utils/general";
import {createSqliteTables, db, dropSqliteTables, setRaceIdIntoLocalStorage} from "../../utils/db-service";
import {SqliteRaceModel} from "../../models/Sqlite.models";
import {EditSyncTime} from "../editTime/components/EditSyncTime";
import {EditHeatNames} from "../editTime/components/EditHeatNames";
import {InsertManualName} from "./components/InsertManualName";
import {ChooseNewRaceFromList} from "./components/ChooseNewRaceFromList";

export const StartNewRace: React.FC<{ backToMenuFunction: any }> = ({backToMenuFunction}) => {
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












    // const {racesList, clientId, storageRaceId} = useAppSelector(state => state.global);
    // const dispatch = useAppDispatch()
    // const [isLoading, setLoading] = useState(true);
    // const [selectedRace, setSelectedRace] = useState<RaceDescriptionModel>();
    // const [manualName, setManualName] = useState("");
    // const styles = StyleSheet.create({
    //     container: {
    //         paddingHorizontal: 20, height: "100%", width: "100%",
    //     }, pageWrapper: {
    //         marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", height: "90%",
    //     }, pickerContainer: {
    //         backgroundColor: colors.primary, width: "100%", color: colors.white
    //     }, chooseText: {
    //         color: colors.white, fontSize: 20
    //     }, bottomWrapper: {
    //         width: "100%"
    //     }, createNewRaceWrapper: {
    //         backgroundColor: colors.primary, alignItems: "center", width: "100%", padding: 10
    //     }, createNewRaceText: {
    //         fontSize: 20, color: colors.white,
    //     }, input: {
    //         borderColor: colors.primary,
    //         borderRadius: 4,
    //         borderWidth: 1,
    //         flex: 1,
    //         padding: 10,
    //         marginBottom: 12,
    //         textAlign: "center",
    //         color: colors.dark
    //     }, flexRow: {
    //         width: "100%", flexDirection: "row"
    //     },
    // });
    //
    // useEffect(() => {
    //     getRacesForStartRace(setLoading).then()
    // }, [])
    //
    // const createNewRace = async () => {
    //     const text = manualName !== "" ? manualName : selectedRace?.description ?? "מרוץ 4 ספורט";
    //     await setRaceIdIntoLocalStorage(storageRaceId + 1)
    //     const raceId = createRaceId(clientId, storageRaceId)
    //     await dropSqliteTables()
    //     await createSqliteTables()
    //     const newSqliteRaceModel: SqliteRaceModel = {
    //         raceId: raceId, name: text, gapMills: 0,clientId:clientId,creationTime:(new Date()).getTime()
    //     }
    //     if (text === null || text === "") {
    //         return false;
    //     }
    //     db.transaction(tx => {
    //         tx.executeSql(`insert into sqliteRaceTable (raceId,gapMills, name,clientId,creationTime) values (?,?, ?,?,?)`, [newSqliteRaceModel.raceId, newSqliteRaceModel.gapMills, newSqliteRaceModel.name,newSqliteRaceModel.clientId,newSqliteRaceModel.creationTime]);
    //         tx.executeSql("select * from sqliteRaceTable", [], (_, {rows}) => console.log(JSON.stringify(rows),"startRace"));
    //     }, () => {
    //     },);
    //     const newRace: RaceModel = {
    //         raceId: raceId, clientId: clientId, creationTime: (new Date()).getTime(), name: text, gapMills: 0.0, heats: []
    //     }
    //     await dispatch(setMyRace(newRace))
    //     uploadRaceToNetworkDb(newRace)
    //     dispatch(setSelectedPage(PagesNameEnum.raceDetails))
    // }
    //
    // return <View style={styles.container}>
    //     <Pressable style={{marginTop: 20, width: "15%"}} onPress={backToMenuFunction}>
    //         <Text style={{color: colors.primary}}>{text.back}</Text>
    //     </Pressable>
    //     <View style={styles.pageWrapper}>
    //         {isLoading ? <ActivityIndicator/> :
    //             <Picker
    //             style={styles.pickerContainer}
    //             selectedValue={selectedRace}
    //             onValueChange={(itemValue) => setSelectedRace(itemValue)}
    //         >
    //             <Picker.Item label="בחר אירוע" value="notSelected" enabled={false}/>
    //             {racesList.map((race: RaceDescriptionModel, index) => {
    //                 return <Picker.Item key={index} label={race.description ? race.description : "empty"} value={race}/>
    //             })}
    //         </Picker>}
    //         <View style={styles.bottomWrapper}>
    //             <SafeAreaView style={{width: "100%"}}>
    //                 <View style={styles.flexRow}>
    //                     <TextInput
    //                         onChangeText={(text) => setManualName(text)}
    //                         placeholder={text.InsertRaceName}
    //                         style={styles.input}
    //                         value={manualName}
    //                     />
    //                 </View>
    //             </SafeAreaView>
    //             <Pressable style={styles.createNewRaceWrapper} onPress={() => createNewRace()}>
    //                 <Text style={styles.createNewRaceText}>{text.createNewRace}</Text>
    //             </Pressable>
    //         </View>
    //     </View>
    // </View>
}