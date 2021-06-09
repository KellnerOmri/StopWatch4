package com.app.stopwatch4;
import android.util.Log;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;

public class Utils extends ZinukPageActivity {
    public static String intToString(int counter) {
        int hours = counter/3600;
        counter -= hours * 3600;
        int minutes = counter/60;
        counter -= minutes * 60;
        String HH = (hours < 10) ? "0"+hours : ""+hours;
        String MM = (minutes < 10) ? "0"+minutes : ""+minutes;
        String SS = (counter < 10) ? "0"+counter : ""+counter;
        return HH+":"+MM+":"+SS;
    }
    public static int calculate_loadStoperCounter(int position) {
        int counterLoaded=0;
     String CenterClock = getCenterTime;
     String startTimeLoaded;
     if(ImportActivity.importRaceHappened==1)
     {
         startTimeLoaded=ImportActivity.Heats.get(position).startTime;
     }
      else
          startTimeLoaded = getStartTimeLoaded.get(position).toString();
//Center Split
        String[] SplitCenterTime = CenterClock.split(":");//0 for hour,1 for min,2 for sec }
        int[] SplitIntCenterTime = {Integer.parseInt(SplitCenterTime[0]), Integer.parseInt(SplitCenterTime[1]), Integer.parseInt(SplitCenterTime[2])};
//StartTime split
        String[] SplitStartTime = startTimeLoaded.split("[//:.]");//0 for hour,1 for min,2 for sec }
        int[] SplitIntStartTime = {Integer.parseInt(SplitStartTime[0]), Integer.parseInt(SplitStartTime[1]), Integer.parseInt(SplitStartTime[2])};
//TotalDiffTime
        counterLoaded = (SplitIntCenterTime[0]-SplitIntStartTime[0])*3600;//hour
        counterLoaded=counterLoaded+(SplitIntCenterTime[1]-SplitIntStartTime[1])*60;//min
        counterLoaded=counterLoaded+(SplitIntCenterTime[2]-SplitIntStartTime[2]);//sec
        counterLoaded=Math.abs(counterLoaded);
        return counterLoaded;
    }

    static public String dointToString()
    {
        Calendar rightNow = Calendar.getInstance();
        int milisec= (rightNow.get(Calendar.MILLISECOND)/10);
        String MiliSec = Integer.toString(milisec);
        String Hour= (hour < 10) ? "0"+hour : ""+hour;
        String  Min = (min < 10) ? "0"+min : ""+min;
        String  Sec  = (sec < 10) ? "0"+sec : ""+sec;
        MiliSec  = (milisec < 10) ? "0"+milisec : ""+milisec;
        return (""+Hour+":"+Min+":"+Sec+"."+MiliSec);
    }

    private static void addhour()
    {
        hour++;
        if (hour>23)
            hour=0;
    }

    private static void addmin()
    {
        min++;
        if(min>59)
        {
            min=0;
            addhour();
        }
    }

    private static void addsec()
    {
        sec++;
        if(sec>59)
        {
            sec=0;
            addmin();
        }
    }

    static public String DateText(long gapMills) {
        Instant instance = java.time.Instant.ofEpochMilli(gapMills);
        LocalDateTime localDateTime = java.time.LocalDateTime.ofInstant(instance, java.time.ZoneId.of("Asia/Jerusalem"));
        ZonedDateTime zonedDateTime = java.time.ZonedDateTime.ofInstant(instance,java.time.ZoneId.of("Asia/Jerusalem"));
        DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("d/M/y");
        String ans = zonedDateTime.format(formatter);
        return ans;
    }
}
