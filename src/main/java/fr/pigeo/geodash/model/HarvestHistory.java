package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(schema = "public", name = "harvesthistory")
public class HarvestHistory implements Serializable {

    @Id
    @SequenceGenerator(name="harvesthistory_seq", sequenceName="harvesthistory_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "harvesthistory_seq")
    private Long id;
    private String harvestUuid;

    private Date harvestDate;
    private long elapsedTime;
    private Long harvesterId;
    private String harvesterName;
    private String harvesterType = "geodashNode";
    private char deleted = 'n';
    private String info;
    private String params;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "harvestuuid")
    public String getHarvestUuid() {
        return harvestUuid;
    }

    public void setHarvestUuid(String harvestUuid) {
        this.harvestUuid = harvestUuid;
    }

    @AttributeOverride(name = "dateAndTime", column = @Column(name = "harvestdate", length = 30))
    public Date getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(Date harvestDate) {
        this.harvestDate = harvestDate;
    }

    @Column(name = "elapsedtime")
    public long getElapsedTime() {
        return elapsedTime;
    }

    public void setElapsedTime(long elapsedTime) {
        this.elapsedTime = elapsedTime;
    }

    @Column(name = "harvesteruuid")
    public Long getHarvesterId() {
        return harvesterId;
    }

    public void setHarvesterId(Long harvesterId) {
        this.harvesterId = harvesterId;
    }

    @Column(name = "harvestername")
    public String getHarvesterName() {
        return harvesterName;
    }

    public void setHarvesterName(String harvesterName) {
        this.harvesterName = harvesterName;
    }

    public String getHarvesterType() {
        return harvesterType;
    }

    public void setHarvesterType(String harvesterType) {
        this.harvesterType = harvesterType;
    }

    public char getDeleted() {
        return deleted;
    }

    public void setDeleted(char deleted) {
        this.deleted = deleted;
    }

    @Column(columnDefinition = "TEXT")
    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        this.params = params;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("harvesterid", this.harvesterId);
        res.put("harvestername", this.harvesterName);
        res.put("harvestertype", this.harvesterType);
        res.put("harvestuuid", this.harvestUuid);
        res.put("harvestDate", this.harvestDate);
        res.put("elapsedtime", this.elapsedTime);
        res.put("deleted", Character.toString(this.deleted));
        if(this.info != null) {
            res.put("info", new JSONObject(this.info));
        }
        return res;
    }

    public void fromJSON(final String config) throws JSONException {
        JSONObject obj = new JSONObject(config);
        setDeleted(obj.optString("deleted").charAt(0));
        setHarvesterId(obj.optLong("harvesterid"));
        setElapsedTime(obj.optLong("elapsedTime"));
        setHarvestUuid(obj.optString("harvestUuid"));
        setHarvesterType(obj.optString("harvesterType"));
        setHarvesterName(obj.optString("harvesterName"));
        JSONObject info = obj.optJSONObject("info");
        if(info != null) {
            setInfo(info.toString());
        }

    }

}
