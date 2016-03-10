angular.module('geodash').factory('Analytics',
  ['$resource', 'ANALYTICS_BASE_URI', function($resource, baseUri) {
    return $resource(baseUri + 'combinedRequests', {}, {
      query     : {
        method  : 'POST',
        cache   : true,
        isArray : false
      }
    });
  }]
);
