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

    if($routeParams.id) {
      this.edit = true;
      this.indicators.forEach(function(indicator) {
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
    url : '/indicators/save/',
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
    url : '/indicators/delete/' + this.current.id,
    method: 'DELETE'
  });
};

AdminController.prototype.initNew = function() {
  this.current = {
    name: '',
    description: '',
    config: {
      type: ''
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

AdminController.prototype.test = function() {
  this.$http({
    url : '/indicators/test/',
    method: 'POST',
    data: $.param({config: JSON.stringify(this.current.config.datasource)}),
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
