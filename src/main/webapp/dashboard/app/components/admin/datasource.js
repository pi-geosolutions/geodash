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

var GdDatasourceController =
    function($scope, $http, gdUtils, Transformer, IndicatorService) {

      this.$scope = $scope;
      this.$http = $http;
      this.gdUtils = gdUtils;
      this.Transformer = Transformer;
      this.IndicatorService = IndicatorService;

      $scope.$watch(function(){
        return this.datasource;
      }.bind(this), function(n) {
        this.resetForm();
      }.bind(this));
    };

GdDatasourceController.prototype.save = function() {
  //this.sourcesCtrl.add(this.datasource);
};

GdDatasourceController.prototype.isFormInputValid = function(name) {
  var form = angular.element($('section.geodash-admin')).scope().indicatorForm;
  return !form[name].$invalid;
};

GdDatasourceController.prototype.isValid = function() {
  return this.sourcesCtrl.isValid(this.datasource);
};

GdDatasourceController.prototype.test = function() {

  this.IndicatorService.getSerie(
      this.datasource, this.lonlat[0], this.lonlat[1]).then(function(data){
    this.testData = this.gdUtils.aceStringify(data);
    this.testError = null;
  }.bind(this), function(response) {
    this.testError = response.statusText;
    this.testData = null;
  }.bind(this));
};

GdDatasourceController.prototype.exportData = function() {
  this.series = this.gdUtils.aceStringify(
      this.Transformer.transform(
          JSON.parse(this.testData),
          JSON.parse(this.datasource.transform)));
};

GdDatasourceController.prototype.viewChart = function() {

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
GdDatasourceController.prototype.showCoordsPicker = function() {
  this.$scope.$broadcast('showMap');
};

GdDatasourceController.prototype.resetForm = function() {
  this.serieChart = {};
  this.testError = null;
  this.testData = null;
};

module.controller('GdDatasourceController', [
  '$scope', '$http', 'gdUtils', 'Transformer', 'IndicatorService',
  GdDatasourceController]
);




