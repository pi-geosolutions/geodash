package fr.pigeo.geodash.harvesters.worker;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.gson.GsonDataFormat;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by florent on 13/10/16.
 */
public class HarvesterRouteBuilder extends RouteBuilder {

    public static final String LOGGER_NAME = "geodash.harvest.indicators";
    public static final String MESSAGE_HARVEST_INDICATORS = "harvest-indicators";
    static Logger log = Logger.getLogger(HarvesterRouteBuilder.class.getName());


    @Override
    public void configure() throws Exception {

        log.warn("INIT CAMEL ROOT");
        from("http4://pigeo.fr:8182/geodash/indicators/user/2")
                .id("harvest-indicators")
                .autoStartup(false)
                .log(LoggingLevel.DEBUG, LOGGER_NAME, "Content is: ${body}")
                .log(LoggingLevel.WARN, LOGGER_NAME, "################# RECEIVING");

        /* Route on spring event appContext.publishEvent() where body is the url as a string */
        from("spring-event:default")
                .filter(body().startsWith("http"))
                .log(LoggingLevel.INFO, LOGGER_NAME, "Harvest indicators spring message received.")
                .log(LoggingLevel.INFO, LOGGER_NAME, "${body}")
                .setHeader("Exchange.HTTP_METHOD", constant("GET"))
                .setHeader("Exchange.HTTP_URI", simple("${body}"))
                .setBody(simple(""))
                .to("http4://temp")
                .log(LoggingLevel.WARN, LOGGER_NAME, "${body}");

        /* Route on JMS */
        from("activemq:queue:" + MESSAGE_HARVEST_INDICATORS + "?concurrentConsumers=5")
                .id("harvest-indicators-from-jms")
                .log(LoggingLevel.INFO, LOGGER_NAME, "Harvest indicators JMS message received.")
                .log(LoggingLevel.INFO, LOGGER_NAME, "${body}")
                .setProperty("configuration", simple("${body.parameters}"))
                .bean(IndicatorsHarvester.class, "initialize(*, true)")
                .setHeader("Exchange.HTTP_METHOD", constant("GET"))
                .setHeader("Exchange.HTTP_URI", simple("${property.configuration.url}"))
                .setBody(simple(""))
                .to("http4://temp")
                .streamCaching()
                .unmarshal().json(JsonLibrary.Gson, ArrayList.class)
                .split(body())
                    .setProperty("harvestRef", simple("${body}"))
                    .bean(IndicatorsHarvester.class, "harvest")
                .end()
                .log(LoggingLevel.INFO, LOGGER_NAME, "Harvesting ending");


    }

}
