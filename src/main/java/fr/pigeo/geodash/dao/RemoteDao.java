package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.Harvester;
import fr.pigeo.geodash.model.Remote;
import fr.pigeo.geodash.model.RemotePK;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RemoteDao extends CrudRepository<Remote, Long> {

    public List<Remote> findAll();

    @Transactional
    void deleteByRemotePK_Url(String url);
}
