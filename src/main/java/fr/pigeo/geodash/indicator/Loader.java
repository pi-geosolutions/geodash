package fr.pigeo.geodash.indicator;

import org.json.JSONObject;

/**
 * Created by fgravin on 11/03/2016.
 */
public abstract class Loader {

    public Loader() {
    }

    abstract public void connect() throws Exception;
    abstract public JSONObject getData(final double lon, final double lat) throws Exception;
}
