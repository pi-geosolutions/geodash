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

var AdminController = function($routeParams, $http, $location, Indicator,
                               Transformer, IndicatorService, ChartFactory) {

  this.aceOptions = {
    mode: 'json',
    showPrintMargin: false
  };
  this.$http = $http;
  this.Transformer = Transformer;
  this.IndicatorService = IndicatorService;
  this.ChartFactory = ChartFactory;

  this.indicators = Indicator.getAll(undefined, function() {
    this.indicators.forEach(function(indicator) {
      if (!indicator.config.datasources) {
        indicator.config.datasources = [];
      }
    });

    if($location.path().indexOf('new') >= 0) {
      this.create = true;
      this.current = {
        name: ''
      };
    }
  }.bind(this));

  $http.get('../../remotes/').then(function(response) {
    this.remotes = response.data;
  }.bind(this), function() {
    this.remotes = [];
  }.bind(this));
};


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
  this.$http({
    url : '../../indicators/delete/' + this.current.id,
    method: 'DELETE'
  });
};

AdminController.prototype.deleteRemote = function() {
  this.$http({
    url : '../../remotes/',
    method: 'DELETE',
    data: this.current
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

  this.IndicatorService.getGraph(this.current.config, -14.326, 13.923, optYear).then(
      function(chartConfig) {
        var conf = angular.copy(chartConfig);
        conf.exporting = {
          enabled: false
        };

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
      'IndicatorService', 'ChartFactory', AdminController
    ]);
