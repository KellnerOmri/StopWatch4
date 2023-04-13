import {setClientId, setRacesList} from "../store/global.slice";
import {store} from "../app/store";
import {getClientIdFromLocalStorage, setClientIdIntoLocalStorage} from "./db-service";
import axios from "axios";
import {RaceModel} from "../models";
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
// export const getRacesForStartRace = async (setLoading:any) => {
//     try {
//         const response = await fetch('https://www.4sport-live.com/stopwatch4/get4sportComps/');
//         const json = await response.json();
//         dispatch(setRacesList(json));
//     } catch (error) {
//         console.error(error);
//     } finally {
//         setLoading(false);
//     }
// };

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
// export const getRacesForImportRace = async (setLoading:any,setRaceListForImport:any) => {
//     try {
//         const response = await fetch('https://www.4sport-live.com/stopwatch4/getRaces/');
//         const json:RaceModel[] = await response.json();
//         console.log(json,"json")
//         setRaceListForImport(json)
//     } catch (error) {
//         console.error(error);
//     } finally {
//         setLoading(false);
//     }
// };



// export const getClientId = async () => {
//     console.log("im here")
//     const sqliteClientId = await getClientIdFromLocalStorage();
//     if(sqliteClientId!==null){
//         // dispatch(setClientId(sqliteClientId));
//         axios.get('https://www.4sport-live.com/stopwatch4/getClientID/')
//             .then(response => {
//                 console.log(response.data,"testclient")
//                 setClientIdIntoLocalStorage( response.data["clientId"])
//                 console.log("sucsess")
//                 // return response.data
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//
//
//
//
//     }
//     else {
//         // try {
//             // const response = await fetch('https://www.4sport-live.com/stopwatch4/getClientID/');
//
//               axios.get('https://www.4sport-live.com/stopwatch4/getClientID/')
//                   .then(response => {
//                       console.log(response.data,"testclient")
//                       // return response.data
//                   })
//                   .catch(error => {
//                       console.error(error);
//                   });
//             // console.log(clientId,"clientId")
//             // await setClientIdIntoLocalStorage( clientId["clientId"])
//         // } catch (error) {
//         //     console.error(error);
//         // } finally {}
//     }
// };

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
            console.log(res, "res");
        })
        .catch((e) => {
            console.log(e, "e");
        });
}