package fr.pigeo.geodash.dao;

import fr.pigeo.geodash.model.HarvestHistory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository("harvestHistoryDao")
public interface HarvestHistoryDao extends CrudRepository<HarvestHistory, Long>, PagingAndSortingRepository<HarvestHistory, Long> {

    public List<HarvestHistory> findAll();
    //public List<HarvestHistory> findAllOrderByHarvestDateAsc();

    public HarvestHistory findByHarvestUuid(String harvestUuid);
    public List<HarvestHistory> findByHarvesterId(Long id);
    public List<HarvestHistory> findByHarvesterId(Long id, Sort sort);

    @Modifying
    @Transactional
    public void deleteByHarvesterId(Long harvesterId);

}
