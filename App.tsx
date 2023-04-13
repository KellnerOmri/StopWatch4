import {Provider} from "react-redux";
import {store} from "./src/app/store";
import AppPageController from "./src/pages/AppPageController";
import {StatusBar} from "expo-status-bar";
import {useEffect} from "react";
import {getClientId} from "./src/utils/nework-service";
import {getRaceIdFromLocalStorage} from "./src/utils/db-service";

export default function App() {
    useEffect(()=>{
        getClientId().then()
        getRaceIdFromLocalStorage().then()
    },[])
    return (
        <Provider store={store}>
            <AppPageController/>
            <StatusBar style="auto"/>
        </Provider>

    );
}
