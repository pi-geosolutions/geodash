package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.util.JdbcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by fgravin on 11/03/2016.
 */

@Component
public class LoaderPostgres extends Loader {

    private static final Logger logger = LoggerFactory.getLogger(LoaderPostgres.class);

    @Autowired
    JdbcTemplate jdbcTemplate;

    private Connection con;

    public LoaderPostgres(DataSourceConfig config) {
        super(config);
    }

    @Override
    public void connect() {
        try {

            DataSource dataSource = JdbcUtils.getDataSource(this.config.getUrl());
            jdbcTemplate = new JdbcTemplate(dataSource);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List getData(final String query) {
        return jdbcTemplate.query(query, new DataRowMapper());
    }

}
