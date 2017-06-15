package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.indicator.Indicator;
import fr.pigeo.geodash.indicator.config.Config;
import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Controller
@RequestMapping("/geodata")
public class GetData
{

    @Autowired
    JdbcTemplate jdbcTemplate;

    @RequestMapping(value="/{lon}/{lat}", method = RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String exec(HttpServletRequest request,
                       HttpServletResponse response,
                       @RequestParam String config,
                       @PathVariable String lon,
                       @PathVariable String lat) throws Exception {

        JSONObject res = null;
        Config oConfig = new Config(config);
        Indicator indicator = new Indicator(oConfig);

        try {
            res =  indicator.process(Double.parseDouble(lon), Double.parseDouble(lat));
        } catch (Exception e) {
            res = new JSONObject();
            res.put("error", e.getMessage());
            res.put("cause", e.getCause());
        }
        return res.toString();
	}

    @RequestMapping(value="/serie/{lon}/{lat}", method = RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSerie(HttpServletRequest request,
                       HttpServletResponse response,
                       @RequestParam String config,
                       @RequestParam (required = false) String year,
                       @PathVariable String lon,
                       @PathVariable String lat) throws Exception {

        JSONObject res = null;
        DataSourceConfig dsConfig = DataSourceConfig.createConfig(config);
        dsConfig.setOptYear(year);
        Indicator indicator = new Indicator(dsConfig);

        try {
            res =  indicator.process(Double.parseDouble(lon), Double.parseDouble(lat));
        } catch (Exception e) {
            res = new JSONObject();
            res.put("error", e.getMessage());
            res.put("cause", e.getCause());
            throw e;
        }
        return res.toString();
    }

}
