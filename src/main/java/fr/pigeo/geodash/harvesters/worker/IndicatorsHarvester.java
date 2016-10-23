package fr.pigeo.geodash.harvesters.worker;

import fr.pigeo.geodash.dao.HarvestHistoryDao;
import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import fr.pigeo.geodash.model.HarvestHistory;
import fr.pigeo.geodash.model.Indicator;
import org.apache.camel.Exchange;
import org.apache.jcs.access.exception.InvalidArgumentException;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by florent on 13/10/16.
 */

@Component
@Configurable
public class IndicatorsHarvester {

    Logger logger = Logger.getLogger(HarvesterRouteBuilder.LOGGER_NAME);

    @Autowired
    IndicatorDao indicatorDao;

    private JdbcTemplate jdbcTemplate;

    // Field to be setted by Spring with DataSource
    public void setDataSource(DataSource dataSource) {
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public void setIndicatorDao(IndicatorDao indicatorDao) {
        this.indicatorDao = indicatorDao;
    }

    public void initialize(
            Exchange exchange,
            boolean connect) throws InvalidArgumentException {
        HarvesterParameter configuration =
                (HarvesterParameter) exchange.getProperty("configuration");
        if (configuration == null) {
            throw new InvalidArgumentException("Missing Indicators harvester configuration.");
        }

        logger.info(
                String.format(
                        "Initializing harvester configuration for url '%s'. Exchange id is '%s'.",
                        configuration.getUrl(),
                        exchange.getExchangeId()
                ));
    }

    public void clean(Exchange exchange) {
        HarvesterParameter configuration = (HarvesterParameter) exchange.getProperty("configuration");
        Map<String, Integer> info = new HashMap<String, Integer>();
        info.put("total", 0);
        info.put("updated", 0);

        exchange.setProperty("harvestInfo", info);
        IndicatorDao indicatorDao = (IndicatorDao)exchange.getContext().getRegistry().lookupByName("indicatorDao");
        //indicatorDao.deleteByHarvesterid(configuration.getId());
    }

    public void storeIndicator(Exchange exchange) throws InvalidArgumentException {
        Map indicatorMap =  (Map)exchange.getProperty("indicator");
        HarvesterParameter configuration = (HarvesterParameter) exchange.getProperty("configuration");
        Map<String, Integer> infoMap =  (Map<String, Integer>)exchange.getProperty("harvestInfo");

        if (configuration == null) {
            throw new InvalidArgumentException("Missing Indicators harvester configuration.");
        }
        if (indicatorMap == null) {
            throw new InvalidArgumentException("Missing indicator object.");
        }

        IndicatorDao indicatorDao = (IndicatorDao)exchange.getContext().getRegistry().lookupByName("indicatorDao");

        String indicatorUuid = (String)indicatorMap.get("uuid");
        Indicator oldIndicator = null;
        if(indicatorUuid != null) {
            oldIndicator = indicatorDao.findByUuid((String)indicatorMap.get("uuid"));
        }

        Indicator indicator = new Indicator();
        indicator.fromGsonMap(indicatorMap);
        indicator.setHarvesterid(configuration.getId());

        if(oldIndicator != null) {
            indicator.setId(oldIndicator.getId());
            Integer count = infoMap.get("updated");
            infoMap.put("updated", count + 1);
        }
        indicatorDao.save(indicator);
        Integer count = infoMap.get("total");
        infoMap.put("total", count + 1);

        logger.info("Harvesting indicator : " + indicator.getName());


    }

    public void storeHistoryFailure(Exchange exchange) {
        HarvesterParameter configuration = (HarvesterParameter) exchange.getProperty("configuration");
        HarvestHistoryDao repository =
                (HarvestHistoryDao)exchange.getContext().getRegistry().lookupByName("harvestHistoryDao");

        HarvestHistory history = new HarvestHistory();
        Date created = exchange.getProperty(Exchange.CREATED_TIMESTAMP, Date.class);

        history.setHarvestDate(created);
        history.setHarvesterId(configuration.getId());
        history.setHarvestUuid(configuration.getHarvestUuid());
        history.setDeleted('e');
        repository.save(history);

    }

    public void storeHistory(Exchange exchange) throws JSONException {

        HarvesterParameter configuration = (HarvesterParameter) exchange.getProperty("configuration");
        Map infoMap =  (Map)exchange.getProperty("harvestInfo");
        HarvestHistoryDao repository =
                (HarvestHistoryDao)exchange.getContext().getRegistry().lookupByName("harvestHistoryDao");

        Date created = exchange.getProperty(Exchange.CREATED_TIMESTAMP, Date.class);
        Date now = new Date();
        long elapsed = now.getTime() - created.getTime();

        HarvestHistory history = new HarvestHistory();
        history.setElapsedTime(elapsed);
        history.setHarvestDate(created);
        history.setHarvestUuid(configuration.getHarvestUuid());
        history.setHarvesterId(configuration.getId());

        JSONObject info = new JSONObject();
        info.put("total", infoMap.get("total"));
        info.put("updated", infoMap.get("updated"));
        history.setInfo(info.toString());

        repository.save(history);
    }
}
