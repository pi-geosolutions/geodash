package fr.pigeo.geodash.harvesters.worker;

import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import org.apache.camel.Exchange;
import org.apache.jcs.access.exception.InvalidArgumentException;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by florent on 13/10/16.
 */
public class IndicatorsHarvester {

    Logger logger = Logger.getLogger(HarvesterRouteBuilder.LOGGER_NAME);

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

    public void harvest(Exchange exchange) throws InvalidArgumentException {
        Map indicator =  (Map)exchange.getProperty("harvestRef");
        if (indicator == null) {
            throw new InvalidArgumentException("Missing Indicators harvester configuration.");
        }

        logger.warn("#### Harvesting indicator : " + indicator.get("id"));


    }

}
