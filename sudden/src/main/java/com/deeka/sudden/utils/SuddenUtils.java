package com.deeka.sudden.utils;

import com.fatboyindustrial.gsonjavatime.Converters;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class SuddenUtils {
    public static final Gson GSON = Converters.registerInstant(new GsonBuilder()).create();

    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }
}
