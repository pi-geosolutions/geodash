package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.Indicator;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository("indicatorDao")
public interface IndicatorDao extends CrudRepository<Indicator, Long> {

    public List<Indicator> findAll();
    public Indicator findByUuid(String uuid);

    @Modifying
    @Transactional
    public List<Indicator> deleteByHarvesterid(Long harvesterid);

    @Query
    public List<Indicator> findByEnabledTrue();

}
