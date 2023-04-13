import {HeatModel} from "./Heat.model";

export interface RaceModel {
   raceId:number;
   clientId: number;
   creationTime:number;
   name:string;
   gapMills:number;
   heats:HeatModel[];
}


