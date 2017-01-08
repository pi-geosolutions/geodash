package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.util.Map;

@Entity
@Table(schema = "public", name = "indicator")
public class Indicator {

    @Id
    @SequenceGenerator(name="indicator_seq", sequenceName="indicator_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "indicator_seq")
    private Long id;

    private String uuid;
    private String name;

    @Column(columnDefinition = "TEXT")
    private String config;

    private Long harvesterid;
    private String nodeurl;

    /*@ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="userid")
    private User user;*/

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

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public Long getHarvesterid() {
        return harvesterid;
    }

    public void setHarvesterid(Long harvesterid) {
        this.harvesterid = harvesterid;
    }

    public String getNodeurl() {
        return nodeurl;
    }

    public void setNodeurl(String nodeurl) {
        this.nodeurl = nodeurl;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("uuid", this.uuid);
        res.put("name", this.name);
        res.put("harvesterid", this.harvesterid);
        res.put("nodeurl", this.nodeurl);

        if(config != null && !config.equals("")) {
            JSONObject config = new JSONObject(this.config);
            res.put("config", config);
        }
        return res;
    }

    public void fromGsonMap(Map<String, Object> map) {
        setName((String)map.get("name"));
        setUuid((String)map.get("uuid"));
        JSONObject json = new JSONObject((Map< String, String>)map.get("config"));
        setConfig(json.toString());
    }

}
