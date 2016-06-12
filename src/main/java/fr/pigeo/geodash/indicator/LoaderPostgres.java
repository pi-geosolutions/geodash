package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.PostgresDataSourceConfig;
import fr.pigeo.geodash.util.JdbcUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by fgravin on 11/03/2016.
 */

@Component
public class LoaderPostgres extends Loader {

    private static final Logger logger = LoggerFactory.getLogger(LoaderPostgres.class);

    protected PostgresDataSourceConfig config;

    @Autowired
    JdbcTemplate jdbcTemplate;

    private Connection con;

    public LoaderPostgres(PostgresDataSourceConfig config) {
        this.config = config;
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

    public JSONObject getData(final double lon, final double lat) throws Exception {
        String query = this.config.getSql().
                replace("${lon}", String.valueOf(lon)).
                replace("${lat}", String.valueOf(lat));

        JSONObject res = new JSONObject();
        res.put("data", new JSONArray(jdbcTemplate.query(query, new DataRowMapper())));

        return res;
    }

}
