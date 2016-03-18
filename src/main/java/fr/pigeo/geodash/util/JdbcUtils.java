package fr.pigeo.geodash.util;

import org.apache.commons.dbcp.BasicDataSource;

import javax.sql.DataSource;
import java.sql.SQLException;

/**
 * Created by fgravin on 11/03/2016.
 */
public class JdbcUtils {

    public static DataSource getDataSource(final String jdbcUrl) throws SQLException {
        BasicDataSource basicDataSource = new BasicDataSource();

        basicDataSource.setDriverClassName("org.postgresql.Driver");

        basicDataSource.setTestOnBorrow(true);

        basicDataSource.setPoolPreparedStatements(true);
        basicDataSource.setMaxOpenPreparedStatements(-1);

        basicDataSource.setDefaultReadOnly(false);
        basicDataSource.setDefaultAutoCommit(false);

        basicDataSource.setUrl(jdbcUrl);

        return basicDataSource;
    }
}
