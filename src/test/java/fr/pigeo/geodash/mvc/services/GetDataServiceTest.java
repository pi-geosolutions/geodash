package fr.pigeo.geodash.mvc.services;

import org.geotools.image.ImageWorker;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import javax.imageio.ImageIO;
import java.awt.image.RenderedImage;
import java.io.File;
import java.nio.file.Path;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created by IRD-Flow on 25/04/2016.
 */

public class GetDataServiceTest {

    final String  tifFolder = "E:\\Users\\Documents\\GitHub\\geoDash\\src\\main\\resources\\02_moyennes_pluies\\";

    @Test
    public void testGetValue() throws Exception {
        File file = new File(tifFolder + "RainMm_2001_days.tif");

        assertTrue(file.exists());
        //mockMvc.
        GetDataService service = new GetDataService();

        final ImageWorker readWorker = new ImageWorker(ImageIO.read(file));
        RenderedImage image = readWorker.getRenderedImage();

        double[] res = service.getValue(file, 14.605, 8.207);

        assertTrue(res.length == 1);
        assertEquals(res[0], 66.0, 0.1);

    }
}