angular.module('geodash').factory('Indicator',
  ['$resource', function($resource) {

    var url = '../app/data/:id/indicators.json';
    return $resource(url, { id: '@uid' }, {
      query: {
        cache   : false,
        method  : 'GET',
        isArray : true
      },
      getAll: {
        url: '../../indicators/',
        cache: false,
        isArray:true
      },
      update: {
        method: 'PUT'
      }
    });
  }]
);
