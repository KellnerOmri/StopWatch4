import {setClientId, setRacesList} from "../store/global.slice";
import {store} from "../app/store";
import {getClientIdFromLocalStorage, setClientIdIntoLocalStorage} from "./db-service";
import axios from "axios";
import {HeatModel, RaceModel} from "../models";
import {HeatStateEnum} from "../models/heatState.enum";

const dispatch = store.dispatch
export const getRacesForStartRace = async (setLoading:any) => {
    try {
        axios.get('https://www.4sport-live.com/stopwatch4/get4sportComps/')
            .then(response => {
                dispatch(setRacesList(response.data))
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};
export const getHeatsForStartRace = async (compId:string|number,raceId:number) => {
    try {
        const response = await fetch(`https://www.4sport-live.com/stopwatch4/get4sportRolls/?comp=${compId}`);
        const json = await response.json();
        const heatsList:HeatModel[]=[]
        await json.forEach((heat:any,index:number)=>{
            heatsList.push({
                raceId,
                heatId:index+1,
                startTime:"00:00:00.00",
                name:heat.description,
                heatStateNum:HeatStateEnum.ready,
                creationTime:(new Date()).getTime()
                })
        })
        return heatsList;
    } catch (error) {
        console.error(error);
    }
};

export const getRacesForImportRace = async (setLoading:any,setRaceListForImport:any) => {
    axios.get('https://www.4sport-live.com/stopwatch4/getRaces/')
        .then(response => {
            setRaceListForImport(response.data);
            setLoading(false)
        })
        .catch(error => {
            console.error(error);
        });
};

export const getClientId = async () => {
    const sqliteClientId = await getClientIdFromLocalStorage();
    if(sqliteClientId!==null){
        dispatch(setClientId(sqliteClientId));
    }
    else {
        try {
            axios.get('https://www.4sport-live.com/stopwatch4/getClientID/')
                .then(response => {
                    setClientIdIntoLocalStorage( response.data["clientId"])
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    }
};

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    'Content-Type' : 'multipart/form-data',
};
export const uploadRaceToNetworkDb =(race:RaceModel)=>{
    const formData = new FormData();
    formData.append("data",JSON.stringify(race))
    axios.post(
        "https://www.4sport-live.com/stopwatch4/uploadRace/",
        formData,
        {
            headers: headers,
        }
    )
        .then((res) => {
        })
        .catch((e) => {
            console.log(e, "e");
        });
}