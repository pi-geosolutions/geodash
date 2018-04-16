
var AdminController = function($routeParams, $http, $location, Indicator,
                               Transformer, IndicatorService, ChartFactory,
                               coordinates, appFlash, $rootScope) {

  this.aceOptions = {
    mode: 'json',
    showPrintMargin: false
  };
  this.$http = $http;
  this.Transformer = Transformer;
  this.IndicatorService = IndicatorService;
  this.Indicator = Indicator;
  this.ChartFactory = ChartFactory;
  this.appFlash = appFlash;
  this.$location = $location;

  this.lonlat = coordinates.value;
  this.coordinates = coordinates;
  this.indicators = Indicator.getAll(undefined, function() {
    this.indicators.forEach(function(indicator) {
      if (!indicator.config.datasources) {
        indicator.config.datasources = [];
      }
    });

    this.indicators = this.indicators.sort(function(a, b) {
      return a.config.label > b.config.label ? 1 : -1;
    });

    if($location.path().indexOf('new') >= 0) {
      this.create = true;
      this.current = {
        name: ''
      };
    }
  }.bind(this));

  this.loadRemotes();

  $rootScope.$watch('admin.showMap', (mapActive) => {
    if(mapActive && this.map) {
      this.map.updateSize();
    }
  });
};


AdminController.prototype.loadRemotes = function() {
  this.$http.get('../../remotes/').then(function(response) {
    this.remotes = response.data.sort(function(a, b) {
      return a.nodeLabel > b.nodeLabel ? 1 : -1;
    });
  }.bind(this), function() {
    this.remotes = [];
  }.bind(this));
}

AdminController.prototype.save = function() {
  var form = {
    name: this.current.name,
    id: this.current.id,
    enabled: this.current.enabled,
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
  this.$http({
    url : '../../indicators/delete/' + this.current.id,
    method: 'DELETE'
  }).then((response) => {
    if(response.data.success == 'true') {
      this.appFlash.create('success', 'indicators.delete.success');
      this.indicators = this.Indicator.getAll();
    }
    else {
      this.appFlash.create('danger', 'indicators.delete.error');
    }
  });
};

AdminController.prototype.deleteRemote = function() {
  this.$http({
    url : '../../remotes/',
    method: 'DELETE',
    data: this.current
  }).then((response) => {
    if(response.data.success == 'true') {
      this.appFlash.create('success', 'indicators.delete.success');
      this.loadRemotes();
    }
    else {
      this.appFlash.create('danger', 'indicators.delete.error');
    }
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

  var optYear = new Date().getFullYear();

  this.IndicatorService.getGraph(this.current.config,
    this.coordinates.lonlat[0],
    this.coordinates.lonlat[1],
    optYear).then(
      function(chartConfig) {
        var conf = angular.copy(chartConfig);
        conf.exporting = {
          enabled: false
        };

        // compute linear gradient
        conf.series.forEach(function(serie) {
          if(serie.color && serie.color.linearGradient) {
            var newData = [];
            serie.data.forEach(function(d) {
              if(angular.isArray(d)) {
                var color = serie.color;
                var value = d[0];
                var newStops = [];
                color.stops.forEach(function(stop) {
                  newStops.push([stop[0] == 0 || stop[0] == 1 ? stop[0] :
                      value ? stop[0] / value : 1 || 0, stop[1]]);
                });
                newData.push({
                  y: value,
                  color: {
                    linearGradient: serie.color.linearGradient,
                    stops: newStops
                  }
                });
              }
            });
            serie.data = newData;
          }
        });
        this.ChartFactory.render(selector, conf);
      }.bind(this));
};




angular.module('geodash')
    .controller('AdminController', [
      '$routeParams', '$http', '$location', 'Indicator', 'Transformer',
      'IndicatorService', 'ChartFactory', 'coordinates', 'appFlash', '$rootScope',
      AdminController
    ])
  .value('coordinates', {
    lonlat: []
  });
