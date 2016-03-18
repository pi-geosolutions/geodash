package fr.pigeo.geodash.indicator;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONArray;
import org.springframework.jdbc.core.RowMapper;

public class DataRowMapper implements RowMapper
{
    public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
        JSONArray res = new JSONArray();
        return res;
    }

}