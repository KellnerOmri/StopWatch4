package com.app.stopwatch4;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;

import com.google.gson.Gson;

import java.util.List;

public class ImportActivity extends AppCompatActivity implements  ImportAdapterIterface {
    Race[] races;

    RecyclerView recyclerView;
    ProgressBar progressBar;
    static int importRaceHappened = 0;
  //  static int RaceId;
    static int ClientId;
   // static double CreationTime;
    static   String Name;
    static  double GapMills;
    static List<Heat> Heats;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_import_race);
        importRaceHappened = 0;
        recyclerView = findViewById(R.id.recyclerView);
        progressBar = findViewById(R.id.progressBar);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        layoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);
        requestComps();
    }

    private void requestComps() {
        progressBar.setVisibility(View.VISIBLE);
        NetworkManager.requestComps(races -> {
            progressBar.setVisibility(View.GONE);
            if(races == null)return null; // todo display network error message to the user
            this.races = races;
            setAdapter();
            return null;
        });
    }

    private void setAdapter() {
        ImportAdapter adapter = new ImportAdapter(races, ImportActivity.this);
        recyclerView.setAdapter(adapter);
    }

    @Override
    public void BtnClicked(int pos) {
        MainActivity.loadRaceHappened=0;
        MainActivity.startRaceHappend=0;
        Race selectedRace = races[pos];
        //todo request the comp data from server
         importRaceHappened=0;
         ClientId=selectedRace.clientId;
         Name=selectedRace.name;
         GapMills=selectedRace.gapMills;
         Heats=selectedRace.heats;
         importRaceHappened=1;
        Intent intent = new Intent(ImportActivity.this, ZinukPageActivity.class);
        Gson gson = new Gson();
        String raceStr = gson.toJson(selectedRace);
        intent.putExtra("racekey", raceStr);
        startActivity(intent);
        finish();
    }
}