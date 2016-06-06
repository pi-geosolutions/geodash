package fr.pigeo.geodash.indicator.config;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by fgravin on 02/04/2016.
 */
public class Config {

    private DataSourceConfig dataSourceConfig;

    private String name;
    private String description;

    public Config(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        this.fromJSON(configObj);
    }
    public Config(final JSONObject config) throws JSONException {
        this.fromJSON(config);
    }

    public DataSourceConfig getDataSourceConfig() {
        return dataSourceConfig;
    }

    public void setDataSourceConfig(DataSourceConfig dataSourceConfig) {
        this.dataSourceConfig = dataSourceConfig;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void fromJSON(JSONObject config) throws JSONException {
        this.name = config.getString("name");
        this.description = config.optString("description");
        this.dataSourceConfig = new DataSourceConfig(config.getJSONObject("datasource"));
    }
}
