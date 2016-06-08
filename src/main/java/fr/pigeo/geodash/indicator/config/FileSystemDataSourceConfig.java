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

    private String path;
    private String pattern;
    private int amount;

    public FileSystemDataSourceConfig(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        this.fromJSON(configObj);
    }
    public FileSystemDataSourceConfig(final JSONObject config) throws JSONException {
        this.fromJSON(config);
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void fromJSON(JSONObject config) throws JSONException {
        this.path = config.getString("path");
        this.pattern = config.getString("pattern");
        this.amount = config.getInt("amount");
        this.type = config.getString("type");

    }
}
