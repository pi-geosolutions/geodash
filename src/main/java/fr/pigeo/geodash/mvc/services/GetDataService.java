package fr.pigeo.geodash.mvc.services;

import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.geometry.DirectPosition2D;
import org.opengis.geometry.DirectPosition;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

/**
 * Created by fgravin on 25/04/2016.
 */

@Service
public class GetDataService {

    private AbstractGridCoverage2DReader reader;

    public double[] getValue(File rasterFile, double lat, double lon) throws Exception {
        AbstractGridFormat format = GridFormatFinder.findFormat( rasterFile );

        if(format == null) {
            throw new RuntimeException("filesystem.getvalue.format");
        }

        reader = format.getReader(rasterFile);
        GridCoverage2D cov = null;
        try {
            cov = reader.read(null);
        } catch (IOException giveUp) {
            throw new RuntimeException(giveUp);
        }

        DirectPosition pos = new DirectPosition2D(cov.getCoordinateReferenceSystem(),lat, lon);
        double[] val = cov.evaluate(pos, (double[]) null);
        return val;
    }

}
