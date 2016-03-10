package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.UserDao;
import fr.pigeo.geodash.model.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserDao repository;

	@Autowired
	private DriverManagerDataSource dataSource;

	@Autowired
	private JpaTransactionManager tm;

	private static final Log LOG = LogFactory.getLog(UserController.class.getName());

	@RequestMapping(value = "/", method = RequestMethod.GET)
	@ResponseBody
	public String findAll(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(User user : this.repository.findAll()) {
				ret.put(user.toJSON());
			}
			return new JSONObject().put("users", ret).toString();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value = "/add/{firstname}/{lastname}", method = RequestMethod.GET, produces="application/json; charset=utf-8")
	@ResponseBody
	public String addPerson(@PathVariable String firstname, @PathVariable String lastname){

		User user = new User();
		user.setFirstname(firstname);
		user.setLastname(lastname);
		this.repository.save(user);

		return "User created with ID : " + user.getId();
	}

	@RequestMapping(value= "/delete/{id}", method=RequestMethod.DELETE)
	public void delete( HttpServletRequest request, HttpServletResponse response, @PathVariable Long id) throws IOException{
		this.repository.delete(id);
	}

}