package fr.pigeo.geodash.mvc;

import org.apache.commons.io.filefilter.PrefixFileFilter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.geometry.DirectPosition2D;
import org.geotools.referencing.CRS;
import org.json.JSONObject;
import org.opengis.geometry.DirectPosition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Path;


@Controller
@RequestMapping("/geoprocess")
public class GetValues
{
    @Autowired
    private ApplicationContext appContext;

    private static final Log LOG = LogFactory.getLog(GetValues.class.getName());

    //vars defined as service parameters in config-pigeo.xml
	private String fullpath;

	private final String BASE_PATH = "E:\\Users\\Documents\\GitHub\\geoDash\\src\\main\\resources\\";
	private final String EXT = "tif";

	private enum Mode { //necessary for the switch statement since String can be used in switch statements only since 1.7
		decade, year, yearByMonths;
	}
	private AbstractGridCoverage2DReader reader;

	@RequestMapping(value="/{type}/{lon}/{lat}", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String exec(HttpServletRequest request,
                       HttpServletResponse response,
                       @PathVariable String type,
                       @PathVariable String lon,
                       @PathVariable String lat,
                       @PathVariable String year) throws IOException {


        try {
            String dataPath = BASE_PATH + type;

            File folder = new File(dataPath);
            JSONObject ret = new JSONObject();
            ret.put("lon", lon);
            ret.put("lat", lat);

            if (folder.canRead()) {
                ret.put("folder", dataPath);
                for (int i = 1; i <= 12; i++) { //iterate through the months
                    JSONObject row = new JSONObject();
                    row.put("month", String.format("%02d", i));
                    for (int j = 0; j <= 2; j++) {//iterate through the decades
                        //Create a filter
                        String filter = year + String.format("%02d", i) +String.format("%02d", j*10+1);
                        //System.out.println("filter "+filter);
                        File[] listOfFiles = folder.listFiles((FilenameFilter) new PrefixFileFilter(filter));
                        switch (listOfFiles.length) {
                            case 1 :
                                if (listOfFiles[0].canRead())
                                {
                                    double[] val = this.getValue(listOfFiles[0], Double.parseDouble(lat), Double.parseDouble(lon));
                                    row.put("decade"+(j+1), String.valueOf((int)val[0]));
                                }
                                break;
                            case 0 : //no file found, we return value 0
                                row.put("value", "0");

                                break;
                            default: //means we have more than 1
                                System.err.println("multiple files when only one should fit to the filter " + filter);
                                for (int k = 0 ; k< listOfFiles.length ; k++) {
                                    System.err.println(listOfFiles[k].getName());
                                }
                                System.err.println("Taking the first one...");
                                if (listOfFiles[0].canRead())
                                {
                                    double[] val = this.getValue(listOfFiles[0], Double.parseDouble(lat), Double.parseDouble(lon));
                                    row.put("decade"+(j+1), String.valueOf((int)val[0]));
                                }
                                break;
                        }
                    } //end of decade loop
                    //dataset.add(row);
                } //end of month loop


            }
            return new JSONObject().put("query", ret).toString();

        } catch (Exception e) {
            LOG.error(e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            throw new IOException(e);
        }
	}

	//--------------------------------------------------------------------------

/*
	private JSONObject collectByYM(String path, String lat, String lon, String year) {

		JSONObject params = new JSONObject();
		params.put("lat", lat);
		params.put("lon", lon);
		params.put("year", year);

		JSONObject res = new JSONObject();
		res.put("path", path);
		res.put("EXT", EXT);
		res.put("params", params);

		JSONArray dataset = new JSONArray();
		res.put("dataset", dataset);

		try {
			File folder = new File(path);
			if (folder.canRead()) {
				for (int i = 1; i <= 12; i++) { //iterate through the months
					JSONObject row = new JSONObject();
					row.put("month", String.format("%02d", i));
					for (int j = 0; j <= 2; j++) {//iterate through the decades
						//Create a filter
						String filter = year + String.format("%02d", i) +String.format("%02d", j*10+1);
						//System.out.println("filter "+filter);
						File[] listOfFiles = folder.listFiles((FilenameFilter) new PrefixFileFilter(filter));
						switch (listOfFiles.length) {
							case 1 :
								if (listOfFiles[0].canRead())
								{
									double[] val = this.getValue(listOfFiles[0], Double.parseDouble(lat), Double.parseDouble(lon));
									row.put("decade"+(j+1), String.valueOf((int)val[0]));
								}
								break;
							case 0 : //no file found, we return value 0
								row.put("value", "0");

								break;
							default: //means we have more than 1
								System.err.println("multiple files when only one should fit to the filter " + filter);
								for (int k = 0 ; k< listOfFiles.length ; k++) {
									System.err.println(listOfFiles[k].getName());
								}
								System.err.println("Taking the first one...");
								if (listOfFiles[0].canRead())
								{
									double[] val = this.getValue(listOfFiles[0], Double.parseDouble(lat), Double.parseDouble(lon));
									row.put("decade"+(j+1), String.valueOf((int)val[0]));
								}
								break;
						}
					} //end of decade loop
					dataset.add(row);
				} //end of month loop
			}

		} catch (Exception problem) {
			problem.printStackTrace();
		} finally {
		}
		return res;
	}

	public JSONObject collectByDecade(String path, String lat, String lon, final String date) {
		if (date == null) {
			System.out.println("Bad or missing parameters. See the doc");
			JSONObject res = new JSONObject();
			res.put("success", false);
			res.put("error", "Missing date parameter");
			return res;
		}

		JSONObject params = new JSONObject();
		params.put("lat", lat);
		params.put("lon", lon);
		params.put("date", date);

		JSONObject res = new JSONObject();
		res.put("path", path);
		res.put("EXT", EXT);
		res.put("params", params);

		JSONArray dataset = new JSONArray();
		res.put("dataset", dataset);

		try {
			File folder = new File(path);
			if (folder.canRead()) {
				//We apply a filter to get only the relevant files
				File[] listOfFiles = folder.listFiles(new FilenameFilter() {
					@Override
					public boolean accept(File current, String name) {
						String filter = "[1-2][0-9]{3}"+date+".*\\."+EXT;
						return name.matches(filter);
					}
				});
				Arrays.sort(listOfFiles);
				for (int i = 0; i < listOfFiles.length; i++)
				{
					if (listOfFiles[i].canRead())
					{
						double[] val = this.getValue(listOfFiles[i], Double.parseDouble(lat), Double.parseDouble(lon));
						String name = listOfFiles[i].getName();
						JSONObject row = new JSONObject();
						row.put("year",name.substring(0, 4));
						row.put("value",String.valueOf((int)val[0]));
						dataset.add(row);
					}
				}
			}
		} catch (Exception problem) {
			problem.printStackTrace();
		} finally {
		}
		return res;
	}


	private JSONObject collectByYear(String path, String lat, String lon) {
		// TODO Auto-generated method stub
		JSONObject res = new JSONObject();
		res.put("success", true);
		return res;
	}
*/
	private double[] getValue(File rasterFile, double lat, double lon) throws Exception {
		AbstractGridFormat format = GridFormatFinder.findFormat( rasterFile );
		reader = format.getReader(rasterFile);
		GridCoverage2D cov = null;
		try {
			cov = reader.read(null);
		} catch (IOException giveUp) {
			throw new RuntimeException(giveUp);
		}
		DirectPosition pos = new DirectPosition2D(CRS.decode("EPSG:4326", true),lon, lat);
		double[] val = cov.evaluate(pos, (double[]) null);
		return val;
	}



}
