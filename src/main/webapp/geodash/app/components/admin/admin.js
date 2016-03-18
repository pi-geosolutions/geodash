
var AdminController = function($routeParams, $http, $location, Indicator) {

  this.$http = $http;

  this.indicators = Indicator.getAll(undefined, function() {
/*
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
*/
  }.bind(this));


/*
  console.log("toto");
  this.indicators = [{"id":1,"name":"toto","userid":1},{"id":2,"name":"tata","userid":1},{"id":3,"name":"tata","userid":1}];
*/

};

AdminController.prototype.save = function() {
  var form = {
    name: this.current.name,
    id: this.current.id,
    config: JSON.stringify(this.current.config)
  };

  this.$http({
    url : '/indicators/create/1/',
    method: 'POST',
    data: $.param(form),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
};

AdminController.prototype.initNew = function() {
  this.current = {
    name: '',
    config: {
      type: ''
    }
  };
};


angular.module('geodash')
    .controller('AdminController', [
      '$routeParams', '$http', '$location', 'Indicator', AdminController
    ]);
