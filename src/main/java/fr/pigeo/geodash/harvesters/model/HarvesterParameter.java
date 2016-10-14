package fr.pigeo.geodash.harvesters.model;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.Map;

/**
 * Created by florent on 13/10/16.
 */
@XmlRootElement(name = "wfs")
public class HarvesterParameter implements Serializable {
    private String metadataUuid;

    private String url;

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


    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer(this.getClass().getSimpleName());
        sb.append("\nurl: ").append(url);
        return sb.toString();
    }

    private static final long serialVersionUID = 7526471155622776147L;

}
