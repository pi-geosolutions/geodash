package fr.pigeo.geodash.harvesters.event;

/**
 * Created by florent on 13/10/16.
 */

import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import org.springframework.context.ApplicationEvent;

public class HarvesterEvent extends ApplicationEvent {


    private HarvesterParameter parameters;

    public HarvesterEvent setParameters(HarvesterParameter parameters) {
        this.parameters = parameters;
        return this;
    }

    public HarvesterParameter getParameters() {
        return parameters;
    }

    public HarvesterEvent(Object source, HarvesterParameter parameters) {
        super(source);
        this.parameters = parameters;
    }

    @Override
    public String toString() {
        //return parameters.getUrl();

        StringBuffer sb = new StringBuffer(this.getClass().getSimpleName());
        sb.append("\n").append(parameters.toString());
        return sb.toString();

    }
}