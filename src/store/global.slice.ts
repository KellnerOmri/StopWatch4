import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {GlobalSliceModel,PagesNameEnum,RaceModel}  from "../models";
import {RaceDescriptionModel} from "../models/RaceDescription.model";

const initialState: GlobalSliceModel = {
  selectedPage : PagesNameEnum.menu,
  racesList: [],
  myRace:{raceId:0, creationTime:0, name:"", clientId:0, heats:[], gapMills:0},
  clientId:0,
  storageRaceId:0,
  raceId:0,
  isLocked:false,
  isSelectedMode:false,
  selectedHeats:[],
  manualStartHeatId:0
  // sqliteDb:SQLite.openDatabase('stopWatchDb')
};
export const globalSlice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    setSelectedPage: (state, action: PayloadAction<PagesNameEnum>) => {
      state.selectedPage = action.payload;
    },
    setRacesList: (state, action: PayloadAction<RaceDescriptionModel[]>) => {
      state.racesList = action.payload;
    },
    setMyRace: (state, action: PayloadAction<RaceModel>) => {
      state.myRace = action.payload;
    },
    setClientId: (state, action: PayloadAction<number>) => {
      state.clientId = action.payload;
    },
    setStorageRaceId: (state, action: PayloadAction<number>) => {
      state.storageRaceId = action.payload;
    },
    setRaceId: (state, action: PayloadAction<number>) => {
      state.raceId = action.payload;
    },
    setIsLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
    setSelectedMode: (state, action: PayloadAction<boolean>) => {
      state.isSelectedMode = action.payload;
    },setSelectedHeats: (state, action: PayloadAction<number[]>) => {
      state.selectedHeats = action.payload;
    },
    setManualStartHeatId: (state, action: PayloadAction<number>) => {
      state.manualStartHeatId = action.payload;
    },
  },
});

export const {
  setSelectedPage,
  setRacesList,
  setMyRace,
  setClientId,
  setStorageRaceId,
  setRaceId,
  setIsLocked,
  setSelectedMode,
  setSelectedHeats,
  setManualStartHeatId
} = globalSlice.actions;
export default globalSlice.reducer;
