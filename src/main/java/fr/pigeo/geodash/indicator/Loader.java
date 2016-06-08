package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.DataSourceConfig;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by fgravin on 11/03/2016.
 */
public abstract class Loader {

    public Loader() {
    }

    abstract public void connect() throws Exception;
    abstract public List getData(final double lon, final double lat) throws Exception;
}
