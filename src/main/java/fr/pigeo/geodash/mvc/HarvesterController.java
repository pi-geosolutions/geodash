package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.HarvesterDao;
import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.harvesters.event.HarvesterEvent;
import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import fr.pigeo.geodash.harvesters.worker.HarvesterRouteBuilder;
import fr.pigeo.geodash.messaging.JMSMessager;
import fr.pigeo.geodash.model.Harvester;
import fr.pigeo.geodash.model.Indicator;
import fr.pigeo.geodash.model.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/harvesters")
public class HarvesterController {


	private static final Log LOG = LogFactory.getLog(HarvesterController.class.getName());

	@Autowired
	private ApplicationContext appContext;

	@Autowired
	private HarvesterDao harvesterRepository;

	@Autowired
	private JMSMessager jmsMessager;

	@RequestMapping(value = "/", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public byte[] list(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(Harvester harvester : this.harvesterRepository.findAll()) {
				ret.put(harvester.toJSON());
			}
			//return ret.toString().getBytes("UTF-8");
			return ret.toString().getBytes();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/create/", method = RequestMethod.POST, produces="application/json; charset=utf-8")
	@ResponseBody
	public String create(
			@PathVariable Long userid,
			@RequestParam(required = false) Long id,
			@RequestParam String name,
			@RequestParam String config) throws JSONException {
		return "true";

	}

	@RequestMapping(value = "/run/{harvesterId}", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String run(
			@PathVariable Long harvesterId,
			HttpServletRequest request,
			HttpServletResponse response) throws IOException {


		try {
			LOG.warn("Run harvester ID: " + harvesterId);

			HarvesterParameter harvesterParameter = new HarvesterParameter("http://pigeo.fr:8182/geodash/indicators/user/1");
			HarvesterEvent event = new HarvesterEvent(appContext, harvesterParameter);
			appContext.publishEvent(event);

			jmsMessager.sendMessage(HarvesterRouteBuilder.MESSAGE_HARVEST_INDICATORS, event);

			return harvesterParameter.toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

}