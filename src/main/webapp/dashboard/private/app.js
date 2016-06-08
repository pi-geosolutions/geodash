(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("app", function(exports, require, module) {
"use strict";

angular.module('geodash', [
  'ngResource',
  'ngNewRouter',
  'angular-chosen',
  'flash',
  'pascalprecht.translate',
  'ui.ace',
  'ngeo'
]).controller(
  'AppController', [ '$router', AppController ]
).config(['$componentLoaderProvider', function ($componentLoaderProvider) {
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'components/' + name + '/' + name + '.tpl.html';
  });
}]).config(['$translateProvider', function ($translateProvider) {

  $translateProvider
    .preferredLanguage('en')
    .useSanitizeValueStrategy('escape')
    .useStaticFilesLoader({
      prefix: 'lang/',
      suffix: '.json'
    });

}]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);


require('./components/admin/admin');
require('./components/admin/admin.tpl');
require('./components/admin/datasource');
require('./components/admin/datasource.tpl');
require('./components/admin/datasources');
require('./components/admin/datasources.tpl');
require('./components/coordspicker/coordspicker');
require('./components/coordspicker/coordspicker.tpl');
require('./components/indicators/indicators');
require('./components/indicators/indicators.tpl');
require('./services/analytics');
require('./services/messages');
require('./services/chart_factory');
require('./services/utils');
require('./services/rest/indicators');

function AppController($router) {
  $router.config([
    { path: '/'                 , component: 'admin' },
    { path: '/admin'             , component: 'admin' },
  ]);
}


});

;require.register("components/admin/admin", function(exports, require, module) {
var chartConfig = {
  title: {
    text: 'Average Rain fall'
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: 'Rainfall',
      style: {
        color: Highcharts.getOptions().colors[0]
      }
    },
    labels: {
      format: '{value} mm',
      style: {
        color: Highcharts.getOptions().colors[0]
      }
    }
  },
  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: 'mm'
  },
  series: [{
    name: 'Daily rain',
    zIndex: 2,
    type: 'column',
    tooltip: {
      valueSuffix: ' mm'
    }
  }, {
    name: 'Average',
    color: 'green',
    type: 'spline',
    zIndex: 3,
    marker: {
      enabled: false
    }
  }, {
    name: 'Standard variation',
    color: 'grey',
    type: 'areasplinerange',
    lineWidth: 0,
    marker: {
      enabled: false
    },
    fillOpacity: 0.5,
    zIndex: 1
  }, {
    name: 'Variance',
    color: 'grey',
    type: 'areasplinerange',
    lineWidth: 0,
    marker: {
      enabled: false
    },
    fillOpacity: 0.2,
    zIndex: 0
  }]
};

