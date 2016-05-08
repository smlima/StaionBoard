package com.awesomeproject.modules.parser;

import com.awesomeproject.modules.models.GetStationBoardResult;

import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;

/**
 * Created by sergio.lima on 06/05/2016.
 */
public class GetStationBoardResultParser {

    public static GetStationBoardResult.GetStationBoardResultSimple newInstance(String xml) throws Exception {

        Serializer serializer = new Persister();

        GetStationBoardResult result = serializer.read(GetStationBoardResult.class, xml);

        return result.body.getDepBoardWithDetailsResponse.mGetStationBoardResultSimple;
    }

}
