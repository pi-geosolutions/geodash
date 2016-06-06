var module = angular.module('geodash');

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

var CHART_HEIGHT = 300;

module.component('gdMyboard', {
    bindings: {
      editing: '='
    },
    controller: 'MyboardController',
    controllerAs: 'ctrl',
    templateUrl: 'components/indicators/indicators.tpl.html'
  });

/**
 *
 * @param $timeout
 * @param Indicator
 * @param ChartFactory
 * @param $scope
 * @constructor
 */
var MyboardController = function ($timeout, Indicator, ChartFactory, $scope) {
  this.$timeout = $timeout;
  this.ChartFactory = ChartFactory;
  this.$scope = $scope;

  this.indicatorsToAdd = [];
  this.indicatorsIdToAdd = [];

  this.allIndicators = Indicator.getAll({}, function() {
    var myconfig = localStorage.geodash;
    if(myconfig) {
      myconfig = myconfig.split(',').map(Number);
      this.indicators = new Array(myconfig.length);
      this.allIndicators.forEach(function(indicator) {
        var idx = myconfig.indexOf(indicator.id);
        if(idx >= 0) {
          this.indicators[idx] = indicator;
        }
      }.bind(this));
    }
    else {
      this.indicators = this.allIndicators;
    }
    this.renderGraphs_();
  }.bind(this));
};

/**
 * Switch to config mode allowing to reorder/add/remove panels.
 */
MyboardController.prototype.edit = function() {

  // Need to init the jquery-ui sortable elements once.
  if(this.editing === undefined) {
    $('#sortable').sortable({
      handle: ".panel-heading",
      update: function( event, ui) {
        var targetId = ui.item[0].id;
        var id = (targetId.substring(6, targetId.length));
        this.synchArrays_(id);
        this.dirty = true;
      }.bind(this)
    });
    this.backup = angular.copy(this.indicators);
    this.editing = true;
  }
  if(this.editing === false) {
    this.backup = angular.copy(this.indicators);
    this.dirty = false;
    this.editing = true;
    $('#sortable').sortable('enable');
  }
};

/**
 * Save the current state of your dashboard.
 * It is saved for your session and in localStorage.
 */
MyboardController.prototype.saveState = function() {
  this.stopEditing_();
  var output = [];
  this.indicators.forEach(function(indicator) {
    output.push(indicator.id);
  });
  localStorage.geodash = output;
};

/**
 * Cancel the changes on your dashboard. Go back to a saved backup and
 * exit from edit mode.
 */
MyboardController.prototype.cancelState = function() {
  this.stopEditing_();
  if(this.dirty) {
    this.indicators = this.backup;
    this.renderGraphs_();
  }
};

/**
 * Exit from edit mode.
 * @private
 */
MyboardController.prototype.stopEditing_ = function() {
  $('#sortable').sortable('disable');
  this.editing = false;
};

/**
 * Open an indicator in full page. The chart is reloaded with full height.
 * @param indicator The indicator to open
 */
MyboardController.prototype.open = function(indicator) {
  if(this.editing) return;
  this.zoom = indicator;
  this.$timeout(function() {
    var selector = '#board_zoom_' + indicator.id + '_chart';
    this.ChartFactory.getChart(indicator.name).then(
        function(chart) {
          chart.chart.height = $('.full-view').height() - 100;
          $(selector).highcharts(chart);
        });
  }.bind(this));
};

/**
 * Remove an indicator from list.
 * @param indicator The indicator to remove.
 */
MyboardController.prototype.remove = function (indicator) {
  this.modal = {
    message: 'delete.confirm',
    ok: function() {
      var idx = this.indicators.indexOf(indicator);
      this.indicators.splice(idx, 1);
      this.dirty = true;
    }.bind(this)
  };
};

/**
 * Synchronize the jquery ui sortable elements with the angular indicators.
 * @param targetId Id of the moved indicator.
 * @private
 */
MyboardController.prototype.synchArrays_ = function(targetId) {
  var uiIds = [];
  var oldPos, newPos;

  $("#sortable .panel").each(function(idx, item) {
    var id = parseInt(item.id.substring(6, item.id.length));
    uiIds.push(id);
    if (id == targetId) {
      newPos = idx;
    }
  });

  this.indicators.some(function(indicator, idx) {
    if(indicator.id == targetId) {
      oldPos = idx;
      return true;
    }
  }.bind(this));
  this.indicators.move(oldPos, newPos);
  this.$scope.$apply();
};

/**
 * Render all highchart charts in their dedicated div.
 * @private
 */
MyboardController.prototype.renderGraphs_ = function() {
  this.$timeout(function(){
    this.indicators.forEach(function(board) {

      var selector = '#board_' + board.id + '_chart';
      this.ChartFactory.getChart(board.name).then(
          function(chart) {
            chart.chart.height = CHART_HEIGHT;
            $(selector).highcharts(chart);
          });
    }.bind(this));
  }.bind(this));
};

/**
 * Add indicators to your selection. The selection means the indicators
 * you gonna add to your dashboard.
 * @param indicator Indicator to add.
 */
MyboardController.prototype.selectToAdd = function(indicator) {

  var idx = this.indicatorsIdToAdd.indexOf(indicator.id);
  if(idx >= 0) {
    this.indicatorsToAdd.splice(idx, 1);
    this.indicatorsIdToAdd.splice(idx, 1);
  }
  else {
    this.indicatorsToAdd.push(indicator);
    this.indicatorsIdToAdd.push(indicator.id);
  }
};

/**
 * Reset indicators to add selection.
 */
MyboardController.prototype.cancelAdd = function() {
  this.indicatorsToAdd = [];
  this.indicatorsIdToAdd = [];
};

MyboardController.prototype.confirmAdd = function() {
  if(this.indicatorsToAdd.length) {
    this.indicators = this.indicators.concat(this.indicatorsToAdd);
    this.renderGraphs_();
    this.dirty = true;
  }
  this.cancelAdd();
};

var DashboardController = function ($scope) {
  this.config = localStorage.geodash || ['averagerain', 'dailyrain'];
  this.$scope = $scope;
  this.loadMyIndicators = function() {
  };
};



module.controller('DashboardController', DashboardController);
module.controller('MyboardController', MyboardController);

MyboardController.$inject = ['$timeout', 'Indicator', 'ChartFactory', '$scope'];
DashboardController.$inject = ['$scope'];
