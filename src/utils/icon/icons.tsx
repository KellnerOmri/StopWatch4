import React from "react";
import {iconNames} from "./icon-types";
import {View} from "react-native";

export const Icons:React.FC<{src:string}>=({src})=>{
    return <View><img src={src} alt={""}/></View>
    // <img src={src}/>
}