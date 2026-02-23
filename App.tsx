import {Provider} from "react-redux";
import {store} from "./src/app/store";
import AppPageController from "./src/pages/AppPageController";
import {useEffect} from "react";
import {getClientId} from "./src/utils/nework-service";
import {createSqliteTables, getRaceIdFromLocalStorage} from "./src/utils/db-service";
import {ThemeProvider} from "./src/theme/ThemeContext";
import {LanguageProvider} from "./src/i18n/LanguageContext";

export default function App() {
    useEffect(()=>{
        createSqliteTables()
        getClientId().then()
        getRaceIdFromLocalStorage().then()
    },[])
    return (
        <Provider store={store}>
            <ThemeProvider>
                <LanguageProvider>
                    <AppPageController/>
                </LanguageProvider>
            </ThemeProvider>
        </Provider>
    );
}
