var module = angular.module('geodash');
angular.module('geodash')
    .service('gdUtils', [function() {


      this.aceStringify = function(obj) {
        return JSON.stringify(obj, null, 4);
      };

    }]);



