package com.app.stopwatch4;

import android.os.CountDownTimer;

public class TimerManneger {
    CountDownTimer clock;
    TimerMannegerInterface delegate;
    static TimerManneger instance = new TimerManneger();

    private TimerManneger()  {

        clock = new CountDownTimer(2000000,1000) {
            @Override
            public void onTick(long l) {
                delegate.tick();
            }

            @Override
            public void onFinish() {
                delegate.tick();
            }
        };

        clock.start();
    }
}

