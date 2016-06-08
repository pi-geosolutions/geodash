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


