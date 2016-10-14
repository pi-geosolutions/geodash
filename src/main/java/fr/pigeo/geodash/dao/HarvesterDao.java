package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.Harvester;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HarvesterDao extends CrudRepository<Harvester, Long> {

    public List<Harvester> findAll();

}
