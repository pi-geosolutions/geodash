package fr.pigeo.geodash.indicator.config;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by fgravin on 25/04/2016.
 */
public class FileSystemDataSourceConfig extends DataSourceConfig {

    private Map<String, Path> paths = new HashMap<String, Path>();

    public FileSystemDataSourceConfig(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        this.fromJSON(configObj);
    }
    public FileSystemDataSourceConfig(final JSONObject config) throws JSONException {
        this.fromJSON(config);
    }

    public void fromJSON(JSONObject config) throws JSONException {
    }
}
