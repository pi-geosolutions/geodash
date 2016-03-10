package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao extends CrudRepository<User, Long> {

    public List<User> findAll();
    public List<User> findByFirstname(String firstname);
    public List<User> findByLastname(String lastname);

}
