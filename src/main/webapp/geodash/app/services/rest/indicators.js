angular.module('geodash').factory('Indicator',
  ['$resource', function($resource) {

    var url = '../app/data/:id/indicators.json';
    return $resource(url, { id: '@uid' }, {
      query: {
        cache   : false,
        method  : 'GET',
        isArray : true
      },
      get: {
        cache: false
      },
      update: {
        method: 'PUT'
      }
    });
  }]
);
