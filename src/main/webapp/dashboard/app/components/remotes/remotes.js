var module = angular.module('geodash');

var SUFFIX_PATH = '/indicators/';

var RemotesController = function($http) {

  this.$http = $http;
  this.geodashUrl;
  this.selection = [];
};

RemotesController.prototype.getIndicators = function() {
  this.$http.get(this.geodashUrl + SUFFIX_PATH).then(function(response){
    this.selection = [];
    this.indicators = response.data;
  }.bind(this), function() {
    this.indicators = [];
    this.selection = [];
  }.bind(this));
};

RemotesController.prototype.select = function(id) {
  var idx = this.selection.indexOf(id);
  if(idx >= 0) {
    this.selection.splice(idx, 1);
  }
  else {
    this.selection.push(id);
  }
};

RemotesController.prototype.isSelected = function(id) {
  return this.selection.indexOf(id) >= 0;
};

RemotesController.prototype.join = function(id) {
  var list = this.indicators.filter(function(ind){
    return this.isSelected(ind.id);
  }.bind(this));

  list.forEach(function(ind) {
    this.$http.post('../../remotes/' , {
      id: ind.id,
      name: ind.name,
      url: this.geodashUrl,
      nodeLabel: this.nodeLabel
    }).then(function() {
      console.log('pushed');
    })
  }.bind(this));

};


module
  .controller('RemotesController', [
    '$http',
    RemotesController
  ]);

