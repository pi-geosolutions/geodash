package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;

@Entity
@Table(schema = "public", name = "harvester")
public class Harvester {

    @Id
    @SequenceGenerator(name="harvester_seq", sequenceName="harvester_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "harvester_seq")
    private Long id;

    private String name;
    private String url;


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

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("name", this.name);
        res.put("url", this.url);

        return res;
    }

}
