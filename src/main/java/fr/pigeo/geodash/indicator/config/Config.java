package fr.pigeo.geodash.indicator.config;

import fr.pigeo.geodash.indicator.LoaderFileSystem;
import fr.pigeo.geodash.indicator.LoaderPostgres;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by fgravin on 02/04/2016.
 */
public class Config {

    private DataSourceConfig dataSourceConfig;

    private String description;
    private String label;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void fromJSON(JSONObject config) throws JSONException {
        this.description = config.optString("description");
        this.label = config.optString("label");
        this.dataSourceConfig = DataSourceConfig.createConfig(config.getJSONObject("datasource"));
    }
}