var AdminController = function($routeParams, $http, $location, Indicator, Transformer) {

  this.aceOptions = {
    mode: 'json',
    showPrintMargin: false
  };
  this.$http = $http;
  this.Transformer = Transformer;

  this.indicators = Indicator.getAll(undefined, function() {
    this.indicators.forEach(function(indicator) {
      if (!indicator.config.datasources) {
        indicator.config.datasources = [];
      }
    });

    if($routeParams.id) {
      this.edit = true;
      this.indicators.forEach(function(indicator) {
        //TODO: remove when it's up to date
        if(!indicator.config.datasources) {
          indicator.config.datasources = [];
        }
        if(indicator.config.datasource) {
          indicator.config.datasources.push(indicator.config.datasource)
        }
        if(indicator.id == $routeParams.id) {
          this.current = indicator;
        }
      }.bind(this));
    }
    else if($location.path().indexOf('new') >= 0) {
      this.create = true;
      this.current = {
        name: ''
      };
    }

  }.bind(this));




/*
  var sql = "select m.datereleve, rain, avg, (avg+stddev) as e1plus," +
      "\n\tgreatest(0, avg-stddev) as e1minus," +
      "\n\t(avg+variance) as e2plus," +
      "\n\tgreatest(0, avg-variance) as e2minus" +
      "\n\tfrom afo_2e1_mesures as m," +
      "\n\t\t      (select datereleve, stddev(rain), variance(rain)," +
      "\n\t\t     avg(rain)" +
      "\n\tfrom afo_2e1_mesures" +
      "\n\tgroup by datereleve) as sd" +
      "\n\twhere m.code_omm in (" +
      " \n\t\t     select code_omm" +
      "\n\tfrom afo_2e1_stat_mes_last" +
      "\n\torder by st_distance(the_geom,ST_GeomFromText('POINT(-17.887 27.815 )',4326)) LIMIT 1  )" +
      "\n\tAND m.datereleve = sd.datereleve" +
      "\n\torder by m.datereleve limit 60";

  var dburl = 'jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork';
  this.indicators = [{"id":3,"name":"tata","userid":1},{"id":4,"name":"tata","userid":1,"config":{"datasource":{"type":"database"}}},{"id":1,"name":"totocxwcxwcxcxw","userid":1,"config":{"datasource":{"type":"database"}}},{"id":2,"name":"tata2","userid":1}];

  this.indicators.forEach(function(indicator) {
    indicator.config = {
      "datasource":{"type":"database",url:dburl, sql:sql, transform: this.aceStringify_({
        dataType: 'serie',
        data: {
          xaxis: 'datereleve',
          yaxis: ['rain', 'avg', ['e1minus', 'e1plus']/!*, ['e2minus', 'e2plus']*!/]
        }
      })}
    };
    indicator.config.chartConfig = this.aceStringify_(chartConfig);

  }.bind(this));
*/

};

AdminController.prototype.activate = ['$scope', function($scope) {
  this.$scope = $scope;
}];


