package com.app.stopwatch4;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import java.util.List;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class Adapter extends RecyclerView.Adapter<Adapter.Viewholder> {

    private List<ZinukModel> zinukModels;
    public AdapterInterface adapterInterface;
    public Adapter(List<ZinukModel> zinukModels,AdapterInterface adapterInterface) {
        this.zinukModels = zinukModels;
        this.adapterInterface = adapterInterface;
    }
    @NonNull
    @Override
    public Viewholder onCreateViewHolder(@NonNull ViewGroup viewGroup, int viewType) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_layout,viewGroup,false);
        return new Viewholder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull Viewholder viewholder, int position) {
        ZinukModel zinukModel = zinukModels.get(position);
        viewholder.NumZinuk.setText(""+(position+1));
        viewholder.startTimeTextView.setText(zinukModel.startTime);

        if (MainActivity.loadRaceHappened==1 && ZinukPageActivity.lastUpdateLoaded < zinukModels.size()||ImportActivity.importRaceHappened==1 && ZinukPageActivity.lastUpdateLoaded < zinukModels.size() || ZinukPageActivity.isResume==1 && MainActivity.startRaceHappend!=1) {

            //0 restart
            // ,1 start,
            // 2 stop

            switch (zinukModel.state)
            {
                case 0://restart
                {
                    break;
                }
                case 1://start
                {
                    zinukModel.counter = Utils.calculate_loadStoperCounter(position);
                    ZinukPageActivity.isResume=0;
                    break;
                }
                case 2 ://stop
                {
                    zinukModel.counter = 0;
                    break;
                }
            }
            ZinukPageActivity.lastUpdateLoaded++;
        }
        else {
            viewholder.stoperTextView.setText(Utils.intToString(zinukModel.counter));
        }
        try {
            viewholder.zinukNameTextView.setText((String) ZinukPageActivity.list.get(position));
            ZinukNameUpdate.trueorfalse=1;
        }
        catch (Exception e)
        {
            viewholder.zinukNameTextView.setText(ZinukPageActivity.modelClassList.get(position).name);
        }

        //0 restart
        // ,1 start,
        // 2 stop
        if(ImportActivity.importRaceHappened==1 && ImportActivity.ClientId != MyApplication.clientId) {
            ZinukPageActivity.locked=true;
        }
        if(ZinukPageActivity.locked==true) {
            viewholder.startTimeTextView.setBackground(ZinukPageActivity.graygrad);
            viewholder.stoperTextView.setBackground(ZinukPageActivity.graygrad);
        }
        else
        {
            viewholder.startTimeTextView.setBackground(ZinukPageActivity.bluegrad);
            viewholder.stoperTextView.setBackground(ZinukPageActivity.bluegrad);
        }
        switch (zinukModel.state)
        {

            case 0://restart
            {
                if(ZinukPageActivity.locked==true)
                {
                    viewholder.btnStat.setBackgroundColor(Color.GRAY);
                    viewholder.btnStat.setEnabled(false);
                    viewholder.btnStat.setText("Start");
                    break;
                }
                viewholder.btnStat.setEnabled(true);
                viewholder.btnStat.setText("Start");
                viewholder.btnStat.setBackgroundColor(Color.BLUE);
                break;
            }
            case 1://start
                {
                    if(ZinukPageActivity.locked==true)
                    {
                        viewholder.btnStat.setBackgroundColor(Color.GRAY);
                        viewholder.btnStat.setEnabled(false);
                        viewholder.btnStat.setText("Stop");
                        break;
                    }
                    viewholder.btnStat.setEnabled(true);
                    viewholder.btnStat.setText("Stop");
                    viewholder.btnStat.setBackgroundColor(Color.RED);
                break;
            }
            case 2 ://stop
            {
                if(ZinukPageActivity.locked==true)
                {
                    viewholder.btnStat.setBackgroundColor(Color.GRAY);
                    viewholder.btnStat.setEnabled(false);
                    viewholder.btnStat.setText("Reset");
                    break;
                }
                viewholder.btnStat.setEnabled(true);
                viewholder.btnStat.setText("Reset");
                viewholder.btnStat.setBackgroundColor(Color.GREEN);
                break;
            }
        }
    }

    @Override
    public int getItemCount() {
        return zinukModels.size();
    }

    class Viewholder extends RecyclerView.ViewHolder {
        TextView zinukNameTextView,startTimeTextView,NumZinuk,stoperTextView;
        Button btnStat;
        ImageButton imBtnSharetxt;

        public Viewholder(View view) {
            super(view);
            stoperTextView = view.findViewById(R.id.stoperTextView);
            zinukNameTextView = view.findViewById(R.id.zinukNameTextView);
            startTimeTextView = view.findViewById(R.id.startTimeTextView);
            NumZinuk = view.findViewById(R.id.txtNumZinuk);
            imBtnSharetxt= view.findViewById(R.id.imBtnSharetxt);
            btnStat = view.findViewById(R.id.btnStat);
            imBtnSharetxt.setBackground(null);
            btnStat.setOnClickListener(view12 -> {
                int position = getAdapterPosition();
                if(position == RecyclerView.NO_POSITION) return; // may occure when the selected row is not shown on screen
                adapterInterface.StartBtnClicked(getAdapterPosition());
            });

            imBtnSharetxt.setOnClickListener(view1 -> {
                int pos = getAdapterPosition();
                if(pos == RecyclerView.NO_POSITION) return;
                adapterInterface.ShareBTNimage(getAdapterPosition());
            });
        }
    }
}

