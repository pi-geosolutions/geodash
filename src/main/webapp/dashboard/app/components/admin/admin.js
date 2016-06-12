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

  this.IndicatorService.getGraph(this.current.config, -14.326, 13.923).then(
      function(chartConfig) {
        this.ChartFactory.render(selector, chartConfig);
      }.bind(this));
};




angular.module('geodash')
    .controller('AdminController', [
      '$routeParams', '$http', '$location', 'Indicator', 'Transformer',
      'IndicatorService', 'ChartFactory', AdminController
    ]);
