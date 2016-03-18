package fr.pigeo.geodash.mvc;

import fr.pigeo.geodash.indicator.Indicator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @RequestMapping(value="/{type}/{lon}/{lat}", method = RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String exec(HttpServletRequest request,
                       HttpServletResponse response,
                       @PathVariable String type,
                       @PathVariable String lon,
                       @PathVariable String lat) throws IOException {

        Indicator indicator = new Indicator();
        List res = null;
        try {
            res = indicator.getData();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return res.toString();

	}

}
