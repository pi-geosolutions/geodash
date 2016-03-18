package fr.pigeo.geodash.indicator;

import java.sql.SQLException;
import java.util.List;

public class Indicator {

    private Loader loader;
    private String sqlQuery = "SELECT * from afo_2e1_stations";

    public Indicator() {
        this.loader = new LoaderPostgres();
    }

    public List getData() throws SQLException {
        loader.connect();
        return loader.getData(sqlQuery);
    }
}
