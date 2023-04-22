import {store} from "../app/store";
import {setRaceId} from "../store/global.slice";
import {setRaceIdIntoLocalStorage} from "./db-service";
const dispatch = store.dispatch
export const createRaceId = (clientId:number,storageRaceId:number)=>{
    dispatch(setRaceId(parseInt(`${clientId}${storageRaceId+1}`)))
    setRaceIdIntoLocalStorage(storageRaceId + 1).then()
    return (parseInt(`${clientId}${storageRaceId+1}`));
}