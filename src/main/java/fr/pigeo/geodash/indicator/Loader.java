package fr.pigeo.geodash.indicator;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by fgravin on 11/03/2016.
 */
public abstract class Loader {

    protected DataSourceConfig config;

    public Loader(DataSourceConfig config) {
        this.config = config;
    }

    abstract public void connect() throws SQLException;
    abstract public List getData(String config);
}
