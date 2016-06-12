package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.Config;
import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import org.json.JSONObject;

import java.sql.SQLException;
import java.util.List;

public class Indicator {

    private Loader loader;


    public Indicator(Config config) {
        this.loader = LoaderFactory.createLoader(config.getDataSourceConfig());
    }

    public Indicator(DataSourceConfig config) {
        this.loader = LoaderFactory.createLoader(config);
    }


    public JSONObject process(double lon, double lat) throws Exception {
        return this.process(lon, lat, this.loader);
    }

    public JSONObject process(double lon, double lat, Loader loader) throws Exception {
        loader.connect();
        return loader.getData(lon, lat);
    }

}
