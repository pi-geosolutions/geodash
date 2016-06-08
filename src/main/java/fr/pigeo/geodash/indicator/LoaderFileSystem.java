package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import fr.pigeo.geodash.indicator.config.FileSystemDataSourceConfig;
import fr.pigeo.geodash.indicator.config.PostgresDataSourceConfig;
import fr.pigeo.geodash.mvc.services.GetDataService;
import fr.pigeo.geodash.util.JdbcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.File;
import java.io.FilenameFilter;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
    public void connect() {
        this.folder = new File(config.getPath());
    }

    public List getData(final double lon, final double lat) throws Exception {

        GetDataService service = new GetDataService();
        List<List<Double>> values = new ArrayList<List<Double>>();

        File[] matchingFiles = this.folder.listFiles(new FilenameFilter() {
            public boolean accept(File dir, String name) {
                Pattern pattern = Pattern.compile(config.getPattern());
                Matcher matcher = pattern.matcher(name);

                if (matcher.find()) {
                    return true;
                }
                return false;
            }
        });

        File[] files = Arrays.copyOfRange(matchingFiles, matchingFiles.length-config.getAmount(), matchingFiles.length);

        for(File file : files) {
            double[] res = service.getValue(file, lon, lat);
            List<Double> v = new ArrayList<Double>();
            v.add(res[0]);
            values.add(v);
        }

        return values;
    }

}
