var module = angular.module('geodash');

var HarvestersController = function($routeParams, $http, $timeout, $rootScope, gdHarvesterResource) {

  this.$http = $http;
  this.$timeout = $timeout;
  this.gdHarvesterResource = gdHarvesterResource;
  this.getAll();

  $timeout(function() {
    this.formCtrl = angular.element('form[name=indicatorForm]').scope().indicatorForm;
  }.bind(this));

  $rootScope.$watch(function() {
    return this.current;
  }.bind(this), function(indicator) {
    if(indicator && indicator.id) {
      this.getHistory();
      this.running = false;
      this.formCtrl.$setPristine();
    }
  }.bind(this));
};

HarvestersController.prototype.initNew = function() {
  this.current = {
    name: '',
    url: ''
  };
};

HarvestersController.prototype.getAll = function() {
  this.list = this.gdHarvesterResource.query(function(){
  }.bind(this));
};

HarvestersController.prototype.save = function() {
  if(!this.current.id) {
    this.list.push(this.current);
  }
  this.gdHarvesterResource.save(this.current, function(data) {
    this.current.id = data.id;
    this.getAll();
    this.formCtrl.$setPristine();
  }.bind(this));
};

HarvestersController.prototype.delete = function() {
  this.gdHarvesterResource.delete({id: this.current.id}, function() {
    this.current = null;
    this.getAll();
  }.bind(this));
};

HarvestersController.prototype.run = function() {
  this.running = true;
  this.$http.get('../../harvesters/run/' + this.current.id).then(function(response) {
    this.checkStatus(response.data.uuid);
  }.bind(this));
};

HarvestersController.prototype.checkStatus = function(uuid) {
  return this.$http.get('../../harvesters/status/' + uuid).then(function(response) {
    console.log('status ' + response.data.status);
    if(response.data.status == 'ko') {
      this.$timeout(function() {
        this.checkStatus(uuid);
      }.bind(this), 5000);
    }
    else if(response.data.id) {
      this.running = false;
      this.history = this.history || [];
      this.history.unshift(response.data);
    }
  }.bind(this));
};

HarvestersController.prototype.addHistory = function(history) {
  this.$http.post('../../harvesters/' + this.current.id + '/history', history, {
  }).then(function(response) {
    this.history = this.history || [];
    this.history.unshift(history);
  }.bind(this));
};

HarvestersController.prototype.getHistory = function() {
  return this.$http.get('../../harvesters/' + this.current.id + '/history').then(function(response) {
    this.history = response.data;
  }.bind(this));
};

HarvestersController.prototype.deleteHistory = function() {
  return this.$http.delete('../../harvesters/' + this.current.id + '/history').then(function(response) {
    this.history = [];
  }.bind(this));
};

HarvestersController.prototype.deleteIndicators = function() {
  return this.$http.delete('../../harvesters/' + this.current.id + '/indicators').then(function(response) {
    if(response.data.success && angular.isDefined(response.data.removed)) {
      this.addHistory({
        deleted: 'y',
        info: {
          removed: response.data.removed
        }
      });
    }
  }.bind(this));
};

module
  .controller('HarvestersController', [
    '$routeParams',
    '$http',
    '$timeout',
    '$rootScope',
    'gdHarvesterResource',
    HarvestersController
  ]);

module.directive('gdHarvesterSchedule', ['$translate',
  function($translate) {

    return {
      restrict: 'A',
      scope: {
        harvester: '=gdHarvesterSchedule'
      },
      templateUrl: 'components/harvesters/scheduler.tpl.html',
      link: function(scope, element, attrs) {
        scope.cronExp = ['0 0 12 * * ?',
          '0 15 10 * * ?',
          '0 0/5 14 * * ?',
          '0 15 10 ? * MON-FRI',
          '0 15 10 15 * ?'];
        scope.setSchedule = function(exp) {
          scope.harvester.cron = exp;
        };
      }
    };
  }]);
