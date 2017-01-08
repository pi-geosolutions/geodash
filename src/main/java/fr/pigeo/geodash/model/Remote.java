package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Map;

@Entity
@Table(schema = "public", name = "remote")
public class Remote implements Serializable {

    @EmbeddedId private RemotePK remotePK;

    private String name;
    private String label;

    public RemotePK getRemotePK() {
        return remotePK;
    }

    public void setRemotePK(RemotePK remotePK) {
        this.remotePK = remotePK;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject o = remotePK.toJSON();
        o.put("name", name);
        o.put("label", label);
        return o;
    }

    public void fromJSON(final String config) throws JSONException {
        JSONObject obj = new JSONObject(config);
        RemotePK pk = new RemotePK();
        pk.setUrl(obj.optString("url"));
        pk.setId(obj.optLong("id"));
        setName(obj.optString("name"));
        setLabel(obj.optString("label"));
        setRemotePK(pk);
    }

}
