package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Map;

@Entity
@Table(schema = "public", name = "remote")
public class Remote implements Serializable {

    @EmbeddedId
    private RemotePK remotePK;

    private String name;
    private String label;
    private String nodeLabel;

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

    public String getNodeLabel() {
        return nodeLabel;
    }

    public void setNodeLabel(String nodeLabel) {
        this.nodeLabel = nodeLabel;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject o = remotePK.toJSON();
        o.put("name", name);
        o.put("label", label);
        o.put("nodeLabel", nodeLabel);
        return o;
    }

    public void fromJSON(final String config) throws JSONException {
        JSONObject obj = new JSONObject(config);
        RemotePK pk = new RemotePK();
        pk.setUrl(obj.optString("url"));
        pk.setId(obj.optLong("id"));
        setName(obj.optString("name"));
        setLabel(obj.optString("label"));
        setNodeLabel(obj.optString("nodeLabel"));
        setRemotePK(pk);
    }

}
