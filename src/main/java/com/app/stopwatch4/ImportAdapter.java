package com.app.stopwatch4;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class ImportAdapter extends RecyclerView.Adapter<ImportAdapter.Viewholder> {

    private Race[] races;
    public ImportAdapterIterface importAdapterIterface;
    public ImportAdapter(Race[] races, ImportAdapterIterface importAdapterIterface) {
        this.races = races;
        this.importAdapterIterface = importAdapterIterface;
    }

    @NonNull
    @Override
    public Viewholder onCreateViewHolder(@NonNull ViewGroup viewGroup, int viewType) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.import_layout,viewGroup,false);
        return new Viewholder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull Viewholder holder, int position) {
        holder.btnRaceNameForImport.setText(races[position].name);

        long creationTime= (long)races[position].creationTime;
        holder.TextDateView.setText(Utils.DateText(creationTime));
        if(races[position].clientId==MyApplication.clientId)
        {
            holder.textViewOwner.setTextColor(Color.BLUE);
        }
        else
        {
            holder.textViewOwner.setTextColor(Color.WHITE);
        }
    }

    @Override
    public int getItemCount() {
        return races.length;
    }

    public class Viewholder extends RecyclerView.ViewHolder
    {
        TextView TextDateView;
        Button btnRaceNameForImport;
        TextView textViewOwner;
        public Viewholder(@NonNull View view) {
            super(view);
            TextDateView=view.findViewById(R.id.TextDateView);
            textViewOwner = view.findViewById(R.id.textViewOwner);
            btnRaceNameForImport = view.findViewById(R.id.btnRaceNameForImport);
            btnRaceNameForImport.setOnClickListener(view1 -> {
                if(getAdapterPosition() == RecyclerView.NO_POSITION) return;
                importAdapterIterface.BtnClicked(getAdapterPosition());
            });
        }
    }
}

