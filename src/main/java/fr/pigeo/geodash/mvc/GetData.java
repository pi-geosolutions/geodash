package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.indicator.Indicator;
import fr.pigeo.geodash.indicator.config.Config;
import fr.pigeo.geodash.indicator.config.DataSourceConfig;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;


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
                       @PathVariable String lat) throws IOException, JSONException {

        Config oConfig = new Config(config);
        Indicator indicator = new Indicator(oConfig);
        List res = null;
        try {
            res = indicator.process(Double.parseDouble(lon), Double.parseDouble(lat));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return res.toString();

	}

    @RequestMapping(value="/serie/{lon}/{lat}", method = RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSerie(HttpServletRequest request,
                       HttpServletResponse response,
                       @RequestParam String config,
                       @PathVariable String lon,
                       @PathVariable String lat) throws IOException, JSONException {

        DataSourceConfig dsConfig = DataSourceConfig.createConfig(config);
        Indicator indicator = new Indicator(dsConfig);
        List res = null;
        try {
            res = indicator.process(Double.parseDouble(lon), Double.parseDouble(lat));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return res.toString();

    }

}
