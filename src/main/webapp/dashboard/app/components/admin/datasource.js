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




