package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(schema = "public", name = "harvester")
public class Harvester implements Serializable {

    @Id
    @SequenceGenerator(name="harvester_seq", sequenceName="harvester_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "harvester_seq")
    private Long id;

    private String name;
    private String url;
    private String cron;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCron() {
        return cron;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("name", this.name);
        res.put("url", this.url);
        res.put("cron", this.cron);

        return res;
    }

    public void fromJSON(final String config) throws JSONException {
        JSONObject obj = new JSONObject(config);
        setName(obj.optString("name"));
        setUrl(obj.optString("url"));
        setId(obj.optLong("id"));
        setCron(obj.optString("cron"));
    }


}
