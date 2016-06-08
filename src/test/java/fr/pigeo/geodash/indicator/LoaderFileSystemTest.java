package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.FileSystemDataSourceConfig;
import org.junit.Test;

import java.io.File;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by fgravin on 06/06/2016.
 */
public class LoaderFileSystemTest {

    @Test
    public void testGetData() throws Exception {

        String config = "{\"path\" : \"E:\\\\Users\\\\Documents\\\\GitHub\\\\geoDash\\\\src\\\\main\\\\resources\\\\02_moyennes_pluies\\\\\", \"pattern\": \"RainMm_(.*?)_days.tif\", \"amount\": 10}";
        FileSystemDataSourceConfig fsConfig = new FileSystemDataSourceConfig(config);

        LoaderFileSystem loader = new LoaderFileSystem(fsConfig);
        loader.connect();
        List<Double> values = (List<Double>)loader.getData(14,8);

        assertTrue(values.size() <= fsConfig.getAmount());
    }
}