AdminController.prototype.save = function() {
  var form = {
    name: this.current.name,
    id: this.current.id,
    config: JSON.stringify(this.current.config)
  };

  if(!this.current.id) {
    this.indicators.push(this.current);
  }

  this.$http({
    url : '../../indicators/save/',
    method: 'POST',
    data: $.param(form),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(function(response) {
    this.current.id = response.data.id;
  }.bind(this));
};

AdminController.prototype.delete = function() {
  var form = {
    name: this.current.name,
    id: this.current.id,
    config: JSON.stringify(this.current.config)
  };

  this.$http({
    url : '../../indicators/delete/' + this.current.id,
    method: 'DELETE'
  });
};

AdminController.prototype.initNew = function() {
  this.current = {
    name: '',
    description: '',
    config: {
      type: '',
      description: '',
      label: '',
      datasources: []
    }
  };
};

AdminController.prototype.viewChart = function(selector) {

  var conf = JSON.parse(this.current.config.chartConfig);
  var series = JSON.parse(this.series);
  series.forEach(function(serie, idx) {
    conf.series[idx].data = serie;
  });

  $(selector).highcharts(conf);
};

AdminController.prototype.test = function(lon, lat) {
  this.$http({
    url : '../../geodata/' + this.lonlat[0] + '/' + this.lonlat[1] + '/',
    method: 'POST',
    data: $.param({config: JSON.stringify(this.current.config)}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(function(response){
    this.testData = this.aceStringify_(response.data);
  }.bind(this), function(response) {
    this.testError = response.statusText;
  }.bind(this));
};

AdminController.prototype.exportData = function() {
  this.series = this.aceStringify_(
      this.Transformer.transform(JSON.parse(this.testData)));
};

AdminController.prototype.aceStringify_ = function(obj) {
  return JSON.stringify(obj, null, 4);
};

AdminController.prototype.isFormInputValid = function(name) {
  //  this.form = angular.element($('form[name="indicatorForm"]')).scope().indicatorForm;
  return !this.$scope.indicatorForm[name].$invalid;
};

AdminController.prototype.showCoordsPicker = function() {
  this.$scope.$broadcast('showMap');
};

angular.module('geodash')
    .controller('AdminController', [
      '$routeParams', '$http', '$location', 'Indicator', 'Transformer', AdminController
    ]);

});

require.register("components/admin/datasource", function(exports, require, module) {
var module = angular.module('geodash');

module.directive('gdDatasourceForm', function() {
      return {
        restrict: 'E',
        scope: {
          datasource: '=gdDatasourceFormConfig'
        },
        controller  : 'GdDatasourceController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: 'components/admin/datasource.tpl.html',
        require: {
          sourcesCtrl: '^^gdDatasources'
        }
      };
    });

var GdDatasourceController = function($scope) {
};

GdDatasourceController.prototype.save = function() {
  //this.sourcesCtrl.add(this.datasource);
};

GdDatasourceController.prototype.isFormInputValid = function(name) {
  var form = angular.element($('section.geodash-admin')).scope().indicatorForm;
  return !form[name].$invalid;
};

module.controller('GdDatasourceController', [
  '$scope',
  GdDatasourceController]
);





});

require.register("components/admin/datasources", function(exports, require, module) {
var module = angular.module('geodash');


module.directive('gdDatasources', function() {
      return {
        restrict: 'E',
        scope: {
          datasources: '=gdDatasourcesArray'
        },
        controller  : 'GdDatasourcesController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: 'components/admin/datasources.tpl.html'
      };
    });

var GdDatasourcesController = function($scope, $http, gdUtils) {
  this.$scope = $scope;
  this.$http = $http;
  this.gdUtils = gdUtils;
  this.current = null;

  this.aceOptions = {
    mode: 'json',
    showPrintMargin: false
  };

  $scope.$watch(function(){
    return this.datasources;
  }.bind(this), function(n) {
    this.resetForm();
  }.bind(this));
};

GdDatasourcesController.prototype.new = function() {
  this.current = {};
  this.datasources.push(this.current);
};

GdDatasourcesController.prototype.add = function(ds) {
  this.datasources.push(ds);
  this.current = null;
};

GdDatasourcesController.prototype.remove = function(ds) {
  var idx = this.datasources.indexOf(ds);
  if(idx >= 0) {
    this.datasources.splice(idx, 1);
  }
};

GdDatasourcesController.prototype.show = function(ds) {
  this.current = ds;
};

GdDatasourcesController.prototype.isValid = function(datasource) {
  var ds = datasource || this.current;
  return ds && ds.name && ds.type &&
      ((ds.type == 'filesystem' && ds.path && ds.pattern && ds.amount) ||
      (ds.type == 'database' && ds.url && ds.sql));
};

GdDatasourcesController.prototype.showCoordsPicker = function() {
  this.$scope.$broadcast('showMap');
};

GdDatasourcesController.prototype.test = function() {

  this.$http({
    url : '../../geodata/serie/' + this.lonlat[0] + '/' + this.lonlat[1] + '/',
    method: 'POST',
    data: $.param({
      config: JSON.stringify(this.current)
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function(response){
    this.testData = this.gdUtils.aceStringify(response.data);
    this.testError = null;
  }.bind(this), function(response) {
    this.testError = response.statusText;
    this.testData = null;
  }.bind(this));
};

GdDatasourcesController.prototype.viewChart = function() {

  var serie = JSON.parse(this.testData);

  var simpleChart = {
    series: [{
      type: this.serieChart.type,
      name: this.serieChart.name,
      data: serie
    }]
  };

  $('#testSerieChart').highcharts(simpleChart);
};

GdDatasourcesController.prototype.resetForm = function() {
  this.current = {};
};

module.controller('GdDatasourcesController', [
  '$scope', '$http', 'gdUtils',
  GdDatasourcesController]);



});

require.register("components/coordspicker/coordspicker", function(exports, require, module) {
angular.module('geodash')
    .component('geodashCoordspicker', {
      bindings    : {
        coordinates: '='
      },
      controller  : CoordspickerController,
      controllerAs: 'ctrl',
      templateUrl : 'components/coordspicker/coordspicker.tpl.html'
    });

function CoordspickerController($scope, $timeout, ngeoDecorateInteraction) {

  this.ngeoDecorateInteraction_ = ngeoDecorateInteraction;
  this.$scope = $scope;
  this.coordinates = [];

  this.map = new ol.Map({
    layers: [new ol.layer.Tile({
      source: new ol.source.OSM()
    })],
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    })
  });
  this.map.setTarget('coordspicker-map');

  var style =  new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'red'
      }),
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 1.25
      }),
      radius: 6
    })
  });

  var fo = new ol.layer.Vector({
    source: new ol.source.Vector({
      useSpatialIndex: false
    }),
    style: style,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    map: this.map
  });

  this.feature = new ol.Feature();
  fo.getSource().addFeature(this.feature);
  this.featureOverlay = fo;

  this.drawPoint = new ol.interaction.Draw({
    features: fo.getSource().getFeatures(),
    type: 'Point',
    style: style
  });

  var drawPoint = this.drawPoint;
  this.ngeoDecorateInteraction_(drawPoint);
  drawPoint.setActive(false);
  this.map.addInteraction(drawPoint);

  drawPoint.on('drawstart', this.handleDrawStart_.bind(this));
  drawPoint.on('drawend', this.handleDrawEnd_.bind(this));

  $scope.$on('showMap', function() {
    $timeout(function(){
      this.map.updateSize();
    }.bind(this), 100);
  }.bind(this));
};

