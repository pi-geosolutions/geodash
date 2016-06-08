package fr.pigeo.geodash.indicator;

import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import fr.pigeo.geodash.indicator.config.FileSystemDataSourceConfig;
import fr.pigeo.geodash.indicator.config.PostgresDataSourceConfig;

/**
 * Created by IRD-Flow on 06/06/2016.
 */
public class LoaderFactory {

    static public Loader createLoader(DataSourceConfig config) {
        if(config.getType().equals(DataSourceConfig.DATASOURCE_TYPE_DATABASE)) {
            return new LoaderPostgres((PostgresDataSourceConfig)config);
        }
        else if (config.getType().equals(DataSourceConfig.DATASOURCE_TYPE_FILESYSTEM)) {
            return new LoaderFileSystem((FileSystemDataSourceConfig) config);

        }
        return null;
    }
}
