var module = angular.module('geodash');
angular.module('geodash')
    .service('gdUtils', [function() {

      var MONTH_SHORT_FR = ['jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'juil', 'aou', 'sep', 'oct', 'nov', 'dec'];
      var getDay = function() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
      };

      var monthInYearAxisLabelFormatter = function() {
        var value = this.value;
        // "01" is Janv
        if(angular.isString(value)) {
          value = parseInt(value) -1;
        }
        // value is the number of the day in the year
        else {
          value = Math.round(value / 30.41);
        }
        return MONTH_SHORT_FR[value];
      };

      var periodFormatter = function() {
        return '<b>Début</b>: ' + this.point.low + '<sub>ème</sub> jours<br>' +
        '<b>Durée</b>: ' + (this.point.high - this.point.low) + ' jours';
      };

      var monthInYearAxisLabelPositioner = function() {
        var months = [0,1,2,3,4,5,6,7,8,9,10,11,12];
        return months.map(function(v) {
          return v*30.41;
        });
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



