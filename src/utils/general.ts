import {store} from "../app/store";
import {setRaceId, setStorageRaceId} from "../store/global.slice";
import {setRaceIdIntoLocalStorage} from "./db-service";
const dispatch = store.dispatch
// const {clientId,storageRaceId} = store.getState().global
export const createRaceId = (clientId:number,storageRaceId:number)=>{
    // dispatch(setStorageRaceId(storageRaceId+1))
    console.log(clientId,storageRaceId,"he")
    dispatch(setRaceId(parseInt(`${clientId}${storageRaceId+1}`)))
    setRaceIdIntoLocalStorage(storageRaceId + 1).then()
    return (parseInt(`${clientId}${storageRaceId+1}`));
}