package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;

@Entity
@Table(schema = "public", name = "indicator")
public class Indicator {

    @Id
    @SequenceGenerator(name="indicator_seq", sequenceName="indicator_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "indicator_seq")
    private Long id;

    private String name;
    private String config;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="userid")
    private User user;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("name", this.name);
        res.put("userid", this.user.getId());

        if(config != null && !config.equals("")) {
            JSONObject config = new JSONObject(this.config);
            res.put("config", config);
        }
        return res;
    }

}
