var module = angular.module('geodash');

var SUFFIX_PATH = '/indicators/';

var RemotesController = function($http) {

  this.$http = $http;
  this.geodashUrl;
  this.selection = [];
  this.getAllRemotes();
  this.currentNode = {
    url: '',
    name: ''
  };
};

RemotesController.prototype.getIndicators = function() {
  this.$http.get(this.currentNode.url + SUFFIX_PATH).then(function(response){
    var indicators = response.data;
    this.indicators = indicators.filter(function(indicator) {
      return indicator.enabled;
    }).sort(function(a, b) {
      return a.config.label > b.config.label ? 1 : -1;
    });
    this.selection = [];
    this.initSelection();
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

  this.$http.delete('../../remotes/', {
    params: {
      url: this.currentNode.url
    }
  }).then(() => {
    list.forEach((ind) => {
      this.$http.post('../../remotes/' , {
        id: ind.id,
        name: ind.name,
        label: ind.config.label,
        url: this.currentNode.url,
        nodeLabel: this.currentNode.name
      }).then(function() {
        console.log('pushed');
      })
    });
  });
};

RemotesController.prototype.getAllRemotes = function() {
  this.$http.get('../../remotes/').then((response) => {
    this.localRemotes = response.data;
    this.nodes = this.localRemotes.reduce((distinctNodes, remote) => {
      if(!distinctNodes.some((node) => {
          return node.url == remote.url;
        })) {
        distinctNodes.push({
          url: remote.url,
          name: remote.nodeLabel
        });
      }
      return distinctNodes;
    }, [{
      url: 'http://dev.padre2.pigeo.fr/geodash',
      name: 'old - AFO'
    }], [{
      url: 'http://afo.pigeosolutions.fr/geodash',
      name: 'new - AFO'
    }]);
  });
};

RemotesController.prototype.initSelection = function() {
  this.indicators.forEach((indicator) => {
    if(this.localRemotes.some((remote) => {
        return indicator.id == remote.id &&
            remote.url == this.currentNode.url
      })) {
      this.selection.push(indicator.id);
    }
  });
};

RemotesController.prototype.onNodeChoose = function(node) {
  this.currentNode = node;
  this.getIndicators();
};

RemotesController.prototype.clearSelection = function() {
  this.selection = [];
};

module
  .controller('RemotesController', [
    '$http',
    RemotesController
  ]);

