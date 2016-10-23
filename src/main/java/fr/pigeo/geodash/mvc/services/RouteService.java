package fr.pigeo.geodash.mvc.services;

import fr.pigeo.geodash.harvesters.event.HarvesterEvent;
import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import fr.pigeo.geodash.harvesters.worker.HarvesterRouteBuilder;
import fr.pigeo.geodash.messaging.JMSMessager;
import fr.pigeo.geodash.model.Harvester;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.Route;
import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by fgravin on 25/04/2016.
 */

@Service
public class RouteService {

    @Autowired
    private ApplicationContext appContext;

    @Autowired
    private HarvesterService harvesterService;

    @Autowired
    private JMSMessager jmsMessager;

    private CamelContext camelContext;
    private static final String HARVESTER_ROUTE_ID = "cronRoute_harvester_";
    private static final Log LOG = LogFactory.getLog(RouteService.class.getName());

    @PostConstruct
    public void init() {
        camelContext = (CamelContext)appContext.getBean("harvest-indicator");
    }

    public void updateCronRoute(final Harvester harvester) throws Exception {
        List<Harvester> harvesters = new ArrayList<Harvester>();
        harvesters.add(harvester);
        camelContext.addRoutes(createMyRoutes(harvesters));
    }

    public void deleteCronRoute(final long id) throws Exception {
        for(Route route : camelContext.getRoutes()) {
            if(route.getId().equals(HARVESTER_ROUTE_ID + id)) {
                camelContext.removeRoute(route.getId());
                LOG.info("Removing route : " + route.getId());
            }
        }
    }

    public RouteBuilder createMyRoutes(final List<Harvester> harvesters) throws Exception {
        return new RouteBuilder() {
            @Override
            public void configure() throws Exception {

                for(Harvester harvester : harvesters) {
                    String routeId = HARVESTER_ROUTE_ID + harvester.getId();
                    HarvesterParameter harvesterParameter = harvesterService.createParameter(harvester);
                    final HarvesterEvent event = new HarvesterEvent(appContext, harvesterParameter);

                    LOG.info("Adding route : " + routeId);
                    if(harvester.getCron() != null)
                        from("quartz2://harvester/scheduler?cron="+harvester.getCron())
                                .routeId(routeId)
                        .process(new Processor() {
                            @Override
                            public void process(Exchange exchange) throws Exception {
                                jmsMessager.sendMessage(HarvesterRouteBuilder.MESSAGE_HARVEST_INDICATORS, event);
                            }
                        });
                }
            }
        };
    }

}
