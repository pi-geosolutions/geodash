package fr.pigeo.geodash.indicator.config;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by fgravin on 25/04/2016.
 */
public class PostgresDataSourceConfig extends DataSourceConfig {

    private String url;
    private String sql;

    public PostgresDataSourceConfig(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        this.fromJSON(configObj);
    }
    public PostgresDataSourceConfig(final JSONObject config) throws JSONException {
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
