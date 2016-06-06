package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import fr.pigeo.geodash.indicator.config.PostgresDataSourceConfig;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by IRD-Flow on 15/04/2016.
 */
public class DataSourceConfigTest {

    private final String configString = "{\"type\":\"database\",\"url\":\"jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork\"," +
            "\"sql\":\"select m.datereleve, rain, avg, (avg+stddev) as e1plus\"}";

    private PostgresDataSourceConfig config;

    @Test
    public void testFromJSON() throws Exception {
        config = new PostgresDataSourceConfig(configString);
        assertEquals(config.getSql(), "select m.datereleve, rain, avg, (avg+stddev) as e1plus");
        assertEquals(config.getUrl(), "jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork");
    }
}