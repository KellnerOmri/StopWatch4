package com.app.stopwatch4;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

public class MyApplication extends Application {

    private static MyApplication instance;
    public static MyApplication factory() { return instance; }
    public static int clientId;


    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        SharedPreferences sharedPreferences = getSharedPreferences(SyncTimeActivity.SHARED_PREFS, MODE_PRIVATE);//getLoad Time
        MyApplication.clientId = sharedPreferences.getInt("clientId", -1);

        if(MyApplication.clientId == -1) {
            NetworkManager.requestClientId(clientId -> {
                SharedPreferences sharedddPreferences = getSharedPreferences(SyncTimeActivity.SHARED_PREFS, MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedddPreferences.edit();
                editor.putInt("clientId", clientId);
                editor.apply();
                MyApplication.clientId = clientId;
                return null;
            });
        }


    }

    public int getRaceId()
    {
        SharedPreferences sharedPreferences = getSharedPreferences(SyncTimeActivity.SHARED_PREFS, MODE_PRIVATE);//getLoad Time
        int raceId = sharedPreferences.getInt("raceId", 0);
        raceId++;
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt("raceId", raceId);
        editor.apply();
        return raceId;
    }

    public Context getAppContext(){
        return  getApplicationContext();
    }
}
