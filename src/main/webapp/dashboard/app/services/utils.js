var module = angular.module('geodash');
angular.module('geodash')
    .service('gdUtils', [function() {

      var getDay = function() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
      };

      var monthInYearAxisLabelFormatter = function() {
        return this.value / 30;
      };

      var periodFormatter = function() {
        return '<b>Début</b>: ' + this.point.low + '<sub>ème</sub> jours<br>' +
        '<b>Durée</b>: ' + (this.point.high - this.point.low) + ' jours';
      };

      this.aceStringify = function(obj) {
        return JSON.stringify(obj, null, 4);
      };

      this.aceParse = function(string) {
        return JSON.parse(string, function(k, v) {
          if(angular.isString(v) && v.indexOf('$eval:') === 0) {
            var expr = v.substring(6, v.length);
            return eval(expr);
          }
          return v;
        });
      };

    }]);