CoordspickerController.prototype.handleFormChange = function() {
  var lon = this.coordinates[0],
      lat = this.coordinates[1];

  if(lon && lat) {
    this.feature.setGeometry(new ol.geom.Point(ol.proj.transform([lon, lat],
        'EPSG:4326', this.map.getView().getProjection())));
    this.featureOverlay.changed();
  }
};

CoordspickerController.prototype.handleDrawStart_ = function() {
  this.$scope.$apply(function() {
    this.feature.setGeometry(null);
  }.bind(this));
};

CoordspickerController.prototype.handleDrawEnd_ = function(event) {
  this.$scope.$apply(function() {
    this.feature = event.feature;
    var coords = this.feature.getGeometry().getCoordinates();
    coords = ol.proj.transform(coords, this.map.getView().getProjection(),
        'EPSG:4326');
    this.coordinates[0] = Number(coords[0].toFixed(3));
    this.coordinates[1] = Number(coords[1].toFixed(3));
    this.featureOverlay.changed();
    this.drawPoint.active = false;
  }.bind(this));
};

CoordspickerController.$inject = ['$scope','$timeout',
  'ngeoDecorateInteraction'];

});

require.register("components/indicators/indicators", function(exports, require, module) {
var module = angular.module('geodash');

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

var CHART_HEIGHT = 300;

module.component('gdMyboard', {
    bindings: {
      editing: '='
    },
    controller: 'MyboardController',
    controllerAs: 'ctrl',
    templateUrl: 'components/indicators/indicators.tpl.html'
  });

/**
 *
 * @param $timeout
 * @param Indicator
 * @param ChartFactory
 * @param $scope
 * @constructor
 */
var MyboardController = function ($timeout, Indicator, ChartFactory, $scope) {
  this.$timeout = $timeout;
  this.ChartFactory = ChartFactory;
  this.$scope = $scope;

  this.indicatorsToAdd = [];
  this.indicatorsIdToAdd = [];

  this.allIndicators = Indicator.getAll({}, function() {
    var myconfig = localStorage.geodash;
    if(myconfig) {
      myconfig = myconfig.split(',').map(Number);
      this.indicators = new Array(myconfig.length);
      this.allIndicators.forEach(function(indicator) {
        var idx = myconfig.indexOf(indicator.id);
        if(idx >= 0) {
          this.indicators[idx] = indicator;
        }
      }.bind(this));
    }
    else {
      this.indicators = this.allIndicators;
    }
    this.renderGraphs_();
  }.bind(this));
};

/**
 * Switch to config mode allowing to reorder/add/remove panels.
 */
MyboardController.prototype.edit = function() {

  // Need to init the jquery-ui sortable elements once.
  if(this.editing === undefined) {
    $('#sortable').sortable({
      handle: ".panel-heading",
      update: function( event, ui) {
        var targetId = ui.item[0].id;
        var id = (targetId.substring(6, targetId.length));
        this.synchArrays_(id);
        this.dirty = true;
      }.bind(this)
    });
    this.backup = angular.copy(this.indicators);
    this.editing = true;
  }
  if(this.editing === false) {
    this.backup = angular.copy(this.indicators);
    this.dirty = false;
    this.editing = true;
    $('#sortable').sortable('enable');
  }
};

/**
 * Save the current state of your dashboard.
 * It is saved for your session and in localStorage.
 */
MyboardController.prototype.saveState = function() {
  this.stopEditing_();
  var output = [];
  this.indicators.forEach(function(indicator) {
    output.push(indicator.id);
  });
  localStorage.geodash = output;
};

/**
 * Cancel the changes on your dashboard. Go back to a saved backup and
 * exit from edit mode.
 */
MyboardController.prototype.cancelState = function() {
  this.stopEditing_();
  if(this.dirty) {
    this.indicators = this.backup;
    this.renderGraphs_();
  }
};

/**
 * Exit from edit mode.
 * @private
 */
MyboardController.prototype.stopEditing_ = function() {
  $('#sortable').sortable('disable');
  this.editing = false;
};

/**
 * Open an indicator in full page. The chart is reloaded with full height.
 * @param indicator The indicator to open
 */
MyboardController.prototype.open = function(indicator) {
  if(this.editing) return;
  this.zoom = indicator;
  this.$timeout(function() {
    var selector = '#board_zoom_' + indicator.id + '_chart';
    this.ChartFactory.getChart(indicator.name).then(
        function(chart) {
          chart.chart.height = $('.full-view').height() - 100;
          $(selector).highcharts(chart);
        });
  }.bind(this));
};

/**
 * Remove an indicator from list.
 * @param indicator The indicator to remove.
 */
MyboardController.prototype.remove = function (indicator) {
  this.modal = {
    message: 'delete.confirm',
    ok: function() {
      var idx = this.indicators.indexOf(indicator);
      this.indicators.splice(idx, 1);
      this.dirty = true;
    }.bind(this)
  };
};

/**
 * Synchronize the jquery ui sortable elements with the angular indicators.
 * @param targetId Id of the moved indicator.
 * @private
 */
MyboardController.prototype.synchArrays_ = function(targetId) {
  var uiIds = [];
  var oldPos, newPos;

  $("#sortable .panel").each(function(idx, item) {
    var id = parseInt(item.id.substring(6, item.id.length));
    uiIds.push(id);
    if (id == targetId) {
      newPos = idx;
    }
  });

  this.indicators.some(function(indicator, idx) {
    if(indicator.id == targetId) {
      oldPos = idx;
      return true;
    }
  }.bind(this));
  this.indicators.move(oldPos, newPos);
  this.$scope.$apply();
};

/**
 * Render all highchart charts in their dedicated div.
 * @private
 */
MyboardController.prototype.renderGraphs_ = function() {
  this.$timeout(function(){
    this.indicators.forEach(function(board) {

      var selector = '#board_' + board.id + '_chart';
      this.ChartFactory.getChart(board.name).then(
          function(chart) {
            chart.chart.height = CHART_HEIGHT;
            $(selector).highcharts(chart);
          });
    }.bind(this));
  }.bind(this));
};

/**
 * Add indicators to your selection. The selection means the indicators
 * you gonna add to your dashboard.
 * @param indicator Indicator to add.
 */
MyboardController.prototype.selectToAdd = function(indicator) {

  var idx = this.indicatorsIdToAdd.indexOf(indicator.id);
  if(idx >= 0) {
    this.indicatorsToAdd.splice(idx, 1);
    this.indicatorsIdToAdd.splice(idx, 1);
  }
  else {
    this.indicatorsToAdd.push(indicator);
    this.indicatorsIdToAdd.push(indicator.id);
  }
};

/**
 * Reset indicators to add selection.
 */
MyboardController.prototype.cancelAdd = function() {
  this.indicatorsToAdd = [];
  this.indicatorsIdToAdd = [];
};

MyboardController.prototype.confirmAdd = function() {
  if(this.indicatorsToAdd.length) {
    this.indicators = this.indicators.concat(this.indicatorsToAdd);
    this.renderGraphs_();
    this.dirty = true;
  }
  this.cancelAdd();
};

var DashboardController = function ($scope) {
  this.config = localStorage.geodash || ['averagerain', 'dailyrain'];
  this.$scope = $scope;
  this.loadMyIndicators = function() {
  };
};



module.controller('DashboardController', DashboardController);
module.controller('MyboardController', MyboardController);

MyboardController.$inject = ['$timeout', 'Indicator', 'ChartFactory', '$scope'];
DashboardController.$inject = ['$scope'];

});

