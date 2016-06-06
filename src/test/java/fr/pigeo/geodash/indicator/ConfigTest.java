package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.Config;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by IRD-Flow on 15/04/2016.
 */
public class ConfigTest {

    private final String configString = "{\"name\":\"name\",\"description\":\"description\"," +
            "\"datasource\":{\"type\":\"database\",\"url\":\"jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork\"," +
            "\"sql\":\"select m.datereleve, rain, avg, (avg+stddev) as e1plus\"}}";

    private Config config;

    @Before
    public void setUp() throws Exception {
        config = new Config(configString);
    }

    @Test
    public void testFromJSON() throws Exception {

        assertEquals(config.getName(), "name");
        assertEquals(config.getDescription(), "description");
        assertNotNull(config.getDataSourceConfig());
    }
}