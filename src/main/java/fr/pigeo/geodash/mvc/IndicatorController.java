package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.dao.UserDao;
import fr.pigeo.geodash.model.Indicator;
import fr.pigeo.geodash.model.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/indicators")
public class IndicatorController {

	@Autowired
	private IndicatorDao indicatorRepository;

	@Autowired
	private UserDao userRepository;

	private static final Log LOG = LogFactory.getLog(IndicatorController.class.getName());

	@RequestMapping(value = "/", method = RequestMethod.GET)
	@ResponseBody
	public String findAll(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(Indicator indicator : this.indicatorRepository.findAll()) {
				ret.put(indicator.toJSON());
			}
			return ret.toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/{userid}", method = RequestMethod.GET)
	@ResponseBody
	public String findByUserid(
			@PathVariable Long userid,
			HttpServletRequest request,
			HttpServletResponse response ) throws IOException {
		try {
			User user = this.userRepository.findOne(userid);
			JSONArray ret = new JSONArray();
			for(Indicator indicator : user.getIndicators()) {
				ret.put(indicator.toJSON());
			}
			return ret.toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/add/{userid}/{name}", method = RequestMethod.GET, produces="application/json; charset=utf-8")
	@ResponseBody
	public String add(@PathVariable Long userid, @PathVariable String name){

		User user = this.userRepository.findOne(userid);
		Indicator indicator = new Indicator();
		indicator.setUser(user);
		indicator.setName(name);
		this.indicatorRepository.save(indicator);

		return "Indicator created with ID : " + indicator.getId();
	}

	@RequestMapping(value = "/create/{userid}/", method = RequestMethod.POST, produces="application/json; charset=utf-8")
	@ResponseBody
	public String create(@PathVariable Long userid, @RequestParam(required = false) Long id, @RequestParam String name,
                         @RequestParam String config) throws JSONException {

        User user = this.userRepository.findOne(userid);
        Indicator indicator;

        if(id != null) {
            indicator = indicatorRepository.findOne(id);
        }
        else {
            indicator = new Indicator();
            indicator.setUser(user);
        }

        indicator.setName(name);
        indicator.setConfig(config);
        this.indicatorRepository.save(indicator);

        return "Indicator created with ID : " + indicator.getId();
	}

}