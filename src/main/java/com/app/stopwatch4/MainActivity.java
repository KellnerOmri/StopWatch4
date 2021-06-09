package com.app.stopwatch4;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity
{
    static int loadRaceHappened;
    static int startRaceHappend;
    private Button btnStartRace,btnLoadRace,btnImportRace;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initViews( );

        btnStartRace.setOnClickListener(new View.OnClickListener()   {
            @Override
            public void onClick(View v) {
                startRaceHappend=1;
                loadRaceHappened=0;
                Intent intent1 = new Intent(MainActivity.this,StartRaceActivity.class);
                startActivity(intent1);
            }
        });

        btnLoadRace.setOnClickListener(new View.OnClickListener()   {
            @Override
            public void onClick(View v) {
                loadRaceHappened=1;
                startRaceHappend=0;
                ImportActivity.importRaceHappened=0;
                Intent intent2 = new Intent(MainActivity.this,ZinukPageActivity.class);
                startActivity(intent2);
                            }
        });

        btnImportRace.setOnClickListener(new View.OnClickListener()   {
            @Override
            public void onClick(View v) {
                loadRaceHappened=0;
                startRaceHappend=0;
                Intent intent3 = new Intent(MainActivity.this, ImportActivity.class);
                startActivity(intent3);
            }
        });
    }

    private void initViews() {
        btnStartRace = findViewById(R.id.btnStartRace);
        btnLoadRace = findViewById(R.id.btnLoadRace);
        btnImportRace = findViewById(R.id.btnImportRace);
    }
}