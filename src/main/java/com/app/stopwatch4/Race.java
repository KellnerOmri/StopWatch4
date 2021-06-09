package com.app.stopwatch4;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class Race {
    int raceId;
    int clientId;
    double creationTime;
    String name;//
    double gapMills;//
    List<Heat> heats;

    public Race( int raceId, int clientId, double creationTime,String name,  double gapMills,   List<Heat> heats)
    {
        this.raceId=raceId;
        this.clientId=clientId;
        this.creationTime=creationTime;
        this.name=name;
        this.gapMills=gapMills;
        this.heats=heats;

    }

    public Race(JSONObject E) throws JSONException {
        this.raceId = E.getInt("raceId");
        this.clientId = E.getInt("clientId");
        this.creationTime = E.getDouble("creationTime");

        this.name = E.getString("name");
        this.gapMills = E.getDouble("gapMills");
        JSONArray heatsjs = E.getJSONArray("heats");
       this.heats= Heat.initFromJsArray(heatsjs);
    }


    public static Race[] initFromJsArray(JSONArray jsonArray) throws JSONException {
        Race[] races = new Race[jsonArray.length()];
        for(int i=0;i< jsonArray.length();i++){
            races[i] = new Race(jsonArray.getJSONObject(i));
        }
        return  races;
    }

}