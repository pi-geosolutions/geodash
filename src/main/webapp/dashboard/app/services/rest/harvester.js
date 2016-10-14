angular.module('geodash').factory('gdHarvesterResource',
  ['$resource', function($resource) {

    var url = '../../harvester';
    return $resource(url, { id: '@uid' }, {
      list: {
        cache   : false,
        method  : 'GET',
        isArray : true
      },
      update: {
        method: 'PUT'
      }
    });
  }]
);
