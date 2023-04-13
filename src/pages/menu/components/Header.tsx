import {StyleSheet, Text, View} from "react-native";
import {colors} from "../../../utils/color";

export const Header=()=>{
    const styles = StyleSheet.create({
        container:{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:colors.lightGrey,
            width:"100%",
            paddingVertical:10,
            borderBottomColor:colors.darkGrey,
            borderBottomWidth:1
        },
        textStyle: {
            fontSize:16,
            fontStyle:"italic",
            fontWeight:"bold"
        },
    });
    return <View style={styles.container}>
        <Text style={styles.textStyle}>StopWatch4</Text>
    </View>
}