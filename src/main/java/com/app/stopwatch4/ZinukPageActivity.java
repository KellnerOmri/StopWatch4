package com.app.stopwatch4;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class ZinukPageActivity extends AppCompatActivity implements TimerMannegerInterface, AdapterInterface {
    RecyclerView recyclerView;
    Button btnEdit, btnZinukName,btnPlus;
    ImageButton lockbtn;
    ImageView unlockImageView;
    TextView textRaceView, zinukNameTextView,LockModeTxt;
    static TextView TxtTimeSyned;
    static ArrayList<String> list,getStartTimeLoaded;
    static int hour,min,sec,milisec,lastUpdateLoaded,firstCync=0;
    static  Race race;
    String  NameRace,SignOfLoadDiff,lastNameRace,RaceStringImport;
    int NumOfPotion,hourPersonal,minPersonal,secPersonal,milisecPersonal,syncForResume;
    double DiffInt;
    static int isResume;
    static GradientDrawable bluegrad,graygrad;
    static  DatabaseHelper myDB;
    static List<ZinukModel> modelClassList = new ArrayList<>();
    static String getCenterTime;
    static boolean locked=false;
    SharedPreferences sharedPreferences;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_zinuk_page);
        if(list==null)
        list = new ArrayList<String>();
        getStartTimeLoaded = new ArrayList<String>();
        sharedPreferences = getSharedPreferences(SyncTimeActivity.SHARED_PREFS, MODE_PRIVATE);//getLoad Time
        RaceStringImport = getIntent().getStringExtra("racekey");
        lastUpdateLoaded = 0;
        Gson gson = new Gson();
        race = gson.fromJson(RaceStringImport, Race.class);
        makegradientDrawble();
        if (ImportActivity.importRaceHappened == 1) {
            DiffInt = ImportActivity.GapMills;
        }
        if (MainActivity.loadRaceHappened == 1)//between else
        {
            DiffInt = (double) sharedPreferences.getFloat(SyncTimeActivity.DiffInt, 0);
            Log.d("diffint",""+DiffInt);
        }
        SignOfLoadDiff = sharedPreferences.getString(SyncTimeActivity.Shared_keysign, "nothing");
        lastNameRace = sharedPreferences.getString(StartRaceActivity.NameRace_KEY, "Race");
        if(MainActivity.startRaceHappend==1)////////////////////////////////////////addition for test
        {
           modelClassList = new ArrayList<>();
           myDB = null;
        }
        if (myDB == null)
            myDB = new DatabaseHelper(this);
        initParam();
        if (StartRaceActivity.isSpinnerHappend == true)
        {
            for(int i=0;i<StartRaceActivity.stringsComp.length;i++) {
                ZinukModel zinukModel = new ZinukModel(i, "00:00:00.00", StartRaceActivity.stringsComp[i], 0, 0);
                modelClassList.add(zinukModel);
                list.add(StartRaceActivity.stringsComp[i]);
                setAdapterMetod();

                ZinukNameUpdate.trueorfalse = 0;
                addData(zinukModel);
                Heat heat = ConvertZinukModelTOheat(zinukModel,race.raceId);
                heat.heatId= i;
                race.heats.add(heat);
                NetworkManager.uploadRace(race);
                heat.name=StartRaceActivity.stringsComp[i];
                boolean isupdate = myDB.updateData(race.raceId,heat.heatId,heat.startTime,heat.name,heat.heatStateNum,race.creationTime);
            }
        }
        if (MainActivity.loadRaceHappened == 1 ) {
            textRaceView.setText(lastNameRace);
            modelClassList = myDB.getAllData();
            int raceid = myDB.getRaceId();
            for (; raceid > 99999; raceid = raceid / 10) ;
            List<Heat> heats = new ArrayList<>();
            for (int i = 0; i < modelClassList.size(); i++) {
                list.add(modelClassList.get(i).name);
                getStartTimeLoaded.add(modelClassList.get(i).startTime);
                heats.add(ConvertZinukModelTOheat(modelClassList.get(i), myDB.getRaceId()));
            }
            firstCync++;
            if (raceid != MyApplication.clientId && raceid != 0)// owner
            {
                lockedUplication();
                locked = true;
                lockbtn.setVisibility(View.INVISIBLE);
                btnPlus.setVisibility(View.INVISIBLE);
                unlockImageView.setVisibility(View.INVISIBLE);
            }
           else//yes owner
            {
            race = new Race(myDB.getRaceId(), MyApplication.clientId, myDB.getCreationTime(), lastNameRace, DiffInt, heats);
            }
        } else {
           if(StartRaceActivity.isSpinnerHappend==false) {
                myDB.DeleteDateBase(DatabaseHelper.Race_Table);
           }
            StartRaceActivity.isSpinnerHappend = false;
            if (ImportActivity.importRaceHappened == 1) {
                myDB = new DatabaseHelper(this);
                modelClassList = myDB.getAllDataImport();
                for (int i = 0; i < modelClassList.size(); i++) {
                    myDB.insertData(race.raceId, modelClassList.get(i).heatId, modelClassList.get(i).startTime, modelClassList.get(i).name, modelClassList.get(i).state, modelClassList.get(i).creationTime);
                }
                if (ImportActivity.ClientId != MyApplication.clientId) {
                    lockedUplication();
                    locked = true;
                    lockbtn.setVisibility(View.INVISIBLE);
                    btnPlus.setVisibility(View.INVISIBLE);
                    unlockImageView.setVisibility(View.INVISIBLE);
                }
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString(StartRaceActivity.NameRace_KEY, ImportActivity.Name);
                editor.putFloat(SyncTimeActivity.DiffInt,(float) DiffInt);
                editor.apply();
            }
        }
        if (MainActivity.startRaceHappend == 1) {
            DiffInt = 0;
            SyncTimeActivity.diffInt=0;
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString(StartRaceActivity.NameRace_KEY,lastNameRace);
            editor.putFloat(SyncTimeActivity.DiffInt,(float) DiffInt);
            editor.apply();
        }
        setAdapterMetod();
        TimerManneger.instance.delegate = this;

        if (NameRace != null)
            textRaceView.setText(getIntent().getStringExtra("NameRace"));
        RightNow();
        if (MainActivity.loadRaceHappened == 1) {
            RightNow();
            calculateTimeDiffStringToInt();
        }
        if( ImportActivity.importRaceHappened==1   )
        {
        if(ImportActivity.ClientId != MyApplication.clientId) {
            lockedUplication();
            lockbtn.setVisibility(View.INVISIBLE);
            btnPlus.setVisibility(View.INVISIBLE);
            unlockImageView.setVisibility(View.INVISIBLE);
            //TxtTimeSyned.setVisibility(View.INVISIBLE);
            btnEdit.setVisibility(View.INVISIBLE);
            btnZinukName.setVisibility(View.INVISIBLE);
        }
        else
        {
            unlockAplication();
        }
            textRaceView.setText(ImportActivity.Name);
            calculateTimeDiffStringToInt();
            modelClassList = myDB.getAllDataImport();
            firstCync=1;
            setAdapterMetod();
        }
        TxtTimeSyned.setText(intToString2(hour, min, sec));
        tick();
        lockbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(locked==false)
                {
                    lockedUplication();
                    locked=true;
                }
                else {
                    unlockAplication();
            }
            }
        });

        btnPlus.setOnClickListener(new View.OnClickListener() {
            //0 restart
            // ,1 start,
            // 2 stop
            @Override
            public void onClick(View view) {
                if (modelClassList.size()!=0)
                    NumOfPotion=modelClassList.size();
                NumOfPotion++;
                ZinukModel zinukModel = new ZinukModel(NumOfPotion, "00:00:00.00", "zinuk", 0, 0);
                modelClassList.add(zinukModel);
                setAdapterMetod();
                if (ZinukNameUpdate.trueorfalse == 1) {
                    list.add("Zinuk" + NumOfPotion);
                }
                ZinukNameUpdate.trueorfalse = 0;
                addData(zinukModel);
                Heat heat = ConvertZinukModelTOheat(zinukModel,race.raceId);
                heat.heatId= NumOfPotion;
                race.heats.add(heat);
                NetworkManager.uploadRace(race);
                boolean isupdate = myDB.updateData(race.raceId,heat.heatId,heat.startTime,heat.name,heat.heatStateNum,race.creationTime);
            }
        });

        btnEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ZinukPageActivity.this, SyncTimeActivity.class);
                startActivityForResult(intent, 1);
            }
        });

        btnZinukName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(modelClassList.size()!=0)
                {
                    NumOfPotion=modelClassList.size();
                }
                if (NumOfPotion == 0)
                {
                    Toast.makeText(ZinukPageActivity.this, "Please Add Zinuk Before Clicking On Zinuk Names left button--------------------->", Toast.LENGTH_SHORT).show();
                }
                else {
                    Intent intent3 = new Intent(ZinukPageActivity.this, ZinukNameUpdate.class);
                    intent3.putExtra("NumOfPotion", NumOfPotion);
                    startActivityForResult(intent3, 1);
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        isResume=1;

        if (syncForResume==1)
        {
            syncForResume=0;
        }
        else
        {
            String[] tempCenterTime = calculateStartTimeByRightNowANDGapMills().split("\\.");
            getCenterTime = tempCenterTime[0];
        }
        TxtTimeSyned.setText(getCenterTime);
        String[] tempCenterTimeByInt = getCenterTime.split(":");
        hour= Integer.parseInt(tempCenterTimeByInt[0]);
        min= Integer.parseInt(tempCenterTimeByInt[1]);
        sec = Integer.parseInt(tempCenterTimeByInt[2]);
    }

    public String calculateStartTimeByRightNowANDGapMills()
    {
        RightNowPersonalTime();
        int ChangeSign=0;

        if (MainActivity.loadRaceHappened == 1)
        {
            race.gapMills=DiffInt;
        }
        if(race.gapMills <0) {
            ChangeSign=1;
        }
        double mills;
        double millse;
        double counterCurentTime = Math.abs(race.gapMills);
        double counterSyncTime = createCounterOfTime(hourPersonal,minPersonal,secPersonal,milisecPersonal);
        if(ChangeSign==1) {
            millse = Math.abs(counterSyncTime-counterCurentTime);
            mills = Math.abs(millse);
        }
        else
        {
            millse = Math.abs(counterCurentTime+counterSyncTime);
            mills = Math.abs(millse);
        }
        int Hours = (int) (mills / 3600000);
        mills=mills-Hours*3600000;
        int Mins = (int) (mills / 60000);
        mills=mills-Mins*60000;
        int Secs = (int)mills/1000;
        mills=mills-Secs*1000;
        int milisecc=(int)mills;
        hourPersonal = Hours;
        if(MainActivity.loadRaceHappened==1||ImportActivity.importRaceHappened==1) {//setEditTime
            if(hourPersonal>23)
                hourPersonal=hourPersonal-24;
        }
        minPersonal = Mins;
        secPersonal = Secs;
        milisecPersonal=milisecc/10;
       return intToStringForPersonalStartTime(hourPersonal, minPersonal, secPersonal,milisecPersonal);
    }


    private void RightNowPersonalTime() {
        Calendar right_Now = Calendar.getInstance();
        hourPersonal = right_Now.get(Calendar.HOUR_OF_DAY);//+3 for debug in computer
        if(hourPersonal>23)
            hourPersonal=hourPersonal-24;
        minPersonal = right_Now.get(Calendar.MINUTE);
        secPersonal  = right_Now.get(Calendar.SECOND);
        milisecPersonal = right_Now.get(Calendar.MILLISECOND);
    }

    public void lockedUplication() {
        unlockImageView.setVisibility(View.VISIBLE);
        lockbtn.setColorFilter(-102);
        btnEdit.setEnabled(false);
        btnEdit.setBackground(graygrad);
        btnZinukName.setBackground(graygrad);
        btnZinukName.setEnabled(false);
        btnPlus.setBackground(graygrad);
        btnPlus.setEnabled(false);
        textRaceView.setBackground(graygrad);
        LockModeTxt.setTextColor(Color.GRAY);
        LockModeTxt.setVisibility(View.VISIBLE);
    }

    private void unlockAplication() {
        locked = false;
        unlockImageView.setVisibility(View.INVISIBLE);
        lockbtn.setColorFilter(getResources().getColor(R.color.blue));
        btnEdit.setEnabled(true);
        btnEdit.setBackground(bluegrad);
        btnZinukName.setEnabled(true);
        btnZinukName.setBackground(bluegrad);
        btnPlus.setEnabled(true);
        btnPlus.setBackground(bluegrad);
        textRaceView.setBackground(bluegrad);
        LockModeTxt.setVisibility(View.INVISIBLE);
    }

    private void initParam() {
        recyclerView = findViewById(R.id.recyclerView);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        layoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);
        textRaceView = findViewById(R.id.textRaceView);
        LockModeTxt = findViewById(R.id.LockModeTxt);
        TxtTimeSyned = findViewById(R.id.TxtTimeSyned);
        zinukNameTextView = findViewById(R.id.zinukNameTextView);
        NameRace = getIntent().getStringExtra("NameRace");
        btnPlus = findViewById(R.id.btnPlus);
        lockbtn = findViewById(R.id.lockbtn);
        unlockImageView = findViewById(R.id.unlockImageView);
        btnEdit = findViewById(R.id.btnEdit);
        btnZinukName = findViewById(R.id.btnZinukName);
        lockbtn.setBackground(null);
    }

    private void makegradientDrawble()
    {
        bluegrad = new GradientDrawable();
        bluegrad.setShape(GradientDrawable.RECTANGLE);
        bluegrad.setCornerRadius(120);
        bluegrad.setColor(getResources().getColor(R.color.blue));
        graygrad = new GradientDrawable();
        graygrad.setShape(GradientDrawable.RECTANGLE);
        graygrad.setCornerRadius(120);
        graygrad.setColor(Color.GRAY);
    }


    public Heat ConvertZinukModelTOheat(ZinukModel zinukModel,int raceid) {
        Heat heat= new Heat(raceid,zinukModel.heatId,zinukModel.startTime,zinukModel.name,zinukModel.state,zinukModel.creationTime );
        return heat;
    }

    private void RightNow() {
        Calendar right_Now = Calendar.getInstance();
        hour = right_Now.get(Calendar.HOUR_OF_DAY);//+3 for debug in computer
        if(hour>23)
            hour=hour-24;
        min = right_Now.get(Calendar.MINUTE);
        sec  = right_Now.get(Calendar.SECOND);
        milisec = right_Now.get(Calendar.MILLISECOND);
    }

    private void calculateTimeDiffStringToInt() {
        int ChangeSign=0;
        if(DiffInt <0) {
            ChangeSign=1;
        }
        double mills;
        double millse;
            double counterCurentTime = Math.abs(DiffInt);
            double counterSyncTime = createCounterOfTime(hour,min,sec,milisec);
            if(ChangeSign==1) {
                millse = Math.abs(counterSyncTime-counterCurentTime);
                mills = Math.abs(millse);
            }
            else
            {
                millse = Math.abs(counterCurentTime+counterSyncTime);
                mills = Math.abs(millse);
            }
            int Hours = (int) (mills / 3600000);
            mills=mills-Hours*3600000;
            int Mins = (int) (mills / 60000);
            mills=mills-Mins*60000;
            int Secs = (int)mills/1000;
            mills=mills-Secs*1000;
            int milisecc=(int)mills;
            hour = Hours;
            if(MainActivity.loadRaceHappened==1||ImportActivity.importRaceHappened==1) {//setEditTime
                if(hour>23)
                    hour=hour-24;
            }
            min = Mins;
            sec = Secs;
            milisec=milisecc;
        }


    public double createCounterOfTime(int hh,int mm,int ss,int ms)
    {
        return hh*3600000+mm*60000+ss*1000+ms;
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (ZinukNameUpdate.trueorfalse==1) {
            list = data.getStringArrayListExtra("ZinukList");

        }
        if(SyncTimeActivity.isSync==0) {
            for (int j = 0; j < NumOfPotion; j++)
            {
                modelClassList.get(j).name = list.get(j);
                Heat heat2 = new Heat(race.raceId, j, modelClassList.get(j).startTime, modelClassList.get(j).name, modelClassList.get(j).state, modelClassList.get(j).creationTime);
                    race.heats.set(j, heat2);
            }

            NetworkManager.uploadRace(race);
        }
       if (ZinukNameUpdate.trueorfalse == 0) {
            hour = data.getIntExtra("TimeSYNChour", 0);
            min = data.getIntExtra("TimeSYNCmin", 0);
            sec = data.getIntExtra("TimeSYNCsec", 0);
        }
       if (SyncTimeActivity.isSync==1)
       {
           hour = data.getIntExtra("TimeSYNChour", 0);
           min = data.getIntExtra("TimeSYNCmin", 0);
           sec = data.getIntExtra("TimeSYNCsec", 0);
           getCenterTime = intToString2(hour,min,sec);
           syncForResume=1;
       }
        SyncTimeActivity.isSync=0;
        if(ImportActivity.importRaceHappened==1) {
            race.gapMills = SyncTimeActivity.diffInt;
            NetworkManager.uploadRace(race);
            DiffInt=SyncTimeActivity.diffInt;
        }
    }

    public void tick() {
        for (ZinukModel zinukModel : modelClassList) {
            zinukModel.updateTime();
        }
        recyclerView.getAdapter().notifyDataSetChanged();
        TxtTimeSyned.setText(intToString2(hour, min, sec));
        if(MainActivity.loadRaceHappened==1&& firstCync==1|| ImportActivity.importRaceHappened==1&& firstCync==1) {
            firstCync++;
            getCenterTime = calculateStartTimeByRightNowANDGapMills();//TxtTimeSyned.getText().toString();
        }
    }
    private String intToStringForPersonalStartTime(int hour, int min, int sec,int milisec)
    {
        String Hour = (hour < 10) ? "0" + hour : "" + hour;
        String Min = (min < 10) ? "0" + min : "" + min;
        String Sec = (sec < 10) ? "0" + sec : "" + sec;
        String MiliSec  = (milisec < 10) ? "0"+milisec : ""+milisec;
        return ("" + Hour + ":" + Min + ":" + Sec + "." + MiliSec );
    }


    private String intToString2(int hour, int min, int sec)
    {
        addsec();
        String Hour = (hour < 10) ? "0" + hour : "" + hour;
        String Min = (min < 10) ? "0" + min : "" + min;
        String Sec = (sec < 10) ? "0" + sec : "" + sec;
        return ("" + Hour + ":" + Min + ":" + Sec);
    }

    private void addhour() {
        hour++;
        if (hour > 23)
            hour = 0;
    }
    private void addmin() {
        min++;
        if (min > 59) {
            min = 0;
            addhour();
        }
    }
    private void addsec() {
        sec++;
        if (sec > 59) {
            sec = 0;
            addmin();
        }
    }

    @Override
    //0 restart
    // ,1 start,
    // 2 stop
    public void StartBtnClicked(int position) {
        ZinukModel zinukModel = modelClassList.get(position);
        zinukModel.toggleState();
        switch (zinukModel.state) {
            case 2:
                break;
            case 1:
                final MediaPlayer mp=MediaPlayer.create(this,R.raw.gunshut);
                mp.start();
                if (SyncTimeActivity.diffInt != 0.0 && SyncTimeActivity.diffInt != DiffInt)
                {
                    DiffInt =SyncTimeActivity.diffInt;
                }
                zinukModel.startTime =  calculateStartTimeByRightNowANDGapMills();
                break;
            case 0:
                zinukModel.counter = 0;
                zinukModel.startTime = "00:00:00.00";
                break;
        }
         race.heats.get(position).startTime=zinukModel.startTime;
        race.heats.get(position).heatStateNum=zinukModel.state;
        recyclerView.getAdapter().notifyDataSetChanged();
        updateData(position);
        NetworkManager.uploadRace(race);
    }

    @Override
    public void ShareBTNimage(int position) {
        Intent sendIntent = new Intent();
        PackageManager pm = ZinukPageActivity.this.getPackageManager();
        try {
       sendIntent.setAction(Intent.ACTION_SEND);
        PackageInfo info = pm.getPackageInfo("com.whatsapp", PackageManager.GET_META_DATA);
        sendIntent.setPackage("com.whatsapp");
        sendIntent.putExtra(Intent.EXTRA_TEXT, race.heats.get(position).name +" "+ race.heats.get(position).startTime);
        sendIntent.setType("text/plain");
        startActivity(Intent.createChooser(sendIntent, "Share with"));
        }
        catch (PackageManager.NameNotFoundException e) {
            Toast.makeText(ZinukPageActivity.this, "WhatsApp not Installed", Toast.LENGTH_SHORT)
                    .show();
            Intent sendNoWatSup = new Intent();
            sendNoWatSup.setAction(Intent.ACTION_SEND);
            sendNoWatSup.putExtra(Intent.EXTRA_TEXT, modelClassList.get(position).name +" "+ modelClassList.get(position).startTime);
            sendNoWatSup.setType("text/plain");
            startActivity(sendNoWatSup);
        }
    }

    private void setAdapterMetod() {
        Adapter adapter = new Adapter(modelClassList, ZinukPageActivity.this);
        recyclerView.setAdapter(adapter);
    }

    int stateOfLine;//use for addData & update
    private void addData(ZinukModel zinukModel) {
        if(race.gapMills!=0)
        {
            zinukModel.creationTime=race.gapMills;
        }
        myDB.insertData(race.raceId, zinukModel.heatId, zinukModel.startTime, zinukModel.name, 0,
                    zinukModel.creationTime);
        }

    public void updateData(int Currectheatid )
    {
        if (modelClassList.get(Currectheatid).state == 1) {
            stateOfLine = 1;//start
        } else if (modelClassList.get(Currectheatid).state == 0) {
            stateOfLine = 0;//restart
        } else {
            stateOfLine = 2;//stop
        }
         boolean isupdate = myDB.updateData(race.raceId,modelClassList.get(Currectheatid).heatId,modelClassList.get(Currectheatid).startTime,modelClassList.get(Currectheatid).name,modelClassList.get(Currectheatid).state,modelClassList.get(Currectheatid).creationTime);
    }

}