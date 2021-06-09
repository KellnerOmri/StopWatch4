package com.app.stopwatch4;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.NumberPicker;
import android.widget.TextView;
import java.util.Calendar;

public class SyncTimeActivity extends AppCompatActivity implements View.OnClickListener {
    Button  btnSetTime;
    NumberPicker hourPicker,minPicker,secPicker;
    TextView txtHour,txtMin,txtSec,textViewCancle;
    int hour,min,sec,currentHour,currentMin,currentSec,currentMilliSec;
    public static double diffInt;
    String pickerTime,negativediff="+";
    public static final String SHARED_PREFS="sharedPrefs";
    public static String DiffInt = "Intdifference";
    public static String Shared_keysign="negativeDiff";
    static int isSync;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sync_time);
        initViewsZinuk();
        setTimePicker();
        btnSetTime.setOnClickListener(this);
        textViewCancle.setOnClickListener(this);
        OnBackPressedCallback callback=new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Intent intent9 = new Intent();
                intent9.putExtra("TimeSYNChour", ZinukPageActivity.hour);
                intent9.putExtra("TimeSYNCmin", ZinukPageActivity.min);
                intent9.putExtra("TimeSYNCsec", ZinukPageActivity.sec);
                ZinukPageActivity.TxtTimeSyned.setText(intToString2(hour, min, sec));
                setResult(1, intent9);
                isSync = 1;
                ZinukNameUpdate.trueorfalse = 0;
                setResult(9,intent9);
                finish();
            }
        };
        this.getOnBackPressedDispatcher().addCallback(this, callback);
        GetRightNow();
        hour=currentHour;
        min=currentMin;
        makePickerTime();
    }

    private void makePickerTime() {
        String HH = (hour < 10) ? "0" + hour : "" + hour;
        String MM = (min < 10) ? "0" + min : "" + min;
        String SS = (sec < 10) ? "0" + sec : "" + sec;
        pickerTime=("" + HH + ":" + MM + ":" + SS );
        hourPicker.setValue(hour);
        minPicker.setValue(min);
        secPicker.setValue(sec);
    }

    private void setTimePicker() {
        hourPicker.setMaxValue(23);
        hourPicker.setMinValue(0);
        minPicker.setMaxValue(59);
        minPicker.setMinValue(0);
        secPicker.setMaxValue(59);
        secPicker.setMinValue(0);
    }

    private void initViewsZinuk() {
        txtHour = findViewById(R.id.txtHour);
        txtMin = findViewById(R.id.txtMin);
        txtSec = findViewById(R.id.txtSec);
        btnSetTime = findViewById(R.id.btnSetTime);
        textViewCancle=findViewById(R.id.textViewCancle);
        hourPicker=findViewById(R.id.hourPicker);
        minPicker=findViewById(R.id.minPicker);
        secPicker=findViewById(R.id.secPicker);

    }

    public void onClick(View v) {
        switch (v.getId()) {

            case R.id.textViewCancle:
                Intent intent9 = new Intent();
                intent9.putExtra("TimeSYNChour", ZinukPageActivity.hour);
                intent9.putExtra("TimeSYNCmin", ZinukPageActivity.min);
                intent9.putExtra("TimeSYNCsec", ZinukPageActivity.sec);
                ZinukPageActivity.TxtTimeSyned.setText(intToString2(hour, min, sec));
                setResult(1, intent9);
                isSync = 1;
                ZinukNameUpdate.trueorfalse = 0;
                setResult(9,intent9);
                finish();
                break;

            case R.id.btnSetTime:

                hour=hourPicker.getValue();
                min=minPicker.getValue();
                sec=secPicker.getValue();
                Intent intent = new Intent();
                intent.putExtra("TimeSYNC", pickerTime);
                intent.putExtra("TimeSYNChour", hourPicker.getValue());
                intent.putExtra("TimeSYNCmin", minPicker.getValue());
                intent.putExtra("TimeSYNCsec", secPicker.getValue());
                ZinukPageActivity.TxtTimeSyned.setText(intToString2(hour, min, sec));
                setResult(1, intent);
                doWork();
                isSync=1;
                ZinukNameUpdate.trueorfalse=0;
                finish();
                break;
        }
    }


private String intToString2(int hour, int min, int sec) {
        String Hour = (hour < 10) ? "0" + hour : "" + hour;
        String Min = (min < 10) ? "0" + min : "" + min;
        String Sec = (sec < 10) ? "0" + sec : "" + sec;
        return ("" + Hour + ":" + Min + ":" + Sec);
    }


    public void doWork()
    {
        runOnUiThread(new Runnable()
        {
            public void run()
            {
                GetRightNow();
                int counterCurentTime=0;
                counterCurentTime = createCounterOfTime(currentHour, currentMin, currentSec,currentMilliSec);
                int counterSyncTime = createCounterOfTime(hourPicker.getValue(),minPicker.getValue(),secPicker.getValue(),0);
                int diffCounter = Math.abs(counterCurentTime-counterSyncTime);
                if(counterCurentTime-counterSyncTime<0) {
                    negativediff = "-";
                    diffInt = (double)diffCounter;
                }
                else
                {
                    diffInt = (double)diffCounter*(-1);
                }
                saveData();
                NetworkManager.uploadRace(ZinukPageActivity.race);
            }
        });
    }

    public void GetRightNow()
        {
            Calendar rightNow = Calendar.getInstance();
            currentHour = rightNow.get(Calendar.HOUR_OF_DAY);
            currentMin = rightNow.get(Calendar.MINUTE);
            currentSec = rightNow.get(Calendar.SECOND);
            currentMilliSec = rightNow.get(Calendar.MILLISECOND);
        }
    public int createCounterOfTime(int hh,int mm,int ss,int ms)
    {
        return (ss+mm*60+hh*3600)*1000+ms;
    }

    public void saveData()
    {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFS,MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(Shared_keysign,negativediff);
        editor.putFloat(DiffInt,(float)diffInt);
        editor.apply();
    }
}
