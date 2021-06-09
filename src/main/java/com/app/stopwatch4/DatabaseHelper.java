package com.app.stopwatch4;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.ArrayList;
import java.util.List;
import androidx.annotation.Nullable;

public class DatabaseHelper extends SQLiteOpenHelper {

    public static final String DATABASE_NAME = "Race_Name";
    public static final String Race_Table = "Race_Table";
    public static final String Col1_raceld = "raceld";
    public static final String Col2_heatid = "heatid";
    public static final String Col3_StartTime = "startTime";
    public static final String Col4_ZinukName = "Name";
    public static final String Col5_state = "heatStateNum";
    public static final String Col6_creationTime = "creationTime";
    private static final String TAG = "DatabaseHelper";

    public DatabaseHelper(@Nullable Context context) {
        super(context, "Race_Name", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(" create table " + Race_Table + "(" +
                Col1_raceld +" INTEGER," +
                Col2_heatid + " INTEGER," +
                Col3_StartTime + " TEXT," +
                Col4_ZinukName +" TEXT," +
                Col5_state +" INTEGER," +
                Col6_creationTime +" DOUBLE, "+

                "PRIMARY KEY ("+Col2_heatid+"))") ;
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int i, int i1) {
        db.execSQL("DROP TABLE IF EXISTS " + Race_Table);
        onCreate(db);
    }


    public boolean insertData(int raceld,int heatld,String starttime,String name,int heatstatenum,double creationtime)
    {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(Col1_raceld,raceld);
        contentValues.put(Col2_heatid,heatld);
        contentValues.put(Col3_StartTime,starttime);
        contentValues.put(Col4_ZinukName,name);
        contentValues.put(Col5_state,heatstatenum);
        contentValues.put(Col6_creationTime,creationtime);

        long result=  db.insert(Race_Table,null,contentValues);
        if (result==-1)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public int getRaceId()
    {
        int raceId=0;
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("select * from "+Race_Table,null);
        if (cursor.moveToFirst()){
            do{
                 raceId = cursor.getInt(cursor.getColumnIndex(Col1_raceld));
            }while(cursor.moveToNext());
        }
        cursor.close();
        return raceId;
    }

public double getCreationTime()
{
    double creatironTime=0;
    SQLiteDatabase db = this.getWritableDatabase();
    Cursor cursor = db.rawQuery("select * from "+Race_Table,null);

    if (cursor.moveToFirst()){
        do{
            creatironTime = cursor.getDouble(cursor.getColumnIndex(Col6_creationTime));
        }while(cursor.moveToNext());
    }
    cursor.close();
    return creatironTime;
}
    public List<ZinukModel>  getAllData()
    {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("select * from "+Race_Table,null);
        List<ZinukModel> list = new ArrayList<>();
        if (cursor.moveToFirst()){
            do{
                int heatId = cursor.getInt(cursor.getColumnIndex(Col2_heatid));
                String startTime = cursor.getString(cursor.getColumnIndex(Col3_StartTime));
                String name = cursor.getString(cursor.getColumnIndex(Col4_ZinukName));
                double creationTime = cursor.getDouble(cursor.getColumnIndex(Col6_creationTime));
                int state = cursor.getInt(cursor.getColumnIndex(Col5_state));
                list.add(new ZinukModel(heatId, startTime, name, creationTime, state));
            }while(cursor.moveToNext());
        }
        cursor.close();
        return list;
    }

    public List<ZinukModel>  getAllDataImport() {
        List<ZinukModel> list = new ArrayList<>();
        for (int i=0;i<ImportActivity.Heats.size();i++)
        {
            list.add(new ZinukModel(ImportActivity.Heats.get(i).heatId, ImportActivity.Heats.get(i).startTime,
                    ImportActivity.Heats.get(i).name, ImportActivity.Heats.get(i).creationTime, ImportActivity.Heats.get(i).heatStateNum));
    }
        return list;
    }

    public void DeleteDateBase(String name)
    {
        SQLiteDatabase db = this.getWritableDatabase();
        String query = " DELETE FROM "+ Race_Table;
        db.execSQL(query);
    }

    public boolean updateData(int raceld, int heatld, String starttime, String name, int heatstatenum, double creationtime){
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(Col1_raceld,raceld);
        contentValues.put(Col2_heatid,heatld);
        contentValues.put(Col3_StartTime,starttime);
        contentValues.put(Col4_ZinukName,name);
        contentValues.put(Col5_state,heatstatenum);
        contentValues.put(Col6_creationTime,creationtime);
        String whereClause = Col2_heatid + "=?";
        String[] whereArguments = { String.valueOf(heatld) };
        db.update(Race_Table,contentValues, whereClause, whereArguments) ;
        return true;
    }
}
