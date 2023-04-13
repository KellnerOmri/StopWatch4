import {Button, Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import {colors} from "../../../utils/color";

export const MenuButton:React.FC<{title:string,selectedPage:any}>=({title,selectedPage})=>{
    const styles = StyleSheet.create({
        container: {
            width:"75%",
        },buttonStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
            borderRadius: 12,
            elevation: 3,
            backgroundColor: colors.primary,
        },
        text: {
            fontSize: 22,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: colors.white,
        },
    });
    const onPress=()=>{
        selectedPage()
    }
    return <View style={styles.container}>
        <Pressable style={styles.buttonStyle} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    </View>
}