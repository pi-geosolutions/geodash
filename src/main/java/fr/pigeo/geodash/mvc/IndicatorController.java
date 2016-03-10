package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.dao.PersonDao;
import fr.pigeo.geodash.dao.UserDao;
import fr.pigeo.geodash.model.Indicator;
import fr.pigeo.geodash.model.Person;
import fr.pigeo.geodash.model.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;

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
			return new JSONObject().put("indicators", ret).toString();

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
			return new JSONObject().put("indicators", ret).toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/add/{userid}/{name}", method = RequestMethod.GET, produces="application/json; charset=utf-8")
	@ResponseBody
	public String addPerson(@PathVariable Long userid, @PathVariable String name){

		User user = this.userRepository.findOne(userid);
		Indicator indicator = new Indicator();
		indicator.setUser(user);
		indicator.setName(name);
		this.indicatorRepository.save(indicator);

		return "Indicator created with ID : " + indicator.getId();
	}
}