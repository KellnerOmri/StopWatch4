package com.app.stopwatch4;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Function;

public class StartRaceActivity extends AppCompatActivity
{
    ProgressBar progressBar;
    Spinner spinnerComps;
    private Button btnCreate;
    TextView visableforSpinner;
    EditText edtNameRace;
    public static final String SHARED_PREFS="sharedPrefs";
    public static String NameRace_KEY = "NameRaceKey";
    static String nameOfRACE;
    private Comp[] comps;
    static boolean isSpinnerHappend = false;
    int pos=0;
    static String[] stringsComp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start_race);

        initViews();

   spinnerComps.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
       @Override
       public void onItemSelected(AdapterView<?> adapterView, View view, int position, long id) {

           if (position == 0) {
               edtNameRace.setText("");
               edtNameRace.setHint("Insert race name");
               return;
           }

           progressBar.setVisibility(View.VISIBLE);
           NetworkManager.request4sportHeats(comps[position-1].comp, strings -> {
               progressBar.setVisibility(View.GONE);
               isSpinnerHappend= true;
               stringsComp=strings;
               pos=position-1;
               edtNameRace.setText(comps[pos].description);
               return null;
            });
       }




       @Override
       public void onNothingSelected(AdapterView<?> adapterView) {

       }
   });



        btnCreate.setOnClickListener(v -> {
            int raceId= Integer.parseInt(MyApplication.clientId+""+MyApplication.factory().getRaceId());
           List<Heat> heats = new LinkedList<>();
           double curremtTimeMills = Double.parseDouble(""+System.currentTimeMillis());

            if(edtNameRace.getText().toString().equals(""))
                Toast.makeText(StartRaceActivity.this, "Please Enter Race Name ", Toast.LENGTH_SHORT).show();
                else{
                Intent intent4 = new Intent(StartRaceActivity.this, ZinukPageActivity.class);
                SharedPreferences sharedddPreferences = getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedddPreferences.edit();
                nameOfRACE = edtNameRace.getText().toString();
                Race race = new Race(
                        raceId,
                        MyApplication.clientId,
                        curremtTimeMills,
                        nameOfRACE,
                     0,
                        heats
                );
                Gson gson = new Gson();
                String json = gson.toJson(race);
                NetworkManager.uploadRace(race);
                editor.putString(NameRace_KEY, nameOfRACE);
                editor.apply();
                intent4.putExtra("NameRace", edtNameRace.getText().toString());
                intent4.putExtra("racekey", json);
                startActivity(intent4);
                Toast.makeText(StartRaceActivity.this, "Race- " + edtNameRace.getText().toString() + " created", Toast.LENGTH_SHORT).show();
                finish();
            }
        });

        progressBar.setVisibility(View.VISIBLE);
        NetworkManager.request4sportComps(comps -> {
            progressBar.setVisibility(View.GONE);
            StartRaceActivity.this.comps = comps;
            InsertoSpiner(comps);
            return null;
        });
    }


    private void initViews() {
        btnCreate = findViewById(R.id.btnCreate);
        spinnerComps = findViewById(R.id.spinnerComps);
        edtNameRace = findViewById(R.id.edtNameRace);
        visableforSpinner = findViewById(R.id.visableforSpinner);
        progressBar = findViewById(R.id.progressBar);
        MainActivity.startRaceHappend=1;
        MainActivity.loadRaceHappened=0;
    }

    public void InsertoSpiner(Comp[] comps) {
        if(comps == null)return;
        String[] compNames = Arrays.stream(comps).map(comp -> comp.description).toArray(String[]::new);
        String[] newCompNames = new String[compNames.length + 1];
        newCompNames[0] = "Continue without race";
        System.arraycopy(compNames, 0, newCompNames, 1, compNames.length);

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, R.layout.spinner_item1, newCompNames);
        adapter.setDropDownViewResource(R.layout.drop_down1);
        spinnerComps.setAdapter(adapter);
        spinnerComps.setSelection(0);
    }
}