package fr.pigeo.geodash.indicator.config;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by IRD-Flow on 06/06/2016.
 */
public class FileSystemDataSourceConfigTest {

    String config = "{\"path\" : \"myPath\", \"pattern\": \"myPattern\", \"amount\": 10}";

    @Test
    public void testFromJSON() throws Exception {

        FileSystemDataSourceConfig fsConfig = new FileSystemDataSourceConfig(config);
        assertEquals(fsConfig.getPath(), "myPath");
        assertEquals(fsConfig.getPattern(), "myPattern");
        assertEquals(fsConfig.getAmount(), 10);

    }
}