require.register("services/analytics", function(exports, require, module) {
angular.module('geodash').service('Maths', [
  function() {

    /**
     *
     * @param {Array<Number>} data
     */
    this.average = function(values) {
      var sum = values.reduce(function(sum, value){
        return sum + value;
      }, 0);

      var avg = sum / values.length;
      return avg;
    };

    this.standardVariation = function(values) {

      var avg = this.average(values);

      var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = this.average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    };

  }])

.service('Transformer', [ 'Maths',
  function(Maths) {

    this.config = {
      dataType: 'serie',
      data: {
        xaxis: 'datereleve',
        yaxis: ['rain', 'avg', ['e1minus', 'e1plus']/*, ['e2minus', 'e2plus']*/]
      }
    };

    this.transform = function(data, config_) {
      var config = config_ || this.config;

      if(config.dataType = 'serie') {
        var transformer = new TransformerSerie(data, config, Maths);
        return transformer.buildSeries();
      }
    };

    this.extractData = function() {

    }


  }]);

var TransformerSerie = function(input, config, Maths) {
  this.config = config;
  this.input = input;
  this.Maths = Maths;
};

TransformerSerie.prototype.extractData = function() {
  var values = [];
  this.input.forEach(function(row) {
    values.push(row[this.config.data.value]);
  }.bind(this));
  return values;
};

TransformerSerie.prototype.buildSeries = function() {
  var output = [];
  this.config.data.yaxis.forEach(function() {
    output.push([]);
  });

  this.input.forEach(function(row, idx) {
    var dateS = row[this.config.data.xaxis];
    var date = new Date(dateS);
    var dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    this.config.data.yaxis.forEach(function(yaxis, idx) {
      if(angular.isArray(yaxis) && yaxis.length == 2) {
        output[idx].push([dateUTC, Number(row[yaxis[0]].toFixed(1)), Number(row[yaxis[1]].toFixed(1))]);
      }
      else {
        output[idx].push([dateUTC, Number(row[yaxis].toFixed(1))]);
      }
    });
  }.bind(this));

  return output;
};

});

