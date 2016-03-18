package fr.pigeo.geodash.indicator;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by fgravin on 11/03/2016.
 */
public abstract class Loader {

    abstract void connect() throws SQLException;
    abstract List getData(String config);
}
