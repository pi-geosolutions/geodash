package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.dao.RemoteDao;
import fr.pigeo.geodash.model.Remote;
import fr.pigeo.geodash.model.RemotePK;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.net.URLDecoder;

@RestController
@RequestMapping("/remotes")
public class RemoteController {


	private static final Log LOG = LogFactory.getLog(RemoteController.class.getName());

	@Autowired
	private RemoteDao remoteDao;


	@RequestMapping(value = "/", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	public byte[] list(HttpServletRequest request, HttpServletResponse response ) throws IOException {
		try {
			JSONArray ret = new JSONArray();
			for(Remote remote : this.remoteDao.findAll()) {
				ret.put(remote.toJSON());
			}
			//return ret.toString().getBytes("UTF-8");
			return ret.toString().getBytes();

		} catch (Exception e) {
			LOG.error(e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			throw new IOException(e);
		}
	}

	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	@ResponseBody
	public Remote get(@PathVariable("id") long id) {
		return this.remoteDao.findOne(id);
	}

	@RequestMapping(method = RequestMethod.POST, consumes = {"application/json"}, produces="application/json")
	@ResponseBody
	public String create(
			@RequestBody String config) throws Exception {

		Remote remote = new Remote();
		remote.fromJSON(config);

		remote = this.remoteDao.save(remote);
		return "{\"id\":" + remote.getRemotePK().getId() + "}";
	}

	@RequestMapping(value="/{id}", method=RequestMethod.PUT)
	public Remote update(@PathVariable("id") long id, @RequestBody String config) throws JSONException {
		Remote remote = new Remote();
		remote.fromJSON(config);
		return this.remoteDao.save(remote);
	}

	@RequestMapping(value="/", method=RequestMethod.DELETE)
	@ResponseBody
	public String delete(
			@RequestBody (required = false) String config,
			@RequestParam (required = false) String url
			) throws Exception {

		if(config != null) {
			Remote remote = new Remote();
			remote.fromJSON(config);
			this.remoteDao.delete(remote);
		}
		else if(url != null) {
			this.remoteDao.deleteByRemotePK_Url(URLDecoder.decode(url, "UTF-8"));
		}
		return "{\"success\":\"true\"}";
	}

}