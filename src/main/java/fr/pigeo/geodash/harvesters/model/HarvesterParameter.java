package fr.pigeo.geodash.harvesters.model;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.Map;

/**
 * Created by florent on 13/10/16.
 */
public class HarvesterParameter implements Serializable {

    private String url;
    private Long id;
    private String harvestUuid;

    private int timeOut = 60000;

    public HarvesterParameter() {}
    public HarvesterParameter(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHarvestUuid() {
        return harvestUuid;
    }

    public void setHarvestUuid(String harvestUuid) {
        this.harvestUuid = harvestUuid;
    }

    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer(this.getClass().getSimpleName());
        sb.append("\nurl: ").append(url);
        return sb.toString();
    }

    private static final long serialVersionUID = 7526471155622776147L;

}
