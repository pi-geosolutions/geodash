package fr.pigeo.geodash.harvesters.worker;

import fr.pigeo.geodash.dao.HarvesterDao;
import fr.pigeo.geodash.dao.IndicatorDao;
import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.http4.HttpOperationFailedException;
import org.apache.camel.converter.jaxb.JaxbDataFormat;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.apache.camel.routepolicy.quartz2.SimpleScheduledRoutePolicy;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;

/**
 * Created by florent on 13/10/16.
 */

@Component
@Configurable
public class HarvesterRouteBuilder extends RouteBuilder {

    public static final String LOGGER_NAME = "geodash.harvest.indicators";
    public static final String MESSAGE_HARVEST_INDICATORS = "harvest-indicators";

    @Override
    public void configure() throws Exception {

        /* Route on spring event appContext.publishEvent() where body is the url as a string */
        from("spring-event:default")
                .id("harvest-indicators-from-spring-event")
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
                .errorHandler(loggingErrorHandler("fr.pigeo.geodash.harvesters"))
                .log(LoggingLevel.INFO, LOGGER_NAME, "Harvest indicators JMS message received.")
                .setProperty("configuration", simple("${body.parameters}"))
                .setHeader("Exchange.HTTP_METHOD", constant("GET"))
                .setHeader("Exchange.HTTP_URI", simple("${property.configuration.url}"))
                .setBody(simple(""))
                .to("http4://temp?throwExceptionOnFailure=false")
                .streamCaching()
                .setHeader("Exchange.HTTP_RESPONSE_CODE", simple("${in.header.CamelHttpResponseCode}"))
                .choice()
                    .when(header(Exchange.HTTP_RESPONSE_CODE).isEqualTo("404"))
                        .log(LoggingLevel.INFO, LOGGER_NAME, "Harvesting failure - store history")
                        .bean(IndicatorsHarvester.class, "storeHistoryFailure")
                    .otherwise()
                        .unmarshal().json(JsonLibrary.Gson, ArrayList.class)
                        .bean(IndicatorsHarvester.class, "clean")
                        .split(body())
                            .setProperty("indicator", simple("${body}"))
                            .bean(IndicatorsHarvester.class, "storeIndicator")
                        .end()
                        .bean(IndicatorsHarvester.class, "storeHistory")
                .endChoice()
                .log(LoggingLevel.INFO, LOGGER_NAME, "Harvesting ending");


        //from("quartz2://myGroup/myTimerName?cron=0/2+*+*+*+*+?").to("activemq:Totally.Rocks");

/*
        from("activemq:queue:Totally.Rocks?concurrentConsumers=5")
                 .log(LoggingLevel.INFO, LOGGER_NAME, "****** CRON message received.");
*/

        /*from("jpa:fr.pigeo.geodash.model.Harvester?consumer.query=select h.id, h.name from fr.pigeo.geodash.model.Harvester h")
                .routePolicy(policy)
                .marshal().json(JsonLibrary.Gson, ArrayList.class)
                .log("${body}");*/


    }

}
