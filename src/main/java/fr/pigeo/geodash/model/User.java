package fr.pigeo.geodash.model;

import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(schema = "public", name = "user")
public class User {

    @Id
    @SequenceGenerator(name="user_seq", sequenceName="user_seq", initialValue=1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    private Long id;

    private String firstname;
    private String lastname;
    private String login;
    private String password;

    /*@OneToMany(fetch = FetchType.EAGER, mappedBy = "user", cascade = CascadeType.REFRESH)
    private List<Indicator> indicators;*/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Person [id=" + id + ", firstname=" + firstname + ", lastname=" + lastname
                + "]";
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject res = new JSONObject();
        res.put("id", this.id);
        res.put("firstname", this.firstname);
        res.put("lastname", this.lastname);
        res.put("login", this.login);
        return res;
    }
}
