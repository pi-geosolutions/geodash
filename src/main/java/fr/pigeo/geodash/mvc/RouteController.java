package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.HarvesterDao;
import fr.pigeo.geodash.model.Harvester;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.Route;
import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/route")
public class RouteController {


	private static final Log LOG = LogFactory.getLog(RouteController.class.getName());

	@Autowired
	private ApplicationContext appContext;

	@Autowired
	private HarvesterDao harvesterRepository;

	private static final String HARVESTER_ROUTE_ID = "cronRoute_harvester_";

	@RequestMapping(value = "/", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String list(HttpServletRequest request, HttpServletResponse response ) throws Exception {
		CamelContext camelContext = (CamelContext)appContext.getBean("harvest-indicator");

		List<String> routeIds = new ArrayList<String>();
		for(Route route : camelContext.getRoutes()) {
			routeIds.add(route.getId());
		}
		return routeIds.toString();
	}

	@RequestMapping(value = "/clear", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String clearRoutes(HttpServletRequest request, HttpServletResponse response ) throws Exception {
		CamelContext camelContext = (CamelContext)appContext.getBean("harvest-indicator");
		int count = 0;
		JSONObject ret = new JSONObject();
		for(Route route : camelContext.getRoutes()) {
			if (route.getId().startsWith(HARVESTER_ROUTE_ID)) {
				//camelContext.stopRoute(route.getId());
				camelContext.removeRoute(route.getId());
				count ++;
			}
		}
		ret.put("removed", count);
		return ret.toString();
	}
}