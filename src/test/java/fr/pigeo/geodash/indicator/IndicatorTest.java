package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.Config;
import fr.pigeo.geodash.indicator.config.FileSystemDataSourceConfig;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Created by fgravin on 06/06/2016.
 */
public class IndicatorTest {

    @Test
    public void testProcessFS() throws Exception {

        String sConfig = "{" +
                "\"name\": \"test\"," +
                "\"id\": 1," +
                "\"datasource\": " +
                "{" +
                "\"path\" : \"E:\\\\Users\\\\Documents\\\\GitHub\\\\geoDash\\\\src\\\\main\\\\resources\\\\02_moyennes_pluies\\\\\", " +
                "\"pattern\": \"RainMm_(.*?)_days.tif\", " +
                "\"type\": \"filesystem\", " +
                "\"amount\": 10" +
                "}}";

        Config config = new Config(sConfig);
        Indicator indicator = new Indicator(config);
        List<Double> res =  indicator.process(14, 8);

        assertEquals(res.size(), 10);
        assertEquals(res.get(0), 71, 0.1);
    }

    @Test
    public void testProcessDB() throws Exception {

        String sConfig = "{" +
                "\"name\": \"test\"," +
                "\"id\": 1," +
                "\"datasource\": " +
                "{" +
                "\"sql\" : \"select m.datereleve, rain, avg, (avg+stddev) as e1plus, greatest(0, avg-stddev) as e1minus, (avg+variance) as e2plus, greatest(0, avg-variance) as e2minus from afo_2e1_mesures as m, (select datereleve, stddev(rain), variance(rain), avg(rain) from afo_2e1_mesures group by datereleve) as sd where m.code_omm in ( select code_omm from afo_2e1_stat_mes_last order by st_distance(the_geom,ST_GeomFromText('POINT(${lat} ${lon} )',4326)) LIMIT 1 ) AND m.datereleve = sd.datereleve order by m.datereleve limit 60\", " +
                "\"url\": \"jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork\", " +
                "\"type\": \"database\", " +
                "}}";

        Config config = new Config(sConfig);
        Indicator indicator = new Indicator(config);
        List<Double> res =  indicator.process(14, 8);

    }
}