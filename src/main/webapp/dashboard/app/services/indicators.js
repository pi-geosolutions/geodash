var module = angular.module('geodash');



var Indicator = function($http, $q, Transformer, gdUtils, appFlash) {
  this.$http = $http;
  this.$q = $q;
  this.Transformer = Transformer;
  this.gdUtils = gdUtils;
  this.appFlash = appFlash;
};

Indicator.prototype.getGraph = function(config, lon, lat) {

  var promises = [];
  config.datasources.forEach(function(ds) {
    promises.push(this.getSerie(ds, lon, lat));
  }.bind(this));

  return this.$q.all(promises).then(function(datasources) {
    try {
      var chartConfig = this.gdUtils.aceParse(config.chartConfig);
    }
    catch (e) {
      this.appFlash.create('danger', 'chart.json.parse');
      return;
    }

    var nextIdx = -1;
    datasources.forEach(function(ds, idx) {

      var data = ds.data;
      var categories = ds.categories;

      // Multiple series
      if(angular.isArray(data[0][0])) {
        data.forEach(function(serie, i) {
          chartConfig.series[++nextIdx].data = serie;
        });
      }
      else { // single serie

        var c = config.datasources[idx];
        // Merge with previous serie
        if(c.merge && idx) {
          var previous = chartConfig.series[nextIdx].data;
          if(!c.mergeType || c.mergeType == 'concat') {
            chartConfig.series[nextIdx].data = previous.map(function(value, i) {
              return value.concat(data[i]);
            });
          }
          else if(c.mergeType == 'percentage'){
            chartConfig.series[nextIdx].data = previous.map(function(value, i) {
              return [parseFloat(((value[0] * 100) / data[i][0]).toFixed(2))];
            });
          }
        }
        else {
          chartConfig.series[++nextIdx].data = data;
        }
      }

      // Add categories if found in datasource
      if(categories) {
        if(!chartConfig.xAxis) {
          chartConfig.xAxis = {
            categories: categories
          }
        }
        else {
          if(!chartConfig.xAxis.categories) {
            chartConfig.xAxis.categories = categories;
          }
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
      'appFlash',
      Indicator]);

