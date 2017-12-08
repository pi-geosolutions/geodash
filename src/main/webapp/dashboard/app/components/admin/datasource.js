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
    function($scope, $http, gdUtils, Transformer, IndicatorService,
             ChartFactory, gdSerieFn, coordinates) {

      this.$scope = $scope;
      this.$http = $http;
      this.gdUtils = gdUtils;
      this.Transformer = Transformer;
      this.IndicatorService = IndicatorService;
      this.ChartFactory = ChartFactory;
      this.gdSerieFn = gdSerieFn;
      this.coordinates = coordinates;

      $scope.$watch(function(){
        return this.datasource;
      }.bind(this), function(n) {
        this.resetForm();
      }.bind(this));

      $scope.$watchCollection(function(){
        return this.sourcesCtrl.datasource;
      }.bind(this), function(n) {
        this.otherDs = this.getOtherDatasources();
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
      this.datasource, this.coordinates.lonlat[0], this.coordinates.lonlat[1], null, this.optYear).then(function(data){

    if(!data) {
      this.testError = 'No value';
    }
    else if(data.error) {
      this.testError = data.error;
    }
    else {
      this.testData = this.gdUtils.aceStringify(data);
      this.testError = null;
    }
  }.bind(this), function(response) {
    this.testError = response.statusText;
    this.testData = null;
    this.datasource.transform = null;
  }.bind(this));
};

GdDatasourceController.prototype.exportData = function() {
  this.series = this.gdUtils.aceStringify(
      this.Transformer.transform(
          JSON.parse(this.testData),
          JSON.parse(this.datasource.transform)));
};

/**
 * Return a list of all datasources of this indicator, except the current one.
 */
GdDatasourceController.prototype.getOtherDatasources = function() {
  var dss = [{name: ''}];
  this.sourcesCtrl.datasources.forEach(function(ds, i) {
    if(ds !== this.datasource) {
      dss.push({idx: i, name: ds.name});
    }
  }.bind(this));
  return dss;
};

GdDatasourceController.prototype.viewChart = function() {

  var datas = JSON.parse(this.testData);
  var serie = datas.data;
  var categories = datas.categories;

  var simpleChart = {
    series: [{
      type: this.serieChart.type,
      name: this.serieChart.name,
      data: serie
    }]
  };
  if(categories) {
    simpleChart.xAxis = {
      categories: categories
    }
  }
  this.ChartFactory.render("#testSerieChart", simpleChart);
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
  'ChartFactory', 'gdSerieFn', 'coordinates',
  GdDatasourceController]
);




