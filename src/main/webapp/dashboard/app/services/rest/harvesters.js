angular.module('geodash').factory('gdHarvesterResource',
  ['$resource', function($resource) {

    var url = '../../harvesters/:id';
    return $resource(url, { id: '@_id' }, {
      query: {
        cache   : false,
        method  : 'GET',
        isArray : true
      },
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    });
  }]
);
