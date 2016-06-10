var module = angular.module('geodash');



var Indicator = function($http, $q, Transformer, gdUtils) {
  this.$http = $http;
  this.$q = $q;
  this.Transformer = Transformer;
  this.gdUtils = gdUtils;
};

Indicator.prototype.getGraph = function(config, lon, lat) {

  var promises = [];
  config.datasources.forEach(function(ds) {
    promises.push(this.getSerie(ds, lon, lat));
  }.bind(this));

  return this.$q.all(promises).then(function(datasources) {
    var chartConfig = this.gdUtils.aceParse(config.chartConfig);

    var nextIdx = -1;
    datasources.forEach(function(ds, idx) {

      // Multiple series
      if(angular.isArray(ds[0][0])) {
        ds.forEach(function(serie, i) {
          chartConfig.series[++nextIdx].data = serie;
        });
      }
      else { // single serie
        // Merge with previous serie
        if(config.datasources[idx].merge && idx) {
          var previous = chartConfig.series[nextIdx].data;
          previous.forEach(function(value, i) {
            previous[i] = previous[i].concat(ds[i]);
          });
        }
        else {
          chartConfig.series[++nextIdx].data = ds;
        }
      }
    });

    return chartConfig;
  }.bind(this));
};

Indicator.prototype.getSerie = function(datasource, lon, lat) {
  return this.$http({
    url : '../../geodata/serie/' + lon + '/' + lat + '/',
    method: 'POST',
    data: $.param({
      config: JSON.stringify(datasource)
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function(response) {
    var serie = response.data;
    if(datasource.transform) {
      serie = this.Transformer.transform(serie,
          JSON.parse(datasource.transform));
    }
    return serie;
  }.bind(this));
};

angular.module('geodash')
    .service('IndicatorService', ['$http', '$q', 'Transformer', 'gdUtils',
      Indicator]);

