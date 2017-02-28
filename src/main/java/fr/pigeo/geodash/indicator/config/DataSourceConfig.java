package fr.pigeo.geodash.indicator.config;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by fgravin on 02/04/2016.
 */
public class DataSourceConfig {

    protected String type;
    protected String optYear;

    static public final String DATASOURCE_TYPE_DATABASE = "database";
    static public final String DATASOURCE_TYPE_FILESYSTEM = "filesystem";

    public DataSourceConfig() {}
    public DataSourceConfig(final String config) throws JSONException {}
    public DataSourceConfig(final JSONObject config) throws JSONException {}

    public static DataSourceConfig createConfig(final JSONObject config) throws JSONException {
        DataSourceConfig dsConfig = null;
        String type = config.optString("type");
        if(type.equals(DataSourceConfig.DATASOURCE_TYPE_DATABASE)) {
            dsConfig = new PostgresDataSourceConfig(config);
        }
        else if (type.equals(DataSourceConfig.DATASOURCE_TYPE_FILESYSTEM)) {
            dsConfig = new FileSystemDataSourceConfig(config);
        }
        return dsConfig;
    }

    public static DataSourceConfig createConfig(final String config) throws JSONException {
        JSONObject configObj = new JSONObject(config);
        return DataSourceConfig.createConfig(configObj);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOptYear() {
        return optYear;
    }

    public void setOptYear(String optYear) {
        this.optYear = optYear;
    }
}
