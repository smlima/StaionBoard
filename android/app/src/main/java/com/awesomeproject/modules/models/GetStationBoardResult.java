package com.awesomeproject.modules.models;

import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;

import java.util.List;


/**
 * Created by sergio.lima on 06/05/2016.
 */

@Root(name = "Envelope")
public class GetStationBoardResult {

    @Element (name = "Body")
    public Body body;

    @Root
    static public class Body {

        @Element (name = "GetDepBoardWithDetailsResponse")
        public GetDepBoardWithDetailsResponse getDepBoardWithDetailsResponse;
    }

    @Root
    static public class GetDepBoardWithDetailsResponse {

        @Element(name = "GetStationBoardResult")
        public GetStationBoardResultSimple mGetStationBoardResultSimple;
    }

    @Root(strict = false)
    static public class GetStationBoardResultSimple {
        @Element    public String generatedAt;
        @Element    public String locationName;
        @Element    public String crs;
        @Element    public String filterLocationName;
        @Element    public String filtercrs;
        @Element    public Boolean platformAvailable;

        @ElementList(entry = "message", required = false)
        public List<String> nrccMessages;

        @ElementList(required = false)
        public List<Service> trainServices;
    }

    @Root(strict = false)
    public static class Service {

        @Element (name = "std")
        public String standardDeparture;
        @Element (name = "etd")
        public String estimatedDeparture;
        @Element
        public String platform;
        @Element
        public String operator;
        @Element
        public String operatorCode;
        @Element
        public String serviceType;      //train
        @Element
        public String serviceID;

        @Element
        public Origin origin;
        @Element
        public Destination destination;

        @Element
        public CallingPoints subsequentCallingPoints;
    }

    @Root(strict = false)
    public static class Origin{
        @Element
        public Location location;
    }

    @Root(strict = false)
    public static class Destination{
        @Element
        public Location location;
    }

    @Root(strict = false)
    public static class Location {
        @Element
        public String locationName;
        @Element
        public String crs;
        @Element (name = "st", required = false)
        public String standardTime;
        @Element (name = "et", required = false)
        public String estimatedTime;
    }

    @Root( strict = false)
    public static class CallingPoints {

        @ElementList(entry = "callingPoint")
        public List<Location> callingPointList;

    }
}
