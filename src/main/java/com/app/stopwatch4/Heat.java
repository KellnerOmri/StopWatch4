package com.app.stopwatch4;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.LinkedList;
import java.util.List;

public class Heat {
    private int raceId;
    int heatId;
    String startTime;
    String name;
    int heatStateNum;
    double creationTime;

    public int getRaceId() {
        return raceId;
    }

    public void setRaceId(int raceId) {
        this.raceId = raceId;
    }

    public Heat(int raceId, int heatId, String startTime, String name, int heatStateNum, double creationTime)
    {
        this.raceId=raceId;
        this.creationTime=creationTime;
        this.startTime=startTime;
        this.name=name;
        this.heatStateNum=heatStateNum;
        this.creationTime=creationTime;
        this.heatId=heatId;
    }

    public Heat(JSONObject E) throws JSONException {

        this.raceId = E.getInt("raceId");
        this.heatId = E.getInt("heatId");
        this.startTime = E.getString("startTime");
        this.name = E.getString("name");
        this.heatStateNum = E.getInt("heatStateNum");
        this.creationTime = E.getDouble("creationTime");
    }

        public static List<Heat> initFromJsArray(JSONArray jsonArray) throws JSONException {
        List<Heat> heats = new LinkedList<>();
        for(int i=0;i< jsonArray.length();i++){
            heats.add(new Heat(jsonArray.getJSONObject(i)));
        }
        return  heats;
    }
}
