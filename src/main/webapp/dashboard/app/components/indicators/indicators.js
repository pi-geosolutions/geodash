var module = angular.module('geodash');

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

module.component('gdMyboard', {
  bindings: {
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
var MyboardController = function ($scope, $timeout, $http, $q, Indicator,
                                  ChartFactory, appFlash) {
  this.$timeout = $timeout;
  this.ChartFactory = ChartFactory;
  this.$scope = $scope;
  this.appFlash = appFlash;

  this.indicatorsToAdd = [];
  this.indicatorsIdToAdd = [];

  this.parseCoordinates();
  if(!this.lon || !this.lat) {
    this.appFlash.create('danger', 'noparam.error');
    return;
  }


  let indicators_, remotes_;
  let promises_ = [], remotePromises_ = [];

  // retrieve all local indicators and remotes one
  // merge both arrays and filter on localStorage config
  promises_.push($http.get('../../indicators/').then(response => {
      indicators_ = response.data;
    }),
    $http.get('../../remotes/').then(response => {
      remotes_ = response.data;

      // feed remote indicator with their remote config
      remotes_.forEach(remote => {
        remote.rid = remote.id;
        remote.id = `${remote.url}##${remote.id}`;
        remotePromises_.push($http.get(`${remote.url}/indicators/${remote.rid}`)
          .then(response => {
            remote.rconfig = response.data.config;
            remote.rconfig.url = remote.url;
          }));
      });
    })
  );

  $q.all(promises_).then( response => {
    $q.all(remotePromises_).then(() => {
      this.allIndicators = indicators_.concat(remotes_);
      var myconfig = localStorage.geodash;
      if(myconfig) {
        myconfig = myconfig.split(',');
        this.indicators = new Array(myconfig.length);
        this.allIndicators.forEach(indicator => {
          var idx = myconfig.indexOf(''+indicator.id);
          if(idx >= 0) {
            this.indicators[idx] = indicator;
          }
        });
      }
      else {
        this.indicators = this.allIndicators;
      }
      this.renderGraphs_();
    });
  });

  // get All indicators from server and build dashboard from locaStorage
  /*
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
   */
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
  this.appFlash.create('success', 'board.saved.ok');
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
    this.appFlash.create('success', 'board.cancel.ok');
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
    var selector = '#board_zoom_' + (indicator.rid || indicator.id) + '_chart';
    this.ChartFactory.renderIndicator(
      indicator, selector, this.lon, this.lat, $('.full-view').height() - 100);
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
      this.appFlash.create('success', 'indicator.removed', {
        name: indicator.config.label || indicator.name
      });
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

      var selector = `#board_${board.rid || board.id}_chart`;
      this.ChartFactory.renderIndicator(board, selector, this.lon, this.lat);
    }.bind(this));
  }.bind(this));
};

MyboardController.prototype.renderGraph = function(indicator) {
    var selector = `#board_${indicator.rid || indicator.id}_chart`;
    this.ChartFactory.renderIndicator(indicator, selector, this.lon, this.lat);
};
MyboardController.prototype.renderGraphZoom = function(indicator) {
    var selector = `#board_zoom_${indicator.rid || indicator.id}_chart`;
    this.ChartFactory.renderIndicator(indicator, selector,
      this.lon, this.lat, $('.full-view').height() - 100);
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

MyboardController.prototype.parseCoordinates = function() {
  var query = location.search.substr(1);
  var p = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    p[item[0]] = decodeURIComponent(item[1]);
  });
  this.lon = parseFloat(p.lon);
  this.lat = parseFloat(p.lat);
};


MyboardController.prototype.isAvailable = function(indicator) {
  return !this.indicators.some(function(ind) {
    return indicator.name == ind.name;
  });
};


MyboardController.prototype.hasYear = function(indicator) {
  try {
    var c = indicator.config || indicator.rconfig;
    return c.datasources[0].pattern.indexOf('----') >= 0;
  }
  catch (e) {
    return false;
  }
};

/**
 * Main controller
 * @param $scope
 * @constructor
 */
var DashboardController = function ($scope) {
};



module.controller('DashboardController', DashboardController);
module.controller('MyboardController', MyboardController);

MyboardController.$inject = ['$scope', '$timeout', '$http', '$q',
  'Indicator', 'ChartFactory', 'appFlash'];
DashboardController.$inject = ['$scope'];

