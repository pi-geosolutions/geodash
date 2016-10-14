var HarvestersController = function($routeParams, $http, $location, gdHarvesterResource) {

    this.$http = $http;

    this.list = gdHarvesterResource.list({}, function(){
        console.log(this.list);
    }.bind(this));
};

angular.module('geodash')
    .controller('HarvestersController', [
        '$routeParams',
        '$http',
        '$location',
        'gdHarvesterResource',
        HarvestersController
    ]);
