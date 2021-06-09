package com.app.stopwatch4;

public class ZinukModel {
    int counter;
    int heatId;
    String startTime;
    String name;
    double creationTime;
    int state = 0;//0 restart,1 start,2 stop

    public ZinukModel(int heatId, String startTime, String name, double creationTime, int state) {
        this.heatId = heatId;
        this.startTime = startTime;
        this.name = name;
        this.creationTime = creationTime;
        this.state = state;
    }

    //0 restart
    // ,1 start,
    // 2 stop
    public void toggleState() {
        if(ImportActivity.importRaceHappened!=1 ||ImportActivity.ClientId == MyApplication.clientId)
        {
        switch (state) {
            case 1://0
                state = 2;
                break;
            case 2://1
                state = 0;
                break;
            case 0://2
                state = 1;
                break;
        }
        }
    }

    public void updateTime() {
        if (state != 1) return;
        counter++;

    }
}




