package com.app.stopwatch4;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Comp {
    static int indexOfComps;
    int comp;
    String description;

    public Comp(JSONObject E) throws JSONException {
        this.comp = E.getInt("comp");
        this.description = E.getString("description");
    }

    public static Comp[] initFromJsArray(JSONArray jsonArray) throws JSONException {
        Comp[] comps = new Comp[jsonArray.length()];
        for(indexOfComps=0;indexOfComps< jsonArray.length();indexOfComps++){
            comps[indexOfComps] = new Comp(jsonArray.getJSONObject(indexOfComps));
        }

        return  comps;
    }

}
