package com.app.stopwatch4;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.List;

public class ZinukNameUpdate extends AppCompatActivity {
    RecyclerView RVnamelList;
   List<DataAdapter> dataAdapters;
    ArrayList<String> newAdapterList;
    Button btnDone;
    int numOfLine;
    static int trueorfalse;
    DataAdapter ListnameAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_zinuk_name_update);
        initParam();

        numOfLine = getIntent().getIntExtra("NumOfPotion",0);
        OnBackPressedCallback callback=new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Intent intent = new Intent();
                for (int i=0;i< dataAdapters.size();i++)
                {
                    if(dataAdapters.get(i).Name.equals(""))
                    {
                        dataAdapters.get(i).setName("Zinuk"+(i+1));
                    }
                    newAdapterList.add(dataAdapters.get(i).Name);
                }
                intent.putExtra("ZinukList",newAdapterList);
                setResult(1,intent);
                trueorfalse=1;
                finish();
            }
        };
        this.getOnBackPressedDispatcher().addCallback(this, callback);
        if (trueorfalse==0 && SyncTimeActivity.isSync==0) {
            for (int j = 1; j <= numOfLine; j++)//make first list
            {
                ListnameAdapter = new DataAdapter("",j);
                dataAdapters.add(ListnameAdapter);
            }
        }
        else
        {
            for(int i = 0 ; i < numOfLine; i++)
            {
                ListnameAdapter = new DataAdapter(ZinukPageActivity.list.get(i),i);
                dataAdapters.add(ListnameAdapter);
            }
        }

        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                for (int i=0;i< dataAdapters.size();i++)
                {
                    if(dataAdapters.get(i).Name.equals(""))
                    {
                        dataAdapters.get(i).setName("Zinuk"+(i+1));
                    }
                    newAdapterList.add(dataAdapters.get(i).Name);
               }
                intent.putExtra("ZinukList",newAdapterList);
                setResult(1,intent);
                trueorfalse=1;
                finish();
            }
        });
    }

    private void initParam() {
        RVnamelList=findViewById(R.id.RVnamelList);
        dataAdapters = new ArrayList<>();
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        RVnamelList.setLayoutManager(layoutManager);
        MyAdapter adapter = new MyAdapter(this,dataAdapters);
        RVnamelList.setAdapter(adapter);
        newAdapterList=new ArrayList<String>();
        btnDone=findViewById(R.id.btnDone);
    }

    public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyHolder> {
        Context context;
        List<DataAdapter> data;


        public MyAdapter(Context context, List<DataAdapter> data) {
            this.context = context;
            this.data = data;
        }

        @NonNull
        @Override
        public MyHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(context).inflate(R.layout.zinuk_name_model,parent,false);
            return new MyHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull MyHolder holder, int position) {
            holder.NameModel.setText(data.get(position).getName());
            holder.numOfZinuk.setText(""+(position+1));
        }

        @Override
        public int getItemCount() {
            return data.size();
        }

        public class MyHolder extends RecyclerView.ViewHolder{
            EditText NameModel;
            TextView numOfZinuk;

            public MyHolder(@NonNull View itemView) {
                super(itemView);
                NameModel = itemView.findViewById(R.id.NameModel);
                numOfZinuk = itemView.findViewById(R.id.numOfZinuk);

                NameModel.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                    }
                    @Override
                    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                    }
                    @Override
                    public void afterTextChanged(Editable editable) {
                        DataAdapter dataAdapter = dataAdapters.get(getAdapterPosition());
                        dataAdapter.Name = (NameModel.getText().toString());
                    }
                });
            }
        }
    }

    public class DataAdapter{
        String Name;
        int num;

        public DataAdapter(String name, int num) {
            this.Name = name;
            this.num = num;
        }
        public String getName() {
            return Name;
        }

        public void setName(String name) {
            Name = name;
        }

        public int getNum() {
            return num;
        }

        public void setNum(int num) {
            this.num = num;
        }
    }
}