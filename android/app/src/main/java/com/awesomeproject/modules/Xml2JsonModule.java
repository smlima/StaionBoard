package com.awesomeproject.modules;

import android.util.Log;

import com.awesomeproject.modules.models.GetStationBoardResult;
import com.awesomeproject.modules.parser.GetStationBoardResultParser;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;

/**
 * Created by sergio.lima on 06/05/2016.
 */
public class Xml2JsonModule extends ReactContextBaseJavaModule {

    public Xml2JsonModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Xml2Json";
    }

    @ReactMethod
    public void convert(String xml, Callback callback) throws Exception {
        Log.d("SLIMA", "Starting Converting stuff...");

        GetStationBoardResult.GetStationBoardResultSimple result = GetStationBoardResultParser.newInstance(xml);
        Log.d("SLIMA", "Converted");

        if (callback != null) {
            Log.d("SLIMA", "Invoking callback.");

            Gson gson = new Gson();

            callback.invoke(gson.toJson(result));
        }

    }
}




