import {HeatStateEnum} from "./heatState.enum";

export interface HeatModel{
   raceId:number;
   heatId:number;
   startTime:string;
   name:string;
   heatStateNum:HeatStateEnum;
   creationTime:number;
}
