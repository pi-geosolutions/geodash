package fr.pigeo.geodash.indicator;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.JdbcUtils;

public class DataRowMapper implements RowMapper
{

    public Object mapRow(ResultSet rs, int rowNum) throws SQLException {

        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();
        JSONObject obj = new JSONObject();

        for (int index = 1; index <= columnCount; index++) {
            String column = JdbcUtils.lookupColumnName(rsmd, index);
            Object value = rs.getObject(column);

            try {
                if(value instanceof String) {
                    String svalue = ((String)value).trim();
                    obj.put(column, svalue);
                }
                else {
                    obj.put(column, value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
                throw new IllegalArgumentException("Cannot map to JSON => " + column + " : " + value);
            }
        }
        return obj;
    }

}