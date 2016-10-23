package fr.pigeo.geodash.mvc.services;

import fr.pigeo.geodash.dao.IndicatorDao;
import fr.pigeo.geodash.harvesters.model.HarvesterParameter;
import fr.pigeo.geodash.model.Harvester;
import fr.pigeo.geodash.model.Indicator;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.geometry.DirectPosition2D;
import org.opengis.geometry.DirectPosition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * Created by fgravin on 25/04/2016.
 */

@Service
public class HarvesterService {

    @Autowired
    private IndicatorDao indicatorRepository;

    public HarvesterParameter createParameter(Harvester harvester) {
        String uuid = UUID.randomUUID().toString();
        HarvesterParameter harvesterParameter = new HarvesterParameter();
        harvesterParameter.setId(harvester.getId());
        harvesterParameter.setUrl(harvester.getUrl());
        harvesterParameter.setHarvestUuid(uuid);
        return harvesterParameter;
    }

    public void saveIndicator(Indicator indicator) {
        indicatorRepository.save(indicator);
    }
}
