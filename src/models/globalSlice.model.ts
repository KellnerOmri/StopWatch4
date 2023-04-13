import {PagesNameEnum} from "./pagesName.enum";
import {RaceModel} from "./Race.model";
import {RaceDescriptionModel} from "./RaceDescription.model";
// import {WebSQLDatabase} from "expo-sqlite/src/SQLite.types";

export interface GlobalSliceModel {
   selectedPage : PagesNameEnum,
   racesList: RaceDescriptionModel[],
   myRace:RaceModel,
   clientId:number,
   storageRaceId:number,
   raceId:number,
   isLocked:boolean,
   isSelectedMode:boolean
   selectedHeats:number[]
   // sqliteDb:WebSQLDatabase
}
