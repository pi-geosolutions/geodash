var module = angular.module('geodash');



var ChartFactory = function($http, $q, appFlash) {

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
  };

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
    .service('ChartFactory', ['$http', '$q', 'appFlash', ChartFactory]);


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

