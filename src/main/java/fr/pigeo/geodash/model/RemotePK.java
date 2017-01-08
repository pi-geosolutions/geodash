package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class RemotePK implements Serializable {

    private Long id;
    private String url;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (!(obj instanceof RemotePK)) return false;
        if (obj == null) return false;
        RemotePK pk = (RemotePK) obj;
        return pk.id == id && pk.url.equals(url);
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("url", this.url);
        return res;
    }

    public void fromJSON(final String config) throws JSONException {
        JSONObject obj = new JSONObject(config);
        setUrl(obj.optString("url"));
        setId(obj.optLong("id"));
    }


}
