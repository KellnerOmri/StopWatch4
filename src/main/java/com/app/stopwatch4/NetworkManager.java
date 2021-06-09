package com.app.stopwatch4;
import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class NetworkManager {

    private static RequestQueue queue = Volley.newRequestQueue(MyApplication.factory().getAppContext());

    public static void requestComps(final Function<Race[], Void> delegateFunction) {
        String serviceUrl = "https://www.4sport-live.com/stopwatch4/getRaces/";
        doRequest(serviceUrl, Request.Method.GET, null, null, response -> {
            try {
                JSONArray jsonArray = new JSONArray(response);
                Race[] races = Race.initFromJsArray(jsonArray);
                delegateFunction.apply(races);
            } catch (JSONException e) {
                delegateFunction.apply(null);
                e.printStackTrace();
            }
            return null;
        });
    }

    public static void request4sportComps(final Function<Comp[], Void> delegateFunction) {
        String serviceUrl = "https://www.4sport-live.com/stopwatch4/get4sportComps/";
        doRequest(serviceUrl, Request.Method.GET, null, null, response -> {
            try {
                JSONArray jsonArray = new JSONArray(response);
                Comp[] comps = Comp.initFromJsArray(jsonArray);
                delegateFunction.apply(comps);
            } catch (JSONException e) {
                delegateFunction.apply(null);
                e.printStackTrace();
            }
            return null;
        });
    }

    public static void request4sportHeats(int comp, final Function<String[], Void> delegateFunction) {
        String serviceUrl = "https://www.4sport-live.com/stopwatch4/get4sportRolls/?comp="+comp;
        doRequest(serviceUrl, Request.Method.GET, null, null, response -> {
            try {
                JSONArray jsonArray = new JSONArray(response);
                String[] heatNames = new String[jsonArray.length()];
                for(int i=0;i<jsonArray.length();i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    heatNames[i] = jsonObject.getString("description");
                }
                delegateFunction.apply(heatNames);
            } catch (JSONException e) {
                delegateFunction.apply(null);
                e.printStackTrace();
            }
            return null;
        });
    }


    public static void uploadRace(Race race) {
        for (Heat heat: race.heats) {
            heat.setRaceId(race.raceId);
        }
        if(ImportActivity.importRaceHappened!=1)
        race.gapMills=SyncTimeActivity.diffInt;

        String serviceUrl =  "https://www.4sport-live.com/stopwatch4/uploadRace/";
        Gson gson = new Gson();
        String json = gson.toJson(race);

        Map<String, String> params = new HashMap<>();
        params.put("data",json);
        doRequest(serviceUrl, Request.Method.POST, params, null, response -> null);
    }
    public static void requestClientId(final Function<Integer, Void> delegateFunction) {
        String serviceUrl = "https://www.4sport-live.com/stopwatch4/getClientID/";
        doRequest(serviceUrl, Request.Method.GET, null, null, response -> {
            try {
                JSONObject jsonObject = new JSONObject(response);
                 int clientId = jsonObject.getInt("clientId");
                delegateFunction.apply(clientId);
            } catch (JSONException e) {
                delegateFunction.apply(null);
                e.printStackTrace();
            }
            return null;
        });
    }

    private static void  doRequest(String url, int method, Map<String, String> params, Map<String, String> headers, final Function<String, Void> function) {
        StringRequest stringRequest = new StringRequest(method, url, function::apply, error -> {
            function.apply(error.getMessage());
        }){
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                if(params == null) {
                    return super.getParams();
                }
                return params;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                if(headers == null) {
                    return super.getHeaders();
                }
                return headers;
            }
        };

        stringRequest.setRetryPolicy(new DefaultRetryPolicy(
                DefaultRetryPolicy.DEFAULT_TIMEOUT_MS,
                0,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        queue.add(stringRequest);
    }
}
