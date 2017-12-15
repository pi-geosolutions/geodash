package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.dao.UserDao;
import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import fr.pigeo.geodash.indicator.LoaderPostgres;
import fr.pigeo.geodash.indicator.config.PostgresDataSourceConfig;
import fr.pigeo.geodash.model.Indicator;
import fr.pigeo.geodash.model.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@EnableWebMvc
@RequestMapping("/indicators")
public class IndicatorController {

	@Autowired
	private IndicatorDao indicatorRepository;

	@Autowired
	private UserDao userRepository;

	private static final Log LOG = LogFactory.getLog(IndicatorController.class.getName());

	@RequestMapping(value = "/", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@CrossOrigin(origins = "*")
	@ResponseBody
	public byte[] findAll(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(Indicator indicator : this.indicatorRepository.findAll()) {
				ret.put(indicator.toJSON());
			}
			//return ret.toString().getBytes("UTF-8");
			return ret.toString().getBytes();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/enabled/", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@CrossOrigin(origins = "*")
	@ResponseBody
	public byte[] findAllEnabled(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(Indicator indicator : this.indicatorRepository.findByEnabledTrue()) {
				ret.put(indicator.toJSON());
			}
			//return ret.toString().getBytes("UTF-8");
			return ret.toString().getBytes();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public byte[]  findByUserid(
			@PathVariable Long id,
			HttpServletResponse response) throws IOException {

		try {
			return this.indicatorRepository.findOne(id).toJSON().toString().getBytes();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

/*
	@RequestMapping(value = "/add/{userid}/{name}", method = RequestMethod.GET, produces="application/json; charset=utf-8")
	@ResponseBody
	public String add(@PathVariable Long userid, @PathVariable String name){

		Indicator indicator = new Indicator();
		indicator.setName(name);
		this.indicatorRepository.save(indicator);

		return "Indicator created with ID : " + indicator.getId();
	}
*/

	@RequestMapping(value = "/create/{userid}/", method = RequestMethod.POST, produces="application/json; charset=utf-8")
	@ResponseBody
	public String createWithUser(
			@PathVariable Long userid,
			@RequestParam(required = false) Long id,
			@RequestParam String name,
			@RequestParam String config) throws JSONException {

        Indicator indicator;

        if(id != null) {
            indicator = indicatorRepository.findOne(id);
        }
        else {
            indicator = new Indicator();
        }
        indicator.setName(name);
        indicator.setConfig(config);
        this.indicatorRepository.save(indicator);

        return "Indicator created with ID : " + indicator.getId();
	}

	@RequestMapping(value = "/save/", method = RequestMethod.POST, produces="application/json; charset=utf-8")
	@ResponseBody
	public String create(@RequestParam String name,
						 @RequestParam(required = false) Long id,
						 @RequestParam(required = false, defaultValue = "false") boolean enabled,
						 @RequestParam String config) throws JSONException {

		Indicator indicator;
		if(id != null) {
			indicator = indicatorRepository.findOne(id);
		}
		else {
			indicator = new Indicator();
            User user = this.userRepository.findOne(new Long(1));
        }

		indicator.setName(name);
		indicator.setConfig(config);
		indicator.setEnabled(enabled);
		this.indicatorRepository.save(indicator);

		return "{\"id\":" + indicator.getId() + "}";
	}

	@RequestMapping(value= "/delete/{id}", method=RequestMethod.DELETE)
	public String delete( HttpServletRequest request, HttpServletResponse response, @PathVariable Long id) throws IOException{
		this.indicatorRepository.delete(id);
		return "{\"success\":\"true\"}";

	}

}