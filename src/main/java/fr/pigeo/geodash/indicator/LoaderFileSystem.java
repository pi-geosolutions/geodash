package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.FileSystemDataSourceConfig;
import fr.pigeo.geodash.mvc.services.GetDataService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FilenameFilter;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by fgravin on 11/03/2016.
 */

@Component
public class LoaderFileSystem extends Loader {

    private static final Logger logger = LoggerFactory.getLogger(LoaderFileSystem.class);

    private File folder;
    protected FileSystemDataSourceConfig config;

    public LoaderFileSystem(FileSystemDataSourceConfig config) {
        this.config = config;
    }

    @Override
    public void connect() throws Exception {
        this.folder = new File(config.getPath());
        if(!this.folder.isDirectory()) {
            throw new NoSuchElementException("filesystem.loader.connect.error");
        }
    }

    public JSONObject getData(final double lon, final double lat) throws Exception {

        GetDataService service = new GetDataService();
        List<List<Double>> values = new ArrayList<List<Double>>();

        // Used to have a sorted map with date as keys
        final Map<String,File> filesMap = new TreeMap<String, File>();

        String placeholder = null;
        String pattern = config.getPattern();

        Matcher matcher = Pattern.compile("\\$(\\w*?)\\$").matcher(pattern);
        while (matcher.find()) {
            placeholder = matcher.group(1);
        }
        pattern = pattern.replaceAll("([?.])", "\\\\$1");
        pattern = pattern.replaceAll("\\$"+placeholder+"\\$", "([\\\\w\\\\s]+?)");

        final String fPattern = pattern;

        // get files that match the pattern
        File[] matchingFiles = this.folder.listFiles(new FilenameFilter() {
            public boolean accept(File dir, String name) {

                Matcher m = Pattern.compile(fPattern).matcher(name);
                if (m.matches()) {
                    filesMap.put(m.group(1), new File(dir, name));
                    return true;
                }
                return false;
            }
        });

        if(matchingFiles == null) {
            throw new NoSuchElementException("filesystem.getData.nofile");
        }

        // only get last files depending on config amount
        int nbStart = 0;
        if(config.getAmount() > 0 ) {
            nbStart = Math.max(matchingFiles.length-config.getAmount(), 0);
        }

        int i = -1;
        List<String> dates = new ArrayList<String>();
        for(Map.Entry<String,File> entry : filesMap.entrySet()) {
            i++;
            if(i < nbStart || i == filesMap.entrySet().size()-1) {
                continue;
            }
            String date = entry.getKey();
            File file = entry.getValue();

            double[] value = service.getValue(file, lon, lat);
            List<Double> v = new ArrayList<Double>();

            // generate UTC date for datetime chart type
            if(placeholder.equals("date")) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyymmdd");
                Date ddate = dateFormat.parse(date);
                Long dateUTC = ddate.getTime();
                v.add((double)dateUTC);
            }
            v.add(round(value[0], 2));
            values.add(v);
            dates.add(date);
        }

        JSONObject res = new JSONObject();
        res.put("data", new JSONArray(values));

        if(dates.size() > 0 && placeholder.equals("year")) {
            res.put("categories", new JSONArray(dates));
        }
        return res;
    }

    private double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        long factor = (long) Math.pow(10, places);
        value = value * factor;
        long tmp = Math.round(value);
        return (double) tmp / factor;
    }

}
