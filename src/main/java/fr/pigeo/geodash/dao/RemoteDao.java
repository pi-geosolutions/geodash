package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.Harvester;
import fr.pigeo.geodash.model.Remote;
import fr.pigeo.geodash.model.RemotePK;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemoteDao extends CrudRepository<Remote, Long> {

    public List<Remote> findAll();
    //public void delete(RemotePK pk);
}
