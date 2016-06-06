package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import fr.pigeo.geodash.util.JdbcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by fgravin on 11/03/2016.
 */

@Component
public class LoaderFileSystem extends Loader {

    private static final Logger logger = LoggerFactory.getLogger(LoaderFileSystem.class);

    public LoaderFileSystem(DataSourceConfig config) {

    }

    @Override
    public void connect() {
    }

    public List getData(final String query) {
        return null;
    }

}
