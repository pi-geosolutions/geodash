package fr.pigeo.geodash.indicator;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by IRD-Flow on 02/04/2016.
 */
public class DataSourceConfig {
    private String url;
    private String sql;

    public DataSourceConfig(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        this.fromJSON(configObj);
    }
    public DataSourceConfig(final JSONObject config) throws JSONException {
        this.fromJSON(config);
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void fromJSON(JSONObject config) throws JSONException {
        this.sql = config.getString("sql");
        this.url = config.getString("url");

    }
}
