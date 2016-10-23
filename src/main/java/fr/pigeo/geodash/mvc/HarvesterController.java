package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.HarvestHistoryDao;
import fr.pigeo.geodash.dao.HarvesterDao;
import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.harvesters.event.HarvesterEvent;
import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import fr.pigeo.geodash.harvesters.worker.HarvesterRouteBuilder;
import fr.pigeo.geodash.messaging.JMSMessager;
import fr.pigeo.geodash.model.HarvestHistory;
import fr.pigeo.geodash.model.Harvester;
import fr.pigeo.geodash.model.Indicator;
import fr.pigeo.geodash.mvc.services.HarvesterService;
import fr.pigeo.geodash.mvc.services.RouteService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/harvesters")
public class HarvesterController {


	private static final Log LOG = LogFactory.getLog(HarvesterController.class.getName());

	@Autowired
	private ApplicationContext appContext;

	@Autowired
	private HarvesterDao harvesterRepository;

	@Autowired
	private HarvestHistoryDao harvestHistoryRepository;

	@Autowired
	private IndicatorDao indicatorRepository;

	@Autowired
	private RouteService routeService;

	@Autowired
	private HarvesterService harvesterService;

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

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces="application/json; charset=utf-8")
	@ResponseBody
	public String get(
			@PathVariable Long id) throws JSONException {
		return "true";

	}

	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	@ResponseBody
	public Harvester get(@PathVariable("id") long id) {
		return this.harvesterRepository.findOne(id);
	}

	@RequestMapping(method = RequestMethod.POST, consumes = {"application/json"}, produces="application/json")
	@ResponseBody
	public String create(
			@RequestBody String config) throws Exception {

		Harvester harvester = new Harvester();
		harvester.fromJSON(config);

		harvester = this.harvesterRepository.save(harvester);
		routeService.updateCronRoute(harvester);
		return "{\"id\":" + harvester.getId() + "}";
	}

	@RequestMapping(value="/{id}", method=RequestMethod.PUT)
	public Harvester update(@PathVariable("id") long id, @RequestBody String config) throws JSONException {
		Harvester harvester = new Harvester();
		harvester.fromJSON(config);
		return this.harvesterRepository.save(harvester);
	}

	@RequestMapping(value="/{id}", method=RequestMethod.DELETE)
	@ResponseBody
	public String delete(@PathVariable("id") long id) throws Exception {
		this.harvesterRepository.delete(id);
		routeService.deleteCronRoute(id);
		return "{\"success\":\"true\"}";
	}

	@RequestMapping(value = "/run/{harvesterId}", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String run(
			@PathVariable Long harvesterId,
			HttpServletResponse response) throws IOException {

		try {
			LOG.warn("Run harvester ID: " + harvesterId);
			Harvester harvester = harvesterRepository.findOne(harvesterId);

			HarvesterParameter harvesterParameter = harvesterService.createParameter(harvester);
			HarvesterEvent event = new HarvesterEvent(appContext, harvesterParameter);

			jmsMessager.sendMessage(HarvesterRouteBuilder.MESSAGE_HARVEST_INDICATORS, event);

			return "{\"uuid\":\"" + harvesterParameter.getHarvestUuid() + "\"}";

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/status/{harvestUuid}", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String status(@PathVariable String harvestUuid) throws IOException {

		try {
			LOG.warn("Get harvesting status: " + harvestUuid);
			HarvestHistory history = harvestHistoryRepository.findByHarvestUuid(harvestUuid);
			if(history == null) {
				return "{\"status\":\"ko\"}";
			}
			return history.toJSON().toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/{id}/history", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String history(@PathVariable Long id, HttpServletResponse response) throws IOException {

		try {
			JSONArray ret = new JSONArray();
			for(HarvestHistory history : harvestHistoryRepository.findByHarvesterId(id, new Sort(Sort.Direction.DESC, "harvestDate"))) {
				ret.put(history.toJSON());
			}
			//return ret.toString().getBytes("UTF-8");
			return ret.toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/{id}/history", method = RequestMethod.DELETE, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String deleteHistory(@PathVariable Long id, HttpServletResponse response) throws IOException {
		harvestHistoryRepository.deleteByHarvesterId(id);
		return "{\"success\":\"true\"}";
	}

	@RequestMapping(value = "/{id}/history", method = RequestMethod.POST, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String createHistory(@PathVariable Long id, @RequestBody String config) throws IOException, JSONException {
		HarvestHistory history = new HarvestHistory();
		history.fromJSON(config);
		history.setHarvesterId(id);
		if(history.getHarvestDate() == null) {
			history.setHarvestDate(new Date());
		}
		this.harvestHistoryRepository.save(history);
		return "{\"success\":\"true\"}";
	}

	@RequestMapping(value = "/{id}/indicators", method = RequestMethod.DELETE, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public String deleteIndicators(@PathVariable Long id, HttpServletResponse response) throws IOException, JSONException {
		List<Indicator> indicators = indicatorRepository.deleteByHarvesterid(id);
		JSONObject ret = new JSONObject();
		ret.put("success", true);
		ret.put("removed", indicators.size());
		ret.put("harvesterId", id);
		return ret.toString();
	}

}