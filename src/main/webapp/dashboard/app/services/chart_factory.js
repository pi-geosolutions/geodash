var module = angular.module('geodash');


var CHART_HEIGHT = 300;

var ChartFactory = function($http, $q, appFlash, IndicatorService) {

  this.getChart = function(type) {

    var defer = $q.defer();
    var config = chartConfig[type];

    console.log(type);
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
  };

  /**
   * Render the indicator chart.
   *
   * @param indicator The full object representing the DB indicator
   * @param selector The css selector to target the graph
   * @param lon Coordinates
   * @param lat Coordinates
   * @param height Height of the chart, only for zoom mode
   */
  this.renderIndicator = function(indicator, selector, lon, lat, height) {
    var h = height;
    IndicatorService.getGraph(indicator.config || indicator.rconfig, lon, lat, indicator.optYear).then(
        function(chartConfig) {
          if(!chartConfig) {
            appFlash.create('warning', 'chart.noconfig', {
              name: indicator.config.label || indicator.name
            });
          }
          else {
            // disable export button if not zoom mode
            chartConfig.exporting = {
              enabled: !!h
            };
            // Set height in highchart config object
            var height = h || CHART_HEIGHT;
            chartConfig.chart ? chartConfig.chart.height = height :
                chartConfig.chart = {height:height};
            this.render(selector, chartConfig);
          }
        }.bind(this));
  };

  /**
   * Render a chart in a specific selector
   *
   * @param selector The css selector to target the graph
   * @param config The full (datas) Highchart config object for the graph
   */
  this.render = function(selector, config) {
    try {
      $(selector).highcharts(config);
    }
    catch (e) {
      appFlash.create('danger', 'chart.render.error');
    }
  };
};

angular.module('geodash')
    .service('ChartFactory', ['$http', '$q', 'appFlash', 'IndicatorService',
      ChartFactory]);


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

