import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useRef} from "react";
import ScrollView = Animated.ScrollView;
import {colors} from "../../../utils/color";

export const TimePicker:React.FC<{header:string,numberArray:string[],selectedNumber:string,setSelectedNumber:any}>=({numberArray,setSelectedNumber,selectedNumber,header})=>{
    const styles = StyleSheet.create({
        container: {
            height: "95%",
            width: "30%",
            alignItems:"center"

        },
        backStyle:{
            fontSize:18,
            color:colors.primary
        },header:{
            fontSize:18,
            color:colors.darkGrey,
            fontWeight:"bold",
            marginBottom:10
        },
    });

    const scrollViewRef:any = useRef(null);
    const selectedIndex = numberArray.indexOf(selectedNumber);

    React.useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: (selectedIndex-3)*40, animated: true });
        }
    }, []);

    const INFINITY_MULTIPLIER = 2;
    const getInfiniteData = () => {
        const infiniteData = [];
        for (let i = 0; i < INFINITY_MULTIPLIER; i++) {
            infiniteData.push(...numberArray);
        }
        return infiniteData;
    };


    return <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        <ScrollView
            horizontal={false} showsVerticalScrollIndicator={false}
                     ref={scrollViewRef}
        >
            {getInfiniteData().map((number,index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedNumber(number)}
                    style={{
                        height:40,
                        alignItems:"center",
                        display:"flex",
                        justifyContent:"center",
                        paddingHorizontal: 16,
                        backgroundColor: number === selectedNumber ? colors.lightGrey : 'white',
                        borderRadius: 4,
                        marginHorizontal: 8,
                    }}
                >
                    <Text style={{fontSize:20, color: number === selectedNumber ? colors.dark : colors.lightGrey }}>
                        {number}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

    </View>
}