require.register("services/chart_factory", function(exports, require, module) {
var module = angular.module('geodash');



var ChartFactory = function($http, $q) {

  this.getChart = function(type) {

    var defer = $q.defer();
    var config = chartConfig[type];
    if(!config) {
      console.warn('no config defined for chart: ' + type);
      defer.resolve(chartConfig.default);
      return defer.promise;
    }

    var url = '../app/data/'+type+ '.json';
    return $http.get(url).then(function(response) {
      if(angular.isArray(response.data)) {
        response.data.forEach(function(serie, idx) {
          config.series[idx].data = serie;
        });
        return config;
      }
    });
  }
};

angular.module('geodash')
    .service('ChartFactory', ['$http', '$q', ChartFactory]);


var chartConfig = {
  averagerain: {
    chart: {
      height: 300
    },
    title: {
      text: 'Average Rain fall'
    },
    xAxis: [{
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      crosshair: true
    }],
    yAxis: {
      title: {
        text: 'Rainfall',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        format: '{value} mm',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: 'mm'
    },
    series: [{
      name: 'Average rain',
      zIndex: 1,
      type: 'column',
      tooltip: {
        valueSuffix: ' mm'
      }
    }, {
      name: 'Standard varation 1',
      type: 'arearange',
      lineWidth: 0,
      linkedTo: ':previous',
      color: Highcharts.getOptions().colors[0],
      fillOpacity: 0.5,
      zIndex: 0
    }, {
      name: 'Standard varation 2',
      type: 'arearange',
      lineWidth: 0,
      linkedTo: ':previous',
      color: 'grey',
      fillOpacity: 0.3,
      zIndex: 0
    }]
  },
  dailyrain: {
    chart: {
      height: 300
    },
    title: {
      text: 'Daily Rain fall'
    },
    plotOptions: {
      series: {
        shadow: false
      }
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'Rainfall',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        format: '{value} mm',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      plotLines: [{
        color: 'red',
        width: 1,
        value: 10,
        zIndex: 20
      }, {
        color: 'red',
        width: 1,
        value: 20,
        zIndex: 20
      }]
    },
    tooltip: {
      shared: true,
      valueSuffix: 'mm'
    },
    series: [{
      name: 'Daily rain',
      zIndex: 0,
      type: 'column',
      tooltip: {
        valueSuffix: ' mm'
      }
    }, {
      name: 'High value',
      color: 'green',
      type: 'spline',
      zIndex: 1,
      marker: {
        enabled: false
      }
    }, {
      name: 'High value',
      color: 'green',
      marker: {
        enabled: false
      },
      dashStyle: 'longdash',
      zIndex: 1
    }]
  },
  default: {
    chart: {
      type: 'bar',
      height: 300,
    },
    title: {
      text: 'default'
    },
    xAxis: {
      categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
      title: {
        text: 'Fruit eaten'
      }
    },
    series: [{
      name: 'Jane',
      data: [1, 0, 4]
    }, {
      name: 'John',
      data: [5, 7, 3]
    }]
  }
};


});

require.register("services/messages", function(exports, require, module) {
angular.module('geodash').factory('Templates',
  ['$resource', 'LDAP_BASE_URI', function($resource, baseUri) {
    return $resource(baseUri + '../emailTemplates', {}, {
      query: {
        cache   : true,
        isArray : false
      }
    });
  }]
).factory('Mail',
  ['$resource', 'LDAP_BASE_URI', function($resource, baseUri) {
    return $resource(baseUri + '../:id/sendEmail', {id: '@id'}, {
      save: {
        method: 'POST',
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
          return $.param({
           subject     : data.subject,
           content     : data.content,
           attachments : data.attachments
          });
        }
      }
    });
  }]
).factory('Attachments',
  ['$resource', 'LDAP_BASE_URI', function($resource, baseUri) {
    return $resource(baseUri + '../attachments', {}, {
      query: {
        cache   : true,
        isArray : false
      }
    });
  }]
);

});

require.register("services/rest/indicators", function(exports, require, module) {
angular.module('geodash').factory('Indicator',
  ['$resource', function($resource) {

    var url = '../app/data/:id/indicators.json';
    return $resource(url, { id: '@uid' }, {
      query: {
        cache   : false,
        method  : 'GET',
        isArray : true
      },
      getAll: {
        url: '../../indicators/',
        cache: false,
        isArray:true
      },
      update: {
        method: 'PUT'
      }
    });
  }]
);

});

require.register("services/utils", function(exports, require, module) {
var module = angular.module('geodash');
angular.module('geodash')
    .service('gdUtils', [function() {


      this.aceStringify = function(obj) {
        return JSON.stringify(obj, null, 4);
      };

    }]);




});


//# sourceMappingURL=app.js.map