package fr.pigeo.geodash.mvc.services;

import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.geometry.DirectPosition2D;
import org.opengis.geometry.DirectPosition;
import org.springframework.stereotype.Service;

import javax.media.jai.iterator.RandomIter;
import javax.media.jai.iterator.RandomIterFactory;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.image.RenderedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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

/*
    public List<Integer> getRegression(File rasterFile) throws IOException {
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

        RenderedImage image = cov.getRenderedImage();
        RandomIter iter = RandomIterFactory.create(image, null);
        final int width = image.getWidth();
        final int height = image.getHeight();

        List<Integer> values = new ArrayList<Integer>();

        for (int row = 0; row < height; row++) {
            for (int col = 0; col < width; col++) {
                int intDatum = iter.getSample(col, row, 0);
                if(intDatum > 0) {
                    values.add(intDatum);
                }
            }
        }
        iter.done();
        return values;
    }

    private static int[][] convertTo2D(BufferedImage image) {

        final byte[] pixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        final int width = image.getWidth();
        final int height = image.getHeight();
        final boolean hasAlphaChannel = image.getAlphaRaster() != null;

        int[][] result = new int[height][width];
        if (hasAlphaChannel) {
            final int pixelLength = 4;
            for (int pixel = 0, row = 0, col = 0; pixel < pixels.length; pixel += pixelLength) {
                int argb = 0;
                argb += (((int) pixels[pixel] & 0xff) << 24); // alpha
                argb += ((int) pixels[pixel + 1] & 0xff); // blue
                argb += (((int) pixels[pixel + 2] & 0xff) << 8); // green
                argb += (((int) pixels[pixel + 3] & 0xff) << 16); // red
                result[row][col] = argb;
                col++;
                if (col == width) {
                    col = 0;
                    row++;
                }
            }
        } else {
            final int pixelLength = 3;
            for (int pixel = 0, row = 0, col = 0; pixel < pixels.length; pixel += pixelLength) {
                int argb = 0;
                argb += -16777216; // 255 alpha
                argb += ((int) pixels[pixel] & 0xff); // blue
                argb += (((int) pixels[pixel + 1] & 0xff) << 8); // green
                argb += (((int) pixels[pixel + 2] & 0xff) << 16); // red
                result[row][col] = argb;
                col++;
                if (col == width) {
                    col = 0;
                    row++;
                }
            }
        }

        return result;
    }
*/

}
