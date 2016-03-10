package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.Indicator;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndicatorDao extends CrudRepository<Indicator, Long> {

    public List<Indicator> findAll();

}
