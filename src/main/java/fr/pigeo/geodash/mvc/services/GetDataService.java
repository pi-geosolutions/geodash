package fr.pigeo.geodash.mvc.services;

import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.factory.Hints;
import org.geotools.gce.geotiff.GeoTiffReader;
import org.geotools.geometry.DirectPosition2D;
import org.opengis.geometry.DirectPosition;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Created by fgravin on 25/04/2016.
 */

@Service
public class GetDataService {

    //private AbstractGridCoverage2DReader reader;

    public double[] getValue(File rasterFile, double lat, double lon) throws Exception {

        ImageIO.setUseCache(false);
        AbstractGridFormat format = GridFormatFinder.findFormat(rasterFile);

        //InputStream inputStream = Files.newInputStream(rasterFile.toPath());
        //GeoTiffReader reader1 = new GeoTiffReader(inputStream, new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE));

        if (format == null) {
            throw new RuntimeException("filesystem.getvalue.format");
        }

        AbstractGridCoverage2DReader reader = format.getReader(rasterFile);
        GridCoverage2D cov = null;
        try {
            cov = reader.read(null);
            DirectPosition pos = new DirectPosition2D(cov.getCoordinateReferenceSystem(), lat, lon);
            double[] val = cov.evaluate(pos, (double[]) null);
            return val;
        } catch (IOException giveUp) {
            throw new RuntimeException(giveUp);
        } finally {
            //inputStream.close();
            reader.dispose();
            cov.dispose(true);
        }
    }
}

