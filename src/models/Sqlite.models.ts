import {HeatModel} from "./Heat.model";

export interface SqliteRaceModel {
    raceId:number;
    name:string;
    gapMills:number;
    clientId:number;
    creationTime:number
}
export interface SqliteHeatModel{
    raceId:number;
    heatId:number;
    startTime:string;
    name:string
    heatStateNum:number;
}
