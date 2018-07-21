var module = angular.module('geodash');

var Indicator = function($http, $q, Transformer, gdUtils, appFlash, gdSerieFn) {
  this.$http = $http;
  this.$q = $q;
  this.Transformer = Transformer;
  this.gdUtils = gdUtils;
  this.appFlash = appFlash;
  this.gdSerieFn = gdSerieFn;
};

/**
 * Get chart config and feed it with serie datas
 *
 * @param config
 * @param lon
 * @param lat
 * @param optYear
 * @returns {*|Promise.<TResult>}
 */
Indicator.prototype.getGraph = function(config, lon, lat, optYear) {

  var promises = [];
  config.datasources.forEach(function(ds) {
    var year = optYear + (ds.nrelative || 0);
    promises.push(this.getSerie(ds, lon, lat, config.url, year));
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
    var mainSerieCount = 0;

    try {
      datasources.forEach(function (ds, idx) {

        var data = ds.data;
        var categories = ds.categories;

        if(idx === 0) {
          mainSerieCount = data.length;
        }

        // Replace year in legend if user can choose year
        if(idx <= chartConfig.series.length-1) {
          chartConfig.series[idx].name =
            chartConfig.series[idx].name.replace('----',
              optYear + (config.datasources[idx].nrelative || 0));
        }

        // Multiple series
        if (angular.isArray(data[0][0])) {
          data.forEach(function (serie, i) {
            chartConfig.series[++nextIdx].data = serie;
          });
        }
        else { // single serie
          var c = config.datasources[idx];

          // Merge with previous serie
          if (c.merge && idx) {
            var previous = chartConfig.series[nextIdx].data;
            if (!c.mergeType || c.mergeType == 'concat') {
              chartConfig.series[nextIdx].data = previous.map(function (value, i) {
                return value.concat(data[i]);
              });
            }
            else if (!c.mergeType || c.mergeType == 'concatplus') {
              chartConfig.series[nextIdx].data = previous.map(function (value, i) {
                return value.concat([data[i][0] + value[0]]);
              });
            }
            else if (c.mergeType == 'percentage') {
              chartConfig.series[nextIdx].data = previous.map(function (value, i) {
                return [parseFloat(((value[0] * 100) / data[i][0]).toFixed(2))];
              });
            }
          }
          else if(angular.isDefined(c.basedOnDs) ){
            var bs = chartConfig.series[c.basedOnDs].data;
            chartConfig.series[++nextIdx].data = bs.map(function(v, i, a) {
              return this.gdSerieFn[c.basedOnDsFn](data, v,i,a);
            }.bind(this));
          }
          else {
            chartConfig.series[++nextIdx].data = data;
          }
          if(c.amount === 1) {
            for(var i=1;i<mainSerieCount;i++) {
              chartConfig.series[nextIdx].data[i] = chartConfig.series[nextIdx].data[0];
            }
          }
        }

        // Add categories if found in datasource
        if (categories) {
          if (!chartConfig.xAxis) {
            chartConfig.xAxis = {
              categories: categories
            }
          }
          else {
            if (!chartConfig.xAxis.categories) {
              chartConfig.xAxis.categories = categories;
            }
          }
        }
      }.bind(this));

      // update ESA colors and labels
      if(chartConfig.colors == 'esa') {
        var colors = [];
        // consider color table is generated from first serie
        var esaSerie = chartConfig.series[0];

        esaSerie.data.forEach( v => {
          var p = this.gdUtils.getEsaDef(v[0]);
          if(p) {
            colors.push(`rgb(${p.R},${p.G},${p.B})`)
          }
        });
        chartConfig.colors = colors;

      }

      // check for regression
      if(chartConfig.series[0].regression) {
        var s = chartConfig.series[0];
        s.data.forEach(function(d, i) {
          d.unshift(i);
        })
      }

    }
    catch(e) {
      this.appFlash.create('danger', 'chart.serie.error',  {
        name: config.label
      });
    }
    return chartConfig;
  }.bind(this));
};

Indicator.prototype.getSerie = function(datasource, lon, lat, remoteUrl, optYear) {

  var path = remoteUrl || '../..'
  return this.$http({
    url : `${path}/geodata/serie/${lon}/${lat}/`,
    method: 'POST',
    data: $.param({
      config: JSON.stringify(datasource),
      year: optYear
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
  }.bind(this), () => {});
};

angular.module('geodash')
    .service('IndicatorService', ['$http', '$q', 'Transformer', 'gdUtils',
      'appFlash', 'gdSerieFn',
      Indicator]);

